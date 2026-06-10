const { moduleCatalog, getModuleById } = require('../../utils/module-tests.js');

const RESULT_PREFIX = 'module_result_';

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function roundPercent(value, max) {
  if (!max) return 0;
  return Math.round((value / max) * 100);
}

function computeDimensionRows(module, answers) {
  const keys = module.dimensions.map((item) => item.key);
  const scores = {};
  const maxScores = {};

  keys.forEach((key) => {
    scores[key] = 0;
    maxScores[key] = 0;
  });

  module.questions.forEach((question, qIndex) => {
    keys.forEach((key) => {
      let localMax = 0;
      question.options.forEach((option) => {
        const score = Number((option.scores && option.scores[key]) || 0);
        if (score > localMax) localMax = score;
      });
      maxScores[key] += localMax;
    });

    const answerIdx = answers[qIndex];
    if (answerIdx !== 0 && answerIdx !== 1 && answerIdx !== 2) return;

    const option = question.options[answerIdx];
    keys.forEach((key) => {
      const gain = Number((option.scores && option.scores[key]) || 0);
      scores[key] += gain;
    });
  });

  return module.dimensions
    .map((item) => {
      const score = scores[item.key];
      const max = maxScores[item.key];
      return {
        key: item.key,
        label: item.label,
        score,
        max,
        percent: roundPercent(score, max)
      };
    })
    .sort((a, b) => b.percent - a.percent);
}

function getConfidenceLevel(gap) {
  if (gap >= 16) return '高';
  if (gap >= 7) return '中';
  return '混合';
}

function getConfidenceText(gap, topRow, secondRow) {
  if (gap >= 16) return '主导维度明显，结果画像比较集中，可以优先按主画像建议行动。';
  if (gap >= 7) return '主导维度清楚，但次高维度也会影响你的行为表现。';
  return '主次维度接近，更适合按混合画像理解，不要只贴单一标签。';
}

function getRowPercentMap(rows) {
  const map = {};
  rows.forEach((row) => {
    map[row.key] = Number(row.percent) || 0;
  });
  return map;
}

function computeExpressionPressure(rows) {
  const map = getRowPercentMap(rows);
  const inhibition = map.inhibition || 0;
  const guilt = map.guilt || 0;
  const anxiety = map.anxiety || 0;
  const norms = map.norms || 0;
  const release = map.release || 0;

  const riskAvg = (inhibition + guilt + anxiety + norms) / 4;
  const pressureIndex = clamp(Math.round(riskAvg * 0.75 + (100 - release) * 0.25), 0, 100);

  let pressureLevel = '低';
  let pressureHint = '你当前整体表达压力较低，表达和调节能力较为平衡。';
  if (pressureIndex >= 70) {
    pressureLevel = '高';
    pressureHint = '你当前表达压力负荷较高，建议优先做安全表达和低风险沟通练习。';
  } else if (pressureIndex >= 40) {
    pressureLevel = '中';
    pressureHint = '你有一定表达回避倾向，建议逐步提升表达与边界协商能力。';
  }

  return { pressureIndex, pressureLevel, pressureHint };
}

function buildAnalysisCards(topRow, secondRow, confidence, gap) {
  return [
    {
      label: '主导维度',
      value: topRow.label,
      detail: '当前占比 ' + topRow.percent + '%，是这次结果里最突出的倾向。'
    },
    {
      label: '次高维度',
      value: secondRow.label,
      detail: '当前占比 ' + secondRow.percent + '%，会影响你的具体表现方式。'
    },
    {
      label: '清晰度',
      value: confidence,
      detail: '主次差距 ' + gap + ' 分。' + getConfidenceText(gap, topRow, secondRow)
    }
  ];
}

function buildInsight(profile, topRow, secondRow, confidence, gap) {
  const lead = '你的结果不是单点标签，而是“' + topRow.label + ' + ' + secondRow.label + '”的组合。';
  if (confidence === '高') {
    return lead + '主导倾向足够明显，建议先围绕“' + profile.title + '”做一到两个具体行动实验。';
  }
  if (confidence === '中') {
    return lead + '主次维度同时存在，行动时需要兼顾效率和状态，不建议只按单一画像理解。';
  }
  return lead + '两个维度非常接近，说明你会随场景切换策略，建议结合最近一周的真实情境复盘。';
}

function buildSummary(module, profile, topRow, secondRow, confidence) {
  const cityVibe = profile.cityVibe && profile.cityVibe.length ? profile.cityVibe.join('、') : '多元场景';
  return module.title + '结果：你当前更偏向“' + profile.title + '”。主导维度为 ' + topRow.label + '（' + topRow.percent + '%），次高维度为 ' + secondRow.label + '（' + secondRow.percent + '%），判定清晰度为' + confidence + '。适配城市气质：' + cityVibe + '。';
}

function decorateModule(item, reason) {
  return {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    badge: item.badge,
    categoryLabel: item.categoryLabel,
    questionCount: item.questionCount,
    estimatedMinutes: item.estimatedMinutes,
    reason,
    entryUrl: '/pages/module-quiz/module-quiz?id=' + item.id
  };
}

function getNextModules(module) {
  const candidates = moduleCatalog.filter((item) => item.type === 'generic' && item.id !== module.id);
  const picked = [];

  candidates
    .filter((item) => item.categoryKey === module.categoryKey)
    .slice(0, 2)
    .forEach((item) => picked.push(decorateModule(item, '同主题延伸')));

  candidates
    .filter((item) => item.hotRank && !picked.some((pickedItem) => pickedItem.id === item.id))
    .sort((a, b) => Number(a.hotRank) - Number(b.hotRank))
    .slice(0, 3 - picked.length)
    .forEach((item) => picked.push(decorateModule(item, '热门补充')));

  return picked.slice(0, 3);
}

Page({
  data: {
    module: null,
    rows: [],
    profile: null,
    confidence: '中',
    confidenceText: '',
    analysisCards: [],
    insightText: '',
    nextModules: [],
    summary: '',
    submittedAtText: '',
    hasPressureIndex: false,
    pressureIndex: 0,
    pressureLevel: '低',
    pressureHint: ''
  },

  onLoad(query) {
    const moduleId = query.id || '';
    const module = getModuleById(moduleId);
    if (!module || module.type !== 'generic') {
      wx.showToast({ title: '模块不存在', icon: 'none' });
      setTimeout(() => wx.reLaunch({ url: '/pages/home/home' }), 300);
      return;
    }

    wx.setNavigationBarTitle({ title: module.title + '结果分析' });
    if (wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: false,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    }
    const payload = wx.getStorageSync(RESULT_PREFIX + moduleId);
    if (!payload || !Array.isArray(payload.answers)) {
      wx.showToast({ title: '未找到测试结果', icon: 'none' });
      setTimeout(() => {
        wx.redirectTo({ url: '/pages/module-quiz/module-quiz?id=' + moduleId });
      }, 300);
      return;
    }

    const rows = computeDimensionRows(module, payload.answers);
    const topRow = rows[0];
    const secondRow = rows[1] || rows[0];
    const profile = module.resultProfiles[topRow.key] || {
      title: '综合型',
      desc: '你的分布比较均衡，建议结合近期目标做阶段性策略。',
      tips: ['明确一个月内的主任务', '记录每周实际投入与状态变化'],
      cityVibe: ['均衡环境']
    };
    const gap = Math.max(0, topRow.percent - secondRow.percent);
    const confidence = getConfidenceLevel(gap);
    const confidenceText = getConfidenceText(gap, topRow, secondRow);
    const analysisCards = buildAnalysisCards(topRow, secondRow, confidence, gap);
    const insightText = buildInsight(profile, topRow, secondRow, confidence, gap);
    const summary = buildSummary(module, profile, topRow, secondRow, confidence);
    const submittedAtText = payload.submittedAt ? new Date(payload.submittedAt).toLocaleString() : '';
    const pressureResult = module.id === 'sri_repression_index' ? computeExpressionPressure(rows) : null;
    const nextModules = getNextModules(module);

    this.setData({
      module,
      rows,
      profile,
      confidence,
      confidenceText,
      analysisCards,
      insightText,
      nextModules,
      summary,
      submittedAtText,
      hasPressureIndex: !!pressureResult,
      pressureIndex: pressureResult ? pressureResult.pressureIndex : 0,
      pressureLevel: pressureResult ? pressureResult.pressureLevel : '低',
      pressureHint: pressureResult ? pressureResult.pressureHint : ''
    });
  },

  copySummary() {
    wx.setClipboardData({
      data: this.data.summary,
      success: () => {
        wx.showToast({ title: '已复制结果文案', icon: 'none' });
      }
    });
  },

  retake() {
    if (!this.data.module) return;
    wx.redirectTo({
      url: '/pages/module-quiz/module-quiz?id=' + this.data.module.id
    });
  },

  goHome() {
    wx.reLaunch({
      url: '/pages/home/home'
    });
  },

  onShareAppMessage() {
    const moduleTitle = this.data.module ? this.data.module.title : '人格测试结果';
    const profileTitle = this.data.profile ? this.data.profile.title : '综合型';
    const moduleId = this.data.module ? this.data.module.id : '';
    return {
      title: moduleTitle + '结果：' + profileTitle + '｜sbti人格趣味调侃',
      path: '/pages/module-quiz/module-quiz?id=' + moduleId
    };
  },

  onShareTimeline() {
    const moduleTitle = this.data.module ? this.data.module.title : '人格测试';
    const profileTitle = this.data.profile ? this.data.profile.title : '综合型';
    return {
      title: moduleTitle + '结果：' + profileTitle
    };
  }
});

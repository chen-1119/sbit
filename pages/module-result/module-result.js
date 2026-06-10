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

function buildScenarioCards(module, profile, topRow, secondRow, confidence) {
  const primaryTip = profile.tips && profile.tips.length ? profile.tips[0] : '先做一次低成本行动实验，再根据真实反馈调整。';
  return [
    {
      title: '朋友眼中的你',
      text: '别人更容易先感受到你的“' + topRow.label + '”：你会把注意力放在自己最在意的秩序、关系、目标或边界上。'
    },
    {
      title: '适合你的场景',
      text: '更适合能放大“' + profile.title + '”优势的环境，尤其是允许你稳定使用强项、同时不过度消耗次高维度的场景。'
    },
    {
      title: '避坑提醒',
      text: confidence === '混合' ? '主次维度接近时，不要急着给自己贴死标签；先看最近三次真实选择。' : primaryTip
    },
    {
      title: '组合关键词',
      text: topRow.label + '是主轴，' + secondRow.label + '是调味。结果更像一个行为配方，而不是固定人设。'
    }
  ];
}

function buildCityMatches(module, profile, topRow) {
  const categoryPresets = {
    career: [
      { name: '深圳', reason: '机会密度高，适合目标感和成长压力都较强的人。' },
      { name: '上海', reason: '行业分工细，适合专业化、资源连接和结果导向。' },
      { name: '杭州', reason: '商业与生活平衡感较强，适合长期成长型节奏。' }
    ],
    relationship: [
      { name: '成都', reason: '生活氛围松弛，适合重视关系温度和情绪舒展的人。' },
      { name: '南京', reason: '节奏稳定、文化感强，适合需要安全感和边界感的人。' },
      { name: '厦门', reason: '社交压力较轻，适合慢热、重体验和重空间的人。' }
    ],
    intimacy: [
      { name: '成都', reason: '关系氛围温和，适合练习舒展表达和低压沟通。' },
      { name: '杭州', reason: '秩序与开放并存，适合边界清楚又愿意协商的人。' },
      { name: '厦门', reason: '节奏轻，适合需要空间和稳定感的人。' }
    ],
    social: [
      { name: '广州', reason: '人情流动自然，适合沟通、协作和现实解决问题。' },
      { name: '重庆', reason: '互动感强，适合表达直接、情绪能量足的人。' },
      { name: '长沙', reason: '社交氛围活跃，适合需要反馈和热闹场域的人。' }
    ],
    growth: [
      { name: '杭州', reason: '资源密度和生活感兼具，适合学习成长与长期积累。' },
      { name: '苏州', reason: '秩序稳定，适合计划推进和复盘沉淀。' },
      { name: '北京', reason: '知识密度高，适合强输入、强目标和高标准挑战。' }
    ],
    resilience: [
      { name: '昆明', reason: '节奏舒展，适合恢复能量和重建生活秩序。' },
      { name: '成都', reason: '松弛感强，适合降低长期紧绷。' },
      { name: '大理', reason: '自然空间足，适合重启和自我整理。' }
    ],
    fun: [
      { name: '哈尔滨', reason: '季节感和故事感强，适合有趣、反差和氛围体验。' },
      { name: '重庆', reason: '层次丰富、情绪热烈，适合戏剧化人格表达。' },
      { name: '青岛', reason: '海边秩序感强，适合轻松但不散乱的生活节奏。' }
    ]
  };

  const fallback = [
    { name: '上海', reason: '适合高目标、快反馈和强资源连接。' },
    { name: '成都', reason: '适合重视关系温度和生活质量。' },
    { name: '杭州', reason: '适合成长、审美和长期主义并重。' }
  ];
  const base = categoryPresets[module.categoryKey] || fallback;
  return base.map((item) => ({
    name: item.name,
    reason: item.reason + '你的主导维度是“' + topRow.label + '”，匹配逻辑来自测试分类与城市气质。'
  }));
}

function buildShareHook(module, profile, topRow) {
  return '可以把结果发给朋友，让对方验证一句话：我是不是更像“' + profile.title + '”，以及“' + topRow.label + '”是不是我最明显的行为底色。';
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
    scenarioCards: [],
    cityMatches: [],
    shareHook: '',
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
    const scenarioCards = buildScenarioCards(module, profile, topRow, secondRow, confidence);
    const cityMatches = buildCityMatches(module, profile, topRow);
    const shareHook = buildShareHook(module, profile, topRow);
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
      scenarioCards,
      cityMatches,
      shareHook,
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

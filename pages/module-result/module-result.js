const { getModuleById } = require('../../utils/module-tests.js');

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

function getRowPercentMap(rows) {
  const map = {};
  rows.forEach((row) => {
    map[row.key] = Number(row.percent) || 0;
  });
  return map;
}

function computeSRI(rows) {
  const map = getRowPercentMap(rows);
  const inhibition = map.inhibition || 0;
  const guilt = map.guilt || 0;
  const anxiety = map.anxiety || 0;
  const norms = map.norms || 0;
  const release = map.release || 0;

  const riskAvg = (inhibition + guilt + anxiety + norms) / 4;
  const sriIndex = clamp(Math.round(riskAvg * 0.75 + (100 - release) * 0.25), 0, 100);

  let sriLevel = '低';
  let sriHint = '你当前整体压抑倾向较低，表达和调节能力较为平衡。';
  if (sriIndex >= 70) {
    sriLevel = '高';
    sriHint = '你当前压抑负荷较高，建议优先做安全表达和低风险沟通练习。';
  } else if (sriIndex >= 40) {
    sriLevel = '中';
    sriHint = '你有一定压抑与回避倾向，建议逐步提升表达与边界协商能力。';
  }

  return { sriIndex, sriLevel, sriHint };
}

function buildSummary(module, profile, topRow, secondRow) {
  const cityVibe = profile.cityVibe && profile.cityVibe.length ? profile.cityVibe.join('、') : '多元场景';
  return `${module.title}结果：你当前更偏向“${profile.title}”。主导维度为 ${topRow.label}（${topRow.percent}%），次高维度为 ${secondRow.label}（${secondRow.percent}%）。适配城市气质：${cityVibe}。`;
}

Page({
  data: {
    module: null,
    rows: [],
    profile: null,
    confidence: '中',
    summary: '',
    submittedAtText: '',
    hasSRI: false,
    sriIndex: 0,
    sriLevel: '低',
    sriHint: ''
  },

  onLoad(query) {
    const moduleId = query.id || '';
    const module = getModuleById(moduleId);
    if (!module || module.type !== 'generic') {
      wx.showToast({ title: '模块不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack({ delta: 1 }), 300);
      return;
    }

    wx.setNavigationBarTitle({ title: module.title + '结果' });
    const payload = wx.getStorageSync(RESULT_PREFIX + moduleId);
    if (!payload || !Array.isArray(payload.answers)) {
      wx.showToast({ title: '未找到测试结果', icon: 'none' });
      setTimeout(() => wx.navigateBack({ delta: 1 }), 300);
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
    const confidence = getConfidenceLevel(topRow.percent - secondRow.percent);
    const summary = buildSummary(module, profile, topRow, secondRow);
    const submittedAtText = payload.submittedAt ? new Date(payload.submittedAt).toLocaleString() : '';
    const sri = module.id === 'sri_repression_index' ? computeSRI(rows) : null;

    this.setData({
      module,
      rows,
      profile,
      confidence,
      summary,
      submittedAtText,
      hasSRI: !!sri,
      sriIndex: sri ? sri.sriIndex : 0,
      sriLevel: sri ? sri.sriLevel : '低',
      sriHint: sri ? sri.sriHint : ''
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
      url: `/pages/module-quiz/module-quiz?id=${this.data.module.id}`
    });
  },

  goHome() {
    wx.reLaunch({
      url: '/pages/home/home'
    });
  },

  onShareAppMessage() {
    const moduleTitle = this.data.module ? this.data.module.title : '测试结果';
    const profileTitle = this.data.profile ? this.data.profile.title : '综合型';
    return {
      title: `${moduleTitle}：${profileTitle}`,
      path: '/pages/home/home'
    };
  }
});

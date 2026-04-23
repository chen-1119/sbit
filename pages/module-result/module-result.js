const { getModuleById } = require('../../utils/module-tests.js');

const RESULT_PREFIX = 'module_result_';

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
    submittedAtText: ''
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

    this.setData({
      module,
      rows,
      profile,
      confidence,
      summary,
      submittedAtText
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

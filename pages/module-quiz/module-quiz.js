const { getModuleById } = require('../../utils/module-tests.js');

const PROGRESS_PREFIX = 'module_progress_';
const RESULT_PREFIX = 'module_result_';

function getProgressPercent(currentQ, total) {
  return Math.round(((currentQ + 1) / total) * 100);
}

function getEtaText(currentQ, total) {
  const remain = total - (currentQ + 1);
  const remainSeconds = remain * 7;
  if (remainSeconds <= 30) return '预计不到 1 分钟';
  return `预计剩余 ${Math.ceil(remainSeconds / 60)} 分钟`;
}

function normalizeProgress(saved, total) {
  if (!saved || !Array.isArray(saved.answers) || saved.answers.length !== total) return null;

  const answers = saved.answers.map((item) => {
    if (item === 0 || item === 1 || item === 2) return item;
    return null;
  });

  return {
    currentQ: Math.max(0, Math.min(total - 1, Number(saved.currentQ) || 0)),
    answers
  };
}

Page({
  data: {
    moduleId: '',
    module: null,
    questions: [],
    letters: ['A', 'B', 'C'],
    currentQ: 0,
    selectedIdx: -1,
    answers: [],
    progressPercent: 0,
    etaText: '',
    showWarning: false
  },

  onLoad(query) {
    const moduleId = query.id || '';
    const module = getModuleById(moduleId);
    if (!module || module.type !== 'generic') {
      wx.showToast({ title: '模块不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack({ delta: 1 }), 300);
      return;
    }

    const init = () => this.initModule(moduleId, module);
    if (module.adultOnly) {
      wx.showModal({
        title: '18+ 内容提示',
        content: '该模块仅供成年人自我观察，结果不用于医学或临床诊断。确认继续吗？',
        confirmText: '继续',
        cancelText: '返回',
        success: (res) => {
          if (res.confirm) {
            init();
          } else {
            setTimeout(() => wx.navigateBack({ delta: 1 }), 200);
          }
        }
      });
      return;
    }

    init();
  },

  initModule(moduleId, module) {
    wx.setNavigationBarTitle({ title: module.title });
    if (wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: false,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    }

    const total = module.questions.length;
    const emptyAnswers = new Array(total).fill(null);
    this.setData({
      moduleId,
      module,
      questions: module.questions,
      answers: emptyAnswers,
      currentQ: 0,
      selectedIdx: -1,
      progressPercent: getProgressPercent(0, total),
      etaText: getEtaText(0, total)
    });

    const saved = normalizeProgress(wx.getStorageSync(PROGRESS_PREFIX + moduleId), total);
    if (!saved) return;

    const answeredCount = saved.answers.filter((item) => item !== null).length;
    if (!answeredCount) return;

    wx.showModal({
      title: '检测到上次进度',
      content: `已完成 ${answeredCount}/${total} 题，是否继续？`,
      confirmText: '继续',
      cancelText: '重置',
      success: (res) => {
        if (res.confirm) {
          this.resumeSaved(saved);
        } else {
          this.persistProgress(0, emptyAnswers);
        }
      }
    });
  },

  resumeSaved(saved) {
    const total = this.data.questions.length;
    const selectedIdx = saved.answers[saved.currentQ] !== null ? saved.answers[saved.currentQ] : -1;
    this.setData({
      currentQ: saved.currentQ,
      answers: saved.answers,
      selectedIdx,
      progressPercent: getProgressPercent(saved.currentQ, total),
      etaText: getEtaText(saved.currentQ, total),
      showWarning: false
    });
  },

  persistProgress(currentQ, answers) {
    wx.setStorageSync(PROGRESS_PREFIX + this.data.moduleId, {
      currentQ,
      answers,
      updatedAt: Date.now()
    });
  },

  selectOption(e) {
    const idx = e.currentTarget.dataset.idx;
    const currentQ = this.data.currentQ;
    const answers = [...this.data.answers];
    answers[currentQ] = idx;

    this.setData({
      selectedIdx: idx,
      answers,
      showWarning: false
    });
    this.persistProgress(currentQ, answers);

    setTimeout(() => {
      if (this.data.currentQ < this.data.questions.length - 1) {
        this.nextQuestion();
      } else {
        this.submitResult();
      }
    }, 220);
  },

  nextQuestion() {
    if (this.data.selectedIdx === -1) {
      this.setData({ showWarning: true });
      return;
    }

    const total = this.data.questions.length;
    if (this.data.currentQ < total - 1) {
      const nextQ = this.data.currentQ + 1;
      this.setData({
        currentQ: nextQ,
        selectedIdx: this.data.answers[nextQ] !== null ? this.data.answers[nextQ] : -1,
        progressPercent: getProgressPercent(nextQ, total),
        etaText: getEtaText(nextQ, total),
        showWarning: false
      });
      this.persistProgress(nextQ, this.data.answers);
      return;
    }

    this.submitResult();
  },

  prevQuestion() {
    if (this.data.currentQ <= 0) return;
    const total = this.data.questions.length;
    const prevQ = this.data.currentQ - 1;
    this.setData({
      currentQ: prevQ,
      selectedIdx: this.data.answers[prevQ] !== null ? this.data.answers[prevQ] : -1,
      progressPercent: getProgressPercent(prevQ, total),
      etaText: getEtaText(prevQ, total),
      showWarning: false
    });
    this.persistProgress(prevQ, this.data.answers);
  },

  submitResult() {
    if (this.data.selectedIdx === -1) {
      this.setData({ showWarning: true });
      return;
    }

    const payload = {
      moduleId: this.data.moduleId,
      answers: this.data.answers,
      submittedAt: Date.now()
    };
    wx.setStorageSync(RESULT_PREFIX + this.data.moduleId, payload);
    wx.removeStorageSync(PROGRESS_PREFIX + this.data.moduleId);

    wx.navigateTo({
      url: `/pages/module-result/module-result?id=${this.data.moduleId}`
    });
  },

  onUnload() {
    if (!this.data.moduleId || !this.data.questions.length) return;
    this.persistProgress(this.data.currentQ, this.data.answers);
  },

  onShareAppMessage() {
    const title = this.data.module ? this.data.module.title : 'SBTI 测试模块';
    const moduleId = this.data.moduleId || '';
    return {
      title: `一起测：${title}`,
      path: `/pages/module-quiz/module-quiz?id=${moduleId}`
    };
  },

  onShareTimeline() {
    const title = this.data.module ? this.data.module.title : 'SBTI 测试模块';
    return {
      title: `SBTI 模块测评：${title}`
    };
  }
});

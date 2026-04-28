const {
  questions,
  sbtiQuestionCount,
  mbtiQuestionCount,
  totalQuestionCount
} = require('../../utils/questions.js');

const PROGRESS_KEY = 'sbti_progress_v3';

function getEmptyAnswers() {
  return new Array(totalQuestionCount).fill(null);
}

function getProgressPercent(currentQ) {
  return Math.round(((currentQ + 1) / totalQuestionCount) * 100);
}

function getRemainingText(currentQ) {
  const remainQuestions = totalQuestionCount - (currentQ + 1);
  const remainSeconds = remainQuestions * 8;
  if (remainSeconds <= 30) return '预计不到 1 分钟';
  return `预计剩余 ${Math.ceil(remainSeconds / 60)} 分钟`;
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${month}-${day} ${hour}:${minute}`;
}

function normalizeSavedProgress(saved) {
  if (!saved || !Array.isArray(saved.answers)) return null;
  if (saved.answers.length !== totalQuestionCount) return null;

  const answers = saved.answers.map((item) => {
    if (item === 0 || item === 1 || item === 2) return item;
    return null;
  });

  const currentQ = Math.max(0, Math.min(totalQuestionCount - 1, Number(saved.currentQ) || 0));
  return {
    currentQ,
    answers,
    updatedAt: Number(saved.updatedAt) || 0
  };
}

Page({
  data: {
    showPage: 'welcome',
    questions,
    letters: ['A', 'B', 'C'],
    currentQ: 0,
    selectedIdx: -1,
    answers: getEmptyAnswers(),
    showWarning: false,
    progressPercent: getProgressPercent(0),
    estimatedText: getRemainingText(0),
    sbtiQuestionCount,
    mbtiQuestionCount,
    totalQuestionCount,
    welcomeTags: ['SBTI 核心画像', 'MBTI 补充维度', '城市匹配建议'],
    flowSteps: ['快速热身', '核心维度', 'MBTI 加测', '结果与城市推荐'],
    hasSavedProgress: false,
    savedProgressText: ''
  },

  onShow() {
    if (wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: false,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    }
    this.refreshSavedProgressInfo();
  },

  refreshSavedProgressInfo() {
    const normalized = normalizeSavedProgress(wx.getStorageSync(PROGRESS_KEY));
    if (!normalized) {
      this.setData({ hasSavedProgress: false, savedProgressText: '' });
      return;
    }

    const answeredCount = normalized.answers.filter((item) => item !== null).length;
    if (answeredCount === 0) {
      this.setData({ hasSavedProgress: false, savedProgressText: '' });
      return;
    }

    this.setData({
      hasSavedProgress: true,
      savedProgressText: `已完成 ${answeredCount}/${totalQuestionCount} 题 · 上次 ${formatTime(normalized.updatedAt)}`
    });
  },

  startTest() {
    if (this.data.hasSavedProgress) {
      wx.showModal({
        title: '检测到上次进度',
        content: '你可以继续上次测试，或重新开始。',
        confirmText: '重新开始',
        cancelText: '继续上次',
        success: (res) => {
          if (res.confirm) {
            this.startFreshTest();
          } else {
            this.resumeTest();
          }
        }
      });
      return;
    }

    this.startFreshTest();
  },

  startFreshTest() {
    const answers = getEmptyAnswers();
    this.setData({
      showPage: 'test',
      currentQ: 0,
      selectedIdx: -1,
      answers,
      progressPercent: getProgressPercent(0),
      estimatedText: getRemainingText(0),
      showWarning: false
    });

    this.persistProgress(0, answers);
  },

  resumeTest() {
    const normalized = normalizeSavedProgress(wx.getStorageSync(PROGRESS_KEY));
    if (!normalized) {
      this.startFreshTest();
      return;
    }

    const selectedIdx = normalized.answers[normalized.currentQ] !== null ? normalized.answers[normalized.currentQ] : -1;

    this.setData({
      showPage: 'test',
      currentQ: normalized.currentQ,
      selectedIdx,
      answers: normalized.answers,
      progressPercent: getProgressPercent(normalized.currentQ),
      estimatedText: getRemainingText(normalized.currentQ),
      showWarning: false
    });
  },

  clearSavedProgress() {
    wx.removeStorageSync(PROGRESS_KEY);
    this.setData({ hasSavedProgress: false, savedProgressText: '' });
    wx.showToast({ title: '已清除上次进度', icon: 'none' });
  },

  persistProgress(currentQ, answers) {
    wx.setStorageSync(PROGRESS_KEY, {
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
      if (this.data.currentQ < totalQuestionCount - 1) {
        this.nextQuestion();
      } else {
        this.goResult();
      }
    }, 220);
  },

  nextQuestion() {
    if (this.data.selectedIdx === -1) {
      this.setData({ showWarning: true });
      return;
    }

    if (this.data.currentQ < totalQuestionCount - 1) {
      const nextQ = this.data.currentQ + 1;
      this.setData({
        currentQ: nextQ,
        selectedIdx: this.data.answers[nextQ] !== null ? this.data.answers[nextQ] : -1,
        progressPercent: getProgressPercent(nextQ),
        estimatedText: getRemainingText(nextQ),
        showWarning: false
      });

      this.persistProgress(nextQ, this.data.answers);
    } else {
      this.goResult();
    }
  },

  prevQuestion() {
    if (this.data.currentQ > 0) {
      const prevQ = this.data.currentQ - 1;
      this.setData({
        currentQ: prevQ,
        selectedIdx: this.data.answers[prevQ] !== null ? this.data.answers[prevQ] : -1,
        progressPercent: getProgressPercent(prevQ),
        estimatedText: getRemainingText(prevQ),
        showWarning: false
      });

      this.persistProgress(prevQ, this.data.answers);
    }
  },

  goResult() {
    if (this.data.selectedIdx === -1) {
      this.setData({ showWarning: true });
      return;
    }

    wx.setStorageSync('sbti_answers', this.data.answers);
    wx.removeStorageSync(PROGRESS_KEY);
    this.setData({ hasSavedProgress: false, savedProgressText: '' });
    this._skipPersistOnUnload = true;

    wx.navigateTo({ url: '/pages/result/result' });
  },

  onUnload() {
    if (this._skipPersistOnUnload) {
      this._skipPersistOnUnload = false;
      return;
    }

    if (this.data.showPage === 'test') {
      this.persistProgress(this.data.currentQ, this.data.answers);
    }
  },

  onShareAppMessage() {
    return {
      title: '来测测你的 SBTI 人格画像',
      path: '/pages/index/index'
    };
  },

  onShareTimeline() {
    return {
      title: 'SBTI 人格实验室：43题深度主测'
    };
  }
});

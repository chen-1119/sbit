const { moduleCatalog } = require('../../utils/module-tests.js');

function buildCategories(modules) {
  const map = {};
  modules.forEach((item) => {
    if (!item.categoryKey || !item.categoryLabel) return;
    map[item.categoryKey] = item.categoryLabel;
  });
  const list = Object.keys(map).map((key) => ({ key, label: map[key] }));
  list.sort((a, b) => {
    if (a.label === b.label) return 0;
    return a.label > b.label ? 1 : -1;
  });
  return [{ key: 'all', label: '全部' }, ...list];
}

function filterModules(modules, categoryKey) {
  if (categoryKey === 'all') return modules;
  return modules.filter((item) => item.categoryKey === categoryKey);
}

function getStats(allModules) {
  const moduleCount = allModules.length;
  const questionCount = allModules.reduce((sum, item) => sum + (item.questionCount || 0), 0);
  const totalMinutes = allModules.reduce((sum, item) => sum + (item.estimatedMinutes || 0), 0);
  return { moduleCount, questionCount, totalMinutes };
}

Page({
  data: {
    featured: null,
    allModules: [],
    filteredModules: [],
    categories: [],
    activeCategory: 'all',
    stats: {
      moduleCount: 0,
      questionCount: 0,
      totalMinutes: 0
    },
    tags: ['人格', '职业', '沟通', '韧性', '城市'],
    introPoints: [
      '可单独测，也可组合连续测，逐步拼出你的全景画像。',
      '每个模块都支持断点续测，结果页可复制和分享。',
      '主测与轻量测联动，形成“人格 x 城市 x 发展策略”建议。'
    ]
  },

  onLoad() {
    const [featured, ...rest] = moduleCatalog;
    const categories = buildCategories(rest);
    const stats = getStats(moduleCatalog);
    const activeCategory = 'all';

    this.setData({
      featured: featured || null,
      allModules: rest,
      filteredModules: filterModules(rest, activeCategory),
      categories,
      activeCategory,
      stats
    });
  },

  onCategoryChange(e) {
    const key = e.currentTarget.dataset.key;
    if (!key || key === this.data.activeCategory) return;
    this.setData({
      activeCategory: key,
      filteredModules: filterModules(this.data.allModules, key)
    });
  },

  openModule(e) {
    const id = e.currentTarget.dataset.id;
    const target = moduleCatalog.find((item) => item.id === id);
    if (!target) return;

    if (target.type === 'native') {
      wx.navigateTo({ url: target.page });
      return;
    }

    wx.navigateTo({
      url: `/pages/module-quiz/module-quiz?id=${target.id}`
    });
  }
});

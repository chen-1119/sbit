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

function buildSections(modules) {
  const map = {};
  modules.forEach((item) => {
    const key = item.categoryKey || 'other';
    const label = item.categoryLabel || '其他';
    if (!map[key]) {
      map[key] = {
        key,
        label,
        modules: [],
        count: 0,
        adultCount: 0
      };
    }
    map[key].modules.push(item);
    map[key].count += 1;
    if (item.adultOnly) map[key].adultCount += 1;
  });

  const sections = Object.keys(map).map((key) => map[key]);
  sections.sort((a, b) => {
    if (a.label === b.label) return 0;
    return a.label > b.label ? 1 : -1;
  });

  sections.forEach((section) => {
    section.modules.sort((a, b) => {
      const aScore = Number(a.questionCount || 0);
      const bScore = Number(b.questionCount || 0);
      return bScore - aScore;
    });
  });

  return sections;
}

Page({
  data: {
    featured: null,
    allModules: [],
    filteredModules: [],
    sectionedModules: [],
    categories: [],
    activeCategory: 'all',
    stats: {
      moduleCount: 0,
      questionCount: 0,
      totalMinutes: 0
    },
    tags: ['人格', '职业', '沟通', '韧性', '关系', '城市'],
    introPoints: [
      '可单独测，也可组合连续测，逐步拼出你的全景画像。',
      '每个模块都支持断点续测，结果页可复制和分享。',
      '主测与轻量测联动，形成“人格 x 城市 x 发展策略”建议。',
      '成人关系主题为 18+ 自我观察内容，不用于医学或临床诊断。'
    ]
  },

  onLoad() {
    const [featured, ...rest] = moduleCatalog;
    const categories = buildCategories(rest);
    const stats = getStats(moduleCatalog);
    const activeCategory = 'all';
    const sectionedModules = buildSections(rest);

    this.setData({
      featured: featured || null,
      allModules: rest,
      filteredModules: filterModules(rest, activeCategory),
      sectionedModules,
      categories,
      activeCategory,
      stats
    });
  },

  onCategoryChange(e) {
    const key = e.currentTarget.dataset.key;
    if (!key || key === this.data.activeCategory) return;

    const filteredModules = filterModules(this.data.allModules, key);
    const sectionedModules = key === 'all' ? buildSections(this.data.allModules) : [];
    this.setData({
      activeCategory: key,
      filteredModules,
      sectionedModules
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

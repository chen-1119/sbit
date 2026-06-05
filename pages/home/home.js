const { moduleCatalog } = require('../../utils/module-tests.js');

const CATEGORY_ORDER = ['market_hot', 'mbti', 'career', 'social', 'strategy', 'resilience', 'moose', 'intimacy', 'core'];

function getCategoryWeight(key) {
  const index = CATEGORY_ORDER.indexOf(key);
  return index === -1 ? 99 : index;
}

function buildCategories(modules) {
  const map = {};
  modules.forEach((item) => {
    if (!item.categoryKey || !item.categoryLabel) return;
    map[item.categoryKey] = item.categoryLabel;
  });

  const list = Object.keys(map).map((key) => ({ key, label: map[key] }));
  list.sort((a, b) => {
    const diff = getCategoryWeight(a.key) - getCategoryWeight(b.key);
    if (diff) return diff;
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
  const genericCount = allModules.filter((item) => item.type === 'generic').length;
  const questionCount = allModules.reduce((sum, item) => sum + (item.questionCount || 0), 0);
  const totalMinutes = allModules.reduce((sum, item) => sum + (item.estimatedMinutes || 0), 0);
  const hotCount = allModules.filter((item) => item.hotRank).length;
  return { moduleCount, genericCount, questionCount, totalMinutes, hotCount };
}

function getHotModules(modules) {
  return modules
    .filter((item) => item.hotRank)
    .sort((a, b) => Number(a.hotRank) - Number(b.hotRank));
}

function buildSections(modules) {
  const map = {};
  modules.forEach((item) => {
    const key = item.categoryKey || 'other';
    const label = item.categoryLabel || '其它';
    if (!map[key]) {
      map[key] = {
        key,
        label,
        modules: [],
        count: 0,
        questionCount: 0
      };
    }
    map[key].modules.push(item);
    map[key].count += 1;
    map[key].questionCount += Number(item.questionCount || 0);
  });

  const sections = Object.keys(map).map((key) => map[key]);
  sections.sort((a, b) => {
    const diff = getCategoryWeight(a.key) - getCategoryWeight(b.key);
    if (diff) return diff;
    return a.label > b.label ? 1 : -1;
  });

  sections.forEach((section) => {
    section.modules.sort((a, b) => {
      const hotDiff = Number(a.hotRank || 99) - Number(b.hotRank || 99);
      if (hotDiff) return hotDiff;
      return Number(b.questionCount || 0) - Number(a.questionCount || 0);
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
    hotModules: [],
    categories: [],
    activeCategory: 'all',
    stats: {
      moduleCount: 0,
      genericCount: 0,
      questionCount: 0,
      totalMinutes: 0,
      hotCount: 0
    },
    frameworkTags: ['MBTI/16型', 'Big Five', 'DISC', '九型人格', 'RIASEC', '爱之语言', 'EQ', '麋鹿趣味'],
    introPoints: [
      '热门框架只借鉴维度结构，不复制任何商业量表原题；题目均为二创场景题。',
      '每个通用模块保持 30-50 题，适合碎片时间连续测试。',
      '结果页可复制、可分享，适合做朋友间的趣味对照。',
      '所有结果仅用于自我观察和娱乐参考，不做医学、临床或职业决策诊断。'
    ]
  },

  onLoad() {
    const [featured, ...rest] = moduleCatalog;
    const categories = buildCategories(rest);
    const stats = getStats(moduleCatalog);
    const activeCategory = 'all';
    const sectionedModules = buildSections(rest);
    const hotModules = getHotModules(rest);

    this.setData({
      featured: featured || null,
      allModules: rest,
      filteredModules: filterModules(rest, activeCategory),
      sectionedModules,
      hotModules,
      categories,
      activeCategory,
      stats
    });

    if (wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: false,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    }
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
  },

  onShareAppMessage() {
    return {
      title: 'sbti人格趣味调侃：热门人格测试合集',
      path: '/pages/home/home'
    };
  },

  onShareTimeline() {
    return {
      title: 'sbti人格趣味调侃：人格 x 职业 x 关系 x 城市'
    };
  }
});

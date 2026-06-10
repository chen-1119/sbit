const { moduleCatalog } = require('../../utils/module-tests.js');

const CATEGORY_ORDER = ['market_hot', 'mbti', 'career', 'social', 'strategy', 'resilience', 'moose', 'intimacy', 'core'];

const SEARCH_KEYWORDS = [
  '人格测试', 'MBTI测试', 'SBTI人格', 'DISC测试', '九型人格', '大五人格',
  '霍兰德职业兴趣', '爱之语言', 'EQ情绪能力', '麋鹿测试', '职业性格测试', '恋爱关系测试'
];

const TRACK_CONFIG = [
  {
    key: 'self',
    title: '自我认知路径',
    desc: '先看性格底色，再看动机和稳定特征。',
    moduleIds: ['mbti_quick', 'big5_lite', 'enneagram_motive']
  },
  {
    key: 'career',
    title: '职业方向路径',
    desc: '适合想看岗位偏好、职业兴趣和决策风格。',
    moduleIds: ['riasec_career_map', 'work_drive', 'decision_style']
  },
  {
    key: 'relationship',
    title: '关系沟通路径',
    desc: '适合观察关系表达、沟通模式和亲密偏好。',
    moduleIds: ['love_language_daily', 'communication_mode', 'milu_intimacy_pref']
  },
  {
    key: 'team',
    title: '社交协作路径',
    desc: '适合看团队协作、情绪能力和职场配合方式。',
    moduleIds: ['disc_profile', 'eq_social_power', 'mbti_workstyle']
  }
];

const NEXT_TEST_IDEAS = [
  { title: '依恋风格测试', keyword: '关系安全感', desc: '建议新增安全型、焦虑型、回避型、混合型四类关系安全感观察。' },
  { title: '职业价值观测试', keyword: '工作价值排序', desc: '建议新增收入、自由、稳定、成长、影响力、生活平衡等价值排序。' },
  { title: '学习行动力测试', keyword: '学习风格', desc: '建议新增输入方式、执行节奏、反馈偏好和拖延触发点分析。' },
  { title: '社交边界感测试', keyword: '边界与能量', desc: '建议新增社交能量、拒绝能力、关系负荷和恢复方式观察。' }
];

function getCategoryWeight(key) {
  const index = CATEGORY_ORDER.indexOf(key);
  return index === -1 ? 99 : index;
}

function getEntryUrl(item) {
  if (!item) return '';
  return item.type === 'native' ? item.page : '/pages/module-quiz/module-quiz?id=' + item.id;
}

function decorateModule(item) {
  return Object.assign({}, item, {
    entryUrl: getEntryUrl(item)
  });
}

function buildModuleMap(modules) {
  const map = {};
  modules.forEach((item) => {
    map[item.id] = item;
  });
  return map;
}

function buildJourneyTracks(moduleMap) {
  return TRACK_CONFIG.map((track) => Object.assign({}, track, {
    modules: track.moduleIds.map((id) => moduleMap[id]).filter(Boolean)
  })).filter((track) => track.modules.length);
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
    journeyTracks: [],
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
    searchKeywords: SEARCH_KEYWORDS,
    nextTestIdeas: NEXT_TEST_IDEAS,
    introPoints: [
      '热门框架只借鉴维度结构，不复制任何商业量表原题；题目均为二创场景题。',
      '每个通用模块保持 30-50 题，适合碎片时间连续测试。',
      '结果页可复制、可分享，适合做朋友间的趣味对照。',
      '所有结果仅用于自我观察和娱乐参考，不做医学、临床或职业决策诊断。'
    ]
  },

  onLoad() {
    const decorated = moduleCatalog.map((item) => decorateModule(item));
    const [featured, ...rest] = decorated;
    const moduleMap = buildModuleMap(decorated);
    const categories = buildCategories(rest);
    const stats = getStats(decorated);
    const activeCategory = 'all';
    const sectionedModules = buildSections(rest);
    const hotModules = getHotModules(rest);
    const journeyTracks = buildJourneyTracks(moduleMap);

    wx.setNavigationBarTitle({ title: '人格测试合集' });
    this.setData({
      featured: featured || null,
      allModules: rest,
      filteredModules: filterModules(rest, activeCategory),
      sectionedModules,
      hotModules,
      journeyTracks,
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
      url: '/pages/module-quiz/module-quiz?id=' + target.id
    });
  },

  onShareAppMessage() {
    return {
      title: 'sbti人格趣味调侃：MBTI DISC 九型人格测试合集',
      path: '/pages/home/home'
    };
  },

  onShareTimeline() {
    return {
      title: '人格测试合集：MBTI、DISC、九型、霍兰德、爱之语言、EQ'
    };
  }
});

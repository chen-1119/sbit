const { moduleCatalog } = require('../../utils/module-tests.js');

const CATEGORY_ORDER = ['market_hot', 'mbti', 'career', 'relationship', 'social', 'growth', 'resilience', 'fun', 'intimacy', 'core'];

const SEARCH_KEYWORDS = [
  '人格测试', 'MBTI测试', 'SBTI人格', 'DISC测试', '九型人格', '大五人格',
  '霍兰德职业兴趣', '爱之语言', 'EQ情绪能力', '麋鹿测试', '职业性格测试', '恋爱关系测试',
  '依恋风格测试', '社交边界感', '职业价值观', '学习行动力', '关系安全感',
  '世界杯测试', '世界杯人格测试', '球迷人格测试', '足球人格测试', '观赛人格'
];

const NEW_RELEASE_IDS = ['worldcup_fan_persona', 'attachment_security', 'career_values', 'social_boundary', 'learning_drive'];

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
    moduleIds: ['riasec_career_map', 'career_values', 'work_drive', 'decision_style']
  },
  {
    key: 'relationship',
    title: '关系沟通路径',
    desc: '适合观察安全感、表达方式、沟通模式和边界感。',
    moduleIds: ['attachment_security', 'love_language_daily', 'communication_mode', 'social_boundary']
  },
  {
    key: 'team',
    title: '社交协作路径',
    desc: '适合看团队协作、情绪能力和职场配合方式。',
    moduleIds: ['disc_profile', 'eq_social_power', 'mbti_workstyle']
  },
  {
    key: 'growth',
    title: '成长行动路径',
    desc: '适合看学习行动、情绪恢复和长期执行策略。',
    moduleIds: ['learning_drive', 'energy_reset', 'big5_lite']
  },
  {
    key: 'seasonal',
    title: '世界杯热点路径',
    desc: '适合世界杯前和朋友一起测球迷人格、观赛方式和热闹担当。',
    moduleIds: ['worldcup_fan_persona', 'moose_winter', 'disc_profile']
  }
];

const NEXT_TEST_IDEAS = [
  { title: '友情人格测试', keyword: '朋友关系', desc: '可扩展朋友相处、回应期待、玩笑边界和社交默契。' },
  { title: '消费人格测试', keyword: '消费决策', desc: '可扩展情绪消费、理性预算、体验优先和囤货倾向。' },
  { title: '城市生活方式测试', keyword: '城市匹配', desc: '可扩展居住节奏、通勤忍耐、夜生活、自然需求和机会密度。' },
  { title: '恋爱沟通雷区测试', keyword: '沟通雷区', desc: '可扩展冷处理、追问、讲道理、试探和修复方式。' }
];

function getCategoryWeight(key) {
  const index = CATEGORY_ORDER.indexOf(key);
  return index === -1 ? 99 : index;
}

function getEntryUrl(item) {
  if (!item) return '';
  return item.type === 'native' ? item.page : '/pages/module-quiz/module-quiz?id=' + item.id;
}

function getAudience(item) {
  if (item.type === 'native') return '适合第一次完整体验，先得到主画像再补充专项测试。';
  if (item.categoryKey === 'career') return '适合想看职业方向、岗位偏好和工作驱动力的人。';
  if (item.categoryKey === 'relationship' || item.categoryKey === 'intimacy') return '适合想看关系表达、沟通需求和边界模式的人。';
  if (item.categoryKey === 'social') return '适合想看社交协作、团队沟通和互动方式的人。';
  if (item.categoryKey === 'growth' || item.categoryKey === 'resilience') return '适合想优化行动策略、情绪恢复和长期节奏的人。';
  if (item.id === 'worldcup_fan_persona') return '适合世界杯前和朋友一起测，看看谁是懂球军师、气氛发动机或冷门猎手。';
  return '适合想快速获得一个可分享人格画像的人。';
}

function decorateModule(item) {
  return Object.assign({}, item, {
    entryUrl: getEntryUrl(item),
    audience: item.audience || getAudience(item)
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
    newReleaseModules: [],
    categories: [],
    activeCategory: 'all',
    stats: {
      moduleCount: 0,
      genericCount: 0,
      questionCount: 0,
      totalMinutes: 0,
      hotCount: 0
    },
    frameworkTags: ['世界杯观赛', 'MBTI/16型', 'Big Five', 'DISC', '九型人格', 'RIASEC', '爱之语言', 'EQ', '麋鹿趣味'],
    searchKeywords: SEARCH_KEYWORDS,
    nextTestIdeas: NEXT_TEST_IDEAS,
    introPoints: [
      '热门框架只借鉴维度结构，不复制任何商业量表原题；题目均为二创场景题。',
      '每个通用模块保持 30-50 题，适合碎片时间连续测试。',
      '结果页强化主次维度、朋友视角、适用场景和下一步推荐，方便截图与转发。',
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
    const newReleaseModules = NEW_RELEASE_IDS.map((id) => moduleMap[id]).filter(Boolean);

    wx.setNavigationBarTitle({ title: '人格测试合集' });
    this.setData({
      featured: featured || null,
      allModules: rest,
      filteredModules: filterModules(rest, activeCategory),
      sectionedModules,
      hotModules,
      journeyTracks,
      newReleaseModules,
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
      title: 'sbti人格趣味调侃：世界杯观赛人格 MBTI DISC 测试合集',
      path: '/pages/home/home'
    };
  },

  onShareTimeline() {
    return {
      title: '人格测试合集：世界杯观赛人格、MBTI、DISC、九型、霍兰德'
    };
  }
});

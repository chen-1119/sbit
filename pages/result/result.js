const {
  personalities,
  dimensions,
  dimensionNames,
  levelDescriptions
} = require('../../utils/data.js');
const { questions, totalQuestionCount } = require('../../utils/questions.js');

const patterns = [
  { code: 'CTRL', pattern: 'HHH-HMH-MHH-HHH-MHM' },
  { code: 'ATM-er', pattern: 'HHH-HHM-HHH-HMH-MHL' },
  { code: 'Dior-s', pattern: 'MHM-MMH-MHM-HMH-LHL' },
  { code: 'BOSS', pattern: 'HHH-HMH-MMH-HHH-LHL' },
  { code: 'THAN-K', pattern: 'MHM-HMM-HHM-MMH-MHL' },
  { code: 'OH-NO', pattern: 'HHL-LMH-LHH-HHM-LHL' },
  { code: 'GOGO', pattern: 'HHM-HMH-MMH-HHH-MHM' },
  { code: 'SEXY', pattern: 'HMH-HHL-HMM-HMM-HLH' },
  { code: 'LOVE-R', pattern: 'MLH-LHL-HLH-MLM-MLH' },
  { code: 'MUM', pattern: 'MMH-MHL-HMM-LMM-HLL' },
  { code: 'FAKE', pattern: 'HLM-MML-MLM-MLM-HLH' },
  { code: 'OJBK', pattern: 'MMH-MMM-HML-LMM-MML' },
  { code: 'MALO', pattern: 'MLH-MHM-MLH-MLH-LMH' },
  { code: 'JOKE-R', pattern: 'LLH-LHL-LML-LLL-MLM' },
  { code: 'WOC!', pattern: 'HHL-HMH-MMH-HHM-LHH' },
  { code: 'THIN-K', pattern: 'HHL-HMH-MLH-MHM-LHH' },
  { code: 'SHIT', pattern: 'HHL-HLH-LMM-HHM-LHH' },
  { code: 'ZZZZ', pattern: 'MHL-MLH-LML-MML-LHM' },
  { code: 'POOR', pattern: 'HHL-MLH-LMH-HHH-LHL' },
  { code: 'MONK', pattern: 'HHL-LLH-LLM-MML-LHM' },
  { code: 'IMSB', pattern: 'LLM-LMM-LLL-LLL-MLM' },
  { code: 'SOLO', pattern: 'LML-LLH-LHL-LML-LHM' },
  { code: 'FUCK', pattern: 'MLL-LHL-LLM-MLL-HLH' },
  { code: 'DEAD', pattern: 'LLL-LLM-LML-LLL-LHM' },
  { code: 'IMFW', pattern: 'LLH-LHL-LML-LLL-MLL' }
];

const dimGroups = [
  { name: '自我模型', dims: ['S1', 'S2', 'S3'] },
  { name: '情感模型', dims: ['E1', 'E2', 'E3'] },
  { name: '态度模型', dims: ['A1', 'A2', 'A3'] },
  { name: '行动驱力', dims: ['Ac1', 'Ac2', 'Ac3'] },
  { name: '社交模型', dims: ['So1', 'So2', 'So3'] }
];

const mbtiPairs = [
  { left: 'E', right: 'I', label: '能量来源' },
  { left: 'S', right: 'N', label: '信息处理' },
  { left: 'T', right: 'F', label: '决策偏好' },
  { left: 'J', right: 'P', label: '生活节奏' }
];

const axisMeta = [
  { key: 'social', label: '社交机会' },
  { key: 'innovation', label: '创新空间' },
  { key: 'logic', label: '决策环境' },
  { key: 'order', label: '秩序节奏' }
];

const careerOptions = [
  { key: 'general', label: '综合' },
  { key: 'tech', label: '互联网/技术' },
  { key: 'finance', label: '金融/咨询' },
  { key: 'creative', label: '内容/创意' },
  { key: 'industry', label: '制造/供应链' },
  { key: 'research', label: '科研/教育' },
  { key: 'lifestyle', label: '远程/生活方式' }
];

const careerBoostMap = {
  general: {},
  tech: { 深圳: 10, 杭州: 10, 上海: 8, 北京: 8, 成都: 6, 广州: 5, 合肥: 5, 武汉: 4 },
  finance: { 上海: 10, 北京: 9, 深圳: 8, 广州: 6, 杭州: 5, 南京: 4, 苏州: 4 },
  creative: { 成都: 10, 长沙: 9, 重庆: 7, 厦门: 7, 上海: 6, 杭州: 6, 广州: 5 },
  industry: { 苏州: 10, 宁波: 9, 无锡: 8, 东莞: 8, 佛山: 8, 青岛: 6, 济南: 5, 天津: 5, 沈阳: 4 },
  research: { 北京: 10, 上海: 7, 南京: 7, 武汉: 7, 西安: 7, 合肥: 6, 天津: 5, 长春: 5, 哈尔滨: 4 },
  lifestyle: { 昆明: 10, 厦门: 9, 海口: 9, 三亚: 10, 成都: 7, 杭州: 5, 重庆: 5, 青岛: 4 }
};

const CITY_PREF_KEY = 'sbti_city_pref_v1';

const weightPresets = [
  { key: 'balanced', label: '平衡', weights: { social: 1, innovation: 1, logic: 1, order: 1 } },
  { key: 'career', label: '职业发展', weights: { social: 1, innovation: 3, logic: 3, order: 2 } },
  { key: 'social', label: '机会社交', weights: { social: 3, innovation: 2, logic: 1, order: 1 } },
  { key: 'stable', label: '稳定可控', weights: { social: 1, innovation: 1, logic: 2, order: 3 } }
];

const cityProfiles = [
  { name: '上海', social: 2, innovation: 3, logic: 3, order: 3, tags: ['机会密度', '国际化', '高节奏'] },
  { name: '深圳', social: 2, innovation: 3, logic: 3, order: 2, tags: ['技术创业', '年轻流动', '结果导向'] },
  { name: '北京', social: 1, innovation: 3, logic: 3, order: 3, tags: ['资源集中', '学习氛围', '决策场景'] },
  { name: '广州', social: 2, innovation: 2, logic: 2, order: 1, tags: ['商业氛围', '务实包容', '生活便利'] },
  { name: '杭州', social: 1, innovation: 3, logic: 2, order: 2, tags: ['数字产业', '创新友好', '平衡感'] },
  { name: '苏州', social: -1, innovation: 1, logic: 2, order: 3, tags: ['产业稳健', '秩序感', '宜居'] },
  { name: '南京', social: -1, innovation: 2, logic: 1, order: 2, tags: ['文化厚度', '节奏适中', '学习型'] },
  { name: '武汉', social: 1, innovation: 2, logic: 2, order: 1, tags: ['综合机会', '高校资源', '交通枢纽'] },
  { name: '成都', social: 2, innovation: 2, logic: -1, order: -1, tags: ['包容松弛', '创意内容', '生活感'] },
  { name: '重庆', social: 2, innovation: 1, logic: 0, order: -1, tags: ['烟火气', '直率社交', '强韧性'] },
  { name: '西安', social: 0, innovation: 1, logic: 1, order: 1, tags: ['历史新兴并存', '成本友好', '稳中有进'] },
  { name: '天津', social: 0, innovation: 1, logic: 1, order: 1, tags: ['制造基础', '城市便利', '节奏稳'] },
  { name: '青岛', social: 0, innovation: 1, logic: 1, order: 0, tags: ['海滨宜居', '产业多元', '平衡感'] },
  { name: '宁波', social: -1, innovation: 1, logic: 2, order: 2, tags: ['外贸制造', '务实节奏', '通勤友好'] },
  { name: '厦门', social: -1, innovation: 1, logic: -1, order: -1, tags: ['慢节奏', '环境舒适', '关系温和'] },
  { name: '福州', social: -1, innovation: 1, logic: 0, order: 0, tags: ['生活稳定', '创业成长', '成本适中'] },
  { name: '济南', social: 0, innovation: 1, logic: 1, order: 1, tags: ['产业升级', '管理稳定', '生活便利'] },
  { name: '郑州', social: 1, innovation: 1, logic: 1, order: 1, tags: ['枢纽城市', '机会增长', '执行导向'] },
  { name: '长沙', social: 3, innovation: 1, logic: 0, order: -1, tags: ['社交活跃', '娱乐文化', '年轻氛围'] },
  { name: '合肥', social: 0, innovation: 2, logic: 2, order: 2, tags: ['科创增速', '工程导向', '生活可控'] },
  { name: '无锡', social: -1, innovation: 1, logic: 2, order: 2, tags: ['制造升级', '稳定务实', '居住舒适'] },
  { name: '佛山', social: 1, innovation: 1, logic: 2, order: 1, tags: ['民营制造', '务实经营', '广佛协同'] },
  { name: '东莞', social: 1, innovation: 2, logic: 2, order: 1, tags: ['产业链完整', '机会密集', '执行效率'] },
  { name: '昆明', social: -2, innovation: 0, logic: -1, order: -2, tags: ['低压生活', '自然资源', '慢节奏'] },
  { name: '南宁', social: -1, innovation: 0, logic: 0, order: -1, tags: ['舒缓节奏', '区域连接', '生活成本友好'] },
  { name: '沈阳', social: -1, innovation: 0, logic: 1, order: 1, tags: ['工业底盘', '生活稳定', '务实导向'] },
  { name: '大连', social: -1, innovation: 1, logic: 1, order: 0, tags: ['沿海产业', '生活舒适', '秩序感'] },
  { name: '哈尔滨', social: -1, innovation: 0, logic: 0, order: -1, tags: ['生活节奏慢', '社交直率', '成本友好'] },
  { name: '长春', social: -1, innovation: 0, logic: 1, order: 1, tags: ['产业基础', '结构稳定', '通勤友好'] },
  { name: '海口', social: -1, innovation: 0, logic: -1, order: -2, tags: ['低压生活', '生态友好', '轻节奏'] },
  { name: '三亚', social: 0, innovation: 0, logic: -2, order: -2, tags: ['度假氛围', '慢生活', '情绪疗愈'] }
];

const highOnZeroIndices = [0, 1, 7, 13, 14];

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function getDefaultAxisWeights() {
  return { social: 1, innovation: 1, logic: 1, order: 1 };
}

function normalizeAxisWeights(rawWeights) {
  const defaults = getDefaultAxisWeights();
  const source = rawWeights || {};

  return {
    social: clamp(Number(source.social) || defaults.social, 1, 4),
    innovation: clamp(Number(source.innovation) || defaults.innovation, 1, 4),
    logic: clamp(Number(source.logic) || defaults.logic, 1, 4),
    order: clamp(Number(source.order) || defaults.order, 1, 4)
  };
}

function detectPresetKey(axisWeights) {
  const keys = ['social', 'innovation', 'logic', 'order'];
  const target = normalizeAxisWeights(axisWeights);

  const found = weightPresets.find((preset) => {
    return keys.every((key) => preset.weights[key] === target[key]);
  });

  return found ? found.key : 'custom';
}

function getWeightHint(axisWeights) {
  const normalized = normalizeAxisWeights(axisWeights);
  const entries = axisMeta.map((meta) => ({
    label: meta.label,
    value: normalized[meta.key]
  }));

  const maxWeight = Math.max.apply(null, entries.map((item) => item.value));
  const focusLabels = entries.filter((item) => item.value === maxWeight).map((item) => item.label);

  if (maxWeight === 1) {
    return '当前为平衡权重，四个维度同等优先。';
  }

  return `当前重点关注：${focusLabels.join('、')}。权重越高，对城市排序影响越大。`;
}

function buildAxisWeightCards(axisWeights) {
  const normalized = normalizeAxisWeights(axisWeights);
  return axisMeta.map((meta) => ({
    key: meta.key,
    label: meta.label,
    value: normalized[meta.key]
  }));
}

function normalizeCityPreference(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const careerKey = careerOptions.some((item) => item.key === raw.careerKey) ? raw.careerKey : 'general';
  const axisWeights = normalizeAxisWeights(raw.axisWeights);
  return { careerKey, axisWeights };
}

function normalizeAnswers(rawAnswers) {
  const normalized = new Array(totalQuestionCount).fill(1);
  for (let i = 0; i < totalQuestionCount; i++) {
    if (typeof rawAnswers[i] === 'number' && rawAnswers[i] >= 0 && rawAnswers[i] <= 2) {
      normalized[i] = rawAnswers[i];
    }
  }
  return normalized;
}

function getPatternFromAnswers(answerList) {
  let result = '';
  for (let i = 0; i < 15; i++) {
    const ans = answerList[i];
    if (ans === 0) result += 'H';
    else if (ans === 1) result += 'M';
    else result += 'L';
  }
  return result;
}

function findBestMatch(patternStr, answerList) {
  let bestMatch = null;
  let bestScore = 0;
  let bestCode = 'HHHH';

  if (answerList[30] === 2) {
    const drunk = personalities.find((p) => p.code === 'DRUNK');
    return { personality: drunk, matchScore: 100, pattern: 'DRUNK', isSpecial: true };
  }

  for (const p of patterns) {
    const patternParts = p.pattern.split('-').join('');
    let score = 0;
    for (let i = 0; i < 15; i++) {
      if (patternStr[i] === patternParts[i]) score++;
    }
    const matchPercent = (score / 15) * 100;

    if (matchPercent > bestScore) {
      bestScore = matchPercent;
      bestMatch = p;
      bestCode = p.code;
    }
  }

  if (bestScore < 60) {
    const hhhh = personalities.find((p) => p.code === 'HHHH');
    return { personality: hhhh, matchScore: bestScore, pattern: bestCode, isSpecial: true };
  }

  const personality = personalities.find((p) => p.code === bestCode);
  return { personality, matchScore: bestScore, pattern: bestMatch ? bestMatch.pattern : bestCode, isSpecial: false };
}

function getDimensionDetails(answerList) {
  const details = [];
  const patternStr = getPatternFromAnswers(answerList);

  for (const group of dimGroups) {
    const groupDims = [];
    for (const dim of group.dims) {
      const idx = dimensions.indexOf(dim);
      const level = patternStr[idx];
      groupDims.push({
        name: dim,
        nameCN: dimensionNames[dim],
        level,
        desc: levelDescriptions[level][dim]
      });
    }
    details.push({ groupName: group.name, dims: groupDims });
  }

  return details;
}

function getMbtiSummary(type, confidenceLevel) {
  const summaries = {
    EI: type.includes('E') ? '偏向外部互动补能' : '偏向独处沉淀补能',
    SN: type.includes('N') ? '偏向抽象趋势与可能性' : '偏向现实细节与可执行',
    TF: type.includes('T') ? '偏向逻辑一致与效率' : '偏向关系感受与价值',
    JP: type.includes('J') ? '偏向计划秩序与确定性' : '偏向弹性探索与开放性'
  };

  return `你当前更可能是 ${type}：${summaries.EI}，${summaries.SN}，${summaries.TF}，${summaries.JP}。判定清晰度：${confidenceLevel}。`;
}

function getConfidenceLevel(score) {
  if (score >= 60) return '高';
  if (score >= 35) return '中';
  return '低';
}

function calculateMbti(answerList) {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  questions.forEach((item, idx) => {
    if (!item.mbtiDimension) return;
    const answer = answerList[idx];

    if (answer === 0) {
      scores[item.poleA] += 2;
    } else if (answer === 1) {
      scores[item.poleA] += 1;
      scores[item.poleC] += 1;
    } else {
      scores[item.poleC] += 2;
    }
  });

  const axes = mbtiPairs.map((pair) => {
    const leftScore = scores[pair.left];
    const rightScore = scores[pair.right];
    const total = Math.max(leftScore + rightScore, 1);
    const leftPercent = Math.round((leftScore / total) * 100);
    const diff = Math.abs(leftScore - rightScore);
    const clarity = Math.round((diff / total) * 100);

    return {
      label: pair.label,
      left: pair.left,
      right: pair.right,
      leftPercent,
      rightPercent: 100 - leftPercent,
      selected: leftScore >= rightScore ? pair.left : pair.right,
      clarity,
      isBalanced: diff <= 1
    };
  });

  const type = axes.map((axis) => axis.selected).join('');
  const confidenceScore = Math.round(axes.reduce((sum, axis) => sum + axis.clarity, 0) / axes.length);
  const confidenceLevel = getConfidenceLevel(confidenceScore);
  const balancedAxes = axes.filter((axis) => axis.isBalanced).map((axis) => axis.label);

  return {
    type,
    axes,
    confidenceScore,
    confidenceLevel,
    balancedAxes,
    summary: getMbtiSummary(type, confidenceLevel)
  };
}

function getDimensionSignal(answerList, index) {
  const answer = answerList[index];
  const highOnZero = highOnZeroIndices.indexOf(index) > -1;

  if (highOnZero) {
    if (answer === 0) return 2;
    if (answer === 1) return 0;
    return -2;
  }

  if (answer === 0) return -2;
  if (answer === 1) return 0;
  return 2;
}

function getLifestyleVector(answerList, mbtiType) {
  const vector = {
    social: mbtiType[0] === 'E' ? 2 : -2,
    innovation: mbtiType[1] === 'N' ? 2 : -2,
    logic: mbtiType[2] === 'T' ? 2 : -2,
    order: mbtiType[3] === 'J' ? 2 : -2
  };

  const so1 = getDimensionSignal(answerList, 12);
  const so2 = getDimensionSignal(answerList, 13);
  const so3 = getDimensionSignal(answerList, 14);
  const a1 = getDimensionSignal(answerList, 6);
  const a2 = getDimensionSignal(answerList, 7);
  const a3 = getDimensionSignal(answerList, 8);
  const ac2 = getDimensionSignal(answerList, 10);
  const ac3 = getDimensionSignal(answerList, 11);
  const s2 = getDimensionSignal(answerList, 1);

  vector.social = clamp(vector.social + Math.round((so1 + so3 - so2) / 4), -3, 3);
  vector.innovation = clamp(vector.innovation + Math.round((a1 - a2 + a3) / 6), -3, 3);
  vector.logic = clamp(vector.logic + Math.round((ac2 + so2 - so3) / 6), -3, 3);
  vector.order = clamp(vector.order + Math.round((a2 + ac3 + s2) / 6), -3, 3);

  return vector;
}

function getVectorTags(vector) {
  const tags = [];
  tags.push(vector.social >= 1 ? '机会社交型' : vector.social <= -1 ? '低噪独处型' : '均衡社交型');
  tags.push(vector.innovation >= 1 ? '创新探索型' : vector.innovation <= -1 ? '务实稳定型' : '渐进升级型');
  tags.push(vector.logic >= 1 ? '结果决策型' : vector.logic <= -1 ? '关系感受型' : '平衡判断型');
  tags.push(vector.order >= 1 ? '计划秩序型' : vector.order <= -1 ? '弹性流动型' : '弹性秩序型');
  return tags;
}

function getCityMatchReason(city, targetVector) {
  const align = [];

  if (Math.abs(city.social - targetVector.social) <= 1) {
    align.push(targetVector.social >= 1 ? '外向互动空间充足' : '低干扰生活节奏合适');
  }
  if (Math.abs(city.innovation - targetVector.innovation) <= 1) {
    align.push(targetVector.innovation >= 1 ? '创新试错场景更丰富' : '务实落地环境更稳');
  }
  if (Math.abs(city.logic - targetVector.logic) <= 1) {
    align.push(targetVector.logic >= 1 ? '结果导向环境更匹配' : '关系温度和生活感更友好');
  }
  if (Math.abs(city.order - targetVector.order) <= 1) {
    align.push(targetVector.order >= 1 ? '秩序和可控感更高' : '弹性和自由度更高');
  }

  const core = align.length > 0 ? align.slice(0, 2).join('，') : '综合生活方式接近你的偏好';
  return `${core}。`;
}

function buildAxisFits(city, vector) {
  return axisMeta.map((meta) => {
    const diff = Math.abs(city[meta.key] - vector[meta.key]);
    return {
      label: meta.label,
      fit: Math.round(((6 - diff) / 6) * 100)
    };
  });
}

function getCareerLabel(careerKey) {
  const target = careerOptions.find((item) => item.key === careerKey);
  return target ? target.label : '综合';
}

function getCareerHint(careerKey, cityName) {
  const label = getCareerLabel(careerKey);
  if (careerKey === 'general') {
    return '当前为综合模式：主要按人格画像匹配城市氛围。';
  }
  return `当前偏好：${label}。系统已对相关产业机会做加权，推荐更贴近你在 ${cityName} 一类城市的落地场景。`;
}

function calculateCityMatches(vector, careerKey, axisWeights) {
  const normalizedWeights = normalizeAxisWeights(axisWeights);
  const maxDistance =
    6 *
    (normalizedWeights.social +
      normalizedWeights.innovation +
      normalizedWeights.logic +
      normalizedWeights.order);
  const boostMap = careerBoostMap[careerKey] || {};

  const scored = cityProfiles.map((city) => {
    const distance =
      Math.abs(city.social - vector.social) * normalizedWeights.social +
      Math.abs(city.innovation - vector.innovation) * normalizedWeights.innovation +
      Math.abs(city.logic - vector.logic) * normalizedWeights.logic +
      Math.abs(city.order - vector.order) * normalizedWeights.order;
    const baseScore = Math.round(((maxDistance - distance) / maxDistance) * 100);
    const careerBoost = boostMap[city.name] || 0;
    const score = clamp(baseScore + careerBoost, 0, 100);

    return {
      name: city.name,
      score,
      tags: city.tags,
      reason: getCityMatchReason(city, vector),
      axisFits: buildAxisFits(city, vector)
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

function getLifestyleTips(vector, mbtiType, topCityName) {
  const tips = [];

  if (vector.social >= 1) {
    tips.push('优先住在地铁/商圈 20 分钟通勤圈，给自己保留高频线下连接机会。');
  } else {
    tips.push('优先选择安静居住区和可步行生活圈，降低通勤与社交噪音。');
  }

  if (vector.order >= 1) {
    tips.push('每周固定 2-3 个时间块处理高价值任务，让节奏感成为你的稳定器。');
  } else {
    tips.push('采用“目标+边界”而非死板日程，给自己留出灵感和机动窗口。');
  }

  const role = mbtiType[2] === 'T' ? '数据和结果' : '关系和体验';
  tips.push(`在 ${topCityName} 的决策中，优先用“${role}”做关键筛选标准，减少内耗。`);

  return tips;
}

function buildResultBrief(personality, mbtiResult, cityMatches, careerKey) {
  const code = personality && personality.code ? personality.code : '----';
  const name = personality && personality.name ? personality.name : '未命名';
  const mbtiType = mbtiResult && mbtiResult.type ? mbtiResult.type : '----';
  const cityPart = cityMatches.length ? cityMatches.map((city) => city.name).join(' / ') : '暂无';
  const careerLabel = getCareerLabel(careerKey);
  return `你是 ${code}（${name}），MBTI 倾向 ${mbtiType}，职业偏好 ${careerLabel}，城市推荐：${cityPart}。`;
}

function buildShareText(data) {
  const weights = normalizeAxisWeights(data.axisWeights);
  const weightText = `社交${weights.social}/创新${weights.innovation}/决策${weights.logic}/秩序${weights.order}`;
  return [
    `我的 SBIT 结果：${data.result.code}（${data.result.name}）`,
    `SBTI 匹配度：${data.matchScore}%`,
    `MBTI 倾向：${data.mbtiResult.type}（清晰度 ${data.mbtiResult.confidenceLevel}）`,
    `职业偏好：${getCareerLabel(data.selectedCareerKey)}`,
    `城市权重：${weightText}`,
    `匹配城市：${data.cityMatches.map((city) => city.name).join(' / ')}`,
    '来自 SBIT 人格实验室'
  ].join('\n');
}

let answers = [];

Page({
  data: {
    result: {},
    dimensionDetails: [],
    matchScore: 0,
    mbtiResult: {
      type: '----',
      summary: '',
      axes: [],
      confidenceScore: 0,
      confidenceLevel: '低',
      balancedAxes: []
    },
    cityMatches: [],
    vectorTags: [],
    lifestyleTips: [],
    resultBrief: '',
    careerOptions,
    weightPresets: weightPresets.map((item) => ({ key: item.key, label: item.label })),
    axisWeights: getDefaultAxisWeights(),
    axisWeightCards: buildAxisWeightCards(getDefaultAxisWeights()),
    selectedPresetKey: 'balanced',
    weightHint: '当前为平衡权重，四个维度同等优先。',
    selectedCareerKey: 'general',
    careerHint: '当前为综合模式：主要按人格画像匹配城市氛围。',
    posterPath: '',
    generatingPoster: false,
    sourceNote: 'SBTI 角色素材参考 sbti-wiki（CC BY-NC-SA 4.0）；MBTI 与城市内容为二创原创。',
    methodNote: '城市匹配基于 MBTI + SBTI 四轴画像（社交/创新/决策/秩序）计算，可按职业与权重调节。'
  },

  onLoad() {
    const raw = wx.getStorageSync('sbti_answers') || [];
    answers = normalizeAnswers(raw);
    const savedPref = normalizeCityPreference(wx.getStorageSync(CITY_PREF_KEY));

    if (savedPref) {
      this.setData({
        selectedCareerKey: savedPref.careerKey,
        axisWeights: savedPref.axisWeights,
        axisWeightCards: buildAxisWeightCards(savedPref.axisWeights),
        selectedPresetKey: detectPresetKey(savedPref.axisWeights),
        weightHint: getWeightHint(savedPref.axisWeights)
      });
    }

    this.calculateResult();
    this.drawChart();

    if (wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: false,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    }
  },

  calculateResult() {
    const selectedCareerKey = this.data.selectedCareerKey || 'general';
    const axisWeights = normalizeAxisWeights(this.data.axisWeights);
    const patternStr = getPatternFromAnswers(answers);
    const matchResult = findBestMatch(patternStr, answers);
    const dimensionDetails = getDimensionDetails(answers);
    const mbtiResult = calculateMbti(answers);
    const vector = getLifestyleVector(answers, mbtiResult.type);
    const cityMatches = calculateCityMatches(vector, selectedCareerKey, axisWeights);
    const vectorTags = getVectorTags(vector);
    const topCityName = cityMatches.length ? cityMatches[0].name : '当前城市';
    const lifestyleTips = getLifestyleTips(vector, mbtiResult.type, topCityName);
    const resultBrief = buildResultBrief(matchResult.personality, mbtiResult, cityMatches, selectedCareerKey);
    const careerHint = getCareerHint(selectedCareerKey, topCityName);
    const selectedPresetKey = detectPresetKey(axisWeights);
    const weightHint = getWeightHint(axisWeights);

    this._vector = vector;
    this._mbtiType = mbtiResult.type;

    this.setData({
      result: matchResult.personality,
      dimensionDetails,
      matchScore: Math.round(matchResult.matchScore),
      mbtiResult,
      cityMatches,
      vectorTags,
      lifestyleTips,
      resultBrief,
      careerHint,
      axisWeights,
      axisWeightCards: buildAxisWeightCards(axisWeights),
      selectedPresetKey,
      weightHint
    });

    this.persistCityPreference(selectedCareerKey, axisWeights);
  },

  persistCityPreference(careerKey, axisWeights) {
    wx.setStorageSync(CITY_PREF_KEY, {
      careerKey,
      axisWeights: normalizeAxisWeights(axisWeights)
    });
  },

  refreshCityRecommendation(careerKey, axisWeights) {
    if (!this._vector) return;

    const finalCareerKey = careerKey || this.data.selectedCareerKey || 'general';
    const finalWeights = normalizeAxisWeights(axisWeights || this.data.axisWeights);
    const cityMatches = calculateCityMatches(this._vector, finalCareerKey, finalWeights);
    const topCityName = cityMatches.length ? cityMatches[0].name : '当前城市';
    const lifestyleTips = getLifestyleTips(this._vector, this._mbtiType || this.data.mbtiResult.type, topCityName);
    const resultBrief = buildResultBrief(this.data.result, this.data.mbtiResult, cityMatches, finalCareerKey);
    const careerHint = getCareerHint(finalCareerKey, topCityName);
    const selectedPresetKey = detectPresetKey(finalWeights);
    const weightHint = getWeightHint(finalWeights);

    this.setData({
      selectedCareerKey: finalCareerKey,
      axisWeights: finalWeights,
      axisWeightCards: buildAxisWeightCards(finalWeights),
      selectedPresetKey,
      cityMatches,
      lifestyleTips,
      resultBrief,
      careerHint,
      weightHint,
      posterPath: ''
    });

    this.persistCityPreference(finalCareerKey, finalWeights);
  },

  onCareerChange(e) {
    const careerKey = e.currentTarget.dataset.key;
    if (!careerKey || careerKey === this.data.selectedCareerKey) return;
    this.refreshCityRecommendation(careerKey, this.data.axisWeights);
  },

  onWeightAdjust(e) {
    const key = e.currentTarget.dataset.key;
    const delta = Number(e.currentTarget.dataset.delta);
    if (!key || !delta) return;

    const current = Number(this.data.axisWeights[key]) || 1;
    const next = clamp(current + delta, 1, 4);
    if (next === current) return;

    const nextWeights = Object.assign({}, this.data.axisWeights, { [key]: next });
    this.refreshCityRecommendation(this.data.selectedCareerKey, nextWeights);
  },

  onPresetChange(e) {
    const presetKey = e.currentTarget.dataset.key;
    const preset = weightPresets.find((item) => item.key === presetKey);
    if (!preset) return;
    this.refreshCityRecommendation(this.data.selectedCareerKey, preset.weights);
  },

  resetCityPreference() {
    this.refreshCityRecommendation('general', getDefaultAxisWeights());
    wx.showToast({ title: '已恢复默认偏好', icon: 'none' });
  },

  drawChart() {
    const ctx = wx.createCanvasContext('radarChart');
    const centerX = 150;
    const centerY = 150;
    const radius = 100;

    const data = [
      answers[0] === 0 ? 100 : answers[0] === 1 ? 60 : 30,
      answers[1] === 0 ? 100 : answers[1] === 1 ? 60 : 30,
      answers[2] === 0 ? 30 : answers[2] === 1 ? 60 : 100,
      answers[3] === 0 ? 30 : answers[3] === 1 ? 60 : 100,
      answers[4] === 0 ? 30 : answers[4] === 1 ? 60 : 100,
      answers[5] === 0 ? 30 : answers[5] === 1 ? 60 : 100,
      answers[6] === 0 ? 30 : answers[6] === 1 ? 60 : 100,
      answers[7] === 0 ? 100 : answers[7] === 1 ? 60 : 30,
      answers[8] === 0 ? 30 : answers[8] === 1 ? 60 : 100,
      answers[9] === 0 ? 30 : answers[9] === 1 ? 60 : 100,
      answers[10] === 0 ? 30 : answers[10] === 1 ? 60 : 100,
      answers[11] === 0 ? 30 : answers[11] === 1 ? 60 : 100,
      answers[12] === 0 ? 30 : answers[12] === 1 ? 60 : 100,
      answers[13] === 0 ? 100 : answers[13] === 1 ? 60 : 30,
      answers[14] === 0 ? 100 : answers[14] === 1 ? 60 : 30
    ];

    ctx.setFillStyle('#fffdf8');
    ctx.fillRect(0, 0, 300, 300);

    ctx.setStrokeStyle('#d3d8dc');
    ctx.setLineWidth(1);
    for (let i = 1; i <= 5; i++) {
      const r = (radius * i) / 5;
      ctx.beginPath();
      for (let j = 0; j < 15; j++) {
        const angle = (Math.PI * 2 * j) / 15 - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
      ctx.stroke();
    }

    ctx.beginPath();
    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15 - Math.PI / 2;
      const value = (data[i] / 100) * radius;
      const x = centerX + value * Math.cos(angle);
      const y = centerY + value * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.setFillStyle('rgba(31, 111, 120, 0.2)');
    ctx.setStrokeStyle('#1f6f78');
    ctx.setLineWidth(2);
    ctx.fill();
    ctx.stroke();

    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15 - Math.PI / 2;
      const value = (data[i] / 100) * radius;
      const x = centerX + value * Math.cos(angle);
      const y = centerY + value * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.setFillStyle('#e87a5d');
      ctx.fill();
    }

    ctx.draw();
  },

  copySummary() {
    const text = buildShareText(this.data);
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '已复制结果文案', icon: 'none' });
      }
    });
  },

  generatePoster() {
    if (this.data.generatingPoster) return;

    this.setData({ generatingPoster: true });
    wx.showLoading({ title: '生成中', mask: true });

    const ctx = wx.createCanvasContext('sharePoster', this);
    const width = 600;
    const height = 980;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f8f1e7');
    gradient.addColorStop(1, '#f2eee5');
    ctx.setFillStyle(gradient);
    ctx.fillRect(0, 0, width, height);

    ctx.setFillStyle('#1f6f78');
    ctx.setFontSize(30);
    ctx.fillText('SBIT 人格实验室 · 结果卡', 36, 64);

    ctx.setFillStyle('#2b313a');
    ctx.setFontSize(56);
    ctx.fillText(this.data.result.code, 36, 146);

    ctx.setFontSize(28);
    ctx.setFillStyle('#d85f3f');
    ctx.fillText(this.data.result.name, 36, 188);

    ctx.setFillStyle('#46505b');
    ctx.setFontSize(24);
    ctx.fillText(`SBTI 匹配度：${this.data.matchScore}%`, 36, 232);
    ctx.fillText(`MBTI 倾向：${this.data.mbtiResult.type}（${this.data.mbtiResult.confidenceLevel}）`, 36, 268);
    ctx.fillText(`职业偏好：${getCareerLabel(this.data.selectedCareerKey)}`, 36, 304);
    ctx.fillText(
      `城市权重：社交${this.data.axisWeights.social}/创新${this.data.axisWeights.innovation}/决策${this.data.axisWeights.logic}/秩序${this.data.axisWeights.order}`,
      36,
      338
    );

    ctx.setFillStyle('#1f6f78');
    ctx.setFontSize(26);
    ctx.fillText('城市匹配 Top 3', 36, 392);

    this.data.cityMatches.forEach((city, idx) => {
      ctx.setFillStyle('#2f3945');
      ctx.setFontSize(24);
      ctx.fillText(`${idx + 1}. ${city.name}（${city.score}%）`, 36, 436 + idx * 54);
    });

    ctx.setFillStyle('#1f6f78');
    ctx.setFontSize(26);
    ctx.fillText('你的生活方式标签', 36, 640);

    this.data.vectorTags.forEach((tag, idx) => {
      const x = 36 + (idx % 2) * 270;
      const y = 684 + Math.floor(idx / 2) * 48;
      ctx.setFillStyle('rgba(31,111,120,0.14)');
      ctx.fillRect(x, y - 24, 240, 34);
      ctx.setFillStyle('#2c4e52');
      ctx.setFontSize(20);
      ctx.fillText(tag, x + 12, y);
    });

    ctx.setFillStyle('#6a717c');
    ctx.setFontSize(20);
    ctx.fillText('说明：测试结果仅供娱乐与自我观察。', 36, 920);
    ctx.fillText('由 SBTI + MBTI 二创模型生成', 36, 954);

    ctx.draw(false, () => {
      wx.canvasToTempFilePath({
        canvasId: 'sharePoster',
        x: 0,
        y: 0,
        width,
        height,
        destWidth: width,
        destHeight: height,
        success: (res) => {
          this.setData({
            posterPath: res.tempFilePath,
            generatingPoster: false
          });
          wx.hideLoading();
          wx.previewImage({ urls: [res.tempFilePath] });
        },
        fail: () => {
          this.setData({ generatingPoster: false });
          wx.hideLoading();
          wx.showToast({ title: '生成失败，请重试', icon: 'none' });
        }
      }, this);
    });
  },

  savePoster() {
    const filePath = this.data.posterPath;
    if (!filePath) {
      wx.showToast({ title: '请先生成分享图', icon: 'none' });
      return;
    }

    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        wx.showToast({ title: '已保存到相册', icon: 'success' });
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.indexOf('auth deny') > -1) {
          wx.showModal({
            title: '需要相册权限',
            content: '请在设置中允许保存到相册后再试。',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.openSetting();
              }
            }
          });
          return;
        }

        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    });
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: [url]
    });
  },

  onShareAppMessage() {
    return {
      title: `${this.data.result.code} | 我的 SBIT 人格结果`,
      path: '/pages/index/index'
    };
  },

  onShareTimeline() {
    return {
      title: `${this.data.result.code} · SBIT 人格实验室`
    };
  },

  restartTest() {
    wx.redirectTo({ url: '/pages/index/index' });
  }
});

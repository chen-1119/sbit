// 题库说明
// - 前 31 题：SBTI 核心与扩展趣味题（兼容原有 SBTI 匹配）
// - 后 12 题：MBTI 倾向补充题（E/I, S/N, T/F, J/P）

const sbtiQuestions = [
  { section: 'SBTI 核心题', q: '当别人夸你时，你的第一反应是？', options: ['心里开心但先装淡定', '先判断对方是不是客套', '大方接住，觉得确实有道理'] },
  { section: 'SBTI 核心题', q: '你能快速说清“我是谁”吗？', options: ['可以，我对自己很清楚', '时而清楚时而迷糊', '很少认真想这个问题'] },
  { section: 'SBTI 核心题', q: '你更看重哪类价值？', options: ['舒服和安全优先', '看阶段灵活调整', '成长和目标优先'] },
  { section: 'SBTI 核心题', q: '在亲密关系里你更像？', options: ['警报器很灵，容易脑补', '一半信任一半观察', '愿意相信，不轻易撤退'] },
  { section: 'SBTI 核心题', q: '你在感情中的投入风格是？', options: ['会留余地，不全盘托出', '认定后会很认真', '克制冷静，门槛较高'] },
  { section: 'SBTI 核心题', q: '理想关系状态更接近？', options: ['亲密融合', '独立空间', '可以平衡切换'] },
  { section: 'SBTI 核心题', q: '你看待世界更偏向？', options: ['先怀疑再靠近', '先观望再判断', '先相信善意'] },
  { section: 'SBTI 核心题', q: '你对规则的偏好是？', options: ['能绕就绕，先看效率', '该守就守，该变通就变通', '秩序优先，流程清晰更安心'] },
  { section: 'SBTI 核心题', q: '你最近的人生意义感如何？', options: ['经常觉得像走流程', '忽高忽低', '方向感比较清晰'] },
  { section: 'SBTI 核心题', q: '你做事更容易被什么驱动？', options: ['先别翻车，稳住最重要', '场景混合驱动', '成果和成长驱动'] },
  { section: 'SBTI 核心题', q: '你做决定时通常？', options: ['想很久，脑内会议超时', '会犹豫，但能拍板', '快速决定，不爱回头'] },
  { section: 'SBTI 核心题', q: '你的执行模式更像？', options: ['死线战士，越晚越清醒', '看状态，有时稳有时摆', '推进欲强，不落地难受'] },
  { section: 'SBTI 核心题', q: '在社交场合你通常？', options: ['偏被动，等别人来', '弹性社交，不强求', '主动打开场面'] },
  { section: 'SBTI 核心题', q: '你和别人之间的边界通常？', options: ['熟了就容易拉很近', '看对象动态调节', '边界明确，不喜欢贴太近'] },
  { section: 'SBTI 核心题', q: '你的表达风格更接近？', options: ['直接表达，不爱绕', '看氛围留一点余地', '分层表达，按场景切换'] },

  { section: 'SBTI 扩展题', q: '当你压力很大时，你通常会？', options: ['硬扛，不太示弱', '找人倾诉排解', '看情况决定要不要说'] },
  { section: 'SBTI 扩展题', q: '你对“自我反思”这件事？', options: ['经常做，而且比较深入', '偶尔做，够用就好', '很少主动做'] },
  { section: 'SBTI 扩展题', q: '在关系中你更常见的动作是？', options: ['主动投入，给得很多', '有所保留，慢慢给', '按互动反馈调节'] },
  { section: 'SBTI 扩展题', q: '你处理情绪更常用哪种方式？', options: ['先自己消化', '先讲出来再整理', '两种都会用'] },
  { section: 'SBTI 扩展题', q: '面对明确规则时你的默认选择是？', options: ['先按自己的方式来', '大体遵守并保留弹性', '尽量严格遵守'] },
  { section: 'SBTI 扩展题', q: '你属于哪种社交节奏？', options: ['慢热偏被动', '看场合切换', '高能主动型'] },
  { section: 'SBTI 扩展题', q: '你在亲密关系中的距离感是？', options: ['更想融合，黏度较高', '更想保留空间', '希望保持平衡'] },
  { section: 'SBTI 扩展题', q: '你表达真实感受的程度？', options: ['常压着不说', '会说，但有保留', '基本直给'] },
  { section: 'SBTI 扩展题', q: '你做决策时的犹豫程度？', options: ['经常想很久', '适度思考后决策', '快速拍板'] },
  { section: 'SBTI 扩展题', q: '再次被夸时你更可能？', options: ['先怀疑再接收', '直接开心接收', '看语境判断'] },
  { section: 'SBTI 扩展题', q: '你对自己的底层评价更像？', options: ['容易自我怀疑', '起伏较大', '整体稳定自信'] },
  { section: 'SBTI 扩展题', q: '你最近的意义感状态？', options: ['常觉得空虚', '时好时坏', '有比较明确的方向'] },
  { section: 'SBTI 扩展题', q: '你和死线的关系是？', options: ['越晚越有劲', '能提前会尽量提前', '基本靠临门一脚'] },
  { section: 'SBTI 扩展题', q: '出现冲突时你更常见的处理方式？', options: ['先撤退冷处理', '先稳住再沟通', '当场说开尽快解决'] },
  { section: 'SBTI 扩展题', q: '朋友眼中的你更像？', options: ['随和好靠近', '神秘有距离', '看对象切换'] },

  { section: 'SBTI 彩蛋题', q: '聚会喝酒你通常会？', options: ['不喝或浅尝', '看场合适量', '白酒装保温杯当水喝'] }
];

const mbtiQuestions = [
  {
    section: 'MBTI 补充题',
    q: '在陌生活动现场，你通常会？',
    options: ['主动认识新朋友', '先跟熟人待在一起', '先找安静角落观察'],
    mbtiDimension: 'EI',
    poleA: 'E',
    poleC: 'I'
  },
  {
    section: 'MBTI 补充题',
    q: '连续社交两天后，你更想？',
    options: ['继续下一场，状态在线', '看当下心情再说', '独处回血，先安静一下'],
    mbtiDimension: 'EI',
    poleA: 'E',
    poleC: 'I'
  },
  {
    section: 'MBTI 补充题',
    q: '新项目启动时你更常见的动作是？',
    options: ['边沟通边推进', '先听反馈再行动', '先独立梳理后再交流'],
    mbtiDimension: 'EI',
    poleA: 'E',
    poleC: 'I'
  },
  {
    section: 'MBTI 补充题',
    q: '看到新方案时你先关注？',
    options: ['可执行细节和资源成本', '细节与方向都会看', '未来可能性和延展空间'],
    mbtiDimension: 'SN',
    poleA: 'S',
    poleC: 'N'
  },
  {
    section: 'MBTI 补充题',
    q: '别人描述问题时，你更容易抓住？',
    options: ['发生了什么事实', '事实和趋势都看', '背后的模式与隐喻'],
    mbtiDimension: 'SN',
    poleA: 'S',
    poleC: 'N'
  },
  {
    section: 'MBTI 补充题',
    q: '学习新技能时你更偏好？',
    options: ['先按步骤练熟', '先做一点再微调', '先理解原理再搭框架'],
    mbtiDimension: 'SN',
    poleA: 'S',
    poleC: 'N'
  },
  {
    section: 'MBTI 补充题',
    q: '团队出现分歧时你先考虑？',
    options: ['规则、效率和结论', '先看情境再权衡', '成员感受和关系稳定'],
    mbtiDimension: 'TF',
    poleA: 'T',
    poleC: 'F'
  },
  {
    section: 'MBTI 补充题',
    q: '朋友来求建议，你通常会？',
    options: ['直接给可执行方案', '先问清背景再建议', '先安抚情绪再讨论方案'],
    mbtiDimension: 'TF',
    poleA: 'T',
    poleC: 'F'
  },
  {
    section: 'MBTI 补充题',
    q: '你更认可哪种“公平”？',
    options: ['标准一致就是公平', '标准和个体都要照顾', '个体处境值得优先考虑'],
    mbtiDimension: 'TF',
    poleA: 'T',
    poleC: 'F'
  },
  {
    section: 'MBTI 补充题',
    q: '出发旅行前，你通常会？',
    options: ['行程细到小时', '只定关键锚点', '到哪儿算哪儿'],
    mbtiDimension: 'JP',
    poleA: 'J',
    poleC: 'P'
  },
  {
    section: 'MBTI 补充题',
    q: '你推进项目更习惯？',
    options: ['先定节点再执行', '执行中不断微调', '保留弹性等灵感'],
    mbtiDimension: 'JP',
    poleA: 'J',
    poleC: 'P'
  },
  {
    section: 'MBTI 补充题',
    q: '面对截止日期时你通常？',
    options: ['提前收尾，留缓冲', '按节奏推进到点交付', '临近死线进入爆发模式'],
    mbtiDimension: 'JP',
    poleA: 'J',
    poleC: 'P'
  }
];

const questions = [...sbtiQuestions, ...mbtiQuestions];

module.exports = {
  questions,
  sbtiQuestionCount: sbtiQuestions.length,
  mbtiQuestionCount: mbtiQuestions.length,
  totalQuestionCount: questions.length
};

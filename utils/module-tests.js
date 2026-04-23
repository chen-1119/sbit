const sharedMbtiProfiles = {
  E: {
    title: '外向连接型',
    desc: '你更容易在互动中获得能量，擅长快速建立连接并推动协作。',
    tips: ['把高频沟通和深度独处分时安排，避免社交过载。', '关键决策先写成清单，再进入讨论。'],
    cityVibe: ['机会密度高', '协作节奏快']
  },
  I: {
    title: '内向深潜型',
    desc: '你偏好先独立思考再表达，通常在安静环境下产出更高质量结论。',
    tips: ['为自己预留固定深度工作时段。', '先结构化表达，再进入多人沟通。'],
    cityVibe: ['低噪环境', '节奏可控']
  },
  N: {
    title: '趋势洞察型',
    desc: '你对长期方向、模式和可能性敏感，擅长做探索和创新尝试。',
    tips: ['每周保留实验时间，把想法转成可验证动作。', '为每个探索设定停止条件，控制试错成本。'],
    cityVibe: ['创新空间大', '跨界机会多']
  },
  S: {
    title: '现实执行型',
    desc: '你重视细节与可落地性，能把模糊想法稳定推进到结果。',
    tips: ['在稳定流程中预留少量创新窗口。', '用复盘模板持续提升执行效率。'],
    cityVibe: ['产业扎实', '执行环境稳定']
  },
  T: {
    title: '逻辑决策型',
    desc: '你倾向用结构化分析做判断，重视一致性、效率与结果质量。',
    tips: ['决策前补一轮关系影响评估。', '复杂问题采用双方案对比，减少盲点。'],
    cityVibe: ['结果导向', '专业密度高']
  },
  F: {
    title: '共情协调型',
    desc: '你更关注关系质量与价值一致，擅长稳定团队情绪与合作氛围。',
    tips: ['先共情后收敛，避免讨论节奏被拖慢。', '把感受转成可执行动作，提升落地效率。'],
    cityVibe: ['包容友好', '生活感强']
  },
  J: {
    title: '计划掌舵型',
    desc: '你偏好秩序与确定性，习惯提前规划来降低不确定。',
    tips: ['在计划中预留弹性缓冲区。', '每周做一次减负，保持节奏轻量可持续。'],
    cityVibe: ['秩序感强', '配套成熟']
  },
  P: {
    title: '弹性探索型',
    desc: '你适应变化快，擅长在动态环境中持续寻找更优路径。',
    tips: ['保留自由度的同时定义关键里程碑。', '高不确定项目设置最小日交付。'],
    cityVibe: ['弹性高', '变化机会多']
  }
};

const rawModules = [
  {
    id: 'sbti_main',
    type: 'native',
    page: '/pages/index/index',
    title: 'SBTI 人格实验室',
    subtitle: '深度主测',
    description: '完整版本：SBTI + MBTI + 人格匹配城市，适合第一次完整测评。',
    badge: '深度',
    estimatedMinutes: 8,
    questionCount: 43,
    accent: 'teal',
    categoryKey: 'core',
    categoryLabel: '主测试'
  },
  {
    id: 'mbti_quick',
    type: 'generic',
    title: 'MBTI 快速倾向测评',
    subtitle: '认知风格',
    description: '12 题快速了解你的能量来源、信息处理、决策方式与节奏偏好。',
    badge: '热门',
    estimatedMinutes: 3,
    accent: 'orange',
    categoryKey: 'mbti',
    categoryLabel: 'MBTI 系列',
    dimensions: [
      { key: 'E', label: '外向互动' },
      { key: 'I', label: '内向沉淀' },
      { key: 'S', label: '现实细节' },
      { key: 'N', label: '抽象趋势' },
      { key: 'T', label: '逻辑判断' },
      { key: 'F', label: '情感判断' },
      { key: 'J', label: '计划秩序' },
      { key: 'P', label: '弹性探索' }
    ],
    questions: [
      {
        q: '进入陌生社交场时你通常会？',
        options: [
          { text: '主动发起聊天', scores: { E: 2 } },
          { text: '先观察再加入', scores: { E: 1, I: 1 } },
          { text: '更想找安静角落', scores: { I: 2 } }
        ]
      },
      {
        q: '连续开会一天后你更想？',
        options: [
          { text: '继续和朋友聚一下', scores: { E: 2 } },
          { text: '看当下状态再决定', scores: { E: 1, I: 1 } },
          { text: '独处恢复精力', scores: { I: 2 } }
        ]
      },
      {
        q: '表达观点时你的默认方式是？',
        options: [
          { text: '边说边整理想法', scores: { E: 2 } },
          { text: '先想一会再说', scores: { E: 1, I: 1 } },
          { text: '写下来再表达更稳', scores: { I: 2 } }
        ]
      },
      {
        q: '新任务启动时你先看什么？',
        options: [
          { text: '步骤、资源、时间', scores: { S: 2 } },
          { text: '先看目标再拆步骤', scores: { S: 1, N: 1 } },
          { text: '长期可能性和方向', scores: { N: 2 } }
        ]
      },
      {
        q: '阅读报告时你更容易抓住？',
        options: [
          { text: '具体数据和细节', scores: { S: 2 } },
          { text: '结论与细节并重', scores: { S: 1, N: 1 } },
          { text: '趋势和潜在模式', scores: { N: 2 } }
        ]
      },
      {
        q: '学习新技能你更偏好？',
        options: [
          { text: '按教程一步步做', scores: { S: 2 } },
          { text: '边做边调整', scores: { S: 1, N: 1 } },
          { text: '先搭建整体模型', scores: { N: 2 } }
        ]
      },
      {
        q: '团队冲突时你先考虑？',
        options: [
          { text: '事实依据和最优解', scores: { T: 2 } },
          { text: '方案与关系都顾及', scores: { T: 1, F: 1 } },
          { text: '情绪与关系优先', scores: { F: 2 } }
        ]
      },
      {
        q: '朋友求建议时你习惯？',
        options: [
          { text: '直接给步骤方案', scores: { T: 2 } },
          { text: '先听再给建议', scores: { T: 1, F: 1 } },
          { text: '先共情再谈方案', scores: { F: 2 } }
        ]
      },
      {
        q: '你对“公平”的理解更接近？',
        options: [
          { text: '标准一致最重要', scores: { T: 2 } },
          { text: '标准与个体情况并重', scores: { T: 1, F: 1 } },
          { text: '个体处境应优先考虑', scores: { F: 2 } }
        ]
      },
      {
        q: '旅行前你通常会？',
        options: [
          { text: '行程和备选都排好', scores: { J: 2 } },
          { text: '只定关键节点', scores: { J: 1, P: 1 } },
          { text: '边走边看', scores: { P: 2 } }
        ]
      },
      {
        q: '项目推进你更像？',
        options: [
          { text: '先计划再执行', scores: { J: 2 } },
          { text: '计划与调整并行', scores: { J: 1, P: 1 } },
          { text: '保持弹性到最后', scores: { P: 2 } }
        ]
      },
      {
        q: '面对截止日期你通常？',
        options: [
          { text: '提前完成留缓冲', scores: { J: 2 } },
          { text: '按节奏准时交付', scores: { J: 1, P: 1 } },
          { text: '临近时爆发冲刺', scores: { P: 2 } }
        ]
      }
    ],
    resultProfiles: sharedMbtiProfiles
  },
  {
    id: 'mbti_workstyle',
    type: 'generic',
    title: 'MBTI 职场协作版',
    subtitle: '工作场景',
    description: '把 MBTI 四对偏好放进职场语境，快速识别你在会议、协作和推进中的默认策略。',
    badge: '新增',
    estimatedMinutes: 3,
    accent: 'blue',
    categoryKey: 'mbti',
    categoryLabel: 'MBTI 系列',
    dimensions: [
      { key: 'E', label: '外向协作' },
      { key: 'I', label: '独立深思' },
      { key: 'S', label: '细节落地' },
      { key: 'N', label: '方向创新' },
      { key: 'T', label: '理性决策' },
      { key: 'F', label: '关系决策' },
      { key: 'J', label: '计划推进' },
      { key: 'P', label: '灵活迭代' }
    ],
    questions: [
      {
        q: '开项目例会时你最常见的状态是？',
        options: [
          { text: '边讨论边形成方案', scores: { E: 2 } },
          { text: '听完再发表观点', scores: { E: 1, I: 1 } },
          { text: '会后整理文档再反馈', scores: { I: 2 } }
        ]
      },
      {
        q: '你更擅长在哪类任务中出成绩？',
        options: [
          { text: '跨团队协同推进', scores: { E: 2 } },
          { text: '混合型任务都可以', scores: { E: 1, I: 1 } },
          { text: '独立深度分析任务', scores: { I: 2 } }
        ]
      },
      {
        q: '做周报时你先写哪部分？',
        options: [
          { text: '本周具体完成项', scores: { S: 2 } },
          { text: '先写亮点再补细节', scores: { S: 1, N: 1 } },
          { text: '先写趋势和下一步', scores: { N: 2 } }
        ]
      },
      {
        q: '面对不确定需求你会？',
        options: [
          { text: '先定义边界和规则', scores: { S: 2 } },
          { text: '边验证边定义边界', scores: { S: 1, N: 1 } },
          { text: '先探索多种可能路径', scores: { N: 2 } }
        ]
      },
      {
        q: '评审方案时你最看重？',
        options: [
          { text: '证据链和可复用性', scores: { T: 2 } },
          { text: '数据和体验并重', scores: { T: 1, F: 1 } },
          { text: '用户感受和团队接受度', scores: { F: 2 } }
        ]
      },
      {
        q: '当成员表现波动时你会？',
        options: [
          { text: '先明确目标和标准', scores: { T: 2 } },
          { text: '先听情况再给要求', scores: { T: 1, F: 1 } },
          { text: '先稳定情绪再推进结果', scores: { F: 2 } }
        ]
      },
      {
        q: '你更常用的推进节奏是？',
        options: [
          { text: '先排里程碑再执行', scores: { J: 2 } },
          { text: '有框架也允许临场调', scores: { J: 1, P: 1 } },
          { text: '轻计划、快迭代', scores: { P: 2 } }
        ]
      },
      {
        q: '遇到计划外变化你一般？',
        options: [
          { text: '评估后重排计划', scores: { J: 2 } },
          { text: '保关键节点，细节灵活', scores: { J: 1, P: 1 } },
          { text: '先行动，再逐步归位', scores: { P: 2 } }
        ]
      },
      {
        q: '你理想的工作板是什么样？',
        options: [
          { text: '任务状态一目了然', scores: { J: 2 } },
          { text: '看板和备忘并存', scores: { J: 1, P: 1 } },
          { text: '轻量记录，现场驱动', scores: { P: 2 } }
        ]
      },
      {
        q: '做复盘时你先回顾什么？',
        options: [
          { text: '目标达成与偏差', scores: { T: 1, S: 1 } },
          { text: '流程与协作的平衡', scores: { T: 1, F: 1 } },
          { text: '未来优化与新机会', scores: { N: 1, P: 1 } }
        ]
      }
    ],
    resultProfiles: sharedMbtiProfiles
  },
  {
    id: 'work_drive',
    type: 'generic',
    title: '职场驱动力测评',
    subtitle: '职业定位',
    description: '识别你在工作中的核心驱动力：突破、稳定、影响、匠心。',
    badge: '实用',
    estimatedMinutes: 4,
    accent: 'teal',
    categoryKey: 'career',
    categoryLabel: '职业发展',
    dimensions: [
      { key: 'action', label: '突破驱动' },
      { key: 'stability', label: '稳定驱动' },
      { key: 'influence', label: '影响驱动' },
      { key: 'craft', label: '匠心驱动' }
    ],
    questions: [
      {
        q: '接到新项目时你最兴奋的是？',
        options: [
          { text: '挑战高目标', scores: { action: 2 } },
          { text: '明确流程与风险', scores: { stability: 2 } },
          { text: '可以带动更多人', scores: { influence: 2 } }
        ]
      },
      {
        q: '你对理想岗位的第一要求是？',
        options: [
          { text: '成长速度快', scores: { action: 2 } },
          { text: '长期确定性强', scores: { stability: 2 } },
          { text: '能做出高质量作品', scores: { craft: 2 } }
        ]
      },
      {
        q: '被认可时你最在意哪句话？',
        options: [
          { text: '你完成了高难目标', scores: { action: 2 } },
          { text: '你让团队更高效', scores: { influence: 2 } },
          { text: '你的专业度很高', scores: { craft: 2 } }
        ]
      },
      {
        q: '遇到变化时你优先做？',
        options: [
          { text: '快速试一版新方案', scores: { action: 2 } },
          { text: '先建好风险边界', scores: { stability: 2 } },
          { text: '先拉齐共识再推进', scores: { influence: 2 } }
        ]
      },
      {
        q: '你更有成就感的时刻是？',
        options: [
          { text: '打破历史记录', scores: { action: 2 } },
          { text: '系统稳定持续运行', scores: { stability: 2 } },
          { text: '细节做到无可挑剔', scores: { craft: 2 } }
        ]
      },
      {
        q: '团队里你自然扮演？',
        options: [
          { text: '冲锋推进者', scores: { action: 2 } },
          { text: '协调连接者', scores: { influence: 2 } },
          { text: '质量守门员', scores: { craft: 2 } }
        ]
      },
      {
        q: '任务过载时你通常会？',
        options: [
          { text: '先攻克最难点', scores: { action: 2 } },
          { text: '先稳住优先级', scores: { stability: 2 } },
          { text: '协调资源分担压力', scores: { influence: 2 } }
        ]
      },
      {
        q: '你愿意在哪类组织成长？',
        options: [
          { text: '高增速快变化组织', scores: { action: 2 } },
          { text: '结构成熟稳定组织', scores: { stability: 2 } },
          { text: '强调专业深度组织', scores: { craft: 2 } }
        ]
      },
      {
        q: '你理想的晋升路径是？',
        options: [
          { text: '以结果驱动晋升', scores: { action: 2 } },
          { text: '带团队扩大影响', scores: { influence: 2 } },
          { text: '专家路径持续深耕', scores: { craft: 2 } }
        ]
      },
      {
        q: '你对职业风险的态度是？',
        options: [
          { text: '可控范围内大胆试错', scores: { action: 2 } },
          { text: '先稳再快', scores: { stability: 2 } },
          { text: '看是否能放大长期影响', scores: { influence: 2 } }
        ]
      }
    ],
    resultProfiles: {
      action: {
        title: '突破型驱动',
        desc: '你被挑战、速度和目标感激活，适合高成长与高反馈环境。',
        tips: ['使用季度目标管理冲劲，避免短跑过热。', '寻找一个稳定搭档，提升策略落地率。'],
        cityVibe: ['增速快', '机会密度高']
      },
      stability: {
        title: '稳健型驱动',
        desc: '你重视可持续和确定性，擅长把复杂事务长期稳定运转。',
        tips: ['稳定主线中加入小比例创新任务。', '主动输出方法论，提升影响力可见度。'],
        cityVibe: ['产业稳', '生活秩序强']
      },
      influence: {
        title: '影响型驱动',
        desc: '你在协同组织和带动他人中获得动力，适合跨团队岗位。',
        tips: ['强化数据表达，让影响力更有说服力。', '维护关键关系网络，放大协同效率。'],
        cityVibe: ['协作场景多', '组织机会丰富']
      },
      craft: {
        title: '匠心型驱动',
        desc: '你追求专业深度与作品质量，适合长期主义的专业路径。',
        tips: ['把深度成果产品化，扩大业务价值。', '定期公开分享，建立专业品牌。'],
        cityVibe: ['专业密度高', '深耕土壤好']
      }
    }
  },
  {
    id: 'communication_mode',
    type: 'generic',
    title: '沟通风格识别',
    subtitle: '协作沟通',
    description: '识别你在合作关系中的默认沟通方式：直连、分析、共情、组织。',
    badge: '协作',
    estimatedMinutes: 4,
    accent: 'green',
    categoryKey: 'social',
    categoryLabel: '沟通协作',
    dimensions: [
      { key: 'direct', label: '直连表达' },
      { key: 'analytic', label: '分析表达' },
      { key: 'empathetic', label: '共情表达' },
      { key: 'structured', label: '组织表达' }
    ],
    questions: [
      {
        q: '在会议里你最常见的开场方式是？',
        options: [
          { text: '先说结论和诉求', scores: { direct: 2 } },
          { text: '先给背景和数据', scores: { analytic: 2 } },
          { text: '先对齐感受与目标', scores: { empathetic: 2 } }
        ]
      },
      {
        q: '你最在意一次沟通是否成功的标准是？',
        options: [
          { text: '对方立刻知道要做什么', scores: { direct: 2 } },
          { text: '逻辑清晰、证据充分', scores: { analytic: 2 } },
          { text: '关系没有受损且彼此理解', scores: { empathetic: 2 } }
        ]
      },
      {
        q: '当对方说“我没听懂”时你会？',
        options: [
          { text: '重说关键结论', scores: { direct: 2 } },
          { text: '换一种结构再解释', scores: { structured: 2 } },
          { text: '先确认对方困惑点', scores: { empathetic: 2 } }
        ]
      },
      {
        q: '处理分歧时你优先采取？',
        options: [
          { text: '直接摆问题与边界', scores: { direct: 2 } },
          { text: '把争议拆成可验证点', scores: { analytic: 2 } },
          { text: '先缓和情绪再谈事实', scores: { empathetic: 2 } }
        ]
      },
      {
        q: '你更喜欢哪种反馈方式？',
        options: [
          { text: '直接、可执行、短句', scores: { direct: 2 } },
          { text: '完整逻辑与依据', scores: { analytic: 2 } },
          { text: '先肯定后建议', scores: { empathetic: 2 } }
        ]
      },
      {
        q: '跨部门推进时你更依赖？',
        options: [
          { text: '明确责任人和截止时间', scores: { structured: 2 } },
          { text: '观点证据与影响分析', scores: { analytic: 2 } },
          { text: '关系维护与信任基础', scores: { empathetic: 2 } }
        ]
      },
      {
        q: '面对含糊请求你会先做什么？',
        options: [
          { text: '问清“要什么结果”', scores: { direct: 2 } },
          { text: '追问“为什么要做”', scores: { analytic: 2 } },
          { text: '确认“谁会受影响”', scores: { empathetic: 2 } }
        ]
      },
      {
        q: '你习惯把信息组织成？',
        options: [
          { text: '结论先行 + 要求动作', scores: { direct: 2, structured: 1 } },
          { text: '事实-分析-结论', scores: { analytic: 2, structured: 1 } },
          { text: '背景-感受-共识', scores: { empathetic: 2, structured: 1 } }
        ]
      },
      {
        q: '当沟通压力大时你更容易？',
        options: [
          { text: '讲得很快很直接', scores: { direct: 2 } },
          { text: '反复补充细节证明', scores: { analytic: 2 } },
          { text: '优先维持关系和谐', scores: { empathetic: 2 } }
        ]
      },
      {
        q: '你希望别人如何和你沟通？',
        options: [
          { text: '先结论，后细节', scores: { direct: 2 } },
          { text: '先逻辑，后行动', scores: { analytic: 2 } },
          { text: '先理解，后建议', scores: { empathetic: 2 } }
        ]
      }
    ],
    resultProfiles: {
      direct: {
        title: '直连表达型',
        desc: '你习惯快速、直接地对齐目标与动作，推进效率高。',
        tips: ['关键场景加一句背景，减少对方理解成本。', '先结论后补理由，兼顾速度和接受度。'],
        cityVibe: ['高效率', '执行导向']
      },
      analytic: {
        title: '分析表达型',
        desc: '你重视逻辑和证据，擅长把复杂问题讲清楚。',
        tips: ['控制信息密度，给对方留消化空间。', '结论前置，减少信息过载。'],
        cityVibe: ['专业氛围', '理性协作']
      },
      empathetic: {
        title: '共情表达型',
        desc: '你擅长识别情绪与关系信号，利于建立长期信任。',
        tips: ['共情后明确动作和边界。', '避免只讲感受不落行动。'],
        cityVibe: ['包容友好', '关系温和']
      },
      structured: {
        title: '组织表达型',
        desc: '你擅长把信息结构化，能稳定多人协同场景的沟通质量。',
        tips: ['固定模板：目标-现状-方案-下一步。', '每次沟通保留一个可追踪结论。'],
        cityVibe: ['协作有序', '流程成熟']
      }
    }
  },
  {
    id: 'decision_style',
    type: 'generic',
    title: '决策风格测评',
    subtitle: '思考方式',
    description: '看你在高压和不确定环境下更偏向哪类决策路径：数据、直觉、速度、稳健。',
    badge: '思维',
    estimatedMinutes: 4,
    accent: 'blue',
    categoryKey: 'growth',
    categoryLabel: '策略成长',
    dimensions: [
      { key: 'data', label: '数据判断' },
      { key: 'intuition', label: '直觉判断' },
      { key: 'speed', label: '速度判断' },
      { key: 'prudence', label: '稳健判断' }
    ],
    questions: [
      {
        q: '面对新机会你先做什么？',
        options: [
          { text: '收集关键数据', scores: { data: 2 } },
          { text: '看是否和方向一致', scores: { intuition: 2 } },
          { text: '先小步试一版', scores: { speed: 2 } }
        ]
      },
      {
        q: '你最常用的判断依据是？',
        options: [
          { text: '证据和历史表现', scores: { data: 2 } },
          { text: '经验和模式感知', scores: { intuition: 2 } },
          { text: '风险边界和兜底方案', scores: { prudence: 2 } }
        ]
      },
      {
        q: '当截止临近信息不足时你会？',
        options: [
          { text: '补齐最小必要数据', scores: { data: 2 } },
          { text: '先拍板，再复盘迭代', scores: { speed: 2 } },
          { text: '延后决策，先保安全', scores: { prudence: 2 } }
        ]
      },
      {
        q: '你最不能接受哪种决策后果？',
        options: [
          { text: '判断没有依据', scores: { data: 2 } },
          { text: '错过窗口期', scores: { speed: 2 } },
          { text: '不可控的系统性风险', scores: { prudence: 2 } }
        ]
      },
      {
        q: '你在复盘时更关注？',
        options: [
          { text: '指标变化是否符合假设', scores: { data: 2 } },
          { text: '是否抓住了本质趋势', scores: { intuition: 2 } },
          { text: '风险预案是否生效', scores: { prudence: 2 } }
        ]
      },
      {
        q: '两种方案都可行时你更倾向？',
        options: [
          { text: '先算收益成本比', scores: { data: 2 } },
          { text: '选执行更快的一条', scores: { speed: 2 } },
          { text: '选可回撤空间更大的', scores: { prudence: 2 } }
        ]
      },
      {
        q: '突发变化时你第一反应？',
        options: [
          { text: '定位关键变量', scores: { data: 2 } },
          { text: '凭经验先定方向', scores: { intuition: 2 } },
          { text: '先止损，再评估', scores: { prudence: 2 } }
        ]
      },
      {
        q: '你更常在哪种场景发挥优势？',
        options: [
          { text: '可量化、可验证任务', scores: { data: 2 } },
          { text: '高模糊的探索任务', scores: { intuition: 2 } },
          { text: '高压快节奏任务', scores: { speed: 2 } }
        ]
      },
      {
        q: '你做关键决策时会？',
        options: [
          { text: '设置明确决策阈值', scores: { data: 2, prudence: 1 } },
          { text: '预判二阶影响', scores: { intuition: 2, prudence: 1 } },
          { text: '限定时长快速定案', scores: { speed: 2 } }
        ]
      },
      {
        q: '你最希望强化哪一块能力？',
        options: [
          { text: '把感觉变成可验证指标', scores: { data: 2 } },
          { text: '在不确定中快速行动', scores: { speed: 2 } },
          { text: '在快速中保持稳健', scores: { prudence: 2 } }
        ]
      }
    ],
    resultProfiles: {
      data: {
        title: '数据决策型',
        desc: '你重视证据和可验证性，擅长建立清晰判断标准。',
        tips: ['避免分析过久，设置决策截止时间。', '当数据不足时预设试验机制。'],
        cityVibe: ['理性环境', '专业支持']
      },
      intuition: {
        title: '直觉洞察型',
        desc: '你擅长在模糊信息中识别模式，快速抓住方向性机会。',
        tips: ['把直觉写成假设并追踪验证。', '关键节点补一轮反证思考。'],
        cityVibe: ['创新友好', '变化机会多']
      },
      speed: {
        title: '快速行动型',
        desc: '你有很强的窗口意识和执行动能，适合高节奏场景。',
        tips: ['先定义可接受损失，再加速推进。', '快速决策后安排复盘闭环。'],
        cityVibe: ['节奏快', '执行密度高']
      },
      prudence: {
        title: '稳健风控型',
        desc: '你擅长识别边界和风险，在复杂局面中保持可持续。',
        tips: ['避免过度保守，设置小规模试错区。', '将风险语言转为行动清单。'],
        cityVibe: ['秩序稳定', '可控性强']
      }
    }
  },
  {
    id: 'energy_reset',
    type: 'generic',
    title: '情绪恢复力测评',
    subtitle: '心理韧性',
    description: '识别你的恢复模式：觉察、复原、边界、支持网络。',
    badge: '成长',
    estimatedMinutes: 4,
    accent: 'purple',
    categoryKey: 'resilience',
    categoryLabel: '心理韧性',
    dimensions: [
      { key: 'awareness', label: '情绪觉察' },
      { key: 'recovery', label: '恢复速度' },
      { key: 'boundary', label: '边界管理' },
      { key: 'support', label: '支持连接' }
    ],
    questions: [
      {
        q: '压力上来时你通常先做什么？',
        options: [
          { text: '先识别自己在紧张', scores: { awareness: 2 } },
          { text: '立即做一个恢复动作', scores: { recovery: 2 } },
          { text: '先降低外界干扰', scores: { boundary: 2 } }
        ]
      },
      {
        q: '情绪低落的一天你更像？',
        options: [
          { text: '会记录触发点', scores: { awareness: 2 } },
          { text: '靠睡眠/运动修复', scores: { recovery: 2 } },
          { text: '找可信任的人聊聊', scores: { support: 2 } }
        ]
      },
      {
        q: '面对高压关系你更常见？',
        options: [
          { text: '先稳住自我感受', scores: { awareness: 2 } },
          { text: '先明确边界与规则', scores: { boundary: 2 } },
          { text: '借助外部支持资源', scores: { support: 2 } }
        ]
      },
      {
        q: '你恢复状态最快的方式是？',
        options: [
          { text: '结构化复盘', scores: { awareness: 2 } },
          { text: '切换场景补充能量', scores: { recovery: 2 } },
          { text: '与支持者建立连接', scores: { support: 2 } }
        ]
      },
      {
        q: '当他人情绪影响你时，你会？',
        options: [
          { text: '区分我的感受与对方感受', scores: { awareness: 2 } },
          { text: '主动减少接触频率', scores: { boundary: 2 } },
          { text: '寻找第三方视角', scores: { support: 2 } }
        ]
      },
      {
        q: '突发失控事件里你会先？',
        options: [
          { text: '回到呼吸和身体感受', scores: { recovery: 2 } },
          { text: '切断无效输入', scores: { boundary: 2 } },
          { text: '同步给可信对象', scores: { support: 2 } }
        ]
      },
      {
        q: '你能否及早发现“快撑不住了”？',
        options: [
          { text: '通常能较早发现', scores: { awareness: 2 } },
          { text: '多数到后期才发现', scores: { recovery: 2 } },
          { text: '多依赖他人提醒', scores: { support: 2 } }
        ]
      },
      {
        q: '你最想强化哪种能力？',
        options: [
          { text: '更细的自我觉察', scores: { awareness: 2 } },
          { text: '更快回稳', scores: { recovery: 2 } },
          { text: '更清晰说“不”', scores: { boundary: 2 } }
        ]
      },
      {
        q: '工作生活冲突时你优先保护？',
        options: [
          { text: '睡眠和身心节奏', scores: { recovery: 2 } },
          { text: '时间与注意力边界', scores: { boundary: 2 } },
          { text: '关键支持关系', scores: { support: 2 } }
        ]
      },
      {
        q: '你对求助的默认态度是？',
        options: [
          { text: '先自我观察再求助', scores: { awareness: 2 } },
          { text: '卡住就主动求助', scores: { support: 2 } },
          { text: '尽量靠自己并控边界', scores: { boundary: 2 } }
        ]
      }
    ],
    resultProfiles: {
      awareness: {
        title: '觉察恢复型',
        desc: '你擅长识别触发点，能够较早发现状态变化并及时调整。',
        tips: ['把觉察结果转成具体动作。', '每周复盘一次高压触发情境。'],
        cityVibe: ['节奏可调', '环境友好']
      },
      recovery: {
        title: '复原行动型',
        desc: '你在波动后回升速度快，擅长通过行动快速回稳。',
        tips: ['建立专属恢复清单并标准化。', '高压周期前置恢复资源。'],
        cityVibe: ['生活便利', '恢复资源丰富']
      },
      boundary: {
        title: '边界稳定型',
        desc: '你通过边界管理降低外耗，让有限精力聚焦真正重要的事。',
        tips: ['把边界表达模板化。', '提前同步可用时段和合作规则。'],
        cityVibe: ['低噪区多', '节奏稳定']
      },
      support: {
        title: '连接支持型',
        desc: '你通过高质量连接获取恢复能量，善于借助支持网络度压。',
        tips: ['维护 3-5 位稳定支持对象。', '求助时明确你需要的帮助类型。'],
        cityVibe: ['社群友好', '协作氛围强']
      }
    }
  },
  {
    id: 'big5_lite',
    type: 'generic',
    title: 'Big Five 轻量版',
    subtitle: '特质补充',
    description: '基于 OCEAN 维度做 10 题轻量自评，用于补充你的人格特质视角。',
    badge: '新模型',
    estimatedMinutes: 4,
    accent: 'orange',
    categoryKey: 'growth',
    categoryLabel: '策略成长',
    dimensions: [
      { key: 'openness', label: '开放性' },
      { key: 'conscientiousness', label: '尽责性' },
      { key: 'extraversion', label: '外向性' },
      { key: 'agreeableness', label: '宜人性' },
      { key: 'stability', label: '情绪稳定' }
    ],
    questions: [
      {
        q: '面对新方法你通常？',
        options: [
          { text: '很愿意试新路子', scores: { openness: 2 } },
          { text: '先小范围尝试', scores: { openness: 1, conscientiousness: 1 } },
          { text: '优先沿用成熟路径', scores: { conscientiousness: 2 } }
        ]
      },
      {
        q: '你处理任务的默认方式是？',
        options: [
          { text: '先列清单按序推进', scores: { conscientiousness: 2 } },
          { text: '关键节点清晰即可', scores: { conscientiousness: 1, openness: 1 } },
          { text: '更依赖临场状态', scores: { openness: 1, extraversion: 1 } }
        ]
      },
      {
        q: '在群体活动里你通常？',
        options: [
          { text: '主动组织互动', scores: { extraversion: 2 } },
          { text: '有需要时再发言', scores: { extraversion: 1, agreeableness: 1 } },
          { text: '更享受小范围交流', scores: { agreeableness: 1, stability: 1 } }
        ]
      },
      {
        q: '当别人和你观点不同，你更可能？',
        options: [
          { text: '坚持观点并快速辩论', scores: { extraversion: 1, openness: 1 } },
          { text: '先理解再表达分歧', scores: { agreeableness: 2 } },
          { text: '先冷静观察情境', scores: { stability: 2 } }
        ]
      },
      {
        q: '遇到计划外变化时你一般？',
        options: [
          { text: '迅速调整并继续推进', scores: { stability: 2 } },
          { text: '先评估影响再调整', scores: { conscientiousness: 2 } },
          { text: '把它当作新机会探索', scores: { openness: 2 } }
        ]
      },
      {
        q: '你更有动力的工作环境是？',
        options: [
          { text: '变化大、挑战多', scores: { openness: 2, extraversion: 1 } },
          { text: '规则清晰、可持续', scores: { conscientiousness: 2 } },
          { text: '关系温和、支持感强', scores: { agreeableness: 2 } }
        ]
      },
      {
        q: '当压力上升时你常见反应是？',
        options: [
          { text: '能较快稳住节奏', scores: { stability: 2 } },
          { text: '会明显焦虑但能恢复', scores: { stability: 1, conscientiousness: 1 } },
          { text: '容易被情绪持续影响', scores: { agreeableness: 1 } }
        ]
      },
      {
        q: '你对长期目标的执行方式是？',
        options: [
          { text: '按阶段目标持续推进', scores: { conscientiousness: 2 } },
          { text: '保持方向，灵活前进', scores: { openness: 2 } },
          { text: '依赖外部协作驱动', scores: { extraversion: 2 } }
        ]
      },
      {
        q: '你更重视团队中的什么？',
        options: [
          { text: '成果速度', scores: { extraversion: 1, conscientiousness: 1 } },
          { text: '彼此信任和支持', scores: { agreeableness: 2 } },
          { text: '自主探索空间', scores: { openness: 2 } }
        ]
      },
      {
        q: '你理想的个人节奏更接近？',
        options: [
          { text: '稳定、可预测', scores: { conscientiousness: 1, stability: 1 } },
          { text: '动态、多变化', scores: { openness: 1, extraversion: 1 } },
          { text: '柔和、关系导向', scores: { agreeableness: 1, stability: 1 } }
        ]
      }
    ],
    resultProfiles: {
      openness: {
        title: '开放探索型',
        desc: '你对新体验和新观点更开放，适合创新与跨界场景。',
        tips: ['把探索拆成最小试验，控制节奏。', '记录有效模式，避免重复试错。'],
        cityVibe: ['创意氛围', '新机会多']
      },
      conscientiousness: {
        title: '尽责执行型',
        desc: '你重视规划、责任和稳定推进，适合长期工程任务。',
        tips: ['在确定性中保留试验空间。', '避免过度追求完美影响速度。'],
        cityVibe: ['秩序成熟', '执行环境稳']
      },
      extraversion: {
        title: '外向驱动型',
        desc: '你通过互动和外部反馈获得动能，适合高协作节奏场景。',
        tips: ['高密度协作后安排恢复时段。', '关键决策先沉淀再表达。'],
        cityVibe: ['社交机会多', '反馈循环快']
      },
      agreeableness: {
        title: '协同友好型',
        desc: '你重视合作与关系质量，能稳定团队协同氛围。',
        tips: ['表达善意同时明确边界。', '冲突场景先对齐目标再对齐情绪。'],
        cityVibe: ['包容度高', '关系友好']
      },
      stability: {
        title: '情绪稳定型',
        desc: '你在压力下更容易保持平衡，适合高负荷但需稳态输出的环境。',
        tips: ['建立预警信号，提前减压。', '保留固定恢复动作，维持长期状态。'],
        cityVibe: ['生活可控', '节奏稳定']
      }
    }
  }
];

const moduleCatalog = rawModules.map((item) => {
  if (item.type === 'generic') {
    return Object.assign({}, item, { questionCount: item.questions.length });
  }
  return item;
});

function getModuleById(id) {
  return moduleCatalog.find((item) => item.id === id);
}

function getGenericModules() {
  return moduleCatalog.filter((item) => item.type === 'generic');
}

module.exports = {
  moduleCatalog,
  getModuleById,
  getGenericModules
};

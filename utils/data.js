// SBTI人格数据 - 基于 https://github.com/serenakeyitan/sbti-wiki
// 图片来源: sbti-wiki 项目 / 内容遵循 CC BY-NC-SA 4.0 许可证

const personalities = [
  {
    code: "CTRL",
    name: "拿捏者",
    desc: "你是一个天生的「人生管理者」，控场能力拉满，压力越大越冷静。不但自己能稳住，还能拽着别人往前走。朋友崩溃时第一个想到你，因为你知道怎么让人回到正轨。",
    rarity: "3.61%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/CTRL.png"
  },
  {
    code: "ATM-er",
    name: "送钱者",
    desc: "你沉默地承担着一切，从不说累。别人觉得你靠谱，你自己觉得还好。安全感来自于被需要，但偶尔也会想：我呢？谁来管我？",
    rarity: "2.46%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/ATM-er.png"
  },
  {
    code: "Dior-s",
    name: "屌丝",
    desc: "看破红尘但过得挺舒服的躺平老哲人型人格。信奉简单真理：躺着比站着舒服，饭点到了就得干饭。你有自己的节奏，不被世俗定义。",
    rarity: "5.23%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/Dior-s.jpg"
  },
  {
    code: "BOSS",
    name: "老板",
    desc: "方向盘给我，我来开。效率至上，结果导向。你对自己狠，对别人也狠，但在高压职业环境中如鱼得水。边界感强，重视 autonomy。",
    rarity: "1.53%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/BOSS.png"
  },
  {
    code: "THAN-K",
    name: "感恩者",
    desc: "你相信人性本善，愿意信任关系。活得通透，边界清晰，说话直接。意义感强，觉得人生是有方向的。偶尔被说太乐观，但你不在意。",
    rarity: "7.76%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/THAN-K.png"
  },
  {
    code: "OH-NO",
    name: "哦不人",
    desc: "控场型秩序守护神。对失控容忍度极低，善于预见风险并提前化解。社交偏被动，边界感强。内心戏：万一出事怎么办？不，不会出事的。",
    rarity: "约3%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/OH-NO.png"
  },
  {
    code: "GOGO",
    name: "行者",
    desc: "对他们来说世界上只有两种状态：已完成，和即将被我完成。务实、边界清晰、说干就干。社交上不主动但也不拒绝你来我往。",
    rarity: "3.05%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/GOGO.png"
  },
  {
    code: "SEXY",
    name: "尤物",
    desc: "天生到哪里都吸引注意力，熟悉后容易和别人融为一体。自信清晰，情感投入深，但边界感偏弱——说白了就是很有魅力但不设防。",
    rarity: "5.94%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/SEXY.png"
  },
  {
    code: "LOVE-R",
    name: "多情者",
    desc: "内心戏丰富，但把内心翻译成现实是短板。情感充沛、意义感强、表达真实。想的太多做的太少，浪漫但执行力需要充值。",
    rarity: "4.23%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/LOVE-R.png"
  },
  {
    code: "MUM",
    name: "妈妈",
    desc: "高情商照顾者型人格，善于感知和治愈他人情绪。但往往低估自己的需求，对自己的关心比别人给你的少。",
    rarity: "约4%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/MUM.png"
  },
  {
    code: "FAKE",
    name: "伪人",
    desc: "社交自信拉满但内在基础薄弱——人设完美但内心空洞。不同场合切换不同人格，但最底层没有稳定的自己。核心不是恶意，是空虚。",
    rarity: "6.61%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/FAKE.png"
  },
  {
    code: "OJBK",
    name: "无所谓人",
    desc: "「都行」是你的哲学，不是选择困难，是equilibrium已达到化境。你有自己的价值观，但表面波澜不惊。当凡人面临世纪抉择时，你轻飘飘吐出两个字：都行。",
    rarity: "9.92%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/OJBK.png"
  },
  {
    code: "MALO",
    name: "吗喽",
    desc: "灵活遵守规则但需要时也能交付的「成熟的小屁孩」。人生是付费游戏，规则是用来打破的，但有时候还是得玩下去。规则感强但执行灵活。",
    rarity: "5.71%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/MALO.png"
  },
  {
    code: "JOKE-R",
    name: "小丑",
    desc: "用最大的笑声掩盖最深的伤疤。社交氛围担当，幽默是你的铠甲。但当卸下面具，你发现最后一层只有回声：惊不惊喜？",
    rarity: "2.99%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/JOKE-R.jpg"
  },
  {
    code: "WOC!",
    name: "握草人",
    desc: "外表惊呼「卧槽」，内心其实在分析。表面波动大，实际很淡定。思考方式接近THIN-K，但表达更直接，真实度更高。",
    rarity: "2.04%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/WOC.png"
  },
  {
    code: "THIN-K",
    name: "思考者",
    desc: "脑内审查所有输入信息再决定是否放行。边界感强，个人空间神圣不可侵犯。关系里会留后路，交友但不轻信。有点像挑剔的知识分子。",
    rarity: "2.24%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/THIN-K.png"
  },
  {
    code: "SHIT",
    name: "愤世者",
    desc: "嘴硬心软——一边骂世界一边拯救世界。说啥都是shit，但默默干着拯救世界的活。你的抱怨不是投降，是战斗前的嚎叫。",
    rarity: "2.53%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/SHIT.png"
  },
  {
    code: "ZZZZ",
    name: "装死人",
    desc: "看起来像休眠状态，一到死线就觉醒。舒适第一，个人空间神圣。死线战士——和deadline有深厚的革命友谊。",
    rarity: "4.68%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/ZZZZ.png"
  },
  {
    code: "POOR",
    name: "贫困者",
    desc: "把所有精力集中在一个方向如激光般精准。社交和情感维度偏低，但这是主动选择的生活方式——拒绝干扰、社交噪音和虚荣，专注深耕唯一重要的事。",
    rarity: "1.68%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/POOR.png"
  },
  {
    code: "MONK",
    name: "僧人",
    desc: "已经「跳出三界外」的存在。个人空间是圣地，亲密关系谨慎对待。像行星保持宇宙级距离一样保持情感距离，喜欢独立工作。",
    rarity: "2.8%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/MONK.png"
  },
  {
    code: "IMSB",
    name: "内耗人",
    desc: "内心戏能比整个漫威电影宇宙还多。外在平静内在风暴，情绪敏感、想太多、决定困难。关系里熟悉了就容易融合，边界感弱。",
    rarity: "约3%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/IMSB.png"
  },
  {
    code: "SOLO",
    name: "孤儿",
    desc: "外表像刺猬，内心其实很软。过往的伤建起了高墙，预设性地把人往外推。自尊偏低，情感投入克制，需要空间但也渴望被理解。",
    rarity: "3.72%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/SOLO.png"
  },
  {
    code: "FUCK",
    name: "草者",
    desc: "打不死的野草，社会规则除草剂都喷不死。反叛型人格，不按牌理出牌，高社交主动性、高真实度、低规划。想干嘛就干嘛的自由灵魂。",
    rarity: "3.38%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/FUCK.png"
  },
  {
    code: "DEAD",
    name: "死者",
    desc: "顶级摆烂——像玩家打通了所有主线支线隐藏任务，删档后重新开始发现游戏已经不好玩了。不是普通的累，是真的没有动力了。",
    rarity: "约2%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/DEAD.png"
  },
  {
    code: "IMFW",
    name: "废物",
    desc: "和DEAD几乎一样，但S3核心价值为高而不是低——他们渴望成功但反复被否定导致不再相信自己。最可怜的人格类型。",
    rarity: "2.12%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/IMFW.png"
  },
  {
    code: "HHHH",
    name: "傻乐者",
    desc: "你的思维太独特了，标准人格数据库已经完全崩溃。这是系统在你偏离标准人格类型太远、无法匹配时的最后手段。",
    rarity: "0.06%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/HHHH.png"
  },
  {
    code: "DRUNK",
    name: "酒鬼",
    desc: "隐藏人格！当你在喝酒题选择了把白酒装保温杯当水喝这个选项时触发。正常评分系统完全被跳过，100%匹配，标注为「酒精异常因子已接管」。",
    rarity: "0.8%",
    image: "https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/images/DRUNK.png"
  }
];

// 15维度顺序
const dimensions = ["S1", "S2", "S3", "E1", "E2", "E3", "A1", "A2", "A3", "Ac1", "Ac2", "Ac3", "So1", "So2", "So3"];

// 维度名称
const dimensionNames = {
  "S1": "自尊自信",
  "S2": "自我清晰度",
  "S3": "核心价值",
  "E1": "依恋安全感",
  "E2": "情感投入度",
  "E3": "边界与依赖",
  "A1": "世界观倾向",
  "A2": "规则与灵活度",
  "A3": "人生意义感",
  "Ac1": "动机导向",
  "Ac2": "决策风格",
  "Ac3": "执行模式",
  "So1": "社交主动性",
  "So2": "人际边界感",
  "So3": "表达与真实度"
};

// H/M/L 模式对应的描述
const levelDescriptions = {
  "H": {
    "S1": "对自己大致有数，不太会被路人一句话打散",
    "S2": "对自己的脾气、欲望和底线都算门儿清",
    "S3": "很容易被目标、成长或某种重要信念推着往前",
    "E1": "更愿意相信关系本身，不会被一点风吹草动吓散",
    "E2": "一旦认定就容易认真，情绪和精力都给得很足",
    "E3": "空间感很重要，再爱也得留一块属于自己的地",
    "A1": "更愿意相信人性和善意，遇事不急着把世界判死刑",
    "A2": "秩序感较强，能按流程来就不爱即兴炸场",
    "A3": "做事更有方向，知道自己大概要往哪边走",
    "Ac1": "更容易被成果、成长和推进感点燃",
    "Ac2": "拍板速度快，决定一下就不爱回头磨叽",
    "Ac3": "推进欲比较强，事情不落地心里都像卡了根刺",
    "So1": "更愿意主动打开场子，在人群里不太怕露头",
    "So2": "边界感偏强，靠太近会先本能性后退半步",
    "So3": "对不同场景的自我切换更熟练，真实感会分层发放"
  },
  "M": {
    "S1": "自信值随天气波动，顺风能飞，逆风先缩",
    "S2": "平时还能认出自己，偶尔也会被情绪临时换号",
    "S3": "想上进，也想躺会儿，价值排序经常内部开会",
    "E1": "一半信任，一半试探，感情里常在心里拉锯",
    "E2": "会投入，但会给自己留后手，不至于全盘梭哈",
    "E3": "亲密和独立都要一点，属于可调节型依赖",
    "A1": "既不天真也不彻底阴谋论，观望是你的本能",
    "A2": "该守的时候守，该变通的时候也不死磕",
    "A3": "偶尔有目标，偶尔也想摆烂，人生观处于半开机",
    "Ac1": "有时想赢，有时只想别麻烦，动机比较混合",
    "Ac2": "会想，但不至于想死机，属于正常犹豫",
    "Ac3": "能做，但状态看时机，偶尔稳偶尔摆",
    "So1": "有人来就接，没人来也不硬凑，社交弹性一般",
    "So2": "既想亲近又想留缝，边界感看对象调节",
    "So3": "会看气氛说话，真实和体面通常各留一点"
  },
  "L": {
    "S1": "对自己下手比别人还狠，夸你两句你都想先验明真伪",
    "S2": "内心频道雪花较多，常在我是谁里循环缓存",
    "S3": "更在意舒服和安全，没必要天天给人生开冲刺模式",
    "E1": "感情里警报器灵敏，已读不回都能脑补到大结局",
    "E2": "感情投入偏克制，心门不是没开，是门禁太严",
    "E3": "容易黏人也容易被黏，关系里的温度感很重要",
    "A1": "看世界自带防御滤镜，先怀疑，再靠近",
    "A2": "规则能绕就绕，舒服和自由往往排在前面",
    "A3": "意义感偏低，容易觉得很多事都像在走过场",
    "Ac1": "做事先考虑别翻车，避险系统比野心更先启动",
    "Ac2": "做决定前容易多转几圈，脑内会议常常超时",
    "Ac3": "执行力和死线有深厚感情，越晚越像要觉醒",
    "So1": "社交启动慢热，主动出击这事通常得攒半天气",
    "So2": "关系里更想亲近和融合，熟了就容易把人划进内圈",
    "So3": "表达更直接，心里有啥基本不爱绕"
  }
};

module.exports = {
  personalities,
  dimensions,
  dimensionNames,
  levelDescriptions
};

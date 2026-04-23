# SBIT 人格实验室（微信小程序）

一个娱乐向人格测试小程序，融合了：
- SBTI 主画像（核心人格匹配）
- MBTI 补充维度（E/I、S/N、T/F、J/P）
- 城市适配推荐（职业偏好 + 四轴权重调节）

项目已支持断点续测、结果分享、海报生成、城市推荐偏好持久化。

## 1. 功能概览

### 1.1 测试流程
- 总题量：43 题
- 题型结构：31 题 SBTI + 12 题 MBTI
- 支持自动保存答题进度与继续上次测试
- 支持重新开始并清除历史进度

### 1.2 结果页能力
- SBTI 人格类型与匹配度
- MBTI 倾向结果 + 判定清晰度
- 生活方式标签与行动建议
- 城市推荐 Top 3（含多维度匹配条）
- 职业偏好筛选：综合/技术/金融/创意/制造/科研/生活方式
- 城市权重调节：社交/创新/决策/秩序（1~4）
- 预设权重：平衡/职业发展/机会社交/稳定可控
- 偏好持久化（下次进入自动恢复）
- 复制结果文案、海报生成、保存相册、分享

## 2. 目录结构

```text
sbit-miniapp/
├─ app.js
├─ app.json
├─ app.wxss
├─ pages/
│  ├─ index/
│  │  ├─ index.js
│  │  ├─ index.wxml
│  │  └─ index.wxss
│  └─ result/
│     ├─ result.js
│     ├─ result.wxml
│     └─ result.wxss
├─ utils/
│  ├─ data.js
│  └─ questions.js
└─ docs/
   ├─ ALGORITHM.md
   └─ TESTING.md
```

## 3. 本地运行（微信开发者工具）

### 3.1 环境准备
- 安装微信开发者工具（稳定版）
- 拥有一个可用的小程序 AppID（可选：测试号）

### 3.2 打开项目
1. 微信开发者工具 -> 导入项目
2. 目录选择当前项目根目录 `sbit-miniapp`
3. 选择 AppID 或测试号
4. 编译运行

### 3.3 推荐测试顺序
1. 首页 -> 开始测试 -> 完成 43 题 -> 结果页
2. 中途退出 -> 重新进入 -> 继续上次
3. 结果页切换职业偏好与权重
4. 复制文案、生成海报、保存相册

详见文档：[docs/TESTING.md](docs/TESTING.md)

## 4. 关键业务逻辑

### 4.1 题库与评分
- 题库定义在 `utils/questions.js`
- SBTI 核心匹配沿用模式比对（15 维 H/M/L）
- MBTI 使用补充题进行四轴计算

### 4.2 城市推荐
- 城市画像采用四轴向量：`social / innovation / logic / order`
- 支持两层加权：
  - 职业偏好加权（career boost）
  - 维度权重加权（axis weights）
- 最终输出 Top 3 城市及分维度匹配条

详见文档：[docs/ALGORITHM.md](docs/ALGORITHM.md)

## 5. 本地存储 Key

- `sbti_answers`：最终答题结果
- `sbti_progress_v3`：答题中断点进度
- `sbti_city_pref_v1`：结果页职业与权重偏好

## 6. 权限说明

`app.json` 已声明：
- `scope.writePhotosAlbum`：用于保存结果海报

如果保存失败，请在小程序设置里开启相册权限。

## 7. 已知边界

- 结果为娱乐向二创，不用于医学或心理诊断
- 城市推荐是画像匹配模型，不是现实迁居建议
- 海报效果在不同机型可能存在渲染细节差异

## 8. 维护建议

- 修改题库请同步检查总题量与彩蛋索引
- 修改城市算法请同步更新 `docs/ALGORITHM.md`
- 发布前请按 `docs/TESTING.md` 完整回归

## 9. 版权与说明

- SBTI 角色素材参考：`sbti-wiki`（CC BY-NC-SA 4.0）
- MBTI 与城市内容为二创原创表达

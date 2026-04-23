# 算法说明（聚合测试版）

## 1. 双引擎结构

### 1.1 深度主测引擎（`pages/index` + `pages/result`）
- 43 题（SBTI 主维度 + MBTI 补充）
- 输出：
  - SBTI 主画像（模式匹配）
  - MBTI 四轴倾向（E/I、S/N、T/F、J/P）
  - 城市匹配推荐（Top3）

### 1.2 轻量模块引擎（`module-quiz` + `module-result`）
- 所有轻量测试复用通用答题页和通用结果页
- 每个模块在 `utils/module-tests.js` 定义：
  - `dimensions`
  - `questions`
  - `resultProfiles`
- 算法自动计算每个维度得分和占比，选取最高维度作为主导画像

## 2. 轻量模块评分逻辑

1. 初始化各维度 `score=0` 与 `maxScore=0`
2. 遍历每题：
   - 统计每维度当前题可得最大分，累计到 `maxScore`
   - 读取用户选项，累加到 `score`
3. 计算百分比：
   - `percent = round(score / maxScore * 100)`
4. 维度降序排序，取 Top1 作为主导画像
5. Top1 和 Top2 差值映射判定清晰度：
   - `>=16` 高
   - `7~15` 中
   - `<7` 混合

### 2.1 性压抑指数测试（SRI）扩展

- 模块：`sri_repression_index`
- 维度：
  - `inhibition`（抑制防御）
  - `guilt`（内疚压力）
  - `anxiety`（焦虑回避）
  - `norms`（规范压力）
  - `release`（舒展表达）
- 结果页额外计算：
  - `riskAvg = (inhibition + guilt + anxiety + norms) / 4`
  - `sriIndex = clamp(round(riskAvg * 0.75 + (100 - release) * 0.25), 0, 100)`
- 等级：
  - `<40` 低
  - `40~69` 中
  - `>=70` 高
- 说明：该指数为自我观察指标，不等同医学或临床诊断。

### 2.2 成人主题模块（18+）提示机制

- 适用模块在 `module-tests.js` 里标记 `adultOnly: true`
- 在 `module-quiz` 进入前弹窗确认
- 在答题页与结果页显示“18+ 自我观察”提示

## 3. 深度主测城市匹配逻辑

### 3.1 用户向量
- 基于 MBTI 四轴得到初始向量：
  - `social / innovation / logic / order`
- 再用 SBTI 关键维度做二次修正

### 3.2 城市向量与加权
- 每个城市有四轴画像（-3~3）
- 两层加权：
  - 职业偏好加权（Career Boost）
  - 用户自定义权重（1~4）

### 3.3 距离与得分
- `distance = Σ |cityAxis - userAxis| * axisWeight`
- `score = ((maxDistance - distance) / maxDistance) * 100 + careerBoost`
- 最终裁剪到 `0~100`，排序取 Top3

## 4. 数据持久化

### 4.1 深度主测
- `sbti_answers`
- `sbti_progress_v3`
- `sbti_city_pref_v1`

### 4.2 轻量模块
- 进度：`module_progress_<moduleId>`
- 结果：`module_result_<moduleId>`

## 5. 维护原则

- 新增轻量模块时，仅新增 `module-tests.js` 配置，不改通用引擎。
- 题目均为二创原创，不直接复制量表原题。
- 城市结果用于娱乐和自我观察，不提供现实迁居决策建议。

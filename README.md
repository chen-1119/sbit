# SBTI 测试中心（微信小程序）

一个聚合式人格测试小程序，包含深度主测和多个轻量模块，目标是从不同角度形成「人格 x 职业 x 沟通 x 韧性 x 城市」的综合画像。

## 1. 当前模块

### 1.1 深度主测
- `SBTI 人格实验室`（43 题）
- 输出：SBTI 主画像 + MBTI 补充 + 城市匹配 + 海报分享

### 1.2 轻量模块（聚合入口）
- `MBTI 快速倾向测评`（32 题）
- `MBTI 职场协作版`（32 题）
- `职场驱动力测评`（34 题）
- `沟通风格识别`（34 题）
- `决策风格测评`（34 题）
- `情绪恢复力测评`（32 题）
- `麋鹿冬原性格测试`（36 题）
- `麋鹿性偏好人格测试`（40 题，18+）
- `性压抑指数测试`（40 题，18+）
- `Big Five 轻量版`（32 题）

所有轻量模块统一支持：
- 断点续测
- 自动评分
- 结果摘要复制
- 返回测试中心继续下一模块
- 首页按主题分区展示（含成人关系专区）
- 题量统一优化到 30-50 区间（当前为 32-40 题）

## 2. 目录结构

```text
project-root/
├─ app.js
├─ app.json
├─ app.wxss
├─ pages/
│  ├─ home/                # 测试聚合首页
│  ├─ index/               # 深度主测问卷
│  ├─ result/              # 深度主测结果页（含城市匹配）
│  ├─ module-quiz/         # 通用轻量模块答题页
│  └─ module-result/       # 通用轻量模块结果页
├─ utils/
│  ├─ questions.js         # 深度主测题库
│  ├─ data.js              # 深度主测人格素材
│  └─ module-tests.js      # 聚合模块题库
└─ docs/
   ├─ ALGORITHM.md
   └─ TESTING.md
```

## 3. 本地运行（微信开发者工具）

1. 打开微信开发者工具并导入当前项目根目录
2. 选择 AppID（或测试号）
3. 编译后默认进入 `pages/home/home`（聚合首页）

建议至少验证两轮：
- 开发者工具模拟器（快速回归）
- 真机（iOS/Android 各一台）

## 4. 常见报错与修复

### 4.1 `Unexpected token ﻿ in JSON at position 0`
原因：`app.json` 文件头含 BOM。

修复：
- 把文件编码改为 `UTF-8（无 BOM）`
- 确保文件名是 `app.json`（不是 `app.json.json`）

### 4.2 `invalid app.json permission["scope.writePhotosAlbum"]`
原因：`scope.writePhotosAlbum` 不是 `app.json permission` 的有效声明项。

修复：
- 删除该权限声明
- 保存图片时直接使用 `wx.saveImageToPhotosAlbum`，并在运行时处理授权弹窗

### 4.3 `app.wxss unexpected invalid char at pos 1`
原因：`app.wxss` 文件头 BOM 或编码异常。

修复：
- 将 `app.wxss` 保存为 `UTF-8（无 BOM）`

## 5. 内容来源与二创说明

- 深度主测（SBTI）沿用项目内二创设定。
- MBTI 与 Big Five 相关轻量模块采用公开概念框架做题型二创，不复用任何闭源量表原题。
- 城市匹配属于画像化推荐，仅用于娱乐和自我观察，不用于真实迁居决策。
- 调研来源详见：`docs/CONTENT-SOURCES.md`

## 6. 发布前检查

- 按 `docs/TESTING.md` 完整回归
- 检查 `app.json / app.wxss` 无 BOM
- 深度主测与轻量模块至少各跑完 1 轮
- 确认结果页复制、分享、海报、保存逻辑正常

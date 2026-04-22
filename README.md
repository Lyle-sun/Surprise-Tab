# Surprise Tab

每次打开新标签页，随机收获一份惊喜。

## 惊喜模式

| 模式 | 概率 | 内容 |
|------|------|------|
| 翻牌记忆 | 15% | 4×4 Emoji 翻牌配对游戏 |
| 猜数字 | 13% | 猜 1-100 的数字，提示偏大/偏小 |
| 生成艺术 | 15% | Canvas 粒子/万花筒生成画 |
| 冷笑话 | 15% | 内置 200+ 笑话池，可选 AI 生成 |
| 随机决策 | 14% | 帮你选今天吃什么/看什么/做什么 |
| 今日运势 | 14% | 大吉到凶，附带幸运色/数字/方位 |
| AI 抽象画 | 18% | Pollinations.ai 生成离谱抽象图 |
| 隐藏彩蛋 | 10% | 假系统更新 / 终端 / Matrix 代码雨 |

## AI 增强（可选）

冷笑话模式支持 AI 生成，无需 API Key 也能用：

1. **Gemini Nano** — Chrome 内置本地 AI，零延迟，需 Chrome 127+ 并在 `chrome://flags` 启用
2. **远程 API** — 支持智谱 GLM、DeepSeek、OpenAI、通义千问等 OpenAI 兼容接口
3. **内置笑话池** — 默认 200+ 笑话，无网络也能用

## 主题

支持深色 / 浅色 / 跟随系统三种模式，右下角主题按钮切换。

## 安装

1. 下载或 clone 本仓库
2. 打开 Chrome，访问 `chrome://extensions`
3. 开启右上角「开发者模式」
4. 点击「加载已解压的扩展程序」，选择项目目录
5. 打开新标签页即可体验

## 文件结构

```
├── manifest.json      # MV3 扩展配置
├── config.js          # 预设 API 列表
├── background.js      # Service Worker（笑话池、AI 调用、流式传输）
├── newtab.html        # 新标签页
├── newtab.css         # 样式（暗/亮主题）
├── newtab.js          # 页面逻辑（7 种模式渲染）
├── options.html       # 设置页
├── options.css        # 设置页样式
├── options.js         # 设置页逻辑
└── icons/             # 扩展图标
```

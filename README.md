# 轻工具 / Lite Tools

隐私优先的多语言在线轻工具网站，目标部署到 Cloudflare Pages。当前 MVP 覆盖单位转换、格式与开发工具、计算工具和 QR Code 生成器，用户输入默认只在浏览器本地处理。

## 功能范围

- 单位转换：长度、重量、温度、面积、体积、速度、时间、数据存储。
- 格式与开发工具：JSON、Base64、URL、UUID、时间戳、文本大小写、字数统计、颜色转换。
- 计算工具：百分比、折扣、BMI、复利、日期间隔。
- QR Code：本地生成、尺寸与颜色设置、PNG 下载。
- 页面：首页、关于、隐私政策、使用条款、联系反馈、404 fallback。

## 技术栈

- React 19、TypeScript 5.9、Vite 8
- Node.js 22，见 `.nvmrc`
- Node built-in test runner
- Cloudflare Pages 静态部署

## 本地启动

```bash
nvm install
nvm use
npm ci
npm run dev
```

## 验证

```bash
npm run lint
npm run test
npm run build
npm run verify
npm audit
```

`npm run verify` 会依次执行 lint、test 和 build。构建输出目录为 `dist`，不要提交 `dist` 或 `node_modules`。

## Cloudflare Pages

建议配置：

```text
Build command: npm run build
Build output directory: dist
Production branch: main
```

`public/_redirects` 为 SPA 刷新提供 fallback，同时 `robots.txt`、`sitemap.xml`、`favicon.svg` 等静态文件保持独立访问。

## 多语言与本地统计

支持 English、简体中文、繁體中文。首次访问根据浏览器语言选择，用户选择会保存到 `localStorage`。工具打开次数也只保存在本地，用于调整常用工具排序；损坏数据会自动降级为空统计。

## 隐私、Analytics 和 AdSense

计算、转换、文本和 QR Code 输入不得发送到分析服务。当前未接入 Cloudflare Web Analytics；如需启用，优先使用 Cloudflare Pages 平台侧配置，避免重复注入脚本。AdSense 默认关闭，没有 publisher ID、脚本、空广告容器或网络请求。

## 当前限制

工具页面采用 SPA 状态路由，后续如需更强 SEO，可评估语言前缀路径和静态化方案。全站聚合统计尚未接入，当前仅保留本地 adapter 风格接口。

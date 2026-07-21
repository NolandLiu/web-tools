# GoDeskHub

GoDeskHub 是一个隐私优先的多语言在线工具网站，目标部署到 Cloudflare Pages。当前 MVP 覆盖单位转换、格式与开发工具、计算工具和 QR Code 生成器，用户输入默认只在浏览器本地处理。

## 功能范围

- 单位转换：长度、重量、温度、面积、体积、速度、时间、数据存储。
- 格式与开发工具：JSON、Base64、URL、UUID、时间戳、文本大小写、字数统计、颜色转换。
- 计算工具：百分比、折扣、BMI、复利、日期间隔。
- QR Code：本地生成、尺寸与颜色设置、PNG 下载。
- 页面：首页、About Us、Privacy Policy、Terms of Service、Contact Us、404 fallback。

## 合规页面

公开合规页面使用品牌 `GoDeskHub`、域名 `https://godeskhub.com` 和联系邮箱 `support@godeskhub.com`。隐私政策说明 cookie、未来第三方广告供应商、浏览器本地数据处理和联系入口；当前实现不加载 AdSense 脚本、不写 publisher ID、不渲染广告容器，也不把工具输入发送到分析服务。

## 界面与交互

- 桌面端使用固定树形工具导航；移动端与平板端切换为可关闭抽屉。
- 所有工具共用统一的标题、说明、输入面板、输出卡片和相关推荐布局。
- 表单字段包含可见名称、示例占位符及按需显示的帮助说明，并通过 `aria-describedby` 向辅助技术提供上下文。
- 可逆转换工具提供互换按钮；互换时将有效结果带回输入，减少重复录入。
- 所有文本或数值输出均提供快速复制、复制结果反馈和不可复制状态。

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

当前响应式断点为：小于 `768px` 使用单列移动布局，`768px` 至 `1099px` 使用抽屉导航，`1100px` 及以上使用固定侧栏。发布前应在真实浏览器中复核 `375px`、`768px`、`1024px` 和 `1440px` 宽度。

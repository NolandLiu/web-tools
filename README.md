# GoDeskHub

GoDeskHub 是一个隐私优先的多语言在线工具网站，目标部署到 Cloudflare Pages。当前 MVP 覆盖单位转换、格式与开发工具、计算工具、QR Code 生成器以及网络与 IP 工具。除明确标注的 IP 查询和 RDAP 查询外，用户输入默认只在浏览器本地处理。

## 功能范围

- 单位转换：长度、重量、温度、面积、体积、速度、时间、数据存储。
- 格式与开发工具：JSON、Base64、URL、UUID、时间戳、文本大小写、字数统计、颜色转换。
- 计算工具：百分比、折扣、BMI、复利、日期间隔。
- QR Code：本地生成、尺寸与颜色设置、PNG 下载。
- 网络与 IP：IPv4 子网、IP 范围与 CIDR、IPv4 转换与分类、IPv6 地址、IP 查询、IP WHOIS / RDAP。
- 页面：首页、About Us、Privacy Policy、Terms of Service、Contact Us、404 fallback。

## 合规页面

公开合规页面使用品牌 `GoDeskHub`、正式域名 `https://tools.godeskhub.com` 和联系邮箱 `support@godeskhub.com`。隐私政策说明 cookie、未来第三方广告供应商、浏览器本地数据处理和联系入口；当前实现不加载 AdSense 脚本、不写 publisher ID、不渲染广告容器，也不把工具输入发送到分析服务。

## 界面与交互

- 桌面端使用固定树形工具导航；移动端与平板端切换为可关闭抽屉。
- 所有工具共用统一的标题、说明、输入面板、输出卡片和相关推荐布局。
- 表单字段包含可见名称、示例占位符及按需显示的帮助说明，并通过 `aria-describedby` 向辅助技术提供上下文。
- 可逆转换工具提供互换按钮；互换时将有效结果带回输入，减少重复录入。
- 所有文本或数值输出均提供快速复制、复制结果反馈和不可复制状态。
- 工具操作区下方提供三语使用场景、步骤、示例、规则、限制、FAQ、权威参考及相关工具。
- 顶部搜索支持工具名称、别名、关键词、摘要、使用场景和分类，并提供 `Cmd/Ctrl+K`、方向键、`Enter` 与 `Esc` 操作。
- 工具反馈通过用户主动打开的预填充邮件完成，只包含工具 ID、slug、语言、规范 URL 和反馈类型，不包含输入或结果。

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

`npm run verify` 会依次执行 lint、test、类型检查、build 和静态路由／SEO
产物审计。审计还会逐页解析 JSON-LD、核对可见 FAQ、检查三语内容覆盖及反馈入口。
构建输出目录为 `dist`，不要提交 `dist` 或 `node_modules`。

## Cloudflare Pages

建议配置：

```text
Build command: npm run build
Build output directory: dist
Production branch: main
```

构建会从统一注册表生成三语首页、31 个工具、5 个分类和 4 个基础页面，
共 123 个静态 HTML。工具与分类的主要可见内容会在构建时写入原始 HTML，
同时生成 Sitemap、自定义 404 和旧路径 redirects。
Cloudflare Pages 因此可以直接返回规范深链，不需要 catch-all SPA fallback。

### Network API Functions

Phase 5 新增两个同源 API 路径：

```text
POST /api/network/ip-lookup
POST /api/network/ip-rdap
```

Pages Functions 薄入口位于：

```text
functions/api/network/ip-lookup.js
functions/api/network/ip-rdap.js
```

前端只调用上述同源相对路径，不直接调用第三方 IP 数据服务或 RIR。当前本地实现已包含稳定请求／响应契约、内容类型校验、请求体大小限制、私网和特殊地址预检、`Cache-Control: no-store` 与 `X-Content-Type-Options: nosniff`。真实 IP 查询供应商、RDAP bootstrap、Cloudflare 平台限流和生产环境变量仍需部署前复核。

建议部署前配置的变量或 Secret 示例，不包含真实值：

```text
IP_LOOKUP_PROVIDER=
IP_LOOKUP_BASE_URL=
IP_LOOKUP_API_KEY=
RDAP_BOOTSTRAP_SOURCE=
UPSTREAM_TIMEOUT_MS=
UPSTREAM_MAX_BYTES=
```

缺少真实供应商配置时，API 应返回稳定的 `CONFIGURATION_ERROR`，不得把 API Key、内部 URL、堆栈或用户查询 IP 写入响应、前端构建产物或 Git。Cloudflare 免费计划下的限流能力需要在部署前按实际账户和 Pages Functions 能力复核；核心业务逻辑不依赖 KV、D1、Durable Objects 或 Queues。

未来迁移到普通 Node/VPS 时，保持前端 `/api/network/*` 路径和 `src/lib/network-ip.js` 中的核心校验、错误模型、provider 接口不变，只替换 HTTP 入口、环境变量加载和部署层。

## 多语言与本地统计

支持 `/en/`、`/zh-cn/` 和 `/zh-tw/`。URL 是当前语言和页面的权威来源，
默认语言为 English；切换语言会保持当前工具、分类或基础页语义，用户选择也会
保存在 `localStorage` 作为偏好。工具打开次数只保存在本地，用于调整常用工具
排序；损坏数据会自动降级为空统计。

## 隐私、Analytics 和 AdSense

计算、转换、文本、QR Code 和本地网络计算输入不得发送到分析服务。IP 查询和 RDAP 查询只在用户明确提交后发送到本站同源 API，并可能由服务端继续请求经批准的外部数据源；应用不主动保存查询历史，但不得声称互联网基础设施或外部供应商完全不记录请求。当前未接入 Cloudflare Web Analytics；如需启用，优先使用 Cloudflare Pages 平台侧配置，避免重复注入脚本。AdSense 默认关闭，没有 publisher ID、脚本、空广告容器或网络请求。

## 当前限制

全站聚合统计尚未接入，当前仅保留本地 adapter 风格接口。上线后应按
`docs/cloudflare-pages-deep-link-checklist.md` 复核真实 HTTP 状态、旧域名规则和
所有 Sitemap URL。

当前响应式断点为：小于 `768px` 使用单列移动布局，`768px` 至 `1099px` 使用抽屉导航，`1100px` 及以上使用固定侧栏。发布前应在真实浏览器中复核 `375px`、`768px`、`1024px` 和 `1440px` 宽度。

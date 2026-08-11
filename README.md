# GoDeskHub

GoDeskHub 是一个隐私优先的多语言在线工具网站，目标部署到 Cloudflare Pages。当前公开工具覆盖单位转换、格式与开发工具、计算工具、QR Code 生成器以及浏览器本地运行的网络工具；工具输入默认只在浏览器本地处理。

## 功能范围

- 单位转换：长度、重量、温度、面积、体积、速度、时间、数据存储。
- 格式与开发工具：JSON、Base64、URL、UUID、时间戳、文本大小写、字数统计、颜色转换、密码生成。
- 计算工具：百分比、折扣、BMI、复利、日期间隔、固定周期 IRR、支票金额转换。
- QR Code：本地生成、尺寸与颜色设置、PNG 下载。
- 网络与 IP：IPv4 子网、IP 范围与 CIDR、IPv4 转换与分类以及 IPv6 地址工具箱。
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

构建会从统一注册表枚举全部规范路由。以 `2026-08-11` 的注册表快照为准，
当前包含 27 个工具、5 个分类、3 种语言和 4 个基础页面，共生成 111 个
规范静态 HTML。工具与分类的主要可见内容会在构建时写入原始 HTML，
同时生成 Sitemap、自定义 404 和旧路径 redirects。
Cloudflare Pages 因此可以直接返回规范深链，不需要 catch-all SPA fallback。

### 未发布的 Network API Functions

仓库保留以下 Pages Functions 源码，供未来重新评审任意 IP 查询与 RDAP
能力时使用：

```text
POST /api/network/ip-lookup
POST /api/network/ip-rdap
```

Pages Functions 薄入口位于：

```text
functions/api/network/ip-lookup.js
functions/api/network/ip-rdap.js
```

当前 `public/_routes.json` 只包含禁用占位路径，不会把上述两个 API 路径交给
Pages Functions；公开工具注册表、搜索、Sitemap 和静态页面也不包含 IP Lookup
或 RDAP 工具。因此这些 Functions 不是当前发布能力，当前部署不需要为它们配置
供应商变量或 Secret。若未来恢复，必须新建任务重新完成供应商、隐私、限流、
缓存和生产验证，不得仅修改 `_routes.json` 即宣称可用。

## 多语言与本地统计

支持 `/en/`、`/zh-cn/` 和 `/zh-tw/`。URL 是当前语言和页面的权威来源，
默认语言为 English；切换语言会保持当前工具、分类或基础页语义，用户选择也会
保存在 `localStorage` 作为偏好。工具打开次数只保存在本地，用于调整常用工具
排序；损坏数据会自动降级为空统计。

## 隐私、Analytics 和 AdSense

当前 HTML 模板包含 Google tag 和 Google Analytics 标准页面访问代码，隐私页已明确披露。计算、转换、文本、密码、金额、QR Code、文件和本地网络计算的输入与输出不得发送到分析服务。ADR-024 已批准的目标状态是仅在用户明确同意后，通过 fail-closed adapter 发送不含查询参数的规范 page view；该迁移尚未实施。当前未接入 Cloudflare Web Analytics。AdSense 默认关闭，没有 publisher ID、脚本、空广告容器或网络请求。

## 当前限制

Google Analytics 目前仍由模板无条件加载，尚未达到 ADR-024 定义的 consent-gated
目标状态；在该迁移完成前不得扩展自定义分析事件。上线后还应按
`docs/cloudflare-pages-deep-link-checklist.md` 复核真实 HTTP 状态、旧域名规则和
所有 Sitemap URL。

当前响应式断点为：小于 `768px` 使用单列移动布局，`768px` 至 `1099px` 使用抽屉导航，`1100px` 及以上使用固定侧栏。发布前应在真实浏览器中复核 `375px`、`768px`、`1024px` 和 `1440px` 宽度。

# 轻工具 / Web Tools

一个隐私优先的在线工具箱。当前版本包含单位转换、百分比、日期差、字数统计、Base64、URL编解码、密码和UUID生成等功能。

## 技术栈

- React 19
- TypeScript 5.9
- Vite 8
- Cloudflare Pages
- Node.js 22.13.0

## 本地运行

```bash
nvm install
nvm use
npm ci
npm run dev
```

浏览器打开Vite输出的本地地址。

## 验证

```bash
npm run lint
npm run test
npm run build
```

## Cloudflare Pages

此项目案例部署可在Cloudflare，在Cloudflare Pages连接GitHub仓库，使用：

```text
Build command: npm run build
Build output directory: dist
Production branch: main
```

首版是纯静态前端，不需要环境变量或数据库。后续点击统计可加入Pages Functions和D1。

## 数据隐私

工具输入仅在浏览器本地处理。不得将用户的计算、转换、文本或文件内容发送到分析服务。

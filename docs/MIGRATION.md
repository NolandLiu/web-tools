# 从ChatGPT Sites迁移

此代码包保留了“轻工具”首版UI和可用工具，已移除ChatGPT Sites专用配置、内部仓库标识、Vinext和托管清单，转换为标准React＋Vite项目。

## 导入现有本地Git仓库

将压缩包解压到临时目录，然后复制内容到现有`web-tools`仓库，注意不要覆盖`.git`：

```bash
rsync -av --exclude='.git' --exclude='node_modules' ./web-tools-cloudflare/ ~/Documents/Codex/web-tools/
cd ~/Documents/Codex/web-tools
nvm install
nvm use
npm ci
npm run lint
npm run test
npm run build
git status
```

验证通过后：

```bash
git add .
git commit -m "feat: import initial web tools project"
git push -u origin main
```

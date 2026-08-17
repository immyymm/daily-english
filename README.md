# 每日英语

“每日英语”是一款无需注册、可安装到 iPhone 主屏幕的网页 APP。它每天提供 5 张英语词卡，并依据间隔复测计划安排复习；学习记录默认只保存在当前设备。

正式站：[https://daily-english-seven-ochre.vercel.app](https://daily-english-seven-ochre.vercel.app)

## 已实现功能

- 30 天、150 张完整词卡，全部选自项目附带的 COCA 词表
- 每日独立词卡文件与全部词卡汇总文件
- 今日学习、翻卡、例句/搭配/辨析、浏览器发音
- T0–T7 间隔复测、客观题本地评分、错因和熟练度统计
- 第 7 天解锁周测，支持作文和口语文字稿
- 自由造句、开放对话、作文和口语文字稿使用 GPT-5 mini 辅助评分
- AI 评分前隐私确认；断网或接口失败时保存到本地待重试
- 录音只保留在当前页面和设备，不上传给评分接口
- IndexedDB 本地保存进度，支持 JSON 导出、恢复和清除
- PWA 离线缓存、iPhone 安装引导和安全区适配
- Vercel 正式站与 GitHub Pages 静态镜像构建配置

## 内容文件

- `content/cards/*.json`：一词一文件，共 150 个可维护的源词卡
- `public/data/daily/YYYY-MM-DD.json`：每天 5 张完整词卡，共 30 天
- `public/data/all-cards.json`：全部 150 张词卡的单文件汇总
- `public/data/manifest.json`：客户端内容清单
- `content/content-manifest.json`：内容构建记录

浏览器不能在运行时写回 GitHub 或 Vercel 项目文件，因此每日文件由构建脚本提前生成。第 30 天后，APP 会以 30 天内容包循环强化，用户进度仍按日期独立保存。

## 本地开发与验证

需要 Node.js 20 或更高版本，以及 pnpm。

```bash
pnpm install --frozen-lockfile
pnpm run content:validate
pnpm test
pnpm run build
pnpm run dev
```

生产构建位于 `dist/`。构建命令会先验证内容文件，发现重复词卡、缺字段、日期缺失或每日不是 5 张时会直接失败。

## AI 评分配置

浏览器从不接触 OpenAI 密钥。密钥只能配置在 Vercel 服务端环境变量中：

1. 打开 Vercel 项目的 **Settings → Environment Variables**。
2. 新建 `OPENAI_API_KEY`，粘贴密钥，并应用到 Production；需要预览测试时再勾选 Preview。
3. 新建 `ALLOWED_ORIGINS`，值为允许调用评分接口的完整域名，用英文逗号分隔，例如：

   ```text
   https://daily-english.vercel.app,https://YOUR_NAME.github.io
   ```

4. 保存后重新部署。

`gpt-5-mini` 还要求 OpenAI API 组织完成验证。若接口返回“AI 评分模型尚未完成服务端验证”，请进入 [OpenAI Organization settings](https://platform.openai.com/settings/organization/general) 点击 **Verify Organization**；验证结果可能需要约 15 分钟传播，通常不需要重新部署。

不要在聊天、代码、`VITE_*` 变量或 Git 仓库中放置 API 密钥。前端仅可配置公开接口地址 `VITE_AI_API_URL`。

## 部署到 Vercel

1. 将本目录推送到 GitHub 公共仓库。
2. 在 Vercel 导入该仓库；框架会识别为 Vite，构建命令为 `pnpm run build`，输出目录为 `dist`。
3. 按上一节设置 `OPENAI_API_KEY` 与 `ALLOWED_ORIGINS`，重新部署。
4. 在 Vercel Firewall 中为 `/api/evaluate` 增加速率限制，并在 OpenAI 项目中设置预算和用量提醒。
5. 用正式 `*.vercel.app` HTTPS 地址在 iPhone Safari 打开，点“分享 → 添加到主屏幕”。

服务端函数还包含来源白名单、请求体/字段限制、每 IP 每小时 20 次的尽力限流、25 秒超时和结构化输出校验。Vercel WAF 是公开无登录服务的第二层保护。

## 部署 GitHub Pages 镜像

仓库包含 `.github/workflows/deploy-pages.yml`。在 GitHub 仓库中：

1. 打开 **Settings → Pages**，将 Source 设为 **GitHub Actions**。
2. 打开 **Settings → Secrets and variables → Actions → Variables**。
3. 添加公开变量 `VITE_AI_API_URL`，值为 Vercel 的完整评分地址，例如 `https://daily-english.vercel.app/api/evaluate`。
4. 推送到 `main` 后，工作流会验证内容、运行测试、构建并发布 Pages。

GitHub Pages 只托管静态前端，不能保存 OpenAI 密钥。两个域名的学习记录分别保存在各自浏览器域下，不会自动同步。

## 隐私与数据

详见 [PRIVACY.md](./PRIVACY.md)。简要原则：词卡与学习记录本地优先；只有用户明确同意后的当前开放题文字和必要词卡上下文会发送到 Vercel，再由服务端交给 GPT-5 mini；录音文件、身份信息和完整学习历史不上传。

## 项目资料

实现依据位于上一级目录：

- `英语单词生成模板.md`
- `英语单词间隔复测系统方案.md`
- `COCA词频单词表.xlsx`
- `每日英语APP完整实施方案.md`

这些附件只作为产品内容与业务规则来源，不会被网页直接发布。

# 安全说明

## 报告问题

请不要在公开 Issue 中粘贴 OpenAI API 密钥、用户答案或包含敏感信息的日志。发现密钥泄漏时，应立即在 OpenAI 控制台撤销旧密钥并创建新密钥，然后更新 Vercel 环境变量。

## 部署要求

- `OPENAI_API_KEY` 只能存在于 Vercel 服务端环境变量。
- `ALLOWED_ORIGINS` 只填写实际启用的 Vercel 与 GitHub Pages 来源。
- 为 `/api/evaluate` 启用 Vercel Firewall 速率限制。
- 为 OpenAI 项目设置独立预算与用量提醒。
- 不提交 `.env`、`.env.local` 或 `.vercel`。

应用内置的内存限流是尽力保护，无法替代平台级 WAF；Serverless 实例可能扩缩容或重启。

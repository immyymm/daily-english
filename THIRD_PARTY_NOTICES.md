# 第三方说明

## CMU Pronouncing Dictionary

本项目在离线内容构建阶段使用 `cmu-pronouncing-dictionary` 生成北美英语发音字段。CMU Pronouncing Dictionary 为 Carnegie Mellon University 创建的公共领域发音词典；使用的 npm 封装包由 Zeke Sikelianos 以 ISC License 发布。

应用运行时不向该词典或任何第三方词典发送请求。生成后的 IPA 随静态词卡一并发布。

- 数据与封装项目：https://github.com/words/cmu-pronouncing-dictionary
- ISC License：https://github.com/words/cmu-pronouncing-dictionary/blob/main/license

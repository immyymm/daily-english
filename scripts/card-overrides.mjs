// Human-curated, template-complete cards for the launch lesson and the user's reference word.
// Compact tuples are normalized by build-content.mjs; no external generation API is used.
export const cardOverrides = {
  improve: {
    meanings: [
      ['v.', 'to make something better in quality, condition, or ability', '改善；提高', 'Daily practice will improve your speaking.', '每天练习会提高你的口语。'],
      ['v.', 'to become better than before', '好转；改善', 'Her English has improved a lot this year.', '她的英语今年进步了很多。']
    ],
    structures: [
      ['improve something', '改善或提高某事物'],
      ['improve on something', '比原有事物做得更好'],
      ['improve at something', '在某方面进步'],
      ['improve by ten percent', '提高百分之十']
    ],
    errors: [
      ['improve to speaking', 'improve your speaking', 'improve 作及物动词时直接接宾语，不在宾语前加 to。'],
      ['improve on your health', 'improve your health', '表示“改善健康”直接用 improve；improve on 表示“超过原有水平”。'],
      ['more improve', 'improve more', 'more 修饰动词时通常放在动词之后。']
    ],
    contexts: [
      ['语言与技能', [['improve your English', '提高英语水平'], ['improve your pronunciation', '改善发音'], ['improve your writing', '提高写作能力'], ['improve communication skills', '提高沟通能力']]],
      ['表现与效率', [['improve performance', '提升表现'], ['improve efficiency', '提高效率'], ['improve productivity', '提高生产力'], ['improve the results', '改善结果']]],
      ['生活与条件', [['improve your health', '改善健康'], ['improve quality of life', '提高生活质量'], ['improve working conditions', '改善工作条件'], ['improve the situation', '改善局面']]],
      ['变化程度', [['improve greatly', '大幅改善'], ['improve gradually', '逐渐改善'], ['improve significantly', '显著提高'], ['improve over time', '随着时间改善']]]
    ],
    phrases: [
      ['improve on', '改进；做得比原来更好', 'This design improves on the earlier version.', '这个设计比早期版本有所改进。'],
      ['improve at', '在某方面进步', 'You will improve at speaking with regular practice.', '坚持练习会让你的口语进步。'],
      ['improve by', '提高了某个幅度', 'Sales improved by twelve percent.', '销售额提高了百分之十二。'],
      ['improve from A to B', '从 A 提高到 B', 'Her score improved from 70 to 85.', '她的分数从 70 分提高到了 85 分。'],
      ['improve the quality of', '提高……的质量', 'We want to improve the quality of the lessons.', '我们想提高课程质量。'],
      ['improve your chances of', '提高……的机会', 'Practice will improve your chances of success.', '练习会提高你成功的机会。'],
      ['improve with practice', '通过练习得到提高', 'Your listening will improve with practice.', '你的听力会随着练习而提高。'],
      ['room for improvement', '仍有改进空间', 'The first draft is good, but there is room for improvement.', '初稿不错，但仍有改进空间。']
    ],
    synonyms: [
      ['enhance', 'v.', '增强；提升', '较正式，常指增强质量、价值、吸引力或效果，如 enhance an image。'],
      ['boost', 'v.', '促进；提升', '强调在较短时间内推动数值、信心或表现上升，语气比 improve 更有力度。'],
      ['refine', 'v.', '改进；使更精细', '强调通过小幅调整让方法、设计或表达更精确。'],
      ['upgrade', 'v.', '升级', '常指设备、软件或服务换成更高版本，不用于一般能力的逐步进步。']
    ],
    antonyms: [
      ['worsen', 'v.', '恶化；使变差', '最直接的反义词，可作及物或不及物动词。'],
      ['deteriorate', 'v.', '恶化；退化', '较正式，通常是不及物动词，常用于健康、关系和状况。'],
      ['impair', 'v.', '损害；削弱', '强调使能力或功能变差，必须接宾语。']
    ],
    derivatives: [
      ['improvement', 'n.', '改善；进步', '常用；make an improvement 或 show improvement。'],
      ['improved', 'adj.', '改进的；改善的', '常放在名词前，如 improved performance。'],
      ['improving', 'adj.', '正在改善的', '强调处于好转过程，如 improving conditions。']
    ],
    confusables: [
      ['prove', 'v.', '证明', 'prove /pruːv/ 是“证明”；improve 多了 /ɪm/，表示“改善”。'],
      ['approve', 'v.', '批准；赞成', 'approve 常与 of 连用或表示正式批准；improve 表示变得更好。']
    ],
    related: [
      ['进步过程', [['develop', 'v.', '发展；培养'], ['advance', 'v. / n.', '推进；进展'], ['progress', 'v. / n.', '进步；进展'], ['grow', 'v.', '成长；增长']]],
      ['质量评价', [['quality', 'n.', '质量'], ['effective', 'adj.', '有效的'], ['efficient', 'adj.', '高效的'], ['better', 'adj. / adv.', '更好的；更好地']]],
      ['学习行动', [['practice', 'v. / n.', '练习'], ['review', 'v. / n.', '复习'], ['refine', 'v.', '改进'], ['master', 'v.', '掌握']]]
    ],
    examples: [
      ['日常能力', 'I want to improve my English before the trip.', '我想在旅行前提高英语水平。'],
      ['学习方法', 'Reading aloud can improve your pronunciation.', '朗读可以改善你的发音。'],
      ['工作表现', 'The new checklist improved our efficiency.', '新的检查表提高了我们的效率。'],
      ['健康状况', 'Her health improved after she began sleeping regularly.', '她开始规律睡眠后，健康状况好转了。'],
      ['产品迭代', 'We are trying to improve the app based on user feedback.', '我们正根据用户反馈改进这个应用。'],
      ['数据变化', 'Customer satisfaction improved by eight percent.', '客户满意度提高了百分之八。'],
      ['逐渐好转', 'The weather should improve later this afternoon.', '今天下午晚些时候天气应该会好转。'],
      ['比较版本', 'This model improves on the previous one in several ways.', '这个型号在几个方面优于上一款。'],
      ['鼓励表达', 'Do not worry—your listening will improve with practice.', '别担心，你的听力会随着练习而提高。'],
      ['主动输出', 'What is one skill you would like to improve this month?', '这个月你最想提高哪一项技能？']
    ],
    focus: ['improve 既可表示“使某物变好”，也可不带宾语表示“情况好转”。', '重点掌握 improve something、improve on 和 improve by。', '不要说 improve to speaking；应说 improve your speaking。', 'Your English will improve with regular practice.']
  },

  notice: {
    meanings: [
      ['v.', 'to see, hear, or become aware of something', '注意到；察觉', 'Did you notice a change in her voice?', '你注意到她声音的变化了吗？'],
      ['n.', 'a written or spoken announcement that gives information', '通知；告示', 'The notice says the library will close early.', '通知上说图书馆会提前关门。'],
      ['n.', 'advance warning that something will happen or end', '预先通知；通知期', 'You must give two weeks’ notice before leaving.', '离职前你必须提前两周通知。']
    ],
    structures: [
      ['notice something', '注意到某事'],
      ['notice that + clause', '注意到……'],
      ['notice someone do something', '注意到某人做了某事（完整过程）'],
      ['notice someone doing something', '注意到某人正在做某事']
    ],
    errors: [
      ['notice to the change', 'notice the change', 'notice 作动词时直接接宾语，不加 to。'],
      ['notice him to leave', 'notice him leave', '感官动词 notice 后用宾语加动词原形，表示看见完整动作。'],
      ['a two weeks notice', 'two weeks’ notice', '表示“两周的通知期”用复数所有格 weeks’。']
    ],
    contexts: [
      ['观察变化', [['notice a difference', '注意到差异'], ['notice a change', '注意到变化'], ['notice a pattern', '注意到规律'], ['notice a mistake', '注意到错误']]],
      ['人物与动作', [['notice someone arrive', '注意到某人到达'], ['notice someone looking', '注意到某人正在看'], ['hardly notice', '几乎没注意到'], ['immediately notice', '立刻注意到']]],
      ['通知与告示', [['a public notice', '公共告示'], ['a written notice', '书面通知'], ['an official notice', '正式通知'], ['post a notice', '张贴通知']]],
      ['提前告知', [['give notice', '提前通知'], ['without notice', '未提前通知'], ['at short notice', '临时；提前时间很短'], ['two weeks’ notice', '提前两周通知']]]
    ],
    phrases: [
      ['notice a difference', '注意到差异', 'You will notice a difference after a week of practice.', '练习一周后你会注意到变化。'],
      ['notice that', '注意到……', 'I noticed that the door was open.', '我注意到门开着。'],
      ['take notice of', '注意；重视', 'Please take notice of the safety instructions.', '请留意安全说明。'],
      ['come to someone’s notice', '引起某人的注意', 'The error came to my notice this morning.', '我今天早上注意到了这个错误。'],
      ['give notice', '提前通知；提出离职', 'She gave notice at the end of the month.', '她在月底提出了离职。'],
      ['at short notice', '在很短的提前时间内', 'Thank you for meeting me at such short notice.', '谢谢你临时抽时间见我。'],
      ['without notice', '未提前通知', 'The schedule changed without notice.', '日程在没有提前通知的情况下改变了。'],
      ['until further notice', '直到另行通知', 'The room will remain closed until further notice.', '该房间将关闭，直到另行通知。']
    ],
    synonyms: [
      ['observe', 'v.', '观察到；观察', '较正式，常暗含有意识、仔细地观看；notice 可以是无意中察觉。'],
      ['detect', 'v.', '察觉；发现', '强调发现不易看见的信号、错误或问题。'],
      ['spot', 'v.', '发现；认出', '口语常用，强调在人群或复杂背景中很快看见。'],
      ['realize', 'v.', '意识到', '强调在思考后明白事实；notice 更侧重通过感官察觉。']
    ],
    antonyms: [
      ['ignore', 'v.', '忽视；不理会', '知道某事存在却故意不理，是最直接的反向表达。'],
      ['overlook', 'v.', '忽略；没注意到', '常表示无意中漏掉细节或错误。'],
      ['miss', 'v.', '没看见；错过', '表示未能看见、听见或抓住某个信息。']
    ],
    derivatives: [
      ['noticeable', 'adj.', '明显的；值得注意的', '常修饰 change、difference 和 improvement。'],
      ['noticeably', 'adv.', '明显地', '说明变化达到能被察觉的程度。'],
      ['unnoticed', 'adj.', '未被注意的', '常见结构 go unnoticed。']
    ],
    confusables: [
      ['note', 'v. / n.', '注意；笔记', 'note 作动词较正式，强调记录或特别指出；notice 更强调察觉。'],
      ['notify', 'v.', '通知', 'notify 是主动把信息告知某人；notice 是自己注意到，或名词“通知”。'],
      ['notion', 'n.', '概念；看法', 'notion 与 notice 拼写相近，但意义和发音不同。']
    ],
    related: [
      ['感知动作', [['see', 'v.', '看见'], ['hear', 'v.', '听见'], ['observe', 'v.', '观察'], ['detect', 'v.', '察觉']]],
      ['注意与忽略', [['attention', 'n.', '注意力'], ['focus', 'v. / n.', '专注'], ['ignore', 'v.', '忽视'], ['overlook', 'v.', '漏看']]],
      ['通知方式', [['announcement', 'n.', '公告'], ['message', 'n.', '消息'], ['warning', 'n.', '警告'], ['reminder', 'n.', '提醒']]]
    ],
    examples: [
      ['声音变化', 'Did you notice a change in her voice?', '你注意到她声音的变化了吗？'],
      ['发现错误', 'I did not notice the spelling mistake at first.', '我一开始没有注意到那个拼写错误。'],
      ['观察动作', 'She noticed a man waiting near the door.', '她注意到一个男人正在门边等候。'],
      ['完整动作', 'We noticed the lights go out one by one.', '我们看到灯一盏一盏地熄灭。'],
      ['事实察觉', 'I noticed that he seemed unusually quiet.', '我注意到他显得异常安静。'],
      ['公共告示', 'A notice on the wall explains the new rule.', '墙上的告示说明了新规定。'],
      ['临时安排', 'They canceled the meeting at short notice.', '他们临时取消了会议。'],
      ['离职通知', 'Employees are expected to give two weeks’ notice.', '员工通常需要提前两周提出离职。'],
      ['引起注意', 'The unusual payment came to the bank’s notice.', '那笔异常付款引起了银行的注意。'],
      ['主动输出', 'What small change did you notice today?', '你今天注意到了什么小变化？']
    ],
    focus: ['notice 作动词表示“通过感官察觉”，作名词可表示“告示”或“提前通知”。', '重点掌握 notice something、notice that 和 notice someone doing。', 'notice 后直接接宾语，不说 notice to the change。', 'I noticed that the room had become quiet.']
  },

  support: {
    meanings: [
      ['v.', 'to help or encourage a person, idea, or activity', '支持；帮助；赞成', 'Her family supported her decision to study abroad.', '她的家人支持她出国学习的决定。'],
      ['v.', 'to hold the weight of something and keep it in position', '支撑；承受', 'These columns support the roof.', '这些柱子支撑着屋顶。'],
      ['v.', 'to provide evidence that makes a statement believable', '证实；为……提供依据', 'The data supports our conclusion.', '这些数据支持我们的结论。'],
      ['n.', 'help, encouragement, or practical assistance', '支持；帮助', 'Thank you for your support during the project.', '谢谢你在项目期间给予的支持。']
    ],
    structures: [
      ['support someone or something', '支持某人或某事'],
      ['support someone in doing something', '支持某人做某事'],
      ['support a claim with evidence', '用证据支持观点'],
      ['provide support for something', '为某事提供支持']
    ],
    errors: [
      ['support to this plan', 'support this plan', 'support 作动词时直接接宾语，不加 to。'],
      ['support someone to doing something', 'support someone in doing something', '表示“支持某人做某事”常用 support someone in doing。'],
      ['many support', 'a lot of support', 'support 表示“帮助、支持”时通常是不可数名词。']
    ],
    contexts: [
      ['人与情感', [['support a friend', '支持朋友'], ['emotional support', '情感支持'], ['family support', '家庭支持'], ['a strong support network', '强大的支持网络']]],
      ['观点与决定', [['support a decision', '支持决定'], ['support an idea', '支持想法'], ['support a proposal', '支持提议'], ['public support', '公众支持']]],
      ['证据与论证', [['support a claim', '支持论点'], ['support the conclusion', '支持结论'], ['supporting evidence', '支持性证据'], ['data support the finding', '数据支持该发现']]],
      ['技术与结构', [['technical support', '技术支持'], ['customer support', '客户支持'], ['support the roof', '支撑屋顶'], ['financial support', '资金支持']]]
    ],
    phrases: [
      ['support someone in doing', '支持某人做某事', 'Her parents support her in pursuing her goals.', '她的父母支持她追求目标。'],
      ['support a decision', '支持一项决定', 'The team supported the final decision.', '团队支持最终决定。'],
      ['support a claim with evidence', '用证据支持论点', 'You need to support your claim with evidence.', '你需要用证据支持自己的论点。'],
      ['provide support for', '为……提供支持', 'The guide provides support for new learners.', '这份指南为新学习者提供帮助。'],
      ['in support of', '支持；拥护', 'Thousands marched in support of the proposal.', '数千人游行支持这项提议。'],
      ['with the support of', '在……的支持下', 'She completed the project with the support of her team.', '她在团队支持下完成了项目。'],
      ['technical support', '技术支持', 'Please contact technical support if the app stops working.', '如果应用停止运行，请联系技术支持。'],
      ['a source of support', '支持的来源；支柱', 'Her friends were a major source of support.', '她的朋友是她重要的精神支柱。']
    ],
    synonyms: [
      ['assist', 'v.', '协助', '较正式，强调帮助完成具体任务；support 范围更广，也包括情感和立场。'],
      ['back', 'v.', '支持；为……撑腰', '口语常用，强调公开站在某人、计划或候选人一边。'],
      ['sustain', 'v.', '维持；支撑', '强调让某物长时间继续存在或承受重量。'],
      ['encourage', 'v.', '鼓励', '主要给人信心或动力，不一定提供实际资源。']
    ],
    antonyms: [
      ['oppose', 'v.', '反对', '用于立场、计划和政策，是 support 表示“赞成”时的直接反义词。'],
      ['undermine', 'v.', '削弱；暗中破坏', '表示逐渐削弱某人的信心、权威或某个体系。'],
      ['abandon', 'v.', '抛弃；放弃支持', '强调在需要帮助时离开或停止支持。']
    ],
    derivatives: [
      ['supportive', 'adj.', '给予支持的', '常形容人、环境或态度，如 a supportive teacher。'],
      ['supporter', 'n.', '支持者；拥护者', '指支持某人、球队、组织或观点的人。'],
      ['supporting', 'adj.', '辅助的；支持性的', '如 supporting evidence、supporting role。'],
      ['unsupported', 'adj.', '无支持的；无证据的', '可指没有支撑，也可指说法缺少证据。']
    ],
    confusables: [
      ['suppose', 'v.', '认为；假设', 'suppose 和 support 开头相似，但 suppose 表示“认为、假设”。'],
      ['assist', 'v.', '协助', 'assist 后常接 with 或 in；support 可直接接人、计划或论点。']
    ],
    related: [
      ['帮助方式', [['help', 'v. / n.', '帮助'], ['assist', 'v.', '协助'], ['encourage', 'v.', '鼓励'], ['guide', 'v.', '指导']]],
      ['立场表达', [['agree', 'v.', '同意'], ['approve', 'v.', '赞成；批准'], ['back', 'v.', '支持'], ['oppose', 'v.', '反对']]],
      ['资源类型', [['evidence', 'n.', '证据'], ['funding', 'n.', '资金'], ['advice', 'n.', '建议'], ['care', 'n.', '照顾']]]
    ],
    examples: [
      ['家庭选择', 'Her family supported her decision to study abroad.', '她的家人支持她出国学习的决定。'],
      ['朋友鼓励', 'Good friends support each other during difficult times.', '好朋友会在困难时期相互支持。'],
      ['团队立场', 'Most team members support the new plan.', '大多数团队成员支持新计划。'],
      ['证据论证', 'The research does not support that claim.', '这项研究并不支持那个说法。'],
      ['结构支撑', 'A metal frame supports the glass roof.', '金属框架支撑着玻璃屋顶。'],
      ['客户服务', 'Contact customer support if you cannot sign in.', '如果无法登录，请联系客户支持。'],
      ['资金帮助', 'The program offers financial support to students.', '该项目为学生提供经济援助。'],
      ['不可数名词', 'Thank you for all your support.', '感谢你给予的所有支持。'],
      ['在支持下', 'With her teacher’s support, she became more confident.', '在老师的支持下，她变得更自信。'],
      ['主动输出', 'Who supports you when learning becomes difficult?', '学习遇到困难时，谁会支持你？']
    ],
    focus: ['support 可表示帮助人、赞成观点、支撑重量或用证据证实。', '重点掌握 support someone in doing 和 support a claim with evidence。', '动词后不加 to；名词 support 表示“支持”时通常不可数。', 'The data supports our conclusion.']
  },

  likely: {
    meanings: [
      ['adj.', 'expected to happen or probably true', '可能的；有希望的', 'It is likely to rain this afternoon.', '今天下午很可能会下雨。'],
      ['adv.', 'probably', '很可能', 'She will most likely arrive before noon.', '她很可能会在中午前到达。']
    ],
    structures: [
      ['be likely to do something', '很可能做某事'],
      ['it is likely that + clause', '很可能……'],
      ['more or less likely', '更可能或不太可能'],
      ['the most likely explanation', '最可能的解释']
    ],
    errors: [
      ['it likely to rain', 'it is likely to rain', '形容词 likely 前需要系动词 be。'],
      ['more likelier', 'more likely', 'likely 的比较级用 more likely，不重复加 -er。'],
      ['be likely of happening', 'be likely to happen', '表示“可能发生”用 be likely to do。']
    ],
    contexts: [
      ['概率判断', [['highly likely', '极有可能'], ['quite likely', '很可能'], ['more likely', '更可能'], ['less likely', '不太可能']]],
      ['人物与行动', [['likely to happen', '可能发生'], ['likely to succeed', '可能成功'], ['likely to change', '可能改变'], ['likely to become', '可能变成']]],
      ['名词搭配', [['a likely cause', '可能的原因'], ['a likely outcome', '可能的结果'], ['a likely explanation', '可能的解释'], ['a likely candidate', '很可能入选的人']]],
      ['副词位置', [['will likely continue', '很可能会继续'], ['most likely', '很可能'], ['very likely', '非常可能'], ['likely because', '很可能因为']]]
    ],
    phrases: [
      ['be likely to', '很可能会', 'Prices are likely to rise next year.', '明年价格很可能上涨。'],
      ['it is likely that', '很可能……', 'It is likely that the meeting will end early.', '会议很可能会提前结束。'],
      ['more likely to', '更有可能……', 'People are more likely to remember vivid examples.', '人们更容易记住生动的例子。'],
      ['less likely to', '不太可能……', 'A rested learner is less likely to make careless mistakes.', '休息充分的学习者不太容易犯粗心错误。'],
      ['most likely', '很可能；最有可能', 'She will most likely call tonight.', '她今晚很可能会打电话。'],
      ['highly likely', '极有可能', 'Further delays are highly likely.', '进一步延误的可能性很高。'],
      ['a likely outcome', '可能的结果', 'A likely outcome is that both sides will agree.', '一个可能的结果是双方都会同意。'],
      ['as likely as not', '很可能；可能性各半偏高', 'As likely as not, they will arrive late.', '他们很可能会迟到。']
    ],
    synonyms: [
      ['probable', 'adj.', '很可能的', '只作形容词，语气较正式；likely 还能作副词，并常用于 be likely to。'],
      ['possible', 'adj.', '可能的', '只表示“有可能”，概率可高可低；likely 通常暗示发生概率较高。'],
      ['expected', 'adj.', '预期的', '强调根据计划、常态或已有信息而预计，不一定表示概率判断。'],
      ['presumably', 'adv.', '大概；推测起来', '强调根据现有信息作出的合理推测，语气比 likely 更带推断色彩。']
    ],
    antonyms: [
      ['unlikely', 'adj. / adv.', '不太可能的；不太可能', '最直接的反义词，结构同 be unlikely to。'],
      ['impossible', 'adj.', '不可能的', '表示概率为零或无法做到，程度比 unlikely 强得多。'],
      ['doubtful', 'adj.', '不确定的；可疑的', '表示说话者怀疑某事是否会发生或是否真实。']
    ],
    derivatives: [
      ['likelihood', 'n.', '可能性', '正式且常用；the likelihood of doing / that...。'],
      ['unlikely', 'adj. / adv.', '不太可能的；不太可能', '由否定前缀 un- 构成，是直接反义词。'],
      ['likeliness', 'n.', '可能性', '存在但不如 likelihood 常用，学习时优先记 likelihood。']
    ],
    confusables: [
      ['like', 'v. / prep.', '喜欢；像', 'like 表示“喜欢”或“像”；likely 表示“可能的、很可能”。'],
      ['lively', 'adj.', '活泼的；生动的', 'lively 虽以 -ly 结尾，但主要是形容词，与 likely 含义不同。'],
      ['possibly', 'adv.', '可能；也许', 'possibly 只说明存在可能；likely 往往表示概率更高。']
    ],
    related: [
      ['概率程度', [['certain', 'adj.', '确定的'], ['probable', 'adj.', '很可能的'], ['possible', 'adj.', '可能的'], ['unlikely', 'adj.', '不太可能的']]],
      ['推测副词', [['probably', 'adv.', '很可能'], ['perhaps', 'adv.', '也许'], ['possibly', 'adv.', '可能'], ['presumably', 'adv.', '推测起来']]],
      ['结果预测', [['expect', 'v.', '预期'], ['predict', 'v.', '预测'], ['outcome', 'n.', '结果'], ['chance', 'n.', '可能性；机会']]]
    ],
    examples: [
      ['天气预测', 'It is likely to rain this afternoon.', '今天下午很可能会下雨。'],
      ['行动概率', 'She is likely to accept the offer.', '她很可能会接受这个提议。'],
      ['从句结构', 'It is likely that prices will rise again.', '价格很可能会再次上涨。'],
      ['比较概率', 'You are more likely to remember words you actively use.', '你更容易记住主动使用过的单词。'],
      ['降低风险', 'Careful readers are less likely to miss the detail.', '细心的读者不太容易漏掉这个细节。'],
      ['副词用法', 'The train will likely be crowded tonight.', '今晚这趟火车很可能会很拥挤。'],
      ['最高概率', 'The keys are most likely in your bag.', '钥匙很可能在你的包里。'],
      ['名词前修饰', 'Stress is the most likely cause of the problem.', '压力是这个问题最可能的原因。'],
      ['否定形式', 'It is unlikely that we will finish before noon.', '我们不太可能在中午前完成。'],
      ['主动输出', 'What is likely to happen in your week?', '你这周最可能发生什么？']
    ],
    focus: ['likely 表示概率较高，可作形容词；在美式英语中也常作副词。', '重点掌握 be likely to 和 it is likely that。', '不要漏掉 be：说 It is likely to rain。', 'You are more likely to remember words you use.']
  },

  manage: {
    meanings: [
      ['v.', 'to succeed in doing something difficult', '设法做到', 'She managed to finish the report on time.', '她设法按时完成了报告。'],
      ['v.', 'to control or be responsible for a business, team, or activity', '管理；负责', 'He manages a team of twelve people.', '他管理一个十二人的团队。'],
      ['v.', 'to deal successfully with a situation or available resources', '应付；处理；勉强维持', 'Can you manage without a car?', '没有汽车你能应付吗？']
    ],
    structures: [
      ['manage to do something', '设法做成某事'],
      ['manage a team or project', '管理团队或项目'],
      ['manage without something', '没有某物也能应付'],
      ['manage on an amount of money', '靠一定数额的钱维持生活']
    ],
    errors: [
      ['manage doing it', 'manage to do it', '表示“设法做成”时，manage 后接 to do，不接 doing。'],
      ['manage with a team', 'manage a team', '表示“管理团队”时直接接宾语，不加 with。'],
      ['can manage to without help', 'can manage without help', 'manage without 后直接接名词；不需要 to。']
    ],
    contexts: [
      ['完成困难任务', [['manage to finish', '设法完成'], ['manage to find', '设法找到'], ['manage to avoid', '设法避免'], ['somehow manage', '不知怎么设法做到']]],
      ['人员与项目', [['manage a team', '管理团队'], ['manage a project', '管理项目'], ['manage a business', '经营企业'], ['manage staff', '管理员工']]],
      ['时间与资源', [['manage your time', '管理时间'], ['manage money', '管理资金'], ['manage resources', '管理资源'], ['manage the workload', '管理工作量']]],
      ['应对处境', [['manage without help', '没有帮助也能应付'], ['manage on a small budget', '靠小预算维持'], ['manage the situation', '应对局面'], ['manage stress', '管理压力']]]
    ],
    phrases: [
      ['manage to do', '设法做成某事', 'We managed to catch the last train.', '我们设法赶上了末班车。'],
      ['manage a team', '管理团队', 'She manages a small design team.', '她管理一个小型设计团队。'],
      ['manage a project', '管理项目', 'He was asked to manage the new project.', '他被要求管理这个新项目。'],
      ['manage your time', '管理时间', 'A short plan can help you manage your time.', '一份简短的计划能帮助你管理时间。'],
      ['manage without', '没有……也能应付', 'We can manage without a printer for one day.', '没有打印机，我们也能应付一天。'],
      ['manage on', '靠……勉强维持', 'It is difficult to manage on such a low income.', '靠这么低的收入很难维持生活。'],
      ['manage the situation', '应对局面', 'She stayed calm and managed the situation well.', '她保持冷静，很好地处理了局面。'],
      ['how did you manage?', '你是怎么做到的？', 'You finished already—how did you manage?', '你已经完成了——你是怎么做到的？']
    ],
    synonyms: [
      ['handle', 'v.', '处理；应付', '强调处理具体任务、问题或压力；manage 还可表示经营组织和设法成功。'],
      ['run', 'v.', '经营；管理', '口语常用于企业、商店、项目或系统的日常运营。'],
      ['cope', 'v.', '应付；对付', '常与 with 连用，强调在困难中坚持应对，不表示管理团队。'],
      ['succeed', 'v.', '成功', '强调结果成功；manage to do 常暗示过程有困难但最终做到了。']
    ],
    antonyms: [
      ['fail', 'v.', '未能；失败', '与 manage to do 表示“设法成功”时直接相反。'],
      ['mismanage', 'v.', '管理不善', '表示对企业、资金或局面管理得不好。'],
      ['neglect', 'v.', '疏于管理；忽视', '强调没有给予应有的注意或照料。']
    ],
    derivatives: [
      ['manager', 'n.', '经理；管理者', '非常常用，指负责团队、商店或部门的人。'],
      ['management', 'n.', '管理；管理层', '既可指管理活动，也可集合指管理人员。'],
      ['manageable', 'adj.', '可处理的；应付得来的', '常形容任务量、成本或问题。'],
      ['mismanage', 'v.', '管理不善', '否定前缀 mis- 表示“错误地”。']
    ],
    confusables: [
      ['management', 'n.', '管理；管理层', 'manage 是动词；management 是不可数名词或集合名词。'],
      ['manager', 'n.', '经理；管理者', 'manager 指人；manage 表示这个人所做的管理动作。'],
      ['arrange', 'v.', '安排', 'arrange 强调把时间或事物排好；manage 强调控制、负责或克服困难。']
    ],
    related: [
      ['管理动作', [['organize', 'v.', '组织'], ['plan', 'v. / n.', '计划'], ['lead', 'v.', '带领'], ['control', 'v. / n.', '控制']]],
      ['处理困难', [['handle', 'v.', '处理'], ['cope', 'v.', '应付'], ['solve', 'v.', '解决'], ['overcome', 'v.', '克服']]],
      ['组织角色', [['manager', 'n.', '经理'], ['leader', 'n.', '领导者'], ['team', 'n.', '团队'], ['staff', 'n.', '员工']]]
    ],
    examples: [
      ['困难任务', 'She managed to finish the report on time.', '她设法按时完成了报告。'],
      ['赶上交通', 'We managed to catch the last bus.', '我们设法赶上了末班车。'],
      ['团队管理', 'He manages a team of twelve people.', '他管理一个十二人的团队。'],
      ['项目负责', 'Can you manage this project on your own?', '你能独自负责这个项目吗？'],
      ['时间规划', 'I use a simple list to manage my time.', '我用一份简单的清单管理时间。'],
      ['资金安排', 'She manages the household budget carefully.', '她谨慎地管理家庭预算。'],
      ['没有帮助', 'Do you think you can manage without help?', '你觉得没有帮助也能应付吗？'],
      ['收入维持', 'They managed on very little money at first.', '起初他们靠很少的钱维持生活。'],
      ['处理局面', 'The nurse managed the emergency calmly.', '护士冷静地处理了紧急情况。'],
      ['主动输出', 'What difficult thing did you manage to do recently?', '你最近设法完成了什么困难的事情？']
    ],
    focus: ['manage 的三条主线是“设法做到、管理、应付”。', '最重要结构是 manage to do；管理人或项目时直接接宾语。', '不要说 manage doing；应说 manage to do。', 'We managed to solve the problem together.']
  },

  provide: {
    meanings: [
      ['v.', 'to give someone something that they need', '提供；供给', 'The school provides every student with a laptop.', '学校为每名学生提供一台笔记本电脑。'],
      ['v.', 'to make a service, opportunity, or resource available', '提供；使可以使用', 'The membership provides access to all online courses.', '会员资格可使用全部在线课程。'],
      ['v.', 'to support someone by giving them the money or things they need', '供养；为……提供生活所需', 'She works hard to provide for her family.', '她努力工作供养家人。']
    ],
    structures: [
      ['provide something', '提供某物'],
      ['provide someone with something', '向某人提供某物'],
      ['provide something for someone', '为某人提供某物'],
      ['provide for someone', '供养某人；为某人提供生活所需']
    ],
    errors: [
      ['provide students useful tools', 'provide students with useful tools', 'provide 后先接人时，要用 with 再接所提供的事物。'],
      ['provide useful tools students', 'provide useful tools for students', '先说所提供的事物时，通常用 for 引出接受者。'],
      ['provide to my family', 'provide for my family', '表示“供养家人”用 provide for，不用 provide to。']
    ],
    contexts: [
      ['信息与证据', [['provide information', '提供信息'], ['provide details', '提供详细信息'], ['provide evidence', '提供证据'], ['provide an explanation', '作出解释']]],
      ['服务与资源', [['provide a service', '提供服务'], ['provide access to', '提供使用……的机会'], ['provide technical support', '提供技术支持'], ['provide financial assistance', '提供经济援助']]],
      ['生活与照护', [['provide food and shelter', '提供食物和住所'], ['provide medical care', '提供医疗护理'], ['provide a safe environment', '提供安全环境'], ['provide for a family', '供养家庭']]],
      ['学习与工作', [['provide feedback', '提供反馈'], ['provide training', '提供培训'], ['provide an example', '提供例子'], ['provide someone with tools', '为某人提供工具']]]
    ],
    phrases: [
      ['provide someone with something', '向某人提供某物', 'The course provides learners with practical exercises.', '这门课程为学习者提供实用练习。'],
      ['provide something for someone', '为某人提供某物', 'The hotel provides free breakfast for its guests.', '酒店为客人提供免费早餐。'],
      ['provide information about', '提供有关……的信息', 'This page provides information about the application process.', '这个页面提供有关申请流程的信息。'],
      ['provide access to', '提供使用……的机会', 'The library provides access to several research databases.', '图书馆提供多个研究数据库的使用权限。'],
      ['provide support for', '为……提供支持', 'The program provides support for new parents.', '该项目为新手父母提供支持。'],
      ['provide evidence for', '为……提供证据', 'The study provides evidence for a different explanation.', '这项研究为另一种解释提供了证据。'],
      ['provide for', '供养；为……做准备', 'He has two children to provide for.', '他有两个孩子要供养。'],
      ['as provided by', '按照……提供的；由……提供', 'Use the password provided by your school.', '请使用学校提供的密码。']
    ],
    synonyms: [
      ['supply', 'v.', '供应；供给', '强调按需求或持续供应物资，常用 supply someone with something 或 supply something to someone。'],
      ['offer', 'v.', '主动提供；提出', '强调主动提出让对方选择或接受；可用 offer someone something，不说 provide someone something。'],
      ['give', 'v.', '给；给予', '最普通、范围最广；provide 往往暗示所给之物是需要的、正式安排的或持续可用的。'],
      ['furnish', 'v.', '提供；配备', '较正式，常用于 furnish someone with information；也可表示给房间配家具。']
    ],
    antonyms: [
      ['withhold', 'v.', '拒绝给予；扣留', '最直接的反向表达，强调本可以给出却有意保留信息、资金或许可。'],
      ['deny', 'v.', '拒绝给予；不准', '常见结构 deny someone access 或 deny a request，强调明确拒绝。'],
      ['deprive', 'v.', '剥夺', '结构是 deprive someone of something，强调拿走或不让某人获得必需之物。']
    ],
    derivatives: [
      ['provider', 'n.', '提供者；供应商', '非常常用，如 service provider、healthcare provider。'],
      ['provision', 'n.', '提供；供应；条款', '正式用词；provision of services 表示“服务的提供”，法律文本中还可表示“条款”。'],
      ['provided', 'conj.', '只要；如果', '常用结构 provided that，较正式；它不是 provide 的普通过去式义项。'],
      ['providing', 'conj.', '只要；如果', 'providing that 与 provided that 含义相同，口语中也可见。']
    ],
    confusables: [
      ['offer', 'v.', '主动提供；提出', 'offer someone something 可以双宾语；provide 通常要说 provide someone with something。'],
      ['supply', 'v. / n.', '供应；供给；供应量', 'supply 更强调物资的数量和持续供应；provide 的对象可以是信息、服务、机会或照护。'],
      ['provision', 'n.', '提供；条款；储备', 'provision 是名词，不可直接代替动词 provide；注意词性和句子位置。']
    ],
    related: [
      ['给予方式', [['give', 'v.', '给；给予'], ['offer', 'v.', '主动提供'], ['supply', 'v.', '供应'], ['donate', 'v.', '捐赠']]],
      ['常见资源', [['information', 'n.', '信息'], ['support', 'n.', '支持'], ['service', 'n.', '服务'], ['access', 'n.', '使用权；接触机会']]],
      ['接受与拒绝', [['receive', 'v.', '收到'], ['accept', 'v.', '接受'], ['withhold', 'v.', '扣留'], ['deny', 'v.', '拒绝给予']]]
    ],
    examples: [
      ['课程资源', 'The course provides learners with practical exercises.', '这门课程为学习者提供实用练习。'],
      ['宾客服务', 'The hotel provides free breakfast for its guests.', '酒店为客人提供免费早餐。'],
      ['信息说明', 'Please provide your full name and email address.', '请提供你的全名和电子邮箱地址。'],
      ['使用权限', 'This card provides access to the staff entrance.', '这张卡可以进入员工通道。'],
      ['证据论证', 'The report provides strong evidence that the policy is working.', '报告提供了有力证据，表明这项政策正在奏效。'],
      ['医疗照护', 'The clinic provides basic care to local families.', '这家诊所为当地家庭提供基本医疗服务。'],
      ['供养家庭', 'She works two jobs to provide for her children.', '她做两份工作来供养孩子。'],
      ['被动表达', 'All necessary equipment will be provided.', '所有必要设备都将提供。'],
      ['条件表达', 'You may leave early, provided that your work is finished.', '只要工作完成，你可以提前离开。'],
      ['容易出错的结构', 'The school provides students with free meals.', '学校为学生提供免费餐食。']
    ],
    focus: ['provide 表示把需要的信息、物品、服务或机会提供给别人，也可用 provide for 表示“供养”。', '重点掌握 provide someone with something 和 provide something for someone。', '不能说 provide someone something；在接受者后要加 with。', 'The school provides students with free meals.']
  },

  understand: {
    meanings: [
      ['v.', 'to know the meaning of words, ideas, or actions', '理解；明白', 'I understand what this sentence means.', '我明白这个句子的意思。'],
      ['v.', 'to know why or how something happens', '了解；弄懂', 'Do you understand how the system works?', '你了解这个系统是如何运作的吗？'],
      ['v.', 'to recognize and accept another person’s feelings or situation', '体谅；理解', 'I understand how difficult this decision is for you.', '我理解这个决定对你来说有多难。']
    ],
    structures: [
      ['understand something', '理解某事'],
      ['understand why, how, or what', '理解为什么、如何或什么'],
      ['understand that + clause', '明白……这一事实'],
      ['make yourself understood', '让别人明白你的意思']
    ],
    errors: [
      ['understand about the problem', 'understand the problem', 'understand 作及物动词时直接接所理解的事物，不加 about。'],
      ['I am not understanding', 'I do not understand', '表示“理解”时 understand 通常是状态动词，一般不用进行时。'],
      ['make yourself understand', 'make yourself understood', '表示“让别人听懂你”要用过去分词 understood，表示自己被理解。']
    ],
    contexts: [
      ['语言与信息', [['understand a word', '理解一个单词'], ['understand the instructions', '理解说明'], ['understand the question', '理解问题'], ['clearly understand', '清楚理解']]],
      ['原因与过程', [['understand why', '理解为什么'], ['understand how', '理解如何……'], ['understand what happened', '了解发生了什么'], ['understand the difference', '理解差别']]],
      ['人与感受', [['understand someone’s feelings', '理解某人的感受'], ['understand each other', '相互理解'], ['perfectly understand', '完全理解'], ['try to understand', '试着理解']]],
      ['表达与沟通', [['easy to understand', '容易理解'], ['hard to understand', '难以理解'], ['make yourself understood', '让别人明白你的意思'], ['as I understand it', '据我理解']]]
    ],
    phrases: [
      ['understand why', '理解为什么', 'I understand why you need more time.', '我理解你为什么需要更多时间。'],
      ['understand how', '理解如何……', 'First, make sure you understand how the feature works.', '首先，确保你了解这个功能如何运作。'],
      ['understand what someone means', '明白某人的意思', 'I understand what you mean, but I see it differently.', '我明白你的意思，但我的看法不同。'],
      ['fully understand', '充分理解', 'You need more context to fully understand the issue.', '你需要更多背景信息才能充分理解这个问题。'],
      ['make yourself understood', '让别人明白你的意思', 'She spoke slowly to make herself understood.', '她说得很慢，好让别人听懂。'],
      ['as I understand it', '据我理解', 'As I understand it, the meeting starts at nine.', '据我理解，会议九点开始。'],
      ['it is understood that', '大家都明白；据悉', 'It is understood that both sides have agreed.', '据了解，双方已经达成一致。'],
      ['come to understand', '逐渐理解', 'Over time, I came to understand his decision.', '随着时间推移，我逐渐理解了他的决定。']
    ],
    synonyms: [
      ['comprehend', 'v.', '理解；领会', '比 understand 正式，常强调对复杂内容的充分理解。'],
      ['grasp', 'v.', '理解；领会', '强调抓住重点或突然理解，也可表示用手抓住。'],
      ['follow', 'v.', '听懂；跟得上', '常用于对话、解释或论证，如 I do not follow your reasoning。'],
      ['appreciate', 'v.', '理解并重视', '用于理解处境、难处或重要性，通常比 understand 多一层体谅或重视。']
    ],
    antonyms: [
      ['misunderstand', 'v.', '误解', '最直接的反义词，表示理解错了，而不是完全不理解。'],
      ['misinterpret', 'v.', '误读；错误解释', '较正式，强调把话语、行为或数据解释错。'],
      ['confuse', 'v.', '使困惑；混淆', '表示让人不能清楚理解，主语通常是造成困惑的事物。']
    ],
    derivatives: [
      ['understanding', 'n. / adj.', '理解；谅解；善解人意的', '非常常用；an understanding of 表示“对……的理解”。'],
      ['understandable', 'adj.', '可以理解的；情有可原的', '既可表示内容容易理解，也可表示人的反应合情合理。'],
      ['misunderstanding', 'n.', '误解；误会', '常见结构 clear up a misunderstanding。'],
      ['misunderstood', 'adj.', '被误解的', '常形容人、观点或概念没有得到正确理解。']
    ],
    confusables: [
      ['know', 'v.', '知道；认识', 'know 强调拥有事实或经验；understand 强调明白含义、原因或运作方式。'],
      ['realize', 'v.', '意识到', 'realize 强调某一刻突然明白事实；understand 可表示持续的理解状态。']
    ],
    related: [
      ['理解过程', [['learn', 'v.', '学习'], ['recognize', 'v.', '认出；意识到'], ['realize', 'v.', '意识到'], ['grasp', 'v.', '领会']]],
      ['沟通结果', [['meaning', 'n.', '含义'], ['explanation', 'n.', '解释'], ['context', 'n.', '语境；背景'], ['clarity', 'n.', '清晰']]],
      ['理解程度', [['clear', 'adj.', '清楚的'], ['confusing', 'adj.', '令人困惑的'], ['obvious', 'adj.', '明显的'], ['complex', 'adj.', '复杂的']]]
    ],
    examples: [
      ['句子含义', 'I understand what this sentence means.', '我明白这个句子的意思。'],
      ['操作过程', 'Do you understand how the system works?', '你了解这个系统如何运作吗？'],
      ['原因解释', 'I understand why you need more time.', '我理解你为什么需要更多时间。'],
      ['确认理解', 'I think I understand the main point now.', '我想我现在明白重点了。'],
      ['体谅感受', 'I understand how frustrating that must be.', '我理解那一定很让人沮丧。'],
      ['相互沟通', 'We do not always agree, but we understand each other.', '我们并不总是意见一致，但彼此理解。'],
      ['表达清楚', 'Please speak slowly so everyone can understand you.', '请说慢一点，好让大家都能听懂。'],
      ['被人听懂', 'He used a picture to make himself understood.', '他用一张图片让别人明白自己的意思。'],
      ['逐渐理解', 'I came to understand the value of regular review.', '我逐渐理解了定期复习的价值。'],
      ['状态动词', 'I do not understand this part of the instructions.', '我不明白说明中的这一部分。']
    ],
    focus: ['understand 表示明白含义、原因或过程，也可表示体谅别人的处境。', '重点掌握 understand why/how/what 和 make yourself understood。', '通常说 understand the problem，不说 understand about the problem。', 'I understand what you mean.']
  },

  believe: {
    meanings: [
      ['v.', 'to accept that something is true', '相信；确信', 'I believe what she told me.', '我相信她告诉我的话。'],
      ['v.', 'to have an opinion or think that something is true', '认为；觉得', 'I believe this is the best option.', '我认为这是最好的选择。'],
      ['v.', 'to have confidence or faith in a person, idea, or ability', '信任；信仰', 'You need to believe in yourself.', '你需要相信自己。']
    ],
    structures: [
      ['believe someone or something', '相信某人或某事'],
      ['believe that + clause', '相信或认为……'],
      ['believe in someone or something', '信任某人；信仰或相信某种价值'],
      ['be believed to be', '被认为是……']
    ],
    errors: [
      ['believe to him', 'believe him', 'believe 表示“相信某人所说的话”时直接接人，不加 to。'],
      ['believe on yourself', 'believe in yourself', '表示“相信某人的能力或价值”用 believe in。'],
      ['I am believe this', 'I believe this', 'believe 是动词，不能放在 am 后作表语。']
    ],
    contexts: [
      ['事实与说法', [['believe a story', '相信一个说法'], ['believe the evidence', '相信证据'], ['hard to believe', '难以相信'], ['widely believed', '被广泛认为']]],
      ['观点与判断', [['believe that', '认为……'], ['strongly believe', '坚信'], ['have reason to believe', '有理由相信'], ['be believed to be', '被认为是……']]],
      ['信任与信心', [['believe in yourself', '相信自己'], ['believe in someone', '信任某人'], ['believe in teamwork', '相信团队合作'], ['make someone believe', '使某人相信']]],
      ['口语表达', [['I believe so', '我想是的'], ['I cannot believe it', '我简直不敢相信'], ['believe it or not', '信不信由你'], ['would you believe it?', '你能相信吗？']]]
    ],
    phrases: [
      ['believe someone', '相信某人的话', 'I believe you, and I am here to help.', '我相信你，也会在这里帮助你。'],
      ['believe that', '相信；认为……', 'I believe that small habits can make a big difference.', '我相信小习惯能带来大改变。'],
      ['believe in yourself', '相信自己', 'You have prepared well, so believe in yourself.', '你准备得很好，所以要相信自己。'],
      ['have reason to believe', '有理由相信', 'We have reason to believe the data are accurate.', '我们有理由相信这些数据是准确的。'],
      ['be believed to be', '被认为是……', 'The painting is believed to be over two hundred years old.', '这幅画被认为有两百多年历史。'],
      ['I believe so', '我想是的', '“Will she join us?” “I believe so.”', '“她会加入我们吗？”“我想会的。”'],
      ['believe it or not', '信不信由你', 'Believe it or not, I finished the book in one day.', '信不信由你，我一天就读完了那本书。'],
      ['cannot believe your eyes', '不敢相信自己的眼睛', 'I could not believe my eyes when I saw the result.', '看到结果时，我简直不敢相信自己的眼睛。']
    ],
    synonyms: [
      ['trust', 'v.', '信任；相信', '多指相信某人的诚实、能力或可靠性；believe someone 更侧重相信对方所说的话。'],
      ['think', 'v.', '认为；觉得', '表达普通意见，语气往往比 believe 弱，也不表示信仰。'],
      ['accept', 'v.', '接受；相信', '表示在考虑证据后承认某事为真，也可表示接受提议或物品。'],
      ['be convinced', 'phr.', '确信', '强调经过证据或说服后非常确定，确信程度通常比 believe 高。']
    ],
    antonyms: [
      ['doubt', 'v. / n.', '怀疑', '最常见的反向表达，表示不确定某事是否真实或是否会发生。'],
      ['disbelieve', 'v.', '不相信', '表示认定某个说法不真实，比 doubt 更明确。'],
      ['reject', 'v.', '拒绝接受', '用于拒绝观点、说法或证据，不只是对真实性存疑。']
    ],
    derivatives: [
      ['belief', 'n.', '相信；信念', '非常常用；注意 believe 结尾是 -ve，belief 结尾是 -f。'],
      ['believable', 'adj.', '可信的', '表示故事、解释或人物看起来可能是真的。'],
      ['unbelievable', 'adj.', '难以置信的；极好的', '既可表示“不可信”，口语中也常表示“惊人地好”。'],
      ['believer', 'n.', '信徒；相信者', '常见结构 a firm believer in，表示“……的坚定信奉者”。']
    ],
    confusables: [
      ['belief', 'n.', '相信；信念', 'belief 是名词；believe 是动词。注意拼写变化：believe → belief。'],
      ['trust', 'v. / n.', '信任', 'trust someone 常指相信其可靠性；believe someone 常指相信其所说的话。'],
      ['belong', 'v.', '属于', 'belong 与 believe 开头相近，但含义和搭配完全不同；belong 通常与 to 连用。']
    ],
    related: [
      ['确信程度', [['suspect', 'v.', '猜想；怀疑'], ['think', 'v.', '认为'], ['believe', 'v.', '相信'], ['know', 'v.', '知道']]],
      ['信任关系', [['trust', 'v. / n.', '信任'], ['confidence', 'n.', '信心'], ['faith', 'n.', '信念；信仰'], ['doubt', 'v. / n.', '怀疑']]],
      ['观点表达', [['opinion', 'n.', '观点'], ['evidence', 'n.', '证据'], ['claim', 'n. / v.', '说法；声称'], ['truth', 'n.', '事实；真相']]]
    ],
    examples: [
      ['相信某人', 'I believe you, even though the story sounds unusual.', '虽然这件事听起来不寻常，但我相信你。'],
      ['表达观点', 'I believe this is the safest option.', '我认为这是最安全的选择。'],
      ['相信事实', 'Do you believe everything you read online?', '你相信网上读到的所有内容吗？'],
      ['建立信心', 'You need to believe in yourself.', '你需要相信自己。'],
      ['相信理念', 'She believes in treating everyone with respect.', '她信奉尊重每一个人。'],
      ['有理由相信', 'We have reason to believe the problem has been fixed.', '我们有理由相信问题已经修复。'],
      ['被动表达', 'The building is believed to be unsafe.', '这栋建筑被认为不安全。'],
      ['难以置信', 'It is hard to believe how quickly the year passed.', '很难相信这一年过得这么快。'],
      ['口语回应', '“Will the plan work?” “I believe so.”', '“这个计划会奏效吗？”“我想会的。”'],
      ['不敢相信', 'I could not believe my eyes when I saw the final score.', '看到最终分数时，我简直不敢相信自己的眼睛。']
    ],
    focus: ['believe 可表示相信事实、表达观点，也可用 believe in 表示信任某人的能力或信奉某种理念。', '重点掌握 believe someone、believe that 和 believe in。', '相信某人所说的话直接说 believe someone，不加 to。', 'I believe that small habits can make a big difference.']
  },

  create: {
    meanings: [
      ['v.', 'to make something new that did not exist before', '创造；创作；创建', 'She created a simple plan for the project.', '她为项目制定了一个简单计划。'],
      ['v.', 'to cause a situation, feeling, or result', '造成；引起；营造', 'The delay created several new problems.', '延误造成了几个新问题。']
    ],
    structures: [
      ['create something', '创造或创建某物'],
      ['create something for someone', '为某人创作或创建某物'],
      ['create something from something', '用某种材料创造某物'],
      ['create an opportunity or problem', '创造机会或造成问题']
    ],
    errors: [
      ['create out a new account', 'create a new account', 'create 作及物动词时直接接所创建的事物，不加 out。'],
      ['create an opportunity to someone', 'create an opportunity for someone', '表示“为某人创造机会”用 for 引出受益者。'],
      ['create from something a model', 'create a model from something', '通常先说宾语，再用 from 说明材料或来源。']
    ],
    contexts: [
      ['数字与内容', [['create an account', '创建账户'], ['create a document', '创建文档'], ['create content', '创作内容'], ['create a website', '创建网站']]],
      ['工作与计划', [['create a plan', '制定计划'], ['create a schedule', '制定日程'], ['create a new role', '设立新岗位'], ['create jobs', '创造就业机会']]],
      ['机会与环境', [['create an opportunity', '创造机会'], ['create a positive environment', '营造积极环境'], ['create a good impression', '留下好印象'], ['create value', '创造价值']]],
      ['问题与影响', [['create a problem', '造成问题'], ['create confusion', '引起混乱'], ['create pressure', '造成压力'], ['create demand', '创造需求']]]
    ],
    phrases: [
      ['create an account', '创建账户', 'You need to create an account before saving your progress.', '保存进度前，你需要创建一个账户。'],
      ['create an opportunity', '创造机会', 'The workshop creates opportunities for new writers.', '这个工作坊为新作者创造机会。'],
      ['create a positive environment', '营造积极环境', 'Good teachers create a positive learning environment.', '好老师会营造积极的学习环境。'],
      ['create a plan', '制定计划', 'Let us create a realistic plan for the next two weeks.', '我们为接下来的两周制定一个切实可行的计划吧。'],
      ['create a problem', '造成问题', 'Changing the date now could create a new problem.', '现在改日期可能会造成新问题。'],
      ['create value', '创造价值', 'The feature should create real value for users.', '这个功能应该为用户创造实际价值。'],
      ['create something from', '用……创造某物', 'The artist created the sculpture from recycled metal.', '艺术家用回收金属创作了这座雕塑。'],
      ['be created by', '由……创造或创建', 'The illustration was created by a local artist.', '这幅插图由一位当地艺术家创作。']
    ],
    synonyms: [
      ['make', 'v.', '制作；使产生', '最普通、适用范围最广；create 更强调产生此前不存在的新事物、想法或局面。'],
      ['produce', 'v.', '生产；制作；产生', '常指系统性生产物品、内容或结果，不一定强调原创。'],
      ['generate', 'v.', '产生；生成', '常用于数据、能量、收入、想法或计算机输出，语体较技术化。'],
      ['design', 'v.', '设计', '强调事先规划外观、结构或功能；设计完成后不一定已经实际创造出来。']
    ],
    antonyms: [
      ['destroy', 'v.', '摧毁；破坏', '最直接的反义词，强调使已经存在的事物不复存在或严重受损。'],
      ['erase', 'v.', '擦除；抹去', '常用于文字、数据、痕迹或记忆，不适用于所有 create 的语境。'],
      ['eliminate', 'v.', '消除；淘汰', '强调把问题、风险或选项彻底去除，与 create a problem 等语境相反。']
    ],
    derivatives: [
      ['creation', 'n.', '创造；作品', '可指创造过程，也可指被创造出来的事物。'],
      ['creator', 'n.', '创造者；创作者', '指创作内容、产品或作品的人。'],
      ['creative', 'adj.', '有创造力的；创意的', '常形容人、想法、工作或解决办法。'],
      ['creativity', 'n.', '创造力', '不可数名词，常用 show creativity。'],
      ['creatively', 'adv.', '创造性地', '修饰 solve、think、use 等动词。']
    ],
    confusables: [
      ['creative', 'adj.', '有创造力的', 'creative 是形容词；create 是动词；creation 是名词。'],
      ['invent', 'v.', '发明；编造', 'invent 常指发明全新的设备或方法，也可表示编造故事；create 的范围更广。'],
      ['build', 'v.', '建造；建立', 'build 强调逐步组装或发展结构；create 强调使新事物产生。']
    ],
    related: [
      ['创作过程', [['imagine', 'v.', '想象'], ['design', 'v.', '设计'], ['develop', 'v.', '开发；发展'], ['build', 'v.', '建造；建立']]],
      ['内容成果', [['idea', 'n.', '想法'], ['product', 'n.', '产品'], ['artwork', 'n.', '艺术作品'], ['solution', 'n.', '解决方案']]],
      ['影响结果', [['cause', 'v. / n.', '造成；原因'], ['generate', 'v.', '产生'], ['result', 'n. / v.', '结果；导致'], ['destroy', 'v.', '摧毁']]]
    ],
    examples: [
      ['数字账户', 'You need to create an account before saving your progress.', '保存进度前，你需要创建一个账户。'],
      ['制定计划', 'She created a simple plan for the project.', '她为项目制定了一个简单计划。'],
      ['创作内容', 'The team creates short videos for language learners.', '这个团队为语言学习者制作短视频。'],
      ['营造环境', 'Soft lighting can create a calm atmosphere.', '柔和的灯光可以营造平静的氛围。'],
      ['创造机会', 'The new program will create jobs in the area.', '这个新项目将在该地区创造就业机会。'],
      ['造成问题', 'A small timing error created a much larger problem.', '一个小小的时间错误造成了更大的问题。'],
      ['产生需求', 'Lower prices may create more demand.', '更低的价格可能会产生更多需求。'],
      ['材料来源', 'She created the pattern from a photograph.', '她根据一张照片创作了这个图案。'],
      ['被动表达', 'The logo was created by an independent designer.', '这个标志由一名独立设计师创作。'],
      ['主动输出', 'What would you like to create this year?', '今年你想创造什么？']
    ],
    focus: ['create 表示创造新事物，也可表示造成某种局面、感觉或结果。', '重点掌握 create something、create something for someone 和 create something from something。', 'create 直接接宾语，不说 create out an account。', 'Good questions can create meaningful conversations.']
  },

  include: {
    meanings: [
      ['v.', 'to have someone or something as part of a group, set, or whole', '包括；包含', 'The price includes breakfast and Wi-Fi.', '价格包括早餐和无线网络。'],
      ['v.', 'to make someone or something part of an activity or group', '把……包括在内；让……参与', 'Please include me in the next meeting.', '下次开会请把我也算上。']
    ],
    structures: [
      ['include something', '包括某物'],
      ['include someone in something', '让某人参与某事；把某人包括在内'],
      ['be included in something', '被包括在某事物中'],
      ['including but not limited to', '包括但不限于……']
    ],
    errors: [
      ['The price includes with tax', 'The price includes tax', 'include 作动词时直接接所包含的内容，不加 with。'],
      ['Breakfast is include', 'Breakfast is included', '被动语态要用过去分词 included。'],
      ['include me into the discussion', 'include me in the discussion', '表示“让某人参与某事”用 include someone in something。']
    ],
    contexts: [
      ['价格与服务', [['price includes tax', '价格含税'], ['include free delivery', '包括免费配送'], ['include breakfast', '含早餐'], ['service charge included', '已含服务费']]],
      ['清单与内容', [['include examples', '包括例子'], ['include details', '包含细节'], ['include information about', '包含有关……的信息'], ['include a copy of', '附上一份……']]],
      ['人员与活动', [['include someone in a meeting', '让某人参加会议'], ['include everyone', '把每个人都包括在内'], ['be included in the team', '被纳入团队'], ['feel included', '感到被接纳']]],
      ['范围说明', [['including tax', '包括税费'], ['including children', '包括儿童'], ['not included', '不包括'], ['including but not limited to', '包括但不限于']]]
    ],
    phrases: [
      ['include something', '包括某物', 'The package includes two batteries and a charger.', '包装内含两节电池和一个充电器。'],
      ['include someone in something', '让某人参与某事', 'Please include Maya in the discussion.', '请让玛雅也参加讨论。'],
      ['be included in', '被包括在……中', 'Breakfast is included in the room price.', '房价包含早餐。'],
      ['include information about', '包含有关……的信息', 'Your report should include information about the costs.', '你的报告应包含有关成本的信息。'],
      ['include a copy of', '附上一份……', 'Please include a copy of your receipt.', '请附上一份收据副本。'],
      ['including tax', '包括税费', 'The total is $50, including tax.', '总价为五十美元，含税。'],
      ['not included', '不包括；未包含', 'Flights are not included in the tour price.', '旅行价格不包括机票。'],
      ['including but not limited to', '包括但不限于', 'The rule covers personal data, including but not limited to names and email addresses.', '该规则涵盖个人数据，包括但不限于姓名和电子邮箱地址。']
    ],
    synonyms: [
      ['contain', 'v.', '含有；装有', '强调容器或整体内部含有什么；include 强调列举整体中的一部分，不一定列出全部。'],
      ['cover', 'v.', '包含；涉及', '常用于课程、报告、费用或保险的范围，强调所处理或保障的内容。'],
      ['involve', 'v.', '涉及；需要', '强调某活动必然牵涉的人、步骤或风险，不只是静态地包含。'],
      ['encompass', 'v.', '包含；涵盖', '较正式，强调范围广、把多个不同部分全部纳入。']
    ],
    antonyms: [
      ['exclude', 'v.', '排除；不包括', '最直接的反义词，可表示价格不包含某项，也可表示不让某人参加。'],
      ['omit', 'v.', '省略；遗漏', '强调在清单、文字或行动中没有加入本应出现的内容。'],
      ['leave out', 'phr.', '遗漏；不包括', '日常口语常用，可指漏掉信息或不让某人参与。']
    ],
    derivatives: [
      ['inclusion', 'n.', '包括；纳入；包容', '常用结构 inclusion in，或 diversity and inclusion。'],
      ['inclusive', 'adj.', '包括全部费用的；包容的', 'all-inclusive 表示“全包的”；inclusive 也可形容环境接纳不同人群。'],
      ['included', 'adj.', '包括在内的', '常见表达 tax included、breakfast included。'],
      ['including', 'prep.', '包括；包含', '用来引出例子或整体中的一部分，后接名词或名词短语。']
    ],
    confusables: [
      ['contain', 'v.', '含有；装有', 'A box contains objects；a list includes examples。contain 更强调内部组成，include 更强调把某项列为一部分。'],
      ['involve', 'v.', '涉及；需要', 'involve 强调过程所牵涉的行动或人员；include 只说明某项属于整体。'],
      ['including', 'prep.', '包括', 'including 是介词；include 是动词。句子结构不同，不能直接互换位置。']
    ],
    related: [
      ['整体与部分', [['whole', 'n. / adj.', '整体；全部的'], ['part', 'n.', '部分'], ['item', 'n.', '项目；一项'], ['component', 'n.', '组成部分']]],
      ['范围动作', [['contain', 'v.', '含有'], ['cover', 'v.', '涵盖'], ['involve', 'v.', '涉及'], ['exclude', 'v.', '排除']]],
      ['参与感受', [['join', 'v.', '加入'], ['participate', 'v.', '参加'], ['belong', 'v.', '属于；有归属感'], ['welcome', 'v. / adj.', '欢迎；受欢迎的']]]
    ],
    examples: [
      ['价格内容', 'The price includes breakfast and Wi-Fi.', '价格包括早餐和无线网络。'],
      ['包装清单', 'The package includes two batteries and a charger.', '包装内含两节电池和一个充电器。'],
      ['报告内容', 'Please include a short summary at the beginning.', '请在开头加入一段简短摘要。'],
      ['让人参与', 'Please include me in the next meeting.', '下次开会请把我也算上。'],
      ['团队接纳', 'Good leaders make sure everyone feels included.', '好的领导者会确保每个人都有被接纳的感觉。'],
      ['被动表达', 'Breakfast is included in the room price.', '房价包含早餐。'],
      ['费用排除', 'Delivery is not included in the listed price.', '标价不含配送费。'],
      ['介词用法', 'Six people attended, including two new employees.', '共有六人参加，其中包括两名新员工。'],
      ['范围说明', 'The course covers several skills, including speaking and writing.', '课程涵盖多项技能，包括口语和写作。'],
      ['易错结构', 'The total includes tax, so you do not need to pay extra.', '总价含税，所以你不需要额外付款。']
    ],
    focus: ['include 表示某人或某物是整体的一部分，也可表示让某人参与活动。', '重点掌握 include something、include someone in something 和 be included in。', 'include 直接接宾语，不说 include with；被动形式是 included。', 'The price includes breakfast and Wi-Fi.']
  },

  work: {
    meanings: [
      ['v.', 'to do a job, especially to earn money', '工作；任职', 'She works at a local hospital.', '她在当地一家医院工作。'],
      ['v.', 'to spend time and effort doing something', '做；处理；致力于', 'We are working on a new website.', '我们正在制作一个新网站。'],
      ['v.', 'to operate or function correctly', '运转；运行', 'The printer is not working.', '打印机坏了。'],
      ['v.', 'to produce the result you want', '奏效；起作用', 'This method really works.', '这个方法确实有效。'],
      ['v.', 'to gradually solve or move through something', '努力解决；逐步完成', 'We can work through the problem together.', '我们可以一起逐步解决这个问题。'],
      ['n.', 'a job or the activities you do in a job', '工作', 'I have a lot of work today.', '我今天有很多工作。'],
      ['n.', 'effort used to achieve something', '劳动；努力', 'Learning a language takes hard work.', '学习一门语言需要努力。'],
      ['n.', 'something produced by an artist, writer, or creator', '作品；成果', 'This painting is one of her best works.', '这幅画是她最好的作品之一。']
    ],
    structures: [
      ['work on something', '从事；处理某事'],
      ['work for someone', '为某人或某机构工作'],
      ['work as something', '担任某种职业'],
      ['work with someone', '与某人共事']
    ],
    errors: [
      ['work a project', 'work on a project', '表示“处理项目”要用 work on。'],
      ['work as teacher', 'work as a teacher', '可数职业名词单数前需要冠词。'],
      ['many works to do', 'a lot of work to do', 'work 表示一般工作量时通常不可数；具体作品时 works 才可作复数。']
    ],
    contexts: [
      ['工作与职场', [['full-time work', '全职工作'], ['part-time work', '兼职工作'], ['remote work', '远程工作'], ['office work', '办公室工作']]],
      ['学习与项目', [['schoolwork', '学校作业；课业'], ['research work', '研究工作'], ['project work', '项目工作'], ['written work', '书面作业；书面作品']]],
      ['合作与表现', [['teamwork', '团队合作'], ['good work', '出色的工作'], ['quality work', '高质量的工作'], ['creative work', '创造性工作']]],
      ['日常生活', [['housework', '家务'], ['yard work', '庭院劳动'], ['repair work', '维修工作'], ['volunteer work', '志愿工作']]]
    ],
    phrases: [
      ['work for', '为……工作；受雇于', 'He works for an international bank.', '他在一家国际银行工作。'],
      ['work at', '在某个地点或机构工作', 'Maya works at the front desk.', '玛雅在前台工作。'],
      ['work as', '担任；以……身份工作', 'My brother works as a designer.', '我哥哥是一名设计师。'],
      ['work on', '从事；处理；改进', 'I need to work on my pronunciation.', '我需要改善我的发音。'],
      ['work with', '与……共事；使用', 'She works with young children.', '她从事与幼儿有关的工作。'],
      ['work from home', '居家办公', 'I work from home twice a week.', '我每周居家办公两天。'],
      ['work out', '成功解决；产生好结果；锻炼', 'I hope everything works out.', '我希望一切顺利。'],
      ['work through', '逐步解决或完成', 'Let’s work through the list together.', '我们一起把这份清单逐项处理完吧。'],
      ['work toward', '朝着……努力', 'We are working toward the same goal.', '我们正朝着同一个目标努力。'],
      ['get to work', '开始工作', 'We have a lot to do, so let’s get to work.', '我们有很多事要做，开始干吧。'],
      ['at work', '在工作；在起作用', 'She is still at work.', '她还在上班。'],
      ['out of work', '失业', 'He was out of work for two months.', '他失业了两个月。']
    ],
    synonyms: [
      ['labor', 'v. / n.', '劳动；劳作', '强调费力的体力或艰苦劳动；语气比 work 更重，日常口语中作动词不如 work 常用。'],
      ['function', 'v.', '运转；发挥作用', '主要描述系统、组织或身体部位正常发挥功能，不能表示“任职”。'],
      ['operate', 'v.', '操作；运转', '强调机器运行或人操作设备，比 work 更具体。'],
      ['job', 'n.', '工作；职位', '可数名词，常指一份具体职位或任务；work 表示一般“工作”时通常不可数。'],
      ['employment', 'n.', '就业；受雇', '较正式，强调受雇状态或就业关系，不指某项日常任务。']
    ],
    antonyms: [
      ['rest', 'v. / n.', '休息', '与“工作、劳动”相对，是最直接、最常见的反义词。'],
      ['relax', 'v.', '放松', '强调停止紧张或劳累，不一定表示完全停止工作。'],
      ['fail', 'v.', '失败；失灵', '当 work 表示“奏效、运转”时，fail 是最直接的反义词。'],
      ['unemployment', 'n.', '失业', '与 employment 相对，表示没有工作的状态。']
    ],
    derivatives: [
      ['worker', 'n.', '工人；工作者', '非常常用，可泛指从事某类工作的人。'],
      ['working', 'adj.', '工作的；可用的', '常见于 working hours 和 working model。'],
      ['workable', 'adj.', '可行的；行得通的', '常用于计划、方案和解决办法。'],
      ['workplace', 'n.', '工作场所', '常用于职场制度和文化语境。'],
      ['workforce', 'n.', '劳动力；全体员工', '常用于商业、经济和人力资源语境。'],
      ['workaholic', 'n.', '工作狂', '日常表达中常用，通常暗含工作过度。'],
      ['workmanship', 'n.', '工艺；做工', '常见于产品质量语境。']
    ],
    confusables: [
      ['walk', 'v. / n.', '走路；散步', '与 work 拼写相近，但元音和含义完全不同；walk 中的 l 不发音。'],
      ['word', 'n.', '单词；话语', '发音开头相近，但末尾是 /d/；work 的末尾是 /k/。'],
      ['world', 'n.', '世界', '与 work 发音相近，但 world 多出 /ld/ 音。'],
      ['task', 'n.', '任务', '指一项具体、可完成的任务；work 范围更广，表示工作时通常不可数。']
    ],
    related: [
      ['职业与事业', [['career', 'n.', '职业生涯'], ['profession', 'n.', '专业；职业'], ['occupation', 'n.', '职业']]],
      ['任务与项目', [['assignment', 'n.', '任务；作业'], ['project', 'n.', '项目'], ['duty', 'n.', '职责；义务']]],
      ['成果与进展', [['result', 'n.', '结果'], ['progress', 'n.', '进展'], ['achievement', 'n.', '成就']]],
      ['工作环境', [['office', 'n.', '办公室'], ['company', 'n.', '公司'], ['team', 'n.', '团队']]]
    ],
    examples: [
      ['日常使用', 'I have to work tomorrow.', '我明天得上班。'],
      ['工作场所', 'She works at a small law firm.', '她在一家小型律师事务所工作。'],
      ['职业身份', 'He works as a nurse.', '他是一名护士。'],
      ['工作对象', 'We are working on the budget now.', '我们现在正在处理预算。'],
      ['学习改进', 'You need to work on your writing.', '你需要提高写作能力。'],
      ['与人合作', 'I enjoy working with this team.', '我喜欢和这个团队共事。'],
      ['机器运转', 'Does the air conditioner work?', '空调能正常运转吗？'],
      ['方法奏效', 'That idea might work.', '那个主意也许行得通。'],
      ['解决问题', 'Do not worry—we will work it out.', '别担心，我们会解决的。'],
      ['名词用法', 'I finished my work early today.', '我今天提前完成了工作。'],
      ['不可数名词', 'I have a lot of work to do.', '我有很多工作要做。'],
      ['艺术作品', 'The museum displays her early work.', '博物馆展出了她的早期作品。']
    ],
    focus: ['work 作动词表示“工作、运转、奏效”；作名词表示“工作、劳动或作品”。', '重点掌握 work on、work for、work as 和 work out。', '表示一般工作量时说 a lot of work，不说 many works；具体职位用 job。', 'I’m working on it.']
  }
};

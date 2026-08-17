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

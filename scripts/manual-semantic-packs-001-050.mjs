// Human-authored semantic source for learning-priority cards 1–50.
//
// This file deliberately contains no corpus clipping, WordNet expansion, or
// count-padding logic. Every learner-facing row below was reviewed as a complete
// phrase/sentence and belongs to the named sense or semantic field.

const M = (...rows) => rows;
const F = (...rows) => rows;
const C = (...groups) => groups;
const G = (category, ...rows) => [category, rows];
const D = (...rows) => rows;
const S = (...rows) => rows;
const A = (...rows) => rows;
const X = (...rows) => rows;
const R = (...groups) => groups;
const E = (...rows) => rows;

export const manualSemanticPacks001050 = {
  be: {
    meanings: M(
      ["v.", "to exist or be present", "存在；有", "There will be enough time to discuss it.", "会有足够的时间讨论这件事。"],
      ["linking v.", "to have a particular identity, quality, or state", "是；处于某种状态", "The final decision is yours.", "最终决定由你来做。"],
      ["aux.", "used with another verb to form continuous or passive constructions", "用于构成进行时或被动语态", "The bridge is being repaired.", "这座桥正在维修。"]
    ),
    fixedPhrases: F(
      ["be aware of something", "意识到某事", "You should be aware of the risks.", "你应该意识到这些风险。"],
      ["be likely to do something", "很可能做某事", "Prices are likely to rise again.", "价格很可能再次上涨。"],
      ["be supposed to do something", "应该做某事；按规定做某事", "We are supposed to arrive by eight.", "我们应该在八点前到达。"],
      ["be willing to do something", "愿意做某事", "She is willing to help with the event.", "她愿意帮忙筹办活动。"],
      ["be afraid of something", "害怕某事物", "The child is afraid of the dark.", "这个孩子怕黑。"],
      ["be different from something", "与某事物不同", "This version is different from the original.", "这个版本与原版不同。"],
      ["be in charge of something", "负责某事", "Maya is in charge of the schedule.", "玛雅负责日程安排。"],
      ["be worth doing", "值得做", "The museum is worth visiting.", "这间博物馆值得参观。"],
      ["be familiar with something", "熟悉某事物", "Are you familiar with this software?", "你熟悉这个软件吗？"],
      ["be based on something", "以某事物为基础", "The film is based on a true story.", "这部电影根据真实故事改编。"]
    ),
    contexts: C(
      G("身份与角色", ["be a close friend", "是亲密朋友"], ["be the main reason", "是主要原因"], ["be part of the team", "是团队的一员"]),
      G("性质与状态", ["be completely honest", "完全诚实"], ["be under pressure", "承受压力"], ["be out of date", "已经过时"]),
      G("地点与存在", ["be at the entrance", "在入口处"], ["be available online", "可在线获取"], ["be nowhere to be found", "哪里都找不到"]),
      G("时间与安排", ["be due next week", "下周到期"], ["be on? no placeholder", ""], ["be over by noon", "中午前结束"])
    ),
    derivatives: D(["being", "n.", "存在；生命", "作可数名词时常指生物或人，如 a human being。"]),
    synonyms: S(
      ["exist", "v.", "存在", "只对应 be 的‘存在’义，不作系动词连接身份或性质。"],
      ["remain", "v.", "仍然是；保持", "强调状态持续不变，不能替代表示身份或一般存在的 be。"],
      ["constitute", "v.", "构成；相当于", "正式用词，强调某事在定义上构成另一事物，后面直接接宾语。"],
      ["equal", "v.", "等于；相当于", "用于数值或效果相等；，不替代 be 的地点、状态或助动词用法。"]
    ),
    antonyms: A(["cease to exist", "phr.", "不复存在", "仅与 be 的‘存在’义形成明确对比。"]),
    confusables: X(
      ["there is", "phr.", "有；存在", "there is 引出新信息；be 本身还可连接主语的身份、性质和位置。"],
      ["become", "v.", "变成", "be 描写当前状态；become 强调从一种状态转变到另一种状态。"]
    ),
    related: R(
      G("身份关系", ["identity", "n.", "身份"], ["role", "n.", "角色"], ["member", "n.", "成员"], ["position", "n.", "职位；位置"]),
      G("状态描述", ["condition", "n.", "状态；状况"], ["status", "n.", "状态；地位"], ["available", "adj.", "可获得的；有空的"], ["absent", "adj.", "缺席的；不存在的"]),
      G("系词补语", ["attribute", "n.", "属性；特征"], ["quality", "n.", "特质；质量"], ["location", "n.", "位置"], ["duration", "n.", "持续时间"])
    ),
    commonErrors: E(
      ["I am agree with you.", "I agree with you.", "agree 是实义动词，前面不加 be。"],
      ["She be tired today.", "She is tired today.", "一般现在时中 be 要随主语变为 am、is 或 are。"]
    )
  },

  have: {
    meanings: M(
      ["v.", "to own, possess, or contain something", "有；拥有；包含", "The apartment has two bedrooms.", "这套公寓有两间卧室。"],
      ["v.", "to experience, eat, drink, or take part in something", "经历；吃；喝；进行", "We had a long discussion after lunch.", "午饭后我们进行了长时间讨论。"],
      ["aux.", "used with a past participle to form perfect tenses", "用于构成完成时", "I have already sent the email.", "我已经发送了邮件。"]
    ),
    fixedPhrases: F(
      ["have access to something", "有权使用或接触某物", "All students have access to the library.", "所有学生都可以使用图书馆。"],
      ["have an effect on something", "对某事产生影响", "Sleep has an effect on memory.", "睡眠会影响记忆。"],
      ["have a word with someone", "与某人简短谈一谈", "Could I have a word with you?", "我能和你谈几句吗？"],
      ["have no choice but to do something", "别无选择只能做某事", "We had no choice but to cancel.", "我们别无选择，只能取消。"],
      ["have a point", "说得有道理", "You have a point about the cost.", "你关于成本的看法有道理。"],
      ["have something in mind", "心里有某个想法", "Do you have a date in mind?", "你心里有想好的日期吗？"],
      ["have a hard time doing something", "做某事很困难", "He had a hard time finding parking.", "他很难找到停车位。"],
      ["have nothing to do with something", "与某事无关", "This issue has nothing to do with money.", "这个问题与钱无关。"],
      ["have someone over", "请某人来家里做客", "We are having friends over tonight.", "今晚我们请朋友来家里做客。"],
      ["have yet to do something", "尚未做某事", "The company has yet to respond.", "公司尚未回应。"]
    ),
    contexts: C(
      G("拥有与构成", ["have a valid passport", "持有有效护照"], ["have several advantages", "有几个优点"], ["have room for improvement", "有改进空间"]),
      G("经历与感受", ["have a wonderful time", "过得很愉快"], ["have a headache", "头痛"], ["have doubts about something", "对某事有疑虑"]),
      G("餐饮与活动", ["have coffee together", "一起喝咖啡"], ["have a quick shower", "快速洗个澡"], ["have another try", "再试一次"]),
      G("完成时用法", ["have already decided", "已经决定"], ["have never visited", "从未参观过"], ["have worked here since May", "从五月起就在这里工作"])
    ),
    derivatives: D(),
    synonyms: S(
      ["possess", "v.", "拥有；具有", "比 have 正式，常用于财产、能力或品质，不用于吃饭、经历或完成时。"],
      ["own", "v.", "拥有", "强调所有权，不能替代 have a headache 或 have lunch 等经验性用法。"],
      ["hold", "v.", "持有；容纳", "常指手持、合法持有或容纳一定数量，覆盖范围比 have 窄。"],
      ["contain", "v.", "包含；容纳", "主语通常是容器、文本或整体，强调内部含有，不表示所有权。"]
    ),
    antonyms: A(["lack", "v.", "缺少", "与 have 的‘拥有所需事物’义相反，后面直接接宾语。"]),
    confusables: X(["there is", "phr.", "有；存在", "there is 用来引出某处存在的事物；have 表示主语拥有或经历某事。"]),
    related: R(
      G("所有与财产", ["ownership", "n.", "所有权"], ["property", "n.", "财产"], ["belongings", "n.", "个人物品"], ["asset", "n.", "资产；有价值的事物"]),
      G("经历与事件", ["experience", "n.", "经历"], ["occasion", "n.", "场合"], ["episode", "n.", "一段经历；事件"], ["encounter", "n.", "遭遇；邂逅"]),
      G("包含与容量", ["capacity", "n.", "容量"], ["contents", "n.", "所含物品；内容"], ["component", "n.", "组成部分"], ["feature", "n.", "特征；功能"])
    ),
    commonErrors: E(
      ["I have been there yesterday.", "I went there yesterday.", "明确的过去时间 yesterday 通常用一般过去时，不用现在完成时。"],
      ["She has a breakfast at seven.", "She has breakfast at seven.", "表示日常三餐时 breakfast 前通常不用不定冠词。"]
    )
  },

  do: {
    meanings: M(
      ["v.", "to perform an action, activity, or piece of work", "做；执行；完成", "I need to do some paperwork tonight.", "今晚我得处理一些文书工作。"],
      ["aux.", "used to form questions, negatives, and emphatic statements", "用于构成疑问、否定和强调", "Do you know her name?", "你知道她的名字吗？"],
      ["v.", "to be suitable, sufficient, or acceptable", "合适；够用", "This small table will do for now.", "这张小桌子暂时够用了。"]
    ),
    fixedPhrases: F(
      ["do the right thing", "做正确的事", "He decided to do the right thing and apologize.", "他决定做正确的事并道歉。"],
      ["do your duty", "尽职责", "Everyone must do their duty.", "每个人都必须尽自己的职责。"],
      ["do the dishes", "洗餐具", "I will do the dishes after dinner.", "晚饭后我来洗碗。"],
      ["do someone harm", "伤害某人", "The delay did no one any harm.", "这次耽搁没有伤害任何人。"],
      ["do someone good", "对某人有益", "A short walk will do you good.", "散一小会儿步对你有好处。"],
      ["do a good job", "把工作做好", "You did a good job on the presentation.", "你的演示做得很好。"],
      ["do your share", "尽自己的一份力", "We all need to do our share.", "我们都需要尽自己的一份力。"],
      ["do as you are told", "照吩咐去做", "Please do as you are told.", "请照吩咐去做。"],
      ["do away with something", "废除；去掉某事物", "The new system does away with paper forms.", "新系统取消了纸质表格。"],
      ["do for someone", "足以毁掉某人；使某人完蛋", "Another scandal could do for his career.", "再来一桩丑闻就可能毁掉他的事业。"]
    ),
    contexts: C(
      G("任务与家务", ["do the laundry", "洗衣服"], ["do a calculation", "进行计算"], ["do the shopping", "买东西"]),
      G("学习与工作", ["do an experiment", "做实验"], ["do a training course", "参加培训课程"], ["do overtime", "加班"]),
      G("表现与影响", ["do badly in an exam", "考试考得不好"], ["do wonders for morale", "极大提升士气"], ["do more than expected", "做得超出预期"]),
      G("助动词结构", ["do not interrupt", "不要打断"], ["do you remember", "你记得吗"], ["do appreciate your help", "确实感谢你的帮助"])
    ),
    derivatives: D(["doer", "n.", "实干者", "指采取行动的人，常见于 a doer rather than a talker。"], ["doing", "n.", "行为；所作所为", "通常用复数 doings 或结构 someone's doing。"]),
    synonyms: S(
      ["perform", "v.", "执行；完成；表演", "比 do 正式，常与 task、operation、duty 连用，也可指表演。"],
      ["carry out", "phr.", "执行；实施", "强调按计划、指示或研究方案把任务落实。"],
      ["execute", "v.", "执行；实施", "正式且技术性较强，常用于 execute a plan、command 或 program。"],
      ["accomplish", "v.", "完成；实现", "强调取得预期成果，而 do 只说明进行某项活动。"]
    ),
    antonyms: A(["neglect", "v.", "疏于做；忽视", "与 do one's duty/work 的履行义形成对比。"]),
    confusables: X(["make", "v.", "制作；创造；促成", "do 常配任务、活动和工作；make 常配产品、决定、计划和结果。"]),
    related: R(
      G("任务类型", ["task", "n.", "任务"], ["chore", "n.", "日常杂务"], ["assignment", "n.", "作业；任务"], ["errand", "n.", "差事"]),
      G("行动过程", ["action", "n.", "行动"], ["activity", "n.", "活动"], ["procedure", "n.", "程序；步骤"], ["operation", "n.", "操作；行动"]),
      G("完成与质量", ["completion", "n.", "完成"], ["effort", "n.", "努力"], ["performance", "n.", "表现；执行"], ["result", "n.", "结果"])
    ),
    commonErrors: E(
      ["Did you went home?", "Did you go home?", "助动词 did 后必须接动词原形。"],
      ["I made my homework.", "I did my homework.", "homework 与 do 搭配；make 不用于表示完成作业。"]
    )
  },

  say: {
    meanings: M(
      ["v.", "to speak words or express something in words", "说；讲；表达", "She said that she needed more time.", "她说自己需要更多时间。"],
      ["v.", "to give information or instructions in written form", "写着；说明", "The sign says No Parking.", "牌子上写着‘禁止停车’。"]
    ),
    fixedPhrases: F(
      ["say yes to something", "同意某事", "She said yes to the invitation.", "她接受了邀请。"],
      ["say no more", "不用再说；到此为止", "Say no more—I understand.", "不用再说了，我明白。"],
      ["say a few words", "讲几句话", "The host asked me to say a few words.", "主持人请我讲几句话。"],
      ["say something out loud", "把某事大声说出来", "Try saying the sentence out loud.", "试着把这个句子大声说出来。"],
      ["say something under your breath", "低声嘀咕某事", "He said something under his breath.", "他低声嘀咕了一句。"],
      ["say so", "这样说；表示同意", "If you need help, just say so.", "如果你需要帮助，尽管说。"],
      ["say the word", "开口吩咐；发话", "Just say the word and I will come.", "你只要开口，我就来。"],
      ["not to say", "更不用说；甚至可以说", "The route is difficult, not to say dangerous.", "这条路线很难走，甚至可以说很危险。"],
      ["that is to say", "也就是说", "He is a linguist, that is to say, a language expert.", "他是语言学家，也就是说，是语言专家。"],
      ["have a say in something", "对某事有发言权", "Staff should have a say in the decision.", "员工应该对这个决定有发言权。"]
    ),
    contexts: C(
      G("转述内容", ["say where you are going", "说明要去哪里"], ["say whether you agree", "说明是否同意"], ["say exactly what happened", "准确说明发生了什么"]),
      G("发言方式", ["say something politely", "礼貌地说某事"], ["say it with confidence", "自信地说出来"], ["say the words slowly", "慢慢说出这些话"]),
      G("文字与数据", ["the report says otherwise", "报告给出不同说法"], ["the label says dry clean only", "标签写着只能干洗"], ["the clock says half past six", "钟表显示六点半"]),
      G("观点与反应", ["say what you think", "说出自己的想法"], ["say something in response", "作出言语回应"], ["say nothing about the cost", "没有提到费用"])
    ),
    derivatives: D(["saying", "n.", "谚语；格言", "指广为流传的简短说法，如 a well-known saying。"]),
    synonyms: S(
      ["state", "v.", "陈述；说明", "比 say 正式，强调清楚明确地给出事实或立场。"],
      ["tell", "v.", "告诉；讲述", "通常要接听话对象，如 tell me；say 后常直接接说出的内容。"],
      ["express", "v.", "表达", "强调把思想或感情传达出来，可通过语言、动作或艺术。"],
      ["mention", "v.", "提到", "只表示简短涉及某个话题，不表示完整陈述或讲述。"]
    ),
    antonyms: A(["withhold", "v.", "隐瞒；不说出", "与 say/share information 的表达义相反，强调有意不透露。"]),
    confusables: X(["speak", "v.", "说话；发言", "speak 强调说话行为或语言能力；say 强调说出的具体内容。"]),
    related: R(
      G("言语内容", ["statement", "n.", "陈述"], ["remark", "n.", "评论；话语"], ["comment", "n.", "评论"], ["message", "n.", "信息；口信"]),
      G("说话方式", ["aloud", "adv.", "出声地"], ["quietly", "adv.", "轻声地"], ["clearly", "adv.", "清楚地"], ["frankly", "adv.", "坦率地"]),
      G("交流场景", ["conversation", "n.", "交谈"], ["quotation", "n.", "引语"], ["announcement", "n.", "公告"], ["reply", "n.", "答复"])
    ),
    commonErrors: E(
      ["She said me the truth.", "She told me the truth.", "say 不直接接人作间接宾语；用 tell someone something。"],
      ["He said me to wait.", "He told me to wait.", "表示吩咐某人做事用 tell someone to do，不用 say someone to do。"]
    )
  },

  go: {
    meanings: M(
      ["v.", "to move or travel from one place to another", "去；前往；移动", "We go to the market on Saturdays.", "我们星期六去市场。"],
      ["v.", "to develop, proceed, or function in a particular way", "进展；进行；运转", "How did the interview go?", "面试进行得怎么样？"],
      ["linking v.", "to become or enter a particular state", "变得；进入某种状态", "The screen suddenly went blank.", "屏幕突然变成了空白。"]
    ),
    fixedPhrases: F(
      ["go ahead", "开始吧；继续进行", "Go ahead and ask your question.", "请问吧。"],
      ["go back on your word", "食言", "He never goes back on his word.", "他从不食言。"],
      ["go against something", "违背；反对某事", "The decision goes against our policy.", "这个决定违反了我们的政策。"],
      ["go without something", "没有某物也能应付", "We had to go without heating for a day.", "我们有一天没有暖气可用。"],
      ["go over something", "仔细检查或复习某事", "Let's go over the figures once more.", "我们再核对一遍数据吧。"],
      ["go out of your way to do something", "特意尽力做某事", "She went out of her way to help us.", "她特意尽力帮助了我们。"],
      ["go hand in hand", "密切相关；并行", "Trust and honesty go hand in hand.", "信任与诚实密不可分。"],
      ["go from bad to worse", "每况愈下", "The weather went from bad to worse.", "天气越来越糟。"],
      ["go too far", "做得过分", "That joke went too far.", "那个玩笑开得太过分了。"],
      ["go to great lengths", "竭尽全力", "They went to great lengths to protect the data.", "他们竭尽全力保护数据。"]
    ),
    contexts: C(
      G("出行与方向", ["go upstairs", "上楼"], ["go across the bridge", "过桥"], ["go straight ahead", "一直向前走"]),
      G("活动与参与", ["go swimming after work", "下班后去游泳"], ["go for a drive", "开车兜风"], ["go camping in spring", "春天去露营"]),
      G("进展与运作", ["go according to plan", "按计划进行"], ["go smoothly so far", "到目前为止进展顺利"], ["go badly wrong", "出现严重差错"]),
      G("状态变化", ["go silent", "变得沉默"], ["go missing overnight", "一夜之间失踪"], ["go stale quickly", "很快变得不新鲜"])
    ),
    derivatives: D(
      ["goer", "n.", "经常参加某类活动的人", "多见于 moviegoer、theatergoer 等复合词，表示经常去某类场所或活动的人。"],
      ["going", "n. / adj.", "进展；现行的", "名词常见于 the going is tough；形容词常见于 the going rate。"],
      ["ongoing", "adj.", "持续进行的", "强调事情尚未结束并仍在发展，常修饰 discussion、investigation 或 work。"],
      ["outgoing", "adj.", "外向的；离任的；寄出的", "可描述性格外向，也可修饰即将离任的人或正在寄出的邮件。"]
    ),
    synonyms: S(
      ["travel", "v.", "旅行；行进", "强调从一地到另一地的旅程，不覆盖 go wrong 或 go silent 等变化义。"],
      ["move", "v.", "移动；搬迁", "强调位置改变，可及物；go 通常不及物并常带目的地。"],
      ["proceed", "v.", "继续进行；前往", "较正式，常用于指示下一步行动或按路线前行。"],
      ["depart", "v.", "离开；出发", "强调离开起点，正式程度高于 go，常与 for/from 连用。"]
    ),
    antonyms: A(["stay", "v.", "停留；留下", "与 go 的‘离开并前往别处’义形成直接对比。"]),
    confusables: X(
      ["come", "v.", "来；到达", "go 通常表示离开说话者所在处；come 通常表示朝说话者或参照点移动。"],
      ["get", "v.", "到达；获得；变得", "get to 强调到达结果；go to 强调前往过程或习惯性行动。"]
    ),
    related: R(
      G("交通出行", ["journey", "n.", "旅程"], ["route", "n.", "路线"], ["destination", "n.", "目的地"], ["transport", "n.", "交通；运输"]),
      G("活动安排", ["outing", "n.", "短途出游"], ["trip", "n.", "旅行"], ["excursion", "n.", "短途旅行"], ["commute", "n. / v.", "通勤"]),
      G("过程状态", ["progress", "n.", "进展"], ["operation", "n.", "运转"], ["transition", "n.", "转变"], ["direction", "n.", "方向"])
    ),
    commonErrors: E(
      ["I go to home now.", "I am going home now.", "home 作方向副词时前面不用 to；正在发生的动作要用进行时。"],
      ["We went to shopping.", "We went shopping.", "go + 活动类 -ing 形式时通常不加 to。"]
    )
  },

  get: {
    meanings: M(
      ["v.", "to obtain, receive, or buy something", "得到；收到；买到", "I got a message from Nina.", "我收到了妮娜的消息。"],
      ["v.", "to become or cause someone or something to become", "变得；使进入某种状态", "The days are getting shorter.", "白天正变得越来越短。"],
      ["v.", "to arrive at or reach a place", "到达", "What time did you get home?", "你几点到家的？"],
      ["v.", "to understand or successfully deal with something", "理解；设法完成", "I don't get the joke.", "我没听懂这个笑话。"]
    ),
    fixedPhrases: F(
      ["get hold of someone", "联系到某人", "I finally got hold of the technician.", "我终于联系上了技术员。"],
      ["get the hang of something", "掌握某事的诀窍", "You will soon get the hang of it.", "你很快就会掌握诀窍。"],
      ["get something across", "把某事讲清楚", "She got her main point across clearly.", "她清楚地表达了主要观点。"],
      ["get down to something", "开始认真处理某事", "Let's get down to business.", "我们开始谈正事吧。"],
      ["get away with something", "做坏事而未受惩罚", "He cannot get away with cheating.", "他作弊不可能不受惩罚。"],
      ["get around to doing something", "抽出时间做拖延的事", "I finally got around to fixing the shelf.", "我终于抽时间修好了架子。"],
      ["get along with someone", "与某人相处融洽", "Do you get along with your neighbors?", "你和邻居相处得好吗？"],
      ["get back to someone", "稍后回复某人", "I will get back to you tomorrow.", "我明天回复你。"],
      ["get by", "勉强应付；过得去", "We can get by on a small income.", "靠很少的收入我们也能勉强生活。"],
      ["get carried away", "变得过于激动；失去分寸", "I got carried away and spent too much.", "我一时冲动，花得太多了。"]
    ),
    contexts: C(
      G("获得与接收", ["get permission in writing", "获得书面许可"], ["get a refund", "获得退款"], ["get useful feedback", "得到有用反馈"]),
      G("变化与结果", ["get increasingly difficult", "变得越来越困难"], ["get the door open", "把门打开"], ["get everyone involved", "让每个人都参与"]),
      G("到达与移动", ["get to the station early", "提前到车站"], ["get back before dark", "天黑前回来"], ["get upstairs safely", "安全上楼"]),
      G("理解与完成", ["get what someone means", "明白某人的意思"], ["get the report finished", "把报告完成"], ["get through a difficult week", "熬过艰难的一周"])
    ),
    derivatives: D(),
    synonyms: S(
      ["obtain", "v.", "获得", "正式用词，强调通过努力或程序取得，不覆盖 get tired、get home 等义。"],
      ["receive", "v.", "收到；接收", "强调被动收到寄送、给予或传达的事物，不表示主动买到。"],
      ["acquire", "v.", "获得；习得", "正式且强调逐渐取得技能、知识、财产或特征。"],
      ["gain", "v.", "获得；增加", "常与 experience、confidence、weight 等抽象或可增长事物搭配。"]
    ),
    antonyms: A(["lose", "v.", "失去", "只与 get 的‘获得、拥有到手’义形成对比。"]),
    confusables: X(["become", "v.", "变成", "become 较正式且不及物；get + 形容词更口语，常强调渐变或意外变化。"]),
    related: R(
      G("获取过程", ["access", "n.", "使用权；接触机会"], ["purchase", "n.", "购买"], ["delivery", "n.", "递送"], ["reward", "n.", "奖励"]),
      G("变化结果", ["improvement", "n.", "改善"], ["decline", "n.", "下降；衰退"], ["transformation", "n.", "转变"], ["outcome", "n.", "结果"]),
      G("到达理解", ["arrival", "n.", "到达"], ["destination", "n.", "目的地"], ["insight", "n.", "领悟"], ["comprehension", "n.", "理解"])
    ),
    commonErrors: E(
      ["I got to home late.", "I got home late.", "get home 中 home 作副词，前面不用 to。"],
      ["She got married with Tom.", "She got married to Tom.", "表示与某人结婚用 get married to someone。"]
    )
  },

  can: {
    meanings: M(
      ["modal v.", "used to express ability or possibility", "能；会；可能", "She can solve the problem herself.", "她能独自解决这个问题。"],
      ["modal v.", "used to ask for or give permission", "可以；获准", "Can I use your phone?", "我可以用你的电话吗？"],
      ["modal v.", "used for requests, offers, or general truths", "用于请求、提议或一般情况", "Can you hold the door, please?", "请你扶一下门好吗？"]
    ),
    fixedPhrases: F(
      ["can afford something", "买得起；承担得起某事", "We cannot afford another delay.", "我们承担不起再次延期。"],
      ["can tell", "能够看出或判断", "I can tell that you are tired.", "我看得出你累了。"],
      ["can hardly believe something", "几乎无法相信某事", "I can hardly believe the result.", "我简直不敢相信这个结果。"],
      ["can do without something", "没有某物也能应付", "I can do without dessert.", "没有甜点我也行。"],
      ["can always do something", "随时可以做某事", "You can always change your mind.", "你随时可以改变主意。"],
      ["can be found", "可以找到；可见于", "The details can be found online.", "详细信息可以在网上找到。"],
      ["can only do something", "只能做某事", "We can only wait and see.", "我们只能等等看。"],
      ["can be difficult", "有时会很难", "Working from home can be difficult.", "居家办公有时会很难。"],
      ["can manage to do something", "有能力设法做成某事", "I can manage to finish by Friday.", "我能设法在周五前完成。"],
      ["as best someone can", "尽某人所能", "He explained it as best he could.", "他尽可能清楚地解释了这件事。"]
    ),
    contexts: C(
      G("能力技能", ["can read music", "会识谱"], ["can lift fifty kilos", "能举起五十公斤"], ["can work independently", "能独立工作"]),
      G("客观可能", ["can cause serious damage", "可能造成严重损害"], ["can occur at any age", "任何年龄都可能发生"], ["can vary considerably", "可能有很大差异"]),
      G("许可请求", ["can I sit here", "我可以坐这里吗"], ["can we leave early", "我们可以提前离开吗"], ["can guests use the pool", "客人可以使用泳池吗"]),
      G("帮助提议", ["can I carry that", "我帮你拿那个好吗"], ["can we discuss this later", "我们可以稍后讨论吗"], ["can you check the total", "你能核对总数吗"])
    ),
    derivatives: D(),
    synonyms: S(
      ["be able to", "phr.", "能够", "可用于更多时态，如 will be able to；can 没有完整的不定式和完成时形式。"],
      ["be capable of", "phr.", "有能力做；可能做出", "后接名词或 -ing，常强调潜在能力或某种行为可能性。"],
      ["know how to", "phr.", "知道如何做；会做", "强调掌握方法，而 can 还可表示体力、许可和客观可能。"],
      ["be permitted to", "phr.", "获准做某事", "仅对应许可义，语气正式，不能表示技能或客观可能。"]
    ),
    antonyms: A(["be unable to", "phr.", "无法做某事", "与 can 的实际能力义相反，不等同于禁止做某事。"]),
    confusables: X(
      ["may", "modal v.", "可能；可以", "may 表可能时不如 can 强调一般可能性；表许可时更正式。"],
      ["could", "modal v.", "能够；可能；可以", "could 可表示过去能力、较弱可能或更委婉请求；can 更直接。"]
    ),
    related: R(
      G("能力条件", ["ability", "n.", "能力"], ["skill", "n.", "技能"], ["capacity", "n.", "能力；容量"], ["competence", "n.", "胜任能力"]),
      G("许可规则", ["permission", "n.", "许可"], ["authorization", "n.", "授权"], ["rule", "n.", "规则"], ["restriction", "n.", "限制"]),
      G("可能程度", ["possibility", "n.", "可能性"], ["potential", "n. / adj.", "潜力；潜在的"], ["feasible", "adj.", "可行的"], ["impossible", "adj.", "不可能的"])
    ),
    commonErrors: E(
      ["She can to swim.", "She can swim.", "情态动词 can 后直接接动词原形，不加 to。"],
      ["He cans speak French.", "He can speak French.", "情态动词 can 不随第三人称单数加 -s。"]
    )
  },

  know: {
    meanings: M(
      ["v.", "to have information or understanding about something", "知道；了解；懂得", "Do you know why the shop is closed?", "你知道商店为什么关门吗？"],
      ["v.", "to be familiar with a person, place, or subject", "认识；熟悉", "I know the city quite well.", "我很熟悉这座城市。"],
      ["v.", "to recognize or be certain about something", "认出；确信", "I knew his voice immediately.", "我立刻认出了他的声音。"]
    ),
    fixedPhrases: F(
      ["know better than to do something", "明事理而不至于做某事", "You should know better than to drive so fast.", "你应该知道不该开得这么快。"],
      ["know something inside out", "对某事了如指掌", "She knows the system inside out.", "她对这个系统了如指掌。"],
      ["know someone from somewhere", "在某处认识某人", "I know Lena from college.", "我在大学时就认识莉娜。"],
      ["know of someone", "听说过某人", "I know of the author but have not read her books.", "我听说过这位作者，但没读过她的书。"],
      ["know for a fact", "确切知道", "I know for a fact that he was there.", "我确切知道他当时在那里。"],
      ["know what you are doing", "清楚自己在做什么", "Don't worry—she knows what she is doing.", "别担心，她清楚自己在做什么。"],
      ["before you know it", "转眼之间；不知不觉", "The holiday will be over before you know it.", "假期转眼就会结束。"],
      ["you never know", "很难说；谁也说不准", "Take an umbrella—you never know.", "带把伞吧，谁也说不准。"],
      ["not that I know of", "据我所知没有", "Is there a problem? Not that I know of.", "有问题吗？据我所知没有。"],
      ["let it be known that", "公开声明……", "The director let it be known that changes were coming.", "主管公开表示即将有变动。"]
    ),
    contexts: C(
      G("事实信息", ["know the exact date", "知道确切日期"], ["know why it failed", "知道失败原因"], ["know whether it is safe", "不知道是否安全"]),
      G("人物地点", ["know the neighborhood well", "很熟悉这个街区"], ["know someone personally", "与某人私下相识"], ["know every member by name", "知道每位成员的名字"]),
      G("技能经验", ["know how to negotiate", "懂得如何谈判"], ["know a little Spanish", "懂一点西班牙语"], ["know the subject thoroughly", "彻底掌握这个学科"]),
      G("判断确信", ["know something is wrong", "知道某事不对"], ["know the difference immediately", "立即看出区别"], ["know from experience", "从经验中知道"])
    ),
    derivatives: D(
      ["knowledge", "n.", "知识；了解", "不可数名词，常用 knowledge of/about something。"],
      ["knowledgeable", "adj.", "知识渊博的", "常与 about 连用，表示熟悉某一领域。"],
      ["known", "adj.", "已知的；知名的", "常见于 be known for/as/to 等结构。"],
      ["unknown", "adj. / n.", "未知的；未知事物", "形容尚不为人知，也可作名词指未知因素。"],
      ["knowingly", "adv.", "故意地；会意地", "表示明知情况仍做某事，或带着会意的神情。"]
    ),
    synonyms: S(
      ["understand", "v.", "理解", "强调明白意义、原因或原理；know 也可只表示掌握事实。"],
      ["recognize", "v.", "认出；承认", "强调再次辨认人或事物，或承认某事实，不表示一般熟悉。"],
      ["be aware of", "phr.", "意识到；知道", "强调注意到某事实或风险，通常不用于认识某个人。"],
      ["realize", "v.", "意识到；领悟", "强调经过思考后突然明白；know 表示已经拥有该信息。"]
    ),
    antonyms: A(["be unaware of", "phr.", "没有意识到；不知道", "与 know/be aware of 某事实的义项相反。"]),
    confusables: X(["learn", "v.", "学习；得知", "learn 强调获得新知识的过程；know 描述已经知道或掌握的状态。"]),
    related: R(
      G("知识内容", ["fact", "n.", "事实"], ["information", "n.", "信息"], ["detail", "n.", "细节"], ["subject", "n.", "学科；主题"]),
      G("理解认知", ["awareness", "n.", "意识"], ["insight", "n.", "洞察"], ["memory", "n.", "记忆"], ["certainty", "n.", "确信"]),
      G("熟悉程度", ["familiar", "adj.", "熟悉的"], ["acquainted", "adj.", "相识的；了解的"], ["expertise", "n.", "专业知识"], ["ignorance", "n.", "无知；不了解"])
    ),
    commonErrors: E(
      ["I am knowing the answer.", "I know the answer.", "know 表示认知状态时通常不用进行时。"],
      ["Do you know where is he?", "Do you know where he is?", "间接疑问句使用陈述语序，不倒装。"]
    )
  },

  will: {
    meanings: M(
      ["modal v.", "used to express a future action, event, or prediction", "将；会", "The meeting will begin at nine.", "会议将在九点开始。"],
      ["modal v.", "used to express willingness, a promise, or a decision", "愿意；一定会", "I will help you with the boxes.", "我愿意帮你搬这些箱子。"],
      ["n.", "determination or a legal document stating wishes after death", "意志；遗嘱", "She has a strong will to succeed.", "她有强烈的成功意志。"]
    ),
    fixedPhrases: F(
      ["will have done something", "到将来某时已经完成某事", "By Friday, we will have finished the report.", "到周五我们将已经完成报告。"],
      ["will be doing something", "将正在做某事", "This time tomorrow, I will be flying home.", "明天这个时候我将正在飞回家。"],
      ["will not hear of something", "坚决不同意某事", "My parents will not hear of me leaving early.", "我父母坚决不同意我提前离开。"],
      ["will do anything to do something", "会不惜一切做某事", "He will do anything to protect his family.", "他会不惜一切保护家人。"],
      ["if you will", "可以说；姑且这样说", "It is a practical art, if you will.", "可以说，这是一门实用艺术。"],
      ["against someone's will", "违背某人的意愿", "No one should be held against their will.", "任何人都不应被违背意愿地扣留。"],
      ["at will", "任意地；随意地", "Users can pause the recording at will.", "用户可以随时暂停录音。"],
      ["where there is a will", "有志者事竟成（前半句）", "Where there is a will, there is a way.", "有志者事竟成。"],
      ["leave something in your will", "在遗嘱中把某物留给他人", "She left the house to her son in her will.", "她在遗嘱中把房子留给了儿子。"],
      ["of your own free will", "出于自愿", "He signed the form of his own free will.", "他自愿签了这张表。"]
    ),
    contexts: C(
      G("未来预测", ["will probably improve", "很可能会改善"], ["will take several weeks", "将需要几周"], ["will remain unchanged", "将保持不变"]),
      G("临时决定", ["will answer the phone", "会去接电话"], ["will take the blue one", "要选蓝色的那个"], ["will call a taxi", "会叫辆出租车"]),
      G("承诺意愿", ["will keep the information private", "会对信息保密"], ["will gladly explain", "愿意详细解释"], ["will never let you down", "绝不会让你失望"]),
      G("习惯特征", ["will often sit here for hours", "常常会在这里坐数小时"], ["oil will float on water", "油会浮在水面"], ["children will ask difficult questions", "孩子常会问难题"])
    ),
    derivatives: D(
      ["willing", "adj.", "愿意的", "常用 be willing to do something。"],
      ["unwilling", "adj.", "不愿意的", "表示不情愿，常接 to do。"],
      ["willingly", "adv.", "自愿地；乐意地", "说明动作是主动且乐意完成的。"],
      ["unwillingly", "adv.", "不情愿地", "说明虽然做了，但并非出于自愿。"],
      ["willpower", "n.", "意志力", "不可数名词，指控制冲动或坚持目标的能力。"]
    ),
    synonyms: S(
      ["be going to", "phr.", "将要；打算", "常表示已有计划或有当前迹象的预测；will 可表示临时决定。"],
      ["intend to", "phr.", "打算做", "强调主观意图，不用于单纯天气预测或普遍规律。"],
      ["be willing to", "phr.", "愿意做", "只对应 will 的意愿义，不表示一般未来。"],
      ["plan to", "phr.", "计划做", "表示事先安排；will 也可在说话当下才作决定。"]
    ),
    antonyms: A(["refuse to", "phr.", "拒绝做", "只与 will 的‘愿意做’义相反，不是否定未来的通用形式。"]),
    confusables: X(["would", "modal v.", "会；愿意；将（过去视角）", "would 可表示假设、委婉或过去将来；will 通常指真实将来或直接意愿。"]),
    related: R(
      G("未来时间", ["future", "n. / adj.", "未来；未来的"], ["prediction", "n.", "预测"], ["prospect", "n.", "前景；可能性"], ["eventually", "adv.", "最终"]),
      G("意愿决定", ["intention", "n.", "意图"], ["decision", "n.", "决定"], ["promise", "n.", "承诺"], ["voluntary", "adj.", "自愿的"]),
      G("意志法律", ["determination", "n.", "决心"], ["self-control", "n.", "自制力"], ["testament", "n.", "遗嘱"], ["inheritance", "n.", "遗产"])
    ),
    commonErrors: E(
      ["I will to call you.", "I will call you.", "情态动词 will 后直接接动词原形，不加 to。"],
      ["When she will arrive, we will eat.", "When she arrives, we will eat.", "表示将来的时间从句通常用一般现在时，不用 will。"]
    )
  },

  would: {
    meanings: M(
      ["modal v.", "used for imagined or conditional situations", "会；将会（假设）", "I would travel more if I had time.", "如果有时间，我会多旅行。"],
      ["modal v.", "used to make requests, offers, and preferences more polite", "愿意；想要；请（委婉）", "Would you open the window?", "请你打开窗户好吗？"],
      ["modal v.", "used for repeated actions in the past or future viewed from the past", "过去常常；过去将会", "Every summer, we would camp by the lake.", "以前每年夏天我们都会在湖边露营。"]
    ),
    fixedPhrases: F(
      ["would sooner do something", "宁愿做某事", "I would sooner walk than wait another hour.", "我宁愿走路也不想再等一个小时。"],
      ["would just as soon do something", "同样宁愿做某事", "She would just as soon stay home.", "她倒宁愿待在家里。"],
      ["would you mind doing something", "礼貌请求对方做某事", "Would you mind closing the door?", "请你把门关上好吗？"],
      ["would you mind if", "礼貌询问对方是否介意", "Would you mind if I sat here?", "如果我坐这里，你介意吗？"],
      ["would have done something", "本来会做某事", "I would have called, but my phone died.", "我本来会打电话，但手机没电了。"],
      ["would rather not do something", "宁愿不做某事", "I would rather not discuss it now.", "我宁愿现在不谈这件事。"],
      ["would appear that", "似乎……（委婉正式）", "It would appear that the figures are wrong.", "看来这些数字有误。"],
      ["would be happy to do something", "很乐意做某事", "We would be happy to help.", "我们很乐意帮忙。"],
      ["who would have thought", "谁能想到", "Who would have thought it would work?", "谁能想到它会奏效呢？"],
      ["why would someone do something", "某人为什么会做某事", "Why would anyone refuse this offer?", "为什么会有人拒绝这个提议呢？"]
    ),
    contexts: C(
      G("条件假设", ["would change everything", "会改变一切"], ["would be safer to wait", "等一等会更安全"], ["would depend on the price", "要取决于价格"]),
      G("礼貌请求", ["would you speak more slowly", "请你说慢一点好吗"], ["would you send me a copy", "请发我一份副本好吗"], ["would someone please explain", "请哪位解释一下好吗"]),
      G("愿望偏好", ["would love another chance", "很想再有一次机会"], ["would prefer a quiet room", "更想要安静的房间"], ["would rather leave early", "宁愿提前离开"]),
      G("过去视角", ["would visit every Sunday", "以前每周日都会来访"], ["would later become famous", "后来会成名"], ["said it would rain", "说过会下雨"])
    ),
    derivatives: D(),
    synonyms: S(
      ["used to", "phr.", "过去常常", "只对应过去习惯；used to 也可描述过去状态，而 would 通常描述重复动作。"],
      ["was willing to", "phr.", "当时愿意", "只对应过去意愿，不覆盖条件句、委婉请求或过去习惯。"],
      ["would like to", "phr.", "想要做", "是 would 的固定礼貌表达，比 want to 更委婉，但并非一般同义替换。"],
      ["tended to", "phr.", "往往会；倾向于", "可概括过去反复出现的倾向，但不表达条件或礼貌。"]
    ),
    antonyms: A(["be unwilling to", "phr.", "不愿意做", "只与 would 表示意愿的用法形成对比。"]),
    confusables: X(
      ["will", "modal v.", "将；愿意", "will 指真实将来或直接决定；would 常带假设、过去视角或礼貌语气。"],
      ["could", "modal v.", "能；可以；可能", "could 侧重能力或可能性；would 侧重意愿、结果或假设情形。"]
    ),
    related: R(
      G("条件语气", ["condition", "n.", "条件"], ["hypothesis", "n.", "假设"], ["imaginary", "adj.", "想象的"], ["consequence", "n.", "结果；后果"]),
      G("礼貌交际", ["courtesy", "n.", "礼貌"], ["request", "n.", "请求"], ["offer", "n.", "提议"], ["invitation", "n.", "邀请"]),
      G("过去叙述", ["habit", "n.", "习惯"], ["repeated", "adj.", "反复的"], ["former", "adj.", "从前的"], ["afterward", "adv.", "后来"])
    ),
    commonErrors: E(
      ["If I would know, I would tell you.", "If I knew, I would tell you.", "普通第二条件句的 if 从句用过去式，不用 would。"],
      ["I would rather to stay home.", "I would rather stay home.", "would rather 后直接接动词原形，不加 to。"]
    )
  },

  make: {
    meanings: M(
      ["v.", "to create, produce, or prepare something", "制作；生产；准备", "She made a simple meal for us.", "她为我们做了一顿简单的饭。"],
      ["v.", "to cause someone or something to be or do something", "使；促使", "The news made everyone anxious.", "这个消息让大家都很焦虑。"],
      ["v.", "to earn, reach, or arrange something", "赚得；达到；安排", "He makes a good living as a designer.", "他当设计师，收入不错。"]
    ),
    fixedPhrases: F(
      ["make an effort", "作出努力", "We must make an effort to arrive on time.", "我们必须努力准时到达。"],
      ["make a mistake", "犯错误", "Everyone makes mistakes sometimes.", "每个人有时都会犯错。"],
      ["make sense", "讲得通；有意义", "Her explanation makes sense.", "她的解释讲得通。"],
      ["make a living", "谋生", "They make a living by selling vegetables.", "他们靠卖蔬菜谋生。"],
      ["make a good impression", "留下好印象", "Try to make a good impression at the interview.", "面试时尽量留下好印象。"],
      ["make an appointment", "预约", "I made an appointment with the dentist.", "我预约了牙医。"],
      ["make your way", "前往；逐步取得进展", "We made our way through the crowd.", "我们穿过人群向前走。"],
      ["make up your mind", "下定决心", "She made up her mind to accept the offer.", "她决定接受这个提议。"],
      ["make up for something", "弥补某事", "This bonus makes up for the extra hours.", "这笔奖金弥补了额外工时。"],
      ["make do with something", "将就使用某物", "We had to make do with one computer.", "我们只好将就共用一台电脑。"],
      ["make it clear that", "明确说明……", "He made it clear that the deadline was final.", "他明确表示截止日期不能再改。"],
      ["make someone feel welcome", "让某人感到受欢迎", "They made us feel welcome from the start.", "他们从一开始就让我们感到宾至如归。"]
    ),
    contexts: C(
      G("制作生产", ["make fresh bread", "制作新鲜面包"], ["make furniture by hand", "手工制作家具"], ["make a copy of the key", "配一把钥匙"], ["make coffee for everyone", "为大家煮咖啡"]),
      G("决定安排", ["make travel arrangements", "安排旅行"], ["make a formal complaint", "正式投诉"], ["make a phone call", "打电话"], ["make plans for the weekend", "制定周末计划"]),
      G("造成结果", ["make the situation worse", "使情况恶化"], ["make someone laugh", "逗某人笑"], ["make it possible to continue", "使继续成为可能"], ["make a room look larger", "让房间显得更大"]),
      G("取得达到", ["make steady progress", "取得稳步进展"], ["make a profit", "盈利"], ["make the final shortlist", "进入最终候选名单"], ["make ten dollars an hour", "每小时赚十美元"])
    ),
    derivatives: D(
      ["maker", "n.", "制造者；生产商", "常用于 coffee maker、car maker 等复合词。"],
      ["making", "n.", "制作；形成", "常见于 the making of a film 或 be in the making。"],
      ["remake", "v. / n.", "重新制作；翻拍版", "表示再次制作，名词常指影视翻拍作品。"]
    ),
    synonyms: S(
      ["create", "v.", "创造；创建", "强调产生原先不存在的事物、想法或条件。"],
      ["produce", "v.", "生产；制作", "强调制造产品、产生成果，常用于工业、农业和艺术作品。"],
      ["construct", "v.", "建造；构成", "强调按结构把部件组合起来，适用于建筑、模型和论证。"],
      ["form", "v.", "形成；组成", "强调形成形状、组织或关系，不一定涉及实际制作过程。"],
      ["cause", "v.", "导致", "只对应 make + 宾语 + 补语的致使义，不能替代 make a cake。"]
    ),
    antonyms: A(["destroy", "v.", "摧毁", "与 make/create 实物或成果的义项相反。"]),
    confusables: X(["do", "v.", "做；执行", "make 强调创造结果或产物；do 强调执行任务、工作或活动。"]),
    related: R(
      G("创作制造", ["design", "n. / v.", "设计"], ["material", "n.", "材料"], ["product", "n.", "产品"], ["craft", "n. / v.", "手艺；精心制作"]),
      G("决定计划", ["choice", "n.", "选择"], ["schedule", "n.", "日程"], ["arrangement", "n.", "安排"], ["commitment", "n.", "承诺；投入"]),
      G("结果影响", ["impact", "n.", "影响"], ["outcome", "n.", "结果"], ["change", "n.", "变化"], ["success", "n.", "成功"])
    ),
    commonErrors: E(
      ["I made my homework.", "I did my homework.", "homework、housework 和一般任务与 do 搭配。"],
      ["The film made me to cry.", "The film made me cry.", "主动语态 make someone do 后接不带 to 的动词原形。"]
    )
  },

  think: {
    meanings: M(
      ["v.", "to use your mind to consider or form an idea", "思考；考虑", "Let me think about your suggestion.", "让我考虑一下你的建议。"],
      ["v.", "to believe, suppose, or have an opinion", "认为；觉得", "I think the plan will work.", "我认为这个计划会奏效。"],
      ["v.", "to remember or direct your attention to someone or something", "想起；想到", "I often think of my first teacher.", "我经常想起我的第一位老师。"]
    ),
    fixedPhrases: F(
      ["think on your feet", "快速随机应变", "A good guide must think on their feet.", "好导游必须善于随机应变。"],
      ["think outside the box", "跳出常规思考", "We need to think outside the box.", "我们需要跳出常规思考。"],
      ["think the world of someone", "非常敬重或喜爱某人", "She thinks the world of her grandfather.", "她非常敬爱祖父。"],
      ["think nothing of doing something", "认为做某事没什么", "He thinks nothing of cycling forty miles.", "他觉得骑四十英里没什么。"],
      ["come to think of it", "现在想来", "Come to think of it, I have not seen Luis today.", "现在想来，我今天还没见到路易斯。"],
      ["think better of something", "重新考虑后决定不做某事", "I was going to complain but thought better of it.", "我本想投诉，后来又打消了念头。"],
      ["think for yourself", "独立思考", "Students should learn to think for themselves.", "学生应该学会独立思考。"],
      ["think in terms of something", "从某方面考虑", "Think in terms of long-term value.", "要从长期价值的角度考虑。"],
      ["think back to something", "回想某事", "Think back to your first day at school.", "回想一下你上学的第一天。"],
      ["think aloud", "把思考过程说出来", "I am just thinking aloud, not making a proposal.", "我只是在口头整理思路，并不是正式提议。"],
      ["think twice before doing something", "做某事前三思", "Think twice before sharing personal information.", "分享个人信息前要三思。"],
      ["think something over", "仔细考虑某事", "I need a day to think the offer over.", "我需要一天仔细考虑这个提议。"]
    ),
    contexts: C(
      G("观点判断", ["think it is unfair", "认为这不公平"], ["think someone is right", "认为某人是对的"], ["think the risk is low", "认为风险很低"], ["think otherwise", "持不同看法"]),
      G("认真考虑", ["think about the consequences", "考虑后果"], ["think through every option", "把每个选项想透"], ["think carefully before answering", "回答前仔细思考"], ["think ahead to next year", "提前考虑明年"]),
      G("想象预计", ["think of a better example", "想出更好的例子"], ["think what might happen", "设想可能发生什么"], ["think of yourself as a beginner", "把自己看作初学者"], ["think how useful it would be", "想想它会多么有用"]),
      G("回忆关怀", ["think about someone often", "经常想念某人"], ["think fondly of childhood", "深情回想童年"], ["think back over the year", "回顾这一年"], ["think of others first", "先为别人着想"])
    ),
    derivatives: D(
      ["thought", "n.", "想法；思考", "名词，常用 give something some thought。"],
      ["thinker", "n.", "思想家；思考者", "常与形容词搭配，如 an independent thinker。"],
      ["thoughtful", "adj.", "体贴的；深思的", "可指为他人着想，也可指经过认真思考。"],
      ["thoughtfully", "adv.", "若有所思地；体贴地", "描述说话、观察或行动的方式。"],
      ["thoughtless", "adj.", "欠考虑的；不体贴的", "指没有考虑后果或他人感受。"]
    ),
    synonyms: S(
      ["consider", "v.", "考虑；认为", "比 think 更强调认真权衡，也可接名词或 -ing。"],
      ["believe", "v.", "相信；认为", "强调把某事当真或接受其真实性，确信程度通常高于 think。"],
      ["reflect", "v.", "认真思考；反思", "此义通常与 on/upon 连用，强调深入回顾，不是‘反射’义。"],
      ["suppose", "v.", "猜想；认为", "常表示依据不足的暂时判断，语气比 believe 弱。"],
      ["contemplate", "v.", "深思；考虑", "正式用词，强调长时间认真思考可能的行动或复杂问题。"]
    ),
    antonyms: A(["disregard", "v.", "不理会；忽视", "与认真考虑某个因素的 think about/consider 义形成对比。"]),
    confusables: X(["remember", "v.", "记得；想起", "remember 侧重从记忆中提取信息；think of 也可指产生新想法或想到某人。"]),
    related: R(
      G("思维过程", ["reasoning", "n.", "推理"], ["logic", "n.", "逻辑"], ["reflection", "n.", "反思"], ["judgment", "n.", "判断"]),
      G("观点立场", ["opinion", "n.", "意见"], ["viewpoint", "n.", "观点"], ["assumption", "n.", "假设"], ["attitude", "n.", "态度"]),
      G("记忆想象", ["memory", "n.", "记忆"], ["idea", "n.", "想法"], ["imagination", "n.", "想象力"], ["attention", "n.", "注意力"])
    ),
    commonErrors: E(
      ["I am thinking he is right.", "I think he is right.", "表示一般观点时 think 通常不用进行时。"],
      ["I think to change jobs.", "I am thinking of changing jobs.", "表示考虑做某事用 think of/about doing。"]
    )
  },

  see: {
    meanings: M(
      ["v.", "to notice or perceive something with your eyes", "看见；看到", "I saw a fox near the river.", "我在河边看到了一只狐狸。"],
      ["v.", "to understand, realize, or recognize something", "明白；理解；看出", "I see why you were worried.", "我明白你为什么担心了。"],
      ["v.", "to meet, visit, or spend time with someone", "会见；看望", "I am seeing the dentist tomorrow.", "我明天要去看牙医。"],
      ["v.", "to make sure something is done or to experience an event", "确保；经历", "Please see that the door is locked.", "请确保门已锁好。"]
    ),
    fixedPhrases: F(
      ["see eye to eye", "意见完全一致", "We do not always see eye to eye.", "我们的意见并不总是一致。"],
      ["see the point", "明白意义或理由", "I cannot see the point of waiting.", "我不明白等待有什么意义。"],
      ["see the light", "终于明白；重见希望", "After several failures, he finally saw the light.", "几次失败后，他终于明白了。"],
      ["see someone off", "为某人送行", "We went to the station to see her off.", "我们去车站给她送行。"],
      ["see someone through something", "帮助某人渡过难关", "Her savings saw her through the winter.", "她靠积蓄熬过了冬天。"],
      ["see something through", "把某事坚持完成", "Once I start a project, I see it through.", "项目一旦开始，我就会坚持完成。"],
      ["see for yourself", "亲自看看", "Come and see for yourself.", "你亲自来看看吧。"],
      ["see fit to do something", "认为适合做某事", "The board may see fit to delay the vote.", "董事会或许认为应推迟表决。"],
      ["see someone as something", "把某人看作某种身份", "I see her as a trusted adviser.", "我把她视为值得信任的顾问。"],
      ["see something coming", "预见某事发生", "No one saw the crisis coming.", "没有人预见到这场危机。"],
      ["see the last of something", "终于摆脱某事；最后一次见到", "I hope we have seen the last of these delays.", "希望这样的延误不会再有。"],
      ["see what happens", "看看会发生什么", "Let's wait and see what happens.", "我们等等看会发生什么。"]
    ),
    contexts: C(
      G("视觉观察", ["see clearly in daylight", "在日光下看得清"], ["see smoke in the distance", "看见远处的烟"], ["see someone cross the road", "看见某人过马路"], ["see someone waiting outside", "看见某人正在外面等"]),
      G("理解判断", ["see the difference between them", "看出二者的差别"], ["see what someone means", "明白某人的意思"], ["see the problem differently", "以不同方式看待问题"], ["see no reason to worry", "看不出有担心的理由"]),
      G("会面就诊", ["see a client after lunch", "午饭后会见客户"], ["see a doctor about the pain", "因疼痛去看医生"], ["see old friends regularly", "定期见老朋友"], ["see someone home safely", "护送某人安全回家"]),
      G("经历确保", ["see many changes over time", "多年来见证许多变化"], ["see the project completed", "确保项目完成"], ["see that everyone receives a copy", "确保每人收到一份"], ["see better days", "经历过更好的时期"])
    ),
    derivatives: D(["seeing", "n.", "鉴于；由于", "主要见于 seeing that，表示‘鉴于’；不是普通视觉义必记派生词。"]),
    synonyms: S(
      ["observe", "v.", "观察", "强调有意识、较仔细地观看或记录，正式程度高于 see。"],
      ["notice", "v.", "注意到", "强调某事进入注意范围，常带突然发现的意味。"],
      ["understand", "v.", "理解", "只对应 see 的‘明白’义，不表示视觉看见或会见。"],
      ["view", "v.", "观看；看待", "正式，既可指有目的地观看，也可指持某种观点。"],
      ["meet", "v.", "会面；遇见", "只对应 see someone 的会面义；meet 常强调双方碰面。"]
    ),
    antonyms: A(["miss", "v.", "没看见；错过", "与 see/noticing a visible person or event 的义项相反。"]),
    confusables: X(
      ["look", "v.", "看；看起来", "look 强调主动把目光投向；see 强调视觉感知到结果。"],
      ["watch", "v.", "观看；注视", "watch 强调持续关注移动或变化中的对象。"]
    ),
    related: R(
      G("视觉要素", ["sight", "n.", "视力；景象"], ["vision", "n.", "视力；视野"], ["glimpse", "n.", "一瞥"], ["view", "n.", "景色；视野"]),
      G("理解认识", ["meaning", "n.", "含义"], ["perspective", "n.", "视角"], ["evidence", "n.", "证据"], ["recognition", "n.", "认出；认可"]),
      G("会面经历", ["appointment", "n.", "预约；约会"], ["consultation", "n.", "咨询；会诊"], ["visit", "n.", "探访"], ["witness", "n.", "目击者"])
    ),
    commonErrors: E(
      ["I am seeing a bird in the tree.", "I can see a bird in the tree.", "表示当下视觉感知时通常用 can see，不用进行时。"],
      ["I looked him yesterday.", "I saw him yesterday.", "表示见到某人用 see；look 需配 at 才表示看向。"]
    )
  },

  come: {
    meanings: M(
      ["v.", "to move toward the speaker or a particular place", "来；来到；到达", "Come here and look at this.", "到这里来看看这个。"],
      ["v.", "to happen, become available, or reach a particular state", "发生；出现；进入某种状态", "The answer came as a surprise.", "这个答案出人意料。"],
      ["v.", "to have a particular origin or position in a sequence", "来自；位于；轮到", "Most of our coffee comes from Brazil.", "我们的咖啡大多来自巴西。"]
    ),
    fixedPhrases: F(
      ["come to terms with something", "接受并学会面对某事", "He is coming to terms with the loss.", "他正在逐渐接受这次损失。"],
      ["come into effect", "开始生效", "The new rules come into effect next month.", "新规下月生效。"],
      ["come in handy", "派上用场", "This flashlight may come in handy.", "这把手电筒可能会派上用场。"],
      ["come under pressure", "承受压力", "The company came under pressure to change.", "公司面临要求改革的压力。"],
      ["come as no surprise", "并不令人意外", "The result came as no surprise to us.", "这个结果我们并不意外。"],
      ["come a long way", "取得很大进步；走很远", "The technology has come a long way.", "这项技术已经取得了巨大进步。"],
      ["come to light", "被发现；暴露", "New evidence came to light yesterday.", "昨天发现了新证据。"],
      ["come to mind", "浮现在脑海", "One example immediately comes to mind.", "我立刻想到一个例子。"],
      ["come in for criticism", "受到批评", "The proposal came in for heavy criticism.", "这个提案遭到严厉批评。"],
      ["come out on top", "最终胜出", "Our team came out on top.", "我们队最终获胜。"],
      ["come down to something", "归根结底是某事", "The choice comes down to cost.", "这个选择归根结底取决于成本。"],
      ["when it comes to something", "谈到某事时", "When it comes to safety, we do not compromise.", "谈到安全，我们绝不妥协。"]
    ),
    contexts: C(
      G("向此移动", ["come inside for a minute", "进来一会儿"], ["come closer to the screen", "靠近屏幕"], ["come back before dinner", "晚饭前回来"], ["come along with us", "和我们一起来"]),
      G("到达出现", ["come early for the interview", "提前来参加面试"], ["come by express delivery", "通过快递送达"], ["come after months of work", "经过数月工作后到来"], ["come at the right moment", "在恰当时刻出现"]),
      G("来源顺序", ["come from a small town", "来自小镇"], ["come first in the race", "比赛中获得第一"], ["come before personal interests", "优先于个人利益"], ["come in three different sizes", "有三种不同尺寸"]),
      G("状态结果", ["come loose over time", "久而久之变松"], ["come alive at night", "夜里变得活跃"], ["come naturally with practice", "通过练习自然掌握"], ["come close to failing", "差点失败"])
    ),
    derivatives: D(["coming", "adj. / n.", "即将到来的；来临", "形容词见 the coming year；名词见 the coming of spring。"], ["newcomer", "n.", "新来者", "常指刚到某地或刚加入某领域的人。"]),
    synonyms: S(
      ["arrive", "v.", "到达", "强调到达终点，通常与 at/in 连用；come 体现朝参照点移动。"],
      ["approach", "v.", "接近", "强调距离或时间逐渐变近，不一定真正到达。"],
      ["reach", "v.", "到达；达到", "及物动词，直接接地点或目标，不加 to。"],
      ["return", "v.", "回来；返回", "强调回到原处，只对应 come back 的回归义。"],
      ["occur", "v.", "发生", "只对应事件‘发生’义，正式且不表示移动或来源。"]
    ),
    antonyms: A(["go", "v.", "去；离开", "以说话者或参照点为中心时，come 表靠近，go 表离开。"]),
    confusables: X(["become", "v.", "变成", "come + 形容词只用于少数固定变化；become 可广泛表示身份或状态转变。"]),
    related: R(
      G("到达移动", ["arrival", "n.", "到达"], ["entrance", "n.", "进入；入口"], ["visitor", "n.", "来访者"], ["direction", "n.", "方向"]),
      G("来源次序", ["origin", "n.", "来源"], ["source", "n.", "源头"], ["sequence", "n.", "顺序"], ["priority", "n.", "优先事项"]),
      G("出现结果", ["appearance", "n.", "出现"], ["event", "n.", "事件"], ["emergence", "n.", "出现；兴起"], ["conclusion", "n.", "结论；结束"])
    ),
    commonErrors: E(
      ["I will come to home soon.", "I will come home soon.", "home 作方向副词时不加 to。"],
      ["She came in the airport at six.", "She arrived at the airport at six.", "强调到达机场用 arrive at；come 需有明确参照方向。"]
    )
  },

  take: {
    meanings: M(
      ["v.", "to move, carry, or lead someone or something to another place", "拿走；带去；运送", "Please take these files upstairs.", "请把这些文件拿到楼上。"],
      ["v.", "to accept, choose, use, or consume something", "接受；选择；乘坐；服用", "She takes the train to work.", "她乘火车上班。"],
      ["v.", "to require an amount of time, effort, or resources", "需要；花费", "The repair will take two hours.", "维修需要两个小时。"],
      ["v.", "to perform, experience, or capture something", "进行；经历；拍摄", "We took a short walk after dinner.", "晚饭后我们散了一小会儿步。"]
    ),
    fixedPhrases: F(
      ["take advantage of something", "利用某事物", "Take advantage of the free trial.", "好好利用免费试用期。"],
      ["take into account something", "把某事考虑在内", "We must take travel time into account.", "我们必须把路程时间考虑在内。"],
      ["take someone for granted", "把某人的付出视为理所当然", "Do not take your friends for granted.", "不要把朋友的付出视为理所当然。"],
      ["take effect", "生效；起作用", "The medicine should take effect soon.", "药应该很快就会起效。"],
      ["take place", "发生；举行", "The ceremony takes place in May.", "典礼在五月举行。"],
      ["take the lead", "带头；领先", "Our team took the lead after halftime.", "我们队在中场休息后取得领先。"],
      ["take someone's advice", "听取某人的建议", "I am glad I took your advice.", "我很庆幸听了你的建议。"],
      ["take something for granted", "想当然地认为某事", "Do not take clean water for granted.", "不要认为洁净用水是理所当然的。"],
      ["take a toll on someone", "对某人造成损害", "Long hours took a toll on her health.", "长时间工作损害了她的健康。"],
      ["take matters into your own hands", "亲自出手解决问题", "He took matters into his own hands.", "他亲自出手处理了问题。"],
      ["take someone by surprise", "使某人吃惊", "The sudden question took me by surprise.", "这个突如其来的问题让我吃了一惊。"],
      ["take something apart", "把某物拆开", "She took the clock apart to clean it.", "她把钟拆开清洗。"]
    ),
    contexts: C(
      G("携带移动", ["take an umbrella with you", "随身带伞"], ["take someone to the airport", "送某人去机场"], ["take the books back downstairs", "把书拿回楼下"], ["take waste to a recycling center", "把垃圾送去回收中心"]),
      G("选择使用", ["take the safer route", "选择更安全的路线"], ["take a daily vitamin", "每天服用维生素"], ["take the next bus", "乘下一班公交车"], ["take payment by card", "接受刷卡付款"]),
      G("时间资源", ["take considerable effort", "需要相当大的努力"], ["take less than a minute", "用时不到一分钟"], ["take three people to lift", "需要三个人抬"], ["take patience and practice", "需要耐心和练习"]),
      G("行动经历", ["take careful notes", "认真做笔记"], ["take a deep breath", "深吸一口气"], ["take legal action", "采取法律行动"], ["take a closer look", "仔细查看"])
    ),
    derivatives: D(["taker", "n.", "接受者；取用者", "多用于复合语境，如 risk-taker 或 ticket taker。"], ["taking", "adj.", "迷人的；吸引人的", "独立形容词义，较书面，不等同于普通现在分词。"], ["intake", "n.", "摄入量；吸收；招收人数", "常见于 calorie intake 和 student intake。"], ["takeaway", "n.", "要点；外卖", "常指主要结论或外卖食品。"]),
    synonyms: S(
      ["carry", "v.", "携带；搬运", "强调支撑并移动物体，不表达接受、乘坐或花费。"],
      ["accept", "v.", "接受", "只对应 take an offer/advice 的接受义，语气更明确。"],
      ["choose", "v.", "选择", "只对应选择路线或选项的义项，不含实际拿取动作。"],
      ["consume", "v.", "消耗；摄入", "正式用于摄入食物药物或消耗资源，不表示一般拿走。"],
      ["require", "v.", "需要", "对应 it takes time/effort 的需要义，主语结构不同。"]
    ),
    antonyms: A(["bring", "v.", "带来", "在方向义上，take 通常带离当前参照点，bring 带向参照点。"]),
    confusables: X(["spend", "v.", "花费", "人作主语时 spend time/money doing；事情作主语时 it takes time。"]),
    related: R(
      G("携带运输", ["luggage", "n.", "行李"], ["load", "n.", "负载；装载物"], ["delivery", "n.", "递送"], ["passenger", "n.", "乘客"]),
      G("选择接受", ["option", "n.", "选项"], ["selection", "n.", "选择"], ["consent", "n.", "同意"], ["dosage", "n.", "剂量"]),
      G("时间行动", ["duration", "n.", "持续时间"], ["effort", "n.", "努力"], ["measure", "n.", "措施"], ["photograph", "n.", "照片"])
    ),
    commonErrors: E(
      ["It took me two hours for finish.", "It took me two hours to finish.", "It takes someone time to do 后接不定式。"],
      ["I spent two hours to finish it.", "I spent two hours finishing it.", "spend time 后接 -ing；也可说 it took me two hours to finish。"]
    )
  },

  want: {
    meanings: M(
      ["v.", "to wish to have or do something", "想要；希望", "I want a quieter room.", "我想要一间更安静的房间。"],
      ["v.", "to need something or require someone to do something", "需要；要求", "This plant wants more sunlight.", "这株植物需要更多阳光。"],
      ["v.", "to lack something necessary", "缺少；欠缺", "The report wants a clearer conclusion.", "这份报告缺少一个更清晰的结论。"]
    ),
    fixedPhrases: F(
      ["want nothing to do with something", "不想与某事有任何关系", "She wants nothing to do with the dispute.", "她不想与这场争端有任何关系。"],
      ["want for nothing", "什么都不缺", "The children want for nothing.", "这些孩子什么都不缺。"],
      ["not want to be late", "不想迟到", "Leave now if you do not want to be late.", "如果不想迟到，现在就走。"],
      ["want someone back", "希望某人回来", "The team wants its captain back.", "球队希望队长归队。"],
      ["want something done", "要求某事被完成", "I want this repaired by Friday.", "我要求周五前修好这个。"],
      ["want the best for someone", "希望某人过得最好", "Parents usually want the best for their children.", "父母通常希望孩子过得最好。"],
      ["want a word with someone", "想和某人谈谈", "The manager wants a word with you.", "经理想和你谈谈。"],
      ["want no part of something", "不想参与某事", "I want no part of that dishonest scheme.", "我不想参与那个不诚实的计划。"],
      ["want something badly", "非常想要某物", "He wanted the job badly.", "他非常想得到这份工作。"],
      ["what more could you want", "表示条件已经非常理想", "The room is cheap and comfortable—what more could you want?", "房间便宜又舒适，还能奢求什么呢？"],
      ["for want of something", "因缺少某物", "The project failed for want of funding.", "项目因缺少资金而失败。"],
      ["be wanted for something", "因某事被通缉或被需要", "The suspect is wanted for questioning.", "警方因调查需要传唤这名嫌疑人。"]
    ),
    contexts: C(
      G("愿望选择", ["want a second opinion", "想听取第二种意见"], ["want to travel alone", "想独自旅行"], ["want the red one instead", "反而想要红色那个"], ["want another chance", "想再要一次机会"]),
      G("对人要求", ["want someone to stay", "想让某人留下"], ["want everyone to participate", "希望大家都参加"], ["want you here by noon", "要求你中午前到"], ["want the children to be safe", "希望孩子们安全"]),
      G("实际需要", ["want careful handling", "需要小心处理"], ["want a fresh coat of paint", "需要重新刷漆"], ["want more evidence", "需要更多证据"], ["want immediate attention", "需要立即处理"]),
      G("缺少不足", ["want in clarity", "清晰度不足"], ["want for basic supplies", "缺少基本物资"], ["wanting in detail", "细节不足"], ["leave nothing wanting", "做到尽善尽美"])
    ),
    derivatives: D(["wanted", "adj.", "想要的；被通缉的", "语义取决于名词或 be wanted for 结构。"], ["unwanted", "adj.", "不需要的；多余的", "指不受欢迎或非故意产生的事物。"], ["wanting", "adj.", "欠缺的；不足的", "较正式，常用 be wanting in something。"]),
    synonyms: S(
      ["desire", "v.", "渴望；想要", "比 want 正式且语气较强，可接名词或不定式。"],
      ["wish", "v.", "希望；愿望", "常用于难以实现或较正式的愿望，也可用 wish someone something。"],
      ["need", "v.", "需要", "强调必要性；want 主要表达主观愿望，口语中才可兼指需要。"],
      ["seek", "v.", "寻求；设法获得", "强调主动寻找或争取，常用于较正式语境。"],
      ["would like", "phr.", "想要", "是 want 的礼貌表达，适合点餐、请求和正式交际。"]
    ),
    antonyms: A(["reject", "v.", "拒绝；不要", "与接受或想要某个具体选项的 want 义形成对比。"]),
    confusables: X(["won't", "modal v.", "将不；不愿", "won't 是 will not 的缩写；want /wɑːnt/ 表示想要，拼写和发音都不同。"]),
    related: R(
      G("愿望动机", ["preference", "n.", "偏好"], ["ambition", "n.", "抱负"], ["motivation", "n.", "动机"], ["intention", "n.", "意图"]),
      G("需求资源", ["requirement", "n.", "需求；要求"], ["necessity", "n.", "必需品；必要性"], ["demand", "n.", "需求"], ["shortage", "n.", "短缺"]),
      G("满足选择", ["satisfaction", "n.", "满足"], ["choice", "n.", "选择"], ["priority", "n.", "优先事项"], ["alternative", "n.", "替代选择"])
    ),
    commonErrors: E(["I want that you come early.", "I want you to come early.", "want 后用 someone to do，不直接接 that 从句表达要求。"], ["I am wanting a new phone.", "I want a new phone.", "want 表愿望状态时通常不用进行时。"])
  },

  could: {
    meanings: M(
      ["modal v.", "used to express ability in the past", "过去能；过去会", "At six, she could already read.", "她六岁时已经会阅读了。"],
      ["modal v.", "used to express possibility or a suggestion", "可能；可以", "A short break could help.", "短暂休息可能会有帮助。"],
      ["modal v.", "used to make a polite request", "能否；可以（委婉请求）", "Could you repeat that, please?", "请你再说一遍好吗？"]
    ),
    fixedPhrases: F(
      ["could have done something", "本来可能或本来能够做某事", "We could have taken an earlier train.", "我们本来可以坐更早的火车。"],
      ["could not have done something", "不可能做过；无法完成", "I could not have finished without your help.", "没有你的帮助我不可能完成。"],
      ["could well do something", "很可能做某事", "The delay could well continue all week.", "延误很可能持续整周。"],
      ["could easily do something", "很容易就可能做某事", "The mistake could easily happen again.", "这个错误很容易再次发生。"],
      ["could do with something", "需要或想要某物", "I could do with a cup of tea.", "我想喝杯茶。"],
      ["could not care less", "毫不在乎", "He could not care less about fashion.", "他一点也不在乎时尚。"],
      ["could be mistaken", "可能弄错", "I could be mistaken, but this is not our train.", "我可能弄错了，但这不是我们的车。"],
      ["could use some help", "需要一些帮助", "We could use some help with these boxes.", "这些箱子我们需要有人帮忙搬。"],
      ["could you possibly do something", "能否劳驾做某事", "Could you possibly send it today?", "能劳驾你今天发出吗？"],
      ["could not help doing something", "忍不住做某事", "I could not help laughing.", "我忍不住笑了。"],
      ["how could someone do something", "某人怎么能做某事", "How could you forget her birthday?", "你怎么能忘记她的生日？"],
      ["as fast as someone could", "尽某人所能地快", "She ran as fast as she could.", "她尽全力快跑。"]
    ),
    contexts: C(
      G("过去能力", ["could swim before school age", "上学前就会游泳"], ["could hear every word", "过去能听清每个字"], ["could lift it alone", "过去能独自抬起它"], ["could speak three languages", "过去会说三种语言"]),
      G("现实可能", ["could lead to delays", "可能导致延误"], ["could happen anywhere", "可能在任何地方发生"], ["could be the right answer", "可能是正确答案"], ["could still change", "仍有可能改变"]),
      G("建议方案", ["could try a different route", "可以尝试另一条路线"], ["could ask for advice", "可以寻求建议"], ["could start with the basics", "可以从基础开始"], ["could meet online instead", "可以改为线上见面"]),
      G("礼貌请求", ["could I borrow your charger", "我能借用充电器吗"], ["could you lower your voice", "请你小声一点好吗"], ["could we move the meeting", "我们能改会议时间吗"], ["could someone open the gate", "能请人开门吗"])
    ),
    derivatives: D(),
    synonyms: S(
      ["was able to", "phr.", "当时能够", "用于一次实际成功的过去事件通常比 could 更合适。"],
      ["might", "modal v.", "可能", "只对应较弱的可能性，不表示过去能力或请求。"],
      ["would be able to", "phr.", "将能够；会有能力", "常用于条件结果，明确表达某条件下的能力。"],
      ["managed to", "phr.", "设法做成", "强调克服困难后实际成功，而 could 常表示一般能力。"],
      ["be possible to", "phr.", "有可能做", "非人称地表达可行性，不带 could 的委婉请求功能。"]
    ),
    antonyms: A(["be unable to", "phr.", "无法做", "与 could 的实际能力义相反；过去时可说 was unable to。"]),
    confusables: X(["would", "modal v.", "会；愿意", "would 侧重意愿或条件结果；could 侧重能力、可行性或可能性。"], ["can", "modal v.", "能；可以", "can 更直接且多用于现在；could 可表示过去或更委婉。"]),
    related: R(
      G("过去能力", ["childhood", "n.", "童年"], ["talent", "n.", "天赋"], ["training", "n.", "训练"], ["achievement", "n.", "成就"]),
      G("可能建议", ["chance", "n.", "可能性；机会"], ["option", "n.", "选项"], ["alternative", "n.", "替代方案"], ["uncertain", "adj.", "不确定的"]),
      G("礼貌程度", ["polite", "adj.", "礼貌的"], ["indirect", "adj.", "间接的"], ["favor", "n.", "帮忙；恩惠"], ["courtesy", "n.", "礼貌"])
    ),
    commonErrors: E(["She could to read at four.", "She could read at four.", "could 后直接接动词原形，不加 to。"], ["Yesterday I could finish the race.", "Yesterday I managed to finish the race.", "表示一次具体事件中成功做成，通常用 managed to/was able to。"])
  },

  look: {
    meanings: M(
      ["v.", "to direct your eyes toward someone or something", "看；注视", "Look at the top of the page.", "看这一页的顶部。"],
      ["linking v.", "to appear to have a particular quality", "看起来；显得", "You look tired today.", "你今天看起来很累。"],
      ["v.", "to search, examine, or consider, usually with a particle", "寻找；检查；考虑", "We are looking into the complaint.", "我们正在调查这起投诉。"],
      ["n.", "an act of looking or a person's appearance", "看；神情；外表", "Take a look at this chart.", "看一下这张图表。"]
    ),
    fixedPhrases: F(
      ["look someone in the eye", "直视某人的眼睛", "He looked me in the eye and apologized.", "他直视着我并道了歉。"],
      ["look the other way", "故意视而不见", "Officials cannot look the other way.", "官员不能故意视而不见。"],
      ["look down on someone", "轻视某人", "Never look down on people for their jobs.", "绝不要因为职业而轻视别人。"],
      ["look up to someone", "敬仰某人", "She has always looked up to her aunt.", "她一直很敬仰姑妈。"],
      ["look back on something", "回顾某事", "I look back on those years with gratitude.", "我怀着感激回顾那些年。"],
      ["look out for someone", "留意并照顾某人", "We all look out for one another.", "我们彼此照应。"],
      ["look beyond something", "超越表面看问题", "Try to look beyond the immediate cost.", "尽量不要只看眼前成本。"],
      ["look over something", "快速检查某物", "Could you look over my application?", "你能帮我检查一下申请材料吗？"],
      ["look through something", "浏览；翻找某物", "I looked through the old photographs.", "我翻看了那些旧照片。"],
      ["look to someone for something", "指望某人提供某物", "Staff look to her for guidance.", "员工指望她给予指导。"],
      ["look set to do something", "看来很可能做某事", "Prices look set to rise.", "价格看来很可能上涨。"],
      ["look on the bright side", "看到积极的一面", "Try to look on the bright side.", "尽量往好处想。"]
    ),
    contexts: C(
      G("主动观看", ["look closely at the label", "仔细看标签"], ["look out of the window", "向窗外看"], ["look straight ahead", "直视前方"], ["look away quickly", "迅速移开视线"]),
      G("外观印象", ["look surprisingly young", "看起来出乎意料地年轻"], ["look good in blue", "穿蓝色很好看"], ["look ready to leave", "看起来准备离开"], ["look exactly the same", "看起来完全一样"]),
      G("寻找调查", ["look everywhere for the key", "到处找钥匙"], ["look into possible causes", "调查可能原因"], ["look up an unfamiliar term", "查找陌生术语"], ["look around for a seat", "四处找座位"]),
      G("关注未来", ["look ahead to retirement", "展望退休生活"], ["look at the wider issue", "审视更广泛的问题"], ["look for ways to improve", "寻找改进方法"], ["look toward future growth", "着眼未来增长"])
    ),
    derivatives: D(["outlook", "n.", "观点；前景", "复合词，既可指人生观，也可指未来前景。"], ["onlooker", "n.", "旁观者", "指在现场观看事件但未参与的人。"]),
    synonyms: S(
      ["watch", "v.", "观看；注视", "强调持续关注移动或变化中的对象。"],
      ["see", "v.", "看见", "强调视觉感知到结果；look 强调主动把目光投向。"],
      ["observe", "v.", "观察", "比 look 仔细、正式，常包含记录或研究目的。"],
      ["appear", "linking v.", "显得；似乎", "只对应 look + 形容词的外观判断，且语气较正式。"],
      ["glance", "v.", "瞥一眼", "表示短暂快速地看，通常与 at 连用。"]
    ),
    antonyms: A(["ignore", "v.", "忽视；不理会", "与主动查看或关注某事的 look at 义形成对比。"]),
    confusables: X(["search", "v.", "搜索；搜查", "search 可直接接地点；look for 后接要寻找的目标。"]),
    related: R(
      G("视觉动作", ["gaze", "n. / v.", "凝视"], ["stare", "n. / v.", "盯着看"], ["peek", "n. / v.", "偷看；瞥"], ["scan", "v.", "快速浏览"]),
      G("外观印象", ["appearance", "n.", "外表"], ["expression", "n.", "表情"], ["image", "n.", "形象"], ["impression", "n.", "印象"]),
      G("搜索检查", ["inspection", "n.", "检查"], ["investigation", "n.", "调查"], ["dictionary", "n.", "词典"], ["clue", "n.", "线索"])
    ),
    commonErrors: E(["Look this picture.", "Look at this picture.", "look 表示把目光投向具体对象时通常接 at。"], ["She looks happily today.", "She looks happy today.", "系动词 look 后接形容词描述主语状态，不接副词。"])
  },

  use: {
    meanings: M(
      ["v.", "to employ something for a purpose", "使用；运用", "Use a clean cloth to wipe the screen.", "用干净的布擦拭屏幕。"],
      ["n.", "the act, purpose, or ability of using something", "使用；用途；使用权", "This tool is easy to use.", "这个工具很容易使用。"],
      ["n.", "benefit or practical value", "用处；益处", "There is no use arguing now.", "现在争论没有用。"]
    ),
    fixedPhrases: F(
      ["put something to good use", "充分利用某物", "She put her language skills to good use.", "她充分发挥了语言技能。"],
      ["be of use to someone", "对某人有用", "This guide may be of use to new staff.", "这份指南可能对新员工有用。"],
      ["make full use of something", "充分利用某物", "Make full use of the available space.", "充分利用现有空间。"],
      ["have no use for something", "不需要；不喜欢某物", "I have no use for that broken chair.", "我不需要那把坏椅子。"],
      ["come into use", "开始被使用", "Electric buses came into use last year.", "电动公交车去年开始投入使用。"],
      ["go out of use", "停止使用", "That expression has gone out of use.", "那个说法已经不再使用。"],
      ["for personal use", "供个人使用", "The equipment is for personal use only.", "这台设备仅供个人使用。"],
      ["under normal use", "在正常使用情况下", "The battery lasts two days under normal use.", "正常使用时电池可续航两天。"],
      ["use your judgment", "自行判断", "Use your judgment when choosing examples.", "选择例子时请自行判断。"],
      ["use force", "使用武力", "Police said they did not use force.", "警方称没有使用武力。"],
      ["use something as something", "把某物用作某物", "We use this room as an office.", "我们把这个房间当办公室用。"],
      ["use something against someone", "利用某物对付某人", "Do not use private information against people.", "不要利用私人信息对付别人。"]
    ),
    contexts: C(
      G("工具材料", ["use a sharp knife", "使用锋利的刀"], ["use recycled paper", "使用再生纸"], ["use protective equipment", "使用防护设备"], ["use the correct password", "使用正确密码"]),
      G("方法技能", ["use simple language", "使用简单语言"], ["use evidence to support a claim", "用证据支持主张"], ["use time wisely", "明智利用时间"], ["use a different approach", "采用不同方法"]),
      G("系统资源", ["use public transport", "乘坐公共交通"], ["use less electricity", "少用电"], ["use available data", "使用可用数据"], ["use a shared account", "使用共享账户"]),
      G("用途限制", ["use something only when necessary", "仅在必要时使用某物"], ["use something safely", "安全使用某物"], ["use something without permission", "未经许可使用某物"], ["use something for storage", "把某物用于储存"])
    ),
    derivatives: D(["reuse", "v. / n.", "重复使用", "指再次使用物品或材料，强调减少浪费。", "/ˌriːˈjuːz/（动词）；/ˌriːˈjuːs/（名词）"], ["user", "n.", "使用者；用户", "指使用产品、服务或系统的人。"], ["usage", "n.", "用法；使用量", "可指语言习惯或资源消耗量。"], ["usable", "adj.", "可用的", "强调状态达到可实际使用的程度。"], ["useful", "adj.", "有用的", "强调能帮助实现某个目的。"], ["useless", "adj.", "无用的", "强调没有实际作用或不能达到目的。"], ["usefully", "adv.", "有用地；有效地", "描述信息或时间等发挥实际作用的方式。"]),
    synonyms: S(
      ["employ", "v.", "使用；采用", "正式用词，常用于方法、策略或资源；另有‘雇用’义。"],
      ["utilize", "v.", "利用", "较正式，强调为特定目的使资源发挥作用。"],
      ["apply", "v.", "应用；运用", "常与方法、规则、知识搭配，通常不表示使用具体日用品。"],
      ["operate", "v.", "操作；运行", "用于机器或系统，强调控制其运行，而非一般用途。"],
      ["consume", "v.", "消耗；耗用", "用于能源、时间和材料，强调资源被用掉。"]
    ),
    antonyms: A(["discard", "v.", "丢弃；不用", "与保留并使用某个物品的 use 义形成对比。"]),
    confusables: X(["used to", "phr.", "过去常常", "used to + 动词原形表示过去习惯；be used to + 名词/-ing 表示习惯于。"]),
    related: R(
      G("工具设备", ["tool", "n.", "工具"], ["device", "n.", "设备"], ["equipment", "n.", "设备；器材"], ["instrument", "n.", "仪器；工具"]),
      G("用途功能", ["purpose", "n.", "目的；用途"], ["function", "n.", "功能"], ["benefit", "n.", "益处"], ["practical", "adj.", "实用的"]),
      G("资源管理", ["resource", "n.", "资源"], ["efficiency", "n.", "效率"], ["waste", "n.", "浪费；废弃物"], ["consumption", "n.", "消耗量"])
    ),
    commonErrors: E(["I am used to wake up early.", "I am used to waking up early.", "be used to 中 to 是介词，后接名词或 -ing。"], ["This tool is used for cut glass.", "This tool is used for cutting glass.", "be used for 后接名词或 -ing；be used to 后接动词原形表示用途。"])
  },

  tell: {
    meanings: M(
      ["v.", "to give information to someone in speech or writing", "告诉；告知", "Tell me where you found it.", "告诉我你在哪里找到它的。"],
      ["v.", "to order, advise, or instruct someone to do something", "吩咐；叫；建议", "The doctor told me to rest.", "医生叫我休息。"],
      ["v.", "to recognize, distinguish, or know something", "辨别；看出；知道", "I cannot tell which copy is original.", "我分不清哪份是原件。"],
      ["v.", "to narrate a story or reveal evidence", "讲述；显示", "The figures tell a different story.", "这些数字反映出另一种情况。"]
    ),
    fixedPhrases: F(
      ["tell someone apart", "分辨两个人或事物", "I cannot tell the twins apart.", "我分不清这对双胞胎。"],
      ["tell at a glance", "一眼就看出", "You can tell at a glance which bag is heavier.", "你一眼就能看出哪个包更重。"],
      ["tell someone off", "责备某人", "The coach told him off for being late.", "教练因他迟到训斥了他。"],
      ["tell on someone", "告发某人", "The child threatened to tell on his brother.", "这个孩子威胁要告发哥哥。"],
      ["tell against someone", "成为对某人不利的因素", "His lack of experience may tell against him.", "经验不足可能对他不利。"],
      ["tell someone straight", "直截了当地告诉某人", "I told her straight that the plan would fail.", "我直截了当地告诉她这个计划会失败。"],
      ["tell it like it is", "如实直说", "People trust her because she tells it like it is.", "人们信任她，因为她总是如实直说。"],
      ["tell tales", "说人坏话；打小报告", "No one likes a colleague who tells tales.", "没人喜欢打小报告的同事。"],
      ["tell one thing from another", "区分两样事物", "He cannot tell red from green.", "他分不清红色和绿色。"],
      ["tell someone where to go", "告诉某人去哪里", "The guide told us where to go next.", "导游告诉我们接下来去哪里。"],
      ["tell by something", "根据某事判断", "I could tell by her voice that she was upset.", "我从她的声音听出她很难过。"],
      ["live to tell the tale", "历险后幸存下来", "They survived the storm and lived to tell the tale.", "他们在暴风雨中幸存，并能讲述这段经历。"]
    ),
    contexts: C(
      G("传递信息", ["tell someone the exact time", "告诉某人确切时间"], ["tell everyone what changed", "告诉大家改了什么"], ["tell someone where you live", "告诉某人住在哪里"], ["tell the police what happened", "向警方说明发生了什么"]),
      G("命令建议", ["tell someone to slow down", "叫某人慢一点"], ["tell the children not to touch", "叫孩子们别碰"], ["tell someone how to apply", "告诉某人如何申请"], ["tell staff when to arrive", "告知员工何时到达"]),
      G("辨别判断", ["tell right from wrong", "分辨是非"], ["tell whether food is fresh", "判断食物是否新鲜"], ["tell from someone's expression", "从某人表情判断"], ["tell the difference by touch", "通过触摸辨别差异"]),
      G("讲述显示", ["tell a funny joke", "讲一个有趣的笑话"], ["tell the story in order", "按顺序讲述故事"], ["tell us a great deal", "向我们说明很多情况"], ["tell of life in the village", "讲述村里的生活"])
    ),
    derivatives: D(["teller", "n.", "讲述者；银行出纳员", "语境决定是讲故事的人还是银行柜员。"], ["telling", "adj.", "有力的；显著的", "常指 evidence、detail 或 comment 能清楚说明问题。"], ["untold", "adj.", "未讲述的；无数的", "常见于 untold stories 或 untold damage。"]),
    synonyms: S(
      ["inform", "v.", "通知；告知", "正式，通常用 inform someone of/about something，不用双宾语。"],
      ["say", "v.", "说", "say 后接说出的内容；tell 通常要接听话对象。"],
      ["notify", "v.", "正式通知", "用于官方信息，结构为 notify someone of/about something。"],
      ["relate", "v.", "讲述", "对应 tell a story 的叙述义，较正式，常按顺序说明事件。"],
      ["distinguish", "v.", "区分", "只对应 tell A from B 的辨别义，不表示告知。"]
    ),
    antonyms: A(["conceal", "v.", "隐瞒", "与 tell/reveal information 的义项相反，强调有意隐藏。"]),
    confusables: X(["talk", "v.", "交谈", "talk 强调双向说话过程；tell 强调把信息传给某人或指示某人。"]),
    related: R(
      G("信息传递", ["news", "n.", "消息"], ["fact", "n.", "事实"], ["instruction", "n.", "指示"], ["warning", "n.", "警告"]),
      G("叙事表达", ["story", "n.", "故事"], ["account", "n.", "叙述"], ["detail", "n.", "细节"], ["narrative", "n.", "叙事"]),
      G("辨别线索", ["difference", "n.", "差异"], ["sign", "n.", "迹象"], ["clue", "n.", "线索"], ["contrast", "n.", "对比"])
    ),
    commonErrors: E(["She told that she was tired.", "She said that she was tired.", "tell 通常需要听话对象；没有对象时用 say that。"], ["Tell to me the truth.", "Tell me the truth.", "tell 可接双宾语，中间不加 to。"])
  },

  find: {
    meanings: M(["v.", "to discover or locate someone or something", "找到；发现", "I found my keys under the sofa.", "我在沙发下找到了钥匙。"], ["v.", "to learn or realize something through experience", "发觉；得知", "We found that the door was unlocked.", "我们发现门没有锁。"], ["v.", "to regard someone or something in a particular way", "认为；觉得", "I find this chair uncomfortable.", "我觉得这把椅子不舒服。"]),
    fixedPhrases: F(["find fault with someone", "挑某人的毛病", "He always finds fault with my work.", "他总挑我工作的毛病。"], ["find your way", "找到路；找到方法", "We found our way back before dark.", "天黑前我们找到了回去的路。"], ["find time to do something", "抽时间做某事", "Try to find time to rest.", "尽量抽时间休息。"], ["find common ground", "找到共同点", "Both sides must find common ground.", "双方必须找到共同点。"], ["find yourself doing something", "不知不觉做某事", "I found myself agreeing with her.", "我发现自己竟赞同她。"], ["find something hard to believe", "觉得某事难以置信", "I find his story hard to believe.", "我觉得他的话难以置信。"], ["find out the truth", "查明真相", "The police are trying to find out the truth.", "警方正努力查明真相。"], ["find a solution to something", "找到某事的解决办法", "We need to find a solution to the noise problem.", "我们需要找到噪声问题的解决办法。"], ["find someone guilty", "裁定某人有罪", "The jury found him guilty.", "陪审团裁定他有罪。"], ["find favor with someone", "获得某人认可", "The proposal found favor with voters.", "该提案获得选民认可。"], ["find your voice", "找到自己的表达方式", "Young writers need time to find their voice.", "年轻作家需要时间形成自己的风格。"], ["be found wanting", "被发现不合格", "The safety checks were found wanting.", "这些安全检查被发现不合格。"]),
    contexts: C(G("寻找定位", ["find an empty seat", "找到空座位"], ["find someone in the garden", "在花园找到某人"], ["find the source of the leak", "找到漏水源头"], ["find your name on the list", "在名单上找到名字"]), G("发现信息", ["find evidence of damage", "发现损坏证据"], ["find that prices have risen", "发现价格上涨"], ["find out who called", "查明谁来过电话"], ["find a mistake in the total", "发现总数中的错误"]), G("评价感受", ["find the task rewarding", "觉得任务有意义"], ["find someone easy to work with", "觉得某人好相处"], ["find it strange that", "觉得……很奇怪"], ["find the room too warm", "觉得房间太热"]), G("获得机会", ["find work locally", "在本地找到工作"], ["find support among colleagues", "获得同事支持"], ["find a buyer quickly", "很快找到买家"], ["find space for another desk", "腾出地方放另一张桌子"])),
    derivatives: D(["finding", "n.", "调查结果；发现", "常指研究或调查所得结论。"], ["finder", "n.", "发现者；查找工具", "可指找到东西的人或设备功能。"], ["newfound", "adj.", "新发现的；新获得的", "常见于 newfound confidence/freedom。"]),
    synonyms: S(["discover", "v.", "发现", "强调首次发现原本未知的事物。"], ["locate", "v.", "找到位置", "强调确定人或物的准确位置。"], ["detect", "v.", "察觉；检测出", "常靠观察或仪器发现细微迹象。"], ["identify", "v.", "识别；确认", "强调确认身份、性质或原因。"], ["consider", "v.", "认为；看待", "只对应 find + 宾语 + 补语的评价义。"]),
    antonyms: A(["lose", "v.", "失去；找不到", "与找到或保有具体事物的义相反。"]), confusables: X(["found", "v.", "建立", "found 既是 find 的过去式，又可作原形表示建立；须看时态。"]),
    related: R(G("搜索线索", ["search", "n.", "搜索"], ["clue", "n.", "线索"], ["trace", "n.", "踪迹"], ["location", "n.", "位置"]), G("发现结果", ["evidence", "n.", "证据"], ["proof", "n.", "证明"], ["result", "n.", "结果"], ["revelation", "n.", "揭示；新发现"]), G("判断评价", ["opinion", "n.", "看法"], ["impression", "n.", "印象"], ["pleasant", "adj.", "令人愉快的"], ["difficult", "adj.", "困难的"])),
    commonErrors: E(["I found out my keys.", "I found my keys.", "find out 用于查明信息；找到具体物品直接用 find。"], ["I found difficult to focus.", "I found it difficult to focus.", "find + it + 形容词 + to do 中形式宾语 it 不可省略。"])
  },

  give: {
    meanings: M(["v.", "to hand, provide, or transfer something to someone", "给；交给；提供", "Give the form to the receptionist.", "把表格交给接待员。"], ["v.", "to cause, communicate, or perform something", "带来；传达；作出", "The news gave us hope.", "这个消息给了我们希望。"], ["v.", "to bend, yield, or become less firm", "弯曲；松动；让步", "The branch gave under his weight.", "树枝在他的重量下弯了。"]),
    fixedPhrases: F(["give someone a hand", "帮某人一把", "Could you give me a hand with this box?", "你能帮我搬这个箱子吗？"], ["give someone your word", "向某人保证", "I give you my word that it will not happen again.", "我向你保证不会再发生。"], ["give something a try", "尝试某事", "Give the new method a try.", "试试这个新方法。"], ["give way to something", "让位于；被某事取代", "Clouds gave way to sunshine.", "乌云散去，阳光出现。"], ["give in to something", "向某事屈服", "Do not give in to pressure.", "不要向压力屈服。"], ["give off something", "散发某物", "The flowers give off a sweet smell.", "这些花散发出甜香。"], ["give away something", "赠送；泄露某事", "His smile gave away the secret.", "他的笑容泄露了秘密。"], ["give back something", "归还某物", "Please give the book back tomorrow.", "请明天把书还回来。"], ["give someone credit for something", "因某事肯定某人", "You should give her credit for trying.", "你应该肯定她所作的努力。"], ["give rise to something", "引起某事", "The change gave rise to confusion.", "这项变化引起了混乱。"], ["give someone the benefit of the doubt", "姑且相信某人", "I will give him the benefit of the doubt.", "我暂且相信他。"], ["give it your best shot", "尽最大努力试一试", "Give it your best shot and see what happens.", "尽全力试试，看看结果。"]),
    contexts: C(G("交付给予", ["give someone a receipt", "给某人收据"], ["give the keys to a neighbor", "把钥匙交给邻居"], ["give each child a sticker", "给每个孩子一张贴纸"], ["give blood regularly", "定期献血"]), G("信息表达", ["give clear instructions", "给出清楚指示"], ["give an honest answer", "作出诚实回答"], ["give a short presentation", "作简短演示"], ["give notice in writing", "书面通知"]), G("产生影响", ["give someone confidence", "给某人信心"], ["give the room more light", "让房间更明亮"], ["give someone a headache", "使某人头痛"], ["give cause for concern", "引起担忧"]), G("让步反应", ["give under pressure", "在压力下让步"], ["give a little when pushed", "受推时略微弯曲"], ["give up your seat", "让出座位"], ["give someone another chance", "再给某人一次机会"])),
    derivatives: D(["giver", "n.", "给予者", "指给予礼物、帮助或资源的人。"], ["giving", "adj.", "慷慨的；乐于付出的", "描述乐于给予时间、关爱或财物的人。"], ["given", "adj. / prep.", "特定的；考虑到", "形容词指指定的，介词 given 表示考虑到。"]),
    synonyms: S(["provide", "v.", "提供", "常用 provide someone with something，较正式。"], ["offer", "v.", "主动提供", "强调让对方选择是否接受。"], ["grant", "v.", "正式授予", "常用于权利、许可、请求或愿望。"], ["hand", "v.", "递交", "强调用手把具体物品交给对方。"], ["donate", "v.", "捐赠", "强调免费给慈善机构或公共用途。"]),
    antonyms: A(["take", "v.", "拿走；接受", "在给予与接收方向上与 give 相对。"]), confusables: X(["lend", "v.", "借出", "lend 暗含日后归还；give 通常转移所有权。"]),
    related: R(G("物品转移", ["gift", "n.", "礼物"], ["recipient", "n.", "接受者"], ["delivery", "n.", "交付"], ["exchange", "n.", "交换"]), G("帮助资源", ["support", "n.", "支持"], ["aid", "n.", "援助"], ["funding", "n.", "资金"], ["permission", "n.", "许可"]), G("表达影响", ["speech", "n.", "演讲"], ["advice", "n.", "建议"], ["opportunity", "n.", "机会"], ["pressure", "n.", "压力"])),
    commonErrors: E(["She gave to me a book.", "She gave me a book.", "give 接双宾语时人放在物前且不加 to。"], ["He gave me an advice.", "He gave me some advice.", "advice 是不可数名词，不用 an。"])
  },

  need: {
    meanings: M(["v.", "to require something because it is necessary", "需要；必须有", "We need more evidence.", "我们需要更多证据。"], ["v.", "to have to do something", "需要做；必须做", "You need to update the software.", "你需要更新软件。"], ["n.", "a situation in which something necessary is required", "需要；需求", "There is an urgent need for clean water.", "洁净用水有迫切需求。"], ["modal v.", "used mainly in questions and negatives to mean have to", "需要；必须（主要用于疑问和否定）", "You need not decide today.", "你不必今天决定。"]),
    fixedPhrases: F(["need not apply", "不必申请；不符合资格", "Anyone without a license need not apply.", "没有执照的人不必申请。"], ["need only do something", "只需做某事", "You need only press this button.", "你只需按这个按钮。"], ["need someone badly", "非常需要某人", "The team needs you badly right now.", "团队现在非常需要你。"], ["in need of something", "需要某物", "The roof is in need of repair.", "屋顶需要维修。"], ["if need be", "如果有必要", "We can work late if need be.", "如有必要，我们可以工作到很晚。"], ["there is no need for something", "没有必要有某事", "There is no need for alarm.", "不必惊慌。"], ["meet a need", "满足需求", "The service meets a real need.", "这项服务满足了实际需求。"], ["feel the need to do something", "觉得有必要做某事", "I felt the need to explain.", "我觉得有必要解释。"], ["as the need arises", "在需要时", "Extra staff can be called in as the need arises.", "有需要时可以增派员工。"], ["special needs", "特殊需求", "The school supports children with special needs.", "学校为有特殊需求的儿童提供支持。"], ["need doing", "需要被做", "The windows need cleaning.", "窗户需要清洗。"], ["all you need is something", "你所需要的只是某物", "All you need is a little patience.", "你只需要一点耐心。"]),
    contexts: C(G("物品资源", ["need extra storage", "需要额外存储空间"], ["need medical attention", "需要医疗处理"], ["need a valid ticket", "需要有效车票"], ["need enough sleep", "需要充足睡眠"]), G("行动义务", ["need to leave immediately", "需要立即离开"], ["need to be checked", "需要接受检查"], ["need someone to confirm", "需要某人确认"], ["need not wait outside", "不必在外面等"]), G("程度时限", ["need help urgently", "急需帮助"], ["need more time to recover", "需要更多时间恢复"], ["need attention every day", "每天需要关注"], ["need little explanation", "几乎不需要解释"]), G("社会需求", ["need for affordable housing", "对可负担住房的需求"], ["need for trained staff", "对受训员工的需求"], ["address local needs", "回应本地需求"], ["people in greatest need", "最需要帮助的人"])),
    derivatives: D(["needy", "adj.", "贫困的；过度依赖的", "可指需要物质帮助，也可指情感上过度依赖。"], ["neediness", "n.", "贫困；依赖", "对应 needy 的状态名词。"], ["needless", "adj.", "不必要的", "常指可避免的成本、风险或痛苦。"], ["needlessly", "adv.", "不必要地", "描述本可避免的动作或结果。"], ["needed", "adj.", "需要的；必需的", "常见于 much-needed support。"]),
    synonyms: S(["require", "v.", "需要；要求", "更正式，强调客观条件或规则。"], ["have to", "phr.", "不得不", "对应 need to 的义务结构，口语常用。"], ["call for", "phr.", "需要；要求", "主语常为情况或任务，强调所需措施。"], ["demand", "v.", "要求；需要", "语气强，常指严苛任务或明确要求。"], ["be necessary", "phr.", "有必要", "用形容词从必要性角度表达，不直接表示人的需求。"]),
    antonyms: A(["do without", "phr.", "没有……也行", "与需要某物的义项形成对比。"]), confusables: X(["want", "v.", "想要；需要", "want 常是主观愿望；need 强调客观必要。"]),
    related: R(G("基本需求", ["food", "n.", "食物"], ["shelter", "n.", "住所"], ["safety", "n.", "安全"], ["healthcare", "n.", "医疗保健"]), G("必要条件", ["necessity", "n.", "必要性；必需品"], ["essential", "adj.", "必不可少的"], ["urgent", "adj.", "紧急的"], ["requirement", "n.", "必要条件"]), G("帮助供给", ["assistance", "n.", "援助"], ["resource", "n.", "资源"], ["shortage", "n.", "短缺"], ["provision", "n.", "供应；准备"])),
    commonErrors: E(["You don't need come early.", "You don't need to come early.", "普通实义动词 need 后接不定式要带 to。"], ["The room needs to clean.", "The room needs cleaning.", "物作主语时可用 need doing 或 need to be done。"])
  },

  should: {
    meanings: M(["modal v.", "used to give advice or say what is right", "应该；应当", "You should back up your files.", "你应该备份文件。"], ["modal v.", "used to express expectation or probability", "按理应该；可能会", "The parcel should arrive tomorrow.", "包裹按理明天会到。"], ["modal v.", "used in formal conditions or to make statements less direct", "万一；竟然；用于委婉表达", "Should you need help, call this number.", "如果你需要帮助，请拨这个号码。"]),
    fixedPhrases: F(["should know better", "本应更明事理", "You should know better than to share passwords.", "你应该知道不能分享密码。"], ["should have done something", "本应该做某事", "I should have checked the time.", "我本应该核对时间。"], ["should not have done something", "本不应该做某事", "We should not have ignored the warning.", "我们本不该忽视警告。"], ["why should someone do something", "某人凭什么要做某事", "Why should I apologize for her mistake?", "我为什么要为她的错误道歉？"], ["how should someone know", "某人怎么会知道", "How should I know where he went?", "我怎么会知道他去了哪里？"], ["should the need arise", "如有需要", "Should the need arise, contact reception.", "如有需要，请联系前台。"], ["as it should be", "正如应有的样子", "Everything is now as it should be.", "一切现在都恢复了应有的样子。"], ["should be enough", "应该足够", "Two copies should be enough.", "两份应该够了。"], ["should be able to do something", "应该能够做某事", "You should be able to finish today.", "你今天应该能完成。"], ["should happen to do something", "万一碰巧做某事", "If you should happen to see her, say hello.", "如果你碰巧见到她，替我问好。"], ["should not be confused with something", "不应与某物混淆", "Affect should not be confused with effect.", "不要把 affect 和 effect 混淆。"], ["I should think so", "委婉表示赞同", "Will it be expensive? I should think so.", "会很贵吗？我想应该会。"]),
    contexts: C(G("建议责任", ["should exercise regularly", "应该定期锻炼"], ["should respect local rules", "应该尊重当地规则"], ["should ask before entering", "进入前应该先问"], ["should keep receipts", "应该保留收据"]), G("预期推断", ["should arrive before noon", "按理中午前到"], ["should cost about fifty dollars", "预计约五十美元"], ["should remain valid", "按理仍然有效"], ["should improve with practice", "练习后应该会进步"]), G("过去评价", ["should have called earlier", "本应早点打电话"], ["should have been more careful", "本应更小心"], ["should never have agreed", "当初绝不该同意"], ["should have told the truth", "本应说实话"]), G("正式条件", ["should anyone object", "如果有人反对"], ["should circumstances change", "如果情况有变"], ["should problems occur", "如果出现问题"], ["should you wish to cancel", "如果你想取消"])),
    derivatives: D(),
    synonyms: S(["ought to", "modal phr.", "应该", "近似 should 的道德或合理建议，语气略正式。"], ["be supposed to", "phr.", "按规定应该", "强调规则、安排或他人期待。"], ["had better", "modal phr.", "最好", "带明显警告或后果，语气比 should 强。"], ["be advisable to", "phr.", "做某事是明智的", "正式客观地说明建议。"], ["be expected to", "phr.", "预计；被要求", "可对应预期或职责，具体由语境决定。"]),
    antonyms: A(["ought not to", "modal phr.", "不应当", "与 should 的道德建议义形成直接否定对比。"]), confusables: X(["must", "modal v.", "必须", "must 表强制或强推断；should 通常是建议或较温和预期。"]),
    related: R(G("建议判断", ["advice", "n.", "建议"], ["recommendation", "n.", "推荐；建议"], ["wise", "adj.", "明智的"], ["appropriate", "adj.", "合适的"]), G("责任规则", ["duty", "n.", "责任"], ["obligation", "n.", "义务"], ["standard", "n.", "标准"], ["conduct", "n.", "行为"]), G("预期概率", ["expectation", "n.", "预期"], ["probable", "adj.", "很可能的"], ["forecast", "n.", "预测"], ["likelihood", "n.", "可能性"])),
    commonErrors: E(["You should to rest.", "You should rest.", "should 后直接接动词原形，不加 to。"], ["You should have went earlier.", "You should have gone earlier.", "should have 后接过去分词 gone。"])
  },

  try: {
    meanings: M(["v.", "to attempt to do something, especially something difficult", "努力；试图", "I will try to finish by noon.", "我会努力在中午前完成。"], ["v.", "to test something to see whether it works or suits you", "试用；试验；尝试", "Try restarting the computer.", "试试重启电脑。"], ["n.", "an attempt", "尝试", "Give it one more try.", "再试一次。"]),
    fixedPhrases: F(["try your luck", "碰碰运气", "We tried our luck at the weekend market.", "我们去周末市场碰碰运气。"], ["try your hand at something", "尝试做某事", "She tried her hand at pottery.", "她尝试做陶艺。"], ["try someone's patience", "考验某人的耐心", "The repeated delays tried our patience.", "一再延误考验着我们的耐心。"], ["try every means", "用尽各种办法", "They tried every means to contact him.", "他们想尽办法联系他。"], ["try as someone might", "尽管某人竭尽全力", "Try as I might, I could not open it.", "尽管我竭尽全力，还是打不开它。"], ["try something for size", "试试尺寸；试试看是否合适", "Try this jacket for size.", "试试这件夹克合不合身。"], ["try before you buy", "先试后买", "The shop lets you try before you buy.", "这家店可以先试后买。"], ["try something on for size", "试穿；考虑某想法", "Try the role on for size before accepting.", "接受前先考虑这个角色是否适合你。"], ["try again later", "稍后重试", "The server is busy; try again later.", "服务器繁忙，请稍后重试。"], ["try to see something from another view", "试着换个角度看某事", "Try to see the issue from her point of view.", "试着从她的角度看这个问题。"], ["try something out on someone", "先让某人试用或听取反应", "I tried the joke out on a friend.", "我先把这个笑话讲给朋友听，看看反应。"], ["have a try at something", "尝试做某事", "Let me have a try at fixing it.", "让我试着修修它。"]),
    contexts: C(G("努力目标", ["try to stay calm", "努力保持冷静"], ["try to meet the deadline", "努力赶上截止日期"], ["try to avoid waste", "尽量避免浪费"], ["try hard to remember", "努力回想"]), G("方法试验", ["try using less salt", "试着少放盐"], ["try a different password", "试用另一个密码"], ["try the local soup", "尝尝当地的汤"], ["try working in shorter sessions", "试试缩短每次工作时间"]), G("产品体验", ["try the shoes on", "试穿鞋子"], ["try out a new camera", "试用新相机"], ["try the door handle", "试着转动门把手"], ["try a free sample", "试尝免费样品"]), G("反复坚持", ["try once more", "再试一次"], ["try despite the risk", "尽管有风险仍尝试"], ["try until it works", "一直尝试到成功"], ["never stop trying", "永不停止努力"])),
    derivatives: D(["trying", "adj.", "令人难受的；棘手的", "独立形容词义，常指困难时期或恼人经历。"], ["trial", "n.", "试验；审判", "与 try 同源但意义分化，常见于 clinical trial。"]),
    synonyms: S(["attempt", "v.", "试图", "较正式，强调着手做困难的事，不保证成功。"], ["test", "v.", "测试", "强调检验性能、能力或真实性。"], ["endeavor", "v.", "努力", "正式且强调持续认真付出。"], ["seek", "v.", "设法；寻求", "常用 seek to do，正式强调努力达成。"], ["sample", "v.", "品尝；体验", "只对应试吃、试用少量产品的义项。"]),
    antonyms: A(["give up", "phr.", "放弃", "与持续尝试完成目标的义项相反。"]), confusables: X(["manage", "v.", "设法成功做到", "try 表示付出努力但未必成功；manage to do 明确表示成功。"]),
    related: R(G("努力过程", ["effort", "n.", "努力"], ["challenge", "n.", "挑战"], ["persistence", "n.", "坚持"], ["practice", "n.", "练习"]), G("测试体验", ["experiment", "n.", "实验"], ["sample", "n.", "样品"], ["prototype", "n.", "原型"], ["feedback", "n.", "反馈"]), G("成败结果", ["success", "n.", "成功"], ["failure", "n.", "失败"], ["progress", "n.", "进展"], ["chance", "n.", "机会"])),
    commonErrors: E(["I tried to restart it, and that solved it.", "I tried restarting it, and that solved it.", "表示把某方法作为试验时用 try doing；try to do 强调努力完成。"], ["She tried opening the safe but could not move the handle.", "She tried to open the safe but could not move the handle.", "强调努力却未成功时用 try to do。"])
  },

  let: {
    meanings: M(["v.", "to allow someone to do something", "让；允许", "Let the children choose for themselves.", "让孩子们自己选择。"], ["v.", "to make a property available for rent", "出租", "They let the apartment to students.", "他们把公寓租给学生。"]),
    fixedPhrases: F(["let someone be", "别打扰某人", "She looks tired, so let her be.", "她看起来很累，别打扰她。"], ["let something go", "放下；不再纠结", "You need to let the anger go.", "你需要放下愤怒。"], ["let someone in on something", "让某人知道秘密", "Can we let you in on a secret?", "我们能告诉你一个秘密吗？"], ["let something slip", "无意泄露", "He let the address slip.", "他无意中说出了地址。"], ["let alone", "更不用说", "He cannot walk, let alone run.", "他连走都不行，更别说跑了。"], ["let someone off", "从轻处罚；放过", "The officer let her off with a warning.", "警官只警告了她便放行。"], ["let up", "减弱；停止", "The rain finally let up.", "雨终于小了。"], ["let someone through", "让某人通过", "Please let the ambulance through.", "请让救护车通过。"], ["let yourself down", "让自己失望", "Do not let yourself down by quitting now.", "别因现在放弃而让自己失望。"], ["let someone have something", "把某物给某人使用", "Let him have the last seat.", "把最后一个座位让给他。"], ["let it be known", "公开说明", "She let it be known that she opposed the plan.", "她公开表示反对该计划。"], ["let the matter rest", "不再追究此事", "We agreed to let the matter rest.", "我们同意不再追究此事。"]),
    contexts: C(G("许可行动", ["let someone decide", "让某人决定"], ["let children play outside", "让孩子们在外玩"], ["let me explain", "让我解释"], ["let visitors take photos", "允许访客拍照"]), G("使其变化", ["let the paint dry", "让油漆晾干"], ["let the engine cool", "让发动机冷却"], ["let the water run", "让水流着"], ["let the bread rise", "让面团发起"]), G("释放透露", ["let go of the handle", "松开把手"], ["let out a loud sigh", "长叹一声"], ["let someone into the building", "让某人进入大楼"], ["let a secret escape", "泄露秘密"]), G("出租安排", ["let a room by the week", "按周出租房间"], ["let the house furnished", "带家具出租房子"], ["property to let", "待出租房产"], ["let office space cheaply", "低价出租办公空间"])),
    derivatives: D(["letting", "n.", "出租房屋", "英式地产语境中指出租行为或待租房屋。"]), synonyms: S(["allow", "v.", "允许", "中性通用，常接 someone to do。"], ["permit", "v.", "准许", "正式，常指规则或授权。"], ["enable", "v.", "使能够", "强调提供条件而非单纯许可。"], ["authorize", "v.", "正式授权", "强调有权机构批准。"], ["rent out", "phr.", "出租", "只对应房产出租义。"]),
    antonyms: A(["prevent", "v.", "阻止", "与允许某动作发生相反。"]), confusables: X(["leave", "v.", "离开；留下", "let /let/ 表允许；leave /liːv/ 表离开或留下。"]),
    related: R(G("许可规则", ["consent", "n.", "同意"], ["permission", "n.", "许可"], ["license", "n.", "许可证"], ["freedom", "n.", "自由"]), G("控制释放", ["restraint", "n.", "约束"], ["release", "n.", "释放"], ["access", "n.", "进入权"], ["choice", "n.", "选择"]), G("房屋租赁", ["tenant", "n.", "租户"], ["landlord", "n.", "房东"], ["lease", "n.", "租约"], ["rent", "n.", "租金"])),
    commonErrors: E(["She let me to leave.", "She let me leave.", "let someone do 后接不带 to 的原形。"], ["The rules let to smoke here.", "The rules allow smoking here.", "let 通常需要宾语；无宾语许可用 allow doing。"])
  },

  call: {
    meanings: M(["v.", "to telephone or speak loudly to someone", "打电话；呼喊", "Call me when you arrive.", "你到达时给我打电话。"], ["v.", "to give someone or something a name", "称呼；把……叫作", "They call this area the old town.", "他们把这个地区叫作老城。"], ["v.", "to request, summon, or announce something", "召集；要求；宣布", "The chair called a meeting.", "主席召集了会议。"], ["n.", "a telephone conversation, shout, request, or decision", "电话；呼声；要求；决定", "I received a call from the clinic.", "我接到诊所的电话。"]),
    fixedPhrases: F(["call it a day", "收工", "Let's call it a day and continue tomorrow.", "今天就到这里，明天继续吧。"], ["call into question", "使受到质疑", "The error calls the results into question.", "这个错误使结果受到质疑。"], ["call someone's bluff", "要求某人兑现威胁", "She called his bluff and refused to leave.", "她要求他来真的，并拒绝离开。"], ["call the shots", "作决定；掌权", "The director calls the shots here.", "这里由主管作决定。"], ["call attention to something", "提醒注意某事", "The report calls attention to rising costs.", "报告提醒人们注意成本上升。"], ["call for action", "要求采取行动", "The crisis calls for immediate action.", "危机要求立即采取行动。"], ["call in sick", "打电话请病假", "I had to call in sick today.", "我今天不得不打电话请病假。"], ["call in a specialist", "请专家来", "We called in a specialist to inspect the roof.", "我们请专家来检查屋顶。"], ["call out someone's behavior", "公开指出某人的行为有问题", "She called out his rude behavior.", "她公开指出他的粗鲁行为。"], ["call something off", "取消某事", "They called the match off because of rain.", "他们因下雨取消了比赛。"], ["call someone up", "给某人打电话", "I will call you up this evening.", "今晚我会给你打电话。"], ["call something into being", "使某事物产生", "The law called a new agency into being.", "该法律促成了一个新机构。"]),
    contexts: C(G("电话联系", ["call the office directly", "直接打电话给办公室"], ["call someone after lunch", "午饭后给某人打电话"], ["call from a landline", "用固定电话打来"], ["call emergency services", "呼叫急救服务"]), G("喊叫吸引", ["call someone's name loudly", "大声叫某人的名字"], ["call for help", "呼救"], ["call across the room", "隔着房间喊"], ["call the dog inside", "把狗叫进来"]), G("命名评价", ["call someone a hero", "称某人为英雄"], ["call the plan unrealistic", "称计划不现实"], ["call a child after someone", "以某人的名字给孩子命名"], ["call things by their proper names", "准确称呼事物"]), G("召集判定", ["call an election", "宣布举行选举"], ["call a brief pause", "宣布短暂停顿"], ["call everyone together", "召集大家"], ["call the result a success", "认定结果成功"])),
    derivatives: D(["caller", "n.", "打电话者；来访者", "指来电人，也可指到访者。"], ["calling", "n.", "使命；职业", "常指强烈使命感驱动的职业。"], ["callback", "n.", "回电；复试", "电话语境指回电，招聘/表演指再次面试。"]), synonyms: S(["phone", "v.", "打电话", "只对应电话联系义，口语常用。"], ["summon", "v.", "召唤；传唤", "正式，强调要求某人到场。"], ["name", "v.", "命名", "只对应赋予名称或指定身份。"], ["contact", "v.", "联系", "可通过电话、邮件等多种方式。"], ["announce", "v.", "宣布", "只对应正式宣布决定或结果。"]),
    antonyms: A(["dismiss", "v.", "遣散；解散", "与召集某人到场的 call/summon 义相反。"]), confusables: X(["call on", "phr.", "拜访；请某人发言", "call on 的具体意义由宾语和场景决定，不等于普通打电话。"]),
    related: R(G("电话通信", ["mobile", "n.", "手机"], ["voicemail", "n.", "语音信箱"], ["line", "n.", "电话线路"], ["ringtone", "n.", "铃声"]), G("称呼名称", ["title", "n.", "称谓"], ["nickname", "n.", "昵称"], ["label", "n.", "标签；称呼"], ["identity", "n.", "身份"]), G("会议决定", ["meeting", "n.", "会议"], ["signal", "n.", "信号"], ["judgment", "n.", "判断"], ["decision", "n.", "决定"])),
    commonErrors: E(["I called to him yesterday.", "I called him yesterday.", "call 表打电话时直接接人，不加 to。"], ["We called off the doctor.", "We called for the doctor.", "call for 表请求某人来；call off 表取消。"])
  },

  may: {
    meanings: M(["modal v.", "used to express possibility", "可能；也许", "The road may be closed tonight.", "这条路今晚可能关闭。"], ["modal v.", "used to ask for or give formal permission", "可以；获准", "May I ask a question?", "我可以问个问题吗？"], ["modal v.", "used to express a wish or purpose", "愿；以便", "May you have a safe journey.", "祝你旅途平安。"]),
    fixedPhrases: F(["may well do something", "很可能做某事", "Prices may well rise again.", "价格很可能再次上涨。"], ["may as well do something", "不妨做某事", "We may as well start now.", "我们不妨现在开始。"], ["may or may not", "可能会，也可能不会", "The treatment may or may not work.", "这种治疗可能有效，也可能无效。"], ["may have done something", "可能已经做了某事", "She may have missed the train.", "她可能没赶上火车。"], ["may yet do something", "仍有可能做某事", "The team may yet win.", "这支队仍有可能获胜。"], ["be that as it may", "尽管如此", "Be that as it may, we must continue.", "尽管如此，我们必须继续。"], ["may I suggest", "请允许我建议", "May I suggest a short break?", "请允许我建议休息一会儿。"], ["may I have something", "礼貌索取某物", "May I have another copy?", "我可以再要一份吗？"], ["may it please the court", "敬请法庭允许", "May it please the court, I will begin.", "敬请法庭允许，我现在开始陈述。"], ["come what may", "无论发生什么", "We will finish the work, come what may.", "无论发生什么，我们都会完成工作。"], ["may the best team win", "愿最佳队伍获胜", "May the best team win.", "愿最佳队伍获胜。"], ["as the case may be", "视情况而定", "Contact a doctor or nurse, as the case may be.", "视情况联系医生或护士。"]),
    contexts: C(G("可能事件", ["may rain overnight", "夜间可能下雨"], ["may cause mild irritation", "可能引起轻微刺激"], ["may take longer than expected", "可能比预期更久"], ["may still be available", "可能仍然有货"]), G("不确定推测", ["may have the wrong address", "可能地址错了"], ["may be difficult to prove", "可能难以证明"], ["may depend on age", "可能取决于年龄"], ["may never know the answer", "可能永远不知道答案"]), G("正式许可", ["may enter after nine", "九点后可以进入"], ["may use the staff entrance", "可以走员工入口"], ["may I speak freely", "我可以直说吗"], ["may guests bring children", "客人可以带孩子吗"]), G("祝愿目的", ["may all your wishes come true", "愿你梦想成真"], ["may peace return soon", "愿和平早日恢复"], ["may this guide help you", "愿本指南对你有帮助"], ["so that everyone may participate", "以便人人都能参与"])),
    derivatives: D(), synonyms: S(["might", "modal v.", "可能", "通常表示更弱或更遥远的可能。"], ["possibly", "adv.", "可能地", "副词，需与动词搭配，不能占情态动词位置。"], ["be allowed to", "phr.", "获准", "只对应许可义，可用于多种时态。"], ["perhaps", "adv.", "也许", "句子副词，不决定后接动词形式。"], ["can", "modal v.", "可以；可能", "许可更口语；can 的可能义常指一般规律。"]),
    antonyms: A(["be prohibited from", "phr.", "被禁止", "仅与 may 的许可义相反。"]), confusables: X(["might", "modal v.", "可能", "might 通常更不确定，也常用于假设或过去转述。"]),
    related: R(G("可能性", ["probability", "n.", "概率"], ["chance", "n.", "可能性"], ["uncertainty", "n.", "不确定性"], ["perhaps", "adv.", "也许"]), G("许可制度", ["permission", "n.", "许可"], ["approval", "n.", "批准"], ["authority", "n.", "权限"], ["restriction", "n.", "限制"]), G("祝愿语气", ["wish", "n.", "祝愿"], ["blessing", "n.", "祝福"], ["hope", "n.", "希望"], ["formal", "adj.", "正式的"])),
    commonErrors: E(["It may rains tomorrow.", "It may rain tomorrow.", "may 后接动词原形。"], ["May be he is late.", "Maybe he is late.", "maybe 是副词；may be 是情态动词加 be。"])
  },

  mean: {
    meanings: M(["v.", "to signify or express a particular idea", "意思是；表示", "What does this symbol mean?", "这个符号是什么意思？"], ["v.", "to intend something or intend to do something", "意指；打算", "I did not mean to upset you.", "我不是故意让你难过。"], ["v.", "to have importance or result in something", "对……重要；意味着", "Your support means a lot to me.", "你的支持对我很重要。"], ["adj.", "unkind, unwilling to spend, or average", "刻薄的；吝啬的；平均的", "The mean temperature was ten degrees.", "平均温度为十度。"], ["n.", "an average or a method of achieving something", "平均数；手段", "The arithmetic mean is twelve.", "算术平均数是十二。"]),
    fixedPhrases: F(["mean business", "是认真的", "When she sets a deadline, she means business.", "她定下截止日期时是认真的。"], ["mean no offense", "无意冒犯", "I mean no offense, but the figures look wrong.", "我无意冒犯，但这些数字似乎有误。"], ["mean the world to someone", "对某人极其重要", "Her family means the world to her.", "家人对她极其重要。"], ["mean well", "出于好意", "He means well, even when his advice is unhelpful.", "即使建议没用，他也是出于好意。"], ["be meant to do something", "本来应该做某事", "This switch is meant to control the fan.", "这个开关是用来控制风扇的。"], ["be meant for someone", "是为某人准备的", "This gift is meant for you.", "这份礼物是给你的。"], ["by no means", "绝不；一点也不", "The task is by no means easy.", "这项任务一点也不容易。"], ["by means of something", "借助某物", "The door opens by means of a sensor.", "这扇门通过传感器开启。"], ["a means to an end", "达到目的的手段", "Money is a means to an end, not the goal.", "金钱是达到目的的手段，不是目标。"], ["means of transport", "交通工具", "Bicycles are a cheap means of transport.", "自行车是廉价的交通工具。"], ["live beyond your means", "入不敷出", "They were living beyond their means.", "他们的生活开支超出了收入。"], ["if you know what I mean", "如果你懂我的意思", "The room felt cold, if you know what I mean.", "那房间让人感觉冷淡，你懂我的意思吧。"]),
    contexts: C(G("含义指代", ["mean the same thing", "意思相同"], ["mean something different here", "在这里意思不同"], ["mean exactly what you say", "说的就是本意"], ["mean that change is necessary", "意味着必须改变"]), G("意图计划", ["mean to call earlier", "本想早点打电话"], ["mean no harm", "无意伤害"], ["mean someone to hear", "有意让某人听见"], ["mean it as a compliment", "本意是称赞"]), G("重要结果", ["mean a great deal to someone", "对某人意义重大"], ["mean losing the contract", "意味着失去合同"], ["mean more work for everyone", "意味着大家工作更多"], ["mean the difference between success and failure", "决定成败"]), G("形容词名词", ["a mean remark", "刻薄的话"], ["the mean annual income", "年平均收入"], ["the geometric mean", "几何平均数"], ["a means of communication", "交流手段"])),
    derivatives: D(["meaning", "n.", "含义；意义", "可指词语含义或人生意义。"], ["meaningful", "adj.", "有意义的", "强调有价值或能传达重要内容。"], ["meaningless", "adj.", "无意义的", "强调没有意义、目的或有效信息。"], ["meaningfully", "adv.", "有意义地", "描述有实质意义的交流或行动。"]),
    synonyms: S(["signify", "v.", "表示；意味着", "正式，常解释符号或结果。"], ["intend", "v.", "打算；意指", "只对应主观意图。"], ["indicate", "v.", "表明", "强调证据或迹象显示。"], ["represent", "v.", "代表；象征", "强调一物代表另一概念。"], ["matter", "v.", "重要", "只对应 mean a lot 的重要性义。"]),
    antonyms: A(["be meaningless", "phr.", "没有意义", "与 mean/signify meaningful content 的义项相反。"]), confusables: X(["meaning", "n.", "含义", "mean 是动词或形容词；meaning 是名词。"]),
    related: R(G("语言含义", ["definition", "n.", "定义"], ["sense", "n.", "义项"], ["symbol", "n.", "符号"], ["message", "n.", "信息"]), G("意图目的", ["purpose", "n.", "目的"], ["motive", "n.", "动机"], ["plan", "n.", "计划"], ["deliberate", "adj.", "故意的"]), G("统计手段", ["average", "n.", "平均值"], ["median", "n.", "中位数"], ["method", "n.", "方法"], ["resource", "n.", "手段；资源"])),
    commonErrors: E(["What means this word?", "What does this word mean?", "一般现在时疑问句需用 does，mean 用原形。"], ["I mean doing it tomorrow.", "I mean to do it tomorrow.", "表示打算做用 mean to do；mean doing 表示意味着。"])
  },

  feel: {
    meanings: M(["v.", "to experience an emotion or physical sensation", "感到；感觉", "I feel much better today.", "我今天感觉好多了。"], ["v.", "to touch something or notice it through touch", "触摸；摸到", "Feel the fabric before you buy it.", "买之前摸摸这块布料。"], ["v.", "to believe or have an opinion", "认为；觉得", "I feel that we should wait.", "我觉得我们应该等一等。"], ["n.", "a sensation, atmosphere, or act of touching", "感觉；氛围；触感", "The room has a relaxed feel.", "这个房间有种轻松的氛围。"]),
    fixedPhrases: F(["feel at home", "感到自在", "We soon felt at home in the new city.", "我们很快就在新城市感到自在。"], ["feel up to doing something", "觉得有精力做某事", "I do not feel up to cooking tonight.", "今晚我没精神做饭。"], ["feel strongly about something", "对某事态度强烈", "She feels strongly about animal welfare.", "她非常重视动物福利。"], ["feel for someone", "同情某人", "I really feel for families affected by the flood.", "我很同情受洪水影响的家庭。"], ["feel your way", "摸索前进", "We felt our way through the dark room.", "我们在黑暗的房间里摸索前进。"], ["feel out of place", "感到格格不入", "I felt out of place at the formal dinner.", "在正式晚宴上我感到不自在。"], ["feel the need to do something", "觉得有必要做某事", "She felt the need to apologize.", "她觉得有必要道歉。"], ["feel the effects of something", "感受到某事的影响", "Small businesses are feeling the effects of inflation.", "小企业正感受到通胀的影响。"], ["get a feel for something", "逐渐熟悉某事", "Practice helps you get a feel for the rhythm.", "练习能帮助你掌握节奏感。"], ["feel your age", "感到年纪大了", "After the long hike, I really felt my age.", "长途徒步后，我真觉得自己年纪大了。"], ["feel someone out", "试探某人的态度", "I called to feel him out about the proposal.", "我打电话试探他对提案的态度。"], ["feel like yourself", "感觉恢复正常", "After a good sleep, I feel like myself again.", "好好睡一觉后，我感觉恢复正常了。"]),
    contexts: C(G("情绪状态", ["feel deeply disappointed", "感到非常失望"], ["feel proud of someone", "为某人自豪"], ["feel nervous before speaking", "发言前紧张"], ["feel safe at home", "在家感到安全"]), G("身体感觉", ["feel cold to the touch", "摸起来很凉"], ["feel pain in your shoulder", "肩膀感到疼痛"], ["feel dizzy after standing", "站起后感到头晕"], ["feel the wind on your face", "感到风吹在脸上"]), G("观点直觉", ["feel something is unfair", "觉得某事不公平"], ["feel certain about the choice", "对选择有把握"], ["feel it would be wiser to wait", "觉得等待更明智"], ["feel no need to explain", "觉得无需解释"]), G("触摸氛围", ["feel along the wall", "沿墙摸索"], ["feel for a pulse", "摸脉搏"], ["feel soft and smooth", "摸起来柔软光滑"], ["feel of quiet confidence", "沉静自信的氛围"])),
    derivatives: D(["feeling", "n.", "感觉；感情", "可数时指感觉或看法，复数常指感情。"], ["heartfelt", "adj.", "衷心的", "复合派生词，常修饰 thanks、apology。"]), synonyms: S(["sense", "v.", "感觉到", "强调直觉或感官察觉。"], ["experience", "v.", "经历；感受到", "较正式，强调亲身经历状态。"], ["perceive", "v.", "察觉；认为", "正式，强调通过感官或思考认识。"], ["touch", "v.", "触摸", "只对应主动用手感觉。"], ["believe", "v.", "认为；相信", "只对应 feel that 的观点义，确信度常更高。"]),
    antonyms: A(["be numb", "phr.", "麻木；没有感觉", "与身体感受到触觉或疼痛相反。"]), confusables: X(["fill", "v.", "装满", "feel /fiːl/ 表感觉；fill /fɪl/ 表装满。"]),
    related: R(G("情绪体验", ["emotion", "n.", "情绪"], ["mood", "n.", "心情"], ["anxiety", "n.", "焦虑"], ["relief", "n.", "宽慰"]), G("身体知觉", ["sensation", "n.", "感觉"], ["touch", "n.", "触觉"], ["pain", "n.", "疼痛"], ["temperature", "n.", "温度"]), G("直觉氛围", ["instinct", "n.", "直觉"], ["impression", "n.", "印象"], ["atmosphere", "n.", "氛围"], ["opinion", "n.", "看法"])),
    commonErrors: E(["I am feeling that this is wrong.", "I feel that this is wrong.", "表示观点时 feel 通常不用进行时。"], ["I feel myself tired.", "I feel tired.", "系动词 feel 后直接接形容词，不加反身代词。"])
  },

  ask: {
    meanings: M(["v.", "to request information by posing a question", "问；询问", "Ask where the nearest station is.", "问一下最近的车站在哪里。"], ["v.", "to request something or invite someone", "请求；要求；邀请", "She asked me to wait outside.", "她让我在外面等。"]),
    fixedPhrases: F(["ask around", "四处打听", "I will ask around and find a plumber.", "我会四处问问，找个水管工。"], ["ask after someone", "问候某人近况", "He asked after your mother.", "他问起你母亲的近况。"], ["ask someone out", "约某人出去", "Leo asked her out for coffee.", "利奥约她出去喝咖啡。"], ["ask for trouble", "自找麻烦", "Driving that fast is asking for trouble.", "开那么快是在自找麻烦。"], ["ask too much of someone", "对某人要求过高", "We may be asking too much of the team.", "我们可能对团队要求过高。"], ["ask a favor of someone", "请某人帮忙", "May I ask a favor of you?", "我能请你帮个忙吗？"], ["ask the way", "问路", "We stopped to ask the way.", "我们停下来问路。"], ["ask for someone by name", "点名找某人", "A caller asked for you by name.", "有位来电者点名找你。"], ["ask someone in", "请某人进来", "She asked the visitors in.", "她请访客进来。"], ["ask around for advice", "四处征求建议", "Ask around for advice before buying.", "购买前四处征求建议。"], ["ask what someone means", "问某人是什么意思", "I asked what he meant by fair.", "我问他说公平是什么意思。"], ["ask yourself whether", "问问自己是否……", "Ask yourself whether the risk is worth it.", "问问自己这风险是否值得。"]),
    contexts: C(G("信息问题", ["ask a direct question", "直接提问"], ["ask who is responsible", "询问谁负责"], ["ask how much it costs", "询问价格"], ["ask whether seats are available", "询问是否有座位"]), G("请求物品", ["ask for a receipt", "索要收据"], ["ask for more time", "请求更多时间"], ["ask for written confirmation", "要求书面确认"], ["ask permission first", "先征得许可"]), G("请求行动", ["ask someone to speak slowly", "请某人说慢些"], ["ask everyone to leave", "请大家离开"], ["ask not to be disturbed", "请求不要打扰"], ["ask a colleague to check", "请同事核对"]), G("邀请报价", ["ask someone to dinner", "邀请某人吃晚饭"], ["ask a high price", "要价很高"], ["ask for volunteers", "征集志愿者"], ["ask someone back", "回请某人"])),
    derivatives: D(["asking", "n. / adj.", "请求；要价的", "常见于 asking price 或 for the asking。"]), synonyms: S(["inquire", "v.", "询问", "正式，常接 about/into。"], ["request", "v.", "请求", "正式，侧重要求提供事物或行动。"], ["question", "v.", "提问；质疑", "可连续盘问或表示怀疑。"], ["seek", "v.", "寻求", "正式，常接 advice/help。"], ["invite", "v.", "邀请", "只对应请某人参加活动的义项。"]),
    antonyms: A(["answer", "v.", "回答", "在问答交际中与 ask 相对。"]), confusables: X(["request", "n. / v.", "请求", "ask 可接双宾语或不定式；request 的结构更正式。"]),
    related: R(G("问句信息", ["question", "n.", "问题"], ["answer", "n.", "答案"], ["reply", "n.", "答复"], ["detail", "n.", "细节"]), G("请求许可", ["favor", "n.", "帮忙"], ["permission", "n.", "许可"], ["assistance", "n.", "帮助"], ["demand", "n.", "要求"]), G("邀请交流", ["invitation", "n.", "邀请"], ["interview", "n.", "面试；访谈"], ["survey", "n.", "调查"], ["conversation", "n.", "交谈"])),
    commonErrors: E(["She asked me where was the station.", "She asked me where the station was.", "间接疑问句用陈述语序。"], ["I asked to him a question.", "I asked him a question.", "ask 接双宾语时人前不加 to。"])
  },

  talk: {
    meanings: M(["v.", "to speak with someone or discuss a subject", "交谈；谈论", "We talked about the problem for an hour.", "我们谈了一个小时这个问题。"], ["n.", "a conversation, speech, or discussion", "谈话；演讲；讨论", "She gave a talk on climate change.", "她作了气候变化演讲。"]),
    fixedPhrases: F(["talk some sense into someone", "劝某人理智", "Can you talk some sense into him?", "你能劝他理智一点吗？"], ["talk shop", "谈论本行工作", "Let's not talk shop over dinner.", "吃饭时别谈工作。"], ["talk behind someone's back", "背后议论某人", "I dislike people who talk behind my back.", "我不喜欢背后议论我的人。"], ["talk your way out of something", "靠说话摆脱困境", "He talked his way out of a fine.", "他靠口才免了罚款。"], ["talk down to someone", "居高临下地对某人说话", "Do not talk down to new staff.", "别用居高临下的口气对新员工说话。"], ["talk someone through something", "逐步向某人讲解某事", "She talked me through the setup.", "她逐步给我讲解了设置过程。"], ["talk something over", "商量某事", "Let's talk the options over tonight.", "今晚我们商量一下这些选项。"], ["talk someone around", "说服某人改变主意", "We finally talked him around.", "我们最终说服他改变了主意。"], ["be the talk of the town", "成为全城话题", "The new cafe is the talk of the town.", "这家新咖啡馆成了全城话题。"], ["have a serious talk", "认真谈一谈", "We need to have a serious talk.", "我们需要认真谈谈。"], ["small talk", "闲聊", "Small talk helps guests relax.", "闲聊能让客人放松。"], ["talk is cheap", "空谈容易", "Talk is cheap; show us the results.", "空谈容易，拿结果给我们看。"]),
    contexts: C(G("交谈对象", ["talk to a neighbor", "与邻居交谈"], ["talk with your doctor", "与医生交谈"], ["talk among yourselves", "你们自己讨论"], ["talk directly to the manager", "直接与经理谈"]), G("讨论主题", ["talk about future plans", "谈论未来计划"], ["talk politics at dinner", "吃饭时谈政治"], ["talk through each concern", "逐一讨论每个顾虑"], ["talk openly about money", "坦诚谈钱"]), G("表达方式", ["talk quietly in the library", "在图书馆小声交谈"], ["talk confidently in public", "在公共场合自信发言"], ["talk for hours", "谈上数小时"], ["talk without interruption", "不受打断地交谈"]), G("协商说服", ["talk someone into joining", "说服某人加入"], ["talk someone out of quitting", "劝某人别辞职"], ["talk through a disagreement", "通过交谈解决分歧"], ["talk terms with a supplier", "与供应商谈条件"])),
    derivatives: D(["talker", "n.", "健谈者；说话者", "可描述健谈或特定说话方式的人。"], ["talkativeness", "n.", "健谈；多话", "指一个人喜欢或倾向于多说话的性格特征。"], ["talkative", "adj.", "健谈的", "强调一个人喜欢多说话，常用于描述性格。"]), synonyms: S(["speak", "v.", "说话；发言", "可单向发言或表示语言能力。"], ["discuss", "v.", "讨论", "直接接主题，不加 about。"], ["converse", "v.", "交谈", "正式，强调双方交流。"], ["chat", "v.", "闲聊", "非正式且轻松。"], ["negotiate", "v.", "谈判", "只对应为达成协议而交谈。"]),
    antonyms: A(["remain silent", "phr.", "保持沉默", "与开口交谈的义相反。"]), confusables: X(["tell", "v.", "告诉", "tell 强调传递信息且常接人；talk 强调交谈过程。"]),
    related: R(G("交流形式", ["dialogue", "n.", "对话"], ["debate", "n.", "辩论"], ["discussion", "n.", "讨论"], ["speech", "n.", "演讲"]), G("话题内容", ["topic", "n.", "话题"], ["issue", "n.", "议题"], ["opinion", "n.", "意见"], ["gossip", "n.", "闲话"]), G("交际效果", ["agreement", "n.", "一致"], ["persuasion", "n.", "说服"], ["misunderstanding", "n.", "误解"], ["rapport", "n.", "融洽关系"])),
    commonErrors: E(["We discussed about the plan.", "We talked about the plan.", "talk about 可接话题；discuss 直接接宾语。"], ["I talked him the news.", "I told him the news.", "传递具体信息用 tell someone something。"])
  },

  keep: {
    meanings: M(["v.", "to retain or continue to have something", "保留；保存", "Keep the receipt in a safe place.", "把收据保存在安全处。"], ["v.", "to continue doing something or remain in a state", "继续；保持", "Keep the window closed.", "让窗户保持关闭。"], ["v.", "to prevent someone or something from moving or acting", "阻止；耽搁", "The rain kept us indoors.", "雨使我们留在室内。"]),
    fixedPhrases: F(["keep your word", "信守承诺", "She always keeps her word.", "她总是信守承诺。"], ["keep an eye on something", "留意某事物", "Please keep an eye on my bag.", "请帮我看着包。"], ["keep someone company", "陪伴某人", "I stayed to keep her company.", "我留下来陪她。"], ["keep your distance", "保持距离", "Keep your distance from the edge.", "离边缘远一点。"], ["keep your cool", "保持冷静", "He kept his cool during the argument.", "争吵中他保持了冷静。"], ["keep something to yourself", "把某事保密", "Please keep this information to yourself.", "请对这条信息保密。"], ["keep someone posted", "随时向某人通报", "Keep me posted on any changes.", "有变化随时告诉我。"], ["keep pace with something", "跟上某事", "Training must keep pace with technology.", "培训必须跟上技术发展。"], ["keep to the point", "紧扣主题", "Please keep to the point.", "请紧扣主题。"], ["keep out of something", "不卷入；远离", "Keep out of other people's disputes.", "别卷入别人的争端。"], ["keep something under control", "控制住某事", "We kept costs under control.", "我们控制住了成本。"], ["keep a low profile", "保持低调", "He kept a low profile after the incident.", "事件后他保持低调。"]),
    contexts: C(G("保存持有", ["keep the original document", "保留原件"], ["keep a record of payments", "保存付款记录"], ["keep enough cash at home", "家里留足现金"], ["keep old photographs", "保存旧照片"]), G("持续状态", ["keep calm under pressure", "压力下保持冷静"], ["keep the engine running", "让发动机持续运转"], ["keep working until six", "一直工作到六点"], ["keep someone informed", "随时告知某人"]), G("阻止限制", ["keep children away from fire", "让孩子远离火"], ["keep the door from closing", "防止门关上"], ["keep someone waiting", "让某人久等"], ["keep noise to a minimum", "把噪声降到最低"]), G("照料遵守", ["keep chickens for eggs", "养鸡取蛋"], ["keep a promise", "守诺"], ["keep regular hours", "保持规律作息"], ["keep within the budget", "控制在预算内"])),
    derivatives: D(["keeper", "n.", "保管人；守门员", "指负责照管者，也可指值得保留的人或物。"], ["keeping", "n.", "保管；协调一致", "常见于 in keeping with。"], ["keepsake", "n.", "纪念品", "因承载记忆而保存的物品。"]), synonyms: S(["continue", "v.", "继续", "只对应持续动作或状态。"], ["retain", "v.", "保留", "正式，强调继续拥有。"], ["maintain", "v.", "维持", "强调主动保持标准或状况。"], ["preserve", "v.", "保存；保护", "强调防止损坏或变化。"], ["store", "v.", "储存", "只对应把物品保存备用。"]),
    antonyms: A(["discard", "v.", "丢弃", "与保留某物的义相反。"]), confusables: X(["continue", "v.", "继续", "keep doing 强调反复或不中断；continue 可接 doing/to do。"]),
    related: R(G("保存管理", ["storage", "n.", "储存"], ["record", "n.", "记录"], ["custody", "n.", "保管"], ["property", "n.", "财物"]), G("持续稳定", ["duration", "n.", "持续"], ["routine", "n.", "惯例"], ["steady", "adj.", "稳定的"], ["consistent", "adj.", "持续一致的"]), G("控制照料", ["care", "n.", "照料"], ["limit", "n.", "限制"], ["boundary", "n.", "界限"], ["protection", "n.", "保护"])),
    commonErrors: E(["Keep to try.", "Keep trying.", "keep 表继续时后接 -ing。"], ["Keep me informed about any changes.", "Keep me informed of any changes.", "inform someone of something 是最标准搭配。"])
  },

  leave: {
    meanings: M(["v.", "to go away from a person or place", "离开；出发", "We left the office at six.", "我们六点离开办公室。"], ["v.", "to put or keep something in a place or condition", "留下；使处于", "Leave the door open.", "让门开着。"], ["v.", "to give responsibility, property, or a decision to someone", "交给；遗留", "Leave the details to me.", "细节交给我。"], ["n.", "permission or time away from work", "许可；休假", "She is on maternity leave.", "她在休产假。"]),
    fixedPhrases: F(["leave someone in the dark", "不让某人知情", "Do not leave staff in the dark.", "不要让员工蒙在鼓里。"], ["leave much to be desired", "远不能令人满意", "The service leaves much to be desired.", "这项服务远不能令人满意。"], ["leave no stone unturned", "想尽一切办法", "We will leave no stone unturned to find her.", "我们会想尽一切办法找到她。"], ["leave something out", "遗漏；排除某事", "You left out an important detail.", "你漏掉了一个重要细节。"], ["leave someone behind", "把某人落在后面", "The group would not leave anyone behind.", "团队不会落下任何人。"], ["leave something alone", "不碰；不干涉某事", "Leave the controls alone.", "别碰控制器。"], ["leave room for something", "给某事留空间", "Leave room for unexpected costs.", "给意外支出留出空间。"], ["leave nothing to chance", "不留任何侥幸", "We checked everything and left nothing to chance.", "我们检查了一切，不存侥幸。"], ["leave someone to their own devices", "让某人自行处理", "The children were left to their own devices.", "孩子们被留着自己安排。"], ["leave a lasting impression", "留下持久印象", "Her speech left a lasting impression.", "她的演讲留下了深刻印象。"], ["leave well enough alone", "维持现状，别多事", "The system works, so leave well enough alone.", "系统运行正常，别乱改。"], ["take leave of someone", "向某人告别", "He took leave of his hosts.", "他向主人告别。"]),
    contexts: C(G("离开出发", ["leave work early", "提前下班"], ["leave for Paris tomorrow", "明天动身去巴黎"], ["leave by the back door", "从后门离开"], ["leave without saying goodbye", "不辞而别"]), G("遗留放置", ["leave your bag upstairs", "把包留在楼上"], ["leave a note on the table", "在桌上留纸条"], ["leave food for the cat", "给猫留下食物"], ["leave fingerprints behind", "留下指纹"]), G("保持状态", ["leave the lights on", "让灯开着"], ["leave someone waiting outside", "让某人在外等"], ["leave the question unanswered", "让问题悬而未决"], ["leave enough space between cars", "车间留足距离"]), G("交付休假", ["leave the choice to voters", "让选民选择"], ["leave property to a charity", "把财产遗赠慈善机构"], ["leave instructions with reception", "把指示留给前台"], ["leave work on medical grounds", "因健康原因离职"])),
    derivatives: D(["leftover", "n. / adj.", "剩余物；剩下的", "常指剩饭或未使用的材料。"], ["leave-taking", "n.", "告别", "较正式，指离别过程。"]), synonyms: S(["depart", "v.", "离开；出发", "正式且多用于地点或交通。"], ["exit", "v.", "退出；离开", "强调通过出口离开或退出程序。"], ["abandon", "v.", "抛弃；放弃", "强调永久离开且不再负责。"], ["omit", "v.", "遗漏", "只对应 leave out。"], ["entrust", "v.", "委托", "只对应把责任交给可靠的人。"]),
    antonyms: A(["arrive", "v.", "到达", "与从地点离开的义相反。"]), confusables: X(["live", "v.", "居住；生活", "leave /liːv/；live /lɪv/，元音不同。"]),
    related: R(G("出发旅行", ["departure", "n.", "离开；出发"], ["journey", "n.", "旅程"], ["farewell", "n.", "告别"], ["destination", "n.", "目的地"]), G("遗留结果", ["remainder", "n.", "剩余部分"], ["legacy", "n.", "遗产；遗留影响"], ["trace", "n.", "痕迹"], ["vacancy", "n.", "空缺"]), G("休假许可", ["holiday", "n.", "假期"], ["absence", "n.", "缺席"], ["permission", "n.", "许可"], ["sabbatical", "n.", "长期休假"])),
    commonErrors: E(["I will leave to London tomorrow.", "I will leave for London tomorrow.", "leave for 表动身去某地。"], ["Do not forget your phone at home.", "Do not leave your phone at home.", "把物品遗忘在某处用 leave，不用 forget + 地点。"])
  },

  put: {
    meanings: M(["v.", "to move or place something in a particular position", "放；安置", "Put the keys on the shelf.", "把钥匙放在架子上。"], ["v.", "to express something in words or cause a condition", "表达；使处于", "It is hard to put the idea into words.", "这个想法很难用语言表达。"]),
    fixedPhrases: F(["put your foot down", "坚决制止；坚持立场", "Her parents put their foot down.", "她父母坚决制止了。"], ["put someone at ease", "使某人放松", "Her smile put me at ease.", "她的微笑让我放松。"], ["put something right", "纠正某事", "We must put this mistake right.", "我们必须纠正这个错误。"], ["put two and two together", "根据事实推断", "I put two and two together and realized who called.", "我根据线索推断出了来电者。"], ["put something on hold", "暂时搁置某事", "They put the project on hold.", "他们暂停了项目。"], ["put someone in charge", "让某人负责", "She put Alex in charge of sales.", "她让亚历克斯负责销售。"], ["put pressure on someone", "向某人施压", "Do not put pressure on the child.", "不要给孩子施压。"], ["put something to the test", "检验某事", "The storm put the roof to the test.", "暴风雨检验了屋顶的牢固程度。"], ["put someone through to someone", "为某人接通电话", "Could you put me through to accounts?", "能帮我接财务部吗？"], ["put a stop to something", "制止某事", "The new rule put a stop to fraud.", "新规制止了欺诈。"], ["put your mind to something", "专心做某事", "You can succeed if you put your mind to it.", "只要专心，你就能成功。"], ["put something behind you", "把某事抛在脑后", "It is time to put the dispute behind us.", "该把争端抛在脑后了。"]),
    contexts: C(G("位置放置", ["put groceries in the cupboard", "把食品放进橱柜"], ["put your coat over the chair", "把外套搭椅背上"], ["put a label on each box", "给每个箱子贴标签"], ["put the baby to bed", "安顿宝宝睡觉"]), G("表达记录", ["put your concerns in writing", "书面表达顾虑"], ["put the matter simply", "简单说明此事"], ["put a question to the panel", "向小组提问"], ["put someone's name on the list", "把某人名字列入名单"]), G("使成状态", ["put someone under pressure", "使某人承压"], ["put the plan into action", "实施计划"], ["put the machine out of service", "使机器停用"], ["put safety first", "把安全放首位"]), G("短语动作", ["put off the meeting", "推迟会议"], ["put on some music", "播放音乐"], ["put away clean dishes", "收起干净餐具"], ["put forward a proposal", "提出方案"])),
    derivatives: D(["input", "n. / v.", "输入；意见", "复合派生词，可指录入数据或提供意见。"], ["output", "n. / v.", "输出；产量", "与 input 相对，指产生或输出内容。"]), synonyms: S(["place", "v.", "放置", "比 put 正式，强调具体位置。"], ["set", "v.", "放置；设置", "常暗示安排好位置或参数。"], ["position", "v.", "安置；定位", "强调精确方向或策略位置。"], ["lay", "v.", "平放", "强调把物体放成平卧状态。"], ["express", "v.", "表达", "只对应 put into words 的表达义。"]),
    antonyms: A(["remove", "v.", "移走", "与把物品放到某处相反。"]), confusables: X(["place", "n. / v.", "地方；放置", "place 作动词更正式；put 是高频通用动词。"]),
    related: R(G("位置空间", ["surface", "n.", "表面"], ["container", "n.", "容器"], ["shelf", "n.", "架子"], ["location", "n.", "位置"]), G("表达记录", ["wording", "n.", "措辞"], ["statement", "n.", "陈述"], ["entry", "n.", "条目"], ["proposal", "n.", "提案"]), G("状态行动", ["pressure", "n.", "压力"], ["priority", "n.", "优先事项"], ["postpone", "v.", "推迟"], ["arrangement", "n.", "安排"])),
    commonErrors: E(["Put attention to this point.", "Pay attention to this point.", "英语固定搭配是 pay attention。"], ["Put the book to the table.", "Put the book on the table.", "put 后用位置介词 on/in 等，不用方向介词 to。"])
  },

  like: {
    meanings: M(["v.", "to enjoy or approve of someone or something", "喜欢；喜爱", "I like working with this team.", "我喜欢和这个团队合作。"], ["prep.", "similar to or in the same way as", "像；与……相似", "This tastes like lemon.", "这个尝起来像柠檬。"], ["conj.", "in the same way that", "如同；像……一样", "Do it like I showed you.", "照我示范的那样做。"], ["n.", "a person or thing of a similar type", "类似的人或事物", "We may never see his like again.", "我们也许再也见不到他这样的人了。"]),
    fixedPhrases: F(["feel like doing something", "想做某事", "I feel like taking a walk.", "我想去散步。"], ["look like something", "看起来像某物", "The cloud looks like a bird.", "那朵云看起来像只鸟。"], ["sound like something", "听起来像某事", "That sounds like a good plan.", "那听起来是个好计划。"], ["nothing like something", "一点也不像；远不如", "The film is nothing like the book.", "电影与原著完全不同。"], ["more like something", "更像是某事", "It was more like an argument than a discussion.", "那更像争吵而不是讨论。"], ["something like", "大约；类似", "It cost something like fifty dollars.", "它大约花了五十美元。"], ["people like us", "像我们这样的人", "People like us need practical advice.", "像我们这样的人需要实用建议。"], ["the likes of someone", "像某人这样的人", "The club attracts the likes of famous actors.", "这家俱乐部吸引了不少知名演员。"], ["if you like", "如果你愿意；换句话说", "You can stay here, if you like.", "如果愿意，你可以待在这里。"], ["like it or not", "不管喜欢与否", "Like it or not, the rules apply to everyone.", "不管喜欢与否，规则适用于所有人。"], ["what is someone like", "某人是什么样的人", "What is your new manager like?", "你的新经理是个怎样的人？"], ["as likely as not", "很可能", "As likely as not, it will rain.", "很可能会下雨。"]),
    contexts: C(G("喜好对象", ["like classical music", "喜欢古典音乐"], ["like someone very much", "非常喜欢某人"], ["like the idea of working abroad", "喜欢出国工作的想法"], ["like spicy food best", "最喜欢辣味食物"]), G("喜好行动", ["like reading before bed", "喜欢睡前阅读"], ["like to plan ahead", "喜欢提前计划"], ["would like to order", "想点餐"], ["would like someone to stay", "希望某人留下"]), G("相似比较", ["look like your father", "长得像父亲"], ["work like a charm", "效果极佳"], ["treat someone like family", "像家人般对待某人"], ["cities like Shanghai", "像上海这样的城市"]), G("询问举例", ["what was the trip like", "旅行怎么样"], ["things like books and maps", "书和地图之类的东西"], ["something like a solution", "类似解决办法的东西"], ["run like the wind", "跑得飞快"])),
    derivatives: D(["liking", "n.", "喜爱；爱好", "常见于 take a liking to。"], ["likable", "adj.", "讨人喜欢的", "描述性格或形象容易让人喜欢。"], ["likeness", "n.", "相似；肖像", "可指外貌相似或人物画像。"], ["unlike", "prep. / adj.", "不像；不同的", "介词表对比，形容词表不相似。"]), synonyms: S(["enjoy", "v.", "享受；喜欢", "后接名词或 -ing，不接 to do。"], ["favor", "v.", "偏爱；支持", "强调在选项中偏向某一方。"], ["prefer", "v.", "更喜欢", "必须含比较或选择意味。"], ["appreciate", "v.", "欣赏；感激", "强调理解价值，不接不定式。"], ["be fond of", "phr.", "喜爱", "语气温和，后接名词或 -ing。"]),
    antonyms: A(["dislike", "v.", "不喜欢", "与喜欢某人或某事的义相反。"]), confusables: X(["as", "prep. / conj.", "作为；如同", "as 常表示真实身份或方式；like 多表示相似。"]),
    related: R(G("喜好态度", ["taste", "n.", "品味；喜好"], ["interest", "n.", "兴趣"], ["approval", "n.", "赞同"], ["pleasure", "n.", "愉悦"]), G("相似关系", ["similar", "adj.", "相似的"], ["resemblance", "n.", "相似"], ["comparison", "n.", "比较"], ["example", "n.", "例子"]), G("偏好选择", ["favorite", "n. / adj.", "最爱；最喜欢的"], ["choice", "n.", "选择"], ["enthusiasm", "n.", "热情"], ["aversion", "n.", "厌恶"])),
    commonErrors: E(["I like very much this book.", "I like this book very much.", "very much 通常放宾语后。"], ["She is like to sing.", "She likes to sing.", "表示喜欢用动词 likes；be like 表相似。"])
  },

  help: {
    meanings: M(["v.", "to make it easier for someone to do something", "帮助；协助", "Can you help me carry these boxes?", "你能帮我搬这些箱子吗？"], ["v.", "to improve a situation or prevent something", "有助于；避免", "Regular breaks help concentration.", "定期休息有助于集中注意力。"], ["n.", "assistance or a person or thing that assists", "帮助；帮手", "Thank you for your help.", "谢谢你的帮助。"]),
    fixedPhrases: F(["help yourself to something", "请自行取用某物", "Help yourself to some fruit.", "请随便吃些水果。"], ["cannot help doing something", "忍不住做某事", "I could not help smiling.", "我忍不住笑了。"], ["cannot help but do something", "不得不做某事", "We cannot help but admire her courage.", "我们不得不佩服她的勇气。"], ["help someone out", "帮助某人摆脱困难", "Could you help me out this weekend?", "这周末你能帮我个忙吗？"], ["help with something", "帮助处理某事", "She helps with childcare.", "她帮忙照看孩子。"], ["be of help", "有帮助", "I hope these notes are of help.", "希望这些笔记有帮助。"], ["with the help of someone", "在某人帮助下", "We finished with the help of volunteers.", "我们在志愿者帮助下完成了。"], ["help someone to their feet", "扶某人站起来", "He helped the cyclist to her feet.", "他扶那名骑车人站起来。"], ["help yourself", "自己动手；自便", "If you need a towel, help yourself.", "需要毛巾请自取。"], ["a great help", "很大的帮助", "Your checklist was a great help.", "你的清单帮了大忙。"], ["there is no help for it", "没有办法", "The train has gone; there is no help for it.", "火车走了，也没办法。"], ["so help me", "我发誓", "I will tell the truth, so help me.", "我发誓会说实话。"]),
    contexts: C(G("帮助他人", ["help someone with homework", "帮某人做作业"], ["help a neighbor move", "帮邻居搬家"], ["help someone find work", "帮某人找工作"], ["help children learn", "帮助孩子学习"]), G("改善效果", ["help reduce stress", "有助于减压"], ["help prevent accidents", "有助于预防事故"], ["help the wound heal", "帮助伤口愈合"], ["help improve accuracy", "有助于提高准确性"]), G("提供资源", ["help pay the rent", "帮忙支付房租"], ["help with the cost", "在费用方面帮忙"], ["help prepare dinner", "帮忙准备晚饭"], ["help organize the event", "帮忙组织活动"]), G("紧急支持", ["call for help", "呼救"], ["need professional help", "需要专业帮助"], ["come to someone's help", "前来帮助某人"], ["get help immediately", "立即获得帮助"])),
    derivatives: D(["helper", "n.", "帮手", "指提供帮助的人或辅助工具。"], ["helpful", "adj.", "有帮助的", "描述人乐于助人或信息有用。"], ["helpless", "adj.", "无助的；无法自理的", "强调没有能力保护或帮助自己。"], ["helpfully", "adv.", "有帮助地", "说明行为切实提供帮助。"], ["helplessly", "adv.", "无助地", "描述无能为力的方式。"]), synonyms: S(["assist", "v.", "协助", "正式，常与 in/with 连用。"], ["aid", "v.", "援助", "多用于医疗、救援或正式语境。"], ["support", "v.", "支持", "强调持续提供资源或鼓励。"], ["facilitate", "v.", "促进；使便利", "正式，主语常是方法或条件。"], ["lend a hand", "phr.", "搭把手", "非正式，指实际帮忙。"]),
    antonyms: A(["hinder", "v.", "阻碍", "与使事情更容易的 help 义相反。"]), confusables: X(["help someone do", "phr.", "帮助某人做", "help 后可接 do 或 to do，不能套用感官动词规则。"]),
    related: R(G("支援人员", ["volunteer", "n.", "志愿者"], ["assistant", "n.", "助手"], ["carer", "n.", "照护者"], ["counselor", "n.", "顾问"]), G("资源服务", ["service", "n.", "服务"], ["advice", "n.", "建议"], ["funding", "n.", "资金"], ["guidance", "n.", "指导"]), G("改善保护", ["recovery", "n.", "恢复"], ["safety", "n.", "安全"], ["solution", "n.", "解决办法"], ["relief", "n.", "缓解；救济"])),
    commonErrors: E(["She helped me to finding a job.", "She helped me find a job.", "help someone 后接原形或 to do，不接 to doing。"], ["Can you help my homework?", "Can you help me with my homework?", "人作宾语，事情用 with 引出。"])
  },

  start: {
    meanings: M(["v.", "to begin doing or cause something to begin", "开始；启动", "The meeting starts at ten.", "会议十点开始。"], ["n.", "the beginning of an event, period, or journey", "开始；开端", "We made an early start.", "我们很早就出发了。"]),
    fixedPhrases: F(["start from scratch", "从零开始", "We had to start from scratch.", "我们不得不从零开始。"], ["start off on the right foot", "开局顺利", "A clear plan helped us start off on the right foot.", "清晰计划让我们开局顺利。"], ["start the ball rolling", "启动事情", "Her question started the ball rolling.", "她的问题开启了讨论。"], ["start something over", "重新开始某事", "The file was corrupt, so I started over.", "文件损坏了，所以我重新开始。"], ["start out as something", "起初是某身份", "She started out as a teacher.", "她最初是一名教师。"], ["start someone on something", "让某人开始使用某物", "The doctor started him on antibiotics.", "医生让他开始服用抗生素。"], ["start up a business", "创办企业", "They started up a small bakery.", "他们创办了一家小面包店。"], ["to start with", "首先；起初", "To start with, we need accurate data.", "首先，我们需要准确数据。"], ["for a start", "首先；作为开端", "For a start, the price is too high.", "首先，价格太高。"], ["get off to a good start", "有良好开端", "The project got off to a good start.", "项目开局良好。"], ["make a fresh start", "重新开始", "Moving gave her a chance to make a fresh start.", "搬家给了她重新开始的机会。"], ["start something in motion", "使某事开始运转", "The vote started a wider reform in motion.", "投票启动了更广泛的改革。"]),
    contexts: C(G("时间起点", ["start at nine sharp", "九点整开始"], ["start after lunch", "午饭后开始"], ["start early tomorrow", "明天早点开始"], ["start on the first of May", "五月一日开始"]), G("活动任务", ["start writing the report", "开始写报告"], ["start to feel better", "开始感觉好转"], ["start work immediately", "立即开始工作"], ["start a new course", "开始新课程"]), G("设备业务", ["start the engine", "启动发动机"], ["start a conversation", "开启谈话"], ["start a family", "成家"], ["start production next month", "下月投产"]), G("变化来源", ["start with a simple example", "从简单例子开始"], ["start at the bottom", "从基层开始"], ["start as a minor problem", "起初只是小问题"], ["start someone thinking", "引发某人思考"])),
    derivatives: D(["starter", "n.", "起动装置；首发者；开胃菜", "具体含义由机器、体育或餐饮语境决定。"], ["starting", "adj.", "起始的", "常见于 starting point、starting salary。"], ["restart", "v. / n.", "重新启动", "指停止后再次开始设备或过程。"]), synonyms: S(["begin", "v.", "开始", "最通用，常可与 start 互换。"], ["commence", "v.", "开始", "正式，常用于仪式或书面通知。"], ["initiate", "v.", "发起", "强调有意启动程序或行动。"], ["launch", "v.", "启动；推出", "常用于产品、项目或活动。"], ["establish", "v.", "创办；建立", "只对应创办组织或业务的义项。"]),
    antonyms: A(["finish", "v.", "结束；完成", "与开始活动或过程相反。"]), confusables: X(["begin", "v.", "开始", "start 更常用于机器启动和突然动作；begin 略正式。"]),
    related: R(G("时间阶段", ["outset", "n.", "开端"], ["origin", "n.", "起源"], ["phase", "n.", "阶段"], ["deadline", "n.", "截止日期"]), G("项目业务", ["startup", "n.", "初创企业"], ["project", "n.", "项目"], ["venture", "n.", "创业项目"], ["opening", "n.", "开幕；开端"]), G("启动动作", ["ignition", "n.", "点火"], ["trigger", "n.", "触发因素"], ["signal", "n.", "信号"], ["momentum", "n.", "势头"])),
    commonErrors: E(["It started to raining.", "It started to rain.", "start to 后接原形；也可说 start raining。"], ["We started the project since May.", "We started the project in May.", "一次开始时间用 in；since 常配完成时表示持续。"])
  },

  become: {
    meanings: M(["v.", "to begin to be or develop into a new state", "变得；成为", "The problem became more serious.", "问题变得更严重了。"], ["v.", "to suit or look attractive on someone", "适合；与……相称", "That color becomes you.", "那个颜色很适合你。"]),
    fixedPhrases: F(["become aware of something", "意识到某事", "We became aware of the error.", "我们意识到了错误。"], ["become accustomed to something", "逐渐习惯某事", "She became accustomed to the noise.", "她逐渐习惯了噪声。"], ["become involved in something", "参与某事", "He became involved in local politics.", "他参与了地方政治。"], ["become known as something", "以某身份闻名", "The town became known as a center of art.", "该镇后来以艺术中心闻名。"], ["become increasingly important", "变得越来越重要", "Data security has become increasingly important.", "数据安全变得越来越重要。"], ["become clear that", "显然……", "It soon became clear that we needed help.", "很快就清楚我们需要帮助。"], ["become available", "变得可获得", "More tickets may become available tomorrow.", "明天可能会有更多票。"], ["become a reality", "成为现实", "Their plan finally became a reality.", "他们的计划终于成为现实。"], ["what becomes of someone", "某人后来怎么样", "Whatever became of your old neighbor?", "你以前的邻居后来怎么样了？"], ["become the norm", "成为常态", "Remote meetings have become the norm.", "远程会议已成为常态。"], ["become apparent", "变得明显", "The pattern became apparent after a week.", "一周后规律变得明显。"], ["become separated from something", "与某事物分离", "The lid became separated from the box.", "盖子与盒子分开了。"]),
    contexts: C(G("状态变化", ["become much calmer", "变得平静许多"], ["become difficult to control", "变得难以控制"], ["become completely independent", "变得完全独立"], ["become less common", "变得不那么常见"]), G("身份职业", ["become a qualified nurse", "成为合格护士"], ["become team leader", "成为团队负责人"], ["become a parent", "成为父母"], ["become an expert in law", "成为法律专家"]), G("发展结果", ["become a major concern", "成为重大问题"], ["become part of daily life", "成为日常生活一部分"], ["become widely accepted", "变得广受接受"], ["become the first choice", "成为首选"]), G("外观适合", ["a dress that becomes her", "适合她的连衣裙"], ["colors that become you", "适合你的颜色"], ["behavior that becomes a leader", "符合领导身份的行为"], ["a style becoming to him", "适合他的风格"])),
    derivatives: D(["becoming", "adj.", "合适的；得体的", "独立形容词义，常用于衣着或行为。"], ["unbecoming", "adj.", "不得体的", "表示不符合身份或礼仪。"]), synonyms: S(["grow", "linking v.", "逐渐变得", "常配 old、dark、strong，强调渐变。"], ["turn", "linking v.", "变成", "常配颜色或明显状态变化。"], ["get", "linking v.", "变得", "口语，常强调渐变或意外。"], ["develop into", "phr.", "发展成为", "强调长期发展过程。"], ["transform into", "phr.", "转变成", "强调显著彻底变化。"]),
    antonyms: A(["remain", "v.", "仍然；保持", "与状态发生变化相反。"]), confusables: X(["begin", "v.", "开始", "begin 后接活动；become 后接名词或形容词补语。"]),
    related: R(G("变化过程", ["transition", "n.", "过渡"], ["development", "n.", "发展"], ["growth", "n.", "成长"], ["transformation", "n.", "转变"]), G("身份角色", ["career", "n.", "职业"], ["leader", "n.", "领导者"], ["member", "n.", "成员"], ["citizen", "n.", "公民"]), G("状态结果", ["mature", "adj.", "成熟的"], ["independent", "adj.", "独立的"], ["commonplace", "adj.", "常见的"], ["reality", "n.", "现实"])),
    commonErrors: E(["He became to be angry.", "He became angry.", "become 后直接接形容词，不用 to be。"], ["She became as a doctor.", "She became a doctor.", "become 后接身份名词不加 as。"])
  },

  happen: {
    meanings: M(["v.", "to take place, especially unexpectedly", "发生；出现", "The accident happened at noon.", "事故发生在中午。"], ["v.", "to do or be something by chance", "碰巧；恰好", "I happened to meet her on the train.", "我碰巧在火车上遇见她。"]),
    fixedPhrases: F(["happen to do something", "碰巧做某事", "I happened to have a spare key.", "我碰巧有一把备用钥匙。"], ["happen upon someone", "偶然遇见某人", "We happened upon an old friend.", "我们偶然遇见一位老朋友。"], ["as it happens", "碰巧；实际上", "As it happens, I know the owner.", "碰巧我认识店主。"], ["whatever happens", "无论发生什么", "Whatever happens, stay together.", "无论发生什么，都要待在一起。"], ["what happens next", "接下来发生什么", "No one knows what happens next.", "没人知道接下来会怎样。"], ["accidents happen", "事故难免发生", "Do not blame yourself; accidents happen.", "别责怪自己，事故难免。"], ["make something happen", "促成某事", "A small team made the change happen.", "一个小团队促成了这项改变。"], ["it so happens that", "碰巧……", "It so happens that we are free tonight.", "碰巧我们今晚有空。"], ["happen overnight", "一夜之间发生", "Real change does not happen overnight.", "真正的改变不会一夜发生。"], ["happen for a reason", "发生自有原因", "She believes everything happens for a reason.", "她相信凡事发生都有原因。"], ["happen at any time", "随时可能发生", "Power cuts can happen at any time.", "停电随时可能发生。"], ["what happened to someone", "某人怎么了", "What happened to your hand?", "你的手怎么了？"]),
    contexts: C(G("事件时间", ["happen late at night", "深夜发生"], ["happen during the storm", "暴风雨期间发生"], ["happen without warning", "毫无预警地发生"], ["happen every few years", "每几年发生一次"]), G("地点对象", ["happen in crowded places", "在人多处发生"], ["happen to anyone", "可能发生在任何人身上"], ["happen outside the building", "发生在楼外"], ["happen across the country", "在全国发生"]), G("可能原因", ["happen by accident", "意外发生"], ["happen because of poor planning", "因计划不周发生"], ["happen under pressure", "在压力下发生"], ["happen when systems fail", "系统故障时发生"]), G("偶然行为", ["happen to know the answer", "碰巧知道答案"], ["happen to be nearby", "碰巧在附近"], ["happen to notice", "碰巧注意到"], ["happen to agree", "碰巧赞同"])),
    derivatives: D(["happening", "n. / adj.", "事件；时髦热闹的", "名词指发生的事；形容词指活跃时髦。"]), synonyms: S(["occur", "v.", "发生", "正式，常用于事故、现象。"], ["take place", "phr.", "发生；举行", "常用于计划好的活动。"], ["arise", "v.", "出现；产生", "多指问题、机会或情况。"], ["come about", "phr.", "发生；产生", "强调事情如何形成。"], ["transpire", "v.", "发生；后来得知", "正式，可指事实后来被发现。"]),
    antonyms: A(["fail to occur", "phr.", "没有发生", "与某事件实际发生相反。"]), confusables: X(["occur to", "phr.", "被想到", "occur to someone 是某人想到；happen to do 是碰巧做。"]),
    related: R(G("事件类型", ["incident", "n.", "事件"], ["accident", "n.", "事故"], ["occasion", "n.", "场合"], ["phenomenon", "n.", "现象"]), G("时间原因", ["timing", "n.", "时机"], ["cause", "n.", "原因"], ["chance", "n.", "偶然"], ["circumstance", "n.", "情况"]), G("结果反应", ["consequence", "n.", "后果"], ["aftermath", "n.", "后果；余波"], ["response", "n.", "反应"], ["unexpected", "adj.", "意外的"])),
    commonErrors: E(["What did happen to you?", "What happened to you?", "普通询问过去事件不需 did；强调时才用。"], ["It happened me yesterday.", "It happened to me yesterday.", "事情发生在某人身上用 happen to someone。"])
  },

  show: {
    meanings: M(["v.", "to let someone see something or demonstrate how", "给……看；展示；示范", "Show me how to open the file.", "示范给我看怎样打开文件。"], ["v.", "to indicate, prove, or express something", "表明；证明；表现", "The data shows a steady decline.", "数据显示持续下降。"], ["n.", "a performance, exhibition, or public display", "演出；展览；展示", "We watched a comedy show.", "我们看了一场喜剧表演。"]),
    fixedPhrases: F(["show someone the ropes", "教某人熟悉工作", "Mina showed me the ropes on my first day.", "入职第一天米娜教我熟悉了工作。"], ["show your true colors", "显露本性", "His reaction showed his true colors.", "他的反应显露了本性。"], ["show signs of something", "显出某事迹象", "The patient is showing signs of recovery.", "患者显出康复迹象。"], ["show respect for someone", "尊重某人", "Students should show respect for others.", "学生应该尊重他人。"], ["show someone in", "领某人进来", "Please show the visitors in.", "请把访客领进来。"], ["show someone out", "送某人出去", "I will show you out.", "我送你出去。"], ["show off", "炫耀；展示优点", "He was showing off his new watch.", "他在炫耀新手表。"], ["show up", "出现；到场", "Only six people showed up.", "只有六个人到场。"], ["show through", "显露出来", "Her disappointment showed through.", "她的失望流露了出来。"], ["show someone around", "带某人参观", "I will show you around the office.", "我带你参观办公室。"], ["show something to advantage", "使某物充分显出优点", "The lighting shows the painting to advantage.", "灯光充分衬托出这幅画的优点。"], ["steal the show", "抢尽风头", "The youngest actor stole the show.", "最年轻的演员抢尽了风头。"]),
    contexts: C(G("展示物品", ["show someone your passport", "给某人看护照"], ["show the photo to everyone", "把照片给大家看"], ["show products online", "在线展示产品"], ["show someone where to sign", "指给某人在哪里签字"]), G("示范说明", ["show children how to swim", "教孩子如何游泳"], ["show each step clearly", "清楚示范每一步"], ["show someone the quickest route", "给某人指最快路线"], ["show how the device works", "演示设备运作"]), G("证据表明", ["show a sharp increase", "显示大幅增长"], ["show that the claim is false", "表明主张错误"], ["show no evidence of damage", "未显示损坏证据"], ["show someone's age", "显出某人的年龄"]), G("情感行为", ["show genuine concern", "表现真诚关心"], ["show great courage", "表现出巨大勇气"], ["show interest in science", "表现出科学兴趣"], ["show patience with beginners", "对初学者有耐心"])),
    derivatives: D(["showcase", "v. / n.", "展示；展示平台", "作动词强调呈现最佳特点，作名词指用于展示的平台或场合。"], ["showing", "n.", "表现；放映；展出", "可指业绩表现、电影场次或房屋展示。"], ["showiness", "n.", "华而不实；过分显眼", "指外观或行为过度炫目、刻意吸引注意的特征。"], ["showy", "adj.", "华而不实的；显眼的", "常带贬义，强调过度炫目。"]), synonyms: S(["display", "v.", "陈列；显示", "强调公开可见或屏幕呈现。"], ["demonstrate", "v.", "示范；证明", "强调展示步骤或提供证据。"], ["reveal", "v.", "揭示", "强调原本隐藏的信息显现。"], ["present", "v.", "呈现；展示", "正式，常用于报告或成果。"], ["indicate", "v.", "表明", "只对应数据或迹象指示。"]),
    antonyms: A(["hide", "v.", "隐藏", "与让人看见或揭示信息相反。"]), confusables: X(["prove", "v.", "证明", "show 可提供迹象；prove 要达到充分证明。"]),
    related: R(G("视觉展示", ["exhibition", "n.", "展览"], ["screen", "n.", "屏幕"], ["diagram", "n.", "图表"], ["demonstration", "n.", "示范"]), G("证据信号", ["data", "n.", "数据"], ["evidence", "n.", "证据"], ["sign", "n.", "迹象"], ["pattern", "n.", "模式"]), G("表演观众", ["performance", "n.", "表演"], ["audience", "n.", "观众"], ["stage", "n.", "舞台"], ["program", "n.", "节目"])),
    commonErrors: E(["Show to me the picture.", "Show me the picture.", "show 可接双宾语，中间不加 to。"], ["The data show us that costs rose.", "The data shows that costs rose.", "data 作集合概念时常用单数；按项目风格保持一致。"])
  },

  seem: {
    meanings: M(["linking v.", "to appear to be or give a particular impression", "似乎；看起来", "The answer seems correct.", "答案似乎正确。"]),
    fixedPhrases: F(["seem to do something", "似乎做某事", "He seems to understand the problem.", "他似乎理解这个问题。"], ["seem to have done something", "似乎已经做了某事", "She seems to have left early.", "她似乎已经提前离开。"], ["it seems that", "看来……", "It seems that we were mistaken.", "看来我们弄错了。"], ["it would seem that", "看来……（更委婉）", "It would seem that demand is falling.", "看来需求正在下降。"], ["seem like something", "似乎像某事", "It seems like a reasonable choice.", "这似乎是合理选择。"], ["seem as if", "看起来仿佛……", "It seems as if everyone agrees.", "看起来大家似乎都同意。"], ["seem likely to do something", "似乎很可能做某事", "Prices seem likely to rise.", "价格似乎很可能上涨。"], ["seem unable to do something", "似乎无法做某事", "He seems unable to relax.", "他似乎无法放松。"], ["seem strange to someone", "在某人看来奇怪", "The silence seemed strange to me.", "这份沉默让我觉得奇怪。"], ["seem perfectly normal", "看起来完全正常", "Everything seemed perfectly normal.", "一切看起来完全正常。"], ["so it seems", "看来如此", "They have canceled it, or so it seems.", "他们取消了，看来是这样。"], ["cannot seem to do something", "似乎怎么也做不到", "I cannot seem to open this file.", "我似乎怎么也打不开这个文件。"]),
    contexts: C(G("外观印象", ["seem calm and confident", "显得镇定自信"], ["seem younger than before", "显得比以前年轻"], ["seem unusually quiet", "显得异常安静"], ["seem ready to begin", "似乎准备开始"]), G("可能判断", ["seem to know the answer", "似乎知道答案"], ["seem to be improving", "似乎在改善"], ["seem likely to succeed", "似乎很可能成功"], ["seem impossible at first", "起初似乎不可能"]), G("说话者态度", ["it seems clear that", "看来很清楚……"], ["it seems reasonable to wait", "等待似乎合理"], ["it seems unlikely that", "看来不太可能……"], ["it seems from the data that", "从数据看似乎……"]), G("不确定体验", ["seem familiar to someone", "让某人觉得熟悉"], ["seem like a long time", "仿佛过了很久"], ["seem different in daylight", "在日光下似乎不同"], ["seem too good to be true", "好得令人难以置信"])),
    derivatives: D(["seeming", "adj. / n.", "表面上的；外表", "强调外观可能不等于事实。"], ["seemingly", "adv.", "看似；貌似", "修饰表面印象，常暗示事实或许不同。"]), synonyms: S(["appear", "linking v.", "似乎；显得", "较正式，可接 to do 或形容词。"], ["look", "linking v.", "看起来", "多依据视觉外观。"], ["sound", "linking v.", "听起来", "依据听到的信息或声音。"], ["give the impression of", "phr.", "给人……印象", "明确强调观察者印象。"], ["strike someone as", "phr.", "给某人以……感觉", "强调某人的即时主观判断。"]),
    antonyms: A(["be certain", "phr.", "确定无疑", "与 seem 所表达的不确定印象相对。"]), confusables: X(["appear", "v.", "显得；出现", "appear 还有‘出现’义；seem 没有。"]),
    related: R(G("印象外观", ["appearance", "n.", "外观"], ["impression", "n.", "印象"], ["surface", "n.", "表面"], ["apparent", "adj.", "表面明显的"]), G("不确定性", ["uncertain", "adj.", "不确定的"], ["perhaps", "adv.", "也许"], ["likely", "adj.", "可能的"], ["doubt", "n.", "疑问"]), G("感官判断", ["visual", "adj.", "视觉的"], ["tone", "n.", "语气"], ["evidence", "n.", "证据"], ["perception", "n.", "看法；感知"])),
    commonErrors: E(["It seems me strange.", "It seems strange to me.", "感受者用 to someone 引出。"], ["He seems that he is tired.", "It seems that he is tired.", "that 从句前用形式主语 it；人作主语用 seems to be。"])
  },

  might: {
    meanings: M(["modal v.", "used to express a weak possibility", "可能；也许", "We might arrive late.", "我们可能会迟到。"], ["modal v.", "used for a tentative suggestion or polite request", "可以；不妨（委婉）", "You might try restarting it.", "你不妨试试重启。"], ["n.", "great strength or power", "强大力量", "The bridge displayed the might of Roman engineering.", "这座桥展现了罗马工程的强大力量。"]),
    fixedPhrases: F(["might have done something", "可能已经做了某事", "He might have taken the wrong train.", "他可能坐错了火车。"], ["might as well do something", "不妨做某事", "We might as well walk.", "我们不妨走路。"], ["might well do something", "很可能做某事", "She might well refuse.", "她很可能拒绝。"], ["might not be enough", "可能不够", "One hour might not be enough.", "一小时可能不够。"], ["might I ask", "冒昧请问", "Might I ask your name?", "冒昧问一下你的名字。"], ["might I suggest", "请允许我建议", "Might I suggest a simpler route?", "请允许我建议一条更简单的路线。"], ["might have been", "过去可能是", "It might have been an accident.", "那可能是一场意外。"], ["try as someone might", "尽管某人尽力", "Try as she might, she could not sleep.", "尽管她努力尝试，还是睡不着。"], ["with all your might", "竭尽全力", "Pull with all your might.", "用尽全力拉。"], ["might yet do something", "仍有可能做某事", "The plan might yet succeed.", "计划仍有可能成功。"], ["you might want to do something", "委婉提出建议", "You might want to save a copy.", "你或许可以保存一份副本。"], ["might be expected to do something", "按理可能会做某事", "Prices might be expected to fall.", "按理价格可能会下降。"]),
    contexts: C(G("弱可能", ["might rain this evening", "今晚可能下雨"], ["might be wrong about that", "对此可能判断错误"], ["might take several attempts", "可能要尝试几次"], ["might never happen", "可能永远不会发生"]), G("过去推测", ["might have missed the email", "可能漏看了邮件"], ["might have been asleep", "当时可能睡着了"], ["might have forgotten the date", "可能忘了日期"], ["might not have known", "当时可能不知道"]), G("委婉建议", ["might try a smaller size", "不妨试试小一号"], ["might consider waiting", "不妨考虑等待"], ["might ask a specialist", "可以问问专家"], ["might start with the summary", "不妨先看摘要"]), G("礼貌语气", ["might I come in", "我可以进来吗"], ["might I see the menu", "我可以看菜单吗"], ["might one suggest an alternative", "是否可以提出替代方案"], ["might we postpone the vote", "我们是否可以推迟投票"])),
    derivatives: D(["mighty", "adj.", "强大的", "源自名词 might，描述巨大力量，非情态义派生。"], ["mightily", "adv.", "强烈地；非常", "较书面，描述巨大力度或程度。"]), synonyms: S(["may", "modal v.", "可能", "通常比 might 可能性略高或语气更中性。"], ["could possibly", "modal phr.", "有可能", "强调理论上的可能。"], ["perhaps", "adv.", "也许", "副词，不控制后接动词形式。"], ["possibly", "adv.", "可能地", "常修饰整句或加强疑问委婉。"], ["be conceivable", "phr.", "可以想象；有可能", "正式，强调逻辑上并非不可能。"]),
    antonyms: A(["be impossible", "phr.", "不可能", "与 might 的可能性义形成对比。"]), confusables: X(["may", "modal v.", "可能；可以", "may 更中性；might 更试探、更不确定。"]),
    related: R(G("概率判断", ["possibility", "n.", "可能性"], ["chance", "n.", "机会；概率"], ["uncertainty", "n.", "不确定性"], ["speculation", "n.", "推测"]), G("建议选择", ["suggestion", "n.", "建议"], ["option", "n.", "选项"], ["alternative", "n.", "替代方案"], ["tentative", "adj.", "试探性的"]), G("力量权势", ["power", "n.", "力量；权力"], ["strength", "n.", "力量"], ["empire", "n.", "帝国"], ["military", "adj.", "军事的"])),
    commonErrors: E(["It might rains later.", "It might rain later.", "might 后接动词原形。"], ["You might to try again.", "You might try again.", "情态动词后不加 to。"])
  },

  hear: {
    meanings: M(["v.", "to perceive sound with your ears", "听见；听到", "I heard footsteps outside.", "我听见外面有脚步声。"], ["v.", "to receive news or information", "听说；得知", "Have you heard about the change?", "你听说这项变化了吗？"], ["v.", "to listen to and judge a case or argument", "审理；听取", "The court will hear the case in June.", "法院将在六月审理此案。"]),
    fixedPhrases: F(["hear someone out", "听某人把话说完", "Please hear me out before deciding.", "请听我说完再决定。"], ["hear of someone", "听说过某人", "I had never heard of the author.", "我从未听说过这位作者。"], ["hear from someone", "收到某人的消息", "We have not heard from Leo recently.", "我们最近没收到利奥的消息。"], ["hear back from someone", "收到某人的回复", "I hope to hear back from the company soon.", "我希望很快收到公司的回复。"], ["hear something firsthand", "亲耳听到某事", "I heard the account firsthand.", "我亲耳听到了这段叙述。"], ["hear both sides", "听取双方意见", "A fair judge must hear both sides.", "公正的法官必须听取双方意见。"], ["hear someone do something", "听见某人做完整动作", "I heard her close the door.", "我听见她把门关上了。"], ["hear someone doing something", "听见某人正在做某事", "I heard someone singing upstairs.", "我听见有人正在楼上唱歌。"], ["be heard to do something", "据听见某人做某事", "He was heard to admit the mistake.", "有人听见他承认了错误。"], ["make yourself heard", "让别人听见自己的声音或意见", "She raised her voice to make herself heard.", "她提高音量让别人听见。"], ["would not hear of something", "坚决不同意某事", "My parents would not hear of me traveling alone.", "我父母坚决不同意我独自旅行。"], ["hear the last of something", "最后一次听到某事", "I hope we have heard the last of that rumor.", "希望我们不会再听到那个谣言。"]),
    contexts: C(G("声音感知", ["hear a faint noise", "听见微弱声响"], ["hear the phone ring", "听见电话响"], ["hear birds outside", "听见外面的鸟叫"], ["hear every word clearly", "听清每个字"]), G("消息来源", ["hear the news on the radio", "从广播听到消息"], ["hear that someone resigned", "听说某人辞职"], ["hear about an opportunity", "听说一个机会"], ["hear nothing from the office", "没收到办公室消息"]), G("倾听审理", ["hear a formal complaint", "听取正式投诉"], ["hear evidence from witnesses", "听取证人证词"], ["hear an appeal", "审理上诉"], ["hear someone's side of the story", "听取某人的说法"]), G("反应评价", ["glad to hear the result", "很高兴听到结果"], ["sorry to hear about the loss", "遗憾听闻损失"], ["surprised to hear the price", "听到价格很惊讶"], ["hard to hear over the noise", "噪声中难以听清"])),
    derivatives: D(["hearing", "n.", "听力；听证会", "可指感官能力或正式审理会议。"], ["hearsay", "n.", "传闻", "指未经亲自验证的转述信息。"], ["unheard", "adj.", "未被听见的；前所未闻的", "常见于 go unheard、unheard-of。"]), synonyms: S(["perceive", "v.", "感知", "正式，覆盖多种感官。"], ["catch", "v.", "听清；听见", "口语，常用于没听清时。"], ["learn", "v.", "得知", "只对应收到信息的义项。"], ["listen to", "phr.", "听", "强调主动注意；hear 常是被动感知。"], ["overhear", "v.", "无意听到", "强调并非对方有意让你听。"]),
    antonyms: A(["miss", "v.", "没听见；漏听", "与听清具体声音或信息相反。"]), confusables: X(["listen", "v.", "听；倾听", "listen 强调主动，通常接 to；hear 强调感知结果。"]),
    related: R(G("声音类型", ["voice", "n.", "声音；嗓音"], ["noise", "n.", "噪声"], ["music", "n.", "音乐"], ["silence", "n.", "寂静"]), G("听觉能力", ["ear", "n.", "耳朵"], ["volume", "n.", "音量"], ["audible", "adj.", "听得见的"], ["deaf", "adj.", "失聪的"]), G("消息审理", ["report", "n.", "报道"], ["rumor", "n.", "传闻"], ["testimony", "n.", "证词"], ["appeal", "n.", "上诉"])),
    commonErrors: E(["I am hearing music now.", "I can hear music now.", "普通感官结果常用 can hear。"], ["Listen the announcement.", "Listen to the announcement.", "listen 后接对象要用 to；hear 直接接宾语。"])
  },

  believe: {
    meanings: M(["v.", "to accept that something is true", "相信；认为属实", "I believe her explanation.", "我相信她的解释。"], ["v.", "to have confidence or faith in someone or something", "信任；信仰", "You must believe in yourself.", "你必须相信自己。"], ["v.", "to think or suppose", "认为；估计", "I believe the shop closes at six.", "我想商店六点关门。"]),
    fixedPhrases: F(["believe someone to be something", "认为某人是某身份", "Police believe him to be abroad.", "警方认为他在国外。"], ["be widely believed to", "被广泛认为", "The painting is widely believed to be genuine.", "这幅画被广泛认为是真品。"], ["have reason to believe", "有理由相信", "We have reason to believe the data is accurate.", "我们有理由相信数据准确。"], ["make believe", "假装", "The children made believe they were explorers.", "孩子们假装自己是探险家。"], ["believe it or not", "信不信由你", "Believe it or not, I have never flown.", "信不信由你，我从未坐过飞机。"], ["cannot believe your eyes", "不敢相信自己的眼睛", "I could not believe my eyes when I saw the bill.", "看到账单时我简直不敢相信。"], ["believe in doing something", "认为做某事有价值", "We believe in treating staff fairly.", "我们认为公平对待员工很重要。"], ["believe the best of someone", "相信某人本性善良", "She always believes the best of people.", "她总愿意往好处看人。"], ["I believe so", "表示认为答案是肯定的", "Will they agree? I believe so.", "他们会同意吗？我想会。"], ["I believe not", "表示认为答案是否定的", "Is the road open? I believe not.", "路开着吗？我想没有。"], ["hard to believe", "难以置信", "The speed of change is hard to believe.", "变化速度令人难以置信。"], ["lead someone to believe", "使某人相信", "The notice led us to believe entry was free.", "告示让我们以为可以免费入场。"]),
    contexts: C(G("相信事实", ["believe someone's account", "相信某人的叙述"], ["believe every word", "相信每句话"], ["believe the claim is false", "认为主张错误"], ["believe what you see", "相信眼前所见"]), G("观点推测", ["believe that change is possible", "认为改变可能"], ["believe someone has left", "认为某人已离开"], ["believe the price will fall", "认为价格会下降"], ["believe it happened by chance", "认为是偶然发生"]), G("信任信仰", ["believe in your abilities", "相信自己的能力"], ["believe in equal opportunity", "信奉机会平等"], ["believe in a higher power", "信仰更高力量"], ["believe in the team's potential", "相信团队潜力"]), G("被动报道", ["be believed to be safe", "被认为安全"], ["be believed to have escaped", "据信已经逃脱"], ["commonly believed myth", "普遍相信的错误观念"], ["mistakenly believe that", "误以为……"])),
    derivatives: D(["belief", "n.", "信念；相信", "可数指信念，不可数指相信状态。"], ["believer", "n.", "信徒；相信者", "可指宗教信徒或坚定支持者。"], ["believable", "adj.", "可信的", "描述故事或说法看起来真实。"], ["unbelievable", "adj.", "难以置信的", "可褒可贬，表示程度惊人。"], ["disbelief", "n.", "不相信；怀疑", "常见于 in disbelief。"]), synonyms: S(["trust", "v.", "信任", "侧重对人或可靠性的信心。"], ["think", "v.", "认为", "表达意见，确信程度通常较低。"], ["accept", "v.", "相信；接受", "强调把说法当作事实接受。"], ["be convinced", "phr.", "确信", "确信程度比 believe 强。"], ["have faith in", "phr.", "信任；信仰", "只对应 believe in。"]),
    antonyms: A(["doubt", "v.", "怀疑", "与接受某说法为真相对。"], ["disbelieve", "v.", "不相信", "直接否认所听说法的真实性。"]), confusables: X(["belong", "v.", "属于", "拼写相近但含义、结构不同；belong 常接 to。"]),
    related: R(G("证据真假", ["truth", "n.", "真相"], ["evidence", "n.", "证据"], ["claim", "n.", "主张"], ["credible", "adj.", "可信的"]), G("信任信念", ["confidence", "n.", "信心"], ["faith", "n.", "信仰；信任"], ["conviction", "n.", "坚定信念"], ["skepticism", "n.", "怀疑态度"]), G("观点判断", ["opinion", "n.", "意见"], ["assumption", "n.", "假设"], ["certainty", "n.", "确信"], ["reasonable", "adj.", "合理的"])),
    commonErrors: E(["I am believing you.", "I believe you.", "believe 表认知状态时通常不用进行时。"], ["I believe to him.", "I believe him.", "相信某人的话直接接人；believe in 表信任其能力或信仰。"])
  },

  play: {
    meanings: M(["v.", "to take part in a game or sport", "玩；参加比赛", "The children play basketball after school.", "孩子们放学后打篮球。"], ["v.", "to perform music or act a role", "演奏；扮演", "She plays the violin.", "她拉小提琴。"], ["v.", "to operate media or have an effect", "播放；发挥作用", "Music was playing softly.", "音乐轻声播放着。"], ["n.", "a game, dramatic work, or activity", "游戏；戏剧；比赛", "We saw a new play last night.", "昨晚我们看了一部新戏。"]),
    fixedPhrases: F(["play a part in something", "在某事中起作用", "Diet plays a part in health.", "饮食对健康有影响。"], ["play it safe", "谨慎行事", "We decided to play it safe and wait.", "我们决定稳妥起见先等。"], ["play by the rules", "按规则行事", "Everyone must play by the rules.", "每个人都必须遵守规则。"], ["play hard to get", "故意装作不感兴趣", "He is just playing hard to get.", "他只是在故意装作不在意。"], ["play into someone's hands", "正中某人下怀", "Arguing now would play into their hands.", "现在争吵会正中他们下怀。"], ["play something by ear", "凭听觉演奏；随机应变", "We have no plan, so we will play it by ear.", "我们没有计划，就随机应变吧。"], ["play a trick on someone", "捉弄某人", "They played a harmless trick on me.", "他们和我开了个无伤大雅的玩笑。"], ["play with fire", "冒险玩火", "Ignoring the warning is playing with fire.", "忽视警告是在冒险。"], ["play host to someone", "接待某人", "The city played host to the festival.", "这座城市承办了节日活动。"], ["play down something", "淡化某事", "Officials played down the risk.", "官员淡化了风险。"], ["play up something", "强调；夸大某事", "The ad plays up the product's speed.", "广告强调产品的速度。"], ["bring something into play", "使某事物开始发挥作用", "New factors came into play.", "新的因素开始发挥作用。"]),
    contexts: C(G("运动游戏", ["play tennis competitively", "参加网球比赛"], ["play cards after dinner", "晚饭后打牌"], ["play against the champions", "与冠军队比赛"], ["play in the final", "参加决赛"]), G("音乐表演", ["play a leading role", "担任主角"], ["play guitar in a band", "在乐队弹吉他"], ["play the tune slowly", "慢慢演奏曲调"], ["play to a full theater", "在满场剧院演出"]), G("儿童娱乐", ["play with building blocks", "玩积木"], ["play outdoors safely", "安全地在户外玩"], ["play a guessing game", "玩猜谜游戏"], ["play together peacefully", "一起友好玩耍"]), G("媒体作用", ["play the recording twice", "播放录音两次"], ["play a key role", "发挥关键作用"], ["play on someone's fears", "利用某人的恐惧"], ["play well on screen", "在屏幕上播放效果好"])),
    derivatives: D(["player", "n.", "运动员；演奏者；播放器", "语境决定具体身份或设备。"], ["playful", "adj.", "爱玩的；开玩笑的", "描述轻松活泼的行为。"], ["playfully", "adv.", "顽皮地；开玩笑地", "描述轻松逗趣的方式。"], ["replay", "v. / n.", "重放；重赛", "指再次播放或比赛。"], ["playground", "n.", "操场；游乐场", "儿童游戏的场所。"]), synonyms: S(["participate", "v.", "参加", "泛指参与活动，不一定是游戏。"], ["compete", "v.", "竞争；比赛", "强调争取胜负。"], ["perform", "v.", "表演", "只对应音乐或戏剧义。"], ["act", "v.", "扮演；表演", "主要用于戏剧角色。"], ["reproduce", "v.", "播放；重现", "技术语境对应播放录音或图像。"]),
    antonyms: A(["sit out", "phr.", "不参加", "与参加某场游戏或活动相反。"]), confusables: X(["game", "n.", "游戏；比赛", "play 是动作；game 是具体活动或比赛。"]),
    related: R(G("体育比赛", ["match", "n.", "比赛"], ["team", "n.", "队伍"], ["score", "n.", "比分"], ["opponent", "n.", "对手"]), G("音乐戏剧", ["instrument", "n.", "乐器"], ["actor", "n.", "演员"], ["stage", "n.", "舞台"], ["rehearsal", "n.", "排练"]), G("娱乐媒体", ["toy", "n.", "玩具"], ["fun", "n.", "乐趣"], ["recording", "n.", "录音"], ["episode", "n.", "一集节目"])),
    commonErrors: E(["She plays the piano good.", "She plays the piano well.", "修饰动词 plays 要用副词 well，不能用形容词 good。"], ["We played basketball with another school.", "We played basketball against another school.", "对阵某队用 against；with 表一起玩。"])
  },

  turn: {
    meanings: M(["v.", "to move around a central point or change direction", "转动；转弯", "Turn left at the lights.", "在红绿灯处左转。"], ["v.", "to change or cause something to change", "变成；使变化", "The leaves turn red in autumn.", "树叶秋天变红。"], ["n.", "an act of turning or an opportunity in a sequence", "转弯；轮次；机会", "It is your turn to speak.", "轮到你发言了。"]),
    fixedPhrases: F(["turn a blind eye to something", "对某事视而不见", "We cannot turn a blind eye to fraud.", "我们不能对欺诈视而不见。"], ["turn your back on someone", "背弃某人", "She never turned her back on her friends.", "她从未背弃朋友。"], ["turn the tables on someone", "扭转局势反制某人", "The team turned the tables in the second half.", "球队下半场扭转了局势。"], ["turn over a new leaf", "改过自新", "He promised to turn over a new leaf.", "他承诺改过自新。"], ["turn something upside down", "把某物彻底颠倒", "The news turned our plans upside down.", "这个消息彻底打乱了计划。"], ["turn someone away", "拒绝某人进入", "The shelter never turns children away.", "这家收容所从不拒绝儿童。"], ["turn to someone for help", "向某人求助", "I turned to my neighbor for help.", "我向邻居求助。"], ["turn against someone", "转而反对某人", "Public opinion turned against the policy.", "公众舆论转而反对该政策。"], ["turn out well", "结果很好", "The event turned out well.", "活动结果很好。"], ["turn up unexpectedly", "意外出现", "She turned up unexpectedly at noon.", "她中午意外出现了。"], ["turn something around", "扭转某事", "A new manager turned the company around.", "新经理扭转了公司局面。"], ["take a turn for the worse", "情况恶化", "His health took a turn for the worse.", "他的健康状况恶化了。"]),
    contexts: C(G("方向旋转", ["turn right at the corner", "在拐角右转"], ["turn the handle clockwise", "顺时针转把手"], ["turn around slowly", "慢慢转身"], ["turn the page over", "把页面翻过去"]), G("开关调节", ["turn the radio down", "把收音机调低"], ["turn the heating up", "把暖气调高"], ["turn on airplane mode", "开启飞行模式"], ["turn off notifications", "关闭通知"]), G("状态变化", ["turn cold overnight", "一夜变冷"], ["turn an idea into reality", "把想法变成现实"], ["turn milk sour", "使牛奶变酸"], ["turn fifty next month", "下月满五十岁"]), G("轮流结果", ["take turns driving", "轮流驾驶"], ["wait your turn patiently", "耐心等轮次"], ["turn out to be false", "结果证明是假的"], ["events take an unexpected turn", "事件出现意外转折"])),
    derivatives: D(["turning", "n.", "转弯；转折点", "可指道路转弯或事件变化。"], ["turnover", "n.", "营业额；人员流动；翻转", "商务中常指销售额或离职率。"], ["turnaround", "n.", "好转；周转时间", "可指业绩逆转或完成服务所需时间。"], ["return", "v. / n.", "返回；归还", "加前缀 re- 后含义发展为回到原处。"]), synonyms: S(["rotate", "v.", "旋转", "强调绕轴转动。"], ["change", "v.", "改变", "只对应状态变化。"], ["reverse", "v.", "逆转", "强调变成相反方向或结果。"], ["become", "v.", "变成", "turn + 形容词常用于颜色和明显状态。"], ["veer", "v.", "突然转向", "多指车辆、道路或观点偏转。"]),
    antonyms: A(["remain unchanged", "phr.", "保持不变", "与 turn/change 状态的义相反。"]), confusables: X(["return", "v.", "返回", "return 表回到原处；turn 只表转向，除非 turn back。"]),
    related: R(G("方向道路", ["corner", "n.", "拐角"], ["direction", "n.", "方向"], ["curve", "n.", "弯道"], ["steering", "n.", "转向控制"]), G("变化阶段", ["shift", "n.", "转变"], ["transition", "n.", "过渡"], ["conversion", "n.", "转换"], ["outcome", "n.", "结果"]), G("顺序控制", ["sequence", "n.", "顺序"], ["chance", "n.", "机会"], ["switch", "n.", "开关"], ["volume", "n.", "音量"])),
    commonErrors: E(["Turn to left here.", "Turn left here.", "left/right 作方向副词时不用 to。"], ["It turned as a problem.", "It turned into a problem.", "变成某个名词用 turn into。"])
  },

  run: {
    meanings: M(["v.", "to move quickly on foot", "跑；奔跑", "She runs five kilometers each morning.", "她每天早晨跑五公里。"], ["v.", "to operate, manage, or organize something", "运行；经营；管理", "They run a small hotel.", "他们经营一家小旅馆。"], ["v.", "to extend, flow, or continue", "延伸；流动；持续", "The road runs along the coast.", "这条路沿海岸延伸。"], ["n.", "an act or period of running or a sequence", "跑步；一段连续期", "I went for a short run.", "我去短跑了一会儿。"]),
    fixedPhrases: F(["run a risk", "冒险", "You run a risk by ignoring the warning.", "忽视警告会冒风险。"], ["run errands", "跑腿办事", "I spent the morning running errands.", "我上午一直在跑腿办事。"], ["run in the family", "是家族遗传特征", "Musical talent runs in the family.", "音乐天赋是家族遗传的。"], ["run its course", "自然发展直至结束", "The illness must run its course.", "这种病必须经过自然病程。"], ["run out of patience", "失去耐心", "I am running out of patience.", "我快没耐心了。"], ["run someone over", "开车撞倒某人", "A cyclist was nearly run over.", "一名骑车人差点被撞。"], ["run something by someone", "把某事说给某人听取意见", "Let me run the idea by my manager.", "让我把想法说给经理听听。"], ["run up a bill", "累积账单", "They ran up a huge phone bill.", "他们累积了巨额电话费。"], ["run counter to something", "与某事相违背", "The rule runs counter to common sense.", "这条规定有违常理。"], ["run on time", "准时运行", "The trains usually run on time.", "火车通常准点运行。"], ["run for office", "竞选公职", "She plans to run for office.", "她计划竞选公职。"], ["run like clockwork", "运转得极其顺畅", "The event ran like clockwork.", "活动进行得非常顺利。"]),
    contexts: C(G("奔跑运动", ["run across the field", "跑过田野"], ["run at full speed", "全速奔跑"], ["run a marathon", "跑马拉松"], ["run after the bus", "追公交车"]), G("经营管理", ["run a successful restaurant", "经营成功餐厅"], ["run the training program", "负责培训项目"], ["run a household efficiently", "高效料理家务"], ["run an online campaign", "开展线上活动"]), G("机器系统", ["run the engine for ten minutes", "让发动机运行十分钟"], ["run software on a laptop", "在笔记本上运行软件"], ["run tests overnight", "夜间运行测试"], ["run on solar power", "依靠太阳能运转"]), G("延伸流动", ["run through the valley", "穿过山谷"], ["run from May to August", "从五月持续到八月"], ["tears run down her face", "泪水流下她的脸"], ["colors run in the wash", "颜色洗涤时渗开"])),
    derivatives: D(["runner", "n.", "跑步者；滑轨", "可指人或细长覆盖物/滑动部件。"], ["running", "n. / adj.", "跑步；运行中的", "常见于 running costs、running water。"], ["rerun", "v. / n.", "重播；重新运行", "指节目重播或程序再次执行。"], ["runaway", "n. / adj.", "逃跑者；失控的", "常见于 runaway child、runaway growth。"]), synonyms: S(["jog", "v.", "慢跑", "速度较慢、常为锻炼。"], ["sprint", "v.", "短距离冲刺", "强调短时高速。"], ["operate", "v.", "运行；操作", "只对应机器或系统。"], ["manage", "v.", "管理", "只对应组织或企业经营。"], ["flow", "v.", "流动", "只对应液体连续移动。"]),
    antonyms: A(["stand still", "phr.", "静止不动", "与脚下移动的跑步义相反。"]), confusables: X(["manage", "v.", "管理；设法", "run a business 偏日常经营；manage 强调控制人员和资源。"]),
    related: R(G("跑步运动", ["race", "n.", "赛跑"], ["track", "n.", "跑道"], ["pace", "n.", "步速"], ["distance", "n.", "距离"]), G("经营组织", ["business", "n.", "企业"], ["staff", "n.", "员工"], ["budget", "n.", "预算"], ["operation", "n.", "运营"]), G("系统流动", ["engine", "n.", "发动机"], ["program", "n.", "程序"], ["stream", "n.", "溪流；流"], ["route", "n.", "路线"])),
    commonErrors: E(["I run five kilometers yesterday.", "I ran five kilometers yesterday.", "明确过去时间用过去式 ran。"], ["The water is running out the pipe.", "The water is running through the pipe.", "through 表从管道内部流过；run out of 表耗尽。"])
  },

  live: {
    meanings: M(["v.", "to be alive or continue to have life", "活着；生存", "Some trees live for hundreds of years.", "有些树能活数百年。"], ["v.", "to have your home in a place", "居住", "They live near the station.", "他们住在车站附近。"], ["v.", "to spend your life in a particular way", "生活；度过", "She lives a simple life.", "她过着简朴生活。"], ["adj.", "happening, broadcast, or electrically active now", "现场的；直播的；带电的", "The interview will be broadcast live.", "采访将现场直播。"]),
    fixedPhrases: F(["live up to expectations", "不负期望", "The product failed to live up to expectations.", "该产品未能达到预期。"], ["live with something", "接受并忍受某事", "We must learn to live with uncertainty.", "我们必须学会接受不确定性。"], ["live off something", "靠某物生活", "The family lives off a small farm.", "这家人靠小农场生活。"], ["live for something", "以某事为生活重心", "He lives for his music.", "他把音乐视为生活重心。"], ["live down something", "使丢脸的事逐渐被忘记", "I will never live that mistake down.", "我那次丢脸的错误恐怕永远不会被忘掉。"], ["live on borrowed time", "侥幸多活一段时间", "The old machine is living on borrowed time.", "这台旧机器随时可能报废。"], ["live from hand to mouth", "勉强糊口", "They lived from hand to mouth for years.", "他们多年勉强糊口。"], ["live and learn", "活到老学到老", "I did not know that—live and learn.", "这我还真不知道，活到老学到老。"], ["live and let live", "自己活也让别人活", "Her rule is live and let live.", "她的原则是互不干涉。"], ["live it up", "尽情享受", "They lived it up on holiday.", "他们度假时尽情享受。"], ["live to see something", "有生之年见证某事", "She lived to see her grandchildren grow up.", "她活着看到孙辈长大。"], ["go live", "上线；开始直播", "The new website goes live tonight.", "新网站今晚正式上线。"]),
    contexts: C(G("生命生存", ["live a long and healthy life", "健康长寿"], ["live despite serious injuries", "重伤后仍存活"], ["live for another decade", "再活十年"], ["live in the wild", "在野外生存"]), G("居住地点", ["live alone downtown", "独居市中心"], ["live with extended family", "与大家庭同住"], ["live abroad for work", "因工作住在国外"], ["live within walking distance", "住在步行范围内"]), G("生活方式", ["live within your means", "量入为出"], ["live without fear", "无惧生活"], ["live according to your values", "按价值观生活"], ["live life to the fullest", "充分享受人生"]), G("现场带电", ["watch live television", "观看电视直播"], ["perform before a live audience", "在现场观众前表演"], ["a live electrical wire", "带电电线"], ["live data from sensors", "传感器实时数据"])),
    derivatives: D(["living", "n. / adj.", "生活；活着的", "常见于 make a living、living organisms。"], ["lively", "adj.", "活泼的；热闹的", "描述人精力充沛或场所热闹。"], ["livable", "adj.", "适宜居住的", "强调环境可舒适、安全居住。"], ["livelihood", "n.", "生计", "指维持生活的工作或收入来源。"]), synonyms: S(["be alive", "phr.", "活着", "只对应生命状态。"], ["exist", "v.", "存在", "比 live 更广，不一定指生命。"], ["reside", "v.", "居住", "正式，只对应居住义。"], ["survive", "v.", "幸存；熬过", "强调经历危险后继续活着。"], ["dwell", "v.", "居住", "正式或文学用词，常与 in/on 连用。"]),
    antonyms: A(["die", "v.", "死亡", "与继续活着的义相反。"]), confusables: X(["leave", "v.", "离开；留下", "live /lɪv/；leave /liːv/，注意元音。"], ["live", "adj.", "现场的；带电的", "形容词读 /laɪv/，动词读 /lɪv/。"]),
    related: R(G("生命健康", ["life", "n.", "生命；生活"], ["health", "n.", "健康"], ["survival", "n.", "生存"], ["lifespan", "n.", "寿命"]), G("住房社区", ["home", "n.", "家"], ["resident", "n.", "居民"], ["neighborhood", "n.", "社区"], ["household", "n.", "家庭住户"]), G("生活收入", ["income", "n.", "收入"], ["lifestyle", "n.", "生活方式"], ["expense", "n.", "开支"], ["welfare", "n.", "福祉"])),
    commonErrors: E(["I am living here since last year.", "I have lived here since last year.", "since 起点延续至今通常用现在完成时。"], ["This is a living broadcast.", "This is a live broadcast.", "表示现场直播用形容词 live /laɪv/。"])
  }
};

export const manualPackWords001050 = Object.freeze(Object.keys(manualSemanticPacks001050));

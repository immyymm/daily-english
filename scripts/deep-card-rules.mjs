// High-frequency verbs whose everyday senses or grammar are too important to
// leave to an automatic dictionary-sense selection. The last value points to
// the matching curated usage example in verb-priority-data.json.
export const manualMeaningPacks = {
  be: [
    ['v.', 'to have a particular identity, quality, or state', '是；具有某种身份、性质或状态', 0],
    ['v.', 'to exist or be present', '存在；在场', 5, 'There is a quiet study room on the second floor.', '二楼有一间安静的自习室。'],
    ['v.', 'to be located or remain in a place or situation', '位于；处于某种地方或情形', 2, 'The keys are on the table beside the door.', '钥匙在门边的桌子上。']
  ],
  have: [
    ['v.', 'to own, contain, or possess something', '有；拥有；具有', 0],
    ['v.', 'to experience a condition, event, or problem', '经历；遇到', 1],
    ['v.', 'used with to to express necessity or obligation', '必须；不得不', 2],
    ['v.', 'to take part in, receive, eat, or drink something', '进行；接受；吃；喝', 4, 'We had lunch together after the lesson.', '下课后我们一起吃了午饭。']
  ],
  do: [
    ['v.', 'to perform an action, activity, task, or piece of work', '做；进行；完成', 1],
    ['v.', 'to act in a particular way or achieve a particular result', '表现；做得', 3],
    ['v.', 'to manage or continue without something', '没有某物也能应付', 4],
    ['aux.', 'used to form questions, negatives, and emphatic statements', '用于构成疑问、否定或强调', 0, 'Do you understand why this answer is correct?', '你理解这个答案为什么正确吗？']
  ],
  say: [
    ['v.', 'to express words, an opinion, or information', '说；讲；表示', 0],
    ['v.', 'to show written information or instructions', '写道；说明；显示', 1],
    ['v.', 'to give a particular judgement or answer', '认为；断言；回答', 5]
  ],
  go: [
    ['v.', 'to move or travel from one place to another', '去；前往；移动', 0],
    ['v.', 'to develop, progress, or function in a particular way', '进展；运行', 2],
    ['v.', 'to change into a particular state', '变得；进入某种状态', 0, 'The milk went bad overnight.', '牛奶一夜之间变质了。'],
    ['v.', 'to continue or proceed', '继续；进行', 4]
  ],
  get: [
    ['v.', 'to obtain, receive, buy, or bring something', '得到；收到；买到；取来', 0, 'I got a message from my teacher this morning.', '今天早上我收到了老师的信息。'],
    ['v.', 'to reach or arrive at a place', '到达；抵达', 1, 'We got to the station just before the train left.', '我们在火车开走前刚好到达车站。'],
    ['v.', 'to become or cause someone or something to become', '变得；使变得', 0],
    ['v.', 'to cause an action to be completed', '使某事完成', 2]
  ],
  can: [
    ['aux.', 'used to express ability', '能；会', 0, 'She can speak English confidently in meetings.', '她能在会议上自信地说英语。'],
    ['aux.', 'used to say that something is possible', '可能；会', 2],
    ['aux.', 'used to give or ask for permission', '可以；获准', 5, 'You can use my notes if you need them.', '如果你需要，可以用我的笔记。']
  ],
  know: [
    ['v.', 'to have information or understanding about something', '知道；了解；懂得', 0],
    ['v.', 'to be familiar with a person, place, or subject', '认识；熟悉', 3],
    ['v.', 'to have learned how to do something', '会；知道怎样做', 1],
    ['v.', 'to know something so well that you can remember it without help', '熟记；背熟', 5]
  ],
  will: [
    ['aux.', 'used to talk about the future', '将；会', 0],
    ['aux.', 'used to express willingness, intention, or a promise', '愿意；决意', 3],
    ['aux.', 'used to make a request, prediction, or immediate decision', '用于请求、预测或临时决定', 4]
  ],
  would: [
    ['aux.', 'used for an imagined or conditional situation', '会；将会（假设情况）', 3],
    ['aux.', 'used to make a polite request or express a preference', '愿意；想要；宁愿', 0],
    ['aux.', 'used to describe a repeated action in the past', '过去常常', 4],
    ['aux.', 'used with have to talk about an unreal past result', '本来会；本来可以', 5]
  ],
  make: [
    ['v.', 'to create, produce, build, or prepare something', '制作；创造；生产；准备', 0, 'She made a simple card for her friend.', '她为朋友做了一张简单的卡片。'],
    ['v.', 'to cause someone or something to be or do something', '使；让', 1],
    ['v.', 'to perform an action expressed by a noun', '作出；进行', 0],
    ['v.', 'to produce an effect, result, or difference', '产生效果；造成影响', 3]
  ],
  think: [
    ['v.', 'to use the mind to consider, reason, or solve something', '思考；考虑', 0],
    ['v.', 'to have a particular opinion or belief', '认为；相信', 1],
    ['v.', 'to form an intention, plan, or expectation', '打算；料想', 5, 'I am thinking of taking a speaking course next month.', '我正在考虑下个月参加口语课程。'],
    ['v.', 'to remember or imagine someone or something', '想起；想到；想象', 2]
  ],
  see: [
    ['v.', 'to notice someone or something with the eyes', '看见；看到', 0, 'I can see the mountains from this window.', '从这扇窗户我能看见群山。'],
    ['v.', 'to understand, realize, or recognize something', '理解；明白；看出', 1],
    ['v.', 'to meet, visit, or spend time with someone', '会见；拜访', 2, 'I am seeing my dentist on Friday morning.', '我周五上午要去见牙医。'],
    ['v.', 'to make sure that something is done or dealt with', '确保；负责处理', 4]
  ],
  come: [
    ['v.', 'to move toward a place or person', '来；过来', 0],
    ['v.', 'to arrive, happen, or become available', '到达；发生；出现', 1, 'The bus came ten minutes late.', '公交车晚到了十分钟。'],
    ['v.', 'to reach or enter a particular state or position', '变得；进入某种状态', 2, 'Her dream finally came true.', '她的梦想终于实现了。'],
    ['v.', 'to originate from a place, source, or cause', '来自；源于', 2]
  ],
  take: [
    ['v.', 'to hold, carry, move, or remove someone or something', '拿；带；取走', 0, 'Please take this book to the front desk.', '请把这本书带到前台。'],
    ['v.', 'to require or use an amount of time, space, or effort', '需要；花费', 5],
    ['v.', 'to participate in an activity or event', '参加；参与', 1],
    ['v.', 'to perform an action expressed by a noun', '采取；进行', 3]
  ],
  want: [
    ['v.', 'to wish for something or wish to do something', '想要；希望', 0],
    ['v.', 'to wish for someone to do something', '希望某人做某事', 1]
  ],
  could: [
    ['aux.', 'used to express ability in the past', '过去能；过去会', 4],
    ['aux.', 'used to express a present or future possibility', '可能；可以', 2],
    ['aux.', 'used for polite requests and suggestions', '能否；可以（礼貌请求或建议）', 1],
    ['aux.', 'used with have for a possible but unreal past action', '本来可以；原本可能', 3]
  ],
  look: [
    ['v.', 'to direct your eyes toward someone or something', '看；注视', 0],
    ['v.', 'to appear or seem in a particular way', '看起来；显得', 2],
    ['v.', 'to search for, examine, or consider something', '寻找；查看；考虑', 1]
  ],
  use: [
    ['v.', 'to do something with an object, method, or resource for a purpose', '使用；利用', 0],
    ['v.', 'to consume an amount of material, money, or energy', '耗用；消耗', 3, 'This device uses very little electricity.', '这台设备耗电很少。'],
    ['v.', 'to treat someone unfairly in order to gain an advantage', '利用某人', 5, 'He realized that the company was using him.', '他意识到公司正在利用他。']
  ],
  tell: [
    ['v.', 'to give someone information by speaking or writing', '告诉；告知', 0],
    ['v.', 'to order, advise, or instruct someone to do something', '吩咐；命令；建议', 1],
    ['v.', 'to recognize, distinguish, or know something', '辨别；看出；判断', 4],
    ['v.', 'to describe or narrate a story, joke, or experience', '讲述；叙述', 3]
  ],
  find: [
    ['v.', 'to discover someone or something by searching', '找到；发现', 0],
    ['v.', 'to notice, learn, or realize that something is true', '发现；得知', 1],
    ['v.', 'to experience something or form an opinion about it', '觉得；认为', 2]
  ],
  give: [
    ['v.', 'to hand, provide, or transfer something to someone', '给；给予；提供', 1],
    ['v.', 'to communicate information, advice, or an opinion', '提供信息、建议或意见', 0],
    ['v.', 'to cause someone to have a feeling, opportunity, or result', '使产生；带来', 4],
    ['v.', 'to cause or produce a particular result', '导致；产生某种结果', 5]
  ],
  need: [
    ['v.', 'to require something because it is necessary', '需要；必须有', 0],
    ['v.', 'to have to do something', '需要；必须', 1],
    ['v.', 'used in negatives to say an action is not necessary', '不必；无须', 4]
  ],
  should: [
    ['aux.', 'used to say what is advisable, right, or expected', '应该；应当', 0],
    ['aux.', 'used to express probability or a reasonable expectation', '应该会；可能会', 5],
    ['aux.', 'used with have to talk about a past duty, expectation, or criticism', '本应该；早该', 2]
  ],
  may: [
    ['aux.', 'used to express possibility', '可能；也许', 2],
    ['aux.', 'used to ask for or give permission', '可以；获准', 3],
    ['aux.', 'used to say that a possibility remains open or uncertain', '也可能；是否发生尚不确定', 5]
  ],
  mean: [
    ['v.', 'to express, represent, or have a particular meaning', '意思是；表示', 1],
    ['v.', 'to intend or plan to do something', '打算；意欲', 2],
    ['v.', 'to have importance or a particular result for someone', '意味着；对……重要', 0]
  ],
  feel: [
    ['v.', 'to experience an emotion or physical sensation', '感到；感觉', 0],
    ['v.', 'to touch something in order to discover what it is like', '触摸；摸索', 5],
    ['v.', 'to believe or have an opinion, especially from instinct', '觉得；认为', 2]
  ],
  pick: [
    ['v.', 'to choose someone or something from a group', '挑选；选择', 0],
    ['v.', 'to gather fruit, flowers, or crops by hand', '采摘', 0, 'We picked strawberries in the garden this morning.', '今天早上我们在花园里采摘了草莓。'],
    ['v.', 'to lift or remove something with your fingers or a tool', '捡起；取下', 1, 'She picked a small stone up from the path.', '她从小路上捡起了一块小石头。']
  ],
  call: [
    ['v.', 'to contact someone by phone', '打电话', 0],
    ['v.', 'to give someone or something a name', '称呼；命名', 1],
    ['v.', 'to ask or order someone to come', '叫来；召唤', 0, 'The nurse called the doctor into the room.', '护士把医生叫进了房间。']
  ],
  put: [
    ['v.', 'to place someone or something in a particular position', '放；安置', 0, 'Please put the keys on the table.', '请把钥匙放在桌上。'],
    ['v.', 'to express an idea in words', '表达；说', 0, 'It is difficult to put this feeling into words.', '这种感受很难用语言表达。']
  ],
  like: [
    ['v.', 'to enjoy or feel pleased about someone or something', '喜欢', 0],
    ['v.', 'to think that someone or something is pleasant or good', '觉得……好；喜欢', 0, 'I like this version better because it is clearer.', '我更喜欢这个版本，因为它更清楚。'],
    ['v.', 'to want or prefer something, especially in polite requests', '想要；愿意', 2]
  ],
  play: [
    ['v.', 'to take part in a game or other enjoyable activity', '玩；参加游戏', 0],
    ['v.', 'to perform music on an instrument', '演奏', 0, 'She plays the piano after dinner.', '她晚饭后弹钢琴。'],
    ['v.', 'to perform the role of a character', '扮演', 0, 'He plays a young doctor in the film.', '他在电影中扮演一名年轻医生。']
  ],
  turn: [
    ['v.', 'to move something around a central point', '转动；旋转', 0, 'Turn the handle slowly to open the door.', '慢慢转动把手把门打开。'],
    ['v.', 'to change direction', '转向；转弯', 0],
    ['v.', 'to change or cause something to change into a different state', '变成；使转变', 1]
  ],
  run: [
    ['v.', 'to move quickly on foot', '跑；奔跑', 0, 'She runs in the park every morning.', '她每天早上在公园跑步。'],
    ['v.', 'to make a machine, program, or system operate', '运行；使运转', 1],
    ['v.', 'to manage a business, organization, or activity', '经营；管理', 0]
  ],
  live: [
    ['v.', 'to be alive or continue to have life', '活着；生活', 0],
    ['v.', 'to have your home in a particular place', '居住；住', 1]
  ],
  bring: [
    ['v.', 'to carry or take someone or something toward a place or person', '带来；拿来', 0],
    ['v.', 'to cause a particular result or situation', '带来；导致', 3]
  ],
  move: [
    ['v.', 'to change position or go to a different place', '移动；搬家', 0],
    ['v.', 'to make an activity or process progress', '推进；使进展', 1],
    ['v.', 'to cause someone to feel a strong emotion', '感动；打动', 4]
  ],
  hold: [
    ['v.', 'to keep someone or something in your hands', '拿着；握住', 0],
    ['v.', 'to keep something in a particular state or position', '保持；使处于', 5],
    ['v.', 'to organize an event such as a meeting', '举行；召开', 1]
  ],
  change: [
    ['v.', 'to become different', '变化；改变', 0, 'Your priorities may change over time.', '你的优先事项可能会随时间改变。'],
    ['v.', 'to make someone or something different', '改变；更改', 0, 'I changed the date of the meeting.', '我更改了会议日期。'],
    ['n.', 'the act or result of becoming different', '变化；改变', 0, 'I noticed a positive change in her attitude.', '我注意到她的态度有了积极变化。']
  ],
  kill: [
    ['v.', 'to cause a person, animal, or plant to die', '杀死；使死亡', 0, 'The disease can kill young plants quickly.', '这种病会很快使幼苗死亡。'],
    ['v.', 'to stop an activity, process, or idea completely', '终止；扼杀', 3],
    ['v.', 'to spend time doing something while waiting', '消磨时间', 0]
  ],
  stand: [
    ['v.', 'to be in an upright position on your feet', '站立', 0],
    ['v.', 'to accept or tolerate an unpleasant situation', '忍受；容忍', 1],
    ['v.', 'to represent or mean something', '代表；表示', 0, 'UN stands for the United Nations.', 'UN 代表联合国。']
  ],
  speak: [
    ['v.', 'to say words or talk in a particular language', '说话；讲某种语言', 0],
    ['v.', 'to talk to someone about something', '交谈；谈话', 1],
    ['v.', 'to give a formal talk to an audience', '演讲；发言', 0, 'She spoke at the conference about language learning.', '她在大会上就语言学习作了发言。']
  ],
  set: [
    ['v.', 'to put someone or something in a particular position', '放置；安放', 0, 'She set the cup carefully on the table.', '她小心地把杯子放在桌上。'],
    ['v.', 'to establish a rule, goal, or standard', '设定；制定', 0],
    ['v.', 'to decide a value, time, or limit', '确定；设定', 1]
  ],
  lead: [
    ['v.', 'to guide or be in charge of a person, group, or activity', '带领；领导', 0],
    ['v.', 'to cause a particular result', '导致；引起', 1],
    ['v.', 'to be ahead of others in a race, competition, or situation', '领先', 0, 'Our team leads by two points at halftime.', '半场结束时我们队领先两分。']
  ],
  add: [
    ['v.', 'to put something together with something else', '添加；加入', 0],
    ['v.', 'to say or write something more', '补充说；补充写道', 2],
    ['v.', 'to calculate the total of two or more numbers or amounts', '相加；合计', 1]
  ],
  die: [
    ['v.', 'to stop living', '死亡；死去', 0],
    ['v.', 'to gradually disappear or become weaker', '消失；逐渐减弱', 2],
    ['v.', 'to stop functioning because power or energy is gone', '停止运转；没电', 0, 'My phone died before I could call her.', '我还没来得及给她打电话，手机就没电了。']
  ],
  buy: [
    ['v.', 'to obtain something by paying money for it', '购买；买下', 0],
    ['v.', 'to accept or believe an idea or explanation', '相信；接受', 3]
  ],
  walk: [
    ['v.', 'to move from one place to another on foot', '走路；步行', 0],
    ['v.', 'to go somewhere with someone who is walking', '陪……走；步行送', 0, 'I walked my friend home after dinner.', '晚饭后我步行送朋友回家。']
  ],
  grow: [
    ['v.', 'to become larger or develop naturally', '生长；长大', 0, 'These plants grow quickly in warm weather.', '这些植物在温暖天气里生长得很快。'],
    ['v.', 'to increase in size, number, or importance', '增长；扩大', 0],
    ['v.', 'to gradually become a particular state', '逐渐变得', 0, 'She grew more confident after each presentation.', '每次演讲后她都变得更自信。']
  ],
  open: [
    ['v.', 'to move or remove something so that it is no longer closed', '打开；开启', 0],
    ['v.', 'to make a place, service, or opportunity available', '开放；使可使用', 2],
    ['v.', 'to begin business or start operating', '开业；开始营业', 0, 'The new store opens at nine tomorrow morning.', '新商店明天早上九点开始营业。']
  ],
  fall: [
    ['v.', 'to move downward or drop to the ground', '落下；跌倒', 0],
    ['v.', 'to decrease in amount, level, or value', '下降；减少', 1],
    ['v.', 'to enter a particular state', '进入某种状态；变得', 2]
  ],
  appear: [
    ['v.', 'to become visible or begin to be seen', '出现；显现', 0],
    ['v.', 'to be present in a place, text, or event', '出现；出席', 5],
    ['v.', 'to seem to have a particular quality', '显得；似乎', 0, 'The task appears easier after you read the example.', '读完例句后，这项任务似乎容易了一些。']
  ],
  serve: [
    ['v.', 'to help customers or provide a service', '服务；接待', 0],
    ['v.', 'to provide food or drink', '供应；端上', 1],
    ['v.', 'to be useful for a particular purpose', '起作用；可用作', 2],
    ['v.', 'to perform a particular duty or role', '任职；履行职责', 0, 'She served as team leader for two years.', '她担任了两年团队负责人。']
  ],
  break: [
    ['v.', 'to damage something so that it no longer works or stays whole', '弄坏；打破', 0, 'Be careful not to break the glass.', '小心不要打碎玻璃。'],
    ['v.', 'to divide something into smaller parts', '分开；拆分', 1],
    ['v.', 'to fail to obey a rule, law, or promise', '违反；违背', 0],
    ['v.', 'to interrupt or stop an activity or period of time', '中断；打断', 0, 'The connection broke during the call.', '通话时连接中断了。']
  ],
  cut: [
    ['v.', 'to divide something using a sharp tool', '切；割', 0],
    ['v.', 'to reduce an amount, cost, or number', '削减；减少', 1],
    ['v.', 'to interrupt someone or stop a connection', '打断；中断', 0, 'The call was cut off before I finished speaking.', '我还没说完，电话就中断了。']
  ],
  hit: [
    ['v.', 'to strike someone or something with force', '击打；击中', 0],
    ['v.', 'to collide with someone or something', '撞击；碰撞', 0, 'The car hit a tree beside the road.', '汽车撞上了路边的一棵树。'],
    ['v.', 'to reach a particular level, number, or target', '达到；到达', 1],
    ['v.', 'to affect someone suddenly and strongly', '突然影响；沉重打击', 2]
  ],
  drive: [
    ['v.', 'to control and operate a car or other vehicle', '驾驶；开车', 0, 'She drives to work every morning.', '她每天早上开车上班。'],
    ['v.', 'to provide the power or force that makes something happen', '驱动；推动', 0, 'Customer demand drives product development.', '客户需求推动产品开发。'],
    ['v.', 'to force or strongly motivate someone to act', '迫使；驱使', 3]
  ],
  follow: [
    ['v.', 'to go or come after a person or thing', '跟随；跟着', 0, 'Follow me and I will show you the way.', '跟我来，我给你带路。'],
    ['v.', 'to act according to instructions, rules, or advice', '遵循；按照', 0, 'Please follow the instructions carefully.', '请认真按照说明操作。'],
    ['v.', 'to continue dealing with or checking something', '跟进；追踪', 4]
  ],
  realize: [
    ['v.', 'to suddenly understand or become aware of something', '意识到；明白', 0],
    ['v.', 'to achieve something that you hoped or planned for', '实现；使成真', 0, 'She finally realized her dream of becoming a doctor.', '她终于实现了当医生的梦想。']
  ],
  increase: [
    ['v.', 'to become greater in amount, number, or level', '增加；增长', 0],
    ['v.', 'to make something greater in amount, number, or level', '使增加；提高', 0, 'The company increased prices by five percent.', '公司把价格提高了百分之五。'],
    ['n.', 'a rise in amount, number, or level', '增加；增长', 0, 'There was a small increase in sales.', '销售额有小幅增长。']
  ],
  accept: [
    ['v.', 'to agree to receive or take something that is offered', '接受；收下', 0],
    ['v.', 'to recognize that something is true, valid, or your responsibility', '承认；认可', 1]
  ],
  depend: [
    ['v.', 'to be decided or affected by something else', '取决于；视……而定', 0],
    ['v.', 'to need or rely on someone or something', '依靠；依赖', 1]
  ],
  spend: [
    ['v.', 'to use money to pay for something', '花费（金钱）', 0, 'I spent twenty dollars on the book.', '我买这本书花了二十美元。'],
    ['v.', 'to use time doing something or being somewhere', '花费（时间）；度过', 0]
  ],
  ask: [
    ['v.', 'to request information by using a question', '问；询问', 0],
    ['v.', 'to request help, permission, or something you need', '请求；要求', 1],
    ['v.', 'to request or obtain permission', '请求许可；征得同意', 4]
  ],
  talk: [
    ['v.', 'to speak with someone and exchange ideas or information', '交谈；谈话', 0],
    ['v.', 'to discuss a particular subject', '谈论；讨论', 1],
    ['v.', 'to persuade someone to do or not do something', '说服；劝某人做或不做某事', 2]
  ],
  write: [
    ['v.', 'to form letters or words on a surface or in a document', '写；书写', 0],
    ['v.', 'to compose a text about a subject', '写作；撰写', 1],
    ['v.', 'to communicate with someone in writing', '写信；书面联系', 3]
  ],
  read: [
    ['v.', 'to look at and understand written words', '阅读；读懂', 0],
    ['v.', 'to learn information from written material', '读到；获悉', 1],
    ['v.', 'to say written words aloud', '朗读', 2],
    ['v.', 'to interpret an implied meaning or hidden message', '领会；看出言外之意', 3]
  ],
  pay: [
    ['v.', 'to give money for something or to someone', '付款；支付', 0],
    ['v.', 'to give attention to someone or something', '给予关注；注意', 2],
    ['v.', 'to suffer a cost or unpleasant result', '付出代价', 3],
    ['v.', 'to produce a good result or repay a debt', '取得回报；还清', 4]
  ],
  learn: [
    ['v.', 'to gain knowledge or a skill through study or experience', '学习；学会', 0],
    ['v.', 'to study or obtain information about a subject', '了解；学习有关知识', 1],
    ['v.', 'to discover or become aware of a fact', '得知；获悉', 1, 'I was surprised to learn that the shop had closed.', '得知那家商店已经关门，我很惊讶。']
  ],
  allow: [
    ['v.', 'to give someone permission to do something', '允许；准许', 0],
    ['v.', 'to make something possible', '使能够；使成为可能', 0, 'The bridge allows people to cross the river safely.', '这座桥使人们能够安全过河。'],
    ['v.', 'to include something when calculating or planning', '把……考虑在内；为……留出', 4]
  ],
  send: [
    ['v.', 'to cause a message, letter, or object to go to someone', '发送；寄出', 0],
    ['v.', 'to arrange for a person to go somewhere', '派遣；派去', 2],
    ['v.', 'to cause something to be distributed or emitted', '发出；散发', 4]
  ],
  consider: [
    ['v.', 'to think carefully about something before deciding', '考虑；仔细思考', 0],
    ['v.', 'to have a particular opinion about someone or something', '认为；把……看作', 2]
  ],
  suggest: [
    ['v.', 'to offer an idea or course of action for consideration', '建议；提议', 0],
    ['v.', 'to show or indicate that something is probably true', '表明；暗示', 3]
  ],
  receive: [
    ['v.', 'to get something that is sent or given', '收到；接收', 0],
    ['v.', 'to experience or be given attention, help, or treatment', '受到；获得', 3],
    ['v.', 'to welcome or greet a guest', '接待；迎接', 4]
  ],
  reach: [
    ['v.', 'to arrive at a place', '到达；抵达', 5],
    ['v.', 'to achieve a level, goal, agreement, or decision', '达到；达成', 0],
    ['v.', 'to contact or communicate with someone', '联系；与……取得联系', 3]
  ],
  join: [
    ['v.', 'to become a member or participant in a group or activity', '加入；参加', 0],
    ['v.', 'to go or do something together with someone', '和……一起；参与', 1],
    ['v.', 'to connect two or more things', '连接；接合', 3]
  ],
  might: [
    ['aux.', 'used to express a weak or uncertain possibility', '可能；也许', 0],
    ['aux.', 'used to make a cautious suggestion', '不妨；可以', 1],
    ['aux.', 'used with have for an uncertain or possible past action', '可能已经；或许曾经', 2]
  ],
  must: [
    ['aux.', 'used to express necessity or a strong obligation', '必须；一定要', 0],
    ['aux.', 'used to express a strong logical conclusion', '一定；想必', 2, 'She must be tired after working all night.', '她工作了一整夜，现在一定很累。'],
    ['aux.', 'used to give a strong recommendation', '务必；一定要', 4, 'You must visit the museum while you are in the city.', '你在这座城市期间一定要去参观那家博物馆。']
  ]
};

export const manualDerivativePacks = {
  become: [
    ['becoming', 'adj.', '合适的；好看的', '作形容词时表示某事物与人的身份、外表或场合相配。']
  ],
  provide: [
    ['provisional', 'adj.', '临时的；暂定的', '来自 provision 这一词族，常用于 provisional plan、provisional date。']
  ],
  run: [
    ['runner', 'n.', '跑步者；参赛者', '指跑步的人，也可指参加赛跑的人。'],
    ['running', 'n. / adj.', '跑步；持续的；运转中的', '常见于 go running、running water 和 running costs。']
  ],
  wait: [],
  follow: [
    ['follower', 'n.', '追随者；关注者', '指跟随某人、支持某个观点，或关注某个账号的人。']
  ],
  allow: [
    ['allowance', 'n.', '津贴；限额；允许量', '与 allow 同词族，常见于 travel allowance、daily allowance。'],
    ['allowable', 'adj.', '允许的；可接受的', '指规则或条件所允许的范围。']
  ],
  stop: [
    ['stoppage', 'n.', '停止；停工；中断', '常指工作、比赛或供应暂时停止。']
  ],
  buy: [
    ['buyer', 'n.', '买家；采购者', '指购买商品的人或负责采购的人。']
  ],
  send: [
    ['sender', 'n.', '寄件人；发送者', '指寄出信件、包裹或信息的人。']
  ],
  handle: [],
  hit: [],
  pull: [],
  raise: [],
  join: [],
  develop: [
    ['development', 'n.', '发展；成长；开发', '表示发展过程或形成的新成果。'],
    ['developmental', 'adj.', '发展的；发育的', '常描述成长或发展阶段，如 developmental needs。']
  ],
  serve: [
    ['service', 'n.', '服务；公共事业服务', '表示为他人提供帮助或满足需要的活动。'],
    ['serving', 'n.', '一份食物；服务行为', '常见于 serving size，表示一次食用的份量。']
  ]
};

// Sense-safe related vocabulary.  Automatic WordNet expansion mixes every
// dictionary sense of a short verb and produced misleading neighbors (for
// example play -> curl and go -> repair).  These compact sets are deliberately
// explicit so every displayed word has a clear learning relationship.
export const manualRelatedPacks = {
  go: [['travel', 'v.', '旅行；行进'], ['leave', 'v.', '离开'], ['return', 'v.', '返回']],
  know: [['learn', 'v.', '学习；得知'], ['recognize', 'v.', '认出；识别']],
  think: [['consider', 'v.', '考虑'], ['judge', 'v.', '判断'], ['reflect', 'v.', '思考；反思']],
  come: [['arrive', 'v.', '到达'], ['reach', 'v.', '到达；达到'], ['return', 'v.', '返回']],
  want: [['need', 'v.', '需要'], ['prefer', 'v.', '更喜欢'], ['wish', 'v.', '希望']],
  find: [['search', 'v.', '寻找'], ['locate', 'v.', '找到；定位'], ['discover', 'v.', '发现']],
  give: [['receive', 'v.', '收到'], ['transfer', 'v.', '转交；传递'], ['donate', 'v.', '捐赠']],
  let: [['allow', 'v.', '允许'], ['permit', 'v.', '准许'], ['prevent', 'v.', '阻止']],
  mean: [['refer', 'v.', '指的是'], ['represent', 'v.', '代表'], ['define', 'v.', '给……下定义']],
  feel: [['emotion', 'n.', '情绪'], ['sensation', 'n.', '感觉'], ['reaction', 'n.', '反应']],
  keep: [['retain', 'v.', '保留'], ['store', 'v.', '储存'], ['preserve', 'v.', '保存；保护']],
  leave: [['depart', 'v.', '离开；出发'], ['return', 'v.', '返回'], ['remain', 'v.', '留下；保持']],
  help: [['assist', 'v.', '帮助；协助'], ['support', 'v.', '支持'], ['improve', 'v.', '改善']],
  happen: [['occur', 'v.', '发生'], ['cause', 'n. / v.', '原因；导致'], ['result', 'n. / v.', '结果；导致']],
  hear: [['sound', 'n.', '声音'], ['listen', 'v.', '倾听'], ['voice', 'n.', '嗓音；声音']],
  hold: [['grip', 'v. / n.', '紧握；握力'], ['release', 'v.', '释放；松开'], ['preserve', 'v.', '保持；保存']],
  thank: [['gratitude', 'n.', '感激'], ['appreciate', 'v.', '感激；欣赏'], ['acknowledge', 'v.', '承认；致谢']],
  kill: [['death', 'n.', '死亡'], ['save', 'v.', '挽救'], ['destroy', 'v.', '毁坏；消灭']],
  remember: [['memory', 'n.', '记忆'], ['recall', 'v. / n.', '回想；记起'], ['forget', 'v.', '忘记']],
  stay: [['remain', 'v.', '保持；留下'], ['leave', 'v.', '离开'], ['continue', 'v.', '继续']],
  buy: [['sell', 'v.', '出售'], ['pay', 'v.', '付款'], ['purchase', 'v. / n.', '购买']],
  send: [['receive', 'v.', '收到'], ['deliver', 'v.', '递送'], ['message', 'n. / v.', '消息；发消息']],
  grow: [['increase', 'v.', '增长'], ['develop', 'v.', '发展'], ['expand', 'v.', '扩大']],
  serve: [['service', 'n.', '服务'], ['help', 'v.', '帮助'], ['provide', 'v.', '提供']],
  report: [['inform', 'v.', '告知'], ['record', 'v. / n.', '记录'], ['news', 'n.', '新闻']],
  pull: [['push', 'v.', '推'], ['draw', 'v.', '拉；牵引'], ['drag', 'v.', '拖；拽']],
  return: [['leave', 'v.', '离开'], ['restore', 'v.', '恢复'], ['repeat', 'v.', '再次发生；重复']],
  join: [['connect', 'v.', '连接'], ['separate', 'v.', '分开'], ['member', 'n.', '成员']],
  increase: [['decrease', 'v.', '减少'], ['grow', 'v.', '增长'], ['rise', 'v. / n.', '上升']],
  affect: [['effect', 'n.', '影响；效果'], ['change', 'v. / n.', '改变；变化'], ['influence', 'v. / n.', '影响']],
  achieve: [['goal', 'n.', '目标'], ['succeed', 'v.', '成功'], ['progress', 'n. / v.', '进步；进展']],
  encourage: [['support', 'v.', '支持'], ['motivate', 'v.', '激励'], ['confidence', 'n.', '信心']],
  call: [['phone', 'v. / n.', '打电话；电话'], ['contact', 'v. / n.', '联系'], ['name', 'v. / n.', '命名；名字']],
  run: [['walk', 'v.', '走路'], ['sprint', 'v. / n.', '冲刺；短跑'], ['operate', 'v.', '运行；操作']],
  play: [['game', 'n.', '游戏；比赛'], ['sport', 'n.', '运动'], ['perform', 'v.', '表演；演奏']],
  turn: [['rotate', 'v.', '旋转'], ['direction', 'n.', '方向'], ['change', 'v. / n.', '改变；变化']],
  bring: [['take', 'v.', '带走；拿走'], ['carry', 'v.', '携带'], ['deliver', 'v.', '递送']],
  move: [['stay', 'v.', '停留'], ['shift', 'v.', '移动；转移'], ['transport', 'v.', '运输']],
  break: [['repair', 'v.', '修理'], ['damage', 'v. / n.', '损坏'], ['divide', 'v.', '分开']],
  cut: [['knife', 'n.', '刀'], ['divide', 'v.', '分开'], ['reduce', 'v.', '减少']],
  hit: [['miss', 'v.', '没击中；错过'], ['strike', 'v.', '击打'], ['target', 'n.', '目标；靶子']],
  drive: [['vehicle', 'n.', '车辆'], ['driver', 'n.', '司机'], ['transport', 'v.', '运输']],
  follow: [['lead', 'v.', '带领'], ['path', 'n.', '道路；路径'], ['instruction', 'n.', '指示；说明']],
  open: [['close', 'v.', '关闭'], ['access', 'n.', '使用权；入口'], ['door', 'n.', '门']],
  fall: [['rise', 'v.', '上升'], ['drop', 'v. / n.', '下降；落下'], ['decrease', 'v.', '减少']],
  appear: [['disappear', 'v.', '消失'], ['seem', 'v.', '似乎'], ['visible', 'adj.', '看得见的']],
  depend: [['rely', 'v.', '依靠'], ['cause', 'n.', '原因'], ['result', 'n.', '结果']],
  spend: [['save', 'v.', '节省；储蓄'], ['cost', 'v. / n.', '花费；成本'], ['time', 'n.', '时间']],
  be: [['exist', 'v.', '存在'], ['state', 'n.', '状态'], ['identity', 'n.', '身份']],
  have: [['own', 'v.', '拥有'], ['possess', 'v.', '具有；持有'], ['experience', 'v. / n.', '经历；经验']],
  do: [['perform', 'v.', '执行；完成'], ['task', 'n.', '任务'], ['action', 'n.', '行动']],
  say: [['tell', 'v.', '告诉；讲述'], ['speak', 'v.', '说话；发言'], ['statement', 'n.', '陈述；说法']],
  get: [['obtain', 'v.', '获得'], ['receive', 'v.', '收到'], ['become', 'v.', '变得']],
  can: [['ability', 'n.', '能力'], ['possible', 'adj.', '可能的'], ['permission', 'n.', '许可']],
  will: [['future', 'n.', '未来'], ['intention', 'n.', '意图'], ['promise', 'n. / v.', '承诺']],
  would: [['condition', 'n.', '条件'], ['preference', 'n.', '偏好'], ['past habit', 'phr.', '过去的习惯']],
  make: [['create', 'v.', '创造'], ['produce', 'v.', '生产；产生'], ['cause', 'v. / n.', '导致；原因']],
  see: [['look', 'v.', '看'], ['notice', 'v.', '注意到'], ['understand', 'v.', '理解']],
  take: [['carry', 'v.', '携带'], ['receive', 'v.', '接受'], ['require', 'v.', '需要']],
  could: [['past ability', 'phr.', '过去的能力'], ['possibility', 'n.', '可能性'], ['polite request', 'phr.', '礼貌请求']],
  look: [['see', 'v.', '看见'], ['watch', 'v.', '观看；留意'], ['appearance', 'n.', '外表；样子']],
  use: [['employ', 'v.', '使用；采用'], ['apply', 'v.', '应用；运用'], ['purpose', 'n.', '目的']],
  tell: [['say', 'v.', '说'], ['inform', 'v.', '告知'], ['narrate', 'v.', '叙述']],
  need: [['require', 'v.', '需要'], ['necessity', 'n.', '必要性'], ['essential', 'adj.', '必需的']],
  should: [['advice', 'n.', '建议'], ['duty', 'n.', '责任；义务'], ['expectation', 'n.', '预期']],
  try: [['attempt', 'v. / n.', '尝试'], ['effort', 'n.', '努力'], ['succeed', 'v.', '成功']],
  may: [['possibility', 'n.', '可能性'], ['permission', 'n.', '许可'], ['uncertain', 'adj.', '不确定的']],
  ask: [['question', 'n. / v.', '问题；询问'], ['request', 'n. / v.', '请求'], ['inquire', 'v.', '询问']],
  talk: [['speak', 'v.', '说话'], ['conversation', 'n.', '交谈'], ['discuss', 'v.', '讨论']],
  put: [['place', 'v. / n.', '放置；位置'], ['position', 'n. / v.', '位置；安置'], ['express', 'v.', '表达']],
  like: [['enjoy', 'v.', '喜欢；享受'], ['prefer', 'v.', '更喜欢'], ['dislike', 'v.', '不喜欢']],
  start: [['begin', 'v.', '开始'], ['launch', 'v. / n.', '启动；发起'], ['finish', 'v. / n.', '结束；完成']],
  become: [['change', 'v. / n.', '改变；变化'], ['grow', 'v.', '逐渐变得'], ['remain', 'v.', '保持']],
  show: [['display', 'v. / n.', '展示'], ['demonstrate', 'v.', '说明；演示'], ['hide', 'v.', '隐藏']],
  seem: [['appear', 'v.', '似乎；显得'], ['impression', 'n.', '印象'], ['certainty', 'n.', '确定性']],
  might: [['possibility', 'n.', '可能性'], ['suggestion', 'n.', '建议'], ['uncertainty', 'n.', '不确定性']],
  live: [['life', 'n.', '生命；生活'], ['home', 'n. / adv.', '家；在家'], ['survive', 'v.', '生存']],
  write: [['text', 'n.', '文字；文本'], ['author', 'n. / v.', '作者；创作'], ['compose', 'v.', '撰写；创作']],
  must: [['obligation', 'n.', '义务'], ['necessity', 'n.', '必要性'], ['conclusion', 'n.', '结论']],
  begin: [['start', 'v. / n.', '开始'], ['opening', 'n.', '开端；开幕'], ['end', 'v. / n.', '结束']],
  love: [['affection', 'n.', '喜爱；感情'], ['care', 'n. / v.', '关心；照顾'], ['hate', 'v. / n.', '憎恨']],
  read: [['text', 'n.', '文字；文本'], ['reader', 'n.', '读者'], ['interpret', 'v.', '理解；诠释']],
  stop: [['cease', 'v.', '停止'], ['pause', 'v. / n.', '暂停'], ['continue', 'v.', '继续']],
  pay: [['money', 'n.', '金钱'], ['cost', 'n. / v.', '成本；花费'], ['salary', 'n.', '薪水']],
  lose: [['loss', 'n.', '损失'], ['miss', 'v.', '错过；未击中'], ['find', 'v.', '找到']],
  wait: [['delay', 'n. / v.', '延迟'], ['patience', 'n.', '耐心'], ['hurry', 'v. / n.', '赶紧；匆忙']],
  meet: [['encounter', 'v. / n.', '遇见'], ['gather', 'v.', '聚集'], ['separate', 'v.', '分开']],
  change: [['alter', 'v.', '改变'], ['transform', 'v.', '转变'], ['remain', 'v.', '保持']],
  watch: [['observe', 'v.', '观察'], ['view', 'v. / n.', '观看；视野'], ['attention', 'n.', '注意力']],
  sit: [['seat', 'n. / v.', '座位；使就座'], ['stand', 'v.', '站立'], ['position', 'n.', '姿势；位置']],
  learn: [['study', 'v.', '学习'], ['know', 'v.', '知道；掌握'], ['teach', 'v.', '教授']],
  stand: [['sit', 'v.', '坐'], ['upright', 'adj. / adv.', '直立的；直立地'], ['tolerate', 'v.', '忍受']],
  speak: [['voice', 'n.', '声音；嗓音'], ['language', 'n.', '语言'], ['speech', 'n.', '说话；演讲']],
  set: [['place', 'v.', '放置'], ['establish', 'v.', '建立；设定'], ['setting', 'n.', '环境；设置']],
  allow: [['permit', 'v.', '允许'], ['permission', 'n.', '许可'], ['forbid', 'v.', '禁止']],
  win: [['victory', 'n.', '胜利'], ['prize', 'n.', '奖品'], ['lose', 'v.', '输；失去']],
  lead: [['guide', 'v. / n.', '引导；指南'], ['leader', 'n.', '领导者'], ['follow', 'v.', '跟随']],
  continue: [['proceed', 'v.', '继续进行'], ['persist', 'v.', '坚持'], ['stop', 'v.', '停止']],
  add: [['include', 'v.', '加入；包括'], ['total', 'n. / v.', '总数；合计'], ['remove', 'v.', '移除']],
  die: [['death', 'n.', '死亡'], ['alive', 'adj.', '活着的'], ['survive', 'v.', '幸存']],
  walk: [['step', 'n. / v.', '脚步；迈步'], ['path', 'n.', '小路；路径'], ['run', 'v.', '跑']],
  consider: [['think', 'v.', '思考'], ['evaluate', 'v.', '评估'], ['decide', 'v.', '决定']],
  hope: [['wish', 'v. / n.', '希望；愿望'], ['optimism', 'n.', '乐观'], ['despair', 'n. / v.', '绝望']],
  offer: [['provide', 'v.', '提供'], ['proposal', 'n.', '提议'], ['refuse', 'v.', '拒绝']],
  build: [['construct', 'v.', '建造'], ['structure', 'n.', '结构'], ['destroy', 'v.', '摧毁']],
  expect: [['anticipate', 'v.', '预期'], ['prediction', 'n.', '预测'], ['surprise', 'n. / v.', '惊讶；使惊讶']],
  end: [['finish', 'v. / n.', '结束；完成'], ['conclusion', 'n.', '结尾；结论'], ['begin', 'v.', '开始']],
  require: [['need', 'v. / n.', '需要'], ['requirement', 'n.', '要求'], ['optional', 'adj.', '可选的']],
  listen: [['hear', 'v.', '听见'], ['sound', 'n.', '声音'], ['attention', 'n.', '注意']],
  agree: [['consent', 'v. / n.', '同意'], ['agreement', 'n.', '一致；协议'], ['disagree', 'v.', '不同意']],
  decide: [['choose', 'v.', '选择'], ['decision', 'n.', '决定'], ['hesitate', 'v.', '犹豫']],
  pass: [['move', 'v.', '移动；经过'], ['succeed', 'v.', '成功；通过'], ['fail', 'v.', '失败；不及格']],
  eat: [['food', 'n.', '食物'], ['meal', 'n.', '一餐'], ['hunger', 'n.', '饥饿']],
  suggest: [['recommend', 'v.', '建议；推荐'], ['proposal', 'n.', '提议'], ['imply', 'v.', '暗示']],
  sell: [['buyer', 'n.', '买家'], ['market', 'n. / v.', '市场；推销'], ['purchase', 'n. / v.', '购买']],
  receive: [['send', 'v.', '发送'], ['accept', 'v.', '接受'], ['delivery', 'n.', '递送；交付']],
  base: [['foundation', 'n.', '基础；地基'], ['basis', 'n.', '基础；依据'], ['top', 'n.', '顶部']],
  pick: [['choose', 'v.', '选择'], ['select', 'v.', '挑选'], ['gather', 'v.', '采集']],
  reach: [['arrive', 'v.', '到达'], ['contact', 'v. / n.', '联系'], ['target', 'n.', '目标']],
  remain: [['stay', 'v.', '保持；停留'], ['unchanged', 'adj.', '未改变的'], ['leave', 'v.', '离开']],
  explain: [['clarify', 'v.', '澄清'], ['reason', 'n.', '原因'], ['confuse', 'v.', '使困惑']],
  raise: [['lift', 'v.', '举起'], ['increase', 'v.', '提高'], ['lower', 'v.', '降低']],
  wear: [['clothing', 'n.', '衣物'], ['dress', 'v. / n.', '穿衣；服装'], ['remove', 'v.', '脱下；移除']],
  choose: [['option', 'n.', '选项'], ['select', 'v.', '挑选'], ['reject', 'v.', '拒绝']],
  cause: [['reason', 'n.', '原因'], ['effect', 'n.', '结果；影响'], ['result', 'n. / v.', '结果；导致']],
  develop: [['grow', 'v.', '成长；发展'], ['progress', 'n. / v.', '进步；进展'], ['decline', 'v. / n.', '衰退']],
  share: [['divide', 'v.', '分配；分开'], ['common', 'adj.', '共同的'], ['keep', 'v.', '保留']],
  realize: [['awareness', 'n.', '意识'], ['recognize', 'v.', '认出；意识到'], ['overlook', 'v.', '忽略']],
  describe: [['detail', 'n. / v.', '细节；详述'], ['portray', 'v.', '描绘'], ['conceal', 'v.', '隐藏']],
  protect: [['safety', 'n.', '安全'], ['defend', 'v.', '保护；防卫'], ['danger', 'n.', '危险']],
  compare: [['similarity', 'n.', '相似点'], ['difference', 'n.', '差异'], ['contrast', 'n. / v.', '对比']],
  reduce: [['decrease', 'v. / n.', '减少'], ['amount', 'n.', '数量'], ['increase', 'v.', '增加']],
  accept: [['approve', 'v.', '赞成；批准'], ['receive', 'v.', '收到'], ['reject', 'v.', '拒绝']],
  prepare: [['ready', 'adj.', '准备好的'], ['plan', 'n. / v.', '计划'], ['neglect', 'v.', '忽视']],
  avoid: [['prevent', 'v.', '防止'], ['risk', 'n. / v.', '风险；冒险'], ['seek', 'v.', '寻求']],
  discover: [['find', 'v.', '发现；找到'], ['explore', 'v.', '探索'], ['overlook', 'v.', '忽略']],
  handle: [['manage', 'v.', '处理'], ['deal with', 'phr.', '应对；处理'], ['mishandle', 'v.', '处理不当']],
  express: [['communicate', 'v.', '传达'], ['feeling', 'n.', '感受'], ['suppress', 'v.', '压抑']],
  prefer: [['choice', 'n.', '选择'], ['favor', 'v.', '偏爱'], ['dislike', 'v.', '不喜欢']],
  solve: [['answer', 'n. / v.', '答案；回答'], ['problem', 'n.', '问题'], ['complicate', 'v.', '使复杂化']]
};

// Only include genuinely useful confusions. Words without a common confusion
// intentionally keep this section empty instead of receiving filler.
export const manualConfusableWords = {
  accept: ['except', 'expect'], affect: ['effect'], allow: ['let'], appear: ['seem'],
  avoid: ['prevent'], base: ['basis'], become: ['begin'], believe: ['believe in'],
  borrow: ['lend'], bring: ['take'], choose: ['chose', 'choice'], come: ['go'],
  compare: ['contrast'], consider: ['regard'], continue: ['continuous'], could: ['would'],
  decide: ['decision'], depend: ['rely'], describe: ['description'], discover: ['invent'],
  do: ['make'], drive: ['ride'], encourage: ['courage'], expect: ['hope', 'wait'],
  explain: ['describe'], express: ['expression'], fall: ['feel'], feel: ['fill'],
  find: ['found'], give: ['offer'], go: ['come'], grow: ['raise'], have: ['there is'],
  hear: ['listen'], hold: ['keep'], hope: ['wish'], increase: ['rise', 'raise'],
  learn: ['study', 'teach'], leave: ['live'], lend: ['borrow'], let: ['allow'],
  lie: ['lay'], listen: ['hear'], live: ['leave'], look: ['see', 'watch'],
  lose: ['loose'], make: ['do'], manage: ['control'], may: ['might'],
  mean: ['meaning'], meet: ['meat'], notice: ['note'], offer: ['provide'],
  pass: ['past'], pick: ['choose'], prefer: ['rather'], prepare: ['prevent'],
  provide: ['offer', 'supply'], pull: ['push'], raise: ['rise', 'grow'],
  read: ['study'], realize: ['recognize'], receive: ['accept'], reduce: ['decrease'],
  remember: ['remind'], report: ['record'], return: ['go back'], run: ['operate'],
  say: ['tell', 'speak'], see: ['look', 'watch'], set: ['sit'], share: ['divide'],
  show: ['display', 'prove'], sit: ['set'], speak: ['talk', 'say'],
  spend: ['cost', 'pay'], stand: ['sit'], start: ['begin'], stay: ['remain'],
  stop: ['prevent'], suggest: ['recommend'], support: ['assist'], take: ['bring'],
  talk: ['speak'], tell: ['say'], thank: ['think'], think: ['thought'],
  turn: ['return'], use: ['used to'], wait: ['expect'], wear: ['where'],
  will: ['would'], win: ['earn'], work: ['job'], write: ['right']
};

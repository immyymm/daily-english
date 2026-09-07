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
    ['v.', 'to change into or remain in a particular state', '变得；进入某种状态', 5],
    ['v.', 'to continue, disappear, or be used up', '继续；消失；耗尽', 4]
  ],
  get: [
    ['v.', 'to obtain, receive, buy, or bring something', '得到；收到；买到；取来', 0, 'I got a message from my teacher this morning.', '今天早上我收到了老师的信息。'],
    ['v.', 'to reach or arrive at a place', '到达；抵达', 1, 'We got to the station just before the train left.', '我们在火车开走前刚好到达车站。'],
    ['v.', 'to become or cause someone or something to become', '变得；使变得', 0],
    ['v.', 'to cause an action to be completed', '使某事完成', 2]
  ],
  can: [
    ['aux.', 'used to express ability', '能；会', 0],
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
    ['v.', 'to notice someone or something with the eyes', '看见；看到', 0],
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
    ['v.', 'to need someone or something for a purpose', '需要', 1],
    ['v.', 'to lack something necessary', '缺少；不足', 4]
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
    ['v.', 'to recognize, distinguish, or know something', '辨别；看出；判断', 3],
    ['v.', 'to describe or narrate a story, joke, or experience', '讲述；叙述', 4]
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
  might: [
    ['aux.', 'used to express a weak or uncertain possibility', '可能；也许', 0],
    ['aux.', 'used to make a cautious suggestion', '不妨；可以', 1],
    ['aux.', 'used with have for an uncertain or possible past action', '可能已经；或许曾经', 2]
  ],
  must: [
    ['aux.', 'used to express necessity or a strong obligation', '必须；一定要', 0],
    ['aux.', 'used to express a strong logical conclusion', '一定；想必', 2],
    ['aux.', 'used to say that something is unavoidable or strongly recommended', '非得；务必', 4]
  ]
};

export const manualDerivativePacks = {
  become: [
    ['becoming', 'adj.', '合适的；好看的', '作形容词时表示某事物与人的身份、外表或场合相配。']
  ]
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

// Sense-locked direct relations for the human-authored lexicon cards.
// Each gloss and note describes only the sense taught on the card; dictionary
// meanings from unrelated parts of speech must never leak into the UI.
export const directRelationPacks = {
  go: {
    synonyms: [
      ['travel', 'v.', '行进；旅行', 'travel 更强调从一地到另一地的过程，常涉及较长距离；go 是最一般的“去、移动”。'],
      ['move', 'v.', '移动；前进', 'move 强调位置发生变化；go 还可表示前往目的地、事情进展或进入某种状态。'],
      ['proceed', 'v.', '继续进行；前进', 'proceed 较正式，强调按步骤继续；go 更口语，使用范围也更广。'],
      ['depart', 'v.', '离开；出发', 'depart 较正式，只对应 go 的“离开、出发”义项，不表示运转或状态变化。']
    ],
    antonyms: [
      ['stay', 'v.', '停留；留下', 'go 表示离开或前往别处；stay 表示留在原地或维持当前位置。'],
      ['come', 'v.', '来；来到', 'go 通常表示离开说话者或参照点，come 表示向说话者或参照点靠近。']
    ]
  },
  call: {
    synonyms: [['phone', 'v.', '给……打电话', 'phone 只表示通过电话联系；call 还可以表示称呼、命名和召唤。']],
    antonyms: [['hang up', 'phr.', '挂断电话', 'call 表示打电话、建立通话；hang up 表示结束并挂断这次通话。']]
  },
  feel: {
    synonyms: [['sense', 'v.', '感觉到；察觉', 'sense 常指察觉到不易直接观察的变化；feel 还可表示情绪、身体感受和触摸。']],
    antonyms: [['feel nothing', 'phr.', '没有感觉', 'feel 表示体验到情绪或身体感受；feel nothing 表示没有这种感受。']]
  },
  know: {
    synonyms: [['understand', 'v.', '理解；明白', 'understand 强调懂得原因、含义或原理；know 的核心义是掌握或拥有某项信息。']],
    antonyms: [['be unaware of', 'phr.', '不知道；未意识到', 'know 表示已经掌握信息；be unaware of 表示不知道或没有意识到该信息。']]
  },
  pay: {
    synonyms: [['make a payment', 'phr.', '付款；支付', 'make a payment 明确表示完成一笔付款；pay 更简洁，还可直接接人、金额或账单。']],
    antonyms: [['owe', 'v.', '欠；应付未付', 'pay 表示把应付的钱付出；owe 表示仍然欠着某笔钱或人情。']]
  },
  report: {
    synonyms: [['give an account of', 'phr.', '报告；叙述', 'give an account of 表示把事件经过说明出来；report 更简洁，也常用于正式报告或新闻报道。']],
    antonyms: [['conceal', 'v.', '隐瞒；掩盖', 'report 表示把信息说出或提交；conceal 表示有意把信息隐藏起来。']]
  },
  sell: {
    synonyms: [['offer for sale', 'phr.', '出售；把……拿来卖', 'offer something for sale 与 sell 都表示把商品提供给买方；sell 还可强调交易已经完成。']],
    antonyms: [['buy', 'v.', '购买；买入', 'sell 从卖方角度表示出售；buy 从买方角度表示购买。']]
  },
  talk: {
    synonyms: [['speak', 'v.', '说话；交谈', 'speak 可指单方面发言或说某种语言；talk 更常强调交谈和非正式交流。']],
    antonyms: [['remain silent', 'phr.', '保持沉默', 'talk 表示开口交谈；remain silent 表示不说话。']]
  },
  turn: {
    synonyms: [['rotate', 'v.', '旋转；转动', 'rotate 强调围绕中心轴转动；turn 的范围更广，也可表示转向或改变状态。']],
    antonyms: [['keep still', 'phr.', '保持不动', 'turn 在核心义中表示转动；keep still 表示保持静止、不转动。']]
  },
  walk: {
    synonyms: [['stroll', 'v.', '散步；漫步', 'stroll 指轻松、缓慢地走；walk 是不限定速度和目的的一般“步行”。']],
    antonyms: [['stand still', 'phr.', '站着不动', 'walk 表示步行移动；stand still 表示站在原地不移动。']]
  },
  take: {
    synonyms: [['carry', 'v.', '拿；携带', 'carry 强调把人或物带在身上或手中移动；take 常带有从当前位置带走或拿去别处的方向感。']],
    antonyms: [['bring', 'v.', '带来；拿来', 'take 常表示把人或物带离说话者所在处；bring 表示把人或物带向说话者或指定地点。']]
  },
  keep: {
    synonyms: [['continue', 'v.', '继续；保持', 'keep doing 与 continue doing 都可表示动作继续；keep 更强调持续不中断。']],
    antonyms: [['stop', 'v.', '停止；中止', 'keep 表示让动作或状态继续；stop 表示使动作或状态结束。']]
  },
  hear: {
    synonyms: [['perceive a sound', 'phr.', '听见声音', 'hear 表示声音进入听觉、被人听见；listen 强调主动用心听，不能直接当作 hear 的同义替换。']],
    antonyms: [['miss', 'v.', '没听见；漏听', 'hear 表示实际听到；miss 在听觉语境中表示没有听到某句话或声音。']]
  },
  play: {
    synonyms: [['take part in a game', 'phr.', '参加游戏或比赛', 'play 在游戏或体育语境中表示参加；take part in a game 把这一核心动作完整说出。']],
    antonyms: [['work', 'v.', '工作', 'play 表示玩耍或娱乐时，work 表示从事工作；在演奏、扮演等其他词义下二者并非反义。']]
  },
  run: {
    synonyms: [['move quickly on foot', 'phr.', '快速跑动', 'run 的核心动作是双脚快速移动；operate 只对应“运营、操作”这一独立词义，不能替代核心的“跑”。']],
    antonyms: [['stand still', 'phr.', '站着不动', 'run 表示快速移动；stand still 表示停在原地不动。']]
  },
  live: {
    synonyms: [['be alive', 'phr.', '活着；有生命', 'live 的核心义是处于有生命的状态；reside 只对应“居住”这一词义。']],
    antonyms: [['die', 'v.', '死亡', 'live 表示活着；die 表示生命结束。']]
  },
  set: {
    synonyms: [['place', 'v.', '放置；安放', 'place 与 set 都可表示把某物放到指定位置；set 还常带有摆好、设定等含义。']],
    antonyms: [['remove', 'v.', '移走；拿开', 'set 可表示把某物放到位置上；remove 表示把它从该位置移走。']]
  },
  pass: {
    synonyms: [['go past', 'phr.', '经过；越过', 'pass 的核心移动义是从人或地点旁经过；succeed 只对应“通过考试”这一独立词义。']],
    antonyms: [['stop at', 'phr.', '停在……处', 'pass 表示经过而继续向前；stop at 表示到达某处后停下。']]
  },
  appear: {
    synonyms: [['come into view', 'phr.', '出现；进入视野', 'appear 的核心义是从看不见变为看得见；seem 只对应“似乎”这一系动词用法。']],
    antonyms: [['disappear', 'v.', '消失；不见', 'appear 表示出现；disappear 表示从视野中消失。']]
  },
  mean: {
    synonyms: [['signify', 'v.', '表示；意味着', 'signify 较正式，强调某事所代表或意味着的内容；mean 更常用于日常解释词义、意图和结果。']],
    antonyms: [['misrepresent', 'v.', '歪曲；错误表达', 'mean 强调如实表达某个意思；misrepresent 指把意思或事实表达错、歪曲。']]
  },
  become: {
    synonyms: [['grow', 'v.', '逐渐变得', 'grow 后接形容词时常强调渐进变化；become 可表示更一般的状态或身份变化。']],
    antonyms: [['remain', 'v.', '仍然是；保持不变', 'become 表示进入新状态；remain 表示继续保持原来的状态。']]
  },
  happen: {
    synonyms: [['occur', 'v.', '发生', 'occur 比 happen 更正式，常用于书面语和事件描述；happen 更口语化。']],
    antonyms: [['fail to occur', 'phr.', '没有发生', 'happen 表示事件实际发生；fail to occur 明确表示预期事件没有发生。']]
  },
  seem: {
    synonyms: [['appear', 'v.', '似乎；显得', 'appear 作系动词时比 seem 稍正式；两者都表示根据表面信息作出的判断。']],
    antonyms: [['be certain', 'phr.', '确定无疑', 'seem 保留不确定性；be certain 表示已有充分把握。']]
  },
  believe: {
    synonyms: [['trust', 'v.', '相信；信任', 'trust 更强调对人或信息来源的可靠性有信心；believe 更常指认为某事为真。']],
    antonyms: [['doubt', 'v.', '怀疑；不确信', 'believe 表示接受某事为真；doubt 表示对真实性没有把握。']]
  },
  write: {
    synonyms: [['compose', 'v.', '撰写；创作', 'compose 常指有组织地创作文章、信件或音乐；write 的适用范围更广。']],
    antonyms: [['erase', 'v.', '擦除；删去', 'write 把文字记录下来；erase 把已经写下的内容去除。']]
  },
  read: {
    synonyms: [['study', 'v.', '研读；仔细阅读', 'study 强调为了理解或学习而细读；read 也可只是一般阅读。']],
    antonyms: [['skip', 'v.', '跳过；略过', 'read 强调接触并理解文字；skip 指有意不读某一部分。']]
  },
  provide: {
    synonyms: [['supply', 'v.', '供应；提供', 'supply 常强调持续或按需要供应物资；provide 也可提供信息、机会和帮助。']],
    antonyms: [['withhold', 'v.', '拒绝给予；扣留', 'provide 表示把所需之物给出；withhold 表示有意不提供。']]
  },
  understand: {
    synonyms: [['comprehend', 'v.', '理解；领会', 'comprehend 较正式，强调充分理解复杂内容；understand 用法更广。']],
    antonyms: [['misunderstand', 'v.', '误解；理解错误', 'understand 表示正确领会；misunderstand 表示对意思作出错误理解。']]
  },
  change: {
    synonyms: [['alter', 'v.', '改变；更改', 'alter 常指局部调整；change 可指局部变化，也可指彻底改变。']],
    antonyms: [['maintain', 'v.', '维持；保持', 'change 表示变得不同；maintain 表示让原有状态继续。']]
  },
  create: {
    synonyms: [['produce', 'v.', '创造；生产', 'produce 常强调产出具体结果或产品；create 更强调从无到有或发挥创意。']],
    antonyms: [['destroy', 'v.', '毁坏；摧毁', 'create 使事物产生；destroy 使已有事物不复存在。']]
  },
  learn: {
    synonyms: [['master', 'v.', '掌握；精通', 'master 强调已经熟练掌握；learn 强调获得知识或技能的过程。']],
    antonyms: [['forget', 'v.', '忘记', 'learn 把知识或技能获得并记住；forget 表示已学内容从记忆中消失。']]
  },
  include: {
    synonyms: [['contain', 'v.', '包含；含有', 'contain 强调内部实际装有某物；include 强调某物被算作整体的一部分。']],
    antonyms: [['exclude', 'v.', '排除；不包括', 'include 把某项纳入整体；exclude 明确把它排除在外。']]
  },
  follow: {
    synonyms: [['trail', 'v.', '跟随；跟在后面', 'trail 强调在某人或某物后面移动；follow 的适用范围更广，也可表示遵循路线、步骤或建议。']],
    antonyms: [['lead', 'v.', '带领；引导', 'follow 指走在后面或按指引行动；lead 指走在前面并引导别人。']]
  },
  remember: {
    synonyms: [['recall', 'v.', '回想起；记起', 'recall 强调主动把信息从记忆中找回；remember 还可表示一直记得或记得去做。']],
    antonyms: [['forget', 'v.', '忘记', 'remember 表示记得；forget 表示没有记住或想不起来。']]
  },
  speak: {
    synonyms: [['talk', 'v.', '说话；交谈', 'talk 更强调双方交谈；speak 可指说某种语言、发言或正式讲话。']],
    antonyms: [['remain silent', 'phr.', '保持沉默', 'speak 表示开口表达；remain silent 表示不说话。']]
  },
  allow: {
    synonyms: [['permit', 'v.', '允许；准许', 'permit 比 allow 更正式，常见于规章和正式许可；allow 更常用于日常表达。']],
    antonyms: [['forbid', 'v.', '禁止；不准', 'allow 表示给予许可；forbid 表示明确禁止。']]
  },
  continue: {
    synonyms: [['proceed', 'v.', '继续进行；接着做', 'proceed 较正式，常指按步骤继续；continue 可用于几乎所有持续动作。']],
    antonyms: [['stop', 'v.', '停止；中止', 'continue 表示不中断地进行；stop 表示让动作结束。']]
  },
  spend: {
    synonyms: [['use', 'v.', '花费；使用', 'spend 专门搭配时间或金钱；use 可搭配更广泛的资源和工具。']],
    antonyms: [['save', 'v.', '节省；储蓄', 'spend 表示把时间或金钱用掉；save 表示保留下来供以后使用。']]
  },
  consider: {
    synonyms: [['evaluate', 'v.', '评估；评价', 'evaluate 强调按标准判断价值或质量；consider 强调认真思考，也可表示“认为”。']],
    antonyms: [['dismiss', 'v.', '不予考虑；摒弃', 'consider 表示认真纳入思考；dismiss 可表示未经深入考虑便排除。']]
  },
  offer: {
    synonyms: [['provide', 'v.', '提供；供给', 'provide 强调把需要的事物供给某人；offer 更强调主动表示愿意给出，对方可以接受或拒绝。']],
    antonyms: [['refuse', 'v.', '拒绝；不接受', 'offer 表示主动给出；refuse 表示拒绝给出、接受或执行。']]
  },
  expect: {
    synonyms: [['anticipate', 'v.', '预期；预料', 'anticipate 较正式，也可含提前准备之意；expect 是最常用的“预期”。']],
    antonyms: [['doubt', 'v.', '怀疑；不确信', 'expect 表示认为某事很可能发生；doubt 表示不确定或不相信会发生。']]
  },
  require: {
    synonyms: [['demand', 'v.', '要求；需要', 'demand 语气更强，常指坚决要求；require 也可客观表示“需要”。']],
    antonyms: [['waive', 'v.', '放弃要求；免除', 'require 表示必须满足某项要求；waive 表示正式取消这项要求。']]
  },
  listen: {
    synonyms: [['hear attentively', 'phr.', '专心听', 'listen 强调主动注意声音；hear attentively 明确补出了“有意识地听”这一层。']],
    antonyms: [['ignore', 'v.', '忽视；不理会', 'listen 表示主动留意对方的话；ignore 表示有意不予注意。']]
  },
  decide: {
    synonyms: [['determine', 'v.', '决定；确定', 'determine 较正式，常强调经过分析后确定；decide 更常用于日常选择。']],
    antonyms: [['hesitate', 'v.', '犹豫；迟疑', 'decide 表示已经作出选择；hesitate 表示迟迟不能决定。']]
  },
  suggest: {
    synonyms: [['recommend', 'v.', '建议；推荐', 'recommend 通常明确认为某选择较好；suggest 也可只是提出想法或表示迹象。']],
    antonyms: [['discourage', 'v.', '劝阻；使打消念头', 'suggest 可提出某种做法；discourage 在行动建议语境中表示劝对方不要做。']]
  },
  support: {
    synonyms: [['assist', 'v.', '协助；帮助', 'assist 较正式，强调帮助完成具体任务；support 还可表示情感支持、赞成立场或支撑重量。']],
    antonyms: [['oppose', 'v.', '反对', 'support 表示赞成某观点或计划时，oppose 是直接反义词。']]
  },
  reach: {
    synonyms: [['arrive at', 'phr.', '到达；抵达', 'arrive at 与 reach 都可表示到达地点；reach 直接接地点宾语，arrive at 需要介词 at。']],
    antonyms: [['miss', 'v.', '未达到；错过', 'reach 表示到达目标或地点；miss 在对应语境中表示没有达到或错过。']]
  },
  remain: {
    synonyms: [['stay', 'v.', '保持；停留', 'stay 更常用于地点或短期状态；remain 稍正式，也常接形容词。']],
    antonyms: [['change', 'v.', '改变；变化', 'remain 表示状态继续不变；change 表示变成不同状态。']]
  },
  explain: {
    synonyms: [['clarify', 'v.', '澄清；阐明', 'clarify 强调消除已有疑惑；explain 更广泛地说明原因、过程或含义。']],
    antonyms: [['confuse', 'v.', '使困惑；使混淆', 'explain 使内容更清楚；confuse 使内容更难理解。']]
  },
  choose: {
    synonyms: [['select', 'v.', '挑选；选定', 'select 稍正式，强调从一组对象中挑出；choose 的使用范围更广。']],
    antonyms: [['reject', 'v.', '拒绝；排除', 'choose 表示选中某项；reject 表示明确不选择或不接受。']]
  },
  develop: {
    synonyms: [['build', 'v.', '发展；逐步建立', 'build 强调逐步积累形成；develop 还可表示自然成长、培养能力或开发产品。']],
    antonyms: [['decline', 'v.', '衰退；下降', 'develop 表示成长或进步；decline 表示逐渐变弱或变差。']]
  },
  share: {
    synonyms: [['distribute', 'v.', '分发；分配', 'distribute 强调有计划地分给多人；share 也可共同拥有或分享想法和经历。']],
    antonyms: [['keep', 'v.', '保留；不分享', 'share 表示让他人共同获得；keep 在此语境中表示留给自己。']]
  },
  realize: {
    synonyms: [['recognize', 'v.', '意识到；认出', 'recognize 常指认出或承认已存在的事实；realize 强调突然清楚地意识到。']],
    antonyms: [['overlook', 'v.', '忽略；未注意到', 'realize 表示意识到某事；overlook 表示没有注意到。']]
  },
  describe: {
    synonyms: [['portray', 'v.', '描绘；刻画', 'portray 常用于生动刻画人物或场景；describe 更一般地说明特征。']],
    antonyms: [['conceal', 'v.', '隐藏；隐瞒', 'describe 把特征表达出来；conceal 把信息隐藏起来。']]
  },
  increase: {
    synonyms: [['raise', 'v.', '提高；增加', 'raise 是及物动词，必须接宾语；increase 既可及物，也可不及物。']],
    antonyms: [['decrease', 'v.', '减少；降低', 'increase 表示数量或程度上升；decrease 表示下降。']]
  },
  protect: {
    synonyms: [['defend', 'v.', '保护；防卫', 'defend 更强调抵抗攻击或批评；protect 泛指使人或物免受伤害。']],
    antonyms: [['expose', 'v.', '使暴露；使面临风险', 'protect 使对象远离危险；expose 使对象直接面对危险或影响。']]
  },
  compare: {
    synonyms: [['contrast', 'v.', '对比；比较差异', 'contrast 专门突出差异；compare 可检查相同点和不同点。']],
    antonyms: [['treat as identical', 'phr.', '视为完全相同', 'compare 会辨认相同与不同之处；treat as identical 表示不作这种区分。']]
  },
  reduce: {
    synonyms: [['decrease', 'v.', '减少；降低', 'reduce 通常是及物动词，强调使某物减少；decrease 也可不及物。']],
    antonyms: [['increase', 'v.', '增加；提高', 'reduce 使数量或程度降低；increase 使其升高。']]
  },
  accept: {
    synonyms: [['receive', 'v.', '收到；接收', 'receive 只说明收到；accept 还表示愿意接纳、认可或承担。']],
    antonyms: [['reject', 'v.', '拒绝；不接受', 'accept 表示接纳；reject 表示明确拒绝。']]
  },
  prepare: {
    synonyms: [['ready', 'v.', '使准备好', 'ready 作动词时表示使某人或某物准备好；prepare 更常用，也常与 for 搭配。']],
    antonyms: [['neglect', 'v.', '疏于准备；忽视', 'prepare 表示提前做好所需工作；neglect 表示没有给予必要注意。']]
  },
  avoid: {
    synonyms: [['evade', 'v.', '躲避；逃避', 'evade 较正式，常指设法逃避人、责任或追捕；avoid 是更中性的“避开、避免”。']],
    antonyms: [['seek', 'v.', '寻求；主动寻找', 'avoid 表示有意远离；seek 表示主动寻找或追求。']]
  },
  notice: {
    synonyms: [['observe', 'v.', '注意到；观察到', 'observe 较正式，常含仔细观察；notice 常指注意到某个变化或细节。']],
    antonyms: [['ignore', 'v.', '忽视；不理会', 'notice 表示注意到；ignore 表示有意不予注意。']]
  },
  affect: {
    synonyms: [['influence', 'v.', '影响', 'influence 常指渐进或间接影响；affect 更直接表示对人或事物产生变化。']],
    antonyms: [['leave unchanged', 'phr.', '不产生改变', 'affect 表示造成变化；leave unchanged 表示保持原样。']]
  },
  manage: {
    synonyms: [['handle', 'v.', '处理；应付', 'handle 强调应对具体任务或问题；manage 还可表示经营管理或设法完成。']],
    antonyms: [['fail', 'v.', '未能做到；失败', 'manage to do 表示克服困难后成功做到；fail to do 表示未能做到。']]
  },
  improve: {
    synonyms: [['enhance', 'v.', '增强；提升', 'enhance 较正式，强调提升质量、价值或效果；improve 既可使某物变好，也可自行好转。']],
    antonyms: [['worsen', 'v.', '恶化；使变差', 'improve 表示变好或使其变好；worsen 表示变差或使其变差。']]
  },
  discover: {
    synonyms: [['find', 'v.', '找到；发现', 'find 可指找到已知目标；discover 常强调首次发现此前未知的事实或事物。']],
    antonyms: [['overlook', 'v.', '忽略；未发现', 'discover 表示发现某事；overlook 表示未注意到。']]
  },
  handle: {
    synonyms: [['manage', 'v.', '处理；应对', 'manage 强调统筹或成功应付；handle 常指直接处理具体事务、物品或问题。']],
    antonyms: [['mishandle', 'v.', '处理不当', 'handle 表示处理；mishandle 明确表示处理方式错误。']]
  },
  achieve: {
    synonyms: [['accomplish', 'v.', '完成；实现', 'accomplish 常搭配任务或工作；achieve 更常搭配目标、成绩和成功。']],
    antonyms: [['fail', 'v.', '未能实现；失败', 'achieve 表示成功达到目标；fail 表示未能达到。']]
  },
  express: {
    synonyms: [['communicate', 'v.', '传达；表达', 'communicate 强调把信息传给别人；express 更常指把思想、感情或观点表现出来。']],
    antonyms: [['suppress', 'v.', '压抑；不表达', 'express 把想法或情感表现出来；suppress 表示有意压住、不让它显露。']]
  },
  encourage: {
    synonyms: [['motivate', 'v.', '激励；促使', 'motivate 强调产生行动动力；encourage 还可通过支持或肯定增强信心。']],
    antonyms: [['discourage', 'v.', '使泄气；劝阻', 'encourage 增强信心或促进行动；discourage 降低信心或劝人不要行动。']]
  },
  depend: {
    synonyms: [['be determined by', 'phr.', '取决于；由……决定', 'be determined by 准确对应 depend on 的“结果由某条件决定”这一核心用法；rely on 更偏向依靠人或资源。']],
    antonyms: [['be independent of', 'phr.', '不取决于；独立于', 'depend on 表示结果受某条件影响；be independent of 表示不受该条件决定。']]
  },
  prefer: {
    synonyms: [['favor', 'v.', '更喜欢；偏爱', 'favor 较正式，也可表示支持；prefer 明确表达在两个选择中更喜欢一个。']],
    antonyms: [['dislike', 'v.', '不喜欢；厌恶', 'prefer 表示较喜欢；dislike 表示不喜欢。']]
  },
  solve: {
    synonyms: [['resolve', 'v.', '解决；化解', 'resolve 常用于问题、争端或困难；solve 也常用于题目、谜题和计算问题。']],
    antonyms: [['complicate', 'v.', '使复杂化', 'solve 使问题得到答案或消失；complicate 使问题更难处理。']]
  },
  can: {
    synonyms: [['be able to', 'phr.', '能够做某事', 'be able to 可用于 can 没有对应形式的时态；can 更简洁，常用于现在的能力和一般可能性。']],
    antonyms: [['be unable to', 'phr.', '无法做某事', 'can 表示具备能力或可能性；be unable to 明确表示没有能力做到。']]
  },
  could: {
    synonyms: [['was able to', 'phr.', '过去能够', 'was able to 常强调某次具体情境中成功做到；could 更常表示过去的一般能力。']],
    antonyms: [['could not', 'phr.', '不能；不可能', 'could 表示过去能力、可能性或委婉请求；could not 否定对应能力或可能性。']]
  },
  may: {
    synonyms: [['might', 'aux.', '也许；可能', 'might 往往比 may 表达更弱或更谨慎的可能性；正式许可通常优先用 may。']],
    antonyms: [['may not', 'phr.', '可能不；不可以', 'may 表示可能或许可；may not 可表示可能不会，或在许可语境中表示不允许。']]
  },
  might: {
    synonyms: [['may', 'aux.', '可能；也许', 'may 通常比 might 的可能性语气稍强；might 也常用于谨慎建议和非真实情境。']],
    antonyms: [['certainly will', 'phr.', '肯定会', 'might 保留明显的不确定性；certainly will 表示说话者有很强把握。']]
  },
  must: {
    synonyms: [['have to', 'phr.', '必须；不得不', 'have to 常强调外部规定或客观需要；must 也可表达说话者的强烈要求或推断。']],
    antonyms: [['need not', 'phr.', '不必；无须', 'must 表示必须做；need not 表示没有必要做，而不是禁止做。']]
  },
  should: {
    synonyms: [['ought to', 'phr.', '应该；应当', 'ought to 与 should 都可给建议，语气稍正式；should 的使用范围更广。']],
    antonyms: [['should not', 'phr.', '不应该', 'should 表示建议或合理预期；should not 表示建议不要做或认为不应发生。']]
  },
  will: {
    synonyms: [['be going to', 'phr.', '将要；打算', 'be going to 常用于已有计划或有迹象的预测；will 常用于即时决定、承诺和一般预测。']],
    antonyms: [['will not', 'phr.', '将不会；不愿意', 'will 表示未来或意愿；will not 否定未来结果，也可表示拒绝。']]
  },
  would: {
    synonyms: [['used to', 'phr.', '过去常常', 'used to 与 would 都可描述过去反复发生的动作；状态和过去事实通常只能用 used to。']],
    antonyms: [['would not', 'phr.', '不会；不愿意', 'would 可表达假设结果、过去习惯或礼貌意愿；would not 否定相应结果或意愿。']]
  }
};

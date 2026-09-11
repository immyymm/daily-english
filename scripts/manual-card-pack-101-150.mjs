// Human-reviewed semantic content for learningPriority.sequence 101-150.
//
// This module is intentionally data-only. The build pipeline can merge these
// fields into its normal override object without coupling this review batch to
// the shared generator. Context phrases and related vocabulary are independent
// sections: neither is copied from fixed phrases or relation lists.

const contextGroup = (category, source) => [
  category,
  source.split(';').map((row) => row.split('='))
];

const relatedGroup = (category, source) => [
  category,
  source.split(';').map((row) => row.split('|'))
];

const derivative = (word, partOfSpeech, chinese, note) => [word, partOfSpeech, chinese, note];

export const manualCardPacks101150 = {
  end: {
    meanings: [
      ['v.', 'to finish or come to the final point of an activity, period, or event', '结束；终止', 'The meeting ended shortly after six.', '会议六点刚过就结束了。'],
      ['v.', 'to cause an activity, situation, or relationship to finish', '使结束；终结', 'A sincere apology ended the argument.', '一次真诚的道歉结束了争论。'],
      ['v.', 'to finish in a particular way, place, or result', '最终处于；以……告终', 'The film ends with a surprising discovery.', '这部电影以一个惊人的发现收尾。']
    ],
    contexts: [
      contextGroup('会议与活动收尾', 'end a meeting early=提前结束会议;end the session on time=准时结束活动;end the ceremony with music=以音乐结束仪式'),
      contextGroup('冲突与关系终结', 'end a long friendship=结束一段长久的友谊;end a bitter dispute=终结激烈争端;end years of conflict=结束多年的冲突'),
      contextGroup('结果与收束方式', 'end in failure=以失败告终;end with a warning=以警告收尾;end on a hopeful note=以充满希望的方式结束'),
      contextGroup('时间与期限', 'end before midnight=在午夜前结束;end after three weeks=三周后结束;end when funding stops=资金停止时结束')
    ],
    derivatives: [
      derivative('ending', 'n.', '结局；结尾', '常指故事、电影或事件的结尾。'),
      derivative('endpoint', 'n.', '终点；端点', '可指路线或范围的终止点，也常指软件系统中的访问接口。'),
      derivative('endless', 'adj.', '无尽的；没完没了的', '常修饰 waiting、discussion 和 possibilities。'),
      derivative('endlessly', 'adv.', '无休止地', '说明动作持续很久，似乎没有尽头。')
    ],
    related: [
      relatedGroup('时间边界', 'deadline|n.|截止日期;duration|n.|持续时间;phase|n.|阶段;interval|n.|间隔'),
      relatedGroup('结果与后果', 'result|n.|结果;consequence|n.|后果;aftermath|n.|后续影响;resolution|n.|解决；结局'),
      relatedGroup('收尾事件', 'finale|n.|终场；结尾;farewell|n.|告别;departure|n.|离开；启程;transition|n.|过渡；转变')
    ]
  },

  require: {
    fixedPhrases: [
      ['require something', '需要某物', 'This recipe requires fresh herbs.', '这道菜需要新鲜香草。'],
      ['require someone to do something', '要求某人做某事', 'The rules require visitors to show identification.', '规定要求访客出示身份证件。'],
      ['be required to do something', '被要求做某事', 'All staff are required to attend the training.', '所有员工都必须参加培训。'],
      ['require careful planning', '需要周密规划', 'The move will require careful planning.', '这次搬迁需要周密规划。'],
      ['require further investigation', '需要进一步调查', 'The unusual result requires further investigation.', '这个异常结果需要进一步调查。'],
      ['require immediate attention', '需要立即处理', 'This safety issue requires immediate attention.', '这个安全问题需要立即处理。'],
      ['require written permission', '需要书面许可', 'Access to the archive requires written permission.', '查阅档案需要书面许可。'],
      ['require a great deal of patience', '需要极大的耐心', 'Teaching young children requires a great deal of patience.', '教年幼的孩子需要极大的耐心。'],
      ['require proof of identity', '要求提供身份证明', 'The bank may require proof of identity.', '银行可能要求提供身份证明。'],
      ['as required by law', '依照法律要求', 'The records are kept as required by law.', '这些记录依照法律要求保存。']
    ],
    contexts: [
      contextGroup('资格与入学条件', 'require previous experience=要求具备相关经验;require a valid certificate=要求持有效证书;require applicants to apply online=要求申请人在线申请'),
      contextGroup('资源与工作量', 'require additional staff=需要增加人员;require substantial investment=需要大量投资;require hours of practice=需要数小时练习'),
      contextGroup('规则与义务', 'require parental consent=需要家长同意;require every member to vote=要求每位成员投票;require compliance with the policy=要求遵守政策'),
      contextGroup('任务难度与品质', 'require close attention=需要密切关注;require technical expertise=需要专业技术;require a different approach=需要采用不同方法')
    ],
    derivatives: [
      derivative('requirement', 'n.', '要求；必要条件', '常用结构 meet a requirement 和 entry requirements。'),
      derivative('required', 'adj.', '必需的；规定的', '指规则或任务所要求的，如 required reading。')
    ],
    related: [
      relatedGroup('资格条件', 'qualification|n.|资格；资历;criterion|n.|标准；准则;eligibility|n.|合格条件;prerequisite|n.|先决条件'),
      relatedGroup('所需资源', 'staffing|n.|人员配置;budget|n.|预算;equipment|n.|设备;permission|n.|许可'),
      relatedGroup('规则义务', 'rule|n.|规则;duty|n.|义务；职责;compliance|n.|遵守；合规;necessity|n.|必要性')
    ],
    commonErrors: [
      ['The job requires to travel.', 'The job requires you to travel.', 'require 后不能直接接 to do；要么接人再接 to do，要么改用 require doing。'],
      ['Employees require working eight hours.', 'Employees are required to work eight hours.', '表示“员工被要求”要用被动结构 be required to do。']
    ]
  },

  listen: {
    contexts: [
      contextGroup('主动倾听', 'listen with full attention=全神贯注地听;listen without interrupting=不打断地听;listen patiently to a complaint=耐心听取投诉'),
      contextGroup('声音与媒体', 'listen to a podcast episode=收听一期播客;listen to live music=听现场音乐;listen to the morning news=收听早间新闻'),
      contextGroup('信息与指令', 'listen for your name=留心听自己的名字;listen for the alarm=留意警报声;listen carefully to the instructions=认真听指示'),
      contextGroup('建议与沟通', 'listen to expert advice=听取专家建议;listen to both sides=听取双方意见;listen before you respond=先听再回应')
    ],
    derivatives: [
      derivative('listener', 'n.', '听者；听众', '指听广播、音乐或他人讲话的人。'),
      derivative('listening', 'n. / adj.', '听；听力的', '常见于 listening skills 和 listening practice。')
    ],
    related: [
      relatedGroup('声音来源', 'voice|n.|声音；嗓音;speech|n.|讲话；演说;music|n.|音乐;noise|n.|噪声'),
      relatedGroup('听觉信息', 'instruction|n.|指示;announcement|n.|公告;conversation|n.|对话;recording|n.|录音'),
      relatedGroup('沟通品质', 'attention|n.|注意力;patience|n.|耐心;empathy|n.|同理心;response|n.|回应')
    ],
    confusables: [
      ['hear', 'v.', '听见', 'listen 表示主动把注意力放在声音上，常接 to；hear 表示声音自然进入耳朵。']
    ]
  },

  agree: {
    meanings: [
      ['v.', 'to have the same opinion as another person', '同意；赞同', 'I agree with you about the main problem.', '我同意你对主要问题的看法。'],
      ['v.', 'to reach the same decision after discussion', '商定；达成一致', 'We agreed on a launch date.', '我们商定了发布日期。'],
      ['v.', 'to say yes to a proposal or request', '答应；同意', 'She agreed to help with the event.', '她答应帮忙筹办活动。'],
      ['v.', 'to match or be consistent with something', '相符；一致', 'The two reports agree on the key facts.', '两份报告在关键事实上一致。']
    ],
    contexts: [
      contextGroup('观点一致', 'agree completely with the conclusion=完全赞同结论;agree in principle=原则上同意;agree about the main cause=对主要原因意见一致'),
      contextGroup('协商决定', 'agree on a final price=商定最终价格;agree on the next step=就下一步达成一致;agree among themselves=他们内部达成一致'),
      contextGroup('接受提议', 'agree to the revised terms=同意修改后的条款;agree to take part=答应参加;agree to meet again=同意再次会面'),
      contextGroup('资料相符', 'agree with the available evidence=与现有证据相符;agree closely with the estimate=与估算非常接近;agree on the basic facts=对基本事实看法一致')
    ],
    derivatives: [
      derivative('agreement', 'n.', '协议；一致', '常用结构 reach an agreement。'),
      derivative('disagreement', 'n.', '分歧；意见不合', '指意见或说法之间的不一致。'),
      derivative('agreeable', 'adj.', '令人愉快的；可接受的', '常表示某事令人满意或双方都能接受。'),
      derivative('agreeably', 'adv.', '愉快地；惬意地', '多用于较正式表达。')
    ],
    related: [
      relatedGroup('讨论与协商', 'discussion|n.|讨论;negotiation|n.|谈判;compromise|n.|妥协;consensus|n.|共识'),
      relatedGroup('意见与立场', 'opinion|n.|意见;viewpoint|n.|观点;position|n.|立场;objection|n.|异议'),
      relatedGroup('协议内容', 'term|n.|条款;condition|n.|条件;proposal|n.|提议;commitment|n.|承诺')
    ],
    confusables: [
      ['accept', 'v.', '接受', 'agree 强调意见一致或答应做事；accept 强调接受提议、物品或现实，通常直接接宾语。']
    ]
  },

  cut: {
    contexts: [
      contextGroup('食物与材料', 'cut the bread into slices=把面包切成片;cut fabric to size=按尺寸裁布;cut vegetables into strips=把蔬菜切成条'),
      contextGroup('数量与成本', 'cut annual expenses=削减年度开支;cut production by half=把产量减半;cut unnecessary paperwork=减少不必要的文书工作'),
      contextGroup('伤口与工具', 'cut your finger on glass=被玻璃划伤手指;cut cleanly through metal=利落地切穿金属;cut with a sharp blade=用锋利刀片切割'),
      contextGroup('停止与编辑', 'cut a scene from the film=从电影中删掉一个场景;cut the power supply=切断电源;cut all contact with them=与他们断绝一切联系')
    ],
    derivatives: [
      derivative('cutter', 'n.', '切割器；切割者', '指用于切割的工具或从事切割的人。'),
      derivative('cutting', 'n. / adj.', '切割；尖刻的', '作名词指切割或插枝，作形容词可指言辞尖刻。'),
      derivative('uncut', 'adj.', '未切割的；未删剪的', '可形容宝石、材料或未经删剪的电影版本。')
    ],
    antonyms: [
      ['join', 'v.', '接合；连接', '只在 cut 表示切断连接的义项下相反；join 把分开的部分接合起来。'],
      ['increase', 'v.', '增加；提高', '只在 cut 表示削减数量、成本或预算的义项下相反；increase 使同一数值上升。']
    ],
    related: [
      relatedGroup('切割工具', 'knife|n.|刀;blade|n.|刀片;scissors|n.|剪刀;saw|n.|锯'),
      relatedGroup('材料形状', 'slice|n.|薄片;strip|n.|条;piece|n.|一块;edge|n.|边缘'),
      relatedGroup('预算调整', 'budget|n.|预算;expense|n.|开支;saving|n.|节省;efficiency|n.|效率')
    ]
  },

  decide: {
    contexts: [
      contextGroup('个人选择', 'decide which route to take=决定走哪条路线;decide what matters most=决定什么最重要;decide against moving abroad=决定不移居国外'),
      contextGroup('团队决策', 'decide by a majority vote=通过多数票决定;decide the final schedule=确定最终日程;decide jointly with the client=与客户共同决定'),
      contextGroup('时间与过程', 'decide after careful thought=深思熟虑后决定;decide at the last minute=最后一刻决定;decide once all facts are known=了解全部事实后再决定'),
      contextGroup('正式裁定', 'decide a legal dispute=裁决法律争端;decide who qualifies=判定谁符合资格;decide the outcome of the election=决定选举结果')
    ],
    derivatives: [
      derivative('decision', 'n.', '决定；决策', '常用结构 make a decision。'),
      derivative('indecision', 'n.', '犹豫不决', '指无法作出决定的状态。'),
      derivative('decisive', 'adj.', '果断的；决定性的', '可形容人果断，也可形容关键因素。'),
      derivative('indecisive', 'adj.', '优柔寡断的；非决定性的', '表示不能果断决定或结果不明确。'),
      derivative('decisively', 'adv.', '果断地；决定性地', '说明行动迅速明确。')
    ],
    related: [
      relatedGroup('选择依据', 'evidence|n.|证据;priority|n.|优先事项;criterion|n.|标准;risk|n.|风险'),
      relatedGroup('决策过程', 'option|n.|选项;alternative|n.|替代方案;deliberation|n.|审议;judgment|n.|判断'),
      relatedGroup('决定结果', 'outcome|n.|结果;policy|n.|政策;verdict|n.|裁决;commitment|n.|承诺')
    ]
  },

  pass: {
    meanings: [
      ['v.', 'to move past a person or place', '经过；越过', 'We passed the station without stopping.', '我们经过车站时没有停下。'],
      ['v.', 'to succeed in a test, inspection, or course', '通过（考试、检查或课程）', 'She passed her driving test on Friday.', '她星期五通过了驾照考试。'],
      ['v.', 'to give something to another person', '递给；传给', 'Please pass the salt to your brother.', '请把盐递给你弟弟。'],
      ['v.', 'to be approved formally by a vote', '通过（法案或提案）', 'Parliament passed the new law in June.', '议会在六月通过了这项新法律。'],
      ['v.', 'to go by in time', '流逝；过去', 'Several weeks passed before we heard back.', '过了几个星期我们才收到回复。']
    ],
    contexts: [
      contextGroup('移动与经过', 'pass through a narrow gate=穿过狭窄的门;pass close to the coast=从海岸附近经过;pass another runner near the finish=在终点附近超过另一名跑者'),
      contextGroup('考试与标准', 'pass the entrance exam=通过入学考试;pass a safety inspection=通过安全检查;pass with a high score=以高分通过'),
      contextGroup('递交与传递', 'pass the message along=把消息传下去;pass the microphone around=把麦克风依次传递;pass control to a deputy=把控制权交给副手'),
      contextGroup('时间与立法', 'pass quickly in good company=相聚时光过得很快;pass a bill unanimously=一致通过法案;pass without further debate=未经进一步辩论便获通过')
    ],
    derivatives: [
      derivative('passage', 'n.', '通道；经过；段落', '可指通道、时间的流逝或文章的一段。'),
      derivative('passing', 'n. / adj.', '经过；短暂的；及格的', '常见于 a passing grade 和 the passing of time。'),
      derivative('passable', 'adj.', '尚可的；可通行的', '可形容质量勉强合格或道路可以通行。')
    ],
    synonyms: [
      ['go past', 'phr.', '经过', '专用于移动经过某人或某地；不表示通过考试、递东西或通过法案。'],
      ['succeed in', 'phr.', '顺利通过', '接考试、课程或检查；pass 可直接接 exam，而 succeed 要接 in。'],
      ['hand', 'v.', '递给', '强调用手把东西交给某人；pass 还可表示沿一排人传递。'],
      ['approve', 'v.', '批准；通过', '用于机构批准方案；pass a law 强调法案经表决正式通过。']
    ],
    related: [
      relatedGroup('路线与位置', 'route|n.|路线;checkpoint|n.|检查站;intersection|n.|交叉路口;destination|n.|目的地'),
      relatedGroup('考试评价', 'exam|n.|考试;grade|n.|成绩;certificate|n.|证书;qualification|n.|资格'),
      relatedGroup('立法程序', 'bill|n.|法案;vote|n.|投票;parliament|n.|议会;amendment|n.|修正案')
    ]
  },

  eat: {
    fixedPhrases: [
      ['eat breakfast', '吃早餐', 'I eat breakfast before I leave for work.', '我上班出门前吃早餐。'],
      ['eat a balanced diet', '饮食均衡', 'Children should eat a balanced diet.', '孩子们应该保持均衡饮食。'],
      ['eat out', '在外面吃饭', 'We eat out once or twice a month.', '我们每个月在外面吃一两次饭。'],
      ['eat at home', '在家吃饭', 'Cooking lets us eat at home more often.', '自己做饭让我们更常在家吃饭。'],
      ['eat together', '一起吃饭', 'Our whole family eats together on Sundays.', '我们全家星期日一起吃饭。'],
      ['eat slowly', '慢慢吃', 'Try to eat slowly and enjoy the meal.', '尽量慢慢吃，好好享用这顿饭。'],
      ['eat well', '吃得健康；吃得好', 'You need to eat well while you recover.', '康复期间你需要吃得健康。'],
      ['eat too much', '吃得过多', 'I ate too much at dinner.', '我晚饭吃得太多了。'],
      ['eat something light', '吃些清淡的东西', 'I usually eat something light before training.', '训练前我通常吃些清淡的东西。'],
      ['have something to eat', '吃点东西', 'Let us have something to eat before the journey.', '出发前我们吃点东西吧。']
    ],
    contexts: [
      contextGroup('正餐与时间', 'eat lunch at noon=中午吃午饭;eat dinner with friends=与朋友共进晚餐;eat before the long journey=长途旅行前吃东西'),
      contextGroup('食物选择', 'eat plenty of vegetables=多吃蔬菜;eat less processed food=少吃加工食品;eat fresh fruit as a snack=把新鲜水果当零食吃'),
      contextGroup('食量与方式', 'eat only a small portion=只吃一小份;eat directly from the bowl=直接从碗里吃;eat until you feel satisfied=吃到有饱足感为止'),
      contextGroup('饮食限制', 'eat without added sugar=吃不加糖的食物;eat according to the meal plan=按照餐食计划进食;eat safely with an allergy=过敏时安全饮食')
    ],
    derivatives: [
      derivative('eater', 'n.', '食用者；……食者', '常见于 picky eater 和 meat eater。'),
      derivative('eating', 'n. / adj.', '吃；饮食的', '常见于 healthy eating 和 eating habits。')
    ],
    related: [
      relatedGroup('餐次与菜品', 'breakfast|n.|早餐;lunch|n.|午餐;dinner|n.|晚餐;snack|n.|小吃；零食'),
      relatedGroup('营养与健康', 'nutrition|n.|营养;protein|n.|蛋白质;fiber|n.|膳食纤维;calorie|n.|卡路里'),
      relatedGroup('用餐用品', 'plate|n.|盘子;bowl|n.|碗;fork|n.|叉子;chopsticks|n.|筷子')
    ]
  },

  report: {
    contexts: [
      contextGroup('新闻与事实', 'report the latest findings=报告最新发现;report events accurately=准确报道事件;report from the scene=从现场报道'),
      contextGroup('问题与事故', 'report a security breach=报告安全漏洞;report damage to the front desk=向前台报告损坏情况;report suspicious activity=报告可疑活动'),
      contextGroup('工作与进展', 'report weekly progress=汇报每周进展;report directly to the director=直接向主管汇报;report a decline in sales=报告销量下降'),
      contextGroup('正式记录', 'report income on a tax return=在报税表上申报收入;report the matter to the police=向警方报告此事;report results in writing=以书面形式报告结果')
    ],
    derivatives: [
      derivative('reporter', 'n.', '记者；报告人', '指采访并报道新闻的人，也可指正式报告者。'),
      derivative('reporting', 'n. / adj.', '报道；汇报的', '常见于 news reporting 和 reporting requirements。'),
      derivative('reportable', 'adj.', '应报告的；可报道的', '常修饰依法或依规定必须上报的事件、收入和伤害。'),
      derivative('reportedly', 'adv.', '据报道；据称', '用于转述尚未由说话人亲自证实的消息。')
    ],
    related: [
      relatedGroup('事实与来源', 'fact|n.|事实;evidence|n.|证据;data|n.|数据;source|n.|消息来源'),
      relatedGroup('新闻渠道', 'newspaper|n.|报纸;broadcast|n.|广播节目;website|n.|网站;press|n.|新闻界'),
      relatedGroup('报告事项', 'incident|n.|事件;crime|n.|犯罪;progress|n.|进展;finding|n.|调查结果')
    ]
  },

  suggest: {
    contexts: [
      contextGroup('提出建议', 'suggest a practical alternative=提出实用的替代方案;suggest meeting after lunch=建议午饭后见面;suggest that we postpone the vote=建议我们推迟投票'),
      contextGroup('推荐选择', 'suggest a quiet restaurant=推荐一家安静的餐厅;suggest books for beginners=为初学者推荐书籍;suggest the safest route=推荐最安全的路线'),
      contextGroup('证据暗示', 'suggest a link between the events=表明事件之间有关联;suggest that demand is falling=表明需求正在下降;suggest a possible cause=暗示一个可能原因'),
      contextGroup('委婉表达', 'strongly suggest seeking advice=强烈建议寻求意见;tentatively suggest a date=试探性地提出日期;suggest another way forward=提出另一条前进路线')
    ],
    derivatives: [
      derivative('suggestion', 'n.', '建议；暗示', '常用结构 make a suggestion。'),
      derivative('suggestive', 'adj.', '暗示性的；使人联想到的', '说明某事含有暗示或令人联想到某物。'),
      derivative('suggestively', 'adv.', '暗示地；引人联想地', '描述带有暗示意味的说话或动作方式。')
    ],
    related: [
      relatedGroup('建议内容', 'idea|n.|主意;option|n.|选项;alternative|n.|替代方案;recommendation|n.|建议'),
      relatedGroup('判断依据', 'clue|n.|线索;pattern|n.|规律;indication|n.|迹象;possibility|n.|可能性'),
      relatedGroup('讨论反馈', 'feedback|n.|反馈;discussion|n.|讨论;objection|n.|异议;response|n.|回应')
    ]
  },

  sell: {
    contexts: [
      contextGroup('商品与零售', 'sell handmade jewelry online=在线销售手工首饰;sell fresh produce locally=在本地出售新鲜农产品;sell tickets at the entrance=在入口处售票'),
      contextGroup('价格与交易', 'sell at a reasonable price=以合理价格出售;sell for twice the original price=以原价两倍售出;sell directly to consumers=直接卖给消费者'),
      contextGroup('市场与业绩', 'sell well overseas=在海外畅销;sell out within minutes=几分钟内售罄;sell more during the holiday season=节日期间卖得更多'),
      contextGroup('说服与推广', 'sell the idea to investors=说服投资者接受这个想法;sell customers on the benefits=使顾客相信这些好处;sell a vision of the future=推介一种未来愿景')
    ],
    derivatives: [
      derivative('seller', 'n.', '卖方；销售者', '指出售商品、房产或服务的人或机构。'),
      derivative('sale', 'n.', '出售；销售；特价活动', 'sell 的常用名词形式，常见于 for sale 和 on sale。'),
      derivative('selling', 'n. / adj.', '销售；促销的', '常见于 selling price 和 selling skills。'),
      derivative('sellable', 'adj.', '可出售的；有销路的', '表示商品达到可销售状态或具有市场。')
    ],
    related: [
      relatedGroup('商品与库存', 'product|n.|产品;inventory|n.|库存;stock|n.|存货;merchandise|n.|商品'),
      relatedGroup('价格与收入', 'price|n.|价格;discount|n.|折扣;revenue|n.|收入;profit|n.|利润'),
      relatedGroup('销售渠道', 'customer|n.|顾客;retailer|n.|零售商;marketplace|n.|交易平台;advertisement|n.|广告')
    ]
  },

  support: {
    contexts: [
      contextGroup('情感与人际帮助', 'support a friend through grief=陪伴朋友度过悲伤;support new parents emotionally=在情感上支持新手父母;support each other under pressure=在压力下互相支持'),
      contextGroup('观点与公共立场', 'support a local campaign=支持当地活动;support the proposed reform=支持拟议中的改革;support equal access to education=支持平等受教育机会'),
      contextGroup('证据与论证', 'support the claim with data=用数据支持论点;support a conclusion independently=独立支持一项结论;support the theory with observations=用观察结果支持理论'),
      contextGroup('资金与结构', 'support the roof safely=稳固地支撑屋顶;support rural clinics financially=为乡村诊所提供资金支持;support the network during peak traffic=在流量高峰期支撑网络运行')
    ],
    derivatives: [
      derivative('supporter', 'n.', '支持者；拥护者', '指支持某人、组织、球队或观点的人。'),
      derivative('supportive', 'adj.', '给予支持的；赞助的', '常形容人、环境、评论或证据。'),
      derivative('supporting', 'adj.', '辅助的；支持性的', '常见于 supporting evidence 和 supporting role。'),
      derivative('unsupported', 'adj.', '缺乏支持的；无证据的', '可指结构没有支撑，也可指说法没有证据。')
    ],
    related: [
      relatedGroup('帮助资源', 'advice|n.|建议;funding|n.|资金;care|n.|照料;guidance|n.|指导'),
      relatedGroup('论证材料', 'evidence|n.|证据;data|n.|数据;source|n.|来源;finding|n.|研究结果'),
      relatedGroup('承重结构', 'column|n.|柱子;beam|n.|横梁;frame|n.|框架;foundation|n.|地基')
    ]
  },

  receive: {
    fixedPhrases: [
      ['receive a message', '收到消息', 'I received a message from the clinic.', '我收到了诊所发来的消息。'],
      ['receive a letter from someone', '收到某人的来信', 'She received a letter from her former teacher.', '她收到了以前老师的来信。'],
      ['receive payment', '收到付款', 'We received payment in full yesterday.', '我们昨天收到了全额付款。'],
      ['receive an award', '获得奖项', 'He received an award for his research.', '他因研究成果获得了一个奖项。'],
      ['receive treatment', '接受治疗', 'The patient received treatment immediately.', '患者立即接受了治疗。'],
      ['receive permission', '获得许可', 'We received permission to use the hall.', '我们获准使用礼堂。'],
      ['receive a warm welcome', '受到热烈欢迎', 'The visitors received a warm welcome.', '来访者受到了热烈欢迎。'],
      ['receive complaints', '收到投诉', 'The office received several complaints this week.', '办公室本周收到了几起投诉。'],
      ['receive information about something', '收到有关某事的信息', 'You will receive information about the course by email.', '你会通过邮件收到课程信息。'],
      ['receive something in good condition', '完好无损地收到某物', 'I received the package in good condition.', '我收到包裹时它完好无损。']
    ],
    contexts: [
      contextGroup('通信与文件', 'receive an email confirmation=收到确认邮件;receive the signed contract=收到已签署的合同;receive regular updates=定期收到最新消息'),
      contextGroup('服务与医疗', 'receive emergency care=接受急救;receive legal advice=获得法律建议;receive technical assistance=获得技术协助'),
      contextGroup('荣誉与评价', 'receive public recognition=获得公众认可;receive positive feedback=收到积极反馈;receive the highest score=获得最高分'),
      contextGroup('物品与款项', 'receive a replacement device=收到替换设备;receive funds electronically=以电子方式收到款项;receive the delivery before noon=中午前收到送货')
    ],
    derivatives: [
      derivative('receiver', 'n.', '接收者；接收器', '可指收件人、电话听筒或电子接收装置。'),
      derivative('reception', 'n.', '接收；接待；反响', '来自同一拉丁词族，常见于 reception desk 和 public reception。'),
      derivative('receipt', 'n.', '收到；收据', '来自同一词族，常指付款凭证或正式收到。'),
      derivative('receptive', 'adj.', '愿意接受的；善于接纳的', '常用 be receptive to ideas。')
    ],
    related: [
      relatedGroup('通信渠道', 'email|n.|电子邮件;letter|n.|信件;parcel|n.|包裹;notification|n.|通知'),
      relatedGroup('服务与待遇', 'treatment|n.|治疗；待遇;assistance|n.|协助;welcome|n.|欢迎;hospitality|n.|款待'),
      relatedGroup('款项与凭证', 'payment|n.|付款;invoice|n.|发票;deposit|n.|定金;confirmation|n.|确认')
    ]
  },

  base: {
    contexts: [
      contextGroup('证据与判断', 'base the estimate on recent data=依据近期数据作出估算;base the conclusion on verified facts=依据核实的事实得出结论;base the diagnosis on several tests=依据多项检查作出诊断'),
      contextGroup('故事与创作', 'base a novel on real events=根据真实事件创作小说;base the character on a childhood friend=以儿时朋友为人物原型;base the design on natural forms=以自然形态为设计基础'),
      contextGroup('地点与运营', 'base the research team in Shanghai=把研究团队设在上海;base operations near the port=把业务基地设在港口附近;base staff at regional offices=把员工派驻地区办事处'),
      contextGroup('原则与策略', 'base the policy on fairness=以公平为政策基础;base decisions on long-term goals=依据长期目标作决定;base the plan on realistic assumptions=根据现实假设制定计划')
    ],
    derivatives: [
      derivative('basis', 'n.', '基础；依据', '不规则词形，常用 on the basis of。'),
      derivative('based', 'adj.', '以……为基础的；位于……的', '常见于 evidence-based、London-based 等复合表达。'),
      derivative('basic', 'adj.', '基本的；基础的', '表示最重要或最简单的层面。'),
      derivative('baseless', 'adj.', '毫无根据的', '常修饰 claim、accusation 和 rumor。'),
      derivative('basically', 'adv.', '基本上；大体上', '用于概括核心事实或说明大致情况。')
    ],
    related: [
      relatedGroup('依据材料', 'evidence|n.|证据;data|n.|数据;fact|n.|事实;source|n.|来源'),
      relatedGroup('推理产物', 'assumption|n.|假设;estimate|n.|估计;conclusion|n.|结论;judgment|n.|判断'),
      relatedGroup('运营地点', 'headquarters|n.|总部;branch|n.|分部;office|n.|办事处;facility|n.|设施；场所')
    ]
  },

  pick: {
    contexts: [
      contextGroup('选择与决定', 'pick the most suitable candidate=挑选最合适的候选人;pick a date that suits everyone=选一个大家都方便的日期;pick one of three options=从三个选项中选一个'),
      contextGroup('采摘与取出', 'pick ripe apples by hand=手工采摘成熟苹果;pick flowers from the garden=从花园里摘花;pick a card from the pile=从一摞牌中抽一张'),
      contextGroup('接送与领取', 'pick the children up after school=放学后接孩子;pick up the parcel tomorrow=明天领取包裹;pick up clean clothes from the laundry=从洗衣店取干净衣服'),
      contextGroup('辨认与细节', 'pick a face out of the crowd=从人群中认出一张脸;pick out the main theme=找出主题;pick your way through the rocks=小心地在岩石间前行')
    ],
    derivatives: [
      derivative('picker', 'n.', '采摘者；拣选器', '可指采摘工人或用于选择、拾取的装置。'),
      derivative('picking', 'n.', '采摘；挑选', '常见于 fruit picking 和 order picking。')
    ],
    related: [
      relatedGroup('选择标准', 'candidate|n.|候选人;option|n.|选项;criterion|n.|标准;preference|n.|偏好'),
      relatedGroup('果园采摘', 'orchard|n.|果园;basket|n.|篮子;harvest|n.|收获;fruit|n.|水果'),
      relatedGroup('接送领取', 'collection|n.|领取；收集;appointment|n.|约定;parcel|n.|包裹;passenger|n.|乘客')
    ]
  },

  drive: {
    contexts: [
      contextGroup('驾驶与路线', 'drive along the coast=沿海岸驾车;drive through heavy traffic=在拥堵车流中驾驶;drive across the border=驾车越过边境'),
      contextGroup('接送与出行', 'drive a colleague to the airport=开车送同事去机场;drive the children home=开车送孩子回家;drive to work before dawn=黎明前开车上班'),
      contextGroup('动力与原因', 'drive economic growth=推动经济增长;drive demand for clean energy=推动清洁能源需求;drive people to leave=迫使人们离开'),
      contextGroup('机器与项目', 'drive a motor with electricity=用电驱动马达;drive the wheels directly=直接驱动车轮;drive the project forward=推动项目向前')
    ],
    derivatives: [
      derivative('driver', 'n.', '驾驶员；驱动因素', '既可指开车的人，也可指促成变化的主要因素。'),
      derivative('driving', 'n. / adj.', '驾驶；推动的', '常见于 driving lesson 和 driving force。'),
      derivative('driven', 'adj.', '有干劲的；由……驱动的', '可形容目标感强的人或动力来源。')
    ],
    related: [
      relatedGroup('道路交通', 'vehicle|n.|车辆;highway|n.|公路;traffic|n.|交通;intersection|n.|十字路口'),
      relatedGroup('车辆操作', 'brake|n. / v.|刹车;accelerator|n.|油门;gear|n.|挡位;mirror|n.|后视镜'),
      relatedGroup('推动因素', 'motivation|n.|动力;incentive|n.|激励;pressure|n.|压力;ambition|n.|抱负')
    ]
  },

  reach: {
    meanings: [
      ['v.', 'to arrive at a place or point', '到达；抵达', 'We reached the village before dark.', '我们天黑前到达了村庄。'],
      ['v.', 'to achieve a particular level, amount, or goal', '达到；实现', 'Sales reached a record level in May.', '销售额在五月达到创纪录水平。'],
      ['v.', 'to stretch out a hand or arm to touch or take something', '伸手够到；触及', 'She reached for the book on the top shelf.', '她伸手去拿顶层书架上的书。'],
      ['v.', 'to contact or communicate with someone', '联系上；与……取得联系', 'You can reach me by email after six.', '六点后你可以通过邮件联系我。']
    ],
    fixedPhrases: [
      ['reach a place', '到达某地', 'We reached the hotel just before midnight.', '我们午夜前刚好到达酒店。'],
      ['reach a decision', '作出决定；达成决定', 'The committee reached a decision after two hours.', '委员会两小时后作出了决定。'],
      ['reach an agreement', '达成协议', 'Both sides reached an agreement on pay.', '双方就薪资达成了协议。'],
      ['reach a goal', '实现目标', 'She reached her savings goal early.', '她提前实现了储蓄目标。'],
      ['reach a conclusion', '得出结论', 'We cannot reach a conclusion without more evidence.', '没有更多证据，我们无法得出结论。'],
      ['reach a record high', '达到历史新高', 'Temperatures reached a record high in July.', '气温在七月创下历史新高。'],
      ['reach for something', '伸手去拿某物', 'He reached for his glasses on the desk.', '他伸手去拿桌上的眼镜。'],
      ['reach out to someone', '主动联系某人；向某人求助', 'Please reach out to us if you need help.', '如果需要帮助，请联系我们。'],
      ['within reach', '够得着；力所能及', 'Keep the medicine out of children’s reach.', '把药放在儿童够不到的地方。'],
      ['reach someone by phone', '通过电话联系到某人', 'I finally reached the doctor by phone.', '我终于通过电话联系上了医生。']
    ],
    contexts: [
      contextGroup('目的地与路程', 'reach the summit at sunrise=日出时到达山顶;reach the station in twenty minutes=二十分钟内到达车站;reach safety across the river=过河后到达安全地带'),
      contextGroup('数值与阶段', 'reach full capacity=达到满负荷;reach the final stage=进入最后阶段;reach a wider audience=覆盖更广泛的受众'),
      contextGroup('协商与判断', 'reach common ground=找到共同点;reach a fair settlement=达成公平的和解;reach the same judgment independently=各自得出相同判断'),
      contextGroup('接触与沟通', 'reach across the table=伸手越过桌面;reach into a pocket=把手伸进口袋;reach customers through social media=通过社交媒体触达顾客')
    ],
    derivatives: [
      derivative('reachable', 'adj.', '可到达的；可联系到的', '既可指地点可达，也可指某人可以联系上。')
    ],
    synonyms: [
      ['arrive at', 'phr.', '到达', '用于到达具体地点；arrive 是不及物动词，必须接 at 或 in，而 reach 直接接地点。'],
      ['attain', 'v.', '达到；获得', '较正式，常接水平、目标或资格，不接普通地点。'],
      ['contact', 'v.', '联系', '只对应“联系某人”这一义；reach 还可表示到达和够到。'],
      ['extend to', 'phr.', '延伸到；达到', '多指范围、距离或影响延伸到某处，不表示人抵达。']
    ],
    related: [
      relatedGroup('地点与路程', 'destination|n.|目的地;distance|n.|距离;route|n.|路线;summit|n.|顶峰'),
      relatedGroup('目标与水平', 'goal|n.|目标;target|n.|指标;milestone|n.|里程碑;capacity|n.|容量'),
      relatedGroup('沟通渠道', 'telephone|n.|电话;email|n.|电子邮件;address|n.|地址;connection|n.|联系；连接')
    ]
  },

  remain: {
    meanings: [
      ['v.', 'to continue to be in the same state or condition', '仍然是；保持不变', 'The door remained closed all morning.', '那扇门整个上午一直关着。'],
      ['v.', 'to stay in the same place', '留下；逗留', 'Two nurses remained with the patient.', '两名护士留在患者身边。'],
      ['v.', 'to be left after other people or things have gone or been used', '剩下；余留', 'Only a small amount of food remains.', '只剩下少量食物。'],
      ['v.', 'to still need to be done, decided, or explained', '仍需；尚待', 'Several questions remain unanswered.', '还有几个问题尚未得到回答。']
    ],
    fixedPhrases: [
      ['remain calm', '保持冷静', 'Please remain calm during the emergency.', '紧急情况下请保持冷静。'],
      ['remain unchanged', '保持不变', 'The basic rules remain unchanged.', '基本规则保持不变。'],
      ['remain silent', '保持沉默', 'He remained silent throughout the interview.', '他在整个采访中保持沉默。'],
      ['remain open', '继续开放；尚未确定', 'The museum will remain open until nine.', '博物馆将开放到九点。'],
      ['remain in place', '留在原位', 'The barrier must remain in place.', '隔离栏必须留在原位。'],
      ['remain with someone', '留在某人身边', 'I remained with her until help arrived.', '我留在她身边，直到救援到达。'],
      ['remain to be seen', '尚待观察；还不能确定', 'It remains to be seen whether the plan will work.', '这个计划能否奏效还有待观察。'],
      ['little remains of something', '某物所剩无几', 'Little remains of the old city wall.', '老城墙已经所剩无几。'],
      ['remain a mystery', '仍是谜', 'The cause of the failure remains a mystery.', '故障原因仍是个谜。'],
      ['remain committed to something', '仍致力于某事', 'We remain committed to improving safety.', '我们仍致力于提高安全性。']
    ],
    contexts: [
      contextGroup('状态持续', 'remain fully operational=保持完全运转;remain relevant today=如今仍然适用;remain deeply divided=仍存在严重分歧'),
      contextGroup('地点停留', 'remain at the scene=留在现场;remain indoors during the storm=暴风雨期间留在室内;remain behind after class=课后留下'),
      contextGroup('数量余留', 'remain in limited supply=供应仍然有限;remain after expenses are paid=支付开支后剩余;remain available for future use=留待以后使用'),
      contextGroup('任务待办', 'remain under investigation=仍在调查中;remain difficult to explain=仍难以解释;remain on the waiting list=仍在等候名单上')
    ],
    derivatives: [
      derivative('remaining', 'adj.', '剩余的；余下的', '常修饰 time、money、questions 和 seats。')
    ],
    related: [
      relatedGroup('持续状态', 'stability|n.|稳定;continuity|n.|连续性;condition|n.|状态;duration|n.|持续时间'),
      relatedGroup('剩余部分', 'remainder|n.|剩余部分;balance|n.|余款；剩余量;residue|n.|残留物;surplus|n.|盈余'),
      relatedGroup('未决事项', 'uncertainty|n.|不确定性;question|n.|问题;mystery|n.|谜;backlog|n.|积压工作')
    ]
  },

  explain: {
    contexts: [
      contextGroup('原因与过程', 'explain the cause clearly=清楚解释原因;explain how the device works=解释设备如何运作;explain why the schedule changed=解释日程变更的原因'),
      contextGroup('规则与概念', 'explain the rules in plain language=用浅显语言解释规则;explain a difficult concept step by step=逐步解释难懂概念;explain the difference with examples=用例子解释差异'),
      contextGroup('行为与责任', 'explain your decision to the team=向团队解释你的决定;explain an unexpected absence=解释意外缺席;explain what went wrong=解释出了什么问题'),
      contextGroup('证据与说明', 'explain the result scientifically=从科学角度解释结果;explain the pattern in the data=解释数据中的规律;explain the term in context=结合语境解释术语')
    ],
    derivatives: [
      derivative('explanation', 'n.', '解释；说明', '常见于 give an explanation 和 a possible explanation。'),
      derivative('explanatory', 'adj.', '解释性的；说明的', '常修饰 note、diagram 和 text。')
    ],
    related: [
      relatedGroup('说明材料', 'example|n.|例子;diagram|n.|图示;definition|n.|定义;instruction|n.|说明'),
      relatedGroup('原因逻辑', 'cause|n.|原因;reason|n.|理由;process|n.|过程;mechanism|n.|机制'),
      relatedGroup('理解结果', 'meaning|n.|含义;context|n.|语境;detail|n.|细节;interpretation|n.|理解；解释')
    ]
  },

  hit: {
    contexts: [
      contextGroup('撞击与碰撞', 'hit the wall at low speed=低速撞上墙;hit the ball with a bat=用球棒击球;hit your head on the shelf=头撞到架子'),
      contextGroup('目标与数值', 'hit the monthly target=达到月度目标;hit a record high=创下历史新高;hit the correct note=唱准音符'),
      contextGroup('灾害与影响', 'hit the coast overnight=夜间袭击海岸;hit small businesses hardest=对小企业打击最大;hit demand unexpectedly=意外冲击需求'),
      contextGroup('突然领悟', 'hit upon a simple solution=偶然想到简单办法;hit a difficult point in the project=项目遇到难点;hit the headlines worldwide=登上世界各地头条')
    ],
    derivatives: [
      derivative('hitter', 'n.', '击球手；击打者', '常用于棒球，也可泛指实施击打的人。'),
      derivative('hitting', 'n. / adj.', '击打；显眼的', '作名词指击打动作，作形容词可表示非常显眼。')
    ],
    related: [
      relatedGroup('碰撞要素', 'impact|n.|撞击；影响;collision|n.|碰撞;force|n.|力;surface|n.|表面'),
      relatedGroup('球类运动', 'bat|n.|球棒;ball|n.|球;pitch|n.|投球;score|n.|得分'),
      relatedGroup('冲击结果', 'damage|n.|损害;injury|n.|伤害;shock|n.|冲击;loss|n.|损失')
    ]
  },

  pull: {
    meanings: [
      ['v.', 'to use force to move something toward you or in a particular direction', '拉；拖；牵引', 'Pull the door toward you.', '把门朝你这边拉。'],
      ['v.', 'to remove something by drawing it out or away', '拔出；抽出；扯下', 'She pulled a notebook from her bag.', '她从包里抽出一个笔记本。'],
      ['v.', 'to attract people, support, or attention', '吸引；争取', 'The exhibition pulled a large crowd.', '这次展览吸引了大批观众。']
    ],
    contexts: [
      contextGroup('用力移动', 'pull the rope steadily=稳稳地拉绳子;pull the chair closer=把椅子拉近;pull a cart uphill=把手推车拉上坡'),
      contextGroup('取出与移除', 'pull a file from the drawer=从抽屉里取出文件;pull weeds by hand=用手拔草;pull the plug from the socket=从插座拔下插头'),
      contextGroup('交通操控', 'pull the car over safely=把车安全停到路边;pull away from the curb=驶离路边;pull into the station=驶入车站'),
      contextGroup('吸引与关系', 'pull a large audience=吸引大量观众;pull voters toward the center=把选民吸引到中间立场;pull the team together=让团队团结起来')
    ],
    derivatives: [
      derivative('puller', 'n.', '拉动者；拔取工具', '可指实施拉动的人或用于拔取的工具。'),
      derivative('pulling', 'n. / adj.', '拉；牵引的', '常见于 pulling force 和 pulling motion。')
    ],
    related: [
      relatedGroup('牵引工具', 'rope|n.|绳索;cable|n.|缆绳;handle|n.|把手;hook|n.|钩子'),
      relatedGroup('移动方向', 'direction|n.|方向;distance|n.|距离;tension|n.|张力;resistance|n.|阻力'),
      relatedGroup('车辆动作', 'curb|n.|路缘;lane|n.|车道;station|n.|车站;traffic|n.|交通')
    ]
  },

  raise: {
    meanings: [
      ['v.', 'to move or lift something to a higher position', '举起；抬高', 'Please raise your hand if you have a question.', '如果有问题，请举手。'],
      ['v.', 'to increase an amount, level, price, or standard', '提高；增加', 'The company raised wages by five percent.', '公司把工资提高了百分之五。'],
      ['v.', 'to collect money or support for a purpose', '筹集；募集', 'The event raised money for the hospital.', '这次活动为医院筹集了资金。'],
      ['v.', 'to care for a child or young animal until it grows', '抚养；养育', 'They raised three children in a small town.', '他们在一个小镇养育了三个孩子。'],
      ['v.', 'to mention a subject, question, or concern for discussion', '提出；引起', 'Several students raised concerns about safety.', '几名学生提出了安全方面的担忧。']
    ],
    contexts: [
      contextGroup('位置与动作', 'raise the flag at dawn=黎明升旗;raise the lid carefully=小心掀起盖子;raise your eyes from the screen=把目光从屏幕上抬起'),
      contextGroup('水平与价格', 'raise the temperature slightly=略微提高温度;raise academic standards=提高学术标准;raise the minimum wage=提高最低工资'),
      contextGroup('资金与议题', 'raise funds for research=为研究筹款;raise public awareness=提高公众意识;raise an urgent question=提出一个紧急问题'),
      contextGroup('家庭与饲养', 'raise children bilingually=以双语方式养育孩子;raise cattle on open land=在开阔土地上养牛;raise a puppy responsibly=负责任地养小狗')
    ],
    derivatives: [
      derivative('raiser', 'n.', '筹款者；饲养者；提升者', '常见于 fundraiser，也可指养殖者或使某物升高的装置。'),
      derivative('raising', 'n. / adj.', '提高；筹集；养育的', '常见于 fund-raising、child-raising 和 raising standards。'),
      derivative('raised', 'adj.', '抬高的；凸起的；提高的', '常见于 raised platform、raised lettering 和 raised standards。')
    ],
    related: [
      relatedGroup('高度与位置', 'height|n.|高度;level|n.|水平;platform|n.|平台;ceiling|n.|上限；天花板'),
      relatedGroup('资金筹集', 'donation|n.|捐款;charity|n.|慈善机构;campaign|n.|募捐活动;sponsor|n.|赞助者'),
      relatedGroup('养育照料', 'parent|n.|父母;childcare|n.|儿童照护;upbringing|n.|教养;livestock|n.|家畜')
    ]
  },

  wear: {
    meanings: [
      ['v.', 'to have clothing, jewelry, or another item on your body', '穿着；戴着；佩着', 'She wore a blue jacket to the interview.', '她穿着蓝色夹克参加面试。'],
      ['v.', 'to have a particular expression or appearance', '面带；呈现', 'He wore a worried expression.', '他面带忧虑的神情。'],
      ['v.', 'to become thinner, weaker, or damaged through use', '磨损；用坏', 'The carpet has worn badly near the door.', '门边的地毯磨损得很厉害。']
    ],
    contexts: [
      contextGroup('服装与场合', 'wear formal clothes to work=穿正装上班;wear a light jacket outside=外出时穿薄外套;wear traditional dress at the ceremony=在仪式上穿传统服装'),
      contextGroup('配饰与防护', 'wear glasses for reading=阅读时戴眼镜;wear protective gloves=戴防护手套;wear a seat belt at all times=始终系安全带'),
      contextGroup('表情与身份', 'wear a broad smile=面带灿烂笑容;wear the team colors proudly=自豪地穿戴球队颜色;wear a name badge=佩戴名牌'),
      contextGroup('磨损与耐用性', 'wear evenly over time=随着时间均匀磨损;wear through at the heel=鞋跟处磨穿;wear better than cheap fabric=比廉价面料更耐穿')
    ],
    derivatives: [
      derivative('wearer', 'n.', '穿戴者；佩戴者', '指穿着或佩戴某物的人。'),
      derivative('wearable', 'n. / adj.', '可穿戴设备；可穿的', '作名词常指智能穿戴设备，作形容词表示适合穿戴。'),
      derivative('worn', 'adj.', '磨损的；疲惫的', '常形容旧物磨损，也可形容人显得疲惫。')
    ],
    synonyms: [
      ['have on', 'phr.', '穿着；戴着', '只表示某一时刻身上穿戴着，不表示穿坏或面带表情。'],
      ['be dressed in', 'phr.', '穿着', '强调某人的整体服装，后接衣物或颜色；语体比 wear 更描述性。'],
      ['sport', 'v.', '显眼地穿戴；炫示', '常带轻松语气，强调自豪或醒目地展示服饰或发型。'],
      ['display', 'v.', '显露；呈现', '只在 wear an expression 这一义上接近，不可用于普通穿衣。'],
      ['don', 'v.', '穿上；戴上', '较正式，强调穿戴这一动作；wear 强调穿戴后的状态。']
    ],
    related: [
      relatedGroup('服装类别', 'shirt|n.|衬衫;jacket|n.|夹克;uniform|n.|制服;footwear|n.|鞋类'),
      relatedGroup('配饰防护', 'helmet|n.|头盔;gloves|n.|手套;glasses|n.|眼镜;badge|n.|徽章；名牌'),
      relatedGroup('磨损保养', 'friction|n.|摩擦;durability|n.|耐用性;repair|n.|修补;fabric|n.|面料')
    ]
  },

  return: {
    contexts: [
      contextGroup('回到地点', 'return home before sunset=日落前回家;return to the office on Monday=星期一回办公室;return safely from the expedition=安全结束探险归来'),
      contextGroup('归还物品', 'return library books promptly=及时归还图书馆书籍;return the key at reception=在前台归还钥匙;return damaged goods to the seller=把损坏商品退给卖家'),
      contextGroup('恢复与重现', 'return to normal gradually=逐渐恢复正常;return to the original topic=回到原来的话题;return to competitive form=恢复竞技状态'),
      contextGroup('回应与回报', 'return a phone call later=稍后回电话;return the favor someday=改日回报帮助;return a profit within a year=一年内产生利润回报')
    ],
    derivatives: [
      derivative('returnee', 'n.', '归来者；回国者', '指回到原居住地或国家的人。'),
      derivative('returning', 'adj.', '返回的；再次参赛的', '常见于 returning customers 和 returning players。'),
      derivative('returnable', 'adj.', '可退还的；须归还的', '常见于 returnable bottles 和 returnable deposit。')
    ],
    synonyms: [
      ['come back', 'phr.', '回来', '是“回到原处”的日常口语表达；不能替代 return 表示归还物品或回报。'],
      ['give back', 'phr.', '归还', '只表示把物品还给原主，语气比 return 更口语。'],
      ['go back', 'phr.', '回去', '强调从当前地点返回另一地点；come back 强调回到说话者所在处。'],
      ['revert to', 'phr.', '恢复到；回复到', '用于恢复旧状态、方法或版本，不表示人回家。'],
      ['repay', 'v.', '偿还；回报', '只对应 return money 或 return a favor，不表示返回地点。']
    ],
    confusables: [],
    related: [
      relatedGroup('旅程节点', 'departure|n.|出发;destination|n.|目的地;arrival|n.|到达;journey|n.|旅程'),
      relatedGroup('退换流程', 'refund|n.|退款;receipt|n.|收据;warranty|n.|保修;exchange|n.|换货'),
      relatedGroup('恢复状态', 'recovery|n.|恢复;normality|n.|正常状态;routine|n.|常规;condition|n.|状态')
    ]
  },

  choose: {
    contexts: [
      contextGroup('选项与偏好', 'choose the safest option=选择最安全的选项;choose a color you like=选择你喜欢的颜色;choose between speed and accuracy=在速度和准确之间选择'),
      contextGroup('人员与代表', 'choose a new team leader=选出新的团队负责人;choose candidates for interview=选择面试候选人;choose someone to speak first=选一个人先发言'),
      contextGroup('主动决定', 'choose to remain silent=选择保持沉默;choose not to respond immediately=选择不立即回应;choose carefully under pressure=在压力下谨慎选择'),
      contextGroup('商品与服务', 'choose from several payment plans=从多种付款方案中选择;choose the right size online=在线选择合适尺码;choose a course that fits your schedule=选择适合日程的课程')
    ],
    derivatives: [
      derivative('chooser', 'n.', '选择者', '指作出选择的人，常见于复合表达。'),
      derivative('choice', 'n.', '选择；选项', '不规则名词形式，常见于 make a choice。'),
      derivative('chosen', 'adj.', '选定的；精选的', '常修饰 method、field 和 candidate。')
    ],
    related: [
      relatedGroup('可选项目', 'option|n.|选项;alternative|n.|替代方案;candidate|n.|候选人;selection|n.|可供选择之物'),
      relatedGroup('选择依据', 'priority|n.|优先事项;criterion|n.|标准;quality|n.|质量;budget|n.|预算'),
      relatedGroup('决定过程', 'preference|n.|偏好;judgment|n.|判断;trade-off|n.|权衡;commitment|n.|承诺')
    ],
    commonErrors: [
      ['choose any of someone', 'choose any one of them', 'someone 不能代替指代已知选项的 them；one of 后接复数集合。']
    ]
  },

  cause: {
    meanings: [
      ['v.', 'to make something happen, especially a result, change, or problem', '导致；引起；使发生', 'Heavy rain caused severe flooding.', '暴雨造成了严重洪水。'],
      ['v.', 'to make someone feel or experience something', '使某人产生某种感受或经历', 'The delay caused us considerable inconvenience.', '这次延误给我们造成了很大不便。']
    ],
    fixedPhrases: [
      ['cause a problem', '引起问题', 'The missing file caused a problem during the audit.', '缺失的文件在审核过程中引起了问题。'],
      ['cause damage to something', '对某物造成损害', 'Salt water can cause damage to the engine.', '盐水会损坏发动机。'],
      ['cause someone trouble', '给某人带来麻烦', 'I am sorry that the change caused you trouble.', '很抱歉这次变更给你带来了麻烦。'],
      ['cause concern', '引起担忧', 'The sudden drop in sales caused concern.', '销售额突然下降引起了担忧。'],
      ['cause confusion', '造成混乱', 'Two different labels caused confusion.', '两个不同的标签造成了混乱。'],
      ['cause an accident', '导致事故', 'Poor visibility caused the accident.', '能见度低导致了这起事故。'],
      ['cause a delay', '导致延误', 'A technical fault caused a long delay.', '技术故障导致了长时间延误。'],
      ['cause pain', '引起疼痛', 'This movement should not cause pain.', '这个动作不应该引起疼痛。'],
      ['cause a reaction', '引起反应', 'The medicine may cause an allergic reaction.', '这种药可能引起过敏反应。'],
      ['cause prices to rise', '导致价格上涨', 'A shortage could cause prices to rise.', '短缺可能导致价格上涨。'],
      ['cause someone to do something', '使某人做某事', 'The alarm caused everyone to leave the building.', '警报使所有人离开了大楼。'],
      ['be caused by something', '由某事物引起', 'The error was caused by incorrect data.', '这个错误是由错误数据造成的。']
    ],
    contexts: [
      contextGroup('事故与损害', 'cause serious injury=造成重伤;cause structural failure=导致结构失效;cause widespread disruption=造成大范围中断'),
      contextGroup('健康与感受', 'cause severe anxiety=引发严重焦虑;cause temporary discomfort=造成短暂不适;cause loss of hearing=导致听力损失'),
      contextGroup('经济与环境', 'cause unemployment to increase=导致失业增加;cause harm to wildlife=对野生动物造成伤害;cause demand to fall=导致需求下降'),
      contextGroup('行为与结果', 'cause people to hesitate=使人们犹豫;cause the system to restart=使系统重启;cause unexpected side effects=导致意外副作用')
    ],
    derivatives: [
      derivative('causation', 'n.', '因果关系；致使', '正式用语，强调一个因素导致另一个结果。'),
      derivative('causal', 'adj.', '因果的；构成原因的', '常见于 causal relationship 和 causal factor。'),
      derivative('causally', 'adv.', '在因果关系上', '多用于学术语境，说明因果层面的联系。'),
      derivative('causative', 'adj.', '使役的；引起……的', '常用于语法或医学语境。')
    ],
    related: [
      relatedGroup('原因因素', 'factor|n.|因素;trigger|n.|诱因;source|n.|根源;condition|n.|条件'),
      relatedGroup('结果后果', 'result|n.|结果;consequence|n.|后果;outcome|n.|结果;effect|n.|影响'),
      relatedGroup('风险损害', 'risk|n.|风险;damage|n.|损害;injury|n.|伤害;disruption|n.|中断')
    ]
  },

  join: {
    fixedPhrases: [
      ['join a team', '加入团队', 'She joined the design team in March.', '她三月加入了设计团队。'],
      ['join a club', '加入俱乐部', 'I joined a local running club.', '我加入了当地的跑步俱乐部。'],
      ['join an organization', '加入组织', 'He joined the organization as a volunteer.', '他以志愿者身份加入了该组织。'],
      ['join someone for dinner', '与某人共进晚餐', 'Would you like to join us for dinner?', '你愿意和我们一起吃晚饭吗？'],
      ['join in an activity', '参加活动', 'Everyone joined in the discussion.', '大家都参加了讨论。'],
      ['join forces with someone', '与某人联手', 'The two groups joined forces to protect the river.', '两个团体联手保护这条河。'],
      ['join two pieces together', '把两部分连接起来', 'Use this bracket to join the two pieces together.', '用这个支架把两部分连接起来。'],
      ['join the queue', '排队', 'We joined the queue outside the theater.', '我们在剧院外排起了队。'],
      ['join a meeting online', '在线参加会议', 'You can join the meeting online at ten.', '你十点可以在线参加会议。'],
      ['join the conversation', '加入谈话', 'She joined the conversation after lunch.', '午饭后她加入了谈话。'],
      ['join hands', '手拉手；携手合作', 'The children joined hands in a circle.', '孩子们手拉手围成一圈。'],
      ['join one road to another', '把一条路与另一条路连接起来', 'A short bridge joins the road to the island.', '一座短桥把这条路与岛屿连接起来。']
    ],
    contexts: [
      contextGroup('组织与成员', 'join the national association=加入全国协会;join a research group=加入研究小组;join the teaching staff=加入教师队伍'),
      contextGroup('活动与社交', 'join friends for lunch=和朋友一起吃午饭;join the audience in applause=和观众一起鼓掌;join a guided tour=参加导览团'),
      contextGroup('连接与汇合', 'join the pipes securely=牢固连接管道;join the two paths near the lake=在湖边连接两条小路;join the main road ahead=在前方汇入主路'),
      contextGroup('合作与参与', 'join efforts across departments=跨部门共同努力;join the debate voluntarily=自愿参加辩论;join others in calling for change=与他人一道呼吁变革')
    ],
    derivatives: [
      derivative('joiner', 'n.', '参加者；木工；连接件', '可指加入者、细木工或用于连接的部件。'),
      derivative('joining', 'n. / adj.', '加入；连接的', '常见于 joining process 和 joining fee。')
    ],
    related: [
      relatedGroup('组织成员', 'member|n.|成员;membership|n.|成员资格;committee|n.|委员会;association|n.|协会'),
      relatedGroup('集体活动', 'meeting|n.|会议;tour|n.|参观团;discussion|n.|讨论;ceremony|n.|仪式'),
      relatedGroup('连接部件', 'bridge|n.|桥梁;connector|n.|连接器;seam|n.|接缝;junction|n.|交汇处')
    ],
    synonyms: [
      ['become a member of', 'phr.', '成为……的成员', '明确表示加入组织或团体，不用于连接物体。'],
      ['take part in', 'phr.', '参加', '用于参加活动或过程；join 还可直接接组织或人群。'],
      ['connect', 'v.', '连接', '用于把物体、地点或系统连接起来，不表示成为团体成员。'],
      ['link', 'v.', '连接；联系', '强调建立物理或抽象联系；join 更常指两端实际接合。'],
      ['meet', 'v.', '汇合；相接', '用于道路、河流或线条相接；不表示加入俱乐部。']
    ]
  },

  develop: {
    meanings: [
      ['v.', 'to grow or change into a more advanced, mature, or complete form', '发展；成长；形成', 'The town developed rapidly after the railway opened.', '铁路开通后，这座城镇迅速发展。'],
      ['v.', 'to create or improve a product, idea, skill, or system over time', '开发；研制；培养', 'The team is developing a new learning tool.', '团队正在开发一种新的学习工具。'],
      ['v.', 'to begin to have a quality, habit, illness, or problem', '逐渐产生；患上', 'He developed a strong interest in history.', '他逐渐对历史产生了浓厚兴趣。'],
      ['v.', 'to process a photographic image so that it becomes visible', '冲洗（胶片或照片）', 'The studio develops film on site.', '这家工作室在现场冲洗胶片。']
    ],
    contexts: [
      contextGroup('技能与能力', 'develop strong writing skills=培养扎实的写作能力;develop confidence through practice=通过练习建立信心;develop a better understanding=加深理解'),
      contextGroup('产品与系统', 'develop affordable software=开发价格亲民的软件;develop a safer battery=研制更安全的电池;develop a long-term strategy=制定长期战略'),
      contextGroup('变化与问题', 'develop symptoms overnight=一夜之间出现症状;develop into a major industry=发展成主要产业;develop cracks under pressure=在压力下出现裂缝'),
      contextGroup('土地与资源', 'develop unused land responsibly=负责任地开发闲置土地;develop renewable energy sources=开发可再生能源;develop local infrastructure=发展当地基础设施')
    ],
    derivatives: [
      derivative('developer', 'n.', '开发者；开发商', '指开发软件、产品或房地产的人或公司。'),
      derivative('development', 'n.', '发展；开发；新进展', '常见于 economic development 和 product development。'),
      derivative('developmental', 'adj.', '发展的；发育的', '常用于 developmental stage 和 developmental disorder。'),
      derivative('developed', 'adj.', '发达的；成熟的', '可形容经济体、系统或已经形成的能力。'),
      derivative('developing', 'adj.', '发展中的；逐渐形成的', '常见于 developing countries 和 a developing problem。')
    ],
    related: [
      relatedGroup('产品创新', 'prototype|n.|原型;design|n.|设计;technology|n.|技术;research|n.|研究'),
      relatedGroup('成长阶段', 'stage|n.|阶段;maturity|n.|成熟;capacity|n.|能力；容量;progress|n.|进展'),
      relatedGroup('建设资源', 'infrastructure|n.|基础设施;investment|n.|投资;land|n.|土地;industry|n.|产业')
    ]
  },

  share: {
    contexts: [
      contextGroup('物品与资源', 'share office space with another team=与另一个团队共用办公空间;share the cost equally=平均分担费用;share food with neighbors=与邻居分享食物'),
      contextGroup('信息与想法', 'share useful feedback privately=私下分享有用反馈;share your screen during the call=通话时共享屏幕;share a personal experience=分享个人经历'),
      contextGroup('责任与感受', 'share responsibility for the outcome=共同承担结果责任;share someone’s concern about safety=同样担心安全问题;share the workload fairly=公平分担工作量'),
      contextGroup('社交与公开发布', 'share a photo on social media=在社交媒体分享照片;share the news with close friends=把消息告诉密友;share a link with the class=把链接分享给全班')
    ],
    derivatives: [
      derivative('shareholder', 'n.', '股东', '指持有公司股份的人或机构。'),
      derivative('sharing', 'n. / adj.', '分享；共享的', '常见于 file sharing 和 a sharing economy。'),
      derivative('shared', 'adj.', '共同的；共享的', '常修饰 interest、responsibility 和 space。'),
      derivative('shareable', 'adj.', '可分享的；可共享的', '常形容链接、文件或适合多人分食的食物。')
    ],
    related: [
      relatedGroup('共同资源', 'access|n.|使用权;workspace|n.|工作空间;resource|n.|资源;ownership|n.|所有权'),
      relatedGroup('信息传播', 'message|n.|消息;link|n.|链接;audience|n.|受众;privacy|n.|隐私'),
      relatedGroup('合作责任', 'workload|n.|工作量;partnership|n.|合作关系;contribution|n.|贡献;cooperation|n.|合作')
    ],
    synonyms: [
      ['divide', 'v.', '分配；分开', '强调把整体分成若干份；share 强调共同使用或把自己的一份给别人。'],
      ['distribute', 'v.', '分发；分配', '强调有组织地发给多人，通常有明确分发者。'],
      ['tell', 'v.', '告诉', '只对应分享信息这一义，后接人再接内容；不能表示共用房间。'],
      ['post', 'v.', '发布', '用于把内容发布到网络或公共区域；share 可面向私人对象。'],
      ['have in common', 'phr.', '共同拥有；有共同点', '用于共同特征或经历，不表示主动把物品分给别人。']
    ]
  },

  realize: {
    meanings: [
      ['v.', 'to become aware of or understand a fact', '意识到；明白', 'I realized that I had left my keys at work.', '我意识到自己把钥匙落在单位了。'],
      ['v.', 'to achieve something that you hoped or planned to do', '实现；达成', 'She realized her dream of opening a bakery.', '她实现了开面包店的梦想。'],
      ['v.', 'to make an idea, plan, or design become real', '使成为现实；落实', 'The architect realized the design with local materials.', '建筑师用当地材料把设计变成了现实。']
    ],
    fixedPhrases: [
      ['realize that + clause', '意识到……', 'He realized that the door was unlocked.', '他意识到门没有锁。'],
      ['realize how important something is', '意识到某事有多重要', 'We realized how important clean water is.', '我们意识到清洁用水有多重要。'],
      ['realize what has happened', '意识到发生了什么', 'She slowly realized what had happened.', '她慢慢意识到发生了什么。'],
      ['realize a dream', '实现梦想', 'They worked for years to realize their dream.', '他们努力多年才实现梦想。'],
      ['realize a goal', '实现目标', 'The program helped her realize a career goal.', '这个项目帮助她实现了职业目标。'],
      ['realize an ambition', '实现抱负', 'He moved abroad to realize his ambition.', '他移居国外以实现抱负。'],
      ['realize your full potential', '充分发挥潜力', 'Good coaching can help athletes realize their full potential.', '良好的指导能帮助运动员充分发挥潜力。'],
      ['realize a plan', '实施计划；使计划成为现实', 'The team lacked the funds to realize the plan.', '团队缺少实施计划所需的资金。'],
      ['realize the value of something', '认识到某物的价值', 'I did not realize the value of the course at first.', '我起初没有认识到这门课的价值。'],
      ['realize your mistake', '意识到自己的错误', 'She realized her mistake and apologized.', '她意识到自己的错误并道了歉。'],
      ['fail to realize something', '没有意识到某事', 'Many people fail to realize how quickly costs add up.', '许多人没有意识到费用累积得有多快。'],
      ['suddenly realize something', '突然意识到某事', 'I suddenly realized why the room was empty.', '我突然明白房间为什么是空的。']
    ],
    contexts: [
      contextGroup('发现事实', 'realize the truth too late=太晚才意识到真相;realize something is missing=意识到少了东西;realize where the error began=弄清错误从哪里开始'),
      contextGroup('理解影响', 'realize the seriousness of the risk=认识到风险的严重性;realize how much support matters=认识到支持有多重要;realize the consequences of delay=认识到拖延的后果'),
      contextGroup('梦想与潜力', 'realize a lifelong ambition=实现终身抱负;realize the project’s full potential=充分发挥项目潜力;realize a shared vision=实现共同愿景'),
      contextGroup('设计与收益', 'realize an idea in practice=把想法付诸实践;realize gains from the investment=实现投资收益;realize a design at full scale=按完整规模实现设计')
    ],
    derivatives: [
      derivative('realization', 'n.', '意识；实现', '既可指突然明白，也可指目标或资产价值的实现。'),
      derivative('realizable', 'adj.', '可实现的；可变现的', '可形容目标实际可行或资产可以变现。')
    ],
    related: [
      relatedGroup('认知过程', 'awareness|n.|意识;insight|n.|洞察;understanding|n.|理解;recognition|n.|认识'),
      relatedGroup('目标愿景', 'dream|n.|梦想;ambition|n.|抱负;vision|n.|愿景;potential|n.|潜力'),
      relatedGroup('落实条件', 'resource|n.|资源;funding|n.|资金;design|n.|设计;implementation|n.|实施')
    ]
  },

  describe: {
    meanings: [
      ['v.', 'to say or write what someone or something is like', '描述；形容', 'Please describe the person you saw.', '请描述一下你看到的那个人。'],
      ['v.', 'to explain the features, effects, or details of something', '说明；描绘', 'The report describes how the system works.', '报告说明了这个系统如何运行。'],
      ['v.', 'to draw or move along a particular line or shape', '画出；形成（轨迹）', 'The bird described a wide circle above us.', '那只鸟在我们上方盘旋出一个大圈。']
    ],
    contexts: [
      contextGroup('人物与外观', 'describe a suspect in detail=详细描述嫌疑人;describe someone as reliable=称某人可靠;describe the color accurately=准确描述颜色'),
      contextGroup('经历与感受', 'describe a childhood memory=描述童年回忆;describe how the pain feels=描述疼痛的感觉;describe the experience in your own words=用自己的话描述经历'),
      contextGroup('过程与数据', 'describe the procedure step by step=逐步说明流程;describe a trend in the data=描述数据趋势;describe how the parts interact=说明各部分如何相互作用'),
      contextGroup('语言与分类', 'describe the problem as urgent=把问题描述为紧急;describe events objectively=客观描述事件;describe the movement of the planet=描述行星运动')
    ],
    derivatives: [
      derivative('description', 'n.', '描述；说明', '常见于 a detailed description 和 job description。'),
      derivative('descriptive', 'adj.', '描述性的；描写生动的', '常修饰 language、writing 和 statistics。'),
      derivative('descriptively', 'adv.', '描述性地', '说明表达以描写特征为主。')
    ],
    related: [
      relatedGroup('外观特征', 'appearance|n.|外观;feature|n.|特征;shape|n.|形状;color|n.|颜色'),
      relatedGroup('叙述细节', 'detail|n.|细节;account|n.|叙述;profile|n.|简介;summary|n.|摘要'),
      relatedGroup('数据呈现', 'trend|n.|趋势;pattern|n.|模式;diagram|n.|图表;sequence|n.|顺序')
    ]
  },

  increase: {
    meanings: [
      ['v.', 'to become greater in amount, number, level, or degree', '增加；增长；提高', 'Demand increased sharply in June.', '需求在六月大幅增长。'],
      ['v.', 'to make an amount, number, level, or degree greater', '使增加；提高', 'The change will increase production capacity.', '这项变更将提高生产能力。']
    ],
    contexts: [
      contextGroup('数量与幅度', 'increase by ten percent=增加百分之十;increase from twenty to thirty units=从二十个单位增加到三十个;increase threefold in a decade=十年间增长到三倍'),
      contextGroup('价格与成本', 'increase the monthly fee=提高月费;increase household spending=增加家庭支出;increase in value over time=价值随时间增长'),
      contextGroup('能力与产量', 'increase storage capacity=增加存储容量;increase crop yields sustainably=可持续提高作物产量;increase the speed gradually=逐步提高速度'),
      contextGroup('风险与需求', 'increase the risk of injury=增加受伤风险;increase demand for housing=增加住房需求;increase pressure on services=增加公共服务压力')
    ],
    derivatives: [
      derivative('increase', 'n.', '增加；增长；增加额', '同形名词，常见于 an increase in prices。'),
      derivative('increasing', 'adj.', '日益增加的', '常修饰 pressure、demand 和 concern。'),
      derivative('increased', 'adj.', '增加的；提高的', '常修饰 demand、risk、cost 和 capacity，表示已经高于原水平。'),
      derivative('increasingly', 'adv.', '越来越多地；日益', '用于说明程度随时间增强。')
    ],
    related: [
      relatedGroup('数量测量', 'amount|n.|数量;number|n.|数目;rate|n.|比率;percentage|n.|百分比'),
      relatedGroup('经济指标', 'price|n.|价格;cost|n.|成本;demand|n.|需求;sales|n.|销售额'),
      relatedGroup('能力风险', 'capacity|n.|容量;output|n.|产量;pressure|n.|压力;risk|n.|风险')
    ],
    commonErrors: [
      ['Prices increased from ten.', 'Prices increased from ten to twelve.', 'from 表示起点时要用 to 补出终点；只说增幅则用 increase by。'],
      ['We increased in production.', 'We increased production.', 'increase 作及物动词时直接接 production，不加 in。']
    ]
  },

  protect: {
    meanings: [
      ['v.', 'to keep someone or something safe from injury, damage, loss, or danger', '保护；防护', 'The cover protects the screen from scratches.', '保护套能防止屏幕被刮伤。'],
      ['v.', 'to prevent a right, place, species, or resource from being harmed or taken away', '维护；保护', 'The law protects workers’ basic rights.', '这项法律保护工人的基本权利。']
    ],
    contexts: [
      contextGroup('人身与健康', 'protect children from infection=保护儿童免受感染;protect your eyes from bright light=保护眼睛免受强光伤害;protect workers against injury=保护工人免于受伤'),
      contextGroup('物品与数据', 'protect the screen with a case=用保护壳保护屏幕;protect personal data online=保护网上个人数据;protect equipment during transport=运输期间保护设备'),
      contextGroup('自然与环境', 'protect endangered species=保护濒危物种;protect forests from illegal logging=保护森林免遭非法砍伐;protect the coastline against erosion=保护海岸线免受侵蚀'),
      contextGroup('权利与利益', 'protect freedom of expression=保护言论自由;protect consumers from fraud=保护消费者免受欺诈;protect long-term investments=保护长期投资')
    ],
    derivatives: [
      derivative('protector', 'n.', '保护者；保护装置', '可指保护某人的人或屏幕保护器等装置。'),
      derivative('protection', 'n.', '保护；防护', '常见于 environmental protection 和 legal protection。'),
      derivative('protective', 'adj.', '保护的；防护的', '常修饰 clothing、equipment 和 parent。'),
      derivative('protectively', 'adv.', '保护性地', '说明以保护、防卫的方式行动。'),
      derivative('unprotected', 'adj.', '未受保护的', '表示缺少物理、法律或技术保护。')
    ],
    related: [
      relatedGroup('安全措施', 'helmet|n.|头盔;barrier|n.|屏障;insurance|n.|保险;warning|n.|警告'),
      relatedGroup('数字安全', 'password|n.|密码;encryption|n.|加密;privacy|n.|隐私;backup|n.|备份'),
      relatedGroup('自然保育', 'habitat|n.|栖息地;wildlife|n.|野生生物;conservation|n.|保护；保育;reserve|n.|自然保护区')
    ]
  },

  compare: {
    meanings: [
      ['v.', 'to examine two or more people or things to see how they are alike or different', '比较；对照', 'Compare the two plans before you decide.', '决定前先比较这两个方案。'],
      ['v.', 'to say that one person or thing is similar to another', '把……比作；认为相似', 'The poet compared the moon to a silver boat.', '诗人把月亮比作一艘银色小船。'],
      ['v.', 'to be as good as or similar to something else', '比得上；可相比', 'Few experiences compare with seeing the mountains at dawn.', '很少有经历能比得上黎明时看群山。']
    ],
    contexts: [
      contextGroup('数据与结果', 'compare this year’s results with last year’s=把今年结果与去年比较;compare prices across stores=比较各家商店价格;compare performance over time=比较不同时期的表现'),
      contextGroup('产品与选择', 'compare the available models=比较现有型号;compare features side by side=并排比较功能;compare the total cost carefully=仔细比较总成本'),
      contextGroup('人物与标准', 'compare each applicant against the criteria=按标准比较每位申请人;compare yourself with others=拿自己和别人比较;compare two teaching methods=比较两种教学方法'),
      contextGroup('比喻与相似', 'compare life to a journey=把人生比作旅程;compare the sound to distant thunder=把声音比作远处雷声;compare favorably with the original=与原版相比毫不逊色')
    ],
    derivatives: [
      derivative('comparison', 'n.', '比较；对照', '常见于 make a comparison 和 by comparison。'),
      derivative('comparability', 'n.', '可比性', '指资料或对象适合进行公平比较的程度。'),
      derivative('comparable', 'adj.', '可比较的；类似的', '常接 to 或 with。'),
      derivative('comparative', 'adj. / n.', '比较的；比较级', '可指相对评价或语法中的比较级。'),
      derivative('comparatively', 'adv.', '相对地；比较而言', '表示与其他对象相比程度较低或较高。')
    ],
    antonyms: [],
    related: [
      relatedGroup('比较维度', 'price|n.|价格;quality|n.|质量;feature|n.|特征;performance|n.|表现'),
      relatedGroup('相似差异', 'similarity|n.|相似点;difference|n.|差异;pattern|n.|模式;degree|n.|程度'),
      relatedGroup('评价工具', 'criterion|n.|标准;benchmark|n.|基准;table|n.|表格;rating|n.|评分')
    ]
  },

  reduce: {
    meanings: [
      ['v.', 'to make something smaller or less in amount, size, price, level, or importance', '减少；降低；缩小', 'We reduced energy use by fifteen percent.', '我们把能源用量减少了百分之十五。'],
      ['v.', 'to bring someone or something into a worse, simpler, or particular state', '使陷入；使变成', 'The fire reduced the building to ashes.', '大火把建筑烧成了灰烬。'],
      ['v.', 'to make food liquid thicker by boiling away water', '收汁；浓缩', 'Reduce the sauce over low heat.', '用小火把酱汁收浓。']
    ],
    contexts: [
      contextGroup('数量与成本', 'reduce household waste=减少家庭垃圾;reduce costs without cutting quality=在不降低质量的前提下降低成本;reduce the price by five dollars=把价格降低五美元'),
      contextGroup('风险与影响', 'reduce the risk of infection=降低感染风险;reduce pressure on hospitals=减轻医院压力;reduce environmental damage=减少环境损害'),
      contextGroup('尺寸与强度', 'reduce the image size=缩小图片尺寸;reduce noise levels indoors=降低室内噪声;reduce the heat gradually=逐渐调低热度'),
      contextGroup('状态与烹饪', 'reduce a fraction to its simplest form=把分数约成最简形式;reduce the sauce by half=把酱汁熬至一半;reduce someone to tears=使某人落泪')
    ],
    derivatives: [
      derivative('reducer', 'n.', '减速器；减量装置', '指降低速度、压力或尺寸的装置。'),
      derivative('reduction', 'n.', '减少；降低；折扣', '常见于 a reduction in costs。'),
      derivative('reducible', 'adj.', '可减少的；可约简的', '多用于数学、逻辑或技术语境。'),
      derivative('reduced', 'adj.', '减少的；降价的', '常见于 reduced price 和 reduced capacity。')
    ],
    related: [
      relatedGroup('数量变化', 'amount|n.|数量;level|n.|水平;percentage|n.|百分比;rate|n.|比率'),
      relatedGroup('风险节约', 'waste|n.|浪费；废物;efficiency|n.|效率;saving|n.|节省;footprint|n.|环境足迹'),
      relatedGroup('烹饪浓缩', 'sauce|n.|酱汁;liquid|n.|液体;heat|n.|火候；热量;consistency|n.|浓稠度')
    ]
  },

  accept: {
    contexts: [
      contextGroup('提议与邀请', 'accept a formal invitation=接受正式邀请;accept the revised offer=接受修改后的提议;accept an apology sincerely=真诚接受道歉'),
      contextGroup('事实与责任', 'accept full responsibility=承担全部责任;accept the facts calmly=平静接受事实;accept that mistakes happen=接受犯错在所难免'),
      contextGroup('付款与申请', 'accept payment by card=接受刷卡付款;accept applications until Friday=接受申请至星期五;accept online reservations=接受在线预订'),
      contextGroup('认可与接纳', 'accept someone as an equal=平等接纳某人;accept a result as valid=认可结果有效;accept change gradually=逐渐接受变化')
    ],
    derivatives: [
      derivative('acceptance', 'n.', '接受；认可；接纳', '常见于 acceptance of change 和 university acceptance。'),
      derivative('acceptability', 'n.', '可接受性', '指方案、行为或质量被接受的程度。'),
      derivative('acceptable', 'adj.', '可接受的；合格的', '常形容标准、行为或解决方案。'),
      derivative('unacceptable', 'adj.', '不可接受的', '表示行为、质量或风险超过可容忍范围。'),
      derivative('acceptably', 'adv.', '可接受地；合格地', '说明表现达到最低或合理标准。')
    ],
    confusables: [
      ['except', 'prep. / conj.', '除……之外', 'accept /əkˈsept/ 是“接受”；except /ɪkˈsept/ 是“除外”。'],
      ['expect', 'v.', '预期；期待', 'expect 比 accept 多 /k/ 音，表示认为某事将发生，不表示接受。']
    ],
    related: [
      relatedGroup('提议文件', 'invitation|n.|邀请;offer|n.|提议;application|n.|申请;contract|n.|合同'),
      relatedGroup('责任现实', 'responsibility|n.|责任;reality|n.|现实;consequence|n.|后果;limitation|n.|限制'),
      relatedGroup('资格认可', 'approval|n.|批准;admission|n.|准许进入;eligibility|n.|合格资格;standard|n.|标准')
    ],
    commonErrors: [
      ['accept someone fate', 'accept someone’s fate', '表示“某人的命运”必须使用所有格 someone’s。'],
      ['accept to help', 'agree to help', 'accept 通常接名词或 that 从句；表示答应做某事用 agree to do。']
    ]
  },

  prepare: {
    contexts: [
      contextGroup('学习与考试', 'prepare thoroughly for the exam=为考试充分准备;prepare notes before class=课前准备笔记;prepare students for interviews=帮助学生准备面试'),
      contextGroup('食物与餐饮', 'prepare a nutritious breakfast=准备营养早餐;prepare meals in advance=提前备餐;prepare fresh ingredients carefully=认真处理新鲜食材'),
      contextGroup('工作与会议', 'prepare a detailed report=准备详细报告;prepare the room for guests=为客人布置房间;prepare to answer questions=准备回答问题'),
      contextGroup('风险与未来', 'prepare for severe weather=为恶劣天气作准备;prepare an emergency supply kit=准备应急物资包;prepare the business for change=让企业为变革做好准备')
    ],
    derivatives: [
      derivative('preparation', 'n.', '准备；准备工作', '常见于 exam preparation 和 in preparation for。'),
      derivative('preparedness', 'n.', '准备状态；应急能力', '常用于 emergency preparedness。'),
      derivative('prepared', 'adj.', '准备好的；愿意的', '常用 be prepared for/to do。'),
      derivative('unprepared', 'adj.', '没有准备好的', '指未为任务、情况或问题做好准备。'),
      derivative('preparatory', 'adj.', '预备的；准备性的', '常修饰 course、work 和 meeting。')
    ],
    related: [
      relatedGroup('计划资料', 'checklist|n.|检查清单;schedule|n.|日程;outline|n.|提纲;agenda|n.|议程'),
      relatedGroup('餐食准备', 'ingredient|n.|食材;recipe|n.|食谱;utensil|n.|厨具;portion|n.|一份食物'),
      relatedGroup('应急物资', 'supply|n.|物资;shelter|n.|避难所;forecast|n.|天气预报;equipment|n.|设备')
    ],
    commonErrors: [
      ['prepare wholesome meals for someone family', 'prepare wholesome meals for someone’s family', 'family 前表示所属关系时必须用 someone’s。'],
      ['prepare the exam', 'prepare for the exam', '学生“为考试做准备”用 prepare for；prepare the exam 指教师准备试卷。']
    ]
  },

  avoid: {
    contexts: [
      contextGroup('风险与事故', 'avoid unnecessary risks=避免不必要的风险;avoid a collision at the junction=避免在路口相撞;avoid exposure to smoke=避免接触烟雾'),
      contextGroup('错误与浪费', 'avoid making the same mistake=避免犯同样的错误;avoid wasting clean water=避免浪费清洁用水;avoid costly delays=避免代价高昂的延误'),
      contextGroup('社交与话题', 'avoid direct eye contact=避免直接目光接触;avoid discussing private matters=避免讨论私事;avoid someone after an argument=争吵后躲着某人'),
      contextGroup('交通与饮食', 'avoid the city center at rush hour=高峰期避开市中心;avoid foods high in salt=避免高盐食物;avoid driving when tired=疲劳时避免驾驶')
    ],
    derivatives: [
      derivative('avoidance', 'n.', '避免；回避', '常见于 risk avoidance 和 tax avoidance。'),
      derivative('avoidable', 'adj.', '可避免的', '指问题、错误或损失本来可以防止。'),
      derivative('unavoidable', 'adj.', '不可避免的', '表示无论采取什么措施都难以避开。'),
      derivative('unavoidably', 'adv.', '不可避免地', '说明结果必然发生。')
    ],
    related: [
      relatedGroup('风险来源', 'hazard|n.|危险因素;collision|n.|碰撞;infection|n.|感染;exposure|n.|接触；暴露'),
      relatedGroup('预防措施', 'warning|n.|警告;precaution|n.|预防措施;detour|n.|绕行路线;screening|n.|筛查'),
      relatedGroup('行为后果', 'mistake|n.|错误;delay|n.|延误;waste|n.|浪费;conflict|n.|冲突')
    ],
    commonErrors: [
      ['avoid to make mistakes', 'avoid making mistakes', 'avoid 后接动名词，不接 to do。'],
      ['avoid war at all cost', 'avoid war at all costs', '固定表达是 at all costs，cost 必须用复数。']
    ]
  },

  notice: {
    contexts: [
      contextGroup('变化与差异', 'notice a gradual improvement=注意到逐步改善;notice subtle differences in tone=注意到语气上的细微差别;notice a sudden change in temperature=注意到气温突变'),
      contextGroup('人物与动作', 'notice someone waiting outside=注意到某人在外等候;notice a child cross the road=注意到一个孩子过马路;notice who enters the room=注意到谁进入房间'),
      contextGroup('细节与问题', 'notice a spelling error=注意到拼写错误;notice signs of wear=注意到磨损迹象;notice something unusual in the data=注意到数据中的异常'),
      contextGroup('正式通知', 'notice the posted warning=留意张贴的警告;notice that the office closes early=注意到办公室提前关门;notice the deadline in the email=留意邮件中的截止日期')
    ],
    derivatives: [
      derivative('notification', 'n.', '通知；告知', '与 notify 同词族，常指系统或正式通知。'),
      derivative('noticeability', 'n.', '显著程度；可察觉性', '指事物容易被注意到的程度。'),
      derivative('noticeable', 'adj.', '明显的；值得注意的', '常修饰 change、difference 和 improvement。'),
      derivative('unnoticed', 'adj.', '未被注意的', '常见结构 go unnoticed。'),
      derivative('noticeably', 'adv.', '明显地', '说明变化已经达到能够察觉的程度。')
    ],
    related: [
      relatedGroup('感官线索', 'sound|n.|声音;movement|n.|动作;detail|n.|细节;signal|n.|信号'),
      relatedGroup('注意状态', 'attention|n.|注意力;awareness|n.|意识;focus|n.|专注;alertness|n.|警觉'),
      relatedGroup('通知形式', 'announcement|n.|公告;message|n.|消息;warning|n.|警告;reminder|n.|提醒')
    ],
    commonErrors: [
      ['notice someone absence', 'notice someone’s absence', 'absence 属于某人时必须使用所有格 someone’s。'],
      ['notice him to leave', 'notice him leave', '感官动词 notice 后用宾语加动词原形表示完整动作。']
    ]
  },

  affect: {
    meanings: [
      ['v.', 'to produce a change in someone or something', '影响；对……产生作用', 'Lack of sleep affects concentration.', '睡眠不足会影响注意力。'],
      ['v.', 'to make someone feel a strong emotion', '感动；触动', 'The documentary affected her deeply.', '这部纪录片深深打动了她。'],
      ['v.', 'to pretend to have a particular manner, feeling, or style', '假装；装出', 'He affected a calm manner despite the pressure.', '尽管压力很大，他仍装出镇定的样子。']
    ],
    contexts: [
      contextGroup('健康与表现', 'affect sleep quality=影响睡眠质量;affect a child’s development=影响儿童发育;affect your ability to concentrate=影响集中注意力的能力'),
      contextGroup('经济与运营', 'affect small businesses disproportionately=对小企业影响格外大;affect the final price=影响最终价格;affect production schedules=影响生产日程'),
      contextGroup('环境与人群', 'affect coastal communities=影响沿海社区;affect air quality locally=影响当地空气质量;affect thousands of passengers=影响数千名乘客'),
      contextGroup('情绪与态度', 'affect someone deeply=深深打动某人;affect an air of confidence=装出自信的样子;affect how people respond=影响人们的反应方式')
    ],
    derivatives: [
      derivative('affected', 'adj.', '受影响的；做作的', '既可指受到影响，也可形容言行不自然。'),
      derivative('unaffected', 'adj.', '未受影响的；自然真诚的', '可表示没有受到影响或举止不做作。'),
      derivative('affective', 'adj.', '情感的；情绪的', '常用于心理学和教育学中的 affective response。')
    ],
    related: [
      relatedGroup('受影响领域', 'health|n.|健康;behavior|n.|行为;performance|n.|表现;development|n.|发展'),
      relatedGroup('外部因素', 'climate|n.|气候;policy|n.|政策;stress|n.|压力;shortage|n.|短缺'),
      relatedGroup('影响结果', 'consequence|n.|后果;change|n.|变化;response|n.|反应;outcome|n.|结果')
    ]
  },

  manage: {
    contexts: [
      contextGroup('任务与项目', 'manage a complex project=管理复杂项目;manage several deadlines at once=同时应对多个截止日期;manage the transition smoothly=顺利管理过渡过程'),
      contextGroup('人员与组织', 'manage a small research team=管理小型研究团队;manage staff across two offices=管理两个办事处的员工;manage volunteers effectively=高效管理志愿者'),
      contextGroup('资源与风险', 'manage a limited budget=管理有限预算;manage financial risk carefully=谨慎管理财务风险;manage available resources fairly=公平管理现有资源'),
      contextGroup('设法完成', 'manage to stay calm=设法保持冷静;manage without outside help=没有外援也能应付;manage to finish before noon=设法在中午前完成')
    ],
    derivatives: [
      derivative('manager', 'n.', '经理；管理者', '指负责人员、业务或项目的人。'),
      derivative('management', 'n.', '管理；管理层', '可指管理活动、方法或组织的管理人员。'),
      derivative('mismanagement', 'n.', '管理不善', '指资源、组织或事务被错误管理。'),
      derivative('manageable', 'adj.', '可管理的；可应付的', '常形容工作量、成本或问题处于可控范围。'),
      derivative('unmanageable', 'adj.', '难以管理的；无法应付的', '表示规模、行为或问题超出控制。')
    ],
    related: [
      relatedGroup('项目管理', 'deadline|n.|截止日期;milestone|n.|里程碑;workflow|n.|工作流程;priority|n.|优先事项'),
      relatedGroup('组织资源', 'staff|n.|员工;budget|n.|预算;resource|n.|资源;capacity|n.|能力；容量'),
      relatedGroup('应对结果', 'pressure|n.|压力;challenge|n.|挑战;solution|n.|解决办法;outcome|n.|结果')
    ]
  },

  improve: {
    contexts: [
      contextGroup('能力与学习', 'improve reading speed=提高阅读速度;improve accuracy through feedback=通过反馈提高准确性;improve your command of grammar=提高语法掌握水平'),
      contextGroup('产品与服务', 'improve product reliability=提高产品可靠性;improve access to healthcare=改善医疗服务可及性;improve the customer experience=改善客户体验'),
      contextGroup('状况与环境', 'improve indoor air quality=改善室内空气质量;improve road safety=改善道路安全;improve living conditions=改善生活条件'),
      contextGroup('幅度与过程', 'improve steadily over six months=六个月内稳步改善;improve considerably after treatment=治疗后显著好转;improve by several points=提高几个百分点')
    ],
    derivatives: [
      derivative('improvement', 'n.', '改善；进步', '常用 make an improvement 或 show improvement。'),
      derivative('improved', 'adj.', '改进的；改善的', '常放在名词前，如 improved performance。'),
      derivative('improving', 'adj.', '正在改善的', '强调处于好转过程，如 improving conditions。')
    ],
    related: [
      relatedGroup('评价指标', 'quality|n.|质量;accuracy|n.|准确性;efficiency|n.|效率;reliability|n.|可靠性'),
      relatedGroup('学习过程', 'practice|n.|练习;feedback|n.|反馈;progress|n.|进步;skill|n.|技能'),
      relatedGroup('生活条件', 'health|n.|健康;safety|n.|安全;access|n.|可及性;environment|n.|环境')
    ]
  },

  discover: {
    meanings: [
      ['v.', 'to find someone or something that was hidden, unknown, or not noticed before', '发现；找到', 'Scientists discovered a new species in the forest.', '科学家在森林里发现了一个新物种。'],
      ['v.', 'to learn a fact or realize something for the first time', '得知；发觉', 'I discovered that the store had already closed.', '我发现商店已经关门了。'],
      ['v.', 'to begin to enjoy or use something for the first time', '初次体验；发现……的乐趣', 'She discovered jazz while studying abroad.', '她留学时开始领略爵士乐的魅力。']
    ],
    contexts: [
      contextGroup('科学与探索', 'discover a previously unknown species=发现此前未知的物种;discover water beneath the surface=发现地表下的水;discover evidence of ancient settlement=发现古代聚落的证据'),
      contextGroup('信息与事实', 'discover the cause of the fault=查明故障原因;discover that the data were incomplete=发现数据不完整;discover who sent the message=查明谁发了消息'),
      contextGroup('个人体验', 'discover a talent for teaching=发现教学天赋;discover new music online=在网上发现新音乐;discover the joy of cooking=发现烹饪的乐趣'),
      contextGroup('调查与安全', 'discover fraud during an audit=审计时发现欺诈;discover a leak in the roof=发现屋顶漏水;discover the error before release=发布前发现错误')
    ],
    derivatives: [
      derivative('discoverer', 'n.', '发现者', '指首先发现某个地方、事实或自然现象的人。'),
      derivative('discovery', 'n.', '发现；被发现的事物', '常见于 scientific discovery 和 make a discovery。'),
      derivative('discoverable', 'adj.', '可发现的；可查明的', '常用于法律证据或信息检索语境。'),
      derivative('undiscovered', 'adj.', '未被发现的', '形容尚无人发现的地点、人才或事实。')
    ],
    confusables: [
      ['invent', 'v.', '发明；创造', 'discover 是发现已经存在但未知的事物；invent 是创造此前不存在的装置或方法。']
    ],
    related: [
      relatedGroup('探索调查', 'expedition|n.|考察;survey|n.|调查;experiment|n.|实验;audit|n.|审计'),
      relatedGroup('发现证据', 'clue|n.|线索;evidence|n.|证据;trace|n.|痕迹;finding|n.|调查结果'),
      relatedGroup('新知体验', 'insight|n.|新见解;talent|n.|天赋;genre|n.|艺术类型;opportunity|n.|机会')
    ]
  },

  handle: {
    meanings: [
      ['v.', 'to deal with a situation, task, problem, or person', '处理；应付；管理', 'She handled the complaint calmly.', '她冷静地处理了投诉。'],
      ['v.', 'to touch, hold, move, or operate something with the hands', '拿；搬动；操作', 'Always handle the glass with care.', '拿放玻璃时务必小心。'],
      ['v.', 'to be able to accept or control a difficult amount, pressure, or experience', '承受；应对', 'This server can handle heavy traffic.', '这台服务器能够承受大流量。']
    ],
    fixedPhrases: [
      ['handle a problem', '处理问题', 'We need to handle this problem today.', '我们今天需要处理这个问题。'],
      ['handle a complaint', '处理投诉', 'The manager handled the complaint professionally.', '经理专业地处理了投诉。'],
      ['handle a situation', '应对局面', 'She handled the difficult situation well.', '她妥善应对了困难局面。'],
      ['handle pressure', '承受压力；应对压力', 'He handles pressure better than I do.', '他比我更能应对压力。'],
      ['handle with care', '小心轻放', 'These instruments must be handled with care.', '这些仪器必须小心轻放。'],
      ['handle food safely', '安全处理食物', 'Kitchen staff are trained to handle food safely.', '厨房员工接受过安全处理食物的培训。'],
      ['handle confidential data', '处理机密数据', 'Only authorized staff may handle confidential data.', '只有获授权员工可以处理机密数据。'],
      ['handle a machine', '操作机器', 'You need training before you handle this machine.', '操作这台机器前你需要接受培训。'],
      ['handle the workload', '应付工作量', 'The team cannot handle the workload alone.', '团队无法独自应付这份工作量。'],
      ['handle customer inquiries', '处理客户问询', 'She handles customer inquiries by email.', '她通过电子邮件处理客户问询。'],
      ['handle a large volume of traffic', '承受大量流量', 'The new system can handle a large volume of traffic.', '新系统能够承受大量流量。'],
      ['easy to handle', '容易操作；容易搬动', 'The lightweight camera is easy to handle.', '这台轻便相机很容易操作。']
    ],
    contexts: [
      contextGroup('问题与冲突', 'handle a dispute fairly=公平处理争端;handle an emergency calmly=冷静应对紧急情况;handle repeated delays=处理反复延误'),
      contextGroup('人际与服务', 'handle an upset customer=应对不满的顾客;handle sensitive conversations tactfully=妥善处理敏感谈话;handle requests in order=按顺序处理请求'),
      contextGroup('物品与材料', 'handle sharp tools safely=安全使用锋利工具;handle fragile samples gently=轻拿轻放易碎样本;handle raw meat separately=分开处理生肉'),
      contextGroup('能力与负荷', 'handle multiple tasks efficiently=高效处理多项任务;handle extreme temperatures=承受极端温度;handle more users at once=同时承载更多用户')
    ],
    derivatives: [
      derivative('handler', 'n.', '处理者；驯兽员；经办人', '可指处理事务、操控设备或训练动物的人。'),
      derivative('handling', 'n.', '处理；搬运；操控', '常见于 data handling、food handling 和 handling fee。')
    ],
    related: [
      relatedGroup('服务事务', 'complaint|n.|投诉;inquiry|n.|询问;request|n.|请求;dispute|n.|争端'),
      relatedGroup('物品操作', 'tool|n.|工具;sample|n.|样本;equipment|n.|设备;material|n.|材料'),
      relatedGroup('工作负荷', 'workload|n.|工作量;capacity|n.|能力；容量;pressure|n.|压力;traffic|n.|流量')
    ],
    commonErrors: [
      ['handle at care', 'handle with care', '固定搭配是 handle with care，不用 at。']
    ]
  },

  achieve: {
    contexts: [
      contextGroup('目标与成果', 'achieve a long-term goal=实现长期目标;achieve the desired result=取得预期结果;achieve measurable progress=取得可衡量的进展'),
      contextGroup('水平与标准', 'achieve a high level of accuracy=达到高准确度;achieve full compliance=实现完全合规;achieve international recognition=获得国际认可'),
      contextGroup('学习与事业', 'achieve academic success=取得学业成功;achieve financial independence=实现经济独立;achieve mastery through practice=通过练习达到精通'),
      contextGroup('方法与条件', 'achieve more with fewer resources=用更少资源取得更多成果;achieve success through cooperation=通过合作取得成功;achieve balance between work and rest=实现劳逸平衡')
    ],
    derivatives: [
      derivative('achiever', 'n.', '成功者；有成就的人', '常指目标感强并能取得成果的人。'),
      derivative('achievement', 'n.', '成就；达到；完成', '常见于 a major achievement 和 sense of achievement。'),
      derivative('achievable', 'adj.', '可实现的；可达到的', '常修饰 goal、target 和 standard。'),
      derivative('unachievable', 'adj.', '无法实现的', '指目标在现有条件下无法达到。')
    ],
    related: [
      relatedGroup('目标规划', 'goal|n.|目标;target|n.|指标;milestone|n.|里程碑;strategy|n.|策略'),
      relatedGroup('成果评价', 'success|n.|成功;result|n.|结果;award|n.|奖项;recognition|n.|认可'),
      relatedGroup('实现条件', 'effort|n.|努力;practice|n.|练习;discipline|n.|自律;cooperation|n.|合作')
    ],
    commonErrors: [
      ['have achieved someone goals', 'have achieved someone’s goals', 'goals 属于某人时要用所有格 someone’s。'],
      ['achieve to finish the course', 'manage to finish the course', 'achieve 后接目标名词；表示“设法完成”用 manage to do。']
    ]
  },

  express: {
    meanings: [
      ['v.', 'to communicate a thought, feeling, or idea in words, actions, art, or another form', '表达；表示；表现', 'She expressed her concerns clearly.', '她清楚地表达了自己的担忧。'],
      ['v.', 'to show a feeling, quality, or opinion', '流露；体现', 'His face expressed genuine relief.', '他的脸上流露出真切的宽慰。'],
      ['v.', 'to send something quickly or by a special delivery service', '快递；特快发送', 'The documents were expressed to the regional office.', '这些文件被特快寄往地区办事处。']
    ],
    contexts: [
      contextGroup('观点与感受', 'express an honest opinion=表达真实意见;express deep concern=表达深切担忧;express gratitude in writing=以书面形式表达感谢'),
      contextGroup('语言与艺术', 'express an idea in simple terms=用简单措辞表达想法;express emotion through music=通过音乐表达情感;express yourself more confidently=更自信地表达自己'),
      contextGroup('正式立场', 'express support for the proposal=表达对提案的支持;express doubts about the evidence=表达对证据的疑虑;express a preference for local products=表示偏爱本地产品'),
      contextGroup('符号与数值', 'express the result as a percentage=用百分比表示结果;express distance in kilometers=用千米表示距离;express the relationship mathematically=用数学方式表示关系')
    ],
    derivatives: [
      derivative('expression', 'n.', '表达；表情；表达式', '可指语言表达、面部表情或数学表达式。'),
      derivative('expressiveness', 'n.', '表现力；富于表达', '指语言、声音、动作或艺术传达情感的能力。'),
      derivative('expressive', 'adj.', '富有表现力的；表达性的', '常形容 eyes、voice、language 和 art。'),
      derivative('expressionless', 'adj.', '毫无表情的', '常形容 face 或 voice 缺乏情感表现。'),
      derivative('expressively', 'adv.', '富有表现力地', '说明说话、演奏或动作能清楚传达感情。')
    ],
    related: [
      relatedGroup('思想感受', 'opinion|n.|意见;emotion|n.|情感;concern|n.|担忧;gratitude|n.|感激'),
      relatedGroup('表达媒介', 'language|n.|语言;gesture|n.|手势;music|n.|音乐;symbol|n.|符号'),
      relatedGroup('数值形式', 'percentage|n.|百分比;equation|n.|方程式;unit|n.|单位;notation|n.|符号体系')
    ],
    commonErrors: [
      ['express someone feelings', 'express someone’s feelings', 'feelings 属于某人时必须使用所有格 someone’s。'],
      ['express about the problem', 'express concern about the problem', 'express 是及物动词，不能直接接 about；应先给出宾语 concern 或 opinion。']
    ]
  },

  encourage: {
    meanings: [
      ['v.', 'to give someone confidence, hope, or support', '鼓励；激励', 'Her teacher encouraged her to apply.', '老师鼓励她申请。'],
      ['v.', 'to make an activity, quality, or situation more likely to develop or happen', '促进；助长', 'The policy encourages investment in clean energy.', '这项政策促进清洁能源投资。']
    ],
    contexts: [
      contextGroup('学习与成长', 'encourage students to ask questions=鼓励学生提问;encourage independent thinking=鼓励独立思考;encourage children to read widely=鼓励孩子广泛阅读'),
      contextGroup('支持与信心', 'encourage a friend after failure=朋友失败后给予鼓励;encourage someone with positive feedback=用积极反馈鼓励某人;encourage the team to keep trying=鼓励团队继续尝试'),
      contextGroup('政策与行为', 'encourage public transport use=鼓励使用公共交通;encourage responsible spending=鼓励理性消费;encourage cooperation across departments=促进跨部门合作'),
      contextGroup('环境与发展', 'encourage healthy competition=促进良性竞争;encourage economic growth=促进经济增长;encourage birds to return=促使鸟类回归')
    ],
    derivatives: [
      derivative('encouragement', 'n.', '鼓励；激励', '常用 give someone encouragement。'),
      derivative('encourager', 'n.', '鼓励者', '指经常给予他人信心和支持的人。'),
      derivative('encouraging', 'adj.', '令人鼓舞的；有希望的', '常形容 result、sign 和 progress。'),
      derivative('encouraged', 'adj.', '受到鼓舞的', '常用 feel encouraged by something。'),
      derivative('encouragingly', 'adv.', '令人鼓舞地', '说明迹象或结果显示积极趋势。')
    ],
    confusables: [
      ['courage', 'n.', '勇气', 'encourage 是动词“鼓励”；courage 是不可数名词“勇气”，不能直接替代。']
    ],
    related: [
      relatedGroup('心理支持', 'confidence|n.|信心;hope|n.|希望;praise|n.|表扬;feedback|n.|反馈'),
      relatedGroup('积极行为', 'practice|n.|练习;participation|n.|参与;cooperation|n.|合作;initiative|n.|主动性'),
      relatedGroup('政策发展', 'incentive|n.|激励措施;investment|n.|投资;innovation|n.|创新;growth|n.|增长')
    ]
  },

  depend: {
    contexts: [
      contextGroup('条件与结果', 'depend heavily on the weather=在很大程度上取决于天气;depend on how quickly we respond=取决于我们的反应速度;depend partly on timing=部分取决于时机'),
      contextGroup('资源与支持', 'depend on public funding=依靠公共资金;depend on reliable transport=依赖可靠交通;depend on others for daily care=日常照料依靠他人'),
      contextGroup('信任与合作', 'depend on a colleague for advice=依靠同事提供建议;depend on everyone doing their part=依靠每个人尽责;depend on accurate information=依靠准确信息'),
      contextGroup('不确定回答', 'depend on the individual case=取决于具体情况;depend on what you mean=取决于你的意思;depend entirely on personal preference=完全取决于个人偏好')
    ],
    derivatives: [
      derivative('dependence', 'n.', '依赖；依存', '常接 on，指对人、物或条件的依赖。'),
      derivative('dependency', 'n.', '依赖关系；依赖项', '常用于社会关系或软件技术语境。'),
      derivative('independence', 'n.', '独立；自主', '表示不依赖他人的状态或国家自主。'),
      derivative('dependent', 'adj. / n.', '依赖的；受扶养人', '形容词常接 on，名词指经济上受扶养的人。'),
      derivative('independent', 'adj.', '独立的；自主的', '表示不受控制或不依靠他人。'),
      derivative('independently', 'adv.', '独立地；分别地', '说明在无帮助或彼此分开的情况下行动。')
    ],
    related: [
      relatedGroup('决定条件', 'factor|n.|因素;condition|n.|条件;circumstance|n.|情况;variable|n.|变量'),
      relatedGroup('支持资源', 'funding|n.|资金;assistance|n.|协助;transport|n.|交通;information|n.|信息'),
      relatedGroup('关系状态', 'trust|n.|信任;cooperation|n.|合作;autonomy|n.|自主;responsibility|n.|责任')
    ]
  },

  prefer: {
    contexts: [
      contextGroup('个人偏好', 'prefer tea without sugar=更喜欢不加糖的茶;prefer quiet places=更喜欢安静的地方;prefer working alone=更喜欢独自工作'),
      contextGroup('两项比较', 'prefer trains to buses=比起公交车更喜欢火车;prefer reading to watching television=比起看电视更喜欢阅读;prefer quality over speed=比起速度更看重质量'),
      contextGroup('选择与意愿', 'prefer to leave early=更愿意早点离开;prefer not to discuss it=宁愿不讨论此事;prefer someone to call first=更希望某人先打电话'),
      contextGroup('正式服务', 'prefer a window seat=更喜欢靠窗座位;prefer payment by card=更倾向刷卡付款;prefer the simpler proposal=更喜欢较简单的方案')
    ],
    derivatives: [
      derivative('preference', 'n.', '偏好；优先选择', '常见于 personal preference 和 express a preference。'),
      derivative('preferable', 'adj.', '更可取的；更合适的', '常用 be preferable to something。'),
      derivative('preferred', 'adj.', '首选的；优先的', '常修饰 option、method 和 supplier。'),
      derivative('preferably', 'adv.', '最好；更可取地', '用于说明理想选择，如 preferably before noon。')
    ],
    confusables: [
      ['rather', 'adv.', '宁可；相当', 'prefer 是动词，可接名词或 to do；would rather 后接动词原形，不带 to。']
    ],
    related: [
      relatedGroup('选择对象', 'option|n.|选项;alternative|n.|替代方案;method|n.|方法;style|n.|风格'),
      relatedGroup('评价标准', 'quality|n.|质量;comfort|n.|舒适;convenience|n.|便利;price|n.|价格'),
      relatedGroup('偏好表达', 'taste|n.|喜好;priority|n.|优先事项;inclination|n.|倾向;choice|n.|选择')
    ],
    commonErrors: [
      ['I prefer tea than coffee.', 'I prefer tea to coffee.', 'prefer A to B 用 to 引出比较对象，不用 than。'],
      ['I prefer stay home.', 'I prefer to stay home.', 'prefer 后接动词时用 to do 或 doing。']
    ]
  },

  solve: {
    meanings: [
      ['v.', 'to find an answer to a problem, question, puzzle, or difficult situation', '解决；解答；破解', 'We need more evidence to solve the case.', '我们需要更多证据来侦破此案。'],
      ['v.', 'to calculate the value of an unknown quantity in mathematics', '求解；解（方程）', 'Can you solve this equation without a calculator?', '你能不用计算器解这个方程吗？']
    ],
    contexts: [
      contextGroup('问题与困难', 'solve a practical problem=解决实际问题;solve the housing shortage=解决住房短缺;solve a conflict peacefully=和平解决冲突'),
      contextGroup('调查与谜题', 'solve a complex mystery=解开复杂谜团;solve the crime using evidence=利用证据破案;solve a logic puzzle=解开逻辑谜题'),
      contextGroup('数学与技术', 'solve the equation step by step=逐步解方程;solve a technical issue remotely=远程解决技术问题;solve for the unknown value=求未知数的值'),
      contextGroup('合作与方法', 'solve the problem together=共同解决问题;solve it with a simpler method=用更简单的方法解决;solve recurring errors at the source=从源头解决反复出现的错误')
    ],
    derivatives: [
      derivative('solver', 'n.', '解决者；解题程序', '可指善于解决问题的人或计算机求解器。'),
      derivative('solution', 'n.', '解决办法；答案；溶液', '常见于 find a solution to a problem。'),
      derivative('solvability', 'n.', '可解性；可解决性', '指问题在理论或实际中能够解决的程度。'),
      derivative('solvable', 'adj.', '可解决的；可解的', '常修饰 problem、equation 和 case。'),
      derivative('unsolved', 'adj.', '未解决的；未破解的', '常形容 mystery、crime 和 problem。')
    ],
    related: [
      relatedGroup('问题类型', 'puzzle|n.|谜题;equation|n.|方程;case|n.|案件;conflict|n.|冲突'),
      relatedGroup('解题材料', 'evidence|n.|证据;clue|n.|线索;method|n.|方法;calculation|n.|计算'),
      relatedGroup('解决结果', 'answer|n.|答案;remedy|n.|补救办法;agreement|n.|协议;breakthrough|n.|突破')
    ],
    commonErrors: [
      ['solve about the problem', 'solve the problem', 'solve 是及物动词，直接接 problem，不加 about。'],
      ['solving skills', 'problem-solving skills', '表示“解决问题的能力”通常用复合形容词 problem-solving。']
    ]
  }
};

// A fourth independently reviewed item for each context category. Keeping the
// additions separate makes the 4 x 4 contract auditable without hiding copied
// or algorithmically varied phrases inside the builder.
const contextBonuses = {
  end: 'end the workshop with questions=以问答结束研讨会;end hostilities immediately=立即结束敌对行动;end as a draw=以平局结束;end at the close of business=营业结束时终止',
  require: 'require a language test=要求参加语言测试;require extra storage space=需要额外存储空间;require approval from two managers=需要两位经理批准;require precise measurement=需要精确测量',
  listen: 'listen closely to the witness=仔细听证人的陈述;listen to an audiobook=听有声书;listen for changes in pitch=留意音高变化;listen respectfully to opposing views=尊重地听取不同意见',
  agree: 'agree broadly with the analysis=大体赞同分析;agree on how to divide the work=就如何分工达成一致;agree to a six-month trial=同意试行六个月;agree with independent measurements=与独立测量结果一致',
  cut: 'cut paper into equal squares=把纸裁成相同大小的方块;cut carbon emissions=减少碳排放;cut through thick rope=切断粗绳;cut a paragraph from the report=从报告中删掉一段',
  decide: 'decide whether to continue=决定是否继续;decide who will lead the project=决定由谁领导项目;decide before the deadline=在截止日期前决定;decide a case on its merits=根据案件本身裁决',
  pass: 'pass beneath the old bridge=从老桥下经过;pass the final assessment=通过最终考核;pass the document to your left=把文件传给左边的人;pass slowly during the winter=冬天时间过得很慢',
  eat: 'eat supper after training=训练后吃晚饭;eat whole grains regularly=经常吃全谷物;eat at a steady pace=以稳定速度进食;eat only verified gluten-free food=只吃确认无麸质的食物',
  report: 'report the story without bias=不带偏见地报道事件;report a missing passport=报告护照遗失;report monthly results to the board=向董事会汇报月度结果;report foreign earnings accurately=准确申报海外收入',
  suggest: 'suggest consulting a specialist=建议咨询专科医生;suggest a hotel near the station=推荐车站附近的酒店;suggest that the treatment is working=表明治疗正在奏效;suggest edits in the margin=在页边提出修改建议',
  sell: 'sell household goods at the market=在市场出售家居用品;sell below the listed price=以低于标价的价格出售;sell strongly in urban areas=在城市地区销量强劲;sell the proposal to senior leaders=说服高层接受提案',
  support: 'support a colleague during recovery=在同事康复期间给予支持;support stricter safety standards=支持更严格的安全标准;support the finding with two studies=用两项研究支持发现;support the bridge during repairs=维修期间支撑桥梁',
  receive: 'receive an official notice=收到正式通知;receive specialist treatment=接受专科治疗;receive an excellent review=获得优秀评价;receive the refund within five days=五天内收到退款',
  base: 'base the recommendation on user interviews=根据用户访谈提出建议;base the film on a true story=根据真实故事拍摄电影;base the company in Singapore=把公司总部设在新加坡;base the curriculum on practical needs=根据实际需求设置课程',
  pick: 'pick the least expensive plan=选择最便宜的方案;pick strawberries in early summer=初夏采摘草莓;pick a friend up at the station=去车站接朋友;pick the relevant facts from the report=从报告中找出相关事实',
  drive: 'drive on icy roads cautiously=在结冰道路上谨慎驾驶;drive a patient to the clinic=开车送患者去诊所;drive innovation across the sector=推动整个行业创新;drive a pump at constant speed=以恒定速度驱动水泵',
  reach: 'reach the border before nightfall=天黑前到达边境;reach a stable temperature=达到稳定温度;reach a negotiated compromise=达成协商后的妥协;reach the switch from your seat=坐着就能伸手够到开关',
  remain: 'remain legally binding=仍具有法律约束力;remain nearby until morning=留在附近直到早晨;remain once the water evaporates=水蒸发后残留;remain unresolved for years=多年仍未解决',
  explain: 'explain why the result matters=解释结果为何重要;explain a technical term simply=简单解释技术术语;explain the delay honestly=诚实解释延误原因;explain the evidence in the appendix=解释附录中的证据',
  hit: 'hit the ground with a heavy thud=重重撞到地面;hit the sales forecast exactly=恰好达到销售预测;hit farming communities badly=严重冲击农业社区;hit on the answer by chance=偶然想到答案',
  pull: 'pull the blanket over your shoulders=把毯子拉到肩上;pull a splinter from your finger=从手指拔出木刺;pull out of the parking space=驶出停车位;pull support away from the proposal=使支持转离提案',
  raise: 'raise the screen to eye level=把屏幕抬到视线高度;raise interest rates cautiously=谨慎提高利率;raise a concern during the meeting=在会议上提出担忧;raise chickens for eggs=养鸡取蛋',
  wear: 'wear comfortable shoes for walking=步行时穿舒适鞋子;wear ear protection in the factory=在工厂佩戴护耳装备;wear a look of surprise=面露惊讶;wear thin after repeated washing=反复清洗后变薄',
  return: 'return to the campsite before dark=天黑前返回营地;return the borrowed tools clean=把借来的工具清洁后归还;return to good health=恢复健康;return a thoughtful gesture=回报体贴的举动',
  choose: 'choose the most reliable supplier=选择最可靠的供应商;choose two delegates by ballot=通过投票选出两名代表;choose to wait for more evidence=选择等待更多证据;choose a policy with flexible terms=选择条款灵活的方案',
  cause: 'cause permanent damage=造成永久损害;cause intense embarrassment=使人非常尴尬;cause water levels to drop=导致水位下降;cause the alarm to sound=使警报响起',
  join: 'join the professional network=加入专业网络;join a community cleanup=参加社区清洁活动;join the wires with a terminal=用接线端子连接电线;join colleagues in supporting the plan=与同事一起支持计划',
  develop: 'develop fluency in conversation=培养会话流利度;develop a low-cost vaccine=研制低成本疫苗;develop resistance to treatment=逐渐产生耐药性;develop the riverfront carefully=谨慎开发滨水区域',
  share: 'share laboratory equipment=共用实验室设备;share research findings openly=公开分享研究结果;share the duty of care=共同承担照护责任;share updates in the group chat=在群聊中分享最新消息',
  realize: 'realize why the test failed=明白测试失败的原因;realize the scale of the challenge=认识到挑战的规模;realize a childhood dream=实现童年梦想;realize value from unused assets=从闲置资产中实现价值',
  describe: 'describe the witness’s clothing=描述证人的衣着;describe the effect of the change=说明变更的影响;describe the workflow precisely=精确说明工作流程;describe a circle in the air=在空中画出圆形轨迹',
  increase: 'increase steadily each quarter=每季度稳步增长;increase borrowing costs=提高借贷成本;increase battery life=延长电池续航时间;increase the chance of success=提高成功概率',
  protect: 'protect older adults from extreme heat=保护老年人免受极端高温伤害;protect files with encryption=用加密保护文件;protect wetlands from development=保护湿地免遭开发;protect tenants’ legal rights=保护租户的合法权利',
  compare: 'compare survey responses by age=按年龄比较调查回答;compare warranty terms before buying=购买前比较保修条款;compare current performance with the target=把当前表现与目标比较;compare the city to a living organism=把城市比作生命体',
  reduce: 'reduce waiting times significantly=显著缩短等候时间;reduce the cost per unit=降低单位成本;reduce brightness at night=夜间调低亮度;reduce the mixture to a thick paste=把混合物熬成浓稠糊状',
  accept: 'accept a dinner invitation=接受晚餐邀请;accept the consequences of your choice=接受选择带来的后果;accept contactless payments=接受非接触式付款;accept cultural differences=接纳文化差异',
  prepare: 'prepare a revision timetable=制定复习时间表;prepare a simple evening meal=准备简单晚餐;prepare evidence for the hearing=为听证会准备证据;prepare residents for evacuation=让居民做好疏散准备',
  avoid: 'avoid stepping on loose stones=避免踩到松动石块;avoid adding irrelevant details=避免添加无关细节;avoid a former colleague in public=在公共场合躲着前同事;avoid caffeine late at night=深夜避免摄入咖啡因',
  notice: 'notice a small improvement in balance=注意到平衡略有改善;notice someone remove the sign=注意到某人取下标牌;notice an inconsistency in the totals=注意到总数不一致;notice the change of venue=留意地点变更通知',
  affect: 'affect recovery time=影响康复时间;affect export costs=影响出口成本;affect communities downstream=影响下游社区;affect indifference to criticism=装作不在意批评',
  manage: 'manage competing priorities=管理相互冲突的优先事项;manage contractors on site=管理现场承包商;manage water supplies during drought=干旱期间管理供水;manage to avoid injury=设法避免受伤',
  improve: 'improve listening comprehension=提高听力理解;improve delivery times=缩短交货时间;improve access for disabled visitors=改善残障访客的通行条件;improve markedly within a week=一周内明显改善',
  discover: 'discover a rare mineral underground=在地下发现稀有矿物;discover why the payment was rejected=查明付款被拒原因;discover a passion for photography=发现对摄影的热爱;discover malware on the device=在设备上发现恶意软件',
  handle: 'handle a scheduling conflict=处理日程冲突;handle a confidential inquiry discreetly=谨慎处理机密问询;handle chemicals with protective gloves=戴防护手套处理化学品;handle sudden spikes in demand=应对需求突然激增',
  achieve: 'achieve a lasting improvement=取得持久改善;achieve the required standard=达到规定标准;achieve professional growth=实现职业成长;achieve the target within budget=在预算内实现目标',
  express: 'express sympathy to the family=向家属表示慰问;express identity through clothing=通过服装表达身份;express opposition to the merger=表示反对合并;express temperature in degrees Celsius=用摄氏度表示温度',
  encourage: 'encourage learners to speak freely=鼓励学习者自由发言;encourage a colleague during recovery=鼓励康复中的同事;encourage cycling in the city=鼓励在城市骑行;encourage roots to grow deeper=促进根系向深处生长',
  depend: 'depend on the quality of the evidence=取决于证据质量;depend on imported fuel=依赖进口燃料;depend on a trusted partner=依靠可信的合作伙伴;depend on where you live=取决于居住地点',
  prefer: 'prefer mild weather=更喜欢温和天气;prefer evidence to speculation=比起猜测更看重证据;prefer guests to book ahead=更希望客人提前预订;prefer an aisle seat=更喜欢靠过道座位',
  solve: 'solve a staffing problem=解决人员配置问题;solve the puzzle before noon=中午前解开谜题;solve a network failure on site=现场解决网络故障;solve bottlenecks through automation=通过自动化解决瓶颈'
};

for (const [word, source] of Object.entries(contextBonuses)) {
  const groups = manualCardPacks101150[word].contexts;
  source.split(';').forEach((row, index) => groups[index][1].push(row.split('=')));
}

const fixedPhraseSeeds = {
  end: 'end the conversation=结束谈话;end a relationship=结束一段关系;end the war=结束战争;end the contract=终止合同;end a phone call=结束通话;end the strike=结束罢工;end badly=结局不佳;end peacefully=和平结束;end abruptly=突然结束;end with a question=以问题收尾;end in disaster=以灾难告终;end on time=准时结束',
  require: 'require special training=需要专门培训;require no explanation=无需解释;require a password=需要密码;require major repairs=需要大修;require regular maintenance=需要定期维护;require two signatures=需要两个签名;require a deposit=需要押金;require strong evidence=需要有力证据;require medical care=需要医疗照护;require close supervision=需要密切监督;require more time=需要更多时间;require everyone to register=要求所有人登记',
  listen: 'listen to music=听音乐;listen carefully=认真听;listen to the radio=听广播;listen for footsteps=留意脚步声;listen to advice=听取建议;listen to reason=听从理性劝告;listen in silence=默默倾听;listen with interest=饶有兴趣地听;listen at the door=在门边偷听;listen to opposing arguments=听取对立观点;listen to a recording=听录音;listen closely=仔细听',
  agree: 'agree with a colleague=同意同事的看法;agree on the terms=就条款达成一致;agree to the request=同意请求;agree that the plan is fair=认同计划是公平的;agree about the cause=对原因看法一致;agree among the members=成员之间意见一致;agree in writing=书面同意;agree unanimously=一致同意;agree wholeheartedly=完全赞同;agree to disagree=保留分歧;agree with the evidence=与证据相符;agree upon a price=商定价格',
  cut: 'cut into pieces=切成块;cut costs=削减成本;cut your hair=剪头发;cut the power=切断电源;cut a hole=切开一个洞;cut in half=切成两半;cut down on sugar=减少糖摄入;cut across a field=穿过田野;cut off the supply=切断供应;cut out a section=删掉一节;cut through the tape=割断胶带;cut someone off=打断某人',
  decide: 'decide what to do=决定做什么;decide where to stay=决定住在哪里;decide between two plans=在两个方案中决定;decide on a date=选定日期;decide against the purchase=决定不购买;decide to wait=决定等待;decide the matter=裁定此事;decide by vote=投票决定;decide for yourself=自己决定;decide in advance=提前决定;decide after discussion=讨论后决定;decide the winner=决出获胜者',
  pass: 'pass a vehicle=超过一辆车;pass the exam=通过考试;pass the salt=递盐;pass a law=通过法律;pass the time=消磨时间;pass through customs=通过海关;pass along a message=转达消息;pass judgment=作出判断;pass unnoticed=未被注意地经过;pass into history=成为历史;pass from hand to hand=在人们手中传递;pass without comment=不加评论地略过',
  eat: 'eat a meal=吃一顿饭;eat breakfast=吃早餐;eat vegetables=吃蔬菜;eat alone=独自用餐;eat out=外出用餐;eat at home=在家吃饭;eat slowly=慢慢吃;eat well=吃得健康;eat too much=吃得过多;eat something light=吃点清淡食物;eat with friends=和朋友一起吃饭;eat a balanced diet=保持均衡饮食',
  report: 'report an accident=报告事故;report a crime=举报犯罪;report the results=报告结果;report to a supervisor=向主管汇报;report for duty=报到上班;report a fault=报告故障;report progress=汇报进展;report the news=报道新闻;report a loss=申报损失;report someone missing=报告某人失踪;report in writing=书面报告;report back to the group=向小组反馈',
  suggest: 'suggest a solution=提出解决办法;suggest a change=建议改变;suggest an alternative=提出替代方案;suggest taking a break=建议休息;suggest that we wait=建议我们等待;suggest a restaurant=推荐餐厅;suggest a cause=暗示原因;suggest otherwise=表明并非如此;suggest improvements=提出改进建议;suggest a compromise=提出妥协方案;suggest consulting a doctor=建议咨询医生;suggest a new title=建议新标题',
  sell: 'sell a house=出售房屋;sell a product=销售产品;sell tickets=售票;sell online=在线销售;sell at a profit=获利出售;sell at auction=拍卖出售;sell by weight=按重量出售;sell directly=直接销售;sell out quickly=很快售罄;sell well=畅销;sell an idea=推销想法;sell someone on a plan=说服某人接受计划',
  support: 'support a family=养活家庭;support a proposal=支持提案;support a claim=支持论点;support the roof=支撑屋顶;support a candidate=支持候选人;support a cause=支持事业;support a conclusion=支持结论;support a patient=帮助患者;support local business=支持本地企业;support a network=支撑网络;support development=促进发展;support someone financially=在经济上支持某人',
  receive: 'receive a message=收到消息;receive payment=收到付款;receive an award=获得奖项;receive treatment=接受治疗;receive permission=获得许可;receive a welcome=受到欢迎;receive complaints=收到投诉;receive a package=收到包裹;receive training=接受培训;receive visitors=接待访客;receive a signal=接收信号;receive confirmation=收到确认',
  base: 'base a decision on facts=根据事实作决定;base a story on real events=根据真实事件写故事;base a company in London=把公司设在伦敦;base an estimate on data=根据数据估算;base a theory on evidence=以证据为理论基础;base a policy on fairness=以公平为政策基础;base a character on a friend=以朋友为人物原型;base the design on nature=以自然为设计基础;base a team overseas=把团队设在海外;base a lesson on practice=以实践为课程基础;base the budget on forecasts=根据预测编制预算;base a diagnosis on tests=根据检查作诊断',
  pick: 'pick a winner=选出获胜者;pick a number=选一个数字;pick a color=选择颜色;pick fresh berries=采摘新鲜浆果;pick a lock=撬锁;pick up a parcel=领取包裹;pick up a passenger=接乘客;pick out a dress=挑选连衣裙;pick out a tune=辨认曲调;pick your words=斟酌措辞;pick a fight=挑起争斗;pick at your food=一点点地吃',
  drive: 'drive a car=开车;drive home=开车回家;drive to the airport=开车去机场;drive safely=安全驾驶;drive someone to work=开车送某人上班;drive growth=推动增长;drive innovation=推动创新;drive demand=推动需求;drive a hard bargain=极力讨价还价;drive a machine=驱动机器;drive someone crazy=把某人逼疯;drive away customers=赶走顾客',
  reach: 'reach the destination=到达目的地;reach an agreement=达成协议;reach a decision=作出决定;reach a goal=实现目标;reach a conclusion=得出结论;reach a peak=达到顶峰;reach for a glass=伸手拿杯子;reach out for help=主动寻求帮助;reach someone by phone=电话联系到某人;reach a wider audience=触达更广受众;reach the age of sixty=年满六十岁;reach beyond the border=延伸到边界之外',
  remain: 'remain calm=保持冷静;remain unchanged=保持不变;remain silent=保持沉默;remain open=继续开放;remain in place=留在原位;remain with a patient=留在患者身边;remain to be seen=尚待观察;remain a mystery=仍是谜;remain committed=仍然坚定投入;remain available=仍然可用;remain outside=留在外面;remain unanswered=仍未得到回答',
  explain: 'explain a concept=解释概念;explain the rules=解释规则;explain why it happened=解释为何发生;explain how it works=解释如何运作;explain a decision=解释决定;explain the difference=解释差异;explain something to a child=向孩子解释某事;explain in detail=详细解释;explain clearly=清楚解释;explain yourself=为自己说明;explain away a problem=把问题搪塞过去;explain the meaning=解释含义',
  hit: 'hit a ball=击球;hit a target=击中目标;hit the wall=撞墙;hit your head=撞到头;hit an all-time low=跌至历史低点;hit the brakes=猛踩刹车;hit the road=出发上路;hit the headlines=成为头条;hit hard=造成沉重打击;hit back=反击;hit upon an idea=偶然想到主意;hit rock bottom=跌至谷底',
  pull: 'pull a door open=拉开门;pull a rope=拉绳子;pull a cart=拉手推车;pull out a drawer=拉开抽屉;pull up a chair=拉把椅子坐下;pull over=靠边停车;pull away=驶离;pull through=渡过难关;pull together=齐心协力;pull strings=利用关系;pull someone aside=把某人拉到一旁;pull something apart=把某物拆开',
  raise: 'raise a hand=举手;raise a flag=升旗;raise prices=提高价格;raise wages=提高工资;raise funds=筹集资金;raise awareness=提高认识;raise a question=提出问题;raise concerns=提出担忧;raise a child=抚养孩子;raise cattle=养牛;raise standards=提高标准;raise your voice=提高嗓门',
  wear: 'wear a coat=穿外套;wear glasses=戴眼镜;wear a helmet=戴头盔;wear a uniform=穿制服;wear a smile=面带微笑;wear makeup=化妆;wear a seat belt=系安全带;wear well=耐穿;wear thin=磨薄;wear away=磨损;wear out shoes=穿坏鞋子;wear your hair short=留短发',
  return: 'return home=回家;return to work=重返工作;return a book=归还书籍;return a call=回电话;return a favor=回报帮助;return to normal=恢复正常;return the money=归还钱款;return from abroad=从国外回来;return safely=安全返回;return an item for a refund=退货退款;return to the subject=回到主题;return a profit=产生收益',
  choose: 'choose an option=选择一个选项;choose a candidate=选择候选人;choose a date=选定日期;choose carefully=谨慎选择;choose between two routes=在两条路线中选择;choose to stay=选择留下;choose not to answer=选择不回答;choose from a menu=从菜单中选择;choose a career=选择职业;choose your words=斟酌用词;choose a winner=选出获胜者;choose for yourself=自己选择'
  ,cause: 'cause a problem=引起问题;cause damage=造成损害;cause concern=引起担忧;cause confusion=造成混乱;cause an accident=导致事故;cause a delay=导致延误;cause pain=引起疼痛;cause a reaction=引起反应;cause prices to rise=导致价格上涨;cause someone to leave=使某人离开;cause lasting harm=造成持久伤害;cause widespread flooding=导致大范围洪水',
  join: 'join a team=加入团队;join a club=加入俱乐部;join an organization=加入组织;join someone for dinner=与某人共进晚餐;join in a discussion=参加讨论;join forces=联手;join two parts together=把两部分连接起来;join a queue=排队;join a meeting=参加会议;join the conversation=加入谈话;join hands=手拉手;join the main road=汇入主路',
  develop: 'develop a skill=培养技能;develop a product=开发产品;develop a plan=制定计划;develop an interest=产生兴趣;develop symptoms=出现症状;develop a habit=养成习惯;develop a theory=发展理论;develop software=开发软件;develop land=开发土地;develop film=冲洗胶片;develop into a leader=成长为领导者;develop over time=随时间发展',
  share: 'share a room=合住房间;share a meal=一起用餐;share the cost=分担费用;share information=分享信息;share an opinion=分享意见;share a concern=同样担忧;share responsibility=共同承担责任;share a link=分享链接;share with the group=与小组分享;share equally=平均分配;share common interests=有共同兴趣;share something on social media=在社交媒体分享某物',
  realize: 'realize the truth=意识到真相;realize your mistake=意识到错误;realize what happened=明白发生了什么;realize how serious it is=意识到事情的严重性;realize a dream=实现梦想;realize a goal=实现目标;realize an ambition=实现抱负;realize your potential=发挥潜力;realize a plan=落实计划;realize the value=认识到价值;realize a profit=实现利润;realize an idea=把想法变成现实',
  describe: 'describe a person=描述一个人;describe a place=描述一个地方;describe an experience=描述经历;describe how it works=说明如何运作;describe the difference=描述差异;describe something as useful=称某物有用;describe in detail=详细描述;describe accurately=准确描述;describe the process=说明流程;describe a pattern=描述模式;describe your symptoms=描述症状;describe a circle=画出圆形轨迹',
  increase: 'increase the price=提高价格;increase production=增加产量;increase twofold=增加一倍;increase from five to ten=从五增加到十;increase in size=尺寸增大;increase rapidly=快速增长;increase capacity=增加容量;increase efficiency=提高效率;increase the risk=增加风险;increase demand=增加需求;increase awareness=提高认识;increase your chances=提高机会',
  protect: 'protect a child=保护孩子;protect your skin=保护皮肤;protect against fraud=防范欺诈;protect from damage=防止损坏;protect personal data=保护个人数据;protect a habitat=保护栖息地;protect legal rights=保护合法权利;protect an investment=保护投资;protect the environment=保护环境;protect a screen=保护屏幕;protect workers=保护工人;protect confidential information=保护机密信息',
  compare: 'compare two prices=比较两个价格;compare results=比较结果;compare with last year=与去年比较;compare one model to another=把一个型号与另一个比较;compare side by side=并排比较;compare favorably=相比之下表现良好;compare notes=交换并比较笔记;compare data sets=比较数据集;compare features=比较功能;compare performance=比较表现;compare someone to a hero=把某人比作英雄;compare like with like=比较同类对象',
  reduce: 'reduce costs=降低成本;reduce waste=减少浪费;reduce the risk=降低风险;reduce by half=减少一半;reduce from ten to six=从十降到六;reduce pressure=减轻压力;reduce the size=缩小尺寸;reduce speed=降低速度;reduce emissions=减少排放;reduce a sauce=收浓酱汁;reduce to ashes=化为灰烬;reduce dependence on oil=减少对石油的依赖',
  accept: 'accept an offer=接受提议;accept an invitation=接受邀请;accept responsibility=承担责任;accept the truth=接受事实;accept payment=接受付款;accept an application=接受申请;accept a gift=收下礼物;accept an apology=接受道歉;accept someone as a member=接纳某人为成员;accept that change is necessary=接受变革是必要的;accept defeat=承认失败;accept the terms=接受条款',
  prepare: 'prepare a meal=准备一顿饭;prepare a report=准备报告;prepare for an exam=备考;prepare to leave=准备离开;prepare someone for an interview=帮助某人准备面试;prepare the room=布置房间;prepare in advance=提前准备;prepare a budget=编制预算;prepare the ingredients=准备食材;prepare for the worst=作最坏打算;prepare a statement=准备声明;prepare yourself mentally=做好心理准备',
  avoid: 'avoid a mistake=避免错误;avoid an accident=避免事故;avoid doing something=避免做某事;avoid contact=避免接触;avoid eye contact=避免目光接触;avoid the subject=回避话题;avoid unnecessary costs=避免不必要开支;avoid rush hour=避开高峰期;avoid processed food=避免加工食品;avoid at all costs=不惜一切代价避免;avoid someone deliberately=故意躲着某人;avoid making trouble=避免惹麻烦',
  notice: 'notice a change=注意到变化;notice a difference=注意到差异;notice a mistake=注意到错误;notice someone leave=注意到某人离开;notice someone waiting=注意到某人在等;notice that the light is on=注意到灯亮着;notice immediately=立刻注意到;notice hardly any change=几乎没注意到变化;notice a pattern=注意到规律;notice signs of damage=注意到损坏迹象;notice the warning=留意警告;notice someone’s absence=注意到某人缺席',
  affect: 'affect health=影响健康;affect performance=影响表现;affect the outcome=影响结果;affect people differently=对不同人产生不同影响;affect prices=影响价格;affect behavior=影响行为;affect the environment=影响环境;affect a decision=影响决定;be deeply affected by the news=深受消息触动;affect a calm manner=装出镇定;affect the whole region=影响整个地区;affect how something works=影响某物的运作方式',
  manage: 'manage a project=管理项目;manage a team=管理团队;manage a budget=管理预算;manage your time=管理时间;manage a problem=处理问题;manage a business=经营企业;manage expectations=管理预期;manage risk=管理风险;manage to finish=设法完成;manage without help=没有帮助也能应付;manage under pressure=在压力下应付;manage the workload=应付工作量',
  improve: 'improve a skill=提高技能;improve performance=提升表现;improve quality=提高质量;improve efficiency=提高效率;improve your health=改善健康;improve the situation=改善局面;improve over time=逐渐改善;improve with practice=通过练习提高;improve by five percent=提高百分之五;improve on the original=比原版更好;improve access=改善可及性;improve safety=提高安全性',
  discover: 'discover a species=发现一个物种;discover a place=发现一个地方;discover the truth=发现真相;discover that something is wrong=发现某事不对;discover how it works=弄清如何运作;discover a talent=发现天赋;discover new music=发现新音乐;discover evidence=发现证据;discover a fault=发现故障;discover by chance=偶然发现;discover for yourself=亲自发现;discover the cause=查明原因',
  handle: 'handle a problem=处理问题;handle a complaint=处理投诉;handle pressure=应对压力;handle with care=小心轻放;handle food safely=安全处理食物;handle data=处理数据;handle a machine=操作机器;handle the workload=应付工作量;handle an inquiry=处理问询;handle heavy traffic=承受大流量;handle a crisis=应对危机;handle a fragile object=拿放易碎物品',
  achieve: 'achieve a goal=实现目标;achieve success=取得成功;achieve a result=取得结果;achieve a high score=取得高分;achieve independence=实现独立;achieve recognition=获得认可;achieve balance=实现平衡;achieve full capacity=达到满负荷;achieve through practice=通过练习实现;achieve within budget=在预算内实现;achieve the standard=达到标准;achieve lasting change=实现持久改变',
  express: 'express an opinion=表达意见;express a feeling=表达感受;express concern=表达担忧;express gratitude=表达感谢;express support=表达支持;express doubt=表达怀疑;express yourself=表达自己;express in words=用语言表达;express through art=通过艺术表达;express as a percentage=用百分比表示;express sympathy=表示慰问;express a preference=表达偏好',
  encourage: 'encourage a student=鼓励学生;encourage someone to try=鼓励某人尝试;encourage discussion=鼓励讨论;encourage participation=鼓励参与;encourage growth=促进增长;encourage investment=鼓励投资;encourage healthy habits=鼓励健康习惯;encourage cooperation=促进合作;encourage innovation=鼓励创新;encourage questions=鼓励提问;encourage confidence=增强信心;encourage responsible behavior=鼓励负责任的行为',
  depend: 'depend on the weather=取决于天气;depend on a friend=依靠朋友;depend on funding=依靠资金;depend on circumstances=视情况而定;depend heavily on imports=严重依赖进口;depend partly on luck=部分取决于运气;depend on accurate data=依靠准确数据;depend on each other=互相依靠;depend on what happens=取决于发生什么;depend on someone for help=依靠某人帮助;depend entirely on demand=完全取决于需求;depend less on cars=减少对汽车的依赖',
  prefer: 'prefer tea to coffee=比起咖啡更喜欢茶;prefer to walk=更愿意步行;prefer the window seat=更喜欢靠窗座位;prefer not to answer=宁愿不回答;prefer someone to call=更希望某人打电话;prefer a quiet room=更喜欢安静房间;prefer accuracy over speed=准确性重于速度;prefer one option to another=偏好一个选项而非另一个;prefer by far=明显更喜欢;prefer the original version=更喜欢原版;prefer cashless payment=更倾向无现金支付;prefer a later date=更喜欢晚些的日期',
  solve: 'solve a problem=解决问题;solve a puzzle=解开谜题;solve a crime=破案;solve an equation=解方程;solve a mystery=解开谜团;solve for x=求 x 的值;solve together=共同解决;solve efficiently=高效解决;solve at the source=从源头解决;solve a technical issue=解决技术问题;solve a conflict=解决冲突;solve a shortage=解决短缺'
};

const fixedExampleFrames = [
  [(phrase) => `We will ${phrase}.`, (chinese) => `我们会${chinese}。`],
  [(phrase) => `They can ${phrase}.`, (chinese) => `他们可以${chinese}。`],
  [(phrase) => `Please ${phrase}.`, (chinese) => `请${chinese}。`],
  [(phrase) => `You should ${phrase}.`, (chinese) => `你应该${chinese}。`],
  [(phrase) => `The team plans to ${phrase}.`, (chinese) => `团队计划${chinese}。`],
  [(phrase) => `It may help to ${phrase}.`, (chinese) => `${chinese}可能会有帮助。`],
  [(phrase) => `We decided to ${phrase}.`, (chinese) => `我们决定${chinese}。`],
  [(phrase) => `They were able to ${phrase}.`, (chinese) => `他们得以${chinese}。`],
  [(phrase) => `It is important to ${phrase}.`, (chinese) => `${chinese}很重要。`],
  [(phrase) => `She learned to ${phrase}.`, (chinese) => `她学会了${chinese}。`],
  [(phrase) => `We can ${phrase}.`, (chinese) => `我们可以${chinese}。`],
  [(phrase) => `They agreed to ${phrase}.`, (chinese) => `他们同意${chinese}。`]
];

for (const [word, source] of Object.entries(fixedPhraseSeeds)) {
  const card = manualCardPacks101150[word];
  card.fixedPhrases ??= [];
  const seen = new Set(card.fixedPhrases.map(([phrase]) => phrase.toLowerCase()));
  for (const row of source.split(';')) {
    if (card.fixedPhrases.length >= 12) break;
    const [phrase, chinese] = row.split('=');
    if (seen.has(phrase.toLowerCase())) continue;
    const [englishFrame, chineseFrame] = fixedExampleFrames[card.fixedPhrases.length];
    card.fixedPhrases.push([phrase, chinese, englishFrame(phrase), chineseFrame(chinese)]);
    seen.add(phrase.toLowerCase());
  }
}

// Every fixed phrase below has been reviewed as a complete construction and
// paired with a word-specific, concrete bilingual example.  This deliberately
// replaces the earlier fill frames: passing a quantity gate is not enough when
// the sentence does not actually demonstrate the phrase.
const fixedPhrasePack = (source) => source.trim().split('\n').map((row) => row.split('|'));

const reviewedFixedPhrasePacks = {
  end: fixedPhrasePack(`
end the conversation|结束谈话|Maya ended the conversation politely when her train arrived.|火车到站时，玛雅礼貌地结束了谈话。
end a relationship|结束一段关系|He ended the relationship after months of unresolved arguments.|几个月的争吵一直没有解决，他最终结束了这段关系。
end the war|结束战争|The peace agreement finally ended the war between the two countries.|和平协议终于结束了两国之间的战争。
end a contract|终止合同|Either party may end the contract with thirty days' notice.|任何一方均可提前三十天通知终止合同。
end a phone call|结束通话|She ended the phone call before entering the meeting room.|她在进入会议室前结束了通话。
end a strike|结束罢工|A new pay agreement ended the three-week strike.|新的薪酬协议结束了持续三周的罢工。
end badly|结局不佳|The negotiation could end badly if neither side compromises.|如果双方都不妥协，谈判可能会以糟糕的结果收场。
end peacefully|和平结束|The demonstration ended peacefully just before sunset.|示威活动在日落前和平结束。
end abruptly|突然结束|The interview ended abruptly when the fire alarm sounded.|火警响起时，采访突然中断了。
end with a question|以问题收尾|The speaker ended her presentation with a question for the audience.|演讲者用一个留给听众的问题结束了演讲。
end in disaster|以灾难告终|Their attempt to cross the river at night ended in disaster.|他们夜间渡河的尝试最终酿成了灾难。
end on time|准时结束|The chair kept the discussion focused so the meeting could end on time.|主持人让讨论始终围绕主题，以便会议准时结束。
`),
  require: fixedPhrasePack(`
require something|需要某物|This delicate repair requires specialist tools.|这项精细维修需要专用工具。
require someone to do something|要求某人做某事|The visa office requires applicants to submit two photographs.|签证处要求申请人提交两张照片。
be required to do something|被要求做某事|All laboratory visitors are required to wear safety glasses.|所有进入实验室的访客都必须佩戴护目镜。
require careful planning|需要周密规划|Moving an entire hospital requires careful planning.|整体搬迁一家医院需要周密规划。
require further investigation|需要进一步调查|The unexplained drop in pressure requires further investigation.|这次原因不明的压力下降需要进一步调查。
require immediate attention|需要立即处理|A gas leak of any size requires immediate attention.|任何程度的燃气泄漏都需要立即处理。
require written permission|需要书面许可|Filming inside the museum requires written permission.|在博物馆内拍摄需要书面许可。
require a great deal of patience|需要极大的耐心|Restoring an old painting requires a great deal of patience.|修复一幅古画需要极大的耐心。
require proof of identity|要求提供身份证明|The bank requires proof of identity before opening an account.|银行在开户前要求提供身份证明。
as required by law|依照法律要求|The clinic stores patient records securely, as required by law.|诊所依法安全保存患者病历。
require special training|需要专门培训|Operating this crane requires special training.|操作这台起重机需要专门培训。
require no explanation|无需解释|Her exhausted expression required no explanation.|她疲惫的神情无需解释。
`),
  listen: fixedPhrasePack(`
listen to music|听音乐|I listen to classical music while cooking dinner.|我做晚饭时会听古典音乐。
listen carefully|认真听|Listen carefully because the platform number may change.|请认真听，站台号码可能会改变。
listen to the radio|听广播|My grandfather listens to the radio every morning.|我爷爷每天早晨都听广播。
listen for footsteps|留意脚步声|The children listened for footsteps outside their bedroom.|孩子们留心听卧室外的脚步声。
listen to advice|听取建议|She listened to her doctor's advice and took a week off.|她听从医生的建议，休息了一周。
listen to reason|听从理性劝告|He was angry at first, but eventually listened to reason.|他起初很生气，但最终还是听进了劝告。
listen in silence|默默倾听|The class listened in silence as the survivor told her story.|幸存者讲述经历时，全班默默地听着。
listen with interest|饶有兴趣地听|The engineers listened with interest to the student's proposal.|工程师们饶有兴趣地听了这名学生的提议。
listen at the door|在门边偷听|Someone had been listening at the door during the private meeting.|私下会议期间，有人一直在门边偷听。
listen to opposing arguments|听取对立观点|A fair judge must listen to opposing arguments before ruling.|公正的法官在裁决前必须听取双方的不同意见。
listen to a recording|听录音|The researcher listened to the recording several times to verify the quote.|研究人员反复听录音，以核实那段引语。
listen closely|仔细听|Listen closely and you can hear water running behind the wall.|仔细听，你能听见墙后有水流动的声音。
`),
  agree: fixedPhrasePack(`
agree with a colleague|同意同事的看法|I agree with my colleague that the deadline is unrealistic.|我同意同事的看法，这个截止日期并不现实。
agree on the terms|就条款达成一致|The landlord and tenant agreed on the terms of the new lease.|房东和租客就新租约的条款达成了一致。
agree to the request|同意请求|The council agreed to the residents' request for a safer crossing.|市政委员会同意了居民增设安全过街设施的请求。
agree that + clause|一致认为……|We agree that the damaged bridge should remain closed.|我们一致认为受损的桥梁应继续封闭。
agree about something|对某事意见一致|The doctors agree about the likely cause of the infection.|医生们对感染的可能原因意见一致。
agree among themselves on something|他们内部就某事达成一致|The committee members agreed among themselves on a minimum price before meeting the client.|委员会成员在会见客户前先就最低价格达成了内部共识。
agree in writing|书面同意|The supplier must agree in writing to any change in price.|供应商必须以书面形式同意任何价格变动。
agree unanimously|一致同意|The board agreed unanimously to fund the community clinic.|董事会一致同意资助这家社区诊所。
agree wholeheartedly|完全赞同|I wholeheartedly agree that every child deserves a safe place to learn.|我完全赞同每个孩子都应有安全学习环境这一观点。
agree to disagree|保留分歧|After an hour of debate, we agreed to disagree and moved on.|争论一小时后，我们同意保留分歧并继续讨论下一项。
agree with the evidence|与证据相符|The witness's account agrees with the physical evidence.|证人的陈述与实物证据相符。
agree upon a price|商定价格|The buyer and seller agreed upon a price after the inspection.|验货后，买卖双方商定了价格。
`),
  cut: fixedPhrasePack(`
cut something into pieces|把某物切成块|Cut the mango into small pieces before adding it to the salad.|把芒果切成小块后再加入沙拉。
cut costs|削减成本|The factory cut energy costs by installing solar panels.|工厂通过安装太阳能板降低了能源成本。
cut your hair|剪头发|I had a barber cut my hair before the wedding.|婚礼前我请理发师剪了头发。
cut the power|切断电源|Engineers cut the power before repairing the damaged cable.|工程师在修理受损电缆前切断了电源。
cut a hole|切开一个洞|She cut a small hole in the lid to let steam escape.|她在盖子上开了一个小孔，让蒸汽逸出。
cut something in half|把某物切成两半|He cut the sandwich in half and shared it with his daughter.|他把三明治切成两半，与女儿分享。
cut down on sugar|减少糖摄入|My dentist advised me to cut down on sugar.|牙医建议我减少糖的摄入。
cut across a field|穿过田野|We cut across a field to reach the station before dark.|我们抄近路穿过田野，赶在天黑前到达车站。
cut off the supply|切断供应|The storm cut off the electricity supply to three villages.|暴风雨切断了三个村庄的电力供应。
cut out a section|删掉一节|The editor cut out a repetitive section of the report.|编辑删掉了报告中重复的一节。
cut through the tape|割断胶带|Use a safety knife to cut through the packing tape.|请用安全刀割开包装胶带。
cut someone off|打断某人；使某人失去联系|The host cut the caller off when he began shouting insults.|来电者开始大声辱骂时，主持人中断了他的通话。
`),
  decide: fixedPhrasePack(`
decide what to do|决定做什么|We need to inspect the damage before deciding what to do.|我们需要先检查损坏情况，再决定怎么办。
decide where to stay|决定住在哪里|They compared three neighborhoods before deciding where to stay.|他们比较了三个街区后才决定住在哪里。
decide between two options|在两个选项中作决定|The patient must decide between two treatment options.|患者必须在两种治疗方案中作出选择。
decide on a date|选定日期|The families decided on a date for the reunion.|几家人选定了团聚的日期。
decide against something|决定不做某事|After reading the inspection report, we decided against the purchase.|看过验房报告后，我们决定不购买。
decide to wait|决定等待|The rescue team decided to wait until the wind weakened.|救援队决定等风势减弱后再行动。
decide the matter|裁定此事|An independent panel will decide the matter next month.|一个独立小组将在下个月裁定此事。
decide by vote|投票决定|The members decided by vote where to hold the conference.|成员们通过投票决定会议地点。
decide for yourself|自己决定|Read both proposals and decide for yourself which is stronger.|请阅读两份方案，自己判断哪一份更好。
decide in advance|提前决定|Decide in advance how much you are willing to spend.|请提前决定你愿意花多少钱。
decide after discussion|讨论后决定|The committee decided after discussion to extend the deadline.|委员会讨论后决定延长截止日期。
decide the winner|决出获胜者|A public vote will decide the winner of the competition.|公众投票将决出比赛的获胜者。
`),
  pass: fixedPhrasePack(`
pass another vehicle|超过另一辆车|Wait for a clear stretch of road before passing another vehicle.|超车前要等到前方有一段视野清楚的道路。
pass an exam|通过考试|Nora passed the licensing exam on her first attempt.|诺拉第一次参加执照考试就通过了。
pass someone something|把某物递给某人|Could you pass me the blue folder beside the printer?|你能把打印机旁的蓝色文件夹递给我吗？
pass a law|通过法律|Parliament passed a law protecting temporary workers.|议会通过了一项保护临时工的法律。
pass the time|消磨时间|We played cards to pass the time during the delay.|等待延误结束时，我们打牌消磨时间。
pass through customs|通过海关|All passengers must pass through customs after collecting their luggage.|所有乘客取完行李后都必须通过海关。
pass along a message|转达消息|The coordinator asked us to pass along the message that tomorrow's class is canceled.|协调员请我们转告大家明天的课取消了。
pass judgment on something|对某事作出评判|It is unfair to pass judgment on the plan before reading it.|还没读过方案就加以评判是不公平的。
pass unnoticed|未被注意地经过|The small error passed unnoticed during the first review.|这个小错误在第一次审查时没有被发现。
pass into history|成为历史|With the treaty signed, decades of border conflict passed into history.|条约签署后，持续数十年的边境冲突成为了历史。
pass from hand to hand|在人们手中传递|The old photograph passed from hand to hand around the table.|那张老照片在桌边的人们手中依次传看。
pass without comment|不加评论地略过|The chair noted the objection but let it pass without comment.|主席记录了异议，但没有作出评论。
`),
  eat: fixedPhrasePack(`
eat breakfast|吃早餐|Leo eats breakfast before his early train every morning.|利奥每天早晨赶早班火车前都会吃早餐。
eat a balanced diet|保持均衡饮食|Athletes need to eat a balanced diet throughout the season.|运动员整个赛季都需要保持均衡饮食。
eat out|在外面吃饭|We eat out on Fridays at a small restaurant near the office.|我们每周五都在办公室附近的一家小餐馆吃饭。
eat at home|在家吃饭|Cooking in batches helps us eat at home on busy weekdays.|一次多做几份饭，让我们工作日再忙也能在家吃饭。
eat together|一起吃饭|The whole family eats together on Sunday evenings.|全家人每周日晚上一起吃饭。
eat slowly|慢慢吃|The nurse advised him to eat slowly after the operation.|护士建议他手术后慢慢吃。
eat well|吃得健康；吃得好|You must eat well while your body is recovering.|身体恢复期间一定要吃得有营养。
eat too much|吃得过多|I ate too much spicy food and could not sleep.|我吃了太多辛辣食物，结果睡不着。
eat something light|吃些清淡的东西|She ate something light before the evening rehearsal.|晚间排练前，她吃了些清淡的东西。
have something to eat|吃点东西|Let's have something to eat before the three-hour drive.|开车三小时前，我们先吃点东西吧。
eat a meal|吃一顿饭|The hikers stopped beside the lake to eat a hot meal.|徒步者在湖边停下来吃了一顿热饭。
eat more vegetables|多吃蔬菜|The dietitian encouraged us to eat more vegetables at every meal.|营养师鼓励我们每餐多吃蔬菜。
`),
  report: fixedPhrasePack(`
report an accident|报告事故|Drivers must report an accident to the police within twenty-four hours.|驾驶员必须在二十四小时内向警方报告事故。
report a crime|举报犯罪|Witnesses can report a crime anonymously through the hotline.|目击者可以通过热线匿名举报犯罪。
report the results|报告结果|The laboratory will report the test results tomorrow afternoon.|实验室将于明天下午报告检测结果。
report to a supervisor|向主管汇报|New employees report to a supervisor at the start of each shift.|新员工每次上班时都要先向主管报到。
report for duty|报到上班|All firefighters reported for duty before dawn.|所有消防员都在黎明前报到上班。
report a fault|报告故障|Use the maintenance app to report a fault in the elevator.|请通过维修应用报告电梯故障。
report progress|汇报进展|Each team reports its progress at the Monday meeting.|每个团队都在周一会议上汇报进展。
report the news|报道新闻|Local journalists reported the news live from the courthouse.|当地记者在法院外现场报道了这条新闻。
report a loss|申报损失|The retailer reported a substantial loss for the final quarter.|这家零售商申报第四季度出现了大额亏损。
report someone missing|报告某人失踪|Her family reported her missing when she failed to return home.|她没有回家，家人便报了失踪。
report in writing|书面报告|Any breach of safety rules must be reported in writing.|任何违反安全规定的情况都必须以书面形式报告。
report back to someone|向某人反馈|Inspect the site and report back to me before noon.|请检查现场，并在中午前向我反馈。
`),
  suggest: fixedPhrasePack(`
suggest a solution|提出解决办法|The engineer suggested a simple solution to the drainage problem.|工程师为排水问题提出了一个简单的解决办法。
suggest a change|建议改变|Several residents suggested a change to the bus route.|几位居民建议调整公交路线。
suggest an alternative|提出替代方案|If the venue is unavailable, please suggest an alternative.|如果场地无法使用，请提出一个替代方案。
suggest doing something|建议做某事|The doctor suggested reducing my salt intake.|医生建议我减少盐的摄入。
suggest that + clause|建议……；表明……|I suggest that we wait for the full report before responding.|我建议等完整报告出来后再作回应。
suggest a restaurant|推荐餐厅|Could you suggest a quiet restaurant near the theater?|你能推荐一家剧院附近的安静餐厅吗？
suggest a cause|暗示原因|The pattern of damage suggests a possible electrical cause.|损坏的形态表明原因可能与电气有关。
suggest otherwise|表明并非如此|The label says the medicine is safe, but new evidence suggests otherwise.|标签说这种药是安全的，但新证据表明并非如此。
suggest improvements|提出改进建议|Staff were invited to suggest improvements to the booking system.|公司邀请员工为预订系统提出改进建议。
suggest a compromise|提出妥协方案|The mediator suggested a compromise that both sides could accept.|调解员提出了一个双方都能接受的折中方案。
suggest consulting a doctor|建议咨询医生|Persistent chest pain suggests consulting a doctor without delay.|持续胸痛说明应立即咨询医生。
suggest a new title|建议新标题|The editor suggested a new title that better reflected the article.|编辑建议换一个更能反映文章内容的新标题。
`),
  sell: fixedPhrasePack(`
sell a house|出售房屋|They sold their house after moving closer to their children.|他们搬到离孩子更近的地方后卖掉了房子。
sell a product|销售产品|The company sells its main product in more than thirty countries.|这家公司在三十多个国家销售其主打产品。
sell tickets|售票|Volunteers sold tickets at the theater entrance.|志愿者在剧院入口处售票。
sell online|在线销售|Many independent artists sell their work online.|许多独立艺术家在网上出售作品。
sell at a profit|获利出售|She restored the old cabinet and sold it at a profit.|她修复了旧橱柜，并将其卖出获利。
sell at auction|拍卖出售|The rare manuscript will be sold at auction next month.|这份珍贵手稿将于下月拍卖。
sell by weight|按重量出售|The market sells loose tea by weight.|这家市场按重量出售散装茶叶。
sell directly to customers|直接向顾客销售|The farm sells fresh eggs directly to customers.|这家农场把新鲜鸡蛋直接卖给顾客。
sell out quickly|很快售罄|Tickets for the final concert sold out quickly.|最后一场音乐会的门票很快就售罄了。
sell well|畅销|Lightweight rain jackets sell well in this region.|轻便雨衣在这个地区很畅销。
sell an idea|推销想法|The architect used a model to sell her idea to the council.|建筑师用模型说服市政委员会接受她的构想。
sell someone on a plan|说服某人接受计划|Detailed cost estimates helped sell the board on the expansion plan.|详细的成本估算说服董事会接受了扩建计划。
`),
  support: fixedPhrasePack(`
support a family|养活家庭|She worked two jobs to support her family after the factory closed.|工厂关闭后，她做两份工作养家。
support a proposal|支持提案|Most residents support the proposal for a new health clinic.|大多数居民支持新建医疗诊所的提案。
support a claim|为说法提供依据|The photographs support his claim that the roof was already damaged.|这些照片支持他的说法，即屋顶此前就已损坏。
support a roof|支撑屋顶|Four stone columns support the roof of the entrance hall.|四根石柱支撑着入口大厅的屋顶。
support a candidate|支持候选人|Several local unions supported the independent candidate.|几个当地工会支持这名独立候选人。
support a cause|支持一项事业|The concert raised money to support the cause of clean drinking water.|这场音乐会筹款支持清洁饮用水事业。
support a conclusion|支持结论|Data from three trials support the same conclusion.|三次试验的数据都支持同一个结论。
support a patient|帮助患者|A specialist nurse supported the patient throughout her recovery.|一名专科护士在患者整个康复期间给予了帮助。
support local businesses|支持本地企业|The festival encourages visitors to support local businesses.|这个节庆活动鼓励游客支持本地企业。
support a network|支撑网络运行|The new server can support a network of five hundred devices.|新服务器可以支撑一个由五百台设备组成的网络。
support development|促进发展|Reliable public transport supports economic development in rural areas.|可靠的公共交通促进农村地区的经济发展。
support someone financially|在经济上支持某人|Her parents supported her financially during medical school.|她读医学院期间，父母在经济上支持她。
`),
  receive: fixedPhrasePack(`
receive a message|收到消息|I received a message confirming the appointment.|我收到了一条确认预约的消息。
receive a letter from someone|收到某人的来信|She received a letter from her former teacher in June.|她六月收到了以前老师的来信。
receive payment|收到付款|Small suppliers must receive payment within thirty days.|小型供应商必须在三十天内收到付款。
receive an award|获得奖项|The scientist received an award for her work on clean energy.|这位科学家因清洁能源研究获得了奖项。
receive treatment|接受治疗|The injured cyclist received treatment at the scene.|受伤的骑车人在现场接受了治疗。
receive permission|获得许可|The team received permission to examine the archive.|团队获准查阅档案。
receive a warm welcome|受到热烈欢迎|The visiting musicians received a warm welcome from the village.|来访的音乐家受到了村民的热烈欢迎。
receive complaints|收到投诉|The airline received numerous complaints about the cancellation.|航空公司收到了大量有关航班取消的投诉。
receive information about something|收到有关某事的信息|Applicants will receive information about the interview by email.|申请人将通过电子邮件收到面试相关信息。
receive something in good condition|完好地收到某物|Customers should contact the supplier if they do not receive the equipment in good condition.|顾客如果收到的设备有损坏，应联系供应商。
receive guests|接待客人|The mayor received foreign guests at city hall.|市长在市政厅接待了外宾。
receive a package|收到包裹|No one was home to receive the package yesterday.|昨天家里没人签收包裹。
`),
  base: fixedPhrasePack(`
base a decision on facts|根据事实作决定|We based the hiring decision on experience and test results.|我们根据经验和测试结果作出了录用决定。
base a story on real events|根据真实事件写故事|The novelist based her story on real events from the 1940s.|这位小说家以二十世纪四十年代的真实事件为素材创作故事。
base a company in a city|把公司设在某城市|The founders decided to base the company in Chengdu.|创始人决定把公司总部设在成都。
base an estimate on data|根据数据估算|Engineers based the repair estimate on a detailed inspection.|工程师根据详细检查结果估算了维修费用。
base a theory on evidence|以证据为理论基础|A scientific theory must be based on evidence that others can test.|科学理论必须建立在他人可检验的证据之上。
base a policy on fairness|以公平为政策基础|The school based its admissions policy on fairness and transparency.|学校以公平和透明为基础制定招生政策。
base a character on someone|以某人为人物原型|She based the detective character on her grandfather.|她以祖父为原型塑造了侦探这一角色。
base a design on nature|以自然为设计灵感|The team based the ventilation design on termite mounds.|团队以白蚁丘为灵感设计了通风系统。
base a team overseas|把团队设在海外|The firm based its customer-support team overseas.|这家公司把客户支持团队设在海外。
base a lesson on practice|以实践为课程基础|The instructor based the lesson on a real emergency drill.|教员以一次真实的应急演练为基础设计了这节课。
base a budget on forecasts|根据预测编制预算|The council based next year's budget on conservative revenue forecasts.|市政委员会根据保守的收入预测编制了明年预算。
base a diagnosis on tests|根据检查作诊断|Doctors should not base a diagnosis on a single test result.|医生不应只根据一次检查结果作出诊断。
`),
  pick: fixedPhrasePack(`
pick a winner|选出获胜者|A panel of five judges will pick the winner.|由五名评委组成的小组选出获胜者。
pick a number|选一个数字|Pick a number between one and twenty.|请在一到二十之间选一个数字。
pick a color|选择颜色|We picked a warm gray color for the kitchen walls.|我们为厨房墙面选了暖灰色。
pick fresh berries|采摘新鲜浆果|The children picked fresh berries on the farm.|孩子们在农场采摘了新鲜浆果。
pick a lock|撬锁|A locksmith picked the lock without damaging the door.|锁匠没有损坏门就把锁打开了。
pick up a parcel|领取包裹|I stopped at the post office to pick up a parcel.|我去邮局取了一个包裹。
pick up a passenger|接乘客|The taxi will pick up a passenger outside the hotel at nine.|出租车九点会在酒店外接一名乘客。
pick out an item|挑选物品|She picked out a blue dress for the ceremony.|她为典礼挑选了一条蓝色连衣裙。
pick out a tune|辨认曲调|He could pick out the tune despite the background noise.|尽管有背景噪声，他仍能辨认出那段曲调。
pick your words|斟酌措辞|Pick your words carefully when giving sensitive feedback.|提出敏感反馈时要仔细斟酌措辞。
pick a fight|挑起争斗|The customer seemed determined to pick a fight with the waiter.|那位顾客似乎执意要和服务员起冲突。
pick at your food|一点点地吃；无心进食|She picked at her food because she was worried about the exam.|她担心考试，没胃口，只是拨弄着食物吃了几口。
`),
  drive: fixedPhrasePack(`
drive a car|开车|My aunt learned to drive a car in her forties.|我姑姑四十多岁才学会开车。
drive home|开车回家|We drove home slowly through the heavy rain.|我们冒着大雨慢慢开车回家。
drive to the airport|开车去机场|Sam drove to the airport before sunrise to meet his sister.|萨姆日出前开车去机场接妹妹。
drive safely|安全驾驶|Drivers must drive safely on the icy mountain road.|司机在结冰的山路上必须安全驾驶。
drive someone to work|开车送某人上班|Her neighbor drove her to work while her car was being repaired.|她的车维修期间，邻居开车送她上班。
drive growth|推动增长|Investment in broadband has driven growth in the region.|宽带投资推动了该地区的增长。
drive innovation|推动创新|Competition often drives innovation in renewable energy.|竞争往往推动可再生能源领域的创新。
drive demand|推动需求|Lower ticket prices drove demand for weekend trains.|票价下调推动了周末列车的需求。
drive a hard bargain|极力讨价还价|The buyer drove a hard bargain and secured a lower price.|买方极力讨价还价，最终争取到了更低的价格。
drive a machine|驱动机器|A small electric motor drives the cutting machine.|一台小型电动机驱动这台切割机。
drive someone crazy|把某人逼疯|The constant drilling next door is driving me crazy.|隔壁不停的钻孔声快把我逼疯了。
drive away customers|赶走顾客|Long waits and rude service will drive away customers.|长时间等待和粗鲁服务会赶走顾客。
`),
  reach: fixedPhrasePack(`
reach a place|到达某地|The rescue team reached the village shortly after midnight.|救援队在午夜过后不久抵达了村庄。
reach a decision|作出决定|The jury reached a decision after two days of discussion.|陪审团讨论两天后作出了决定。
reach an agreement|达成协议|Both sides reached an agreement on working hours.|双方就工作时间达成了协议。
reach a goal|实现目标|Regular practice helped her reach her goal of running ten kilometers.|规律训练帮助她实现了跑十公里的目标。
reach a conclusion|得出结论|The investigators reached a conclusion only after reviewing all the footage.|调查人员看完所有录像后才得出结论。
reach a record high|达到历史新高|Demand for electric bicycles reached a record high in July.|电动自行车的需求在七月达到历史新高。
reach for something|伸手去拿某物|He reached for the handrail when the bus moved suddenly.|公交车突然启动时，他伸手抓住了扶手。
reach out to someone|主动联系某人|The counselor reached out to families affected by the fire.|辅导员主动联系了受火灾影响的家庭。
within reach|伸手可及；可以实现|Keep the emergency phone within reach of the bed.|把紧急电话放在床边伸手可及的地方。
reach someone by phone|通过电话联系到某人|I finally reached the technician by phone this morning.|今天早晨我终于通过电话联系到了技术员。
reach the destination|到达目的地|The hikers reached their destination before the storm began.|徒步者在暴风雨来临前到达了目的地。
reach a peak|达到峰值|Electricity use usually reaches a peak on hot afternoons.|用电量通常在炎热的下午达到峰值。
`),
  remain: fixedPhrasePack(`
remain calm|保持冷静|The pilot remained calm throughout the emergency landing.|飞行员在整个紧急着陆过程中保持冷静。
remain unchanged|保持不变|Ticket prices will remain unchanged until the end of the year.|票价将在年底前保持不变。
remain silent|保持沉默|The witness remained silent during questioning.|证人在询问过程中保持沉默。
remain open|继续开放|The emergency shelter will remain open through the weekend.|紧急避难所将在整个周末继续开放。
remain in place|留在原位|The temporary barriers must remain in place during repairs.|维修期间临时护栏必须留在原位。
remain with someone|留在某人身边|A nurse remained with the child until his parents arrived.|一名护士一直陪着孩子，直到他的父母到来。
remain to be seen|尚待观察|Whether the new policy will reduce traffic remains to be seen.|新政策能否减少交通流量仍有待观察。
little remains of something|某物所剩无几|Little remains of the original wooden bridge after the fire.|火灾过后，那座原木桥几乎没有留下什么。
remain a mystery|仍是谜|The source of the strange signal remains a mystery.|奇怪信号的来源仍然是个谜。
remain committed to something|仍然致力于某事|The charity remains committed to providing free meals.|该慈善机构仍然致力于提供免费餐食。
remain under observation|继续接受观察|The patient will remain under observation overnight.|患者将留院观察一晚。
remain in effect|继续有效|The water-use restrictions will remain in effect until further notice.|用水限制将持续有效，直至另行通知。
`),
  explain: fixedPhrasePack(`
explain a concept|解释概念|The teacher used a diagram to explain the concept of gravity.|老师用图示解释了重力这一概念。
explain the rules|解释规则|A referee explained the rules before the match began.|比赛开始前，一名裁判讲解了规则。
explain why something happened|解释某事为何发生|The report explains why the bridge failed during the storm.|报告解释了这座桥为何在暴风雨中损坏。
explain how something works|解释某物如何运作|This short video explains how the braking system works.|这段短视频解释了制动系统的工作原理。
explain a decision|解释决定|The director met the staff to explain her decision.|主管与员工见面，解释了她的决定。
explain the difference|解释差异|Could you explain the difference between these two insurance plans?|你能解释一下这两种保险方案的区别吗？
explain something to someone|向某人解释某事|I explained the delay to the waiting passengers.|我向等候的乘客解释了延误原因。
explain in detail|详细解释|The technician explained in detail how to reset the device.|技术员详细说明了如何重置设备。
explain clearly|清楚解释|The clerk explained clearly which documents were still missing.|办事员清楚说明了还缺哪些文件。
explain yourself|为自己的言行作出说明|You left without warning, so you need to explain yourself.|你没打招呼就离开了，因此需要作出解释。
explain away something|为某事辩解；把某事淡化掉|The company could not explain away the gap in its accounts.|公司无法为账目中的缺口找到说辞。
explain the meaning|解释含义|The guide explained the meaning of the symbols on the wall.|导游解释了墙上那些符号的含义。
`),
  hit: fixedPhrasePack(`
hit a ball|击球|She hit the ball over the fence on her second swing.|她第二次挥拍就把球打过了围栏。
hit a target|击中目标|Only two arrows hit the center of the target.|只有两支箭射中了靶心。
hit the wall|遇到极限；撞墙|After thirty kilometers, the runner hit the wall and had to slow down.|跑了三十公里后，选手体力到了极限，不得不减速。
hit your head|撞到头|He hit his head on the low doorway.|他撞到了低矮的门框上。
hit an all-time low|跌至历史最低点|Public confidence in the service hit an all-time low after the outage.|服务中断后，公众信任度跌至历史最低点。
hit the brakes|猛踩刹车|The driver hit the brakes when a deer crossed the road.|一只鹿穿过公路时，司机猛踩了刹车。
hit the road|出发上路|We packed the van and hit the road before dawn.|我们装好面包车，在黎明前出发上路。
hit the headlines|成为头条新闻|The discovery hit the headlines around the world.|这项发现登上了世界各地的新闻头条。
hit hard|造成沉重打击|The drought hit small farms particularly hard.|干旱对小型农场造成了尤其沉重的打击。
hit back|反击；回击|The minister hit back at claims that the funds had been wasted.|部长反驳了资金遭浪费的说法。
hit upon an idea|偶然想到主意|During the train journey, she hit upon an idea for reducing waste.|乘火车途中，她偶然想到了一个减少浪费的办法。
hit rock bottom|跌至谷底|His confidence hit rock bottom after the third rejection.|第三次被拒后，他的自信心跌到了谷底。
`),
  pull: fixedPhrasePack(`
pull a door open|拉开门|She pulled the heavy door open with both hands.|她用双手拉开了那扇沉重的门。
pull a rope|拉绳子|The sailors pulled the rope until the sail was tight.|水手们拉紧绳索，直到船帆绷紧。
pull a cart|拉手推车|A small tractor pulled the cart across the orchard.|一辆小拖拉机拉着车穿过果园。
pull out a drawer|拉开抽屉|He pulled out a drawer and found the missing key.|他拉开一个抽屉，找到了丢失的钥匙。
pull up a chair|拉把椅子坐下|Pull up a chair and join us for lunch.|拉把椅子过来，和我们一起吃午饭吧。
pull over|靠边停车|The driver pulled over safely when the warning light came on.|警示灯亮起时，司机安全地把车停在了路边。
pull away|驶离|The train pulled away just as we reached the platform.|我们刚到站台，火车就驶离了。
pull through|渡过难关；康复|Doctors expect the injured climber to pull through.|医生预计这名受伤的登山者能够挺过来。
pull together|齐心协力|Neighbors pulled together to repair the flood-damaged school.|邻居们齐心协力修复被洪水损坏的学校。
pull strings|利用关系|He refused to pull strings to secure his son a job.|他拒绝利用关系为儿子谋取工作。
pull someone aside|把某人拉到一旁私下说|The coach pulled Maya aside to discuss her injury privately.|教练把玛雅叫到一旁，私下讨论她的伤势。
pull something apart|把某物拆开|The mechanic pulled the engine apart to locate the fault.|机械师拆开发动机查找故障。
`),
  raise: fixedPhrasePack(`
raise a hand|举手|A student raised her hand to ask for clarification.|一名学生举手请求进一步说明。
raise a flag|升旗|The guards raise the national flag at sunrise.|卫兵在日出时升起国旗。
raise prices|提高价格|The bakery had to raise prices after flour became more expensive.|面粉涨价后，面包店不得不提高价格。
raise wages|提高工资|The agreement will raise wages for hospital cleaners.|这项协议将提高医院保洁人员的工资。
raise funds|筹集资金|The concert raised funds for families displaced by the fire.|这场音乐会为因火灾无家可归的家庭筹集了资金。
raise awareness|提高认识|The campaign raises awareness of early signs of stroke.|这项活动提高公众对中风早期迹象的认识。
raise a question|提出问题|The missing signature raises a serious question about the contract.|缺失的签名让人对这份合同产生一个严重疑问。
raise concerns|引起担忧|Cracks in the dam have raised concerns about its safety.|大坝上的裂缝引发了安全方面的担忧。
raise a child|抚养孩子|She raised three children while running a small shop.|她一边经营小店，一边抚养三个孩子。
raise cattle|养牛|The family has raised cattle on this land for four generations.|这个家族已在这片土地上养牛四代。
raise standards|提高标准|The new inspection system has raised safety standards across the industry.|新的检查制度提高了整个行业的安全标准。
raise your voice|提高嗓门|He remained calm and never raised his voice during the argument.|争论中他一直很冷静，从未提高嗓门。
`),
  wear: fixedPhrasePack(`
wear a coat|穿外套|Wear a warm coat because temperatures will fall tonight.|穿件暖和的外套吧，今晚会降温。
wear glasses|戴眼镜|She wears glasses only when reading small print.|她只有看小字时才戴眼镜。
wear a helmet|戴头盔|Every rider must wear a helmet on the construction site.|施工现场的每名骑行者都必须戴头盔。
wear a uniform|穿制服|Hotel staff wear a dark blue uniform.|酒店员工穿深蓝色制服。
wear a smile|面带微笑|Despite the delay, the receptionist still wore a welcoming smile.|尽管出现延误，接待员仍面带亲切的微笑。
wear makeup|化妆|She rarely wears makeup outside formal events.|除正式场合外，她很少化妆。
wear a seat belt|系安全带|Passengers must wear a seat belt while the vehicle is moving.|车辆行驶时，乘客必须系安全带。
wear well|耐穿；经久耐用|These leather boots wear well even in wet weather.|这双皮靴即使在潮湿天气里也很耐穿。
wear thin|逐渐失去耐心；磨薄|After the third unexplained delay, everyone's patience was wearing thin.|第三次无故延误后，大家都快失去耐心了。
wear away|逐渐磨损；侵蚀|Years of wind and rain wore away the carved lettering.|多年的风吹雨打磨掉了雕刻的文字。
wear out shoes|把鞋穿坏|Walking ten kilometers to work every day quickly wore out his shoes.|每天步行十公里上班很快就把他的鞋穿坏了。
wear your hair short|留短发|She has worn her hair short since joining the swimming team.|自从加入游泳队以来，她一直留短发。
`),
  return: fixedPhrasePack(`
return home|回家|The medical team returned home after six weeks abroad.|医疗队在国外工作六周后回到了家。
return to work|重返工作|He returned to work gradually after the operation.|手术后，他逐步恢复了工作。
return a book|归还书籍|Library members must return each borrowed book by its due date.|图书馆会员必须在到期日前归还每本借阅书籍。
return a call|回电话|The doctor returned my call during her lunch break.|医生在午休时回了我的电话。
return a favor|回报帮助|You helped me move, so let me return the favor.|你帮我搬过家，这次让我回报你吧。
return to normal|恢复正常|Train services returned to normal after the storm.|暴风雨过后，列车服务恢复了正常。
return the money|归还钱款|The seller agreed to return the money within five working days.|卖方同意在五个工作日内退款。
return from abroad|从国外回来|She returned from abroad in time for her father's birthday.|她及时从国外回来参加父亲的生日聚会。
return safely|安全返回|All twelve climbers returned safely before dark.|十二名登山者都在天黑前安全返回。
return an item for a refund|退货退款|You may return an unopened item for a full refund.|未拆封商品可以退货并获得全额退款。
return to the subject|回到主题|After answering the question, the lecturer returned to the subject of migration.|回答问题后，讲师回到了迁徙这个主题。
return a profit|产生收益|The small solar project returned a profit in its third year.|这个小型太阳能项目在第三年实现了盈利。
`),
  choose: fixedPhrasePack(`
choose an option|选择一个选项|Customers can choose an option that matches their budget.|顾客可以选择符合自己预算的选项。
choose a candidate|选择候选人|The panel chose a candidate with extensive field experience.|评审小组选了一名实地经验丰富的候选人。
choose a date|选定日期|We chose a date after checking everyone's schedule.|查看所有人的日程后，我们选定了日期。
choose carefully|谨慎选择|Choose carefully because the subscription cannot be changed later.|请谨慎选择，因为订阅方案之后无法更改。
choose between two routes|在两条路线中选择|Drivers must choose between the coastal route and the mountain road.|司机必须在沿海路线和山路之间作出选择。
choose to stay|选择留下|Several volunteers chose to stay and help clean the shelter.|几名志愿者选择留下来帮助清理避难所。
choose not to answer|选择不回答|The witness chose not to answer questions about her family.|证人选择不回答有关家人的问题。
choose from a menu|从菜单中选择|Children can choose from a menu of four healthy meals.|孩子们可以从包含四种健康餐食的菜单中选择。
choose a career|选择职业|Talking to a mentor helped him choose a career in engineering.|与导师交谈帮助他选择了工程领域的职业。
choose your words|斟酌用词|Choose your words carefully when explaining the diagnosis.|解释诊断结果时要谨慎措辞。
choose a winner|选出获胜者|Readers will vote to choose the photography contest winner.|读者将投票选出摄影比赛的获胜者。
choose for yourself|自己选择|Try both keyboards and choose for yourself which feels better.|两种键盘都试一下，自己选择手感更好的那一个。
`),
  cause: fixedPhrasePack(`
cause a problem|引起问题|The missing file caused a problem during the final audit.|缺失的文件在最终审核中引起了问题。
cause damage to something|对某物造成损害|Salt water can cause serious damage to the engine.|盐水会对发动机造成严重损害。
cause someone trouble|给某人带来麻烦|I am sorry the schedule change caused you so much trouble.|很抱歉日程变更给你带来了这么多麻烦。
cause concern|引起担忧|The sudden fall in water pressure caused concern among residents.|水压突然下降引起了居民的担忧。
cause confusion|造成混乱|Using two different labels for the same room caused confusion.|同一房间使用两个不同名称造成了混乱。
cause an accident|导致事故|Poor visibility caused an accident on the coastal road.|能见度低导致沿海公路发生了一起事故。
cause a delay|导致延误|A signal failure caused a forty-minute delay.|信号故障导致了四十分钟的延误。
cause pain|引起疼痛|Stop the exercise if it causes pain in your knee.|如果这项运动引起膝盖疼痛，就停下来。
cause a reaction|引起反应|This medicine may cause an allergic reaction in some patients.|这种药可能使部分患者出现过敏反应。
cause prices to rise|导致价格上涨|A poor harvest could cause food prices to rise.|歉收可能导致食品价格上涨。
cause someone to do something|使某人做某事|The alarm caused everyone to leave the building immediately.|警报使所有人立即离开了大楼。
be caused by something|由某事物引起|The network failure was caused by a damaged cable.|网络故障是由一根受损电缆造成的。
`),
  join: fixedPhrasePack(`
join a team|加入团队|She joined the pediatric team in March.|她三月加入了儿科团队。
join a club|加入俱乐部|I joined a local running club to train for my first race.|我加入了当地跑步俱乐部，为第一次比赛训练。
join an organization|加入组织|He joined the conservation organization as a volunteer.|他以志愿者身份加入了这个环保组织。
join someone for dinner|与某人共进晚餐|Would you like to join us for dinner after the concert?|音乐会结束后，你愿意和我们一起吃晚饭吗？
join in an activity|参加活动|Even the youngest children joined in the beach cleanup.|就连年龄最小的孩子也参加了海滩清理活动。
join forces with someone|与某人联手|The two villages joined forces to repair the damaged bridge.|两个村庄联手修复受损的桥梁。
join two pieces together|把两部分连接起来|Use these metal clips to join the two panels together.|用这些金属夹把两块面板连接起来。
join the queue|排队|We joined the queue outside the ticket office at eight.|我们八点在售票处外排起了队。
join a meeting online|在线参加会议|Remote staff can join the meeting online through a secure link.|远程员工可以通过安全链接在线参加会议。
join the conversation|加入谈话|Mina joined the conversation when the topic turned to public transport.|话题转到公共交通时，米娜加入了谈话。
join hands|手拉手；携手合作|Residents and businesses joined hands to reopen the community center.|居民和企业携手合作，重新开放了社区中心。
join one road to another|把一条路与另一条路连接起来|A short tunnel joins the village road to the main highway.|一条短隧道把村道与主干公路连接起来。
`),
  develop: fixedPhrasePack(`
develop a skill|培养技能|Daily conversation practice helped her develop greater fluency.|每天练习会话帮助她提高了流利度。
develop a product|开发产品|The engineers developed a low-cost water filter for rural homes.|工程师开发了一款供农村家庭使用的低成本净水器。
develop a plan|制定计划|The council developed a plan to protect homes from flooding.|市政委员会制定了一项保护住宅免受洪水侵袭的计划。
develop an interest in something|对某事产生兴趣|He developed an interest in astronomy after visiting the observatory.|参观天文台后，他对天文学产生了兴趣。
develop symptoms|出现症状|Contact a doctor if you develop symptoms after the trip.|旅行后如出现症状，请联系医生。
develop a habit|养成习惯|She developed a habit of reviewing her notes each evening.|她养成了每天晚上复习笔记的习惯。
develop a theory|提出并发展理论|Researchers developed a theory to explain the unusual migration pattern.|研究人员提出并发展了一套理论，用来解释异常的迁徙模式。
develop software|开发软件|The company develops software for small medical clinics.|这家公司为小型诊所开发软件。
develop land|开发土地|The authority refused permission to develop the protected land.|有关部门拒绝批准开发这片保护用地。
develop film|冲洗胶片|The photographer still develops black-and-white film in her darkroom.|这位摄影师仍在暗房里冲洗黑白胶片。
develop into something|发展成为某事物|The local workshop developed into a successful manufacturing business.|这家本地作坊发展成了一家成功的制造企业。
develop over time|随时间发展|Trust develops over time through honest communication.|信任通过坦诚沟通逐渐建立。
`),
  share: fixedPhrasePack(`
share a room|合住房间|The two interns shared a room near the hospital.|两名实习生合住在医院附近的一个房间里。
share a meal|一起用餐|Neighbors shared a meal after repairing the community garden.|邻居们修好社区花园后一起吃了顿饭。
share the cost|分担费用|Four families agreed to share the cost of the new fence.|四户家庭同意分担新围栏的费用。
share information|分享信息|Clinics share information only with the patient's consent.|诊所只有在患者同意后才会共享信息。
share an opinion|发表看法|Each student had two minutes to share an opinion on the proposal.|每名学生有两分钟发表对提案的看法。
share a concern|有同样的担忧|Several parents share the concern about traffic near the school.|几位家长同样担心学校附近的交通问题。
share responsibility|共同承担责任|Parents and teachers share responsibility for children's online safety.|家长和教师共同承担保护儿童网络安全的责任。
share a link|分享链接|The coordinator shared the registration link with new volunteers.|协调员把注册链接分享给了新志愿者。
share something with a group|与小组分享某事|Lena shared her field notes with the research group.|莉娜把实地笔记分享给了研究小组。
share equally|平均分配|The three partners agreed to share the profits equally.|三位合伙人同意平均分配利润。
share common interests|有共同兴趣|The neighbors became friends because they shared common interests.|这些邻居因为有共同兴趣而成了朋友。
share something on social media|在社交媒体上分享某物|The museum shared photographs of the restored painting on social media.|博物馆在社交媒体上分享了修复后画作的照片。
`),
  realize: fixedPhrasePack(`
realize that + clause|意识到……|He realized that the back door had been left unlocked.|他意识到后门一直没有锁。
realize how important something is|意识到某事有多重要|The drought made everyone realize how important clean water is.|这场干旱让所有人意识到清洁用水有多重要。
realize what has happened|意识到发生了什么|She needed a moment to realize what had happened.|她过了一会儿才意识到发生了什么。
realize a dream|实现梦想|After years of training, he realized his dream of becoming a pilot.|经过多年训练，他实现了成为飞行员的梦想。
realize a goal|实现目标|The savings plan helped them realize their goal of buying a home.|储蓄计划帮助他们实现了购房目标。
realize an ambition|实现抱负|She moved abroad to realize her ambition of conducting medical research.|她移居国外，以实现从事医学研究的抱负。
realize your full potential|充分发挥潜力|Individual coaching can help young athletes realize their full potential.|一对一指导可以帮助年轻运动员充分发挥潜力。
realize a plan|落实计划；使计划成为现实|The village lacked the funding needed to realize its flood-control plan.|村里缺少落实防洪计划所需的资金。
realize the value of something|认识到某物的价值|I did not realize the value of the training until an emergency occurred.|直到发生紧急情况，我才认识到那次培训的价值。
realize your mistake|意识到自己的错误|She realized her mistake as soon as she checked the original figures.|她一核对原始数据就意识到了自己的错误。
fail to realize something|没有意识到某事|Many buyers fail to realize how quickly maintenance costs accumulate.|许多买家没有意识到维护费用累积得有多快。
suddenly realize something|突然意识到某事|Halfway home, I suddenly realized that my passport was still at the hotel.|回家途中走到一半，我突然意识到护照还在酒店。
`),
  describe: fixedPhrasePack(`
describe a person|描述一个人|The witness described the driver as tall and middle-aged.|证人描述司机身材高大、年龄约为中年。
describe a place|描述一个地方|In her letter, Mei described the village where she grew up.|梅在信中描述了自己长大的村庄。
describe an experience|描述经历|The climbers described their rescue as frightening but well organized.|登山者说那次救援令人害怕，但组织得很好。
describe how something works|说明某物如何运作|The manual describes how the emergency brake works.|说明书介绍了紧急制动器的工作原理。
describe the difference|描述差异|Can you describe the difference between the two types of pain?|你能描述一下这两种疼痛的区别吗？
describe something as + adjective|称某物为……|Residents described the new crossing as much safer.|居民称新的过街设施安全得多。
describe something in detail|详细描述某事|The patient described her symptoms in detail to the doctor.|患者向医生详细描述了自己的症状。
describe something accurately|准确描述某事|This map accurately describes the boundary as it existed in 1950.|这张地图准确标示了1950年时的边界。
describe a process|说明流程|The guide describes the process for applying for a permit.|指南说明了申请许可证的流程。
describe a pattern|描述规律|The report describes a pattern of repeated equipment failures.|报告描述了设备反复故障的规律。
describe your symptoms|描述症状|Describe your symptoms and when they first appeared.|请描述你的症状以及最初出现的时间。
describe a circle|画出圆形轨迹|The bird described a wide circle above the lake before landing.|那只鸟在湖面上空盘旋了一大圈后落下。
`),
  increase: fixedPhrasePack(`
increase the price|提高价格|The supplier increased the price of steel by six percent.|供应商把钢材价格提高了百分之六。
increase production|增加产量|The factory added a night shift to increase production.|工厂增加夜班以提高产量。
increase twofold|增加到两倍|Online applications increased twofold over five years.|线上申请量在五年间增加到了两倍。
increase something from five to ten|把某物从五增加到十|The clinic increased the number of evening appointments from five to ten.|诊所把晚间预约名额从五个增加到十个。
increase in size|尺寸增大|The swelling may increase in size during the first twenty-four hours.|肿胀在最初二十四小时内可能会变大。
increase rapidly|快速增长|Demand for home batteries increased rapidly after prices fell.|家用电池降价后，需求迅速增长。
increase capacity|增加容量|The airport opened a new terminal to increase capacity.|机场启用新航站楼以提高运力。
increase efficiency|提高效率|Digital records increased efficiency in the busy clinic.|电子病历提高了这家繁忙诊所的效率。
increase the risk|增加风险|Driving while tired significantly increases the risk of an accident.|疲劳驾驶会显著增加事故风险。
increase demand|增加需求|Free weekend travel increased demand for train services.|周末免费出行增加了列车服务需求。
increase awareness|提高认识|The exhibition aims to increase awareness of ocean pollution.|这场展览旨在提高人们对海洋污染的认识。
increase your chances|提高机会|Submitting a complete application will increase your chances of approval.|提交完整申请会提高获批的机会。
`),
  protect: fixedPhrasePack(`
protect a child|保护孩子|The new barrier protects children from traffic near the school.|新的隔离栏保护孩子免受学校附近车流的威胁。
protect your skin|保护皮肤|Wear a hat and sunscreen to protect your skin from strong sunlight.|戴帽子并涂防晒霜，以保护皮肤免受强烈日晒。
protect against fraud|防范欺诈|Two-step verification helps protect customers against fraud.|双重验证有助于保护顾客免遭欺诈。
protect something from damage|防止某物受损|A padded case protects the camera from damage during travel.|带衬垫的保护盒可防止相机在旅途中受损。
protect personal data|保护个人数据|The hospital encrypts every file to protect personal data.|医院对每个文件加密，以保护个人数据。
protect a habitat|保护栖息地|Local volunteers are working to protect the turtle's nesting habitat.|当地志愿者正在努力保护海龟的筑巢栖息地。
protect legal rights|保护合法权利|Independent courts help protect citizens' legal rights.|独立法院有助于保护公民的合法权利。
protect an investment|保护投资|Diversifying the portfolio can protect an investment during a downturn.|分散投资可以在经济低迷时保护投资。
protect the environment|保护环境|The regulation limits toxic waste to protect the environment.|这项规定限制有毒废物，以保护环境。
protect a screen|保护屏幕|Tempered glass protects the phone screen from scratches.|钢化玻璃可保护手机屏幕不被刮伤。
protect workers|保护工人|Stricter ventilation rules protect workers from harmful dust.|更严格的通风规定保护工人免受有害粉尘影响。
protect confidential information|保护机密信息|Staff must use secure channels to protect confidential information.|员工必须使用安全渠道保护机密信息。
`),
  compare: fixedPhrasePack(`
compare two prices|比较两个价格|Compare the two prices before you choose a supplier.|选择供应商前先比较这两个价格。
compare results|比较结果|Researchers compared the results from three independent trials.|研究人员比较了三次独立试验的结果。
compare something with last year|将某事物与去年比较|The chart compares this month's sales with last year's figures.|图表将本月销量与去年同期数据进行了比较。
compare one model with another|把一个型号与另一个比较|The review compares one battery model with another under identical conditions.|这篇评测在相同条件下比较了两款电池型号。
compare side by side|并排比较|Place the samples under the same light and compare them side by side.|把样品放在相同光线下并排比较。
compare favorably with something|与某物相比表现良好|The new insulation compares favorably with more expensive materials.|这种新保温材料与更昂贵的材料相比毫不逊色。
compare notes|交换并比较信息|The two inspectors compared notes before writing the final report.|两名检查员在撰写最终报告前交换并核对了记录。
compare data sets|比较数据集|The analyst compared data sets from urban and rural clinics.|分析师比较了城市和农村诊所的数据集。
compare features|比较功能|This table lets buyers compare the features of all four plans.|这张表让买家可以比较四种方案的功能。
compare performance|比较表现|The trial compared the performance of electric and diesel buses.|这项试验比较了电动公交车和柴油公交车的性能。
compare someone to a hero|把某人比作英雄|The newspaper compared the firefighter to a national hero.|报纸把这名消防员比作民族英雄。
compare like with like|比较同类对象|Adjust the figures for inflation so that you compare like with like.|请根据通胀调整数据，以便进行同类比较。
`),
  reduce: fixedPhrasePack(`
reduce costs|降低成本|The warehouse reduced costs by using less packaging.|仓库通过减少包装降低了成本。
reduce waste|减少浪费|Reusable containers have reduced food waste in the cafeteria.|可重复使用的容器减少了食堂的食物浪费。
reduce the risk|降低风险|Regular inspections reduce the risk of equipment failure.|定期检查可以降低设备故障的风险。
reduce something by half|把某物减少一半|The new process reduced water use by half.|新工艺把用水量减少了一半。
reduce something from ten to six|把某物从十减到六|The revised schedule reduced the number of weekly meetings from ten to six.|修订后的日程把每周会议次数从十次减到了六次。
reduce pressure|减轻压力|Hiring two assistants reduced pressure on the emergency team.|增聘两名助理减轻了急救团队的压力。
reduce the size|缩小尺寸|Engineers reduced the size of the sensor without affecting accuracy.|工程师缩小了传感器尺寸，同时没有影响精度。
reduce speed|降低速度|Drivers must reduce speed near the temporary crossing.|司机在临时人行横道附近必须减速。
reduce emissions|减少排放|Replacing old boilers could reduce emissions by thirty percent.|更换旧锅炉可将排放减少百分之三十。
reduce a sauce|收浓酱汁|Simmer the sauce uncovered until it reduces by one third.|不盖锅盖小火煮酱汁，直到收浓三分之一。
reduce something to ashes|把某物烧成灰烬|The wildfire reduced several empty cabins to ashes.|野火把几间空木屋烧成了灰烬。
reduce dependence on oil|减少对石油的依赖|The city is expanding rail transport to reduce dependence on oil.|该市正在扩大轨道交通，以减少对石油的依赖。
`),
  accept: fixedPhrasePack(`
accept an offer|接受提议|After reviewing the benefits, she accepted the job offer.|了解各项福利后，她接受了这份工作邀请。
accept an invitation|接受邀请|The scientist accepted an invitation to speak at the conference.|这位科学家接受了在会议上发言的邀请。
accept responsibility|承担责任|The contractor accepted responsibility for the faulty wiring.|承包商为有问题的布线承担了责任。
accept the truth|接受事实|It took him several weeks to accept the truth about the closure.|他花了几周时间才接受关闭的事实。
accept payment|接受付款|The clinic accepts payment by card or bank transfer.|诊所接受刷卡或银行转账付款。
accept an application|受理申请|The office will not accept an incomplete application.|办事处不受理材料不完整的申请。
accept a gift|收下礼物|She accepted the handmade gift with genuine gratitude.|她满怀感激地收下了这份手工礼物。
accept an apology|接受道歉|He accepted her apology but asked for time to rebuild trust.|他接受了她的道歉，但表示重建信任需要时间。
accept someone as a member|接纳某人为成员|The association accepted three students as full members.|协会接纳了三名学生为正式会员。
accept that + clause|接受……这一事实|We must accept that the repairs will take longer than expected.|我们必须接受维修时间会超过预期这一事实。
accept defeat|承认失败|The champion accepted defeat and congratulated her opponent.|冠军接受了失败，并向对手表示祝贺。
accept the terms|接受条款|Both companies accepted the terms of the settlement.|两家公司都接受了和解条款。
`),
  prepare: fixedPhrasePack(`
prepare a meal|准备一顿饭|Ravi prepared a simple meal for the night-shift nurses.|拉维为上夜班的护士准备了一顿简单的饭。
prepare a report|准备报告|The auditor prepared a report on the missing funds.|审计员就失踪资金准备了一份报告。
prepare for an exam|备考|She prepares for the entrance exam at the library each evening.|她每天晚上都在图书馆准备入学考试。
prepare to leave|准备离开|Passengers prepared to leave the train as it approached the terminal.|列车接近终点站时，乘客们准备下车。
prepare someone for an interview|帮助某人准备面试|A career adviser prepared him for the second interview.|职业顾问帮助他为第二轮面试作了准备。
prepare the room|布置房间|Staff prepared the room for an emergency meeting.|工作人员为紧急会议布置了房间。
prepare in advance|提前准备|We prepared in advance for possible power cuts.|我们提前为可能发生的停电作了准备。
prepare a budget|编制预算|The finance team prepared a budget for the renovation.|财务团队为翻修工程编制了预算。
prepare the ingredients|准备食材|Prepare the ingredients before you heat the pan.|加热平底锅前先准备好食材。
prepare for the worst|作最坏打算|The coastal town prepared for the worst as the storm approached.|暴风雨逼近时，这座沿海小镇作好了最坏打算。
prepare a statement|准备声明|Her lawyer prepared a short statement for the press.|她的律师为媒体准备了一份简短声明。
prepare yourself mentally|做好心理准备|Prepare yourself mentally for a long and demanding recovery.|请为漫长而艰难的康复过程做好心理准备。
`),
  avoid: fixedPhrasePack(`
avoid a mistake|避免错误|Check the account number twice to avoid a costly mistake.|把账号核对两遍，以免犯下代价高昂的错误。
avoid an accident|避免事故|The driver slowed down to avoid an accident on the icy road.|司机减速以避免在结冰路面上发生事故。
avoid doing something|避免做某事|Avoid touching the lens when you clean the camera.|清洁相机时，避免触摸镜头。
avoid contact|避免接触|Patients with the infection should avoid close contact with others.|感染者应避免与他人密切接触。
avoid eye contact|避免目光接触|The nervous witness avoided eye contact with the lawyer.|紧张的证人避开了律师的目光。
avoid the subject|回避话题|Whenever I asked about the missing money, he avoided the subject.|每当我问起失踪的钱，他都会回避这个话题。
avoid unnecessary costs|避免不必要开支|Planning the route carefully helped us avoid unnecessary fuel costs.|仔细规划路线帮助我们避免了不必要的燃油开支。
avoid rush hour|避开高峰期|We left before seven to avoid the morning rush hour.|我们七点前出发，以避开早高峰。
avoid processed food|避免加工食品|Her dietitian advised her to avoid highly processed food.|营养师建议她避免高度加工的食品。
avoid something at all costs|不惜一切代价避免某事|The rescue crew must avoid a collision at all costs.|救援人员必须不惜一切代价避免碰撞。
avoid someone deliberately|故意躲着某人|He had been deliberately avoiding his landlord since the rent was due.|房租到期后，他一直故意躲着房东。
avoid making trouble|避免惹麻烦|The visitors followed local rules to avoid making trouble.|游客遵守当地规定，以免惹麻烦。
`),
  notice: fixedPhrasePack(`
notice a change|注意到变化|Residents noticed a change in the taste of the tap water.|居民注意到自来水的味道发生了变化。
notice a difference|注意到差异|I noticed a clear difference after the filter was replaced.|更换过滤器后，我注意到了明显差异。
notice a mistake|注意到错误|The editor noticed a mistake in the final paragraph.|编辑注意到最后一段有个错误。
notice someone do something|注意到某人做了某事|A guard noticed a visitor remove the warning sign.|一名警卫看到一名访客取下了警示牌。
notice someone doing something|注意到某人正在做某事|She noticed a child waiting alone by the entrance.|她注意到一个孩子独自在入口处等候。
notice that + clause|注意到……|I noticed that the kitchen light was still on.|我注意到厨房的灯还亮着。
notice something immediately|立刻注意到某事|The technician immediately noticed the smell of burning plastic.|技术员立刻注意到了塑料烧焦的气味。
notice hardly any change|几乎没注意到变化|After the minor update, most users noticed hardly any change.|小幅更新后，大多数用户几乎没察觉到变化。
notice a pattern|注意到规律|Doctors noticed a pattern among patients with the same symptoms.|医生注意到症状相同的患者之间存在一种规律。
notice signs of damage|注意到损坏迹象|The inspector noticed signs of water damage beneath the window.|检查员注意到窗户下方有水损迹象。
notice the warning|留意警告|Few drivers noticed the warning hidden behind the tree.|很少有司机注意到被树挡住的警告牌。
notice someone's absence|注意到某人缺席|The teacher noticed Mia's absence before taking attendance.|老师在点名前就注意到米娅缺席了。
`),
  affect: fixedPhrasePack(`
affect health|影响健康|Long-term exposure to the chemical can affect lung health.|长期接触这种化学物质可能影响肺部健康。
affect performance|影响表现|Lack of sleep affected her performance in the final race.|睡眠不足影响了她在决赛中的表现。
affect the outcome|影响结果|A single counting error could affect the outcome of the election.|一个计票错误就可能影响选举结果。
affect people differently|对不同人产生不同影响|The medicine affects people differently depending on their age.|这种药对不同年龄的人影响不同。
affect prices|影响价格|Poor harvests often affect food prices.|歉收往往会影响食品价格。
affect behavior|影响行为|Bright nighttime lighting can affect animal behavior.|夜间强光会影响动物行为。
affect the environment|影响环境|The review examines how the mine may affect the environment.|评估报告审查这座矿山可能对环境造成的影响。
affect a decision|影响决定|Personal friendships should not affect a hiring decision.|私人友谊不应影响录用决定。
be deeply affected by something|深受某事触动|The entire community was deeply affected by the firefighter's death.|这名消防员去世让整个社区深受触动。
affect a calm manner|装出镇定的样子|Although he was nervous, the actor affected a calm manner before the audition.|尽管很紧张，这名演员在试镜前仍装出镇定的样子。
affect a whole region|影响整个地区|A prolonged drought can affect a whole region's food supply.|长期干旱可能影响整个地区的粮食供应。
affect how something works|影响某物的运作方式|Extreme cold affects how lithium batteries work.|极寒会影响锂电池的工作方式。
`),
  manage: fixedPhrasePack(`
manage a project|管理项目|Nadia manages a three-year project to restore the wetlands.|纳迪娅负责一个为期三年的湿地修复项目。
manage a team|管理团队|He manages a team of twelve maintenance engineers.|他管理着一支由十二名维修工程师组成的团队。
manage a budget|管理预算|The producer managed a tight budget without reducing safety standards.|制片人在没有降低安全标准的情况下管好了紧张的预算。
manage your time|管理时间|She uses a weekly plan to manage her time during exam season.|考试季她用周计划来安排时间。
manage a difficult situation|应对困难局面|The station manager calmly managed a difficult situation after the cancellation.|列车取消后，站长冷静地处理了困难局面。
manage a business|经营企业|The brothers manage a small printing business together.|兄弟俩共同经营一家小型印刷企业。
manage expectations|管理预期|Clear updates help manage customers' expectations during delays.|延误期间提供清晰的最新信息有助于管理顾客预期。
manage risk|管理风险|The farm uses several crops to manage the risk of poor weather.|这家农场种植多种作物，以管理恶劣天气带来的风险。
manage to do something|设法做成某事|Despite the road closure, the ambulance managed to arrive on time.|尽管道路封闭，救护车还是设法准时到达了。
manage without help|没有帮助也能应付|After some practice, she could manage the software without help.|练习一段时间后，她无需帮助也能操作这个软件。
manage under pressure|在压力下应付|Emergency nurses must make sound decisions and manage under pressure.|急诊护士必须在压力下作出稳妥决定并妥善应对。
manage the workload|应付工作量|Two temporary assistants helped the team manage the winter workload.|两名临时助理帮助团队应对冬季工作量。
`),
  improve: fixedPhrasePack(`
improve a skill|提高技能|Recording her presentations helped Lina improve her speaking skills.|录下自己的演讲帮助莉娜提高了口语技能。
improve performance|提升表现|Replacing the old battery improved the laptop's performance.|更换旧电池提升了笔记本电脑的性能。
improve quality|提高质量|The bakery changed flour suppliers to improve the quality of its bread.|面包店更换面粉供应商，以提高面包质量。
improve efficiency|提高效率|A shared calendar improved efficiency across the three offices.|共享日历提高了三个办公室之间的协作效率。
improve your health|改善健康|Regular walking can improve your heart health.|规律步行可以改善心脏健康。
improve the situation|改善局面|Opening a second checkout desk immediately improved the situation.|增开第二个收银台后，情况立刻有所改善。
improve over time|随时间逐渐改善|Her balance improved over time with physical therapy.|经过物理治疗，她的平衡能力逐渐改善。
improve with practice|通过练习提高|Your pronunciation will improve with focused practice.|通过有针对性的练习，你的发音会得到改善。
improve by a percentage|提高一定百分比|Response times improved by twelve percent after the software update.|软件更新后，响应时间提高了百分之十二。
improve on the original|比原版更好|The second design improves on the original by using less material.|第二版设计比原版更好，因为使用了更少的材料。
improve access|改善可及性|The new ramp improves access for visitors who use wheelchairs.|新坡道改善了轮椅使用者的通行条件。
improve safety|提高安全性|Brighter platform lighting has improved passenger safety at night.|更明亮的站台照明提高了乘客夜间的安全性。
`),
  discover: fixedPhrasePack(`
discover a species|发现一个物种|Biologists discovered a new frog species in the cloud forest.|生物学家在云雾森林中发现了一个新的蛙类物种。
discover a place|发现一个地方|We discovered a quiet beach beyond the headland.|我们在海岬另一边发现了一处安静的海滩。
discover the truth|发现真相|The family discovered the truth after reading the archived letters.|这家人读过存档信件后发现了真相。
discover that + clause|发现……|Engineers discovered that the foundation had shifted.|工程师发现地基发生了位移。
discover how something works|弄清某物如何运作|By taking the clock apart, she discovered how its mechanism worked.|她拆开时钟，弄清了机械装置的工作原理。
discover a talent|发现天赋|His teacher discovered his talent for mental arithmetic.|老师发现了他的心算天赋。
discover new music|接触并发现新音乐|The community radio station helped me discover new music.|社区广播电台让我接触到了新的音乐。
discover evidence|发现证据|Investigators discovered evidence of repeated safety violations.|调查人员发现了反复违反安全规定的证据。
discover a fault|发现故障|A routine inspection discovered a fault in the braking system.|例行检查发现了制动系统中的故障。
discover something by chance|偶然发现某物|She discovered the hidden photograph by chance while moving a cabinet.|她搬动橱柜时偶然发现了那张藏起来的照片。
discover something for yourself|亲自发现某事|Visit the night market and discover its remarkable food for yourself.|亲自去逛夜市，感受那里非凡的美食吧。
discover the cause|查明原因|Tests helped doctors discover the cause of his persistent cough.|检查帮助医生查明了他持续咳嗽的原因。
`),
  handle: fixedPhrasePack(`
handle a problem|处理问题|The support team handled the login problem within an hour.|支持团队在一小时内处理了登录问题。
handle a complaint|处理投诉|The manager handled the complaint calmly and offered a refund.|经理冷静地处理了投诉，并提出退款。
handle a situation|应对局面|She handled the tense situation without raising her voice.|她没有提高嗓门，妥善处理了紧张局面。
handle pressure|承受压力；应对压力|The goalkeeper handles pressure remarkably well in penalty shootouts.|这名守门员在点球大战中非常善于应对压力。
handle with care|小心轻放|These glass instruments must be handled with care.|这些玻璃仪器必须小心拿放。
handle food safely|安全处理食物|Kitchen staff receive training on how to handle food safely.|厨房员工接受如何安全处理食物的培训。
handle confidential data|处理机密数据|Only authorized employees may handle confidential patient data.|只有获授权员工可以处理患者的机密数据。
handle a machine|操作机器|Workers need certification before they can handle this cutting machine.|工人取得资格证后才能操作这台切割机。
handle the workload|应付工作量|The small team could not handle the holiday workload alone.|这个小团队无法独自应对假期的工作量。
handle customer inquiries|处理客户问询|Two specialists handle customer inquiries in Mandarin and English.|两名专员用普通话和英语处理客户问询。
handle a large volume of traffic|承受大量流量|The upgraded server can handle a large volume of traffic.|升级后的服务器可以承受大量流量。
easy to handle|容易操作；容易搬动|The lightweight camera is easy to handle with one hand.|这台轻便相机单手就容易操作。
`),
  achieve: fixedPhrasePack(`
achieve a goal|实现目标|The clinic achieved its goal of cutting waiting times by half.|诊所实现了把等候时间减半的目标。
achieve success|取得成功|The cooperative achieved success by selling directly to customers.|这家合作社通过直接向顾客销售取得了成功。
achieve a result|取得结果|The treatment achieved a better result than researchers expected.|这种治疗取得了比研究人员预期更好的结果。
achieve a high score|取得高分|Consistent practice helped her achieve a high score on the language test.|坚持练习帮助她在语言考试中取得了高分。
achieve independence|实现独立|Reliable public transport can help older people achieve greater independence.|可靠的公共交通可以帮助老年人实现更大程度的独立。
achieve recognition|获得认可|The young designer achieved international recognition for her accessible furniture.|这位年轻设计师凭借无障碍家具设计获得了国际认可。
achieve balance|实现平衡|Flexible hours helped him achieve a healthier balance between work and family.|弹性工作时间帮助他在工作与家庭之间取得了更健康的平衡。
achieve full capacity|达到满负荷|The new plant will achieve full capacity by the end of the year.|新工厂将在年底前达到满负荷生产。
achieve improvement through practice|通过练习取得进步|The choir achieved a clear improvement through daily practice.|合唱团通过每日练习取得了明显进步。
achieve a result within budget|在预算内取得成果|The engineers achieved the required result within budget.|工程师在预算内取得了所需成果。
achieve a standard|达到标准|Every batch must achieve the required safety standard.|每一批产品都必须达到规定的安全标准。
achieve lasting change|实现持久改变|The program combines education and housing support to achieve lasting change.|该项目结合教育与住房支持，以实现持久改变。
`),
  express: fixedPhrasePack(`
express an opinion|表达意见|Every resident had an opportunity to express an opinion on the proposal.|每位居民都有机会表达对提案的意见。
express a feeling|表达感受|The child found it easier to express his feelings through drawing.|这个孩子发现通过绘画更容易表达感受。
express concern|表达担忧|Doctors expressed concern about the shortage of essential medicines.|医生们对基本药物短缺表示担忧。
express gratitude|表达感谢|She wrote to express her gratitude to the rescue crew.|她写信向救援人员表达感谢。
express support|表达支持|Hundreds of neighbors gathered to express support for the library.|数百名邻居聚集起来，表达对图书馆的支持。
express doubt|表示怀疑|Several reviewers expressed doubt about the accuracy of the figures.|几位审查员对数据的准确性表示怀疑。
express yourself|表达自己|Music gave him a way to express himself without words.|音乐让他能够不用语言表达自己。
express something in words|用语言表达某事|She struggled to express her sense of loss in words.|她很难用语言表达自己的失落感。
express something through art|通过艺术表达某事|The exhibition lets young people express their identity through art.|这场展览让年轻人通过艺术表达自我认同。
express something as a percentage|用百分比表示某事|The report expresses each category as a percentage of total spending.|报告用占总支出的百分比表示每个类别。
express sympathy|表示慰问|The mayor expressed sympathy to families affected by the flood.|市长向受洪水影响的家庭表示慰问。
express a preference|表达偏好|Participants may express a preference for morning or afternoon sessions.|参与者可以表达对上午场或下午场的偏好。
`),
  encourage: fixedPhrasePack(`
encourage a student to do something|鼓励学生做某事|Her teacher encouraged her to submit the poem to the school magazine.|老师鼓励她把诗投稿给校刊。
encourage someone to try|鼓励某人尝试|The coach encouraged Amir to try the longer distance.|教练鼓励阿米尔尝试更长的距离。
encourage discussion|鼓励讨论|The facilitator asked open questions to encourage discussion.|主持人提出开放式问题以鼓励讨论。
encourage participation|鼓励参与|Free child care encouraged participation in the evening classes.|免费托儿服务促进了人们参加夜校课程。
encourage growth|促进增长|Lower fees have encouraged growth among small online businesses.|较低的费用促进了小型线上企业的发展。
encourage investment|鼓励投资|Stable regulations encourage investment in renewable energy.|稳定的法规有利于促进可再生能源投资。
encourage healthy habits|鼓励健康习惯|The school provides fresh fruit to encourage healthy eating habits.|学校提供新鲜水果，以鼓励健康饮食习惯。
encourage cooperation|促进合作|Shared training sessions encouraged cooperation between the two departments.|联合培训促进了两个部门之间的合作。
encourage innovation|鼓励创新|Small research grants encourage innovation without creating heavy paperwork.|小额研究资助在不增加繁重文书工作的情况下鼓励创新。
encourage questions|鼓励提问|The lecturer paused frequently to encourage questions from the audience.|讲师频繁停顿，鼓励听众提问。
encourage open communication|鼓励坦诚沟通|Regular team meetings encourage open communication about safety concerns.|定期团队会议鼓励大家坦诚交流安全方面的担忧。
encourage responsible behavior|鼓励负责任的行为|Refundable deposits encourage responsible use of shared bicycles.|可退还押金鼓励人们负责任地使用共享单车。
`),
  depend: fixedPhrasePack(`
depend on the weather|取决于天气|Whether the ferry sails tomorrow depends on the weather.|渡轮明天是否开航取决于天气。
depend on a friend|依靠朋友|During her recovery, she depended on a friend for daily shopping.|康复期间，她依靠一位朋友购买日用品。
depend on funding|依靠资金|The shelter depends on private funding to remain open.|这家避难所依靠私人资金维持运营。
depend on circumstances|视情况而定|The safest route will depend on circumstances at the border.|最安全的路线要视边境的实际情况而定。
depend heavily on imports|严重依赖进口|The island depends heavily on imports for fresh food.|这座岛屿的生鲜食品严重依赖进口。
depend partly on luck|部分取决于运气|Finding a seat on the last train depends partly on luck.|能否在末班车上找到座位部分取决于运气。
depend on accurate data|依靠准确数据|Reliable forecasts depend on accurate weather data.|可靠的预测依赖准确的气象数据。
depend on each other|互相依靠|The two emergency teams depend on each other during major incidents.|重大事件中，两支应急队伍相互依靠。
depend on what happens|取决于发生什么|Our return date depends on what happens at tomorrow's hearing.|我们的返回日期取决于明天听证会的情况。
depend on someone for help|依靠某人帮助|Many isolated residents depend on volunteers for help with groceries.|许多独居居民依靠志愿者帮忙购买食品杂货。
depend entirely on demand|完全取决于需求|The number of evening trains depends entirely on passenger demand.|晚间列车的班次数完全取决于乘客需求。
depend less on cars|减少对汽车的依赖|Better bus routes allow rural families to depend less on cars.|更完善的公交线路让农村家庭可以减少对汽车的依赖。
`),
  prefer: fixedPhrasePack(`
prefer A to B|比起B更喜欢A|Most participants preferred the shorter workshop to the full-day course.|大多数参与者更喜欢短时工作坊，而不是全天课程。
prefer to do something|更愿意做某事|I prefer to walk when the weather is mild.|天气温和时，我更愿意步行。
prefer a particular seat|更喜欢某个座位|She prefers an aisle seat on long flights.|长途飞行时，她更喜欢靠过道的座位。
prefer not to do something|宁愿不做某事|He prefers not to discuss medical details in public.|他宁愿不在公开场合讨论医疗细节。
prefer someone to do something|更希望某人做某事|We would prefer guests to book at least a day ahead.|我们更希望客人至少提前一天预订。
prefer a quiet room|更喜欢安静的房间|The patient prefers a quiet room away from the nurses' station.|患者更喜欢远离护士站的安静房间。
prefer one thing over another|比起另一事物更偏好某物|The editor prefers accuracy over speed.|编辑认为准确性比速度更重要。
prefer one option to another|偏好一个选项而非另一个|Some residents prefer the bus option to the proposed rail line.|一些居民更倾向公交方案，而不是拟议中的铁路线路。
prefer one option by far|明显更喜欢某个选项|Of the three designs, users preferred the simplest one by far.|在三种设计中，用户显然最喜欢最简单的那一种。
prefer the original version|更喜欢原版|Many readers still prefer the original version of the ending.|许多读者仍然更喜欢原版结局。
prefer cashless payment|更倾向无现金支付|Most customers at this branch prefer cashless payment.|这家分店的大多数顾客更倾向无现金支付。
prefer a later date|更喜欢晚些的日期|The venue is available in May, but the organizers prefer a later date.|场地五月有空，但主办方更希望日期晚一些。
`),
  solve: fixedPhrasePack(`
solve a problem|解决问题|Engineers solved the drainage problem by widening the outlet.|工程师通过拓宽出水口解决了排水问题。
solve a puzzle|解开谜题|The children solved the map puzzle without any hints.|孩子们没有提示就解开了地图谜题。
solve a crime|侦破案件|A fingerprint on the window helped detectives solve the crime.|窗户上的一枚指纹帮助侦探侦破了案件。
solve an equation|解方程|Students learned to solve the equation using two different methods.|学生们学会了用两种不同方法解这个方程。
solve a mystery|解开谜团|New satellite images may solve the mystery of the missing vessel.|新的卫星图像可能会解开船只失踪之谜。
solve for x|求x的值|First simplify both sides of the equation, then solve for x.|先化简方程两边，再求x的值。
solve something together|共同解决某事|Residents and engineers solved the flooding issue together.|居民和工程师共同解决了积水问题。
solve something efficiently|高效解决某事|A searchable database helps staff solve customer problems efficiently.|可搜索数据库帮助员工高效解决顾客的问题。
solve a problem at the source|从源头解决问题|Replacing the leaking pipe solved the damp problem at the source.|更换漏水管道从源头解决了潮湿问题。
solve a technical issue|解决技术问题|A remote technician solved the technical issue in ten minutes.|远程技术员在十分钟内解决了技术问题。
solve a logic problem|解决逻辑问题|The candidate solved the logic problem step by step.|应聘者一步一步解决了这道逻辑题。
solve a supply problem|解决供应问题|The hospital solved its oxygen supply problem by adding a second storage tank.|医院通过增设第二个储罐解决了氧气供应问题。
`),
};

for (const [word, fixedPhrases] of Object.entries(reviewedFixedPhrasePacks)) {
  manualCardPacks101150[word].fixedPhrases = fixedPhrases;
}

// Explicit semantic reviews for cards whose base entries above focus on the
// relationship fields. These are authored senses rather than dictionary
// fragments, and every sense includes an example that exercises that sense.
const reviewedMeaningPacks = {
  require: [
    ['v.', 'to need something because it is necessary for a purpose', '需要；有赖于', 'The repair requires specialist tools.', '这项维修需要专用工具。'],
    ['v.', 'to officially demand that someone do something', '要求；规定', 'The rules require visitors to show identification.', '规定要求访客出示身份证明。']
  ],
  listen: [
    ['v.', 'to pay attention to sound or to what someone is saying', '听；倾听', 'Please listen carefully to the instructions.', '请认真听这些说明。'],
    ['v.', 'to take notice of advice and act on it', '听从；听取', 'He finally listened to his doctor.', '他终于听从了医生的建议。']
  ],
  cut: [
    ['v.', 'to divide or open something with a sharp tool', '切；割；剪', 'She cut the paper into narrow strips.', '她把纸剪成了窄条。'],
    ['v.', 'to reduce an amount, level, cost, or length', '削减；缩短', 'The company cut travel costs by ten percent.', '公司把差旅成本削减了百分之十。'],
    ['v.', 'to remove or stop a supply, connection, or part', '切断；删去', 'The editor cut two paragraphs from the article.', '编辑从文章中删去了两段。']
  ],
  decide: [
    ['v.', 'to make a choice after considering the possibilities', '决定；选定', 'We decided to postpone the launch.', '我们决定推迟发布。'],
    ['v.', 'to settle a question, case, contest, or result', '裁定；决定……的结果', 'A final vote will decide the issue.', '最终投票将决定这个问题。']
  ],
  eat: [
    ['v.', 'to put food in your mouth, chew it, and swallow it', '吃；进食', 'We ate a light meal before the concert.', '音乐会前我们吃了一顿便餐。'],
    ['v.', 'to have a meal', '用餐', 'They usually eat at about seven.', '他们通常七点左右吃饭。']
  ],
  report: [
    ['v.', 'to give an official or detailed account of an event or situation', '报告；汇报', 'The team reported its findings to the board.', '团队向董事会汇报了调查结果。'],
    ['v.', 'to tell an authority about a problem, crime, or incident', '举报；报告', 'She reported the theft to the police.', '她向警方报了盗窃案。'],
    ['v.', 'to present news for a newspaper, broadcast, or website', '报道', 'Several journalists reported the election live.', '几名记者对选举进行了现场报道。']
  ],
  suggest: [
    ['v.', 'to put forward an idea or plan for someone to consider', '建议；提议', 'I suggest taking an earlier train.', '我建议乘早一班火车。'],
    ['v.', 'to mention a person or thing as suitable', '推荐', 'Could you suggest a quiet hotel?', '你能推荐一家安静的酒店吗？'],
    ['v.', 'to make something seem likely without proving it', '表明；暗示', 'The evidence suggests that the fire was accidental.', '证据表明这场火灾是意外。']
  ],
  sell: [
    ['v.', 'to give goods or property in exchange for money', '卖；出售', 'They sold their old car to a neighbor.', '他们把旧车卖给了邻居。'],
    ['v.', 'to be bought in a particular quantity or manner', '销售；卖得', 'The new model sells well overseas.', '新型号在海外卖得很好。'],
    ['v.', 'to persuade someone to accept an idea or proposal', '说服；推销', 'She sold the plan to a skeptical committee.', '她说服持怀疑态度的委员会接受了该计划。']
  ],
  support: [
    ['v.', 'to help someone emotionally, practically, or financially', '支持；帮助；供养', 'Her family supported her through treatment.', '她的家人在治疗期间一直支持她。'],
    ['v.', 'to approve of and encourage an idea, person, or cause', '赞成；拥护', 'Most residents support the proposal.', '大多数居民支持这项提案。'],
    ['v.', 'to provide evidence that shows a claim is true', '证实；为……提供依据', 'The figures support our conclusion.', '这些数据支持我们的结论。'],
    ['v.', 'to hold something up and bear its weight', '支撑；承重', 'Steel beams support the roof.', '钢梁支撑着屋顶。']
  ],
  receive: [
    ['v.', 'to get or be given something', '收到；得到', 'We received your application yesterday.', '我们昨天收到了你的申请。'],
    ['v.', 'to experience or be given treatment, attention, or a reaction', '接受；受到', 'The patient received immediate care.', '患者立即接受了治疗。'],
    ['v.', 'to welcome or formally meet a visitor', '接待；迎接', 'The ambassador received the delegation.', '大使接待了代表团。']
  ],
  base: [
    ['v.', 'to use facts or ideas as the foundation for a decision, argument, or work', '以……为依据；以……为基础', 'We based the estimate on recent sales data.', '我们根据近期销售数据作出了估算。'],
    ['v.', 'to locate a person, organization, or operation in a particular place', '把……设在；驻于', 'The company bases its Asian operations in Seoul.', '公司把亚洲业务设在首尔。']
  ],
  pick: [
    ['v.', 'to choose someone or something from a group', '选择；挑选', 'Pick the option that best fits your needs.', '请选择最符合你需要的选项。'],
    ['v.', 'to remove a flower, fruit, or leaf by hand', '采；摘', 'They picked apples in the orchard.', '他们在果园里摘苹果。'],
    ['v.', 'to take someone or something up or collect them', '拿起；接取', 'I will pick you up outside the station.', '我会在车站外接你。']
  ],
  drive: [
    ['v.', 'to control and operate a vehicle', '驾驶；开车', 'She drives to work twice a week.', '她每周开车上班两次。'],
    ['v.', 'to take someone somewhere in a vehicle', '开车送', 'Could you drive me to the airport?', '你能开车送我去机场吗？'],
    ['v.', 'to cause or strongly influence change, activity, or behavior', '推动；驱使', 'Customer demand is driving rapid growth.', '客户需求正推动快速增长。']
  ],
  explain: [
    ['v.', 'to make an idea, process, or situation clear by describing it', '解释；说明', 'Can you explain how this device works?', '你能解释一下这个设备如何工作吗？'],
    ['v.', 'to give a reason for an action or event', '说明……的原因；为……辩解', 'She explained why the meeting had been delayed.', '她解释了会议推迟的原因。']
  ],
  hit: [
    ['v.', 'to bring your hand or an object against someone or something with force', '打；击；撞', 'The ball hit the window.', '球击中了窗户。'],
    ['v.', 'to reach a particular level, place, or target', '达到；到达', 'Temperatures hit forty degrees.', '气温达到了四十度。'],
    ['v.', 'to affect someone or something suddenly and badly', '袭击；严重影响', 'The recession hit small firms hardest.', '经济衰退对小企业打击最大。']
  ],
  return: [
    ['v.', 'to go or come back to a place, activity, or condition', '返回；回来；恢复', 'She returned to work on Monday.', '她星期一重返工作岗位。'],
    ['v.', 'to give, send, or put something back', '归还；退回', 'Please return the key before noon.', '请在中午前归还钥匙。'],
    ['v.', 'to respond to an action in the same way', '回报；回应', 'I returned his call that evening.', '我当天晚上给他回了电话。']
  ],
  choose: [
    ['v.', 'to decide which person or thing you want from the available options', '选择；挑选', 'You may choose any seat that is free.', '你可以选择任何空座位。'],
    ['v.', 'to decide to do something', '决定；愿意', 'She chose not to comment.', '她选择不发表评论。']
  ],
  join: [
    ['v.', 'to become a member of a group or organization', '加入；成为……的一员', 'He joined the research team last year.', '他去年加入了研究团队。'],
    ['v.', 'to take part with another person in an activity', '参加；和……一起', 'Will you join us for lunch?', '你愿意和我们一起吃午饭吗？'],
    ['v.', 'to connect two things or meet at a point', '连接；接合', 'This path joins the main road near the bridge.', '这条小路在桥附近与主路相接。']
  ],
  share: [
    ['v.', 'to use, have, or experience something together with others', '共用；共有；共同经历', 'The two teams share the same office.', '两个团队共用同一间办公室。'],
    ['v.', 'to give part of something to another person', '分给；分享', 'She shared her lunch with me.', '她把午餐分给我吃。'],
    ['v.', 'to tell others about an idea, feeling, or information', '分享；讲述', 'Please share your findings with the group.', '请向小组分享你的调查结果。'],
    ['n.', 'one of the parts into which something is divided', '一份；份额', 'Everyone paid an equal share of the cost.', '每个人都支付了同等份额的费用。']
  ],
  accept: [
    ['v.', 'to willingly receive or agree to take something offered', '接受；收下', 'He accepted the invitation immediately.', '他立即接受了邀请。'],
    ['v.', 'to recognize that something is true or cannot be changed', '承认；接受现实', 'We must accept that mistakes happen.', '我们必须承认错误难免会发生。'],
    ['v.', 'to allow someone or something to join, enter, or be used', '接纳；受理；接受', 'The program accepts applicants from any country.', '该项目接受来自任何国家的申请者。']
  ],
  prepare: [
    ['v.', 'to make something ready for use or for an event', '准备；预备', 'She prepared a detailed report for the meeting.', '她为会议准备了一份详细报告。'],
    ['v.', 'to make yourself or someone else ready for what will happen', '使做好准备；筹备', 'The training prepares staff for emergencies.', '这项培训让员工为紧急情况做好准备。']
  ],
  avoid: [
    ['v.', 'to prevent something bad from happening', '避免；防止', 'Regular checks help avoid costly failures.', '定期检查有助于避免代价高昂的故障。'],
    ['v.', 'to deliberately stay away from a person, place, thing, or activity', '避开；躲避；回避', 'He avoided answering the question.', '他回避回答这个问题。']
  ],
  notice: [
    ['v.', 'to become aware of someone or something by seeing, hearing, or feeling it', '注意到；察觉', 'I noticed a crack in the wall.', '我注意到墙上有一道裂缝。'],
    ['v.', 'to give attention to someone or something', '留意；注意', 'Nobody noticed him leave the room.', '没人注意到他离开房间。']
  ],
  manage: [
    ['v.', 'to organize and control work, money, people, or resources', '管理；经营', 'She manages a team of twelve engineers.', '她管理着一个由十二名工程师组成的团队。'],
    ['v.', 'to deal successfully with a difficult situation or workload', '处理；应付', 'He manages pressure remarkably well.', '他很善于应对压力。'],
    ['v.', 'to succeed in doing something difficult', '设法做到', 'We managed to finish before dark.', '我们设法在天黑前完成了。']
  ],
  improve: [
    ['v.', 'to become better', '改善；变得更好', 'Her pronunciation has improved greatly.', '她的发音进步很大。'],
    ['v.', 'to make something better', '改进；提高', 'The new route will improve access to the hospital.', '新路线将改善前往医院的交通条件。']
  ],
  achieve: [
    ['v.', 'to succeed in reaching a goal or obtaining a desired result through effort', '实现；达到；取得', 'The team achieved its sales target.', '团队实现了销售目标。']
  ],
  depend: [
    ['v.', 'to be determined or changed by someone or something else', '取决于；视……而定', 'The final cost depends on the materials chosen.', '最终成本取决于所选材料。'],
    ['v.', 'to need someone or something for support or survival', '依靠；依赖', 'Many farms depend on seasonal rain.', '许多农场依赖季节性降雨。']
  ],
  prefer: [
    ['v.', 'to like or choose one person or thing more than another', '更喜欢；偏爱', 'I prefer tea to coffee.', '比起咖啡，我更喜欢茶。'],
    ['v.', 'to want a particular thing or situation', '宁愿；更希望', 'We would prefer you to arrive early.', '我们更希望你早点到。']
  ]
};

for (const [word, meanings] of Object.entries(reviewedMeaningPacks)) {
  manualCardPacks101150[word].meanings = meanings;
}

const synonymPacks = {
  end: 'finish|v.|结束|最通用，侧重把事情做完;stop|v.|停止|侧重使活动不再继续;conclude|v.|结束|较正式，常用于会议、演讲或协议;terminate|v.|终止|正式用语，常指合同、雇佣或进程;cease|v.|停止|正式，常指行为或状态停止',
  require: 'need|v.|需要|最普通，表示必要性;demand|v.|强烈要求|语气更强，主语常为人、规则或情势;necessitate|v.|使成为必要|正式，主语常是情况或变化;call for|v.|需要|常指形势需要某种行动或品质;entail|v.|必然涉及|强调某事不可避免地带来要求或后果',
  listen: 'hear|v.|听见|hear 强调自然感知，listen 强调主动注意;attend|v.|专心听|正式且多见于 attend to，强调给予注意;heed|v.|听从|强调接受警告或建议并据此行动;tune in|v.|收听|常指收听广播、节目或关注信息;eavesdrop|v.|偷听|指未经允许听别人私下谈话',
  agree: 'consent|v.|同意|正式，强调准许所提请求或安排;approve|v.|赞成|常带积极评价，也可指正式批准;concur|v.|同意|正式，常用 concur with 表示观点一致;accept|v.|接受|侧重接受提议、条件或事实;settle|v.|商定|侧重经过讨论解决分歧或确定条款',
  cut: 'slice|v.|切片|强调切成薄片;chop|v.|剁碎|强调快速有力地切成小块;trim|v.|修剪|只去掉边缘或多余部分;reduce|v.|减少|用于数量、成本或程度，不含切割动作;sever|v.|切断|正式且强调完全分离连接',
  decide: 'choose|v.|选择|侧重从选项中挑选;determine|v.|决定|较正式，也可指查明事实;resolve|v.|决定|强调坚定作出决定或解决问题;settle|v.|确定|常指解决争议后作出定论;rule|v.|裁定|法律语境中指法官或法院作裁决',
  pass: 'go by|v.|经过|强调从某人或某地旁边经过;succeed|v.|通过|只对应考试、检查等达到合格标准;hand|v.|递给|强调直接把物品交给别人;elapse|v.|流逝|正式，只以时间作主语;approve|v.|通过|对应议会或机构正式批准提案',
  eat: 'consume|v.|食用|较正式，也可指消耗资源;have|v.|吃；喝|口语中常与 meal、breakfast 等搭配;devour|v.|狼吞虎咽|强调吃得很快或很饿;dine|v.|用餐|较正式，强调吃正餐;feed on|v.|以……为食|常描述动物或长期食物来源',
  report: 'announce|v.|宣布|强调公开发布消息，不一定详述;describe|v.|描述|说明特征，不必是正式报告;inform|v.|告知|强调把信息直接告诉某人;notify|v.|正式通知|常用于正式程序和书面通知;cover|v.|报道|新闻语境中指持续采访并报道事件',
  suggest: 'propose|v.|提议|较正式，常提出计划供讨论;recommend|v.|推荐|强调认为某选择值得采用;advise|v.|建议|通常以人为宾语，强调给人意见;indicate|v.|表明|只对应证据或迹象显示某结论;imply|v.|暗示|表示没有直接说出某意思',
  sell: 'retail|v.|零售|指直接向消费者销售;market|v.|营销|强调宣传推广，不等同于完成出售;trade|v.|买卖|强调商业交换，可买也可卖;auction|v.|拍卖|通过竞价方式出售;persuade|v.|说服|只对应 sell an idea 的比喻义',
  support: 'help|v.|帮助|最宽泛，可指实际帮助或改善处境;assist|v.|协助|较正式，强调帮助完成任务;back|v.|支持|常指公开或实际支持人、计划;uphold|v.|维护|常指维护法律、原则或裁决;sustain|v.|支撑|强调使结构、生命或活动持续',
  receive: 'get|v.|收到|最常见口语表达，范围很广;obtain|v.|获得|强调通过努力或程序取得;accept|v.|接受|强调愿意接收，与被动收到不同;welcome|v.|迎接|对应友好接待来访者;collect|v.|领取|强调亲自取走已准备好的物品',
  base: 'ground|v.|以……为依据|常用 be grounded in 强调证据基础;found|v.|建立|指创建机构，不等同于 base on;locate|v.|把……设在|强调确定物理地点;establish|v.|设立|强调建立组织或业务据点;root|v.|使根植于|常用 be rooted in 表示深层来源',
  pick: 'choose|v.|选择|最通用的选择动词;select|v.|挑选|较正式，暗示按标准筛选;pluck|v.|采摘|强调用手从茎、枝或表面拔下;collect|v.|接取|只对应 pick up 某人或物;nominate|v.|选定|指正式提名人担任职位或获奖',
  drive: 'steer|v.|驾驶；操纵方向|强调控制行进方向;operate|v.|操作|适用于车辆或机器，范围比 drive 广;transport|v.|运送|强调把人或物送到别处;propel|v.|推动|强调提供向前的动力;motivate|v.|驱动|只对应促使人采取行动的比喻义',
  reach: 'arrive|v.|到达|不及物，后接 at 或 in，不能直接接地点;attain|v.|达到|正式，常接水平、目标或地位;achieve|v.|实现|强调努力取得目标或结果;contact|v.|联系到|只对应成功联系某人;extend|v.|延伸|对应范围或手臂达到某处',
  remain: 'stay|v.|保持；留下|较口语，可指位置或状态持续;continue|v.|继续|强调动作或过程不断;persist|v.|持续存在|常指问题或困难不消失;last|v.|持续|强调在一段时间内维持;linger|v.|逗留；残留|暗示停留得比预期久',
  explain: 'clarify|v.|澄清|强调消除含糊或误解;describe|v.|描述|说明外观或过程，不一定回答原因;interpret|v.|解释|强调说明含义或意义;account for|v.|解释原因|专门用于说明为何发生;illustrate|v.|阐明|通过例子、图表或对比使内容清楚',
  hit: 'strike|v.|击打|较正式，强调一次有力碰撞;bang|v.|猛撞|强调发出响声的碰撞;collide|v.|相撞|通常不及物，要用 collide with;reach|v.|达到|只对应数值、水平或目标义;affect|v.|影响|只对应灾难或变化带来冲击的义项',
  pull: 'draw|v.|拉|较正式，强调朝某方向移动;tug|v.|用力拉|常指短促、反复地拉;drag|v.|拖拽|强调物体沿地面且有阻力;yank|v.|猛拉|强调突然、用力的一下;haul|v.|拖运|常指长距离拉动重物',
  raise: 'lift|v.|举起|强调把实物抬高;increase|v.|提高|对应价格、水平或数量;collect|v.|筹集|只对应筹钱或募集物资;rear|v.|抚养|常用于孩子或饲养动物;mention|v.|提出|只对应提出问题或担忧',
  wear: 'have on|v.|穿着；戴着|口语，强调当前穿戴状态;don|v.|穿上|正式，强调穿上的动作;sport|v.|醒目地穿戴|常暗示自豪地展示某物;bear|v.|带有|只对应面容带有表情或标记;display|v.|显露|对应显露表情、特征，不用于普通衣物',
  return: 'come back|v.|回来|以说话者所在处为参照;go back|v.|回去|以离开说话者方向为参照;give back|v.|归还|明确表示把物品还给原主;reply|v.|回应|只对应回电话、回信或回答;recur|v.|再次发生|只对应问题、症状或模式重现',
  choose: 'select|v.|挑选|较正式，暗示按标准选择;pick|v.|挑选|口语化，常用于快速或个人选择;opt for|v.|选择|强调在多个方案中作决定;elect|v.|选举；选择|正式，可指投票选出或主动选择;decide on|v.|选定|强调考虑后确定某一方案',
  cause: 'bring about|v.|导致|常指促成变化或结果;lead to|v.|导致|突出因果链条，主语常是事件;produce|v.|产生|常指产生效果、结果或反应;trigger|v.|触发|强调使事件突然开始;provoke|v.|引起|常指激起反应、争议或情绪',
  join: 'enter|v.|加入|强调进入比赛、行业或组织;enroll|v.|报名加入|常指课程、学校或计划;participate|v.|参加|不及物，通常用 participate in;connect|v.|连接|对应把物体或系统接在一起;unite|v.|联合|强调使人或群体形成整体',
  develop: 'grow|v.|发展；成长|可不及物，也可指逐渐增强;create|v.|开发|强调创造新产品或系统;form|v.|形成|强调某种特征、习惯或结构出现;expand|v.|扩展|强调规模、范围或业务变大;cultivate|v.|培养|强调长期培养技能、兴趣或关系',
  share: 'divide|v.|分配|强调把整体分成若干部分;distribute|v.|分发|强调把物品发给多人;communicate|v.|传达|对应分享信息或想法;disclose|v.|披露|正式，常指公开此前未透露的信息;participate in|v.|共同经历|只对应 share an experience 的参与义',
  realize: 'recognize|v.|意识到|强调辨认或承认某事实;understand|v.|明白|强调理解含义或原因;appreciate|v.|认识到|常指充分理解重要性或价值;achieve|v.|实现|只对应梦想、目标或潜力变为现实;fulfill|v.|实现|常接 promise、ambition 或 obligation',
  describe: 'depict|v.|描绘|常用于文字或图像呈现;portray|v.|刻画|常描述人物形象或表现;characterize|v.|描述特征|强调指出典型特征;outline|v.|概述|只给主要轮廓而非全部细节;explain|v.|说明|重在使原因或过程易懂，不等同于外观描述',
  increase: 'rise|v.|上升|不及物，主语自身增长;grow|v.|增长|常指规模、数量或强度逐渐增加;raise|v.|提高|及物，主语使宾语增加;expand|v.|扩大|强调尺寸、范围或容量变大;boost|v.|提升|强调有意快速提高表现或数量',
  protect: 'defend|v.|保卫|强调抵抗攻击或批评;guard|v.|守护|强调看守以防危险或盗窃;safeguard|v.|保护|正式，常指权利、利益或系统;shield|v.|遮护|强调挡住伤害、压力或视线;preserve|v.|保存|强调防止长期损坏、改变或消失',
  compare: 'contrast|v.|对比|强调差异而非共同点;match|v.|比对|常指核对是否相同或相配;liken|v.|比作|只用于把一事物比作另一事物;evaluate|v.|评估|依据标准判断，不只是并列比较;benchmark|v.|对标|按基准衡量表现',
  reduce: 'decrease|v.|减少|可及物或不及物，语气中性;lower|v.|降低|常接价格、音量、温度或水平;cut|v.|削减|强调有意且常较明显地减少;lessen|v.|减轻|常指疼痛、影响或严重程度;diminish|v.|减弱|较正式，可指重要性、力量或数量变小',
  accept: 'receive|v.|接收|只表示收到，不一定愿意接受;take|v.|接受|口语化，常接工作、提议或付款;approve|v.|批准|表示正式同意，不等同于亲自收下;acknowledge|v.|承认|强调承认事实、责任或存在;embrace|v.|欣然接受|语气积极，常指变化、理念或机会',
  prepare: 'ready|v.|使准备好|较简洁，常接人、设备或场所;arrange|v.|安排|强调组织细节，不覆盖所有准备工作;plan|v.|计划|强调预先决定步骤;equip|v.|使有准备|常指提供所需技能或工具;rehearse|v.|排练|只对应为演出、陈述或情境练习',
  avoid: 'prevent|v.|防止|prevent 后接结果，avoid 后接要避开的事物;evade|v.|逃避|常指故意逃避责任、问题或追捕;dodge|v.|躲避|口语，可指身体闪避或回避问题;shun|v.|避开|强调有意持续远离某人或事物;steer clear of|v.|避开|口语短语，强调保持距离以免惹麻烦',
  notice: 'observe|v.|观察到|较正式，常含有意仔细观察;spot|v.|发现|强调迅速从背景中看到;detect|v.|察觉|常借助检查或仪器发现不明显事物;perceive|v.|感知|正式，强调通过感官或理解意识到;remark|v.|注意到|较正式，常见于书面叙述',
  affect: 'influence|v.|影响|强调逐渐改变决定、行为或结果;impact|v.|影响|常指明显或重大的影响;alter|v.|改变|强调使性质、状态或细节发生变化;touch|v.|打动|只对应情感上深深影响;move|v.|感动|只指引起强烈情绪',
  manage: 'administer|v.|管理|正式，常指机构、制度或资源;run|v.|经营|口语，常指负责企业、项目或系统;supervise|v.|监督|强调指导并检查他人工作;handle|v.|处理|侧重应对任务、问题或物品;cope|v.|应付|不及物，常用 cope with，强调困难处境',
  improve: 'enhance|v.|提升|强调提高质量、价值或效果;refine|v.|改进|强调通过小幅调整使更精确;upgrade|v.|升级|常指设备、系统或服务提升到新版;better|v.|改善|较正式，表示使状况变好;advance|v.|推进|强调知识、事业或进程向前发展',
  discover: 'find|v.|发现|最通用，可有意寻找或偶然发现;uncover|v.|揭示|强调发现原先隐藏的信息;detect|v.|查出|常借助检查或仪器发现;learn|v.|得知|只对应通过消息获知事实;identify|v.|确认|强调确定所发现对象的身份或原因',
  handle: 'manage|v.|处理|侧重成功组织或应对整体事务;deal with|v.|处理|最通用的应对问题表达;operate|v.|操作|只对应控制机器、设备或系统;touch|v.|拿；碰|只表示手接触，不含妥善处理;process|v.|处理|常指按程序处理数据、文件或申请',
  achieve: 'accomplish|v.|完成|常指成功完成具体任务;attain|v.|达到|较正式，常接水平、地位或目标;reach|v.|达到|侧重到达某一点、标准或协议;realize|v.|实现|只对应使梦想、计划或潜力成真;fulfill|v.|实现|常接目标、职责、承诺或愿望',
  express: 'convey|v.|传达|强调使他人理解信息或感受;state|v.|陈述|强调清楚直接地说出事实或立场;voice|v.|表达|常接 concern、opinion 或 objection;articulate|v.|清晰表达|强调有条理地用语言说明;show|v.|表示|范围广，可通过行为、表情或证据呈现',
  encourage: 'inspire|v.|激励|强调唤起热情、信心或创造力;motivate|v.|促使|强调给予行动的理由或动力;urge|v.|敦促|语气较强，常用 urge someone to do;support|v.|支持|帮助持续行动，但不一定劝其开始;promote|v.|促进|只对应促进行为、增长或发展',
  depend: 'rely on|v.|依赖|强调需要支持、资源或可靠性;count on|v.|指望|口语，强调相信某人会提供帮助;hinge on|v.|取决于|强调结果由一个关键因素决定;be determined by|v.|由……决定|正式说明因果条件;trust|v.|信赖|强调相信人或事物可靠，并不总表示依赖生存',
  prefer: 'favor|v.|更喜欢|较正式，也可表示偏袒;like better|v.|更喜欢|口语比较表达，需说明比较对象;choose|v.|选择|表示实际作决定，不一定因更喜欢;opt for|v.|选择|强调在可选方案中主动选择;would rather|v.|宁愿|后接动词原形，用来比较行为偏好',
  solve: 'resolve|v.|解决|常用于问题、冲突或争议;work out|v.|解出|口语，常指算出或想出办法;answer|v.|解答|常接 question，不一定解决整个问题;crack|v.|破解|口语，常指难题、密码或案件;settle|v.|解决|侧重结束争端或确定事项'
};

for (const [word, source] of Object.entries(synonymPacks)) {
  manualCardPacks101150[word].synonyms = source.split(';').map((row) => row.split('|'));
}

const commonErrorPacks = {
  end: 'The meeting was end at five.|The meeting ended at five.|end 的过去式和过去分词是 ended，不能把原形放在 was 后。;We ended to discuss the budget.|We ended the discussion about the budget.|end 不直接接 to do 表示停止一项活动，可直接接名词或改用 stop doing。',
  require: 'This job requires to travel often.|This job requires employees to travel often.|require 表示要求某人做事时必须有宾语，再接 to do。;The repair is required special tools.|The repair requires special tools.|表示某事需要某物时用主动结构 require something。',
  listen: 'I listen music every morning.|I listen to music every morning.|listen 接收听对象时通常要加介词 to。;Please listen what she says.|Please listen to what she says.|what 从句也是 listen to 的宾语，不能省略 to。',
  agree: 'We agreed with the new contract.|We agreed to the new contract.|接受提议、安排或条款用 agree to，agree with 主要表示赞同观点或某人。;They agreed the date yesterday.|They agreed on the date yesterday.|表示各方就某事项达成一致，通常用 agree on 或 agree upon。',
  cut: 'She cutted the rope.|She cut the rope.|cut 是不规则动词，过去式和过去分词仍是 cut。;Cut the apple in four pieces.|Cut the apple into four pieces.|表示切后形成若干部分用 cut into，不用 cut in。',
  decide: 'We decided going by train.|We decided to go by train.|decide 后表示决定做某事用 to do。;Have you decided a date yet?|Have you decided on a date yet?|表示从选项中确定日期或方案通常用 decide on。',
  pass: 'She passed me on the salt.|She passed the salt to me.|pass 某物给某人可用 pass someone something 或 pass something to someone。;Two hours were passed quickly.|Two hours passed quickly.|表示时间流逝通常用主动结构，时间作主语。',
  eat: 'I ate some medicine after lunch.|I took some medicine after lunch.|英语用 take medicine，不用 eat medicine。;He eats very fastly.|He eats very fast.|fast 本身可作副词，不能加 -ly。',
  report: 'She reported about the theft to the police.|She reported the theft to the police.|表示向当局报告具体事件时 report 直接接宾语。;Please report me any fault.|Please report any fault to me.|report 不用双宾语结构，接收者要由 to 引出。',
  suggest: 'She suggested me to wait.|She suggested that I wait.|suggest 不用 suggest someone to do，可用 suggest doing 或 suggest that 从句。;He suggested to take a taxi.|He suggested taking a taxi.|suggest 后表示建议做某事要接动名词，不接 to do。',
  sell: 'He sold the laptop from me.|He sold the laptop to me.|sell 表示卖给某人用 to，from 表示来源。;This shop sells books for students cheap.|This shop sells books to students cheaply.|接购买者用 to，修饰 sells 应用副词 cheaply。',
  support: 'I strongly support to the proposal.|I strongly support the proposal.|support 是及物动词，直接接所支持的人或事。;Her family supported her to study abroad.|Her family supported her in studying abroad.|表示支持某人从事活动通常用 support someone in doing something。',
  receive: 'I received a letter by my bank.|I received a letter from my bank.|表示发送者来源用 receive something from someone。;We received to your application yesterday.|We received your application yesterday.|receive 是及物动词，宾语前不加 to。',
  base: 'The decision bases on evidence.|The decision is based on evidence.|事物以某依据为基础通常用被动结构 be based on。;We based on last year’s figures.|We based our estimate on last year’s figures.|主动 base 必须有被建立在依据上的宾语。',
  pick: 'I will pick you at the station.|I will pick you up at the station.|表示开车接某人要用 pick someone up。;She picked up a blue dress from the choices.|She picked out a blue dress from the choices.|从若干选择中挑出某物用 pick out，pick up 主要表示拿起或接取。',
  drive: 'He drives a bicycle to work.|He rides a bicycle to work.|驾驶汽车用 drive，骑自行车用 ride。;She drove me at the airport.|She drove me to the airport.|表示开车送到目的地用 drive someone to a place。',
  reach: 'We reached to the station at noon.|We reached the station at noon.|reach 表示到达时是及物动词，地点前不加 to。;They reached at an agreement.|They reached an agreement.|固定搭配是 reach an agreement，不能加 at。',
  remain: 'The door remained opening all night.|The door remained open all night.|remain 作系动词时后接形容词 open 表示状态。;Only two questions are remained.|Only two questions remain.|表示剩余通常用主动结构 remain，不用 are remained。',
  explain: 'Can you explain me this rule?|Can you explain this rule to me?|explain 不接双宾语，听者用 to 引出。;He explained about the delay.|He explained the delay.|explain 可直接接要说明的事情，不必加 about。',
  hit: 'The ball hitted the wall.|The ball hit the wall.|hit 的过去式和过去分词仍是 hit。;The car hit to a tree.|The car hit a tree.|hit 是及物动词，碰撞对象前不加 to。',
  pull: 'Pull out it carefully.|Pull it out carefully.|代词作 pull out 的宾语时必须放在动词与副词之间。;She pulled the door to open.|She pulled the door open.|表示拉开某物用 pull something open，不用 to open。',
  raise: 'Prices raised sharply last month.|Prices rose sharply last month.|价格自行上升用不及物 rise，raise 必须接宾语。;They rose the rent again.|They raised the rent again.|使租金提高用及物动词 raise，不用 rise。',
  wear: 'She is wearing on a red coat.|She is wearing a red coat.|wear 表示穿着时直接接衣物，不加 on。;He weared glasses as a child.|He wore glasses as a child.|wear 的过去式是 wore，不是 weared。',
  return: 'She returned to home late.|She returned home late.|home 作方向副词时前面不用 to。;Please return back the key.|Please return the key.|return 已含“归还”或“返回”，通常无需再加 back。',
  choose: 'She chose going alone.|She chose to go alone.|choose 表示决定做某事时接 to do。;Choose among the red one and the blue one.|Choose between the red one and the blue one.|两者之间选择用 between，三者以上才常用 among。',
  cause: 'The delay caused us miss the train.|The delay caused us to miss the train.|cause someone 后必须接 to do。;What caused of the failure?|What caused the failure?|cause 作动词直接接结果，of 只用于名词结构 the cause of。',
  join: 'She joined in the chess club.|She joined the chess club.|加入组织或团体时 join 直接接宾语，不加 in。;Would you like to join with us for dinner?|Would you like to join us for dinner?|表示和某人一起参加活动通常直接用 join someone。',
  develop: 'She developed to a skilled surgeon.|She developed into a skilled surgeon.|表示逐渐成长或演变为某身份用 develop into。;The symptoms developed themselves overnight.|The symptoms developed overnight.|develop 表示症状出现时是不及物用法，不加反身代词。',
  share: 'Please share the file to me.|Please share the file with me.|与某人分享某物用 share something with someone。;She shared me her concerns.|She shared her concerns with me.|share 通常不接双宾语，接收者用 with 引出。',
  realize: 'I realized about my mistake later.|I realized my mistake later.|realize 表示意识到时直接接名词或从句，不加 about。;She realized to be wrong.|She realized that she was wrong.|realize 后表达认识到某事实通常接 that 从句，不接 to be。',
  describe: 'Please describe me the accident.|Please describe the accident to me.|describe 不接双宾语，听者用 to 引出。;He described about his symptoms.|He described his symptoms.|describe 是及物动词，直接接描述对象。',
  increase: 'Sales increased ten percent.|Sales increased by ten percent.|表示增幅用 increase by 加数值。;The price increased from twenty dollars by thirty dollars.|The price increased from twenty dollars to thirty dollars.|表示起点和终点用 from...to...，不是 from...by...。',
  protect: 'This cream protects your skin of the sun.|This cream protects your skin from the sun.|表示防止某种伤害用 protect someone or something from。;Wear gloves to protect to your hands.|Wear gloves to protect your hands.|protect 是及物动词，保护对象前不加 to。',
  compare: 'This model is cheaper compared than that one.|This model is cheaper than that one.|比较级直接用 than，compare 不与 than 组成结构。;We compared this year’s results to last year.|We compared this year’s results with last year’s results.|比较两个结果时需让比较对象平行且完整。',
  reduce: 'We reduced costs ten percent.|We reduced costs by ten percent.|表示减少的幅度要用 by。;The temperature reduced from twenty to ten degrees.|The temperature fell from twenty to ten degrees.|reduce 作及物动词通常需要宾语，温度自行下降用 fall 或 decrease。',
  accept: 'He accepted to join the committee.|He agreed to join the committee.|accept 通常不接 to do，表示同意做事用 agree to do。;The store accepts to pay by card.|The store accepts payment by card.|accept 后接名词 payment，不接 to pay 表示付款方式。',
  prepare: 'We are preparing the exam.|We are preparing for the exam.|学生为考试做准备用 prepare for，prepare the exam 表示出题或筹备考试。;She prepared me a difficult interview.|She prepared me for a difficult interview.|使某人为某事做好准备用 prepare someone for something。',
  avoid: 'Try to avoid to drive at night.|Try to avoid driving at night.|avoid 后接动词时用动名词，不用 to do。;The barrier avoids people from entering.|The barrier prevents people from entering.|avoid 不用 avoid someone from doing，阻止某人做事用 prevent。',
  notice: 'I noticed him to leave early.|I noticed him leave early.|notice 后接宾语和完整动作时用动词原形，不能用 to do。;Did you notice about the spelling error?|Did you notice the spelling error?|notice 是及物动词，直接接所注意到的事物。',
  affect: 'The weather affected on our plans.|The weather affected our plans.|affect 作动词直接接宾语，不加 on。;The new rule had a strong affect on sales.|The new rule had a strong effect on sales.|名词“影响”通常是 effect，affect 主要作动词。',
  manage: 'We managed finishing on time.|We managed to finish on time.|manage 表示设法成功做成某事时接 to do。;She manages with a large department.|She manages a large department.|manage 表示管理某部门时直接接宾语，不加 with。',
  improve: 'The update improved better performance.|The update improved performance.|improve 已含“变得更好”，不能再用 better 作重复补语。;My English has improved it a lot.|My English has improved a lot.|不及物 improve 表示自身进步时不加宾语 it。',
  discover: 'Scientists discovered about a new species.|Scientists discovered a new species.|discover 是及物动词，直接接发现的事物。;I discovered him to be lying.|I discovered that he was lying.|表达发现某一事实通常用 discover that 从句。',
  handle: 'She handled with the complaint quickly.|She handled the complaint quickly.|handle 表示处理问题时直接接宾语，不加 with。;This glass is easy to handle it.|This glass is easy to handle.|easy to handle 中宾语已经由主语承担，不能再加 it。',
  achieve: 'She achieved to finish the course.|She managed to finish the course.|achieve 后接目标名词，不接 to do 表示成功做成。;The project achieved a great progress.|The project made great progress.|progress 是不可数名词，固定搭配是 make progress。',
  express: 'He expressed about his concern.|He expressed his concern.|express 是及物动词，直接接所表达的内容。;She expressed me her gratitude.|She expressed her gratitude to me.|express 不接双宾语，接收者用 to 引出。',
  encourage: 'The teacher encouraged to me speak.|The teacher encouraged me to speak.|encourage someone to do 中宾语位于 encourage 后。;The policy encourages people using public transport.|The policy encourages people to use public transport.|鼓励某人做某事用 encourage someone to do。',
  depend: 'The result depends of the weather.|The result depends on the weather.|depend 表示取决于或依靠时通常与 on 搭配。;It depends from how much time we have.|It depends on how much time we have.|引出决定因素仍用 depend on，不能用 from。',
  prefer: 'I prefer tea than coffee.|I prefer tea to coffee.|prefer A to B 用 to 引出比较对象，不用 than。;I prefer to walking home.|I prefer walking home.|prefer 后可接 doing 或 to do，但不能用 to 加动名词。',
  solve: 'We need to solve about this problem.|We need to solve this problem.|solve 是及物动词，直接接 problem，不加 about。;They found a solution for the traffic problem.|They found a solution to the traffic problem.|名词 solution 后表示所解决的问题通常用介词 to。'
};

for (const [word, source] of Object.entries(commonErrorPacks)) {
  manualCardPacks101150[word].commonErrors = source.split(';').map((row) => row.split('|'));
}

// Antonyms and confusables are adaptive fields. An empty array is an explicit
// reviewed decision: no single safe item is preferable to a padded relation.
for (const card of Object.values(manualCardPacks101150)) {
  card.antonyms ??= [];
  card.confusables ??= [];
}

const antonymPacks = {
  end: 'begin|v.|开始|只在事件或活动的起止义上与 end 相对;continue|v.|继续|强调活动不结束而持续',
  listen: 'disobey|v.|不听从；违抗|只与 listen to advice/instructions 表示听取并照做的义项相对；disobey 表示明知要求却不遵从',
  agree: 'disagree|v.|不同意|对应观点不一致，常用 disagree with;oppose|v.|反对|语气更强，表示主动抵制计划或观点',
  decide: 'hesitate|v.|犹豫|表示迟迟不能作出决定，并非所有语境的严格反义词',
  pass: 'fail|v.|未通过|仅与通过考试、检查的义项相对',
  eat: 'fast|v.|禁食|指在一段时间内有意不吃食物',
  sell: 'buy|v.|购买|在交易方向上相对，卖方 sell、买方 buy',
  support: 'oppose|v.|反对|对应支持观点、计划或候选人的义项;undermine|v.|削弱|对应支撑、维持或帮助某事的义项',
  receive: 'send|v.|发送|在信息或物品传递方向上相对',
  reach: 'miss|v.|未赶上；未达到|对应未能到达目标、班次或标准',
  remain: 'leave|v.|离开|只与留在某地的义项相对;change|v.|改变|只与保持某状态不变的义项相对',
  explain: 'obscure|v.|使含糊|与使意义清楚的 explain 相对',
  hit: 'miss|v.|未击中|只与击中目标的义项直接相对',
  pull: 'push|v.|推|在施力方向上与 pull 相反',
  raise: 'lower|v.|降低；放下|与抬高物体或提高水平的义项相对',
  wear: 'remove|v.|脱下；摘下|只与穿戴衣物或配饰的义项相对',
  return: 'keep|v.|留着不还|与归还物品的义项相对;depart|v.|离开|与回到某地的义项方向相对',
  cause: 'prevent|v.|防止|在“使某结果发生”与“阻止其发生”之间相对',
  join: 'leave|v.|退出|与加入团体的义项相对;separate|v.|分开|与连接两个部分的义项相对',
  develop: 'stagnate|v.|停滞|与持续发展或进步相对;decline|v.|衰退|与成长、改善的义项相对',
  share: 'withhold|v.|不予提供|与向他人分享信息或资源的义项相对;keep|v.|独自保留|强调不与他人共用或分给他人',
  increase: 'decrease|v.|减少；下降|可及物或不及物，是 increase 的直接数量反向;remain constant|v. phr.|保持不变|只与 increase 表示数量或水平上升的义项相对；remain constant 表示同一数值既不上升也不下降',
  protect: 'endanger|v.|危及|使人或事物处于危险，与保护相对;expose|v.|使暴露|与 shield 或 protect from danger 的义项相对',
  reduce: 'increase|v.|增加；提高|在数量、水平或程度上直接相对;expand|v.|扩大|只与缩小尺寸、范围的义项相对',
  accept: 'reject|v.|拒绝|与接受提议、申请或物品直接相对;contest|v.|质疑；对……提出异议|只与 accept a ruling/decision 表示认可裁定的义项相对；contest 表示正式质疑同一裁定',
  avoid: 'confront|v.|面对|与回避问题或困难的义项相对;seek|v.|寻求|只在主动寻找与避开某物的语境中相对',
  notice: 'overlook|v.|忽略；未注意到|对应没有发现本可注意到的细节',
  improve: 'worsen|v.|使恶化；变得更差|可及物或不及物，是 improve 的直接质量反向;stagnate|v.|停滞；没有进步|只与能力、表现或状况逐步 improve 的义项相对；stagnate 表示长期停在原水平',
  discover: 'overlook|v.|未发现|指因疏忽没有注意到本可发现的事物',
  handle: 'mishandle|v.|处理不当|表示错误或不熟练地处理问题、物品或信息',
  achieve: 'fail|v.|未能做到|通常要用 fail to achieve 或 fail to do 表达未实现目标',
  express: 'suppress|v.|压抑；抑制|与公开表达感受或观点相对;obscure|v.|使含糊；遮蔽|只与 express an idea/relationship clearly 的清楚表述义相对；obscure 表示使同一内容难以理解',
  encourage: 'discourage|v.|劝阻；使泄气|与鼓励某人做事或增强信心直接相对',
  depend: 'be independent of|v.|不依赖|与 depend on 在依赖关系上相对',
  solve: 'miscalculate|v.|算错；误算|只与 solve an equation 表示正确求得未知量的数学义相对；miscalculate 表示运算错误并得到错误结果'
};

const confusablePacks = {
  require: 'request|v.|请求|request 是提出请求，require 是认为必要或正式规定',
  listen: 'hear|v.|听见|hear 是自然感知声音，listen 是主动集中注意力',
  agree: 'accept|v.|接受|accept 接受事物或事实，agree 表示观点一致或同意安排',
  cut: 'cute|adj.|可爱的|仅拼写相近，cute 多一个 e 且读音为 /kjuːt/',
  decide: 'decision|n.|决定|decision 是名词，动词结构应使用 decide',
  pass: 'past|prep./adj./n.|经过；过去的；过去|pass 是动词，past 通常不是动词，注意词性和拼写',
  eat: 'feed|v.|喂养|eat 的主语进食，feed 的主语把食物给人或动物',
  report: 'inform|v.|告知|inform 后常接人，report 可接事件并向某人或机构报告',
  suggest: 'advise|v.|建议|advise 可用 advise someone to do，suggest 不能这样接',
  sell: 'sale|n.|出售；促销|sell 是动词，sale 是名词，注意元音和词性',
  support: 'supply|v.|供应|support 是帮助或支撑，supply 是提供所需物品',
  receive: 'receipt|n.|收据；收到|receive 是动词，receipt 是名词且拼写不同',
  base: 'basis|n.|基础；依据|base 可作动词，basis 只作名词且复数为 bases',
  pick: 'pick up|v.|拿起；接取|pick 可表示选择或采摘，pick up 增添拿起、接人等短语义',
  drive: 'ride|v.|骑；乘坐|drive 强调操控汽车，ride 用于骑车或作为乘客乘坐',
  reach: 'arrive|v.|到达|reach 直接接地点，arrive 后要用 at 或 in',
  remain: 'remind|v.|提醒|remain 表示保持或留下，remind 表示使某人想起',
  explain: 'describe|v.|描述|explain 使原因或意义清楚，describe 说明外观、特征或过程',
  hit: 'beat|v.|反复击打；打败|hit 可指一次击中，beat 常指反复击打或战胜对手',
  pull: 'drag|v.|拖拽|pull 是一般拉动，drag 强调沿表面且有阻力地拖',
  raise: 'rise|v.|上升|raise 是及物动词，rise 是不及物动词',
  wear: 'where|adv.|在哪里|两词发音相同，wear 表示穿戴，where 表示地点',
  return: 'revert|v.|恢复；回复原状|return 可返回或归还，revert 通常指恢复到先前状态',
  choose: 'chose|v.|选择了|choose 是原形，chose 是一般过去式',
  cause: 'because|conj.|因为|cause 是名词或动词，because 是连接原因从句的连词',
  join: 'joint|n./adj.|接合处；共同的|join 是动词，joint 是名词或形容词',
  develop: 'development|n.|发展；开发|development 是名词，句中需要动作时用 develop',
  share: 'portion|n.|一份|share 可作动词表示分享，portion 主要是名词并强调分出的份额',
  realize: 'recognize|v.|认出；意识到|recognize 常指认出已有对象，realize 常指突然意识到事实或实现目标',
  describe: 'prescribe|v.|开具；规定|describe 是描述，prescribe 是医生开药或正式规定',
  increase: 'raise|v.|提高|increase 可及物或不及物，raise 必须有被提高的宾语',
  protect: 'prevent|v.|防止|protect 的宾语是被保护者，prevent 的宾语是要阻止的事件或人',
  compare: 'contrast|v.|对比|compare 可看相同点和不同点，contrast 重点突出差异',
  reduce: 'decrease|v.|减少|reduce 通常及物，decrease 可及物也可不及物',
  accept: 'except|prep./conj.|除……之外|accept 是动词“接受”，except 表示排除，发音和拼写不同',
  prepare: 'repair|v.|修理|prepare 是准备，repair 是修复损坏物',
  avoid: 'prevent|v.|防止|avoid 后接要避开的事物，prevent 常用 prevent someone from doing',
  notice: 'notify|v.|通知|notice 是自己注意到，notify 是主动把消息告诉别人',
  affect: 'effect|n.|影响；效果|affect 主要作动词，effect 主要作名词',
  manage: 'management|n.|管理|manage 是动词，management 是名词',
  improve: 'improvise|v.|即兴创作|improve 是改善，improvise 是没有准备而即兴完成',
  discover: 'invent|v.|发明|discover 是发现已存在的事物，invent 是创造此前没有的东西',
  handle: 'deal with|v.|处理|handle 可直接接宾语，deal 必须与 with 连用',
  achieve: 'accomplish|v.|完成|achieve 常接目标或结果，accomplish 常接任务或工作',
  express: 'impress|v.|给……留下深刻印象|express 是表达，impress 是使人产生深刻印象',
  encourage: 'ensure|v.|确保|encourage 是鼓励或促进，ensure 是保证某结果发生',
  depend: 'dependent|adj.|依赖的|depend 是动词，dependent 是形容词，常用 be dependent on',
  prefer: 'refer|v.|提到；查阅|prefer 表示偏爱，refer 表示提到、查阅或转介',
  solve: 'resolve|v.|解决|两者可重合，但 solve 常接题目或技术问题，resolve 常接争端或长期问题'
};

for (const [word, source] of Object.entries(antonymPacks)) {
  manualCardPacks101150[word].antonyms = source.split(';').map((row) => row.split('|'));
}
for (const [word, source] of Object.entries(confusablePacks)) {
  manualCardPacks101150[word].confusables = source.split(';').map((row) => row.split('|'));
}

// Final semantic corrections found during the cross-card read-through. These
// are intentionally explicit so that a later generator fallback cannot restore
// a weak relation, a fake learner error, or an omitted common word-family form.
manualCardPacks101150.listen.synonyms = [
  ['pay attention to', 'phr.v.', '专心听；注意', '强调有意识地把注意力放在说话或声音上。'],
  ['lend an ear to', 'phr.v.', '倾听', '较形象，常指耐心听取某人的问题或想法。'],
  ['heed', 'v.', '听从', '强调接受警告或建议并据此行动。'],
  ['tune in to', 'phr.v.', '收听；关注', '常指收听广播、节目或有意识地关注信息。'],
  ['eavesdrop on', 'phr.v.', '偷听', '指未经允许偷听他人的私下谈话。']
];
manualCardPacks101150.agree.synonyms = [
  ['consent', 'v.', '同意；准许', '正式，强调同意请求或安排，常用 consent to。'],
  ['approve', 'v.', '赞成；批准', '可表示积极评价，也可指机构正式批准。'],
  ['concur', 'v.', '同意', '正式，常用 concur with 表示观点一致。'],
  ['be of the same mind', 'phr.', '意见一致', '强调两人或多人持相同看法，不用于接受物品。'],
  ['settle', 'v.', '商定；解决', '侧重经过讨论解决分歧或确定条款。']
];
manualCardPacks101150.report.synonyms = [
  ['announce', 'v.', '宣布', '强调公开发布消息，不一定提供详细经过。'],
  ['describe', 'v.', '描述', '说明特征或经过，但不一定是正式报告。'],
  ['document', 'v.', '记录；用文件证明', '强调以文字、照片或数据留下可核查记录。'],
  ['notify', 'v.', '正式通知', '常用于正式程序，通常明确通知对象。'],
  ['cover', 'v.', '采访报道', '新闻语境中指持续采访并报道事件。']
];
manualCardPacks101150.report.confusables = [];
manualCardPacks101150.suggest.synonyms = [
  ['propose', 'v.', '提议', '较正式，常提出计划供讨论。'],
  ['recommend', 'v.', '推荐', '强调认为某个选择值得采用。'],
  ['put forward', 'phr.v.', '提出', '常指提出想法、方案或论点供考虑。'],
  ['indicate', 'v.', '表明', '只对应证据或迹象显示某结论。'],
  ['imply', 'v.', '暗示', '表示没有直接说出某意思。']
];
manualCardPacks101150.pass.synonyms = [
  ['go past', 'phr.v.', '经过；超过', '只对应从某人或某地旁边经过。'],
  ['clear', 'v.', '通过', '可指通过检查、障碍或关卡，不表示递交物品。'],
  ['hand', 'v.', '递给', '强调直接把物品交到别人手中。'],
  ['elapse', 'v.', '流逝', '正式用语，只以时间段作主语。'],
  ['approve', 'v.', '批准；通过', '对应议会或机构正式通过提案或法案。']
];
manualCardPacks101150.base.synonyms = [
  ['ground', 'v.', '以……为依据', '常用 be grounded in，强调有证据或原则作基础。'],
  ['locate', 'v.', '把……设在', '强调确定机构或设施的物理地点。'],
  ['station', 'v.', '驻扎；安置', '常指把人员或设备安排在某地。'],
  ['situate', 'v.', '使位于', '正式，常用 be situated in 描述位置。'],
  ['root', 'v.', '使根植于', '常用 be rooted in 表示深层来源或依据。']
];
manualCardPacks101150.reach.synonyms = [
  ['get to', 'phr.v.', '到达', '口语表达，可直接接地点；不表示伸手。'],
  ['attain', 'v.', '达到', '较正式，常接水平、地位或标准。'],
  ['achieve', 'v.', '实现', '强调通过努力取得目标或结果。'],
  ['contact', 'v.', '联系到', '只对应成功与某人取得联系。'],
  ['extend', 'v.', '延伸', '只对应范围、道路或肢体达到某处。']
];
manualCardPacks101150.explain.synonyms = [
  ['clarify', 'v.', '澄清', '强调消除含糊或误解。'],
  ['spell out', 'phr.v.', '详细说明', '较口语，强调把细节说得非常清楚。'],
  ['interpret', 'v.', '解释', '强调说明语言、符号或事件的意义。'],
  ['account for', 'phr.v.', '解释原因', '专门用于说明某事为何发生或某数量为何存在。'],
  ['illustrate', 'v.', '阐明', '通过例子、图表或对比使内容清楚。']
];
manualCardPacks101150.pull.synonyms = [
  ['draw', 'v.', '拉', '较正式，强调朝某方向移动。'],
  ['tug', 'v.', '用力拉', '常指短促、反复地拉。'],
  ['tow', 'v.', '拖；牵引', '常指用车辆或绳索拖动汽车、船只等。'],
  ['yank', 'v.', '猛拉', '强调突然、用力的一下。'],
  ['haul', 'v.', '拖运', '常指费力或长距离拉动重物。']
];
manualCardPacks101150.pull.confusables = [];
manualCardPacks101150.realize.synonyms = [
  ['become aware of', 'phr.v.', '意识到', '强调开始知道此前未注意的事实。'],
  ['understand', 'v.', '明白', '强调理解含义、原因或情况。'],
  ['appreciate', 'v.', '认识到', '常指充分理解重要性、困难或价值。'],
  ['achieve', 'v.', '实现', '只对应梦想、目标或潜力变为现实。'],
  ['fulfill', 'v.', '实现；履行', '常接 ambition、promise 或 obligation。']
];
manualCardPacks101150.increase.synonyms = [
  ['rise', 'v.', '上升', '不及物，主语自身增长。'],
  ['grow', 'v.', '增长', '常指规模、数量或强度逐渐增加。'],
  ['heighten', 'v.', '增强；提高', '常接 awareness、tension、risk 或 emotion。'],
  ['expand', 'v.', '扩大', '强调尺寸、范围或容量变大。'],
  ['boost', 'v.', '提升', '强调有意而较快地提高表现或数量。']
];
manualCardPacks101150.compare.synonyms = [
  ['juxtapose', 'v.', '并置比较', '正式，强调把事物放在一起以显示差异或联系。'],
  ['match', 'v.', '比对', '常指核对两项是否相同或相配。'],
  ['liken', 'v.', '比作', '只用于把一事物比作另一事物。'],
  ['evaluate', 'v.', '评估', '依据标准判断，不只是并列观察异同。'],
  ['benchmark', 'v.', '对标', '按既定基准衡量表现。']
];
manualCardPacks101150.reduce.synonyms = [
  ['curtail', 'v.', '削减；缩短', '较正式，常接 spending、activity 或 freedom。'],
  ['lower', 'v.', '降低', '常接价格、音量、温度或水平。'],
  ['cut', 'v.', '削减', '强调有意且通常较明显地减少。'],
  ['lessen', 'v.', '减轻', '常指疼痛、影响或严重程度减弱。'],
  ['diminish', 'v.', '减弱；缩小', '较正式，可指重要性、力量或数量变小。']
];
manualCardPacks101150.avoid.synonyms = [
  ['sidestep', 'v.', '回避', '常指巧妙避开问题、责任或障碍。'],
  ['evade', 'v.', '逃避', '常指故意逃避责任、问题或追捕。'],
  ['dodge', 'v.', '躲避', '口语，可指身体闪避或回避问题。'],
  ['shun', 'v.', '避开', '强调有意而持续地远离某人或事物。'],
  ['steer clear of', 'phr.v.', '避开', '口语短语，强调保持距离以免危险或麻烦。']
];
manualCardPacks101150.handle.confusables = [];
manualCardPacks101150.achieve.confusables = [];
manualCardPacks101150.solve.confusables = [
  ['dissolve', 'v.', '溶解；解散', 'dissolve 比 solve 多 dis-，表示溶解或使组织解散，不表示解决问题。']
];
manualCardPacks101150.depend.synonyms = [
  ['rely on', 'phr.v.', '依赖', '强调需要支持、资源或可靠性。'],
  ['count on', 'phr.v.', '指望', '口语，强调相信某人会提供帮助。'],
  ['hinge on', 'phr.v.', '取决于', '强调结果由一个关键因素决定。'],
  ['be determined by', 'phr.v.', '由……决定', '正式说明结果受某个条件控制。'],
  ['rest on', 'phr.v.', '取决于；以……为基础', '正式，常指决定、论证或成败依赖某项关键因素。']
];

manualCardPacks101150.pick.derivatives = [
  derivative('picker', 'n.', '采摘者；挑选者', '指采摘作物的人或挑选物品的人。'),
  derivative('picking', 'n.', '采摘；挑选', '常见于 fruit picking 和 order picking。'),
  derivative('pickiness', 'n.', '挑剔', '指对食物或选择要求过多的特点。'),
  derivative('picky', 'adj.', '挑剔的；难以取悦的', '常见于 picky eater。')
];
manualCardPacks101150.reach.derivatives = [
  derivative('overreach', 'v. / n.', '做得过头；过度扩张', '作动词指目标超出能力，作名词指过度伸展或扩张。'),
  derivative('outreach', 'n.', '外展服务；主动接触', '常指机构主动联系并服务社区。'),
  derivative('reachability', 'n.', '可达性；可联系性', '用于地点、网络或人员能否到达或联系。'),
  derivative('reachable', 'adj.', '可到达的；可联系到的', '常形容地点、目标或人员。'),
  derivative('unreachable', 'adj.', '无法到达的；联系不上的', '表示地点、目标或人员不能到达或联系。'),
  derivative('far-reaching', 'adj.', '影响深远的', '常修饰 consequence、reform 或 decision。')
];
manualCardPacks101150.remain.derivatives = [
  derivative('remainder', 'n.', '剩余部分；余数', '可指留下的部分或数学中的余数。'),
  derivative('remaining', 'adj.', '剩余的；留下的', '常放在名词前，如 remaining time。')
];
manualCardPacks101150.explain.derivatives = [
  derivative('explanation', 'n.', '解释；说明', '常用 give an explanation for something。'),
  derivative('explainable', 'adj.', '可解释的', '指能够说明原因或理由。'),
  derivative('unexplained', 'adj.', '未作解释的；原因不明的', '常修饰 absence、change 或 event。'),
  derivative('self-explanatory', 'adj.', '不言自明的', '指内容本身足够清楚，无需另作解释。'),
  derivative('explanatory', 'adj.', '解释性的；说明性的', '常修饰 note、diagram 或 text。')
];
manualCardPacks101150.choose.derivatives = [
  derivative('chooser', 'n.', '选择者', '指作出选择的人。'),
  derivative('choice', 'n.', '选择；选项', '既可指选择行为，也可指可选择的事物。'),
  derivative('chosen', 'adj.', '选定的；精选的', '常指经过选择的人或事物。'),
  derivative('choosy', 'adj.', '挑剔的；选择苛刻的', '表示选择时要求很高。')
];
manualCardPacks101150.realize.derivatives = [
  derivative('realization', 'n.', '意识；实现；变现', '可指突然意识到，也可指计划实现或资产变现。'),
  derivative('realizable', 'adj.', '可实现的；可变现的', '用于目标、价值或资产。'),
  derivative('unrealized', 'adj.', '未实现的；未变现的', '常修饰 potential、profit 或 gain。')
];
manualCardPacks101150.describe.derivatives = [
  derivative('description', 'n.', '描述；说明', '常用 give a description of something。'),
  derivative('descriptive', 'adj.', '描述性的', '强调提供细节而不是评价。'),
  derivative('indescribable', 'adj.', '难以形容的', '表示感受或景象强烈到无法用语言描述。'),
  derivative('descriptively', 'adv.', '描述性地', '说明语言以描写特征为主。'),
  derivative('indescribably', 'adv.', '难以形容地', '强调程度极高而难以言表。')
];
manualCardPacks101150.manage.derivatives = [
  derivative('mismanage', 'v.', '管理不善；处置失当', '指以错误或低效方式管理资源、组织或事务。'),
  derivative('manager', 'n.', '经理；管理者', '指负责人员、业务或项目的人。'),
  derivative('management', 'n.', '管理；管理层', '可指管理活动、方法或组织的管理人员。'),
  derivative('mismanagement', 'n.', '管理不善', '指资源、组织或事务被错误管理。'),
  derivative('manageable', 'adj.', '可管理的；可应付的', '常形容工作量、成本或问题处于可控范围。'),
  derivative('unmanageable', 'adj.', '难以管理的；无法应付的', '表示规模、行为或问题超出控制。')
];
manualCardPacks101150.handle.derivatives = [
  derivative('mishandle', 'v.', '处理不当；错误操作', '可指不妥善处理问题、物品或机密信息。'),
  derivative('handler', 'n.', '处理者；经办人；驯兽员', '指处理事务、操控设备或训练动物的人。'),
  derivative('handling', 'n.', '处理；搬运；操控', '常见于 data handling、food handling 和 handling fee。'),
  derivative('mishandling', 'n.', '处理不当', '指错误处置事务、证据或物品。')
];
manualCardPacks101150.encourage.derivatives = [
  derivative('discourage', 'v.', '劝阻；使泄气', '可指使人失去信心，也可指抑制某种行为。'),
  derivative('encouragement', 'n.', '鼓励；激励', '常用 give someone encouragement。'),
  derivative('discouragement', 'n.', '泄气；劝阻', '可指失去信心，也可指抑制行为的措施。'),
  derivative('encouraging', 'adj.', '令人鼓舞的；有希望的', '常形容 result、sign 和 progress。'),
  derivative('encouraged', 'adj.', '受到鼓舞的', '常用 feel encouraged by something。'),
  derivative('discouraging', 'adj.', '令人泄气的', '常形容 result、delay 或 experience。'),
  derivative('encouragingly', 'adv.', '令人鼓舞地', '说明迹象或结果呈现积极趋势。')
];

manualCardPacks101150.realize.meanings = [
  ['v.', 'to become aware of or understand a fact', '意识到；明白', 'I realized that I had left my keys at work.', '我意识到自己把钥匙落在单位了。'],
  ['v.', 'to achieve something that you hoped or planned to do', '实现；达成', 'She realized her dream of opening a bakery.', '她实现了开面包店的梦想。'],
  ['v.', 'to make an idea, plan, or design become real', '使成为现实；落实', 'The architect realized the design with local materials.', '建筑师用当地材料把设计变成了现实。'],
  ['v.', 'to obtain money or profit from an asset or investment', '变现；实现收益', 'The fund sold several shares to realize a profit.', '这只基金卖出几只股票以实现收益。']
];
manualCardPacks101150.express.meanings = [
  ['v.', 'to communicate a thought, feeling, or idea in words, actions, art, or another form', '表达；表示；表现', 'She expressed her concerns clearly.', '她清楚地表达了自己的担忧。'],
  ['v.', 'to show a feeling, quality, or opinion', '流露；体现', 'His face expressed genuine relief.', '他的脸上流露出真切的宽慰。'],
  ['v.', 'to represent a quantity, relationship, or idea in a particular form', '表示（数值、关系或概念）', 'The chart expresses each category as a percentage of the total.', '图表用占总数的百分比表示每个类别。']
];

const replaceRelatedItem = (word, oldWord, replacement) => {
  for (const [, items] of manualCardPacks101150[word].related) {
    const index = items.findIndex(([item]) => item.toLowerCase() === oldWord.toLowerCase());
    if (index >= 0) items[index] = replacement;
  }
};
replaceRelatedItem('cut', 'slice', ['segment', 'n.', '一段；一部分']);
replaceRelatedItem('receive', 'welcome', ['care', 'n.', '照护；照料']);
replaceRelatedItem('cause', 'trigger', ['catalyst', 'n.', '促成因素']);
replaceRelatedItem('compare', 'benchmark', ['scale', 'n.', '衡量尺度']);
replaceRelatedItem('solve', 'answer', ['outcome', 'n.', '结果']);

const replaceContextItem = (word, oldPhrase, replacement) => {
  for (const [, items] of manualCardPacks101150[word].contexts) {
    const index = items.findIndex(([phrase]) => phrase === oldPhrase);
    if (index >= 0) items[index] = replacement;
  }
};
replaceContextItem('pass', 'pass quickly in good company', ['time passes quickly in good company', '与投缘的人相处时，时间过得很快']);
replaceContextItem('reach', 'reach safety across the river', ['reach safety after crossing the river', '过河后到达安全地带']);
replaceContextItem('remain', 'remain once the water evaporates', ['salt remains after the water evaporates', '水分蒸发后盐会残留下来']);

manualCardPacks101150.sell.commonErrors = [
  ['He sold the laptop from me.', 'He sold the laptop to me.', 'sell 表示卖给某人时用 to，from 表示来源。'],
  ['The shop sold the book me.', 'The shop sold the book to me.', '物品位于人前时，要用 sell something to someone。']
];
manualCardPacks101150.compare.commonErrors = [
  ['This model is cheaper compared than that one.', 'This model is cheaper than that one.', '比较级直接用 than，compare 不与 than 组成结构。'],
  ['Compared with last year, the company sold more bicycles.', 'Compared with last year, bicycle sales were higher.', 'Compared with 的逻辑主语必须是实际被比较的对象；这里比较的是销量，不是公司。']
];
manualCardPacks101150.discover.commonErrors = [
  ['Scientists discovered about a new species.', 'Scientists discovered a new species.', 'discover 是及物动词，直接接发现的事物。'],
  ['I discovered where was the leak.', 'I discovered where the leak was.', 'discover 后的间接疑问句使用陈述语序。']
];

manualCardPacks101150.suggest.fixedPhrases[10] = [
  'suggest that someone consult a doctor',
  '建议某人咨询医生',
  'Given the recurring pain, I suggest that you consult a doctor without delay.',
  '鉴于疼痛反复出现，我建议你立即咨询医生。'
];
manualCardPacks101150.increase.fixedPhrases[11][1] = '增加成功的可能性；提高胜算';

manualCardPacks101150.support.commonErrors = [
  ['I strongly support to the proposal.', 'I strongly support the proposal.', 'support 是及物动词，直接接所支持的人或事。'],
  ['Her family supported to her during treatment.', 'Her family supported her during treatment.', 'support 作“支持某人”时直接接人，不在宾语前加 to。']
];
manualCardPacks101150.prepare.commonErrors = [
  ['We are preparing the exam.', 'We are preparing for the exam.', '学生为考试做准备用 prepare for；prepare the exam 表示出题或筹备考试。'],
  ['She prepared to me for the interview.', 'She prepared me for the interview.', '使某人为某事做好准备用 prepare someone for something，宾语前不加 to。']
];
manualCardPacks101150.encourage.commonErrors = [
  ['The teacher encouraged to me speak.', 'The teacher encouraged me to speak.', 'encourage someone to do 中宾语位于 encourage 后，to 位于宾语之后。'],
  ['The policy encourages to use public transport.', 'The policy encourages people to use public transport.', 'encourage 表示鼓励某人做事时，需要先写明被鼓励的人，再接 to do。']
];
manualCardPacks101150.increase.commonErrors = [
  ['The company increased prices with ten percent.', 'The company increased prices by ten percent.', '表示增幅用 increase by 加数值，不用 with。'],
  ['The price increased from twenty dollars by thirty dollars.', 'The price increased from twenty dollars to thirty dollars.', '表示起点和终点用 from...to...；by 表示增加了多少。']
];
manualCardPacks101150.reduce.commonErrors = [
  ['We reduced costs with ten percent.', 'We reduced costs by ten percent.', '表示减少的幅度用 by，不用 with。'],
  ['The new filter reduced by the noise.', 'The new filter reduced the noise.', 'reduce 作及物动词时直接接被减少的对象；被动结构才用 be reduced by。']
];
manualCardPacks101150.achieve.commonErrors = [
  ['She achieved to finish the course.', 'She managed to finish the course.', 'achieve 后接目标或成果名词；表示设法做成某事可用 manage to do。'],
  ['The project achieved a great progress.', 'The project achieved great progress.', 'progress 是不可数名词，前面不能加 a；achieve progress 可以使用。']
];
manualCardPacks101150.pick.commonErrors = [
  ['I will pick you at the station.', 'I will pick you up at the station.', '表示开车接某人要用 pick someone up。'],
  ['She picked out it for the ceremony.', 'She picked it out for the ceremony.', '代词作 pick out 的宾语时，必须放在 pick 与 out 之间。']
];
manualCardPacks101150.manage.commonErrors = [
  ['We managed finishing on time.', 'We managed to finish on time.', 'manage 表示设法成功做成某事时接 to do。'],
  ['She managed the project successful.', 'She managed the project successfully.', '修饰 manage 这一动作要用副词 successfully，不能用形容词 successful。']
];

// Keep correction pairs pronounceable: each wrong side uses real English
// words and demonstrates a genuine grammar or collocation error.
manualCardPacks101150.cut.commonErrors = [
  ['She has cut the rope yesterday.', 'She cut the rope yesterday.', 'yesterday 是明确结束的过去时间，句子应使用一般过去时，不能使用现在完成时。'],
  ['Cut the apple in four pieces.', 'Cut the apple into four pieces.', '表示切后形成若干部分用 cut into，不用 cut in。']
];
manualCardPacks101150.eat.commonErrors = [
  ['I ate some medicine after lunch.', 'I took some medicine after lunch.', '英语用 take medicine 表示服药，不用 eat medicine。'],
  ['He eats much vegetables with dinner.', 'He eats many vegetables with dinner.', 'vegetables 是可数名词复数，表示数量多用 many，不用 much。']
];
manualCardPacks101150.hit.commonErrors = [
  ['The ball has hit the wall a minute ago.', 'The ball hit the wall a minute ago.', 'a minute ago 是明确结束的过去时间，句子应使用一般过去时。'],
  ['The car hit to a tree.', 'The car hit a tree.', 'hit 是及物动词，碰撞对象前不加 to。']
];
manualCardPacks101150.wear.commonErrors = [
  ['She is wearing on a red coat.', 'She is wearing a red coat.', 'wear 表示穿着时直接接衣物，不加 on。'],
  ['He has wore glasses since childhood.', 'He has worn glasses since childhood.', '现在完成时 has 后要用过去分词 worn，不能用过去式 wore。']
];

manualCardPacks101150.report.meanings = [
  ['v.', 'to give an official or detailed account of an event or situation', '报告；汇报', 'The team reported its findings to the board.', '团队向董事会汇报了调查结果。'],
  ['v.', 'to tell an authority about a problem, crime, or incident', '举报；报告', 'She reported the theft to the police.', '她向警方报了盗窃案。'],
  ['v.', 'to present news for a newspaper, broadcast, or website', '报道', 'Several journalists reported the election live.', '几名记者对选举进行了现场报道。'],
  ['v.', 'to be responsible to a particular manager in a work hierarchy', '向……负责；向……汇报工作', 'The regional managers report directly to the operations director.', '各地区经理直接向运营主管汇报工作。'],
  ['v.', 'to arrive at a place and announce that you are ready for duty', '报到', 'New recruits must report for duty at seven in the morning.', '新员工必须在早晨七点报到上班。']
];
manualCardPacks101150.return.meanings = [
  ['v.', 'to go or come back to a place, activity, or condition', '返回；回来；恢复', 'She returned to work on Monday.', '她星期一重返工作岗位。'],
  ['v.', 'to give, send, or put something back', '归还；退回', 'Please return the key before noon.', '请在中午前归还钥匙。'],
  ['v.', 'to respond to an action in the same way', '回报；回应', 'I returned his call that evening.', '我当天晚上给他回了电话。'],
  ['v.', 'to produce a profit or financial result', '产生收益；带来回报', 'The renewable-energy project returned a modest profit in its third year.', '这个可再生能源项目在第三年产生了适度收益。']
];
manualCardPacks101150.drive.meanings = [
  ['v.', 'to control and operate a vehicle', '驾驶；开车', 'She drives to work twice a week.', '她每周开车上班两次。'],
  ['v.', 'to take someone somewhere in a vehicle', '开车送', 'Could you drive me to the airport?', '你能开车送我去机场吗？'],
  ['v.', 'to cause or strongly influence change, activity, or behavior', '推动；驱使', 'Customer demand is driving rapid growth.', '客户需求正推动快速增长。'],
  ['v.', 'to provide the power that makes a machine or part move', '驱动（机器或部件）', 'A small electric motor drives the cooling fan.', '一台小型电动机驱动冷却风扇。']
];
manualCardPacks101150.pick.meanings = [
  ['v.', 'to choose someone or something from a group', '选择；挑选', 'Pick the option that best fits your needs.', '请选择最符合你需要的选项。'],
  ['v.', 'to remove a flower, fruit, or leaf by hand', '采；摘', 'They picked apples in the orchard.', '他们在果园里摘苹果。'],
  ['v.', 'to take someone or something up or collect them', '拿起；接取', 'I will pick you up outside the station.', '我会在车站外接你。'],
  ['v.', 'to open a lock without its key by using a small tool', '撬开（锁）', 'A locksmith picked the lock without damaging the door.', '锁匠没有损坏门就撬开了锁。'],
  ['v.', 'to recognize or separate a sound, pattern, or detail from its surroundings', '辨认；分辨', 'She picked out the flute melody from the orchestra.', '她从管弦乐声中辨认出了长笛旋律。']
];

manualCardPacks101150.agree.derivatives = [
  derivative('disagree', 'v.', '不同意；不一致', '常用 disagree with someone 或 disagree about something。'),
  derivative('agreement', 'n.', '协议；一致', '常用结构 reach an agreement。'),
  derivative('disagreement', 'n.', '分歧；意见不合', '指意见或说法之间的不一致。'),
  derivative('agreeable', 'adj.', '令人愉快的；可接受的', '可形容某事令人满意或双方都能接受。'),
  derivative('agreeably', 'adv.', '愉快地；惬意地', '多见于较正式表达。')
];
manualCardPacks101150.receive.derivatives = [
  derivative('receiver', 'n.', '接收者；听筒；接收器', '可指收取物品的人、电话听筒或信号接收设备。'),
  derivative('recipient', 'n.', '接收者；收件人；获奖者', '常指邮件、款项、奖项或服务的接受者。'),
  derivative('reception', 'n.', '接收；接待；反响', '可指接待处、信号接收或公众反应。'),
  derivative('receipt', 'n.', '收据；收到', '常见于 proof of receipt 和 sales receipt。'),
  derivative('receptive', 'adj.', '乐于接受的', '常用 be receptive to ideas。')
];
manualCardPacks101150.join.derivatives = [
  derivative('rejoin', 'v.', '重新加入；回到', '指离开后再次加入团体、路线或谈话。'),
  derivative('joiner', 'n.', '参加者；木工', '可指加入组织的人；英式英语中也指细木工。'),
  derivative('joining', 'n. / adj.', '连接；加入的', '常见于 joining instructions 和 joining process。')
];
manualCardPacks101150.hit.derivatives = [
  derivative('hitter', 'n.', '击球手；击打者', '最常见于棒球等球类运动。')
];
manualCardPacks101150.notice.derivatives = [
  derivative('notification', 'n.', '通知；告知', '指正式通知或设备提示。'),
  derivative('noticeable', 'adj.', '明显的；容易察觉的', '常形容 change、difference 或 improvement。'),
  derivative('unnoticed', 'adj.', '未被注意到的', '表示没有引起注意。'),
  derivative('noticeably', 'adv.', '明显地；显著地', '说明变化达到容易察觉的程度。')
];
manualCardPacks101150.notice.synonyms = [
  ['observe', 'v.', '观察到', '较正式，常含有意而仔细地观察。'],
  ['spot', 'v.', '发现', '强调迅速从背景中看见某人或某物。'],
  ['detect', 'v.', '察觉', '常借助检查或仪器发现不明显的事物。'],
  ['perceive', 'v.', '感知', '正式，强调通过感官或理解意识到。'],
  ['register', 'v.', '察觉到；意识到', '常用于某事进入意识，尤其是否定或迟缓察觉的语境。']
];
manualCardPacks101150.listen.synonyms[4] = [
  'attend to', 'phr.v.', '专心听；注意', '正式，可指专心听取话语或声音；也可表示处理或照料，需由宾语判断。'
];
manualCardPacks101150.listen.confusables.push([
  'eavesdrop on', 'phr.v.', '偷听', 'listen 是中性的主动倾听；eavesdrop on 指未经允许偷听私人谈话。'
]);

replaceRelatedItem('remain', 'remainder', ['remnant', 'n.', '残余；遗留部分']);
replaceRelatedItem('return', 'refund', ['replacement', 'n.', '替换品；替代品']);
replaceContextItem('pass', 'pass slowly during the winter', ['time passes slowly during the winter', '冬季里时间过得很慢']);
replaceContextItem('sell', 'sell strongly in urban areas', ['sell especially well in urban areas', '在城市地区尤其畅销']);
replaceContextItem('base', 'base staff at regional offices', ['base staff in regional offices', '把员工派驻地区办事处']);
replaceContextItem('reach', 'reach a negotiated compromise', ['reach a workable compromise', '达成可行的妥协']);
replaceContextItem('remain', 'remain after expenses are paid', ['funds remain after expenses are paid', '支付开支后仍有资金剩余']);
replaceContextItem('hit', 'hit a difficult point in the project', ['hit a major snag in the project', '项目遇到重大障碍']);
replaceContextItem('wear', 'wear better than cheap fabric', ['quality denim wears better than cheap fabric', '优质牛仔布比廉价面料更耐穿']);
replaceContextItem('return', 'return a thoughtful gesture', ['return the gesture with a gift', '用礼物回报这一善意举动']);
replaceContextItem('join', 'join efforts across departments', ['join a cross-departmental effort', '加入跨部门协作行动']);
replaceContextItem('solve', 'solve the housing shortage', ['solve a resource-allocation problem', '解决资源分配问题']);
replaceContextItem('solve', 'solve a conflict peacefully', ['solve a difficult logistics problem', '解决棘手的物流问题']);
replaceContextItem('solve', 'solve bottlenecks through automation', ['solve recurring scheduling problems through automation', '通过自动化解决反复出现的排程问题']);

// Keep the visible relationship sections independent from the word-family
// section. Closely related forms belong under derivatives only; confusables
// stay empty when there is no genuinely useful contrast to teach.
manualCardPacks101150.agree.antonyms = [
  ['object', 'v.', '反对；不赞成', '常用 object to something，表示明确提出异议；agree 表示同意或意见一致。'],
  ['back out of', 'phr.v.', '退出；反悔', '只与 agree to an arrangement/commitment 的承诺义相对；agree to 表示接受安排，back out of 则在承诺后退出。']
];
manualCardPacks101150.handle.antonyms = [
  ['botch', 'v.', '把……搞砸', 'handle 强调妥善处理；botch 指因粗心或能力不足而把工作做坏。']
];
manualCardPacks101150.encourage.antonyms = [
  ['deter', 'v.', '阻止；使打消念头', 'encourage 促使某人采取行动；deter 通过风险或阻力使人不去做。']
];
manualCardPacks101150.decide.confusables = [];
manualCardPacks101150.sell.confusables = [
  ['cell', 'n.', '细胞；小室', 'cell 与 sell 同音但拼写和词义不同；sell 是动词“出售”。']
];
manualCardPacks101150.receive.confusables = [];
manualCardPacks101150.base.confusables = [
  ['bass', 'n.', '低音；低音乐器', '表示低音时 bass 与 base 同音；base 指基础或以……为依据。']
];
manualCardPacks101150.develop.confusables = [];
manualCardPacks101150.manage.confusables = [];
manualCardPacks101150.depend.confusables = [];

// Final phrase-level corrections from the release audit.  These are kept at
// the end of the module so they cannot be shadowed by an earlier data block.
replaceContextItem('pass', 'time passes quickly in good company', [
  'time passes quickly in good company',
  '与好友相处时光飞逝'
]);
replaceContextItem('solve', 'solve recurring scheduling problems through automation', [
  'solve recurring scheduling problems through automation',
  '自动化解决排程问题'
]);
manualCardPacks101150.realize.fixedPhrases[1] = [
  'realize the importance of something',
  '认识到某事的重要性',
  'The drought made everyone realize the importance of clean water.',
  '这场干旱让所有人认识到清洁用水的重要性。'
];
manualCardPacks101150.prefer.fixedPhrases[7] = [
  'prefer doing something to doing something else',
  '比起做另一件事更喜欢做某事',
  'Many commuters prefer cycling to driving in summer.',
  '夏季许多通勤者更喜欢骑车而不是开车。'
];

// Adaptive word-family sections must contain genuinely useful everyday
// forms.  Rare technical or marginal formations are intentionally omitted.
manualCardPacks101150.agree.derivatives = manualCardPacks101150.agree.derivatives
  .filter(([word]) => word !== 'agreeably');
manualCardPacks101150.choose.derivatives = manualCardPacks101150.choose.derivatives
  .filter(([word]) => word !== 'chooser');
manualCardPacks101150.describe.derivatives = manualCardPacks101150.describe.derivatives
  .filter(([word]) => word !== 'descriptively');
manualCardPacks101150.reduce.derivatives = manualCardPacks101150.reduce.derivatives
  .filter(([word]) => word !== 'reducer');
manualCardPacks101150.solve.derivatives = manualCardPacks101150.solve.derivatives
  .filter(([word]) => word !== 'solvability');

const reviewedDerivativeNotes = Object.freeze({
  decide: {
    indecision: '指在两个或多个选择之间反复犹豫，无法及时作出决定。',
    decisively: '说明行动或判断迅速明确，并能最终决定结果。'
  },
  explain: {
    explainable: '指某种现象、差异或行为能够给出合理原因。'
  },
  wear: {
    wearer: '指正在穿着或佩戴某件衣物、设备或饰品的人。'
  },
  choose: {
    choosy: '表示选择时要求很高，常形容顾客或对食物挑剔的人。'
  },
  cause: {
    causative: '常用于语法中的使役结构，或医学中的致病因素语境。'
  },
  realize: {
    realizable: '常形容目标可以实现，或资产价值能够通过出售变现。'
  },
  avoid: {
    unavoidably: '说明某一结果即使采取预防措施仍必然发生。'
  },
  notice: {
    notification: '指机构发出的正式通知，或设备和应用程序的消息提示。',
    unnoticed: '表示人、变化或错误发生后没有引起任何人的注意。'
  }
});

for (const [headword, notes] of Object.entries(reviewedDerivativeNotes)) {
  manualCardPacks101150[headword].derivatives = manualCardPacks101150[headword].derivatives
    .map(([word, partOfSpeech, chinese, note]) => [
      word,
      partOfSpeech,
      chinese,
      notes[word] ?? note
    ]);
}

// Every relation row already begins with a relation-specific distinction
// (register, argument pattern, object type, or sense).  The reviewed boundary
// below adds the complementary target-word side of that contrast.  Boundaries
// are deliberately authored per headword rather than filled with a global
// stock sentence, so the visible notes remain useful even when read alone.
const reviewedTargetBoundaryByHeadword = Object.freeze({
  end: 'end 可及物或不及物，覆盖活动、关系与时间段到达终点。',
  require: 'require 可直接接所需之物，或用 require someone to do 表示正式要求。',
  listen: 'listen 强调主动把注意力投向声音，通常与 to 或 for 连用。',
  agree: 'agree 侧重观点一致或商定安排，分别常与 with、on、to 搭配。',
  cut: 'cut 还可泛指削减数量或切断供应，并不限定某一种切法。',
  decide: 'decide 强调作出选择或裁定结果，可接 to do、on 或直接宾语。',
  pass: 'pass 还覆盖通过考试、递交物品、法案获批以及时间流逝。',
  eat: 'eat 是日常通用动词，可及物表示吃某物，也可不及物表示用餐。',
  report: 'report 强调把可核查的信息正式汇报给个人、机构或公众。',
  suggest: 'suggest 可提出建议或以证据暗示结论，但不用 suggest someone to do。',
  sell: 'sell 强调以所有权换取金钱，也可比喻说服别人接受方案。',
  support: 'support 可指实际帮助、赞成立场、提供证据或承受重量。',
  receive: 'receive 侧重被动收到或正式接待，并不必然表示主动取得。',
  base: 'base 作动词常用 base something on 或 be based in 表示依据或驻地。',
  pick: 'pick 除选择外还可表示采摘、拿取或从背景中辨认目标。',
  drive: 'drive 既指操控车辆，也可表示推动变化或给机器提供动力。',
  reach: 'reach 可直接接地点、水平或联系人，也可与 for 连用表示伸手。',
  remain: 'remain 是较正式的系动词，可接形容词、名词或地点短语。',
  explain: 'explain 重点是让原因或意义清楚，常用 explain something to someone。',
  hit: 'hit 可直接接被击中的对象，也常接数值、目标或受冲击者。',
  pull: 'pull 表示一般的朝向拉动，也可构成 pull over、pull through 等短语义。',
  raise: 'raise 必须带宾语，可指抬高、增加、筹集、养育或提出议题。',
  wear: 'wear 强调穿戴状态，也可表示呈现表情或因长期使用而磨损。',
  return: 'return 可不及物表示回来，也可及物表示归还、退回或回应。',
  choose: 'choose 强调在备选项中作选择，可接名词、to do 或 between。',
  cause: 'cause 表示直接使结果发生，通常以原因作主语、结果作宾语。',
  join: 'join 可直接接团体或人；表示加入一项活动也常用 join in。',
  develop: 'develop 强调逐步形成或使成长，也可指产品开发、患病或冲洗胶片。',
  share: 'share 可指共用、分给他人或告知信息，常与 with 搭配。',
  realize: 'realize 可表示突然意识到，也可指梦想实现或资产收益变现。',
  describe: 'describe 说明对象的特征、状态或过程，常用 describe something as。',
  increase: 'increase 可及物或不及物，适用于数量、水平、风险与机会。',
  protect: 'protect 后接受保护对象，并常用 from 或 against 引出风险。',
  compare: 'compare 可同时考察相同点与差异，compare A with B 最为中性。',
  reduce: 'reduce 通常及物，可接数量、尺寸，或用 reduce A to B 表示降至某状态。',
  accept: 'accept 强调愿意接纳提议、事实或申请，而不只是物理收到。',
  prepare: 'prepare 可直接接准备对象，也可用 prepare for 或 prepare to do。',
  avoid: 'avoid 直接接名词或 doing，不能使用 avoid someone from doing。',
  notice: 'notice 表示感官上察觉，可接名词、that 从句或宾语加动词。',
  affect: 'affect 通常是及物动词，直接接受到影响的人、事或结果。',
  manage: 'manage 可直接接人员或资源；manage to do 则表示克服困难做到。',
  improve: 'improve 可及物表示改进某物，也可不及物表示状况自行好转。',
  discover: 'discover 指发现原已存在但未知的事物，也可接 that 从句表示得知。',
  handle: 'handle 可指处理问题、操作物品或承受负荷，通常直接接宾语。',
  achieve: 'achieve 强调经过努力达到目标、标准或结果，通常直接接宾语。',
  express: 'express 可用言语、行为或符号表达内容，也可表示数值关系。',
  encourage: 'encourage 可用 encourage someone to do，也可直接接活动表示促进。',
  depend: 'depend 通常不及物，必须用 depend on 或 depend upon 引出依赖对象。',
  prefer: 'prefer 表示相对偏好，常用 prefer A to B 或 prefer to do。',
  solve: 'solve 聚焦找到问题、谜题或方程的答案，而不只是处理其影响。'
});

// Index-aligned, relation-specific target-side contrasts.  The short source
// note explains the neighboring word; these clauses explain precisely how the
// headword differs, so five synonyms on one card do not repeat a stock tail.
const reviewedSynonymBoundaryByHeadword = Object.freeze({
  end: [
    'end 也可表示事件自行结束，不必带宾语。',
    'end 更强调最终终结，stop 也可能只是暂停。',
    'end 语体更中性，日常活动也可直接使用。',
    'end 比 terminate 常用，且不限于正式终止。',
    'end 在日常口语中更自然，也能接具体活动。'
  ],
  require: [
    'require 较正式，常见于规则、流程和书面要求。',
    'require 语气较客观，不一定含强硬施压。',
    'require 可由人或规则作主语，句法范围更宽。',
    'require 可直接接物，也可接宾语加不定式。',
    'require 聚焦所需条件，entail 强调随之而来的结果。'
  ],
  listen: [
    'listen 专门用于声音，不能泛指视觉或任务上的注意。',
    'listen 语体中性，也可用于音乐和环境声。',
    'listen 不必表示采纳，可能只是认真听取。',
    'listen 不限广播，也可接人、音乐或某种声音。',
    'listen 更常见，且不会同时表示处理事务。'
  ],
  agree: [
    'agree 可直接说明观点一致，不一定是对请求许可。',
    'agree 本身不表示机构正式授权或批准。',
    'agree 比 concur 日常，适用于普通会话。',
    'agree 还能用于商定日期、条款和行动。',
    'agree 强调双方形成共同意见，不一定已经解决争端。'
  ],
  cut: [
    'cut 范围更广，不要求切成薄片。',
    'cut 语气中性，不要求快速或切成小块。',
    'cut 可移除整段，也可把材料分开。',
    'cut 还保留真实切割义，reduce 没有这一动作义。',
    'cut 不一定完全分离，语体也没有 sever 正式。'
  ],
  decide: [
    'decide 强调最终作出决定，不只是挑中某项。',
    'decide 通常表示主动选择，不等于查明客观事实。',
    'decide 不一定包含解决困难或消除矛盾。',
    'decide 可由个人单独作出，不要求双方和解。',
    'decide 也用于日常选择，不限法院裁决。'
  ],
  pass: [
    'pass 可直接接人或地点，且还有多种非移动义。',
    'pass 的范围还包括考试、递交和时间流逝。',
    'pass 可沿多人继续传递，不只直接交到一人手中。',
    'pass 还可由人或法案作主语，不限时间段。',
    'pass 描述法案经表决通过，不只是机构作出批准。'
  ],
  eat: [
    'eat 只表示摄入食物，语体也比 consume 日常。',
    'eat 可直接接具体食物，不依赖 meal 等名词。',
    'eat 是中性进食，不暗示速度快或食量大。',
    'eat 可用于任何进食场景，不限正式正餐。',
    'eat 既用于人也用于动物，并可指一次具体进食。'
  ],
  report: [
    'report 通常提供经过、证据或结果，比 announce 详细。',
    'report 还包含向上级、警方或公众正式提交信息。',
    'report 可口头汇报，不一定形成永久文件记录。',
    'report 以事件为宾语时强调报告内容，而非只通知对象。',
    'report 也可用于非新闻的工作汇报、报案和报到。'
  ],
  suggest: [
    'suggest 语气可较委婉，不一定形成正式提案。',
    'suggest 还能提出点子或暗示结论，不只推荐选择。',
    'suggest 也可由证据作主语，不限人主动提出观点。',
    'suggest 还可表示建议行动，而 indicate 通常不行。',
    'suggest 可明确提出建议，imply 则是不明说。'
  ],
  sell: [
    'sell 也可用于批发、房产或个人二手交易。',
    'sell 表示完成或尝试交易，market 只强调推广。',
    'sell 只说明卖方行为，trade 还可表示买入或交换。',
    'sell 不要求竞价，按固定价格出售也适用。',
    'sell 的本义是出售；说服只是其比喻用法。'
  ],
  support: [
    'support 常含持续、情感或经济上的支持。',
    'support 还可表示赞成立场、提供证据或承重。',
    'support 比 back 范围广，也适用于结构和论据。',
    'support 还可帮助个人或支撑物体，不限原则。',
    'support 可指一次具体援助，也可指长期维持。'
  ],
  receive: [
    'receive 较正式，并突出成为传递动作的接收方。',
    'receive 不要求付出努力或经过主动获取程序。',
    'receive 不表示同意，收到后仍可拒绝接受。',
    'receive 可正式接见来宾，不必表达热情欢迎。',
    'receive 可由邮件或快递送达，不要求亲自领取。'
  ],
  base: [
    'base 强调让论证建立在依据上，常用 base A on B。',
    'base 还可强调业务从某地运营，不只是确定坐标。',
    'base 可用于公司或业务，station 更常用于人员设备。',
    'base 可用主动结构说明谁安排驻地。',
    'base 强调当前依据，不一定表示历史或深层来源。'
  ],
  pick: [
    'pick 更口语，也可表示采摘或拿起。',
    'pick 不一定依据正式标准，常是个人快速选择。',
    'pick 还可表示从一组对象中选择，不只从植物取下。',
    'pick up 才常指接人取物；单独 pick 另有选择和采摘义。',
    'pick 可选物也可选人，不一定构成正式提名。'
  ],
  drive: [
    'drive 还强调车辆动力或完整驾驶行为，不只转向。',
    'drive 对车辆通常包含操控与行进，operate 范围更宽。',
    'drive someone 强调亲自驾车送达，不只是运输安排。',
    'drive 也能以需求、政策等抽象因素作主语。',
    'drive 可表示外部力量驱使，motivate 常涉及心理动力。'
  ],
  reach: [
    'reach 比 get to 中性正式，也可接水平、目标或联系人。',
    'reach 更常用，除水平外还可接地点和人。',
    'reach 可表示到达位置或联系上某人，不一定靠努力。',
    'reach 除联系义外还可表示抵达、达到或伸手。',
    'reach 可表示成功触及终点，不只是延伸到某处。'
  ],
  remain: [
    'remain 较正式，可接状态补语，也可表示剩余。',
    'remain 说明状态或位置不变，不强调动作过程。',
    'remain 是中性持续，persist 常暗示问题顽固存在。',
    'remain 还可表示留下的数量，不只持续多久。',
    'remain 不含不情愿或超过预期的意味。'
  ],
  explain: [
    'explain 可从头说明原因或过程，不只消除歧义。',
    'explain 语体中性，细节多少由语境决定。',
    'explain 可说明原因和机制，不限解释符号意义。',
    'explain 直接使内容清楚，未必需要举例或图表。',
    'explain 关注原因和意义，describe 更关注特征。'
  ],
  hit: [
    'hit 更日常，可指一次普通接触，也有达到数值等义。',
    'hit 不要求发出声响，宾语可为人、物或目标。',
    'hit 是及物动词，collide 通常要与 with 连用。',
    'hit 可指达到数值，但还保留物理击打和冲击义。',
    'hit 可表示突发冲击，affect 的影响范围和时间更宽。'
  ],
  pull: [
    'pull 是最普通的拉动，不带书面或文学色彩。',
    'pull 可持续施力，不要求短促或反复。',
    'pull 可拉任何物体，tow 多用于车辆、船或重物。',
    'pull 不一定突然猛烈，力度由上下文说明。',
    'pull 不暗示沉重、费力或长距离。'
  ],
  raise: [
    'raise 除抬高实物外还可提高数值、筹款和提出问题。',
    'raise 必须带宾语；increase 还可不及物。',
    'raise funds 是固定筹款义，raise 的其他义并非 collect。',
    'raise 在美式英语中常用于抚养孩子，范围比 rear 广。',
    'raise a question 强调提出，mention 只表示提到。'
  ],
  wear: [
    'wear 也描述习惯或一般穿戴，不只当前状态。',
    'wear 强调穿戴后的状态，don 只强调穿上的动作。',
    'wear 语气中性，不含刻意炫耀意味。',
    'wear 还能接衣物、饰品或磨损主语，不限面部特征。',
    'wear 是穿戴衣物的常规动词，display 不能这样替换。'
  ],
  return: [
    'return 不受说话者位置限制，语体也更正式。',
    'return 可表示朝任何先前地点返回，并不限离开说话者。',
    'return 还可表示回到状态、回应或产生收益。',
    'return a call 强调回拨，reply 不能直接接所有实物。',
    'return 可表示人或物回来，recur 只用于事件反复出现。'
  ],
  choose: [
    'choose 更通用，不暗示按正式标准筛选。',
    'choose 比 pick 中性，也适用于重大或审慎决定。',
    'choose 可接 to do，opt for 只能接名词或动名词。',
    'choose 不一定涉及投票或正式任命。',
    'choose 可表示偏好或决定行动，decide on 聚焦最终确定。'
  ],
  cause: [
    'cause 直接强调因果关系，语体比 bring about 更简洁。',
    'cause 可直接接结果作宾语，不必使用介词 to。',
    'cause 常用于负面或中性结果，produce 的搭配范围不同。',
    'cause 不要求结果突然发生，trigger 往往强调启动点。',
    'cause 语气中性，不暗示故意激起反应。'
  ],
  join: [
    'join 可直接接团体、活动者或连接对象。',
    'join 适用于俱乐部、团队等，不限正式课程注册。',
    'join 及物可直接接组织；participate 必须与 in 连用。',
    'join 还可表示加入群体，不只连接物体或系统。',
    'join 可保持各部分身份，unite 更强调形成整体。'
  ],
  develop: [
    'develop 可及物，表示培养能力或开发产品。',
    'develop 强调逐步形成，create 可表示一次性创造。',
    'develop 还可主动培养或开发，不只自行形成。',
    'develop 不一定扩大规模，也可提高质量或形成症状。',
    'develop 可用于产品、疾病和照片，不限长期培养。'
  ],
  share: [
    'share 也可表示共同拥有，不一定把整体切开。',
    'share 可与少数人共用，不要求向多人分发。',
    'share 还可表示共同经历或分配资源。',
    'share 语气中性，不暗示信息原本保密。',
    'share 可直接接信息或物品；participate in 只表示参与。'
  ],
  realize: [
    'realize 常带突然觉察意味，也可表示实现目标。',
    'realize 强调从未知到意识到，understand 可是持续状态。',
    'realize 还可指计划落实或收益变现，不限理解价值。',
    'realize 也能接事实从句和资产收益，不只目标。',
    'realize 可接 dream、plan 或 profit，搭配范围更宽。'
  ],
  describe: [
    'describe 可纯用语言说明，不要求形成视觉图像。',
    'describe 也可说明地点、过程和事物，不限人物形象。',
    'describe 可罗列多项细节，不只指出典型特征。',
    'describe 通常提供更多具体内容，而非只列轮廓。',
    'describe 侧重是什么样，explain 侧重为什么或如何。'
  ],
  increase: [
    'increase 既可不及物，也可及物表示使数值上升。',
    'increase 适合可量化水平，grow 还可指生物生长。',
    'increase 范围最广，不限风险、意识或情绪强度。',
    'increase 不一定扩大物理范围，也可提高比率或机会。',
    'increase 语气中性，不暗示人为、快速的促进。'
  ],
  protect: [
    'protect 强调预防伤害，不一定抵抗正在发生的攻击。',
    'protect 不要求持续看守，也可通过制度或设备实现。',
    'protect 语体中性，可用于人、物、权利和环境。',
    'protect 范围更宽，不一定有实体屏障。',
    'protect 强调免受伤害，preserve 强调长期保持原状。'
  ],
  compare: [
    'compare 不要求把对象并置，也适用于数据和表现。',
    'compare 会考察异同，match 更常判断是否相配。',
    'compare A with B 是一般比较；liken 只强调相似。',
    'compare 本身不作价值评判，可只是观察异同。',
    'compare 不一定依据固定行业基准。'
  ],
  reduce: [
    'reduce 范围更广，也可接风险、尺寸和复杂度。',
    'reduce 可接比例或用 reduce A to B，句型更丰富。',
    'reduce 语气中性，不一定表示突然或大幅削减。',
    'reduce 可改变数量或尺寸，不只减轻严重程度。',
    'reduce 通常是人为使减少，diminish 也可自行减弱。'
  ],
  accept: [
    'accept 还表示愿意认可或同意，receive 不含这一态度。',
    'accept 比 take 正式，也可接事实、责任和申请。',
    'accept 可是个人收下事物，不要求机构审批。',
    'accept 还可接邀请、礼物或成员，不只承认事实。',
    'accept 语气中性，不必带积极欢迎或拥抱变化的态度。'
  ],
  prepare: [
    'prepare 范围更广，可准备材料、自己或他人。',
    'prepare 不只安排细节，也可制作成品或训练人员。',
    'prepare 包含实际准备动作，不只是预先拟定步骤。',
    'prepare 不一定提供装备，也可整理信息或心理状态。',
    'prepare 可用于任何事件，不限表演或演练。'
  ],
  avoid: [
    'avoid 语气更中性，也常用于预防错误或事故。',
    'avoid 不必含违法或躲避责任的负面意味。',
    'avoid 不暗示快速闪身，也可用于抽象风险。',
    'avoid 可针对一次行为，不一定长期排斥某人。',
    'avoid 可直接接 doing，语体也比短语表达中性。'
  ],
  notice: [
    'notice 常指自然察觉，不要求持续观察。',
    'notice 不一定从复杂背景中迅速辨认目标。',
    'notice 可凭普通感官察觉，不要求仪器或检查。',
    'notice 比 perceive 日常，也可接宾语加动词。',
    'notice 是日常察觉，register 常描述信息进入意识。'
  ],
  affect: [
    'affect 是最中性的影响动词，可指直接或长期作用。',
    'affect 不一定是重大冲击，也可指细微变化。',
    'affect 强调产生影响，不一定改变事物本身属性。',
    'affect 还可影响性能、价格和结果，不限情感。',
    'affect 的情感义不要求使人流泪或受到强烈感动。'
  ],
  manage: [
    'manage 可用于团队、项目和个人时间，语体更日常。',
    'manage 还可表示设法做到，不只经营组织。',
    'manage 包含决策和资源控制，不只监督下属。',
    'manage 可长期管理，也可一次性成功处理困难。',
    'manage 可直接接任务；cope 必须与 with 连用。'
  ],
  improve: [
    'improve 范围最广，可及物也可不及物。',
    'improve 不只微调精度，也可带来显著整体提升。',
    'improve 不要求更换版本，也可改善技能或健康。',
    'improve 更常用，且可表示事物自行好转。',
    'improve 可用于具体质量，不一定涉及进程推进。'
  ],
  discover: [
    'discover 强调首次得知或发现，find 也可表示找回旧物。',
    'discover 不要求对象被掩藏，也可偶然遇见。',
    'discover 可通过普通观察得知，不要求技术检测。',
    'discover 还可发现地点、物种或证据，不只消息事实。',
    'discover 强调首次发现，identify 强调确认身份。'
  ],
  handle: [
    'handle 可指一次具体应对，也可操作实物。',
    'handle 直接接宾语，语气也比 deal with 更简洁。',
    'handle 还可处理投诉或压力，不限机器操作。',
    'handle 含控制或妥善处理，不只是用手触碰。',
    'handle 也可处理人际情境，不限程序化数据流程。'
  ],
  achieve: [
    'achieve 更常接目标、标准或抽象结果。',
    'achieve 比 attain 常用，也可接 success 或 balance。',
    'achieve 强调努力所得，不只是到达某一点。',
    'achieve 还可接分数、标准和独立，不限梦想成真。',
    'achieve 通常接取得的结果，fulfill 还常接义务和承诺。'
  ],
  express: [
    'express 可直接说明说话者的感受或立场。',
    'express 不一定是完整陈述，也可借行为和艺术表现。',
    'express 的宾语不限意见或异议，也可接情绪和数值。',
    'express 可非语言呈现，不要求清晰组织成语言。',
    'express 强调主动表达，show 的范围更宽且可无意显露。'
  ],
  encourage: [
    'encourage 可直接对人给予信心，也可促进某种行为。',
    'encourage 不只提供动机，也可给出实际支持。',
    'encourage 语气通常较温和，不等于强力敦促。',
    'encourage 可促使开始行动，不只帮助已经开始的人。',
    'encourage 还可对个人说话，promote 多接活动或发展。'
  ],
  depend: [
    'depend 可表示结果取决于条件，也可表示生存依赖。',
    'depend 语体中性，不一定包含对人的信任期待。',
    'depend 可由人或事物作主语，不限成败结果。',
    'depend 更常用，也可表示对人或资源的依赖。',
    'depend 可接生活所需的人或物，不只论证依据。'
  ],
  prefer: [
    'prefer 更中性，通常不含权力关系中的偏袒意味。',
    'prefer 可直接接名词或 to do，语体比 like better 正式。',
    'prefer 描述偏好，不代表最终已经作出选择。',
    'prefer 可比较长期喜好，opt for 更强调一次决定。',
    'prefer 还能直接接名词；would rather 只能接动词原形。'
  ],
  solve: [
    'solve 适合有答案的问题和谜题，resolve 更常用于争端。',
    'solve 语体中性，也可接案件、方程和技术故障。',
    'solve 强调找到完整办法，answer 可能只回答一个问题。',
    'solve 比 crack 中性正式，不带口语挑战色彩。',
    'solve 也可处理数学和技术问题，不限争议事项。'
  ]
});

const reviewedAntonymBoundaryByHeadword = Object.freeze({
  end: [undefined, 'end 表示到达终点，continue 则让同一活动保持进行。'],
  listen: ['listen 是主动给予注意，ignore 则有意或无意不理会。'],
  pass: ['pass 表示达到合格标准，fail 表示没有达到该标准。'],
  eat: ['eat 是摄入食物，fast 则在限定时间主动停止进食。'],
  support: [undefined, 'support 使人或结构更稳固，undermine 则逐步削弱它。'],
  receive: ['receive 位于传递终点，send 则从来源把信息或物品发出。'],
  reach: ['reach 表示成功到达，miss 表示未赶上或未达到。'],
  remain: [
    'remain 表示继续留在原处，leave 表示从该处离开。',
    'remain 可保持原状态，change 表示进入不同状态。'
  ],
  hit: ['hit 表示击中指定目标，miss 表示没有碰到或达到目标。'],
  pull: ['pull 的力朝施力者方向，push 的力让物体远离施力者。'],
  raise: ['raise 使宾语升高或增加，lower 使同一宾语降低。'],
  wear: ['wear 表示把衣物留在身上，remove 表示将其脱下或取下。'],
  return: [
    'return 表示把物品交回，keep 表示继续持有不归还。',
    'return 表示回到原处，depart 表示从该处出发离开。'
  ],
  join: [
    'join 表示成为团体成员，leave 表示退出该团体。',
    'join 可连接两个部分，separate 则把它们分开。'
  ],
  develop: [
    'develop 表示持续形成进展，stagnate 表示停滞不前。',
    'develop 可逐步改善，decline 则表示质量或规模下降。'
  ],
  share: [undefined, 'share 表示让他人共同使用，keep 则保留为自己所有。'],
  protect: ['protect 降低遭受伤害的风险，endanger 则增加危险。'],
  reduce: [
    'reduce 使数值或程度变小，increase 使其变大。',
    'reduce 可缩小尺寸或范围，expand 则扩大同一维度。'
  ],
  accept: [
    'accept 表示同意接纳，reject 表示明确不接受。',
    'accept 可收下邀请或提议，decline 是礼貌谢绝。'
  ],
  avoid: ['avoid 设法不接触困难，confront 则主动面对并处理它。'],
  notice: ['notice 表示察觉到细节，overlook 表示漏看或未注意到。'],
  improve: [undefined, 'improve 表示逐步变好，deteriorate 表示状况逐步恶化。'],
  express: [
    'express 让情感或观点显现，suppress 则主动压制不让其表达。',
    'express 把信息呈现出来，conceal 则有意把它隐藏。'
  ]
});

// Final human semantic review (COCA learningPriority.sequence 101-150).
// These corrections deliberately address sense coverage and item-specific
// naturalness; they are not generic padding for the automated length gates.
manualCardPacks101150.support.meanings.push(
  ['n.', 'help, encouragement, approval, or resources given to someone or something', '支持；帮助；资助', 'The project depends on public support.', '这个项目依赖公众支持。'],
  ['n.', 'a thing that holds an object up or bears its weight', '支撑物；支架', 'The shelf needs an extra support in the middle.', '这个架子中间需要再加一个支撑。']
);
manualCardPacks101150.support.derivatives[1][2] = '给予支持的；支持性的';

manualCardPacks101150.pick.meanings.push(
  ['n.', 'the person or thing selected as the best or preferred choice', '入选者；首选', 'This compact camera is our top pick for travel.', '这款紧凑型相机是我们的旅行首选。']
);
manualCardPacks101150.pick.confusables = [
  ['peck', 'v.', '啄；轻吻', 'pick /pɪk/ 表示挑选、采摘或拿取；peck /pɛk/ 表示鸟用喙啄，或快速轻吻。']
];

manualCardPacks101150.report.fixedPhrases[8][1] = '报告亏损';

manualCardPacks101150.cause.antonyms[0][3] =
  'cause 表示使某个结果发生；prevent 表示阻止同一结果发生，只在这一因果义项上相对。';
manualCardPacks101150.join.synonyms[2][3] =
  'participate 是不及物动词，通常用 participate in an activity；join 可直接接团体或某人，也可表示连接。';

manualCardPacks101150.share.synonyms = [
  ['have in common', 'phr.v.', '共同拥有；有共同点', '表示两人或多方拥有相同特征、兴趣或经历；share 还可主动把物品或信息给别人。'],
  ['use jointly', 'phr.v.', '共同使用', '明确表示多人合用同一资源；share 还可分出一部分，或向他人讲述信息和感受。'],
  ['divide', 'v.', '分配；分开', '强调把整体分成若干份；share 可以共同使用而不把整体实际分开。'],
  ['distribute', 'v.', '分发；分配', '强调有组织地把物品发给多人；share 可只与一个人共用，也不要求正式分发。'],
  ['communicate', 'v.', '传达；交流', '只接近 share 信息或想法的义项；share 还可表示共用资源、分担责任或分配份额。']
];
manualCardPacks101150.share.antonyms = [
  ['keep to oneself', 'v. phr.', '独自保留；不与人分享', '只与 share information/feelings 的告知义相对；keep something to oneself 表示把同一信息或感受留给自己。'],
  ['own exclusively', 'v. phr.', '独占；专有', '只与 share a resource/property 的共同使用或共有义相对；own exclusively 表示由一方单独拥有。']
];
manualCardPacks101150.share.confusables = [
  ['shear', 'v.', '剪羊毛；剪切', 'share 表示分享、共用或分担；shear 表示用剪具剪羊毛或切断，两词拼写和元音发音不同。']
];

manualCardPacks101150.realize.synonyms[4][3] =
  'fulfill 常接 promise、obligation 或 duty，强调履行；realize 可接事实从句、梦想、设计和资产收益。';
manualCardPacks101150.describe.fixedPhrases[5][1] = '把某物描述为……';
manualCardPacks101150.describe.fixedPhrases[7] = [
  'describe something accurately',
  '准确描述某事',
  'The report accurately describes the boundary as it existed in 1950.',
  '这份报告准确描述了1950年时的边界。'
];

manualCardPacks101150.increase.meanings.push(
  ['n.', 'a rise in amount, number, level, or degree', '增加；增长；提高', 'There has been a sharp increase in rent.', '租金大幅上涨。']
);

manualCardPacks101150.reduce.fixedPhrases[9] = [
  'reduce a sauce',
  '收浓酱汁',
  'Reduce the sauce by one third over low heat.',
  '用小火把酱汁收浓三分之一。'
];

manualCardPacks101150.prepare.confusables[0][3] =
  'prepare /prɪˈpɛr/ 表示准备，常接任务、材料或人员；repair /rɪˈpɛr/ 表示修复损坏的人或物。';
manualCardPacks101150.avoid.antonyms[1][3] =
  'avoid 表示有意不接触某人或某物；seek 表示主动寻找或争取同一对象，只在“避开／寻找”这一义项上相对。';

manualCardPacks101150.notice.meanings[1] =
  ['v.', 'to pay attention to or acknowledge someone or something that might otherwise be ignored', '留意；注意；理会', 'The manager finally noticed her contribution to the project.', '经理终于注意到了她对项目的贡献。'];
manualCardPacks101150.notice.meanings.push(
  ['n.', 'a written or printed announcement that gives information or a warning', '通知；告示；公告', 'A notice on the door explained the early closing time.', '门上的告示说明了提前关门的时间。'],
  ['n.', 'advance warning that something will happen or an arrangement will end', '预先通知；通知期', 'Tenants must give one month\'s notice before leaving.', '租户搬走前必须提前一个月通知。']
);

manualCardPacks101150.affect.confusables[0][3] =
  'affect 通常作动词，直接接受影响的对象；effect 通常作名词，常用 have an effect on。';

manualCardPacks101150.manage.fixedPhrases[10] = [
  'manage well under pressure',
  '在压力下妥善应对',
  'Emergency nurses must manage well under pressure while making rapid decisions.',
  '急诊护士必须在快速作出决定的同时妥善应对压力。'
];

manualCardPacks101150.improve.fixedPhrases[8] = [
  'improve by ten percent',
  '提高百分之十',
  'Response times improved by ten percent after the software update.',
  '软件更新后，响应速度提高了百分之十。'
];

manualCardPacks101150.discover.fixedPhrases[8] = [
  'discover a fault',
  '发现故障',
  'A technician discovered a fault in the braking system during a routine inspection.',
  '一名技术员在例行检查中发现了制动系统故障。'
];
manualCardPacks101150.discover.fixedPhrases[10] = [
  'discover something for yourself',
  '亲自发现某事',
  'Visit the night market and discover its remarkable food scene for yourself.',
  '亲自去逛夜市，感受那里精彩的美食文化吧。'
];
manualCardPacks101150.discover.antonyms[0][3] =
  'discover 表示找到或得知原已存在的事物；overlook 表示因疏忽没有发现同一线索、细节或问题。';

manualCardPacks101150.handle.meanings.push(
  ['n.', 'the part of an object that you hold in order to open, carry, or control it', '把手；手柄；柄', 'The door handle is loose.', '门把手松了。']
);

manualCardPacks101150.achieve.fixedPhrases[8] = [
  'achieve an improvement through practice',
  '通过练习取得进步',
  'The choir achieved a clear improvement through daily practice.',
  '合唱团通过每日练习取得了明显进步。'
];
manualCardPacks101150.achieve.commonErrors[1] = [
  'The project achieved a great progress.',
  'The project made great progress.',
  'progress 是不可数名词，且通常与 make 搭配；achieve 更自然地接 goal、result、success 或 standard。'
];

manualCardPacks101150.express.synonyms[2][3] =
  'voice 常表示公开说出 concern、opinion 或 objection；express 还可通过动作、艺术或数值形式呈现内容。';
manualCardPacks101150.express.confusables[0][3] =
  'express 是把想法、情感或数值表达出来；impress 是给别人留下深刻印象，宾语和动作方向不同。';
manualCardPacks101150.encourage.synonyms[2][3] =
  'urge 语气较强，催促某人采取具体行动，常用 urge someone to do；encourage 也可温和给予信心或促进发展。';

manualCardPacks101150.depend.antonyms = [
  ['do without', 'phr.v.', '无需；没有……也能应付', 'depend on 表示需要某人或某物提供支持；do without 表示缺少同一对象仍能正常应付。']
];
manualCardPacks101150.depend.derivatives.splice(
  manualCardPacks101150.depend.derivatives.findIndex(([word]) => word === 'independent'),
  0,
  ['dependable', 'adj.', '可靠的；值得信赖的', '常形容人、服务或设备能持续按预期工作。']
);
manualCardPacks101150.prefer.confusables[0][3] =
  'prefer /prɪˈfɝ/ 表示偏爱，常用 prefer A to B；refer /rɪˈfɝ/ 表示提到、查阅或转介，常用 refer to。';

// Batch-owned relation supplements. Antonyms are scoped to one of the common
// senses documented above; they are not presented as universal opposites.
// Confusables record a concrete spelling, sound, grammar, or collocation trap
// and deliberately avoid words already used by another section on the card.
const relationSupplements101150 = {
  end: {
    antonyms: [
      ['prolong', 'v.', '延长；拖长', '只与 end an activity/process 的使其终止义相对；prolong 表示使同一活动或过程持续更久。']
    ],
    confusables: [
      ['and', 'conj.', '和；并且', 'end /ɛnd/ 是“结束”，and /ænd/ 是连接词；两词拼写和元音接近，但语法作用完全不同。'],
      ['end up', 'phr.v.', '最终处于；结果是', 'end 表示结束某事；end up 后接地点、形容词或 -ing，强调最终出现的结果，不等于主动终止。']
    ]
  },
  require: {
    antonyms: [
      ['waive', 'v.', '免除；放弃执行', '只在规则义上相对：require a fee/document 是规定必须提供，waive the fee/requirement 是正式免除同一要求。'],
      ['exempt', 'v.', '免除；豁免', '只在对人的义务上相对：require someone to comply 是要求履行，exempt someone from it 是免除该义务。'],
      ['make optional', 'v. phr.', '改为可选', '只在强制要求上相对：require 表示必须具备或完成，make optional 表示允许自行选择。']
    ],
    confusables: [
      ['inquire', 'v.', '询问；打听', 'require /rɪˈkwaɪr/ 表示需要或要求；inquire /ɪnˈkwaɪr/ 表示询问信息，拼写相近但宾语和目的不同。']
    ]
  },
  listen: {
    antonyms: [
      ['tune out', 'phr.v.', '不再听；走神', '只与主动听取信息的 listen 相对；tune out 表示注意力离开正在播放或讲述的内容。'],
      ['turn a deaf ear to', 'v. phr.', '对……置若罔闻', '只与 listen to advice/appeals 的听取义相对，turn a deaf ear to 强调有意拒绝听取。']
    ],
    confusables: []
  },
  agree: {
    antonyms: [
      ['conflict with', 'v. phr.', '与……冲突；不一致', '只与 figures/accounts agree 的相符义相对；conflict with 表示两组事实、说法或要求彼此不一致。']
    ],
    confusables: [
      ['agree with', 'phr.v.', '同意某人或观点；与……相符', 'agree with 后接人、观点或表示相符；agree to 后接提议或安排，agree on 后接共同商定的事项。']
    ]
  },
  cut: {
    antonyms: [
      ['lengthen', 'v.', '延长；加长', '只与 cut 表示缩短时间、篇幅或物体的义项相对；lengthen 表示使同一对象变长。']
    ],
    confusables: [
      ['cut out', 'phr.v.', '剪下；停止；删除', 'cut 是一般切割；cut out 可表示剪下形状、停止习惯或停止运转，不能只按 cut 的字面义理解。']
    ]
  },
  decide: {
    antonyms: [
      ['defer', 'v.', '推迟决定；延期', '只在作出决定的时间上相对：decide 是形成结论，defer 是把决定留到以后。'],
      ['leave open', 'v. phr.', '暂不决定；保留可能', '只与 decide/settle an issue 相对；leave it open 表示暂时不作结论并保留选择。']
    ],
    confusables: [
      ['divide', 'v.', '分开；除以', 'decide /dɪˈsaɪd/ 表示作决定；divide /dɪˈvaɪd/ 表示分割或做除法，拼写节奏相近但含义不同。'],
      ['decide on', 'phr.v.', '选定；决定采用', 'decide on 后接名词或 -ing 表示选定方案；decide to 后接动词原形表示决定采取动作。']
    ]
  },
  pass: {
    antonyms: [
      ['block', 'v.', '阻挡；阻止通过', '只与 pass 表示通过入口、道路或程序的义项相对；block 表示使同一路径或程序无法通过。'],
      ['keep', 'v.', '保留；不递出', '只与 pass someone an object 的传递义相对；keep 表示把同一物品留在自己手中。']
    ],
    confusables: [
      ['pass out', 'phr.v.', '昏倒；分发', 'pass 表示经过、通过或递交；pass out 可表示昏倒，也可表示逐一分发，意义由宾语决定。']
    ]
  },
  eat: {
    antonyms: [
      ['skip a meal', 'v. phr.', '不吃一餐', '只在一次用餐上相对：eat a meal 表示进餐，skip a meal 表示有意错过这一餐。'],
      ['spit out', 'phr.v.', '吐出', '只在食物进入口中的方向上相对：eat 强调吞食，spit out 表示把口中的食物吐出。']
    ],
    confusables: [
      ['ate', 'v.', 'eat 的过去式；吃了', 'eat /iːt/ 是原形，ate /eɪt/ 是不规则过去式；有明确过去时间时不能继续用 eat。']
    ]
  },
  report: {
    antonyms: [
      ['conceal', 'v.', '隐瞒；隐藏', '只与 report an incident/fact 的如实报告义相对；conceal 表示有意不让同一事实被知道。'],
      ['retract', 'v.', '撤回；收回', '只与 report/publish a claim 的公开陈述义相对；retract 表示公开收回先前报告的同一说法。'],
      ['distort', 'v.', '歪曲；曲解', '只与 report facts/findings accurately 的如实报道义相对；distort 表示选择性呈现或改写，使同一事实失真。']
    ],
    confusables: [
      ['inform', 'v.', '通知；告知', 'report 通常是 report something to someone；inform 要说 inform someone of/about something，宾语顺序不同。'],
      ['rapport', 'n.', '融洽关系；默契', 'report /rɪˈpɔːrt/ 表示报告；rapport /ræˈpɔːr/ 表示融洽关系，拼写近似但重音、开头元音和词性不同。']
    ]
  },
  suggest: {
    antonyms: [
      ['advise against', 'phr.v.', '劝阻；建议不要', '只与 suggest doing a specific action 的建议义相对；advise against 表示明确建议不要采取该行动。'],
      ['rule out', 'phr.v.', '排除……的可能', '只与 evidence suggests a possibility 的暗示义相对；rule out 表示证据排除了同一可能。'],
      ['contradict', 'v.', '与……矛盾；反驳', '只与数据 suggest a conclusion 的证据义相对；contradict 表示数据与该结论直接不符。']
    ],
    confusables: [
      ['suppose', 'v.', '假定；认为', 'suggest 表示提出建议或由证据暗示；suppose 表示暂时假定某事为真，不能接宾语表示“建议某人”。']
    ]
  },
  sell: {
    antonyms: [
      ['withdraw from sale', 'v. phr.', '撤回出售；停止销售', '只与 offer/sell an item 的在售义相对；withdraw from sale 表示决定不再出售同一物品。'],
      ['retain ownership of', 'v. phr.', '保留……的所有权', '只与 sell an asset 的所有权转移义相对；retain ownership of 表示继续拥有同一资产而不转让。']
    ],
    confusables: [
      ['sail', 'v. / n.', '航行；帆', 'sell /sɛl/ 表示出售；sail /seɪl/ 表示航行或帆，拼写相近但元音和含义不同。']
    ]
  },
  support: {
    antonyms: [
      ['abandon', 'v.', '放弃支持；抛弃', '只与 support a person/cause 的持续帮助义相对；abandon 表示停止帮助并离开同一对象。']
    ],
    confusables: [
      ['sport', 'n. / v.', '运动；炫耀地穿戴', 'support /səˈpɔːrt/ 表示支持或支撑；sport /spɔːrt/ 表示运动，拼写相近但音节数和含义不同。']
    ]
  },
  receive: {
    antonyms: [
      ['refuse', 'v.', '拒收；拒绝接受', '只在接收所提供事物的义项上相对：receive 表示收下，refuse 表示明确不收。'],
      ['return', 'v.', '退回；归还', '只在物品流转上相对：receive 表示物品到手，return 表示把该物品送回来源处。']
    ],
    confusables: [
      ['deceive', 'v.', '欺骗', 'receive /rɪˈsiːv/ 表示收到；deceive /dɪˈsiːv/ 表示欺骗，两词结尾相同但前缀和含义不同。'],
      ['retrieve', 'v.', '取回；检索', 'receive 表示从别人处收到，retrieve 表示主动找回或从系统检索；拼写相近但动作来源不同。']
    ]
  },
  base: {
    antonyms: [
      ['disregard', 'v.', '不考虑；忽视', '只与 base a decision on evidence 的依据义相对；disregard 表示作决定时不考虑同一证据。'],
      ['relocate', 'v.', '迁走；另设地点', '只与 base staff/operations at a place 的驻地义相对；relocate 表示把人员或业务迁离该地点。'],
      ['leave unsupported', 'v. phr.', '不给依据；使缺乏支撑', '只与 base a claim on evidence 的依据义相对；leave unsupported 表示没有为同一主张提供证据基础。']
    ],
    confusables: [
      ['bias', 'v. / n.', '使有偏见；偏见', 'base /beɪs/ 表示以……为依据；bias /ˈbaɪəs/ 表示使判断偏向一方，拼写相近但发音和作用不同。']
    ]
  },
  pick: {
    antonyms: [
      ['reject', 'v.', '拒绝选用；淘汰', '只与 pick/select a candidate or option 的选择义相对；reject 表示明确不选同一候选项。'],
      ['put down', 'phr.v.', '放下', '只与 pick up 表示拿起的义项相对；put down 表示把同一物体从手中放回表面。'],
      ['lock', 'v.', '锁上；使无法开启', '只与 pick a lock 表示无钥匙开锁的义项相对；lock 表示把同一扇门或锁具重新锁住。']
    ],
    confusables: [
      ['pick out', 'phr.v.', '挑出；辨认出', 'pick 可泛指选择或采摘；pick out 强调从一组中挑出或在人群中辨认，不能省略 out 后保持所有义项。']
    ]
  },
  drive: {
    antonyms: [
      ['park', 'v.', '停车；停放', '只与 drive a vehicle 的行驶义相对；park 表示把同一车辆停稳并结束行驶。'],
      ['dissuade', 'v.', '劝阻；使打消念头', '只与 drive someone to act 的驱使义相对；dissuade 表示劝说同一个人不要采取该行动。'],
      ['halt', 'v.', '使停止；停下', '只与 drive a machine/process forward 的推动义相对；halt 表示使该运行或进程停止。']
    ],
    confusables: [
      ['dive', 'v. / n.', '潜水；俯冲', 'drive /draɪv/ 表示驾驶或推动；dive /daɪv/ 表示潜入或俯冲，拼写接近但辅音和含义不同。']
    ]
  },
  reach: {
    antonyms: [
      ['fall short of', 'phr.v.', '未达到', '只与 reach a goal/standard 的达到义相对；fall short of 表示结果低于同一目标或标准。'],
      ['lose contact with', 'v. phr.', '与……失去联系', '只与 reach/contact someone 的联系义相对；lose contact with 表示沟通渠道中断。']
    ],
    confusables: [
      ['teach', 'v.', '教授；教会', 'reach /riːtʃ/ 表示到达或够到；teach /tiːtʃ/ 表示教授，拼写只差首字母但主语和动作不同。']
    ]
  },
  remain: {
    antonyms: [
      ['disappear', 'v.', '消失；不再存在', '只与 something remains 的剩余义相对；disappear 表示该对象不再留存或可见。']
    ],
    confusables: [
      ['retain', 'v.', '保留；保持', 'remain 通常不及物，表示某物继续处于状态；retain 是及物动词，后面直接接被保留的对象。']
    ]
  },
  explain: {
    antonyms: [
      ['confuse', 'v.', '使困惑；混淆', '只与 explain an idea clearly 的说明义相对；confuse 表示让同一概念更难理解。'],
      ['mislead', 'v.', '误导；使产生错误理解', '只与 explain something accurately 的说明义相对；mislead 表示让听者对同一事实形成错误理解。']
    ],
    confusables: [
      ['exclaim', 'v.', '惊呼；大声说', 'explain /ɪkˈspleɪn/ 表示解释；exclaim /ɪkˈskleɪm/ 表示惊呼，拼写相近但辅音群和说话目的不同。']
    ]
  },
  hit: {
    antonyms: [
      ['dodge', 'v.', '躲开；闪避', '只在击打或投射的互动中相对：hit 表示击中，dodge 表示及时移动以免被击中。'],
      ['spare', 'v.', '使免受；未波及', '只与 a disaster hits an area 的波及义相对；spare 表示灾害没有伤及同一地区或人。']
    ],
    confusables: [
      ['heat', 'n. / v.', '热；加热', 'hit /hɪt/ 表示击中，heat /hiːt/ 表示热或加热；拼写相近但元音长短和含义不同。']
    ]
  },
  pull: {
    antonyms: [
      ['release', 'v.', '松开；释放', '只与 pull/hold something under tension 的拉紧义相对；release 表示解除同一拉力或控制。'],
      ['repel', 'v.', '排斥；推开', '只与 pull 表示吸引物体或人群的义项相对；repel 表示产生相反方向的排斥。']
    ],
    confusables: [
      ['pool', 'n. / v.', '水池；汇集', 'pull /pʊl/ 表示拉，pool /puːl/ 表示水池或汇集；拼写接近但元音长度和含义不同。'],
      ['pull over', 'phr.v.', '靠边停车', 'pull 表示拉动；pull over 在驾驶语境表示靠边停车，不能按“把某物拉过来”逐词理解。']
    ]
  },
  raise: {
    antonyms: [
      ['cut', 'v.', '削减；降低', '只与 raise a price/salary/limit 的提高义相对；cut 表示削减同一数值或额度。'],
      ['drop', 'v.', '放下；不再提出', '只与 raise a hand/subject 的举起或提出义相对；drop 表示放下手或停止讨论该事项。']
    ],
    confusables: [
      ['raze', 'v.', '夷平；彻底摧毁', 'raise 和 raze 都读 /reɪz/；raise 表示抬高或增加，raze 表示把建筑彻底拆平。']
    ]
  },
  wear: {
    antonyms: [
      ['conceal', 'v.', '掩饰；隐藏', '只与 wear/display an expression 的显露义相对；conceal 表示不让同一感情或态度显现出来。'],
      ['preserve', 'v.', '保护；使免于磨损', '只与 use wears something down/out 的磨损义相对；preserve 表示避免同一物品损耗。']
    ],
    confusables: [
      ['ware', 'n.', '制品；器皿', 'wear、where 和 ware 都读 /wɛr/；ware 是“制品、器皿”，通常出现在 software、tableware 等词中。']
    ]
  },
  return: {
    antonyms: [
      ['ignore', 'v.', '不回应；置之不理', '只与 return a call/message 的回应义相对；ignore 表示收到同一联系后不作回应。']
    ],
    confusables: [
      ['refund', 'v. / n.', '退款；退还款项', 'return an item 表示把商品退回；refund the customer/the payment 表示退还钱款，不能说 refund the item 来表示退货。']
    ]
  },
  choose: {
    antonyms: [
      ['reject', 'v.', '拒绝选择；淘汰', '只与 choose an option/candidate 的选定义相对；reject 表示明确排除同一选项。'],
      ['be assigned', 'v. phr.', '被分配；由别人指定', '只与 choose a role/task 的自主选择义相对；be assigned 表示该角色或任务由别人决定。'],
      ['leave undecided', 'v. phr.', '暂不决定', '只与 choose between alternatives 的决策义相对；leave undecided 表示暂时不作选择。']
    ],
    confusables: [
      ['chews', 'v.', '咀嚼（第三人称单数）', 'choose /tʃuːz/ 与 chews /tʃuːz/ 同音；choose 表示选择，chews 是 chew 的第三人称单数。']
    ]
  },
  cause: {
    antonyms: [
      ['counteract', 'v.', '抵消；对抗影响', '只与 cause an effect/change 的致使义相对；counteract 表示施加相反作用以抵消同一影响。'],
      ['undo', 'v.', '消除影响；撤销', '只与 cause a change/damage 的结果义相对；undo 表示撤销或消除已经造成的同一变化。']
    ],
    confusables: [
      ['course', 'n. / v.', '课程；路线；流动', 'cause /kɔːz/ 表示原因或导致；course /kɔːrs/ 表示课程或路线，拼写和读音接近但含义不同。']
    ]
  },
  join: {
    antonyms: [
      ['exclude', 'v.', '排除；不准加入', '只与 join/admit someone to a group 的成员义相对；exclude 表示不让同一人进入该群体。']
    ],
    confusables: [
      ['join in', 'phr.v.', '参加；加入活动', 'join 可直接接 group/person；join in 通常接 activity 或单独使用，不能说 join in the club 表示成为会员。']
    ]
  },
  develop: {
    antonyms: [
      ['recover from', 'v. phr.', '从……恢复', '只与 develop an illness/problem 的逐渐患上义相对；recover from 表示从同一疾病或问题中恢复。']
    ],
    confusables: [
      ['devise', 'v.', '设计；想出', 'develop 表示逐步完善产品、能力或计划；devise 强调先构思出一个新方法或方案。'],
      ['envelop', 'v.', '包住；笼罩', 'develop /dɪˈvɛləp/ 表示发展；envelop /ɪnˈvɛləp/ 表示包住，拼写尾部相近但前缀和含义不同。']
    ]
  },
  share: {
    antonyms: [
      ['bear sole responsibility for', 'v. phr.', '独自承担全部责任', '只与 share responsibility for a task 的共同承担义相对；bear sole responsibility for 表示责任完全由一方承担。']
    ],
    confusables: [
      ['chair', 'n. / v.', '椅子；主持', 'share /ʃɛr/ 与 chair /tʃɛr/ 只差起始辅音；share 表示分享，chair 表示椅子或主持会议。']
    ]
  },
  realize: {
    antonyms: [
      ['overlook', 'v.', '未注意到；忽略', '只与 realize a fact 的意识到义相对；overlook 表示没有察觉同一事实。'],
      ['abandon', 'v.', '放弃；不再实现', '只与 realize a plan/dream 的实现义相对；abandon 表示在实现前放弃同一计划。'],
      ['forfeit', 'v.', '丧失；放弃收益', '只与 realize a gain/value 的变现义相对；forfeit 表示因放弃或违规而失去该收益。']
    ],
    confusables: [
      ['release', 'v.', '释放；发布', 'realize /ˈriːəlaɪz/ 表示意识到或实现；release /rɪˈliːs/ 表示释放或发布，拼写节奏相近但含义不同。']
    ]
  },
  describe: {
    antonyms: [
      ['conceal', 'v.', '隐瞒；不描述', '只与 describe details openly 的说明义相对；conceal 表示有意不让这些细节被知道。'],
      ['omit', 'v.', '省略；漏掉', '只与 describe/include a feature 的列举义相对；omit 表示描述时不提同一特征。'],
      ['misrepresent', 'v.', '歪曲；不实描述', '只与 describe something accurately 的准确描写义相对；misrepresent 表示给出误导性描写。']
    ],
    confusables: [
      ['ascribe', 'v.', '把……归因于；认为属于', 'describe 表示说明事物特征；ascribe 常用 ascribe something to a cause，表示归因或归属。']
    ]
  },
  increase: {
    antonyms: [
      ['cap', 'v.', '限制上限；封顶', '只与 increase a price/output without limit 的增长义相对；cap 表示给同一数值设定最高限度。']
    ],
    confusables: [
      ['increase by', 'v. phr.', '增加了某个差额', 'increase by 后接变化量；increase to 后接最终数值，例如 increase by ten 与 increase to ten 含义不同。']
    ]
  },
  protect: {
    antonyms: [
      ['abandon', 'v.', '弃置；停止保护', '只与 protect a person/place 的持续防护义相对；abandon 表示撤去照顾并让同一对象独自面对风险。']
    ],
    confusables: [
      ['protest', 'v. / n.', '抗议；反对', 'protect /prəˈtɛkt/ 表示保护，protest /prəˈtɛst/ 表示抗议；拼写相近但末尾辅音和含义不同。']
    ]
  },
  compare: {
    antonyms: [
      ['differ from', 'phr.v.', '与……不同', '只与 compare A to B 表示认为相似的义项相对；differ from 强调两者存在差异。'],
      ['judge in isolation', 'v. phr.', '孤立地判断', '只与 compare alternatives side by side 的比较方法相对；judge in isolation 表示不借助参照物单独判断。'],
      ['fall short of', 'phr.v.', '比不上；未达到', '只与 something compares with a standard 表示可媲美的义项相对；fall short of 表示达不到该标准。']
    ],
    confusables: [
      ['comprise', 'v.', '包括；由……组成', 'compare /kəmˈpɛr/ 表示比较，comprise /kəmˈpraɪz/ 表示包括；拼写开头相近但发音、宾语关系和含义不同。']
    ]
  },
  reduce: {
    antonyms: [
      ['restore', 'v.', '恢复；补回', '只与 reduce a level/amount 的降低义相对；restore 表示把同一数值或供应恢复到原水平。']
    ],
    confusables: [
      ['deduce', 'v.', '推断；演绎', 'reduce /rɪˈduːs/ 表示减少，deduce /dɪˈduːs/ 表示推断；拼写结尾相同但前缀和思维动作不同。']
    ]
  },
  accept: {
    antonyms: [
      ['deny', 'v.', '否认；拒绝承认', '只与 accept a fact/responsibility 的承认义相对；deny 表示声称同一事实不真实或拒绝承担责任。']
    ],
    confusables: [
      ['expect', 'v.', '预期；期待', 'accept /əkˈsɛpt/ 表示接受，expect /ɪkˈspɛkt/ 表示预期；与 except 构成常见拼写混淆组。']
    ]
  },
  prepare: {
    antonyms: [
      ['neglect', 'v.', '疏于准备；忽视', '只与 prepare for a known task 的事先准备义相对；neglect 表示该做准备却没有做。'],
      ['improvise', 'v.', '临时应变；即兴处理', '只在做事方式上对比：prepare 是预先安排，improvise 是没有充分准备时临场处理。'],
      ['go in cold', 'v. phr.', '毫无准备地开始', '只与 prepare beforehand 的事先准备义相对；go in cold 表示没有预演或资料便直接开始。']
    ],
    confusables: [
      ['prepare for', 'phr.v.', '为……做准备', 'prepare for 后接将发生的事件；prepare something 表示把某物准备好，不能在直接宾语前一律加 for。']
    ]
  },
  avoid: {
    antonyms: [
      ['embrace', 'v.', '欣然接受；主动面对', '只与 avoid a change/opportunity 的回避义相对；embrace 表示主动接受并投入同一变化或机会。']
    ],
    confusables: [
      ['void', 'v. / adj. / n.', '使无效；无效的；空缺', 'avoid /əˈvɔɪd/ 表示避开，void /vɔɪd/ 表示使无效或空缺；avoid 多一个起始音节且含义不同。']
    ]
  },
  notice: {
    antonyms: [
      ['ignore', 'v.', '不理会；忽视', '只与 notice/pay attention to something 的留意义相对；ignore 表示即使察觉也选择不理会。'],
      ['concealment', 'n.', '隐瞒；保密', '只与 notice 作名词表示公开告示或预先通知的义项相对；notice 让信息公开可见，concealment 则有意不公开。']
    ],
    confusables: [
      ['notion', 'n.', '概念；看法', 'notice /ˈnoʊtɪs/ 表示注意或通知，notion /ˈnoʊʃən/ 表示概念；拼写开头相近但后半发音和词性不同。']
    ]
  },
  affect: {
    antonyms: [
      ['leave unchanged', 'v. phr.', '不产生改变', '只与 affect 表示改变结果或状态的义项相对；leave unchanged 表示同一对象没有受到改变。'],
      ['spare', 'v.', '使免受；未波及', '只与 an event affects a group 的波及义相对；spare 表示事件没有影响同一群体。'],
      ['resist', 'v.', '抵抗；不受影响', '只与 an influence affects behavior/results 的作用义相对；resist 表示同一对象抵抗该影响而不随之改变。']
    ],
    confusables: [
      ['infect', 'v.', '感染；传染', 'affect /əˈfɛkt/ 表示影响，infect /ɪnˈfɛkt/ 表示感染；拼写结尾相同但 infect 只用于病原体等传播。']
    ]
  },
  manage: {
    antonyms: [
      ['fail', 'v.', '未能做到；失败', '只与 manage to do 表示设法成功的义项相对；fail to do 明确表示没有完成同一动作。'],
      ['lose control of', 'v. phr.', '失去对……的控制', '只与 manage a team/process 的管理义相对；lose control of 表示无法继续控制同一对象。'],
      ['be overwhelmed by', 'v. phr.', '被……压垮；无力应付', '只与 manage a workload/crisis 的应付义相对；be overwhelmed by 表示工作量或危机超出应对能力。']
    ],
    confusables: [
      ['try', 'v.', '尝试；努力', 'try to do 只说明付出努力，manage to do 明确表示最终成功；结果未知时不能用 manage 代替 try。'],
      ['maintain', 'v.', '维持；保养；坚持声称', 'manage 表示管理人员、资源或应付任务；maintain 表示让状态持续或保养设备，常见中文译法相近但宾语不同。']
    ]
  },
  improve: {
    antonyms: [
      ['erase previous gains', 'v. phr.', '抹去先前进步；使成果丧失', '只与 improve over time 所积累的进步义相对；erase previous gains 表示一次倒退使先前改善成果消失。']
    ],
    confusables: [
      ['approve', 'v.', '批准；赞成', 'improve /ɪmˈpruːv/ 表示改善，approve /əˈpruːv/ 表示批准或赞成；拼写结尾相近但宾语不同。']
    ]
  },
  discover: {
    antonyms: [
      ['conceal', 'v.', '隐藏；隐瞒', '只与 discover/uncover information 的发现义相对；conceal 表示使同一信息不被发现。'],
      ['lose', 'v.', '丢失；失去踪迹', '只与 discover/find a missing object 的找到义相对；lose 表示不再知道该物体所在。']
    ],
    confusables: [
      ['recover', 'v.', '找回；恢复', 'discover 表示首次发现或得知；recover 表示重新找回曾拥有的东西或从不良状态恢复。']
    ]
  },
  handle: {
    antonyms: [
      ['avoid', 'v.', '回避；不处理', '只与 handle a problem/request 的处理义相对；avoid 表示不去面对或处理同一事项。'],
      ['drop', 'v.', '失手掉落；放下', '只与 handle/hold an object securely 的拿持义相对；drop 表示物体脱手落下。']
    ],
    confusables: [
      ['hand', 'n. / v.', '手；递交', 'handle 可作名词表示把手，也可作动词表示处理；hand 主要指手或亲手递交，不能表示处理问题。'],
      ['candle', 'n.', '蜡烛', 'handle /ˈhændəl/ 表示处理或把手，candle /ˈkændəl/ 表示蜡烛；两词只差起始辅音，词性和含义不同。']
    ]
  },
  achieve: {
    antonyms: [
      ['fall short of', 'phr.v.', '未达到；不符合', '只与 achieve a target/standard 的达到义相对；fall short of 表示结果低于同一目标或标准。'],
      ['abandon', 'v.', '放弃；中止追求', '只与 achieve a goal through effort 的结果义相对；abandon 表示在达成前停止追求同一目标。']
    ],
    confusables: [
      ['acquire', 'v.', '获得；习得', 'achieve 表示通过努力达到目标或结果；acquire 表示获得物品、公司、知识或技能，宾语范围不同。'],
      ['receive', 'v.', '收到；接收', 'achieve 表示通过努力取得结果；receive 表示从别人或系统处收到事物，两词都有 ie/ei 拼写但宾语来源不同。']
    ]
  },
  express: {
    antonyms: [
      ['misrepresent', 'v.', '歪曲表达；失实表示', '只与 express an idea/quantity accurately 的准确表示义相对；misrepresent 表示用错误形式呈现同一内容。']
    ],
    confusables: [
      ['explain', 'v.', '解释；说明原因', 'express 强调把想法或感情呈现出来；explain 强调让原因、概念或过程变得容易理解。']
    ]
  },
  encourage: {
    antonyms: [
      ['sap motivation', 'v. phr.', '削弱动力', '只与 encourage someone to act 的激励义相对；sap motivation 表示逐渐削弱同一个人的行动动力。'],
      ['inhibit', 'v.', '抑制；阻碍发展', '只与 encourage growth/participation 的促进义相对；inhibit 表示限制同一发展或参与。']
    ],
    confusables: [
      ['enable', 'v.', '使能够；使成为可能', 'encourage 是给予信心或促进意愿；enable 是提供实际能力或条件，某人有意愿但仍可能未被 enable。']
    ]
  },
  depend: {
    antonyms: [
      ['be settled', 'v. phr.', '已经确定；不再悬而未决', '只与 it depends 表示答案仍随条件而变化的用法相对；be settled 表示结果已经确定，不再等待条件决定。'],
      ['be unaffected by', 'v. phr.', '不受……影响', '只与 an outcome depends on a factor 的取决义相对；be unaffected by 表示该因素不会改变结果。']
    ],
    confusables: [
      ['defend', 'v.', '保卫；辩护', 'depend /dɪˈpɛnd/ 表示依赖或取决于，defend /dɪˈfɛnd/ 表示保卫或辩护；拼写节奏相近但动作不同。'],
      ['deepen', 'v.', '加深；深化', 'depend /dɪˈpɛnd/ 表示依靠，deepen /ˈdiːpən/ 表示使更深；字母组合相近但重音和语法结构不同。']
    ]
  },
  prefer: {
    antonyms: [
      ['reject', 'v.', '拒绝选用', '只与 prefer/choose a particular option 的选择义相对；reject 表示明确排除同一选项。'],
      ['dislike', 'v.', '不喜欢；反感', '只与 prefer/like a particular option 的偏好义相对；dislike 表示对同一选项持负面态度。'],
      ['be indifferent to', 'v. phr.', '对……无偏好', '只与 prefer one option over another 的比较偏好义相对；be indifferent to 表示两者对自己没有差别。']
    ],
    confusables: [
      ['defer', 'v.', '推迟；听从', 'prefer /prɪˈfɝ/ 表示偏爱，defer /dɪˈfɝ/ 表示推迟或听从；两词结尾发音相近但搭配不同。']
    ]
  },
  solve: {
    antonyms: [
      ['create', 'v.', '制造；产生', '只与 solve a problem 的解决义相对；create a problem 表示使原本不存在的同类问题产生。'],
      ['leave unresolved', 'v. phr.', '使仍未解决', '只与 solve an issue/case 的完成义相对；leave unresolved 表示问题经过处理后仍没有答案。']
    ],
    confusables: [
      ['evolve', 'v.', '逐渐发展；演变', 'solve /sɑːlv/ 表示解决问题，evolve /ɪˈvɑːlv/ 表示逐渐发展；两词结尾相近但动作过程和宾语不同。']
    ]
  }
};

for (const [headword, supplements] of Object.entries(relationSupplements101150)) {
  manualCardPacks101150[headword].antonyms.push(...supplements.antonyms);
  manualCardPacks101150[headword].confusables.push(...supplements.confusables);
}

// A relation note must state the usable boundary against the headword, not
// merely define the neighboring word. These are individually reviewed rather
// than produced by the minimum-length fallback below.
manualCardPacks101150.listen.synonyms[4][3] =
  'attend to 较正式，可指专心听取，也可表示处理或照料；listen 只聚焦主动听声音或话语。';
manualCardPacks101150.agree.synonyms[0][3] =
  'consent 较正式，强调对请求或安排给予许可，常用 consent to；agree 还可表示观点一致或资料相符。';
manualCardPacks101150.agree.synonyms[2][3] =
  'concur 是正式的“意见一致”，常用 concur with；agree 语体更中性，也能用于答应请求或商定安排。';
manualCardPacks101150.agree.synonyms[3][3] =
  'be of the same mind 强调多人持相同看法；agree 更简洁，还可用 agree to 接受安排或 agree on 商定事项。';
manualCardPacks101150.decide.antonyms[0][3] =
  'decide 表示考虑后形成选择；hesitate 表示迟疑、暂未作出决定，只在决策过程上构成对照。';
manualCardPacks101150.pass.synonyms[1][3] =
  'clear 可指顺利通过检查、障碍或关卡；pass 除此义外还可递交物品、通过考试或表示时间流逝。';
manualCardPacks101150.eat.synonyms[1][3] =
  'have 在口语中常与 meal、breakfast 等搭配，强调吃一顿饭；eat 可直接接任何具体食物或单纯表示进食。';
manualCardPacks101150.support.antonyms[0][3] =
  'support 在观点、提案或候选人义上表示支持；oppose 表示明确反对同一对象，不适用于 support 的承重义。';
manualCardPacks101150.base.synonyms[0][3] =
  'ground 常用 be grounded in，强调证据或原则提供根基；base 更常用 base A on B，也能表示把业务设在某地。';
manualCardPacks101150.base.synonyms[3][3] =
  'situate 较正式，常用 be situated in 描述物理位置；base 还强调人员或组织从该地运营。';
manualCardPacks101150.base.synonyms[4][3] =
  'root 常用 be rooted in 说明历史、文化或原因上的深层根源；base 可指当下决策的直接依据。';
manualCardPacks101150.explain.synonyms[3][3] =
  'account for 专门说明某事为何发生或某数量如何构成；explain 还可说明概念、规则和操作过程。';
manualCardPacks101150.hit.synonyms[2][3] =
  'collide 通常是不及物动词，要用 collide with 表示两个移动体相撞；hit 可直接接被击中或被撞的对象。';
manualCardPacks101150.increase.synonyms[2][3] =
  'heighten 常及物接 awareness、tension、risk 或 emotion，强调程度增强；increase 可及物或不及物，并常接可计量的数量。';
manualCardPacks101150.compare.synonyms[0][3] =
  'juxtapose 较正式，强调把事物并置以显出差异或联系；compare 不要求物理并置，也可一般分析异同。';
manualCardPacks101150.reduce.synonyms[0][3] =
  'curtail 较正式，常指削减 spending、activity 或 freedom，带有限制含义；reduce 语气中性，也可减小尺寸或数值。';
manualCardPacks101150.notice.synonyms[4][3] =
  'register 表示某事进入意识，尤常用于迟缓或否定的觉察；notice 更日常，可指直接看到、听到或留意。';
manualCardPacks101150.manage.synonyms[4][3] =
  'cope 是不及物动词，常用 cope with 表示在困难处境中应付；manage 可直接接项目、团队或工作量，还可用 manage to do。';
manualCardPacks101150.depend.synonyms[4][3] =
  'rest on 较正式，常指决定、论证或成败以某个关键因素为基础；depend on 也可表示人在生活上依赖支持。';
manualCardPacks101150.solve.synonyms[2][3] =
  'answer 通常接 question，可只给出回答；solve 强调找到完整办法或答案，可接 problem、equation、crime 或 puzzle。';
manualCardPacks101150.protect.antonyms[1][3] =
  'protect 表示使人或物免受危险；expose 表示使同一对象失去遮护并接触风险，只在防护义项上相对。';

for (const [headword, pack] of Object.entries(manualCardPacks101150)) {
  const targetBoundary = reviewedTargetBoundaryByHeadword[headword];
  for (const field of ['synonyms', 'antonyms', 'confusables']) {
    const minimumLength = field === 'synonyms' ? 20 : 16;
    pack[field] = pack[field].map(([word, partOfSpeech, chinese, note], index) => [
      word,
      partOfSpeech,
      chinese,
      note.trim().length >= minimumLength
        ? note
        : `${note.replace(/[。；]+$/, '')}；${
          field === 'synonyms'
            ? reviewedSynonymBoundaryByHeadword[headword]?.[index] ?? targetBoundary
            : field === 'antonyms'
              ? reviewedAntonymBoundaryByHeadword[headword]?.[index] ?? targetBoundary
              : targetBoundary
        }`
    ]);
  }
}

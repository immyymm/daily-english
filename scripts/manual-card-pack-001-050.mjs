// Final batch-owned entry point for learning-priority sequences 1-50.
// `work` is the locked reference card and is intentionally not overridden.
import {
  manualSemanticPacks001050,
  manualPackWords001050,
} from "./manual-semantic-packs-001-050.mjs";

const supplements = {
  be: {
    fixedPhrases: [
      ["be about to do something", "正要做某事", "I was about to call you when you arrived.", "你到的时候，我正要给你打电话。"],
      ["be to blame for something", "是造成某事的原因；应对某事负责", "Poor maintenance was to blame for the failure.", "维护不当是这次故障的原因。"],
    ],
    contexts: [
      [["be the person responsible", "是负责人"]],
      [["be in excellent condition", "状况极佳"]],
      [["be within easy reach", "在容易到达的范围内"]],
      [["be scheduled for Monday", "安排在星期一"], ["be open until midnight", "营业至午夜"]],
    ],
    synonyms: [["serve as", "phr.", "担任；用作", "只对应 be 表示身份或用途的义项，强调承担某角色或发挥某作用。"]],
  },
  have: {
    fixedPhrases: [
      ["have difficulty doing something", "做某事有困难", "Many learners have difficulty hearing the difference.", "许多学习者很难听出这个区别。"],
      ["have something done", "请人做某事；使某事被做", "We had the roof repaired last month.", "我们上个月请人修了屋顶。"],
    ],
    contexts: [
      [["have legal ownership of the land", "合法拥有这块土地"]],
      [["have a bad cold", "患重感冒"]],
      [["have dinner with clients", "与客户共进晚餐"]],
      [["have not finished yet", "尚未完成"]],
    ],
    synonyms: [["experience", "v.", "经历；感受", "只对应 have 表示经历事件或感受的义项，不能表示所有权、进餐或构成完成时。"]],
  },
  do: {
    fixedPhrases: [
      ["do your best", "尽最大努力", "Just do your best and ask for help when needed.", "尽最大努力，需要时就求助。"],
      ["do business with someone", "与某人做生意", "We have done business with this supplier for years.", "我们与这家供应商做生意已有多年。"],
    ],
    contexts: [
      [["do research on sleep", "研究睡眠"]],
      [["do a degree in biology", "攻读生物学学位"]],
      [["do considerable damage", "造成相当大的损害"]],
      [["do tell me what happened", "务必告诉我发生了什么"]],
    ],
    synonyms: [["undertake", "v.", "承担；着手进行", "比 do 正式，强调接受并着手完成责任、项目或研究。"]],
  },
  say: {
    fixedPhrases: [
      ["say for certain", "肯定地说", "I cannot say for certain when the road will reopen.", "我无法肯定地说道路何时会重新开放。"],
      ["say something to someone's face", "当着某人的面直说", "If you disagree, say it to my face.", "如果你不同意，就当面告诉我。"],
    ],
    contexts: [
      [["say that the plan has changed", "说计划已经改变"]],
      [["say something firmly", "坚定地说某事"]],
      [["the instructions say to wait", "说明书写着要等待"]],
      [["say sorry for the mistake", "为错误道歉"]],
    ],
    synonyms: [["declare", "v.", "宣布；声明", "比 say 正式且公开，常用于权威地宣布立场、结果或状态。"]],
  },
  go: {
    fixedPhrases: [
      ["go through something", "经历；仔细检查某事", "We went through every item on the checklist.", "我们逐项检查了清单上的所有内容。"],
      ["go with something", "与某物相配；选择某物", "This blue tie goes well with your jacket.", "这条蓝领带与你的夹克很相配。"],
    ],
    contexts: [
      [["go down the stairs", "下楼梯"]],
      [["go skiing in winter", "冬天去滑雪"]],
      [["go exactly as expected", "完全按预期进行"]],
      [["go silent without warning", "毫无预兆地沉默下来"]],
    ],
    synonyms: [["head", "v.", "朝……前进", "只对应 go 的定向移动义，通常要说明方向或目的地，不表示进展或状态变化。"]],
  },
  get: {
    fixedPhrases: [
      ["get rid of something", "摆脱；除掉某物", "We need to get rid of these outdated files.", "我们需要删除这些过时文件。"],
      ["get in touch with someone", "与某人取得联系", "Please get in touch with me after the meeting.", "会后请与我联系。"],
    ],
    contexts: [
      [["get a ticket for the concert", "买到音乐会门票"]],
      [["get nervous before interviews", "面试前变得紧张"]],
      [["get here before nine", "九点前到这里"]],
      [["get the reference immediately", "立刻听懂这个典故"]],
    ],
    synonyms: [["fetch", "v.", "去取来", "表示去某处取得东西后带回来；get 还可表示收到、变得、到达和理解。"]],
  },
  can: {
    fixedPhrases: [
      ["cannot help doing something", "忍不住做某事", "I cannot help smiling when I hear that song.", "听到那首歌时我忍不住微笑。"],
      ["cannot be too careful", "再小心也不为过", "You cannot be too careful with personal data.", "处理个人数据时再小心也不为过。"],
    ],
    contexts: [
      [["can distinguish subtle colors", "能分辨细微的颜色差异"]],
      [["can lead to delays", "可能导致延误"]],
      [["can employees work remotely", "员工可以远程工作吗"]],
      [["can I get you some water", "我给你拿点水好吗"]],
    ],
    synonyms: [["manage to", "phr.", "设法做到", "强调在困难中成功完成一次具体行动；can 表示一般能力或可能性。"]],
  },
  know: {
    fixedPhrases: [
      ["know something by heart", "熟记某事", "She knows the poem by heart.", "她能背诵这首诗。"],
      ["know your way around something", "熟悉某处或某系统的门道", "He knows his way around the editing software.", "他很熟悉这款编辑软件。"],
    ],
    contexts: [
      [["know which route is shorter", "知道哪条路线更短"]],
      [["know the local customs", "熟悉当地习俗"]],
      [["know how to repair bicycles", "会修自行车"]],
      [["know at once that she was joking", "立刻知道她在开玩笑"]],
    ],
    synonyms: [["comprehend", "v.", "理解；领会", "比 understand 更正式，强调充分把握复杂意义；不表示认识某人或熟悉某地。"]],
  },
  will: {
    fixedPhrases: [
      ["will come in handy", "将会派上用场", "Keep the receipt; it will come in handy if you return the item.", "留好收据；退货时会用得上。"],
      ["will do", "可以；够用", "A simple email will do for confirmation.", "一封简单的电子邮件就足以确认。"],
    ],
    contexts: [
      [["will likely cost more", "很可能会花费更多"]],
      [["will handle the booking", "会去处理预订"]],
      [["will stand by the agreement", "会遵守协议"]],
      [["metal will expand when heated", "金属受热会膨胀"]],
    ],
    synonyms: [["be set to", "phr.", "预计将；即将", "多用于已有安排或迹象明确的将来事件；will 还可表达临时决定和意愿。"]],
  },
  would: {
    fixedPhrases: [
      ["would like to do something", "想要做某事（礼貌）", "I would like to speak to the manager.", "我想和经理谈谈。"],
      ["would rather do something", "宁愿做某事", "I would rather take the train than drive.", "我宁愿坐火车也不开车。"],
    ],
    contexts: [
      [["would save us considerable time", "会为我们节省大量时间"]],
      [["would you wait outside", "请你在外面等好吗"]],
      [["would welcome your advice", "很愿意听取你的建议"]],
      [["promised that he would return", "承诺过他会回来"]],
    ],
    synonyms: [["might", "modal v.", "可能会", "在假设结果中 might 强调可能性较低；would 更常表示条件满足后预期发生的结果。"]],
  },
};

const repairCard = (word, card) => {
  const extra = supplements[word];
  let meanings = card.meanings;
  const meaningRepairs = {
    have: [
      ...card.meanings,
      ["semi-modal v.", "used with to to say that something is necessary or required", "必须；不得不", "We have to leave before the last train.", "我们必须在末班车开出前离开。"],
    ],
    say: [
      ...card.meanings,
      ["n.", "the right or opportunity to influence a decision", "发言权；决定权", "Everyone on the team should have a say in the final decision.", "团队里的每个人都应对最终决定有发言权。"],
    ],
    go: [
      ...card.meanings,
      ["n.", "an attempt or a turn at doing something", "尝试；轮到的机会", "It is your go, so roll the dice.", "轮到你了，掷骰子吧。"],
    ],
    can: [
      ...card.meanings,
      ["n.", "a metal container used for food, drink, or other products", "罐；罐头", "She opened a can of tomatoes for the sauce.", "她打开了一罐番茄来做酱汁。"],
      ["v.", "to preserve food by sealing it in cans", "把食品装罐保存", "They can peaches at the end of every summer.", "他们每年夏末都把桃子装罐保存。"],
    ],
    use: [
      card.meanings[0],
      ["n.", "the act, purpose, or ability of using something", "使用；用途；使用权", "This tool has several practical uses.", "这个工具有几种实用用途。"],
      ...card.meanings.slice(2),
    ],
    get: [
      card.meanings[0],
      ["v.", "to become or cause someone or something to become", "变得；使进入某种状态", "The days get shorter as winter approaches.", "随着冬天临近，白天变得更短。"],
      card.meanings[2],
      ["v.", "to understand the meaning, reason, or point of something", "理解；明白", "I don't get the joke.", "我没听懂这个笑话。"],
      ["v.", "to arrange for or succeed in having something done", "设法完成；安排做好", "I need to get this report finished today.", "我今天得设法把这份报告完成。"],
      ["v.", "to persuade or cause someone to do something", "说服；使某人做某事", "I finally got the technician to check the wiring.", "我终于说服技术员检查了线路。"],
    ],
    make: [
      ...card.meanings.slice(0, 2),
      ["v.", "to earn an amount of money or income", "赚得；获得收入", "He makes a good living as a designer.", "他当设计师，收入不错。"],
      ["v.", "to reach a place in time or succeed in attending something", "及时到达；赶上；出席", "We ran and just made the last train.", "我们跑着赶上了末班火车。"],
      ["v.", "to arrange or establish a plan, appointment, or agreement", "安排；作出；订立", "Can we make an appointment for Friday?", "我们能把预约安排在星期五吗？"],
    ],
    see: [
      ...card.meanings.slice(0, 3),
      ["v.", "to make sure that something is done", "确保；务必使", "Please see that the door is locked.", "请确保门已锁好。"],
      ["v.", "to experience or live through an event or period", "经历；见证", "She has seen many changes during her career.", "她在职业生涯中见证了许多变化。"],
    ],
    give: [
      ...card.meanings,
      ["n.", "the ability of a material to bend or stretch under pressure", "弹性；韧性", "There is enough give in the rope to absorb the sudden pull.", "这条绳子有足够的弹性来缓冲突然的拉力。"],
    ],
    will: [
      ...card.meanings.slice(0, 2),
      ["modal v.", "used to describe habitual or characteristic behavior", "常常会；惯于", "Children will often ask difficult questions.", "孩子们常会问一些难题。"],
      ["n.", "determination or mental resolve", "意志；决心", "She has a strong will to succeed.", "她有强烈的成功意志。"],
      ["n.", "a legal document stating what should happen to someone's property after death", "遗嘱", "He left the house to his daughter in his will.", "他在遗嘱中把房子留给了女儿。"],
    ],
    mean: [
      ...card.meanings.slice(0, 2),
      ["v.", "to be important or valuable to someone", "对……重要；对……有价值", "Your support means a lot to me.", "你的支持对我很重要。"],
      ["v.", "to result in or involve a particular consequence", "意味着；结果是", "Missing the deadline would mean losing the contract.", "错过截止日期就意味着失去合同。"],
      ["adj.", "unkind or cruel", "刻薄的；不友善的", "That was a mean thing to say.", "那样说话很刻薄。"],
      ["adj.", "unwilling to spend, give, or share", "吝啬的；小气的", "He is too mean to replace the broken heater.", "他太小气，舍不得更换坏掉的暖气。"],
      ["adj.", "having a value equal to the average", "平均的", "The mean temperature was ten degrees.", "平均温度为十度。"],
      ["n.", "the average obtained by dividing a total by the number of values", "平均数；平均值", "The arithmetic mean is twelve.", "算术平均数是十二。"],
      ["n.", "a method or way of achieving something, usually used as means", "手段；方法", "Email is our main means of communication.", "电子邮件是我们的主要沟通方式。"],
    ],
    start: [
      ...card.meanings,
      ["n.", "a sudden movement caused by surprise or fear", "一惊；猛然一动", "She woke with a start when the alarm rang.", "闹钟响时，她猛地一惊醒了过来。"],
    ],
    help: [
      card.meanings[0],
      ["v.", "to make a situation easier or better", "有助于；改善", "Regular breaks help concentration.", "定期休息有助于集中注意力。"],
      ["v.", "to prevent or reduce something unpleasant", "避免；缓解", "A written checklist helps prevent mistakes.", "书面清单有助于防止出错。"],
      ...card.meanings.slice(2),
    ],
    feel: [
      ...card.meanings.slice(0, 3),
      ["linking v.", "to have a particular quality when touched or experienced", "摸起来；给人某种感觉", "The fabric feels soft against the skin.", "这种布料贴着皮肤摸起来很柔软。"],
      ...card.meanings.slice(3),
    ],
    keep: [
      ...card.meanings,
      ["v.", "to own and care for animals or provide someone with what they need", "饲养；供养", "They keep chickens for fresh eggs.", "他们养鸡来获取新鲜鸡蛋。"],
    ],
    want: card.meanings.slice(0, 2),
    look: [
      ...card.meanings.slice(0, 2),
      ["v.", "to try to find someone or something, usually with for", "寻找", "We are looking for a quieter apartment.", "我们正在寻找一套更安静的公寓。"],
      ["v.", "to examine or investigate something, usually with into, over, or through", "检查；调查；浏览", "We are looking into the complaint.", "我们正在调查这起投诉。"],
      ["v.", "to consider a subject, possibility, or future direction", "考虑；着眼于", "The report looks at several ways to reduce waste.", "该报告考察了几种减少浪费的方法。"],
      ...card.meanings.slice(3),
    ],
    play: [
      ...card.meanings.slice(0, 2),
      ["v.", "to make recorded music, sound, or video start or continue", "播放；播出", "Music was playing softly in the café.", "咖啡馆里轻声播放着音乐。"],
      ["v.", "to have a particular role, influence, or effect", "发挥作用；产生影响", "Cost played a major part in the final decision.", "成本在最终决定中起了重要作用。"],
      ...card.meanings.slice(3),
    ],
    talk: [
      [card.meanings[0][0], card.meanings[0][1], card.meanings[0][2], card.meanings[0][3], "我们就这个问题谈了一个小时。"],
      ...card.meanings.slice(1),
    ],
    live: [
      ...card.meanings.slice(0, 3),
      ["adj. / adv.", "performed, broadcast, or recorded while an event is happening", "现场的；直播的；现场地", "The interview will be broadcast live.", "这场采访将现场直播。"],
      ["adj.", "carrying electric current or currently active and updating", "带电的；实时的", "The dashboard displays live data from every sensor.", "仪表板显示每个传感器的实时数据。"],
    ],
  };
  if (meaningRepairs[word]) meanings = meaningRepairs[word];

  let fixedPhrases = [...card.fixedPhrases, ...(extra?.fixedPhrases ?? [])];
  const fixedRepairs = {
    can: {
      0: ["can afford something", "买得起；承担得起某事", "Most families can afford the basic plan.", "大多数家庭都能承担基础方案的费用。"],
      9: ["as best someone can", "尽某人所能", "She explains difficult ideas as best she can.", "她尽自己所能解释复杂的观点。"],
      10: ["can hardly help doing something", "几乎忍不住做某事", "I can hardly help smiling when I hear that song.", "听到那首歌时，我几乎忍不住微笑。"],
      11: ["can never be too careful", "再小心也不为过", "You can never be too careful with personal data.", "处理个人数据时再小心也不为过。"],
    },
    do: {
      9: ["do something about something", "采取行动处理某事", "We need to do something about the leaking roof before winter.", "我们得在冬天前想办法处理屋顶漏水的问题。"],
    },
    will: {
      4: ["will not take no for an answer", "不接受拒绝；执意如此", "She will not take no for an answer when safety is at stake.", "事关安全时，她不会接受否定答复。"],
      7: ["a strong will to succeed", "成功的坚强意志", "Her strong will to succeed kept her focused through every setback.", "强烈的成功意志让她在挫折中仍保持专注。"],
    },
    know: {
      9: ["let it be known that + clause", "公开声明某事", "The director let it be known that changes were coming.", "主管公开表示即将有变动。"],
    },
    would: {
      3: ["would you mind if + clause", "礼貌询问对方是否介意", "Would you mind if I sat here?", "如果我坐这里，你介意吗？"],
      6: ["it would appear that + clause", "委婉正式地表示似乎", "It would appear that the figures are wrong.", "看来这些数字有误。"],
    },
    make: {
      10: ["make it clear that + clause", "明确说明某事", "He made it clear that the deadline was final.", "他明确表示截止日期不能再改。"],
    },
    take: {
      1: ["take something into account", "把某事考虑在内", "We must take travel time into account.", "我们必须把路程时间考虑在内。"],
      8: ["take a toll on someone or something", "对某人或某事造成损害", "The long hours took a toll on her health.", "长时间工作损害了她的健康。"],
    },
    try: { 9: ["try a different approach to something", "换一种方法尝试某事", "We tried a different approach to the staffing problem.", "我们用不同的方法尝试解决人员配置问题。"] },
    tell: {
      0: ["tell people or things apart", "分辨两个人或事物", "Even their teacher cannot tell the twins apart.", "甚至他们的老师也分不清这对双胞胎。"],
      6: ["tell the plain truth", "如实说出真相", "The witness told the plain truth despite the pressure.", "尽管承受压力，证人仍如实说出了真相。"],
    },
    call: { 2: ["call someone's bluff", "揭穿某人的虚张声势；迫使某人摊牌", "She called his bluff and refused to leave.", "她看穿了他的虚张声势，拒绝离开。"] },
    ask: { 11: ["ask yourself whether + clause", "问问自己是否如此", "Ask yourself whether the risk is worth it.", "问问自己这风险是否值得。"] },
    mean: { 11: ["if you know what I mean", "如果你懂我的意思", "His apology sounded sincere, if you know what I mean.", "他的道歉听起来很真诚——你明白我的意思吧。"] },
    help: { 11: ["so help me God", "我对天发誓", "I will tell the whole truth, so help me God.", "我对天发誓，我会说出全部真相。"] },
    start: {
      3: ["start something over", "把某事重新开始", "The file was corrupt, so I started the upload over.", "文件损坏了，所以我重新开始上传。"],
      11: ["start a chain reaction", "引发连锁反应", "One careless comment started a chain reaction of complaints.", "一句欠考虑的话引发了一连串投诉。"],
    },
    become: { 5: ["it becomes clear that + clause", "某事变得明显", "It soon became clear that we needed help.", "很快就清楚我们需要帮助。"] },
    happen: { 7: ["it so happens that + clause", "碰巧有某种情况", "It so happens that we are free tonight.", "碰巧我们今晚有空。"] },
    seem: {
      2: ["it seems that + clause", "看来某事如此", "It seems that we were mistaken.", "看来我们弄错了。"],
      3: ["it would seem that + clause", "更委婉地表示似乎", "It would seem that demand is falling.", "看来需求正在下降。"],
      5: ["seem as if + clause", "看起来仿佛如此", "It seems as if everyone agrees.", "看起来大家似乎都同意。"],
    },
    like: { 11: ["like a fish out of water", "如鱼离水；感到很不自在", "I felt like a fish out of water at the formal reception.", "在正式招待会上，我觉得很不自在。"] },
    put: {
      0: ["put your foot down", "坚决反对；坚持不让某事发生", "Her parents put their foot down and refused to extend her curfew.", "她父母坚决不同意延长她的晚归时间。"],
      8: ["put someone through to a person or department", "为某人接通某人或部门", "Could you put me through to accounts?", "你能帮我接通财务部吗？"],
    },
    play: {
      5: ["play it by ear", "见机行事；随机应变", "We have no firm plan, so we will play it by ear.", "我们没有确定计划，到时候就见机行事吧。"],
      8: ["play host to an event or visitors", "承办活动；接待来宾", "The city played host to the international festival.", "这座城市承办了这场国际节庆活动。"],
      11: ["bring something into play", "使某事物开始发挥作用", "The new evidence brought several legal issues into play.", "新证据使几个法律问题开始产生影响。"],
    },
    believe: {
      0: ["believe someone to be something", "认为某人具有某种身份或处于某种状态", "Police believe him to be abroad.", "警方认为他在国外。"],
      1: ["be widely believed to do something", "被广泛认为会做某事", "The painting is widely believed to be genuine.", "这幅画被广泛认为是真品。"],
      9: ["I believe not", "表示认为答案是否定的", "Is the road open? I believe not.", "这条路已经开通了吗？我想还没有。"],
    },
    live: { 10: ["live to see something", "有生之年见证某事", "She lived to see her grandchildren grow up.", "她有生之年见证了孙辈们长大。"] },
    may: { 10: ["may the best team win", "愿最佳队伍获胜", "Before the final, both captains said, “May the best team win.”", "决赛前，两位队长都说：“愿最佳队伍获胜。”"] },
    need: { 1: ["need only do something", "只需做某事", "You need only show your passport at the gate.", "你只需在门口出示护照。"] },
  };
  for (const [index, row] of Object.entries(fixedRepairs[word] ?? {})) fixedPhrases[Number(index)] = row;

  let contexts = card.contexts.map(([category, rows], index) => [
    category,
    [
      ...rows.filter(([phrase]) => !phrase.includes("placeholder")),
      ...(extra?.contexts?.[index] ?? []),
    ],
  ]);

  if (word === "know") {
    contexts = contexts.map(([category, rows]) => [category, rows.map(([phrase, zh]) =>
      phrase === "know whether it is safe" ? [phrase, "知道是否安全"] : [phrase, zh]
    )]);
  }
  if (word === "do") {
    contexts = contexts.map(([category, rows]) => [category, rows.map(([phrase, zh]) =>
      phrase === "do you remember"
        ? ["do remember the appointment", "确实记得那次约定"]
        : [phrase, zh]
    )]);
  }
  if (word === "can") {
    const conciseGlosses = new Map([
      ["我可以坐这里吗", "可以坐在这里"],
      ["我们可以提前离开吗", "可以提前离开"],
      ["客人可以使用泳池吗", "客人可以使用泳池"],
      ["员工可以远程工作吗", "员工可以远程工作"],
      ["我帮你拿那个好吗", "主动提出帮忙拿东西"],
      ["我们可以稍后讨论吗", "可以稍后讨论"],
      ["你能核对总数吗", "请对方核对总数"],
      ["我给你拿点水好吗", "主动提出给对方拿水"],
    ]);
    contexts = contexts.map(([category, rows]) => [category, rows.map(([phrase, zh]) => [phrase, conciseGlosses.get(zh) ?? zh])]);
  }
  const contextRepairs = {
    go: {
      "go silent without warning": ["go unnoticed in the report", "在报告中未被注意到"],
    },
    come: {
      "come naturally with practice": ["come naturally with practice", "经过练习后变得自然"],
    },
    want: {
      "want in clarity": ["want desperately to succeed", "非常渴望成功"],
      "want for basic supplies": ["really want to know the truth", "很想知道真相"],
      "wanting in detail": ["want nothing more than peace", "最想要的就是安宁"],
      "leave nothing wanting": ["still want a chance to improve", "仍希望有改进的机会"],
    },
    would: {
      "would you speak more slowly": ["would you speak more slowly", "请对方说慢一点"],
      "would you send me a copy": ["would you send me a copy", "请对方发来副本"],
      "would someone please explain": ["would someone please explain", "请人作出解释"],
      "would you wait outside": ["would you wait outside", "请对方在外等候"],
    },
    could: {
      "could I borrow your charger": ["could I borrow your charger", "礼貌请求借用充电器"],
      "could you lower your voice": ["could you lower your voice", "请对方放低音量"],
      "could we move the meeting": ["could we move the meeting", "提议调整会议时间"],
      "could someone open the gate": ["could someone open the gate", "请人打开大门"],
    },
    look: {
      "look exactly the same": ["look remarkably similar in profile", "侧面看起来很相似"],
    },
    tell: {
      "tell from someone's expression": ["tell someone's mood from their expression", "从表情判断某人的心情"],
    },
    find: {
      "find it strange that": ["find it strange that nobody called", "觉得没人打电话很奇怪"],
    },
    like: {
      "would like to order": ["like to order dessert after dinner", "喜欢饭后点甜点"],
      "would like someone to stay": ["like having close friends stay over", "喜欢挚友留宿"],
    },
    start: {
      "start production next month": ["start production on a small scale", "开始小规模生产"],
    },
    become: {
      "a dress that becomes her": ["a color that becomes her complexion", "衬她肤色的颜色"],
      "a haircut that becomes her": ["a haircut that becomes a round face", "衬圆脸的发型"],
    },
    happen: {
      "happen during the storm": ["accidents happen during severe storms", "严重风暴中会发生事故"],
    },
    seem: {
      "it seems clear that": ["seem clear enough to proceed", "看来已足够明确，可以继续"],
      "it seems unlikely that": ["seem unlikely to fall further", "看来不大可能继续下降"],
      "it seems from the data that": ["seem to indicate rising demand", "似乎表明需求在上升"],
    },
    believe: {
      "mistakenly believe that": ["mistakenly believe that the fee is optional", "误以为这笔费用可交可不交"],
    },
    play: {
      "play well on screen": ["play smoothly on screen", "在屏幕上流畅播放"],
    },
    turn: {
      "turn fifty next month": ["turn fifty next month", "下个月年满五十岁"],
    },
    may: {
      "may I speak freely": ["may I speak freely", "请求允许直言"],
      "may guests bring children": ["may guests bring children", "询问客人是否可带孩子"],
    },
    might: {
      "might I come in": ["might I come in", "礼貌请求进入"],
      "might I see the menu": ["might I see the menu", "礼貌请求看菜单"],
      "might we postpone the vote": ["might we postpone the vote", "委婉提议推迟投票"],
    },
  };
  if (contextRepairs[word]) {
    contexts = contexts.map(([category, rows]) => [category, rows.map((row) => contextRepairs[word][row[0]] ?? row)]);
  }
  if (word === "feel") {
    contexts = contexts.map(([category, rows], groupIndex) => [category, rows.map((row, rowIndex) =>
      groupIndex === 3 && rowIndex === 3
        ? ["feel an atmosphere of quiet confidence", "感受到沉静自信的氛围"]
        : row
    )]);
  }
  if (word === "want") {
    contexts = contexts.map(([category, rows], groupIndex) => [groupIndex === 3 ? "强烈愿望" : category, rows]);
  }
  if (word === "become") {
    contexts = contexts.map(([category, rows], groupIndex) => [category, rows.map((row, rowIndex) =>
      groupIndex === 3 && rowIndex === 0
        ? ["a color that becomes someone", "很衬人的颜色"]
        : groupIndex === 3 && rowIndex === 3
          ? ["a style that becomes her perfectly", "非常衬她的风格"]
          : row
    )]);
  }
  if (word === "need") {
    contexts = contexts.map(([category, rows]) => [category, rows.map((row) =>
      row[0] === "need medical attention"
        ? ["need medical attention", "需要就医；需要医疗救治"]
        : row
    )]);
  }
  if (word === "let") {
    contexts = contexts.map(([category, rows]) => [category, rows.map((row) => {
      if (row[0] === "let a secret escape") return ["let the secret slip", "不慎泄露秘密"];
      if (row[0] === "let office space cheaply") return ["let office space at a low rent", "低价出租办公空间"];
      return row;
    })]);
  }
  if (word === "call") {
    contexts = contexts.map(([category, rows]) => [category, rows.map((row) =>
      row[0] === "call a brief pause"
        ? ["call for a brief pause", "要求短暂停顿"]
        : row
    )]);
  }
  if (word === "leave") {
    contexts = contexts.map(([category, rows]) => [category, rows.map((row) =>
      row[0] === "leave work on medical grounds"
        ? ["leave a job on medical grounds", "因健康原因离职"]
        : row
    )]);
  }

  let derivatives = card.derivatives;
  const derivativeNoteRepairs = {
    talk: {
      talkative: "强调喜欢多说话，常用于描述一个人的性格特征。",
      talkativeness: "指一个人喜欢或倾向于多说话的性格特征，常作不可数名词。",
    },
    leave: {
      "leave-taking": "较正式地指告别或离别过程，常见于叙事和文学语境。",
    },
    help: {
      helpfully: "说明某个行为切实提供帮助，常修饰 suggest、explain 或 point out。",
      helplessly: "描述无能为力的方式，常修饰 watch、wait 或 stand by。",
    },
    become: {
      unbecoming: "表示不符合某人的身份、礼仪或外观，常修饰 behavior 和 conduct。",
    },
    show: {
      showiness: "指外观或行为过度炫目、刻意吸引注意的特征，常带贬义。",
      showcase: "作名词指展示平台，作动词强调呈现事物的最佳特点。",
    },
    play: {
      playful: "描述人或行为爱玩、轻松或带有善意玩笑的特征。",
      playfully: "描述以顽皮或开玩笑的方式说话、微笑或行动。",
      replay: "作动词或名词指重新播放录像，也可指再进行一场比赛。",
      playground: "指儿童玩耍的操场或游乐场，也可比喻任意活动的场所。",
    },
  };
  if (derivativeNoteRepairs[word]) {
    derivatives = derivatives.map((row) => derivativeNoteRepairs[word][row[0]]
      ? [row[0], row[1], row[2], derivativeNoteRepairs[word][row[0]]]
      : row);
  }
  const lowValueDerivatives = {
    see: new Set(["seeing"]),
    take: new Set(["taking"]),
    leave: new Set(["leave-taking"]),
    let: new Set(["letting"]),
  };
  if (lowValueDerivatives[word]) {
    derivatives = derivatives.filter(([derivative]) => !lowValueDerivatives[word].has(derivative));
  }
  if (word === "see") {
    derivatives = [
      ["foresee", "v.", "预见；预料", "强调在事情发生前看到其可能结果，常接 problem、difficulty 或 consequence。"],
      ["oversee", "v.", "监督；监管", "指负责观察并管理他人的工作、项目或过程。"],
      ["foreseeable", "adj.", "可预见的", "常用于 foreseeable future 或 foreseeable consequence，表示能合理预料到。"],
      ["unforeseen", "adj.", "未预见的；意外的", "常修饰 circumstance、problem 或 expense，强调事先没有料到。"],
    ];
  }
  if (word === "can") {
    derivatives = [
      ["canned", "adj.", "罐装的；预先录制的", "指食品已经装罐保存，也可形容预先录好或套话式的内容。"],
      ["canning", "n.", "食品罐藏；制罐工艺", "指将食品加工并密封在罐中以长期保存的过程。"],
      ["cannery", "n.", "罐头工厂", "指加工鱼类、水果或蔬菜并将其装罐的工厂。"],
    ];
  }
  if (word === "do") {
    derivatives = [
      ["redo", "v.", "重做；再做", "指因修改、失败或更新而把某项工作重新做一遍。"],
      ["undo", "v.", "解开；撤销；消除", "可指解开扣件，也可指撤销动作或消除已经造成的结果。"],
      ["overdo", "v.", "做得过度；用得过多", "表示活动、装饰、锻炼或反应超过合适程度。"],
      ["doer", "n.", "实干者", "指重视行动并把事情实际做成的人。"],
      ["doing", "n.", "行为；所作所为", "常用复数 doings 指某人的活动或行为。"],
      ["doable", "adj.", "可做的；可行的", "强调任务或计划在现有条件下能够完成。"],
    ];
  }
  if (word === "say") {
    derivatives = [
      ...derivatives,
      ["unsaid", "adj.", "未说出口的；心照不宣的", "常指没有明说却能被双方理解的想法、感受或约定。"],
    ];
  }
  if (word === "tell") {
    derivatives = [
      ["retell", "v.", "复述；重新讲述", "指用自己的话再次讲述故事、事件或信息。"],
      ...derivatives,
      ["storyteller", "n.", "讲故事的人；说书人", "指善于或以讲述故事为业的人。"],
      ["storytelling", "n. / adj.", "讲故事；叙事的", "可指讲述故事的活动，也可修饰叙事技巧或传统。"],
      ["telltale", "adj.", "泄露真相的；露出迹象的", "常修饰 sign、mark 或 clue，表示能暴露真实情况。"],
    ];
  }
  if (word === "try") {
    derivatives = [
      ["retry", "v. / n.", "重试；再次尝试", "指第一次未成功后再次执行同一操作或尝试。"],
      ...derivatives,
    ];
  }
  if (word === "feel") {
    derivatives = [
      ...derivatives,
      ["unfeeling", "adj.", "冷漠的；无同情心的", "描述对他人痛苦或感受缺少关心的态度。"],
    ];
  }
  if (word === "ask") {
    derivatives = [
      ["unasked", "adj.", "未经询问的；主动提供的", "常见于 unasked question 或 offer advice unasked，表示没有人提出请求。"],
      ...derivatives,
    ];
  }
  if (word === "put") derivatives = [];

  let confusables = card.confusables;
  let antonyms = card.antonyms;
  let related = card.related;
  const relatedRepairs = {
    have: { experience: ["event", "n.", "事件；活动"] },
    see: { view: ["panorama", "n.", "全景；广阔景象"] },
    try: { sample: ["rehearsal", "n.", "排练；预演"] },
    may: {
      perhaps: ["likelihood", "n.", "可能性；可能程度"],
      formal: ["prayer", "n.", "祈愿；祷告"],
    },
    feel: { touch: ["texture", "n.", "质地；触感"] },
    ask: {
      question: ["interrogative", "n. / adj.", "疑问词；疑问的"],
      answer: ["clarification", "n.", "澄清；说明"],
    },
  };
  if (relatedRepairs[word]) {
    related = related.map(([category, rows]) => [category, rows.map((row) =>
      relatedRepairs[word][row[0]] ?? row
    )]);
  }
  if (word === "live") {
    confusables = card.confusables
      .filter(([relationWord]) => relationWord !== "live")
      .concat([["life", "n.", "生命；生活", "life 是名词 /laɪf/；live 作动词读 /lɪv/，表示居住或活着。"]]);
    related = card.related.map(([category, rows]) => [category, rows.map((row) =>
      row[0] === "life" ? ["vitality", "n.", "生命力；活力"] : row
    )]);
  }
  if (word === "feel") {
    related = related.map(([category, rows]) => [category, rows.map((row) =>
      row[0] === "sensation" ? ["numbness", "n.", "麻木感；失去知觉"] : row
    )]);
  }
  if (word === "may") {
    confusables = [["maybe", "adv.", "也许；可能", "maybe 是副词，可修饰整句；may 是情态动词，后面必须接动词原形。"]];
  }
  if (word === "mean") {
    antonyms = [
      ["kind", "adj.", "善良的；友善的", "只与 mean 表示刻薄、不友善的形容词义相反。"],
      ["generous", "adj.", "慷慨的；大方的", "只与 mean 表示吝啬、小气的形容词义相反。"],
    ];
  }
  if (word === "ask") {
    antonyms = [
      ["answer", "v.", "回答；答复", "在问答互动中，ask 提出问题，answer 给出所求信息。"],
      ["reply", "v.", "回答；回应", "只在言语互动的问答方向上相反；reply 通常不直接接问题内容作宾语。"],
    ];
    related = related.map(([category, rows]) => [category, rows.map((row) =>
      row[0] === "reply" ? ["response", "n.", "回应；答复"] : row
    )]);
  }
  const confusableRepairs = {
    mean: [["means", "n.", "方法；手段", "means 表示“方法”时单复数同形；mean 可作动词表示“意思是”。"]],
    ask: [["say", "v.", "说；表达", "ask 用于提问、请求或邀请；say 用于陈述具体话语或观点。"]],
    keep: [["hold", "v.", "拿着；保持", "hold 侧重用手支撑或在某位置保持；keep 更常表保留或持续状态。"]],
    help: [["hope", "v.", "希望", "help 表示提供帮助或使事情更容易；hope 表示期望某事发生，两者拼写相近但结构不同。"]],
    put: [["putt", "v. / n.", "轻击高尔夫球；推杆", "put 读 /pʊt/ 且表示放置；putt 读 /pʌt/ 并专指高尔夫推杆。"]],
    start: [["startle", "v.", "使吃惊", "start 可作名词表示突然惊跳；startle 是及物动词，表示使某人吃惊。"]],
    seem: [["seam", "n.", "缝；接缝", "seem 读 /siːm/ 且表示“似乎”；seam 同音，却是表示接缝的名词。"]],
    might: [["mite", "n.", "螨；极少量", "might 是情态动词或“力量”名词；mite 与之同音，表示微小的螨。"]],
    call: [],
    play: [],
    turn: [],
    run: [],
  };
  if (Object.hasOwn(confusableRepairs, word)) confusables = confusableRepairs[word];
  const detailedConfusableNotes = {
    be: {
      become: "be 连接名词或形容词来描写当前身份与状态；become 则强调从原状态转变为新状态的过程。",
    },
    do: {
      make: "do 通常与 task、work、research 等活动或任务搭配；make 则强调制作产物或形成 decision、plan、result。",
    },
    see: {
      look: "look 强调主动把目光投向对象，常用 look at；see 强调视觉已感知到人或事物的结果，直接接宾语。",
      watch: "watch 表示在一段时间内持续观看运动或变化的对象；see 只说明看见或感知到的结果。",
    },
    could: {
      can: "can 通常直接表示现在能力或许可；could 可表过去的一般能力，也能使请求更委婉。",
    },
    tell: {
      talk: "tell 强调把信息传给某人，常用 tell someone something；talk 强调双向交谈过程，常与 to、with、about 连用。",
    },
    give: {
      lend: "give 通常把物品的所有权或控制权交给对方；lend 只表示暂时借出，语义上预期日后归还。",
    },
    let: {
      leave: "let /let/ 表示允许，用 let someone do 且宾补前不加 to；leave /liːv/ 表示离开某地或把物品留下。",
    },
    feel: {
      fill: "feel /fiːl/ 表示感觉、触摸或系动词‘给人某种感觉’；fill /fɪl/ 是及物动词，表示把容器装满。",
    },
    leave: {
      live: "leave /liːv/ 是动词，表示离开或留下；live 作动词读 /lɪv/，表示居住或生活。",
    },
    like: {
      as: "like 作介词时表示‘像’，只说相似性；as 可表示某人或某物的真实身份、功能或作用。",
    },
    become: {
      begin: "begin 表示活动或过程开始，后接名词、to do 或 -ing；become 是系动词，后接名词或形容词表状态转变。",
    },
    show: {
      prove: "show 可以出示事物或用迹象表明某种可能；prove 要求证据足以确立结论为真，证明强度更高。",
    },
    live: {
      leave: "live 作动词读 /lɪv/，表示生活或居住；leave 读 /liːv/，表示离开或把人、物留下。",
    },
  };
  if (detailedConfusableNotes[word]) {
    confusables = confusables.map((row) => detailedConfusableNotes[word][row[0]]
      ? [row[0], row[1], row[2], detailedConfusableNotes[word][row[0]]]
      : row);
  }

  let synonyms = [...card.synonyms, ...(extra?.synonyms ?? [])];
  if (word === "keep") {
    synonyms = [synonyms[1], synonyms[0], ...synonyms.slice(2)];
  }
  if (word === "would") {
    const might = synonyms.find(([relationWord]) => relationWord === "might");
    synonyms = [
      [might[0], "aux.", might[2], might[3]],
      ...synonyms.filter(([relationWord]) => relationWord !== "might"),
    ];
    synonyms = synonyms.map((row) => row[0] === "would like to"
      ? ["wanted to", "phr.", "想要；本想", "只对应 would like to 的礼貌愿望义；wanted to 常用过去式弱化请求语气，不表示条件结果。"]
      : row);
  }
  if (word === "may") {
    synonyms = synonyms.map((row) => row[0] === "might" ? [row[0], "aux.", row[2], row[3]] : row);
  }
  if (word === "might") {
    synonyms = synonyms.map((row) => row[0] === "may" ? [row[0], "aux.", row[2], row[3]] : row);
  }
  const synonymOrderRepairs = {
    will: ["be going to", "be set to", "intend to", "plan to", "be willing to"],
    call: ["phone", "contact", "summon", "name", "announce"],
    mean: ["signify", "indicate", "represent", "intend", "matter"],
    ask: ["inquire", "question", "request", "seek", "invite"],
    believe: ["accept", "think", "trust", "be convinced", "have faith in"],
    turn: ["rotate", "veer", "reverse", "change", "become"],
  };
  if (synonymOrderRepairs[word]) {
    const byWord = new Map(synonyms.map((row) => [row[0], row]));
    synonyms = synonymOrderRepairs[word].map((relationWord) => byWord.get(relationWord));
  }
  if (word === "be") {
    synonyms = synonyms.map((row, index) => index === 3
      ? [row[0], row[1], row[2], "用于数值或效果相等；不替代 be 的地点、状态或助动词用法。"]
      : row);
  }
  if (word === "do") {
    synonyms = synonyms.map((row, index) => index === 1
      ? [row[0], row[1], row[2], "强调按既定计划、指示或研究方案把具体任务落实完成。"]
      : row);
  }
  if (word === "make") {
    synonyms = synonyms.map((row, index) => index === 0
      ? [row[0], row[1], row[2], "强调创造出原先不存在的具体事物、想法、条件或机会。"]
      : row);
  }
  const synonymScopeByWord = {
    want: "不直接表示 want 的日常愿望或缺少某物的需求状态。",
    look: "不能覆盖 look 的系动词外观义、名词义或搜寻用法。",
    use: "不能覆盖 use 的名词用途、使用权以及消耗资源义。",
    find: "不能覆盖 find 的搜寻结果、意外遇见或宾语补语评价结构。",
    give: "不能覆盖 give 的双宾语、让步、发出声音或举办活动义。",
    need: "不能覆盖 need 的人称需求、物作主语被动义或情态结构。",
    should: "与 should 相比，建议强度、规则来源或后接结构并不相同。",
    try: "不能覆盖 try doing 的试验方法义与 try to do 的努力完成义。",
    let: "不能覆盖 let 的使役结构、不带 to 的宾补或房产出租义。",
    call: "不能覆盖 call 的命名、召唤、宣布、判定或短语动词用法。",
    may: "不能覆盖 may 的祝愿、让步、正式许可或目的从句结构。",
    mean: "不能覆盖 mean 的主观意图、重要性、刻薄性格或平均值义。",
    feel: "不能覆盖 feel 的触觉、情绪、观点从句或系动词结构。",
    ask: "不能覆盖 ask 的询问信息、索要事物、请求行动或邀请用法。",
    talk: "不能覆盖 talk 的双向交谈、议论某人、说服他人或谈判结构。",
    keep: "不能覆盖 keep 的保留、持续、经营、遵守或使役宾补结构。",
    leave: "不能覆盖 leave 的离开、遗留、委托、剩余或休假名词义。",
    put: "不能覆盖 put 的放置、用言语表达、使处于状态或投入用法。",
    like: "不能覆盖 like 的介词相似义、连词方式义或名词同类义。",
    help: "不能覆盖 help 的改善情况、防止问题、自取事物或无法避免结构。",
    start: "不能覆盖 start 的时间起点、启动设备、创办事业或惊跳名词义。",
    become: "不能覆盖 become 的身份转变、逐步发展或“适合某人”的及物用法。",
    happen: "不能覆盖 happen to do 的偶然义、happen to someone 或计划活动区别。",
    show: "不能覆盖 show 的出示、带路、证明、表现或演出名词义。",
    seem: "不能覆盖 seem to do、it seems that 或 there seems to be 等完整结构。",
    might: "不能覆盖 might 的委婉建议、假设推测、过去转述或力量名词义。",
    hear: "不能覆盖 hear 的被动听见、得知消息、审理案件或听取意见用法。",
    believe: "不能覆盖 believe someone、believe in 与 believe that 的宾语和立场差异。",
    play: "不能覆盖 play 的比赛、演奏、扮演、播放或发挥作用义。",
    turn: "不能覆盖 turn 的方向旋转、开关调节、状态变化或轮次名词义。",
    run: "不能覆盖 run 的跑步、机器运行、经营管理、液体流动或延伸义。",
    live: "不能覆盖 live 的居住、谋生、度过某种生活或现场形容词义。",
  };
  if (synonymScopeByWord[word]) {
    synonyms = synonyms.map((row) => String(row[3]).trim().length < 20
      ? [row[0], row[1], row[2], `${row[3]}；${synonymScopeByWord[word]}`]
      : row);
  }
  synonyms = synonyms.map((row) => [row[0], row[1], row[2], String(row[3]).replaceAll("。；", "；")]);

  if (["will", "would", "want", "call", "may", "mean", "ask", "seem", "turn"].includes(word)) {
    antonyms = [];
  }
  if (word === "say") {
    antonyms = [["remain silent", "phr.", "保持沉默；不说", "只对应 say 表示把话说出口的核心义；remain silent 强调选择不发言。"]];
  }
  if (word === "use") {
    antonyms = [["leave unused", "phr.", "闲置不用", "只对应 use 表示为某个目的使用物品的义项；leave unused 表示放着不用。"]];
  }
  if (word === "come") {
    antonyms = [["go", "v.", "去；离开", "以说话者或明确参照点为中心时，come 表示朝该参照点靠近，go 则表示从该参照点离开。"]];
  }
  if (word === "give") {
    antonyms = [["take", "v.", "拿走；接受", "在物品转移这一义项中，give 表示把物品交出，take 则表示从他人或某处取走或接过。"]];
  }
  if (word === "mean") {
    antonyms = [
      ["kind", "adj.", "友善的；体贴的", "只对应 mean 表示‘刻薄、对人不友善’的形容词义；kind 表示待人友善体贴。"],
      ["generous", "adj.", "慷慨的；大方的", "只对应 mean 表示‘吝啬、不愿给予’的形容词义；generous 表示愿意充分给予。"],
    ];
  }
  if (word === "ask") {
    antonyms = [
      ["answer", "v.", "回答；答复", "只在问答这一明确交际关系中形成对应；ask 是提出问题，answer 是给出答案。"],
      ["reply", "v.", "回答；回应", "只对应 ask 表示向某人提问的义项；reply 强调对已收到的问题或话语作出回应。"],
    ];
  }

  const antonymScopeByWord = {
    find: "只与成功找到或保有具体对象的义项构成反向关系。",
    need: "只与客观上需要某物的义项构成反向关系。",
    try: "只与继续付出努力尝试完成目标的义项相反。",
    let: "只与允许某个具体动作发生的义项构成反向关系。",
    may: "只与 may 表示正式许可的义项构成反向关系。",
    feel: "只与身体能够感受触觉、温度或疼痛的义项相反。",
    ask: "只在问答交际中与提出问题的义项构成对照。",
    talk: "只与开口交谈或进行双向讨论的义项构成反向关系。",
    keep: "只与保留某个具体物品而不丢弃的义项相反。",
    leave: "只与从某个地点离开或出发的义项构成方向对照。",
    put: "只与把具体物品放到某处的义项构成反向关系。",
    like: "只与喜欢某人或某事的动词义项构成反向关系。",
    start: "只与活动、过程或设备开始运作的义项构成反向关系。",
    become: "只与状态或身份发生变化的义项构成反向关系。",
    happen: "只与某个具体事件实际发生的义项构成反向关系。",
    show: "只与让别人看见事物或揭示信息的义项构成反向关系。",
    might: "只与 might 表示理论或情境可能性的义项构成反向关系。",
    hear: "只与听清具体声音或言语信息的义项构成反向关系。",
    believe: "只与接受某个说法为真或相信某人的义项构成对照。",
    play: "只与参加某场比赛、游戏或活动的义项构成反向关系。",
    run: "只与人在地面上跑动或向前移动的义项构成反向关系。",
    live: "只与人或生物继续活着的动词义项构成反向关系。",
  };
  if (antonymScopeByWord[word]) {
    antonyms = antonyms.map((row) => String(row[3]).trim().length < 16
      ? [row[0], row[1], row[2], `${row[3]}；${antonymScopeByWord[word]}`]
      : row);
  }
  antonyms = antonyms.map((row) => [row[0], row[1], row[2], String(row[3]).replaceAll("。；", "；")]);

  let commonErrors = card.commonErrors;
  if (word === "keep") {
    commonErrors = [
      ["He keeps to interrupt me.", "He keeps interrupting me.", "keep 表示反复或继续做某事时后接 -ing，不接 to do。"],
      ["The traffic kept me to wait outside.", "The traffic kept me waiting outside.", "keep + 宾语 + -ing 表示让某人持续做某事，不接 to do。"],
    ];
  }
  if (word === "show") {
    commonErrors = [
      card.commonErrors[0],
      ["Show me how can I open it.", "Show me how I can open it.", "how 引导的间接疑问句用陈述语序；也可说 Show me how to open it。"],
    ];
  }
  if (word === "may") {
    commonErrors = [
      [card.commonErrors[0][0], card.commonErrors[0][1], "may 是情态动词，后面必须直接接动词原形，不加第三人称单数 -s。"],
      card.commonErrors[1],
    ];
  }
  if (word === "ask") {
    commonErrors = [
      [card.commonErrors[0][0], card.commonErrors[0][1], "ask 后的间接疑问句必须使用陈述语序，不能保留直接问句的倒装。"],
      card.commonErrors[1],
    ];
  }
  if (word === "might") {
    commonErrors = [
      card.commonErrors[0],
      [card.commonErrors[1][0], card.commonErrors[1][1], "might 是情态动词，后面直接接动词原形，不能再加不定式标记 to。"],
    ];
  }
  const commonErrorRepairs = {
    can: [
      ["I can swim when I was five.", "I could swim when I was five.", "谈过去的一般能力用 could；can 表示现在的能力。"],
      ["She can finish the race yesterday.", "She managed to finish the race yesterday.", "明确表示过去某次实际成功做到，通常用 managed to 或 was able to，不用 can。"],
    ],
    will: [
      ["I promise I would call you tonight.", "I promise I will call you tonight.", "说话当下作出的直接承诺用 will；would 常带过去视角、假设或委婉语气。"],
      card.commonErrors[1],
    ],
    could: [
      ["When I was five, I can read simple books.", "When I was five, I could read simple books.", "回顾过去持续具备的能力用 could，不用现在时 can。"],
      ["Could you to check this figure?", "Could you check this figure?", "could 是情态动词，后面直接接动词原形 check，不再加不定式标记 to。"],
    ],
    should: [
      ["You should better rest today.", "You had better rest today.", "should 不和 better 直接连用；可说 You should rest 或用较强建议 had better。"],
      card.commonErrors[1],
    ],
    may: [
      ["Do I may leave early today?", "May I leave early today?", "may 表示正式请求许可时直接放在主语前，不再助动词 do。"],
      card.commonErrors[1],
    ],
    might: [
      ["She might have took the wrong train.", "She might have taken the wrong train.", "might have 表示对过去的推测，后面必须接过去分词 taken，不接过去式 took。"],
      ["He might can come tomorrow.", "He might be able to come tomorrow.", "标准英语中 might 后不直接叠加 can；要表示能力时用 might be able to。"],
    ],
    think: [
      ["I am think he is right.", "I think he is right.", "表示一般观点时直接用 think；am 后不能接动词原形 think。"],
      card.commonErrors[1],
    ],
    look: [
      card.commonErrors[0],
      ["The soup looks deliciously.", "The soup looks delicious.", "look 表示“看起来”时是连系动词，后面用形容词 delicious 作表语，不用副词。"],
    ],
    see: [
      ["I can see to a bird in the tree.", "I can see a bird in the tree.", "see 表示视觉感知时直接接宾语，不在看见的对象前加 to。"],
      card.commonErrors[1],
    ],
    come: [
      card.commonErrors[0],
      ["She came the airport at six.", "She came to the airport at six.", "come 后接普通目的地名词时要用 to；只有 home、here、there 等方向副词前不加 to。"],
    ],
    try: [
      ["I tried restart the computer.", "I tried restarting the computer.", "把重启作为解决问题的一种试验方法时，try 后接动名词 restarting。"],
      ["She tried to opening the safe.", "She tried to open the safe.", "强调努力完成动作时用 try to do，to 后必须接动词原形 open。"],
    ],
    call: [
      ["I called to the clinic by phone yesterday.", "I called the clinic yesterday.", "call 表示给某人或机构打电话时是及物动词，直接接宾语，不加 to。"],
      ["This emergency calls off immediate action.", "This emergency calls for immediate action.", "call for 表示情况需要某项行动；call off 表示取消已安排的事情。"],
    ],
    feel: [
      ["I am feel that this is wrong.", "I feel that this is wrong.", "表示当下观点时直接用 I feel；am 后不能接动词原形 feel。"],
      card.commonErrors[1],
    ],
    leave: [
      card.commonErrors[0],
      ["I leaved my phone at home.", "I left my phone at home.", "leave 的过去式是不规则形式 left，不能直接加 -ed 写成 leaved。"],
    ],
    happen: [
      ["What was happened to you?", "What happened to you?", "happen 是不及物动词，询问过去发生的事直接用 happened，不构成 was happened 被动语态。"],
      card.commonErrors[1],
    ],
    hear: [
      ["I can hearing music now.", "I can hear music now.", "情态动词 can 后必须接动词原形 hear，不能接 hearing。"],
      card.commonErrors[1],
    ],
    believe: [
      ["I am believe you.", "I believe you.", "believe 作表示认知或判断的实义动词时直接随主语变化，不在原形前加 am。"],
      card.commonErrors[1],
    ],
    play: [
      card.commonErrors[0],
      ["We played basketball to another school.", "We played basketball against another school.", "表示在球类比赛中与另一所学校对阵时用 play against，不用 play to。"],
    ],
    run: [
      card.commonErrors[0],
      ["The water is running out the pipe.", "The water is running out of the pipe.", "表示水从管道内流出时用完整介词结构 out of，不能省略 of。"],
    ],
    mean: [
      card.commonErrors[0],
      ["This expansion will mean to hire more staff.", "This expansion will mean hiring more staff.", "mean 表示“意味着、结果是”时后接 -ing；mean to do 则表示“打算做”。"],
    ],
  };
  if (commonErrorRepairs[word]) commonErrors = commonErrorRepairs[word];

  return {
    ...card,
    meanings,
    fixedPhrases,
    contexts,
    derivatives,
    synonyms,
    antonyms,
    confusables,
    related,
    commonErrors,
  };
};

export const manualCardPacks001050 = Object.fromEntries(
  Object.entries(manualSemanticPacks001050).map(([word, card]) => [word, repairCard(word, card)])
);

export { manualPackWords001050 };

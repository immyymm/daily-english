// High-frequency noun readings for verb-priority headwords.
//
// The learning order remains verb-first, but a complete card must not hide a
// genuinely common noun reading of the same spelling.  Every row below is
// deliberately self-contained and has its own noun example; this prevents the
// generator from attaching a verb example to a noun definition.
export const commonNounSensePacks = {
  end: [['n.', 'the final part or point of something', '末尾；结束', 'We stayed until the end of the meeting.', '我们一直待到会议结束。']],
  show: [['n.', 'a performance or television program', '演出；节目', 'We watched a comedy show after dinner.', '晚饭后我们看了一档喜剧节目。']],
  use: [
    ['n.', 'the act of using something', '使用', 'The machine is designed for everyday use.', '这台机器是为日常使用而设计的。', '/juːs/'],
    ['n.', 'a purpose for which something can be used', '用途；用处', 'This tool has several practical uses.', '这个工具有几种实际用途。', '/juːs/']
  ],
  love: [['n.', 'a strong feeling of affection or deep interest', '爱；热爱', 'Her love of music began in childhood.', '她对音乐的热爱始于童年。']],
  report: [['n.', 'a written or spoken account that gives information', '报告；报道', 'The report explains the main findings clearly.', '这份报告清楚地说明了主要发现。']],
  need: [['n.', 'a situation in which something is necessary', '需要；必要', 'There is an urgent need for clean water.', '目前迫切需要洁净的水。']],
  look: [['n.', 'an act of looking at something', '看；查看', 'Take a closer look at the final paragraph.', '仔细看看最后一段。']],
  call: [['n.', 'a telephone conversation or an act of calling', '电话；呼叫', 'I received a call from the clinic this morning.', '今天早上我接到了诊所的电话。']],
  cause: [['n.', 'the person or thing that makes something happen', '原因；起因', 'Investigators are still looking for the cause of the fire.', '调查人员仍在寻找火灾原因。']],
  help: [['n.', 'assistance given to someone', '帮助；援助', 'Thank you for all your help.', '谢谢你给予的所有帮助。']],
  set: [['n.', 'a group of similar things that belong together', '一套；一组', 'She bought a new set of kitchen knives.', '她买了一套新的厨房刀具。']],
  play: [['n.', 'a story written to be performed by actors', '戏剧；剧本', 'The class performed a short play in English.', '全班用英语表演了一出短剧。']],
  talk: [
    ['n.', 'a conversation, especially an informal one', '交谈；谈话', 'We had a long talk about the problem.', '我们就这个问题长谈了一次。'],
    ['n.', 'an informal speech given to a group', '演讲；讲座', 'She gave a short talk on online safety.', '她做了一个关于网络安全的简短演讲。']
  ],
  base: [
    ['n.', 'the lowest part that supports an object', '底部；底座', 'The lamp has a heavy metal base.', '这盏灯有一个沉重的金属底座。'],
    ['n.', 'a main place from which people or operations are directed', '基地；总部', 'The rescue team returned to base before dark.', '救援队在天黑前返回了基地。']
  ],
  hope: [['n.', 'a feeling of wanting something to happen and believing that it is possible', '希望；期望', 'There is still hope that the missing hikers will be found safe.', '失踪的徒步者仍有望被平安找到。']],
  break: [['n.', 'a short period of rest between activities', '休息；间歇', 'Let us take a ten-minute break.', '我们休息十分钟吧。']],
  fall: [
    ['n.', 'an act of falling', '跌倒；坠落', 'He injured his wrist in a fall.', '他跌倒时伤了手腕。'],
    ['n.', 'a decrease in an amount, level, or value', '下降；减少', 'The company reported a fall in costs.', '公司报告称成本有所下降。']
  ],
  run: [
    ['n.', 'a journey made in a vehicle, especially along a regular route', '行程；班次', 'The bus makes one final run at midnight.', '这班公交车午夜进行最后一趟行程。'],
    ['n.', 'a continuous period during which something operates', '连续运行的一段时间', 'The machine completed a twelve-hour run without stopping.', '这台机器连续运行了十二个小时。']
  ],
  return: [
    ['n.', 'the act of going or coming back to a place or activity', '返回；回归', 'Her return to work was gradual.', '她逐步重返工作岗位。'],
    ['n.', 'the act of giving, sending, or putting something back', '归还；退还', 'Please arrange the return of the borrowed equipment.', '请安排归还借用的设备。']
  ],
  turn: [
    ['n.', 'an opportunity or the right to do something in a sequence', '轮到的机会；轮次', 'It is your turn to ask a question.', '轮到你提问了。'],
    ['n.', 'a change in direction while moving', '转弯；转向', 'The road takes a sharp turn near the bridge.', '这条路在桥附近有一个急转弯。']
  ],
  move: [['n.', 'an action that changes position or situation', '移动；行动', 'The move to a larger office took two days.', '搬到更大的办公室用了两天。']],
  mean: [['n.', 'the average value of a group of numbers', '平均数；平均值', 'The mean of the five scores is eighty.', '这五个分数的平均值是八十。']],
  will: [
    ['n.', 'determination to do something despite difficulty', '意志；决心', 'She had the will to continue after the setback.', '受挫后她仍有继续下去的决心。'],
    ['n.', 'a legal document stating who receives property after a death', '遗嘱', 'He left the house to his daughter in his will.', '他在遗嘱中把房子留给了女儿。']
  ],
  start: [['n.', 'the beginning of an event, period, or process', '开始；开端', 'We arrived before the start of the concert.', '我们在音乐会开始前到了。']],
  lead: [['n.', 'a position ahead of other people or teams', '领先；领先地位', 'Our team took the lead in the second half.', '我们队在下半场取得了领先。']],
  drive: [
    ['n.', 'a journey in a car', '驾车行程', 'It is a two-hour drive to the coast.', '开车到海边需要两个小时。'],
    ['n.', 'an organized effort to achieve a particular result', '推动行动；运动', 'The school launched a recycling drive.', '学校发起了一场回收利用活动。']
  ],
  cut: [
    ['n.', 'a reduction in an amount or level', '削减；减少', 'The budget cut affected several projects.', '预算削减影响了几个项目。'],
    ['n.', 'an injury made by something sharp', '伤口；割伤', 'She had a small cut on her finger.', '她的手指上有一道小伤口。']
  ],
  pass: [
    ['n.', 'a successful result in an examination', '及格；通过', 'A score of sixty is a pass.', '六十分算及格。'],
    ['n.', 'an official document or ticket that allows entry or travel', '通行证；许可证', 'You need a pass to enter the building.', '你需要通行证才能进入这栋楼。']
  ],
  hit: [['n.', 'a very successful song, film, or product', '热门作品；成功产品', 'The song became an international hit.', '这首歌成了国际热门歌曲。']],
  stand: [['n.', 'a position or opinion that someone publicly supports', '立场；主张', 'The candidate explained her stand on education.', '候选人说明了她在教育问题上的立场。']],
  walk: [['n.', 'a journey made on foot, especially for pleasure', '步行；散步', 'We went for a walk after lunch.', '午饭后我们去散了步。']],
  stop: [['n.', 'a place where a bus or train stops', '车站；停靠点', 'Get off at the next bus stop.', '在下一站下公交车。']],
  watch: [['n.', 'a small clock worn on the wrist', '手表', 'My watch is five minutes fast.', '我的手表快了五分钟。']],
  win: [['n.', 'a victory in a game, competition, or election', '胜利；获胜', 'The team celebrated its first win of the season.', '球队庆祝本赛季的首场胜利。']],
  pay: [['n.', 'money received for doing a job', '工资；薪酬', 'Workers asked for better pay and safer conditions.', '工人们要求提高工资并改善安全条件。']],
  hold: [['n.', 'a way of gripping or controlling something', '抓握；控制', 'Keep a firm hold on the rail.', '牢牢抓住栏杆。']],
  reach: [
    ['n.', 'the distance within which someone can touch or get something', '伸手可及的范围', 'Keep the medicine out of children\'s reach.', '把药放在儿童够不到的地方。'],
    ['n.', 'the extent of someone\'s or something\'s influence or ability', '影响范围；能力范围', 'The campaign expanded the charity\'s reach.', '这场宣传活动扩大了该慈善机构的影响范围。']
  ],
  leave: [['n.', 'permission or time away from work or duty', '假期；准假', 'She is on maternity leave until June.', '她休产假到六月。']],
  stay: [['n.', 'a period of time spent in a place', '停留；逗留', 'We enjoyed our short stay in Hangzhou.', '我们很享受在杭州的短暂停留。']],
  try: [['n.', 'an attempt to do something, especially to see whether it works', '尝试；试用', 'Give the new method a try.', '试试这个新方法。']],
  share: [['n.', 'one of the parts into which something is divided', '一份；份额', 'Everyone paid an equal share of the cost.', '每个人都支付了同等份额的费用。']]
};

const meaningDefinitionCorrections = new Map([
  ['start|to begin an activity, process, movement', 'to begin an activity, process, or movement'],
  ['begin|to start an action, process, period', 'to start an action, process, or period'],
  ['love|to feel deep affection, greatly enjoy something', 'to feel deep affection for someone or greatly enjoy something'],
  ['wait|to stay until someone arrives, something happens', 'to stay until someone arrives or something happens'],
  ['choose|to decide which person, thing you want', 'to decide which person or thing you want'],
  ['cause|to make something happen, especially a result, problem', 'to make something happen, especially a result or problem'],
  ['describe|to say what someone, something is like', 'to say what someone or something is like'],
  ['protect|to keep someone, something safe', 'to keep someone or something safe'],
  ['compare|to examine how things are alike, different', 'to examine how things are alike or different'],
  ['reduce|to make something smaller, less', 'to make something smaller or less'],
  ['affect|to cause a change in someone, something', 'to cause a change in someone or something'],
  ['handle|to deal with a situation, task', 'to deal with a situation or task'],
  ['express|to show a thought, feeling in words, actions', 'to show a thought or feeling through words or actions']
]);

const reviewedMeaningReplacements = {
  develop: [
    ['v.', 'to grow, change, or become more advanced over time', '发展；成长', 'Trust develops gradually through honest communication.', '信任通过坦诚沟通逐渐建立起来。'],
    ['v.', 'to create, improve, or strengthen something over time', '开发；培养', 'Daily conversation can help you develop speaking skills.', '每天对话可以帮助你培养口语技能。'],
    ['v.', 'to begin to have a condition, problem, or quality', '逐渐产生；患上', 'He developed a strong interest in local history.', '他逐渐对当地历史产生了浓厚兴趣。']
  ],
  expect: [
    ['v.', 'to think that something will probably happen', '预期；预计', 'We expect the train to arrive at six, according to the timetable.', '根据时刻表，我们预计火车六点到达。'],
    ['v.', 'to require or believe that someone should do something', '要求；认为理应', 'The teacher expects us to check our work carefully.', '老师要求我们认真检查作业。']
  ],
  remain: [
    ['v.', 'to continue to be in the same state', '保持；仍然是', 'Please remain calm while we check the system.', '我们检查系统时请保持冷静。'],
    ['v.', 'to stay in a place or continue to exist after other things are gone', '留下；剩余', 'Only two questions remain.', '只剩下两个问题。']
  ],
  discover: [
    ['v.', 'to find something that was hidden or unknown', '发现；找到', 'The investigation helped them discover the truth.', '调查帮助他们发现了真相。'],
    ['v.', 'to learn or become aware of a fact for the first time', '得知；发觉', 'She discovered that the last train had already left.', '她发现末班车已经开走了。']
  ],
  watch: [
    ['v.', 'to look at a film, programme, game, or event', '观看', 'We watched the match together.', '我们一起观看了比赛。'],
    ['v.', 'to look at someone or something carefully over a period of time', '注视；观察', 'Watch how the colour changes as the water heats up.', '观察水加热时颜色如何变化。'],
    ['v.', 'to be careful about someone or something', '留意；当心', 'Watch your step on the wet floor.', '在湿滑的地面上当心脚下。']
  ],
  listen: [
    ['v.', 'to pay attention to a sound or to what someone is saying', '听；倾听', 'Please listen carefully to the instructions.', '请仔细听说明。']
  ],
  need: [
    ['v.', 'to require something because it is necessary', '需要；必须有', 'I need more time to understand this structure.', '我需要更多时间理解这个结构。'],
    ['v.', 'to have to do something', '需要；必须', 'You need to finish the sentence before submitting it.', '你需要在提交前完成句子。'],
    ['aux.', 'used in negatives to say that an action is not necessary', '不必；无须', 'You need not answer immediately.', '你不必立即回答。']
  ],
  may: [
    ['aux.', 'used to express possibility', '可能；也许', 'She may have taken an earlier train.', '她可能已经乘坐了更早的一班火车。'],
    ['aux.', 'used to ask for or give permission', '可以；获准', 'May I ask one more question?', '我可以再问一个问题吗？'],
    ['aux.', 'used in formal wishes and hopes', '愿；祝', 'May you have a safe journey home.', '祝你一路平安回家。']
  ],
  raise: [
    ['v.', 'to lift or move something to a higher position', '举起；抬高', 'Raise your hand if you know the answer.', '知道答案请举手。'],
    ['v.', 'to increase an amount, level, or price', '提高；增加', 'The company may raise prices next month.', '公司下个月可能涨价。'],
    ['v.', 'to collect money for a person, group, or purpose', '筹集（资金）', 'The concert raised money for the local hospital.', '这场音乐会为当地医院筹集了资金。'],
    ['v.', 'to mention a subject or question for discussion', '提出（问题）', 'The result raises an important question about timing.', '这个结果提出了一个关于时机的重要问题。']
  ],
  meet: [
    ['v.', 'to see and speak to someone for the first time or by chance', '遇见；认识', 'I first met her at a conference.', '我第一次见到她是在一次会议上。'],
    ['v.', 'to come together with someone by arrangement', '会面；集合', 'We meet every Monday to review the project.', '我们每周一开会审查项目。'],
    ['v.', 'to satisfy a need, condition, or standard', '满足；达到', 'The new design meets all the safety requirements.', '新设计符合所有安全要求。']
  ],
  share: [
    ['v.', 'to have or use something together with another person', '共同拥有；合用', 'I share an office with two colleagues.', '我和两位同事共用一间办公室。'],
    ['v.', 'to give part of something to another person', '分享；分给', 'She shared her lunch with me.', '她把午餐分给了我一些。'],
    ['v.', 'to tell other people about an idea, feeling, or experience', '讲述；交流', 'Please share your ideas with the group.', '请与小组分享你的想法。']
  ],
  live: [
    ['v.', 'to be alive', '活着；生存', 'Some sea turtles live for more than a hundred years.', '有些海龟能活一百多年。'],
    ['v.', 'to have your home in a particular place', '居住；生活', 'She lives near the university.', '她住在大学附近。'],
    ['v.', 'to spend your life in a particular way', '过着（某种生活）', 'They live a simple but happy life.', '他们过着简单而幸福的生活。'],
    ['adj.', 'broadcast or performed at the same time as it happens', '现场直播的；现场演出的', 'We watched a live broadcast of the final.', '我们观看了决赛的现场直播。', '/laɪv/']
  ]
};

function rowsFromPack(pack) {
  return pack.map(([partOfSpeech, english, chinese, example, translation, phonetic]) => ({
    partOfSpeech,
    english,
    chinese,
    example,
    translation,
    ...(phonetic ? { phonetic } : {})
  }));
}

export function appendCommonNounSenses(word, meanings) {
  const extras = commonNounSensePacks[word] ?? [];
  if (!extras.length || meanings.some((meaning) => /(?:^|\s)n\.(?:$|\s|\/)/i.test(meaning.partOfSpeech))) return meanings;
  return [
    ...meanings,
    ...extras.map(([partOfSpeech, english, chinese, example, translation, phonetic]) => ({
      partOfSpeech,
      english,
      chinese,
      example,
      translation,
      ...(phonetic ? { phonetic } : {})
    }))
  ];
}

export function finalizeMeaningRows(word, meanings, { authoritative = false } = {}) {
  if (authoritative) return meanings.map((meaning) => ({ ...meaning }));
  const reviewed = reviewedMeaningReplacements[word]
    ? rowsFromPack(reviewedMeaningReplacements[word])
    : meanings.map((meaning) => ({
      ...meaning,
      english: meaningDefinitionCorrections.get(`${word}|${meaning.english}`) ?? meaning.english
    }));
  return appendCommonNounSenses(word, reviewed);
}

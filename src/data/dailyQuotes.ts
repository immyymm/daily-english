export interface DailyQuote {
  title: string;
  body: string;
}

const dailyQuotes: DailyQuote[] = [
  { title: '今天学会的词，会在未来替你开口。', body: '不用着急变得完美，认真记住一点点，就是很好的前进。' },
  { title: '慢慢积累，也是在闪闪发光。', body: '五个词不多，却足以让今天比昨天更有力量。' },
  { title: '每一次开口，都是勇气在生长。', body: '允许自己说得不完美，表达会在练习里越来越自然。' },
  { title: '把小小的坚持，种成大大的可能。', body: '今天的几分钟，会悄悄变成以后从容表达的底气。' },
  { title: '你认真走过的每一步，都算数。', body: '记住一个词、读好一句话，也值得为自己开心。' },
  { title: '新的语言，也会带你看见新的世界。', body: '保持好奇，今天的五个词正在为你打开一扇小窗。' },
  { title: '先相信自己，再给进步一点时间。', body: '学习不是比赛，找到自己的节奏，就已经很棒。' },
  { title: '温柔地坚持，也可以走得很远。', body: '不用一次学很多，只要今天依然愿意开始。' },
  { title: '你正在成为更会表达的自己。', body: '每一次听、读、想和说，都在让词汇真正属于你。' },
  { title: '今日份努力，会被未来的你收到。', body: '把五个词学深、用活，比匆匆看过更多词更珍贵。' },
  { title: '好奇心，是学习里最亮的小太阳。', body: '多问一句“它还能怎么用”，就会多发现一种表达。' },
  { title: '不怕走得慢，只怕忘了为自己鼓掌。', body: '看见已经学会的部分，也给还不熟练的部分一点耐心。' },
  { title: '语言会回应每一次真诚的练习。', body: '读出声音、放进句子，陌生的词就会慢慢变成朋友。' },
  { title: '今天也请带着期待，向前一点点。', body: '新的五个词、新的五种可能，正在等你发现。' }
];

export function quoteForStudyDay(studyDay: number): DailyQuote {
  return dailyQuotes[(Math.max(1, studyDay) - 1) % dailyQuotes.length];
}

export const learningPosOrder = ['verb', 'noun', 'adjective', 'adverb', 'other'];

const cocaPosByGroup = {
  verb: 'v',
  noun: 'n',
  adjective: 'j',
  adverb: 'r'
};

const groupLabel = {
  verb: '动词',
  noun: '名词',
  adjective: '形容词',
  adverb: '副词',
  other: '其他词性'
};

export function primaryLearningPos(partOfSpeech) {
  const primary = partOfSpeech.split('/')[0].trim().replaceAll('.', '').toLowerCase();
  if (primary === 'v') return 'verb';
  if (primary === 'n') return 'noun';
  if (primary === 'adj' || primary === 'j') return 'adjective';
  if (primary === 'adv' || primary === 'r') return 'adverb';
  return 'other';
}

export function primaryCocaRank(item, cocaRankData) {
  const group = primaryLearningPos(item.p);
  const cocaPos = cocaPosByGroup[group];
  const ranks = cocaRankData[item.w] ?? [];
  const primary = ranks.find((entry) => entry.pos === cocaPos);
  return primary?.rank ?? Math.min(...ranks.map((entry) => entry.rank), Number.MAX_SAFE_INTEGER);
}

export function sortLexiconForLearning(items, cocaRankData) {
  return [...items].sort((left, right) => {
    const leftGroup = primaryLearningPos(left.p);
    const rightGroup = primaryLearningPos(right.p);
    return learningPosOrder.indexOf(leftGroup) - learningPosOrder.indexOf(rightGroup)
      || primaryCocaRank(left, cocaRankData) - primaryCocaRank(right, cocaRankData)
      || left.w.localeCompare(right.w, 'en');
  });
}

export function learningPriority(item, sequence, cocaRankData) {
  const group = primaryLearningPos(item.p);
  return {
    sequence,
    group,
    groupLabel: groupLabel[group],
    groupOrder: learningPosOrder.indexOf(group) + 1,
    primaryCocaRank: primaryCocaRank(item, cocaRankData)
  };
}

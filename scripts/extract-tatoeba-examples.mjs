import fs from 'node:fs/promises';
import path from 'node:path';
import OpenCC from 'opencc-js';

const inputPath = process.argv[2];
if (!inputPath) {
  throw new Error('Usage: node scripts/extract-tatoeba-examples.mjs <cmn.txt>');
}

const root = path.resolve(import.meta.dirname, '..');
const catalog = JSON.parse(await fs.readFile(path.join(root, 'public', 'data', 'all-cards.json'), 'utf8'));
const simplify = OpenCC.Converter({ from: 'tw', to: 'cn' });
const simplifyChinese = (value) => simplify(value)
  .replace(/怎幺/g, '怎么')
  .replace(/甚么/g, '什么')
  .replace(/什幺/g, '什么')
  .replace(/那幺/g, '那么')
  .replace(/这幺/g, '这么')
  .replace(/想像/g, '想象');
const rows = (await fs.readFile(path.resolve(inputPath), 'utf8'))
  .split(/\r?\n/)
  .map((line) => line.split('\t'))
  .filter(([english, chinese, attribution]) => english && chinese && attribution);

const irregularForms = {
  be: ['am', 'is', 'are', 'was', 'were', 'been', 'being'], become: ['became', 'becoming'], begin: ['began', 'begun'], break: ['broke', 'broken'],
  bring: ['brought'], buy: ['bought'], choose: ['chose', 'chosen'], come: ['came'], cut: ['cut'], do: ['does', 'did', 'done', 'doing'],
  drive: ['drove', 'driven'], eat: ['ate', 'eaten'], fall: ['fell', 'fallen'], feel: ['felt'], find: ['found'], get: ['got', 'gotten'], give: ['gave', 'given'],
  go: ['went', 'gone'], grow: ['grew', 'grown'], have: ['has', 'had'], hear: ['heard'], hit: ['hit'], hold: ['held'], keep: ['kept'], know: ['knew', 'known'],
  lead: ['led'], leave: ['left'], lose: ['lost'], make: ['made'], mean: ['meant'], meet: ['met'], pay: ['paid'], put: ['put'], read: ['read'],
  run: ['ran', 'running'], say: ['said'], see: ['saw', 'seen'], sell: ['sold'], send: ['sent'], set: ['set'], should: ['should'], sit: ['sat'], speak: ['spoke', 'spoken'],
  spend: ['spent'], stand: ['stood'], take: ['took', 'taken'], tell: ['told'], think: ['thought'], understand: ['understood'], wear: ['wore', 'worn'],
  win: ['won'], write: ['wrote', 'written']
};

const modalWords = new Set(['can', 'could', 'may', 'might', 'must', 'should', 'will', 'would']);

function inflectedForms(word) {
  if (modalWords.has(word)) return new Set([word]);
  const forms = new Set([word, `${word}s`, `${word}es`, `${word}ed`, `${word}ing`]);
  if (word.endsWith('e')) {
    forms.add(`${word}d`);
    forms.add(`${word.slice(0, -1)}ing`);
  }
  if (/[^aeiou]y$/.test(word)) {
    forms.add(`${word.slice(0, -1)}ies`);
    forms.add(`${word.slice(0, -1)}ied`);
  }
  if (/[^aeiou][aeiou][^aeiouwxy]$/.test(word)) {
    forms.add(`${word}${word.at(-1)}ed`);
    forms.add(`${word}${word.at(-1)}ing`);
  }
  (irregularForms[word] ?? []).forEach((form) => forms.add(form));
  return forms;
}

const determiners = new Set(['a', 'an', 'the', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'some', 'any']);
const verbalPredecessors = new Set(['i', 'you', 'we', 'they', 'he', 'she', 'it', 'who', 'to', 'please', 'not', 'never', 'always', 'often', 'usually', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'has', 'have', 'had', 'can', 'could', 'may', 'might', 'must', 'should', 'will', 'would', 'do', 'does', 'did']);
const ingNounSignalsBefore = new Set(['a', 'an', 'the', 'this', 'that', 'these', 'those', 'from', 'at', 'of', 'my', 'your', 'his', 'her', 'its', 'our', 'their']);
const ingNounSignalsAfter = new Set(['is', 'are', 'was', 'were', 'has', 'have', 'had', 'of']);
const catalogWords = new Set(catalog.cards.map((card) => card.word));
const rejectedNames = /\b(?:Tom|Mary|John|Alice|Bob|Jack|Jane|Sami|Layla|Boston|Tokyo|Japan|French|German)\b/;
const rejectedTopics = /\b(?:kill yourself|suicide|murder|naked|sex|drunk|idiot|stupid|hate you)\b/i;

function words(text) {
  return text.match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g) ?? [];
}

function findTarget(tokens, forms) {
  return tokens.findIndex((token) => forms.has(token.toLowerCase()));
}

function isLikelyVerbUse(card, tokens, targetIndex) {
  const word = card.word;
  const form = tokens[targetIndex].toLowerCase();
  const previous = tokens[targetIndex - 1]?.toLowerCase();
  const next = tokens[targetIndex + 1]?.toLowerCase();
  if (determiners.has(previous)) return false;
  if (modalWords.has(word)) return !determiners.has(previous) && !(word === 'can' && /^(of|for|with)$/.test(next ?? ''));
  if (word === 'go' && form === 'going' && next === 'to' && catalogWords.has(tokens[targetIndex + 2]?.toLowerCase())) return false;
  if (word === 'use' && form === 'used' && next === 'to') return false;
  if (word === 'thank' && form === 'thanks') return false;
  if (word === 'encourage' && form === 'encouraging' && next === 'signs') return false;
  if (word === 'like' && /^(look|looks|looked|feel|feels|felt|sound|sounds|seem|seems)$/i.test(previous ?? '')) return false;
  if (word === 'base' && form === 'base' && !/^(on|upon|around)$/.test(next ?? '')) return false;
  if (/ing$/.test(form) && form !== word && (ingNounSignalsBefore.has(previous) || ingNounSignalsAfter.has(next))) return false;
  if (/ing$/.test(form) && form !== word
    && !verbalPredecessors.has(previous)
    && !/^(?:by|after|before|without|for|in|on)$/.test(previous ?? '')
    && next !== 'to'
    && !determiners.has(next)) return false;
  if (word === 'leave' && form === 'left' && targetIndex > 1 && !verbalPredecessors.has(previous)) return false;
  const includesNounSense = card.meanings.some((meaning) => /(?:^|\s)n\./.test(meaning.partOfSpeech));
  const isRegularPastOrParticiple = /(?:ed|ing)$/.test(form) && form !== word;
  const isIrregularVerbForm = (irregularForms[word] ?? []).includes(form) && form !== word;
  if (!includesNounSense && !isRegularPastOrParticiple && !isIrregularVerbForm
    && targetIndex > 0 && !verbalPredecessors.has(previous)) return false;
  if (!includesNounSense && /^(and|or)$/.test(next ?? '')) return false;
  return true;
}

function qualityScore(english, tokens, targetIndex, word) {
  const lengthScore = 30 - Math.abs(tokens.length - 8) * 2;
  const targetFormScore = tokens[targetIndex].toLowerCase() === word ? 8 : 3;
  const punctuationScore = /[.!?]$/.test(english) ? 3 : 0;
  const properNounPenalty = tokens.slice(1).filter((token) => /^[A-Z]/.test(token)).length * 4;
  const quotePenalty = /["“”]/.test(english) ? 6 : 0;
  return lengthScore + targetFormScore + punctuationScore - properNounPenalty - quotePenalty;
}

const entries = {};
const coverage = [];
for (const card of catalog.cards) {
  const forms = inflectedForms(card.word);
  const baselineExamples = card.detailLevel === 'template-complete' ? card.examples.slice(0, 6) : card.examples;
  const baselinePhrases = card.detailLevel === 'template-complete' ? card.fixedPhrases.slice(0, 6) : card.fixedPhrases;
  const existing = new Set([
    ...baselineExamples.map((entry) => entry.english),
    ...baselinePhrases.map((entry) => entry.example),
    ...card.meanings.map((entry) => entry.example)
  ].map((value) => value.toLowerCase().replace(/\s+/g, ' ').trim()));
  const seen = new Set();
  const candidates = [];
  for (const [englishRaw, chineseRaw, attribution] of rows) {
    const english = englishRaw.replace(/\s+/g, ' ').trim();
    const chinese = simplifyChinese(chineseRaw.replace(/\s+/g, ' ').trim());
    const tokens = words(english);
    if (tokens.length < 4 || tokens.length > 14 || english.length > 100 || chinese.length > 55) continue;
    if (!/[\u3400-\u9fff]/.test(chinese) || rejectedNames.test(english) || rejectedTopics.test(english)) continue;
    const targetIndex = findTarget(tokens, forms);
    if (targetIndex < 0 || !isLikelyVerbUse(card, tokens, targetIndex)) continue;
    const key = english.toLowerCase();
    const chineseKey = chinese.replace(/[，。！？、；：\s]/g, '');
    if (existing.has(key) || seen.has(key) || seen.has(chineseKey)) continue;
    seen.add(key);
    seen.add(chineseKey);
    candidates.push({
      english,
      chinese,
      attribution: attribution.replace(/^CC-BY 2\.0 \(France\) Attribution:\s*/i, ''),
      score: qualityScore(english, tokens, targetIndex, card.word)
    });
  }
  candidates.sort((left, right) => right.score - left.score || left.english.localeCompare(right.english));
  entries[card.word] = candidates.slice(0, 8).map(({ score: _score, ...entry }) => entry);
  coverage.push({ word: card.word, selected: entries[card.word].length, candidates: candidates.length });
}

await fs.writeFile(path.join(root, 'scripts', 'tatoeba-examples.json'), `${JSON.stringify({
  source: {
    name: 'Tatoeba Mandarin Chinese - English sentence pairs (ManyThings selected export)',
    snapshotDate: '2026-02-13',
    license: 'CC BY 2.0 France',
    attribution: 'www.manythings.org/anki and tatoeba.org'
  },
  entries
}, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  cards: coverage.length,
  atLeastSix: coverage.filter((entry) => entry.selected >= 6).length,
  belowSix: coverage.filter((entry) => entry.selected < 6)
}, null, 2));

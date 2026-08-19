import { dictionary } from 'cmu-pronouncing-dictionary';

const phonemes = {
  AA: 'ɑ', AE: 'æ', AH: 'ʌ', AO: 'ɔː', AW: 'aʊ', AY: 'aɪ',
  B: 'b', CH: 'tʃ', D: 'd', DH: 'ð', EH: 'ɛ', ER: 'ɝː', EY: 'eɪ',
  F: 'f', G: 'ɡ', HH: 'h', IH: 'ɪ', IY: 'iː', JH: 'dʒ', K: 'k',
  L: 'l', M: 'm', N: 'n', NG: 'ŋ', OW: 'oʊ', OY: 'ɔɪ', P: 'p',
  R: 'r', S: 's', SH: 'ʃ', T: 't', TH: 'θ', UH: 'ʊ', UW: 'uː',
  V: 'v', W: 'w', Y: 'j', Z: 'z', ZH: 'ʒ'
};

function arpabetToIpa(value) {
  const rendered = [];
  let syllableStart = 0;
  for (const token of value.split(' ')) {
    const base = token.replace(/[012]$/, '');
    const stress = token.match(/[12]$/)?.[0];
    if (stress) rendered.splice(syllableStart, 0, stress === '1' ? 'ˈ' : 'ˌ');
    if (base === 'AH' && token.endsWith('0')) rendered.push('ə');
    else if (base === 'ER' && token.endsWith('0')) rendered.push('ɚ');
    else rendered.push(phonemes[base] ?? '');
    if (/[012]$/.test(token)) syllableStart = rendered.length;
  }
  return rendered.join('');
}

function wordIpa(word, targetWord, targetIpa) {
  const normalized = word.toLowerCase().replace(/^[^a-z']+|[^a-z']+$/g, '');
  if (!normalized) return '';
  if (normalized === targetWord.toLowerCase()) return targetIpa.replaceAll('/', '');
  const pronunciation = dictionary[normalized] ?? dictionary[normalized.replaceAll("'", '')];
  return pronunciation ? arpabetToIpa(pronunciation) : normalized;
}

export function ipaFor(text, targetWord = '', targetIpa = '') {
  const tokens = text
    .replace(/[“”"(),.;:!?]/g, ' ')
    .split(/([\s/-]+)/)
    .filter((token) => token && !/^\s+$/.test(token));
  const rendered = tokens.map((token) => {
    if (token === '/' || token === '-') return token;
    return wordIpa(token, targetWord, targetIpa);
  }).filter(Boolean).join(' ').replace(/\s+([/-])\s+/g, '$1');
  return '/' + rendered + '/';
}

import { dictionary } from 'cmu-pronouncing-dictionary';

const phonemes = {
  AA: 'ɑ', AE: 'æ', AH: 'ʌ', AO: 'ɔ', AW: 'aʊ', AY: 'aɪ',
  B: 'b', CH: 'tʃ', D: 'd', DH: 'ð', EH: 'ɛ', ER: 'ɝ', EY: 'eɪ',
  F: 'f', G: 'ɡ', HH: 'h', IH: 'ɪ', IY: 'i', JH: 'dʒ', K: 'k',
  L: 'l', M: 'm', N: 'n', NG: 'ŋ', OW: 'oʊ', OY: 'ɔɪ', P: 'p',
  R: 'r', S: 's', SH: 'ʃ', T: 't', TH: 'θ', UH: 'ʊ', UW: 'u',
  V: 'v', W: 'w', Y: 'j', Z: 'z', ZH: 'ʒ'
};

function arpabetToIpa(value) {
  return value.split(' ').map((token) => {
    const base = token.replace(/[012]$/, '');
    if (base === 'AH' && token.endsWith('0')) return 'ə';
    if (base === 'ER' && token.endsWith('0')) return 'ɚ';
    return phonemes[base] ?? '';
  }).join('');
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

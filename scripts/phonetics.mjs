import { dictionary } from 'cmu-pronouncing-dictionary';

const phonemes = {
  AA: 'ɑ', AE: 'æ', AH: 'ʌ', AO: 'ɔː', AW: 'aʊ', AY: 'aɪ',
  B: 'b', CH: 'tʃ', D: 'd', DH: 'ð', EH: 'ɛ', ER: 'ɝː', EY: 'eɪ',
  F: 'f', G: 'ɡ', HH: 'h', IH: 'ɪ', IY: 'iː', JH: 'dʒ', K: 'k',
  L: 'l', M: 'm', N: 'n', NG: 'ŋ', OW: 'oʊ', OY: 'ɔɪ', P: 'p',
  R: 'r', S: 's', SH: 'ʃ', T: 't', TH: 'θ', UH: 'ʊ', UW: 'uː',
  V: 'v', W: 'w', Y: 'j', Z: 'z', ZH: 'ʒ'
};

// CMUdict is deliberately the primary source, but it has a few gaps and one
// unsuitable broad transcription in the vocabulary used by the cards.  Keep
// reviewed exceptions here instead of ever falling back to English spelling.
const lexicalIpaOverrides = {
  agreeably: 'əˈɡriːəbli',
  'all-time': 'ˈɔːlˌtaɪm',
  audiobook: 'ˈɑːdioʊbʊk',
  bilingually: 'baɪˈlɪŋɡwəli',
  causally: 'ˈkɔːzəli',
  chooser: 'ˈtʃuːzər',
  descriptively: 'dɪˈskrɪptɪvli',
  developmental: 'dɪˌvɛləpˈmɛntəl',
  discourage: 'dɪsˈkɝːɪdʒ',
  discouraging: 'dɪsˈkɝːɪdʒɪŋ',
  discoverer: 'dɪˈskʌvərər',
  discovery: 'dɪˈskʌvəri',
  duration: 'dʊˈreɪʃən',
  doer: 'ˈduːər',
  encouragingly: 'ɪnˈkɜːrɪdʒɪŋli',
  expressiveness: 'ɪkˈspresɪvnəs',
  expressively: 'ɪkˈspresɪvli',
  expressionless: 'ɪkˈsprɛʃənləs',
  'far-reaching': 'ˌfɑːrˈriːtʃɪŋ',
  forgetfulness: 'fərˈɡɛtfəlnəs',
  healthily: 'ˈhɛlθəli',
  hear: 'hɪr',
  hearing: 'ˈhɪrɪŋ',
  hearsay: 'ˈhɪrˌseɪ',
  interrogative: 'ˌɪntəˈrɑːɡətɪv',
  inclusivity: 'ˌɪnkluˈsɪvəti',
  indescribably: 'ˌɪndɪˈskraɪbəbli',
  improved: 'ɪmˈpruːvd',
  improvement: 'ɪmˈpruːvmənt',
  improving: 'ɪmˈpruːvɪŋ',
  increasing: 'ɪnˈkriːsɪŋ',
  increasingly: 'ɪnˈkriːsɪŋli',
  address: 'ˈædrɛs',
  contract: 'ˈkɑːntrækt',
  impact: 'ɪmˈpækt',
  increase: 'ɪnˈkriːs',
  imported: 'ɪmˈpɔːrtɪd',
  kilometers: 'kəˈlɑːmɪtərz',
  leaved: 'liːvd',
  legibly: 'ˈlɛdʒəbli',
  live: 'lɪv',
  neediness: 'ˈniːdinəs',
  newfound: 'ˈnuːˌfaʊnd',
  unnoticed: 'ˌʌnˈnoʊtɪst',
  overhear: 'ˌoʊvɚˈhɪr',
  pedometer: 'pɪˈdɑːmətər',
  pickiness: 'ˈpɪkinəs',
  ringtone: 'ˈrɪŋtoʊn',
  reachability: 'ˌriːtʃəˈbɪləti',
  realization: 'ˌriːələˈzeɪʃən',
  report: 'rɪˈpɔːrt',
  reporting: 'rɪˈpɔːrtɪŋ',
  read: 'riːd',
  research: 'ˈriːsɝːtʃ',
  required: 'rɪˈkwaɪrd',
  returnable: 'rɪˈtɝːnəbəl',
  remake: 'ˌriːˈmeɪk',
  rerun: 'ˌriːˈrʌn',
  sellable: 'ˈsɛləbəl',
  shareable: 'ˈʃerəbəl',
  shareholder: 'ˈʃerˌhoʊldər',
  shortlist: 'ˈʃɔːrtlɪst',
  showiness: 'ˈʃoʊinəs',
  solvability: 'ˌsɑːlvəˈbɪləti',
  sustainably: 'səˈsteɪnəbli',
  subject: 'ˈsʌbdʒɪkt',
  suggestively: 'səˈdʒɛstɪvli',
  'self-explanatory': 'ˌsɛlfɪkˈsplænətɔːri',
  talkativeness: 'ˈtɔːkətɪvnəs',
  twofold: 'ˈtuːfoʊld',
  shanghai: 'ˌʃæŋˈhaɪ',
  downstream: 'ˌdaʊnˈstriːm',
  outside: 'ˌaʊtˈsaɪd',
  handmade: 'ˌhændˈmeɪd',
  overseas: 'ˌoʊvɚˈsiːz',
  overnight: 'ˌoʊvɚˈnaɪt',
  worldwide: 'ˌwɝːldˈwaɪd',
  uphill: 'ˌʌpˈhɪl',
  widespread: 'ˈwaɪdˌsprɛd',
  lifelong: 'ˈlaɪfˌlɔːŋ',
  unachievable: 'ˌʌnəˈtʃiːvəbəl',
  unasked: 'ˌʌnˈæskt',
  unacceptable: 'ˌʌnəkˈsɛptəbəl',
  unavoidably: 'ˌʌnəˈvɔɪdəbli',
  unlearn: 'ˌʌnˈlɝːn',
  unmanageable: 'ˌʌnˈmænɪdʒəbəl',
  unprepared: 'ˌʌnprɪˈperd',
  unreachable: 'ˌʌnˈriːtʃəbəl',
  unrealized: 'ˌʌnˈriːəlaɪzd',
  unsolved: 'ˌʌnˈsɑːlvd',
  unsupported: 'ˌʌnsəˈpɔːrtɪd',
  attendee: 'əˌtɛnˈdiː',
  vend: 'ˈvɛnd',
  waitlist: 'ˈweɪtˌlɪst',
  walkable: 'ˈwɔːkəbəl',
  watchfulness: 'ˈwɑːtʃfəlnəs',
  writable: 'ˈraɪtəbəl',
  comparison: 'kəmˈperəsən',
  'cross-departmental': 'ˌkrɔːsdɪˌpɑːrtˈmɛntəl',
  'cross-legged': 'ˌkrɔːsˈlɛɡɪd',
  downstairs: 'ˌdaʊnˈstɛrz',
  downtown: 'ˌdaʊnˈtaʊn',
  'follow-up': 'ˈfɑːloʊˌʌp',
  'full-time': 'ˈfʊlˌtaɪm',
  'gluten-free': 'ˌɡluːtənˈfriː',
  halfway: 'ˌhæfˈweɪ',
  headfirst: 'ˈhɛdˌfɝːst',
  'long-term': 'ˈlɔːŋˌtɝːm',
  'low-cost': 'ˈloʊˌkɑːst',
  mismanage: 'ˌmɪsˈmænɪdʒ',
  mismanagement: 'ˌmɪsˈmænɪdʒmənt',
  'must-have': 'ˈmʌstˌhæv',
  nearby: 'ˌnɪrˈbaɪ',
  outdoors: 'ˌaʊtˈdɔːrz',
  overdo: 'ˌoʊvɚˈduː',
  'part-time': 'ˈpɑːrtˌtaɪm',
  prepared: 'prɪˈperd',
  progress: 'ˈprɑːɡrɛs',
  'resource-allocation': 'ˌriːsɔːrsˌæləˈkeɪʃən',
  'self-control': 'ˌsɛlfkənˈtroʊl',
  'self-explanatory': 'ˌsɛlfɪkˈsplænətɔːri',
  'six-month': 'ˈsɪksˌmʌnθ',
  'trade-off': 'ˈtreɪdˌɔːf',
  upside: 'ˈʌpˌsaɪd',
  // In a grammar label such as "wh- + clause", wh is read as the two
  // letter names.  It must not leak into the IPA as the ASCII string "wh".
  wh: 'ˌdʌbəljuːˈeɪtʃ'
};

const wholeExpressionIpaOverrides = {
  'far-reaching': 'ˌfɑːrˈriːtʃɪŋ',
  'self-explanatory': 'ˌsɛlfɪkˈsplænətɔːri',
  'long-term': 'ˈlɔːŋˌtɝːm',
  'six-month': 'ˈsɪksˌmʌnθ'
};

const partOfSpeechIpaOverrides = {
  accent: { n: 'ˈæksent' },
  address: { n: 'ˈædrɛs', v: 'əˈdrɛs' },
  concrete: { n: 'ˈkɑːnkriːt' },
  contract: { n: 'ˈkɑːntrækt' },
  contrast: { v: 'kənˈtræst' },
  converse: { v: 'kənˈvɝːs' },
  discount: { n: 'ˈdɪskaʊnt' },
  impact: { n: 'ˈɪmpækt', v: 'ɪmˈpækt' },
  import: { n: 'ˈɪmpɔːrt', v: 'ɪmˈpɔːrt' },
  increase: { v: 'ɪnˈkriːs' },
  insult: { n: 'ˈɪnsʌlt' },
  merchandise: { n: 'ˈmɝːtʃəndaɪs', v: 'ˈmɝːtʃəndaɪz' },
  object: { v: 'əbˈdʒɛkt' },
  present: { v: 'prɪˈzɛnt' },
  progress: { n: 'ˈprɑːɡrɛs', v: 'prəˈɡrɛs' },
  produce: { n: 'ˈproʊduːs' },
  recall: { v: 'rɪˈkɔːl' },
  recess: { n: 'ˈriːses' },
  record: { n: 'ˈrɛkərd', v: 'rɪˈkɔːrd' },
  refund: { n: 'ˈriːfʌnd' },
  research: { n: 'ˈriːsɝːtʃ' },
  subject: { n: 'ˈsʌbdʒɪkt' },
  suspect: { n: 'ˈsʌspɛkt' },
  survey: { n: 'ˈsɝːveɪ' },
  transfer: { v: 'trænsˈfɝː' },
  transport: { n: 'ˈtrænspɔːrt', v: 'trænˈspɔːrt' },
  update: { n: 'ˈʌpdeɪt' }
};

export class IpaGenerationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'IpaGenerationError';
  }
}

function normalizeOrthography(value) {
  return String(value ?? '').normalize('NFKC').replace(/[‘’]/g, "'");
}

function normalizeWord(value) {
  return normalizeOrthography(value).toLowerCase().replace(/^[^a-z']+|[^a-z']+$/g, '');
}

function arpabetToIpa(value) {
  const rendered = [];
  let syllableStart = 0;
  let consonantsSinceVowel = [];
  // Put a stress mark before the largest consonant suffix that can begin an
  // English syllable.  CMU supplies phonemes and stress, not syllable
  // boundaries; placing stress before the whole intervocalic cluster produces
  // errors such as /ɪˈmpr.../ and /kəˈmp.../.
  const legalOnsets = new Set([
    'B', 'CH', 'D', 'DH', 'F', 'G', 'HH', 'JH', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'SH', 'T', 'TH', 'V', 'W', 'Y', 'Z', 'ZH',
    'B L', 'B R', 'B Y', 'D R', 'D W', 'D Y', 'F L', 'F R', 'F Y', 'G L', 'G R', 'G W', 'G Y',
    'HH Y', 'K L', 'K R', 'K W', 'K Y', 'L Y', 'M Y', 'N', 'N Y', 'P L', 'P R', 'P Y',
    'S K', 'S L', 'S M', 'S N', 'S P', 'S T', 'S W', 'S Y', 'SH R', 'SH Y', 'T R', 'T W', 'T Y',
    'TH R', 'TH W', 'TH Y', 'V R', 'V Y', 'Z Y',
    'S K R', 'S K W', 'S K Y', 'S P L', 'S P R', 'S T R'
  ]);
  const onsetLength = () => {
    for (let length = Math.min(3, consonantsSinceVowel.length); length >= 1; length -= 1) {
      if (legalOnsets.has(consonantsSinceVowel.slice(-length).join(' '))) return length;
    }
    return 0;
  };
  for (const token of value.split(' ')) {
    const base = token.replace(/[012]$/, '');
    const stress = token.match(/[12]$/)?.[0];
    if (stress) {
      const onset = onsetLength();
      rendered.splice(Math.max(syllableStart, rendered.length - onset), 0, stress === '1' ? 'ˈ' : 'ˌ');
    }
    if (base === 'AH' && token.endsWith('0')) rendered.push('ə');
    else if (base === 'IY' && token.endsWith('0')) rendered.push('i');
    else if (base === 'UW' && token.endsWith('0')) rendered.push('u');
    else if (base === 'ER' && token.endsWith('0')) rendered.push('ɚ');
    else {
      const phoneme = phonemes[base];
      if (!phoneme) throw new IpaGenerationError(`Unsupported ARPABET phoneme: ${token}`);
      rendered.push(phoneme);
    }
    if (/[012]$/.test(token)) {
      syllableStart = rendered.length;
      consonantsSinceVowel = [];
    } else {
      consonantsSinceVowel.push(base);
    }
  }
  return rendered.join('');
}

function wordIpa(word, targetWord, targetIpa, metadata = {}) {
  const normalized = normalizeWord(word);
  if (!normalized) return '';
  const partOfSpeech = String(metadata?.partOfSpeech ?? '').toLowerCase();
  const chinese = String(metadata?.chinese ?? '');
  const hasVerb = /(?:^|[\s/])(?:v|vt|vi|modal v)\./.test(partOfSpeech);
  const hasNoun = /(?:^|[\s/])n\./.test(partOfSpeech);
  const requestedClass = hasVerb && !hasNoun ? 'v' : hasNoun && !hasVerb ? 'n' : '';
  if (normalized === 'bass' && hasNoun && /(?:低音|低音乐器|贝斯)/.test(chinese)) return 'beɪs';
  const partOfSpeechIpa = requestedClass && partOfSpeechIpaOverrides[normalized]?.[requestedClass];
  if (partOfSpeechIpa) return partOfSpeechIpa;
  const reviewedIpa = lexicalIpaOverrides[normalized];
  if (reviewedIpa) return reviewedIpa;
  if (normalized.includes('-')) {
    const parts = normalized.split('-').filter(Boolean);
    if (parts.length < 2) throw new IpaGenerationError(`Invalid hyphenated word: "${normalized}".`);
    const tens = new Set(['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']);
    // Productive compounds still occur inside reviewed examples (for example
    // fifty-four). Keep the written word intact and assign one deliberate
    // compound-level primary stress instead of giving every segment one.
    const primaryPart = tens.has(parts[0]) ? parts.length - 1 : 0;
    return parts.map((part, index) => {
      const partIpa = wordIpa(part, '', '', {});
      if (index !== primaryPart) return partIpa.replaceAll('ˈ', 'ˌ');
      let keptPrimary = false;
      const normalizedStress = partIpa.replace(/ˈ/g, () => {
        if (!keptPrimary) {
          keptPrimary = true;
          return 'ˈ';
        }
        return 'ˌ';
      });
      return keptPrimary ? normalizedStress : `ˈ${normalizedStress}`;
    }).join('');
  }
  if (targetIpa && normalized === normalizeWord(targetWord)) {
    const renderedTarget = targetIpa.replaceAll('/', '').trim();
    if (!renderedTarget) throw new IpaGenerationError(`Empty target IPA for "${normalized}".`);
    return renderedTarget;
  }
  const pronunciation = dictionary[normalized] ?? dictionary[normalized.replaceAll("'", '')];
  if (!pronunciation) {
    throw new IpaGenerationError(`No American IPA pronunciation is available for "${normalized}".`);
  }
  return arpabetToIpa(pronunciation);
}

export function ipaFor(text, targetWord = '', targetIpa = '', metadata = {}) {
  const normalizedText = normalizeOrthography(text);
  const reviewedWholeExpression = wholeExpressionIpaOverrides[normalizedText.toLowerCase().trim()];
  if (reviewedWholeExpression) return `/${reviewedWholeExpression}/`;
  const nounUseContext = /\b(?:make\s+(?:(?:full|good|effective|practical|the\s+best)\s+)?use\s+of|put\b.{0,40}\bto\s+(?:good\s+)?use|be\s+of\s+(?:(?:great|some|little|no|practical)\s+)?use\s+to|come\s+into\s+use|go\s+out\s+of\s+use|the\s+use\s+of|for\s+(?:(?:future|personal|public|repeated|normal)\s+)?use|under\s+normal\s+use|(?:public|personal|repeated|future)\s+use|in\s+use|no\s+use)\b/i.test(normalizedText);
  const longILiveContext = /\b(?:go\s+live|live\s+(?:television|audience|electrical\s+wire|data|broadcast|performance|music|show|event|coverage|stream|wire))\b/i.test(normalizedText);
  const presentReadContext = /\b(?:(?:can|could|may|might|must|should|will|would)\b.{0,18}\bread|to\s+read|read\s+music)\b/i.test(normalizedText);
  const pastReadContext = /\b(?:have|has|had)\s+read\b|\bread\b.{0,40}\b(?:yesterday|last\s+(?:night|week|month|year))\b/i.test(normalizedText);
  const longELeadContext = /\b(?:(?:can|could|may|might|must|should|will|would)|to)\s+lead\b|\blead\b.{0,24}\bto\b|\b(?:take|have|hold|gain|lose)\s+the\s+lead\b|\bin\s+the\s+lead\b/i.test(normalizedText);
  const verbUseContext = /\b(?:(?:can|could|may|might|must|should|will|would)\b.{0,24}\buse|to\s+use|use\s+jointly)\b/i.test(normalizedText);
  const nounRecordContext = /\b(?:keep|create|set|break|reach|hit|provide)\b.{0,30}\brecords?\b|\bappear\s+(?:on|in)\b.{0,20}\brecords?\b/i.test(normalizedText);
  const verbConductContext = /\bconduct\s+research\b/i.test(normalizedText);
  const nounProduceContext = /\bsell\b.{0,24}\bproduce\b/i.test(normalizedText);
  const nounIncreaseContext = /\b(?:a|an|the|sharp|large|small|significant|steady|rapid)\s+increase\b/i.test(normalizedText);
  const verbAddressContext = /\baddress\s+(?:local\s+)?(?:needs|concerns|problems|issues|questions|risks)\b/i.test(normalizedText);
  const verbObjectContext = /\b(?:should\b.{0,24}\bobject|object\s+to)\b/i.test(normalizedText);
  const nounWindContext = /\b(?:feel\s+the|like\s+the)\s+wind\b/i.test(normalizedText);
  const nounWoundContext = /\b(?:a|the)\s+wound\b|\bwound\s+heal\b/i.test(normalizedText);
  const nounAccentContext = /\b(?:a|an|the|formal|regional|foreign|strong)\s+accent\b/i.test(normalizedText);
  const nounSurveyContext = /\b(?:a|an|the|compare|conduct|complete|discover)\b.{0,24}\bsurvey(?:s|\s+responses)?\b/i.test(normalizedText);
  const nounSuspectContext = /\b(?:a|an|the|describe|identify|question)\b.{0,24}\bsuspects?\b/i.test(normalizedText);
  const nounDelegateContext = /\b(?:a|an|the|one|two|three|several|choose|elect)\b.{0,24}\bdelegates?\b/i.test(normalizedText);
  const nounTransportContext = /\b(?:(?:means?\s+of|during|public|reliable|local|urban|road|rail)\s+transport|(?:on|by|via)\s+transport|transport\s+(?:system|network|service))\b/i.test(normalizedText);
  const nounContractContext = /\b(?:a|an|the|end|receive|sign|renew|breach)\b.{0,24}\bcontract\b/i.test(normalizedText);
  const nounProgressContext = /\b(?:make|show|report|track|good|steady|rapid|slow)\b.{0,24}\bprogress\b/i.test(normalizedText);
  const nounImportsContext = /\bimports\b/i.test(normalizedText);
  const nounDiscountContext = /\bat\s+(?:a|the)\s+discount\b|\b(?:offer|receive|give)\b.{0,20}\bdiscount\b/i.test(normalizedText);
  const nounInsultContext = /\badd\s+insult\s+to\s+injury\b/i.test(normalizedText);
  const verbIncreaseContext = /\b(?:to|can|could|may|might|must|should|will|would)\b.{0,18}\bincrease\b/i.test(normalizedText);
  const nounCloseContext = /\b(?:at|near)\s+the\s+close\s+of\b/i.test(normalizedText);
  const nounRefundContext = /\b(?:a|an|the|full|partial)\s+refund\b/i.test(normalizedText);
  const reducedUsedToContext = /^(?:used\s+to\b|(?:be|get)\s+used\s+to\s+(?!do\b))/i.test(normalizedText.trim());
  // Uppercase A and B are abstract grammar slots when they occur together.
  // Lowercase "a" remains the ordinary article and is still pronounced.
  const hasGrammarSlotPair = /\bA\b[\s\S]*\bB\b|\bB\b[\s\S]*\bA\b/.test(normalizedText);
  const metadataAppliesToToken = !/[\s/]/.test(normalizedText.trim());
  const tokens = normalizedText
    .replace(/\bwh-/gi, 'wh ')
    .replace(/[“”"(),.;:!?]/g, ' ')
    // Keep lexical compounds intact so a reviewed compound has one stress
    // hierarchy. Splitting at hyphens incorrectly gave both halves primary
    // stress (for example /ˈfʊl-ˈtaɪm/).
    .split(/([\s/]+)/)
    .filter((token) => token && !/^\s+$/.test(token));
  const rendered = tokens.map((token) => {
    // A slash is orthographic shorthand, not another IPA delimiter.
    if (token === '/') return '';
    if (hasGrammarSlotPair && (token === 'A' || token === 'B')) return '';
    const normalized = normalizeWord(token);
    if (longILiveContext && normalized === 'live') return 'laɪv';
    if (pastReadContext && normalized === 'read') return 'rɛd';
    if (presentReadContext && normalized === 'read') return 'riːd';
    if (longELeadContext && normalized === 'lead') return 'liːd';
    if (nounRecordContext && normalized === 'record') return 'ˈrɛkərd';
    if (nounRecordContext && normalized === 'records') return 'ˈrɛkərdz';
    if (verbConductContext && normalized === 'conduct') return 'kənˈdʌkt';
    if (nounProduceContext && normalized === 'produce') return 'ˈproʊduːs';
    if (nounIncreaseContext && normalized === 'increase') return 'ˈɪnkriːs';
    if (verbAddressContext && normalized === 'address') return 'əˈdrɛs';
    if (verbObjectContext && normalized === 'object') return 'əbˈdʒɛkt';
    if (nounWindContext && normalized === 'wind') return 'wɪnd';
    if (nounWoundContext && normalized === 'wound') return 'wuːnd';
    if (nounAccentContext && normalized === 'accent') return 'ˈæksent';
    if (nounSurveyContext && normalized === 'survey') return 'ˈsɝːveɪ';
    if (nounSuspectContext && normalized === 'suspect') return 'ˈsʌspɛkt';
    if (nounSuspectContext && normalized === 'suspects') return 'ˈsʌspɛkts';
    if (nounDelegateContext && normalized === 'delegate') return 'ˈdɛlɪɡət';
    if (nounDelegateContext && normalized === 'delegates') return 'ˈdɛlɪɡəts';
    if (nounTransportContext && normalized === 'transport') return 'ˈtrænspɔːrt';
    if (nounContractContext && normalized === 'contract') return 'ˈkɑːntrækt';
    if (nounProgressContext && normalized === 'progress') return 'ˈprɑːɡrɛs';
    if (nounImportsContext && normalized === 'imports') return 'ˈɪmpɔːrts';
    if (nounDiscountContext && normalized === 'discount') return 'ˈdɪskaʊnt';
    if (nounInsultContext && normalized === 'insult') return 'ˈɪnsʌlt';
    if (verbIncreaseContext && normalized === 'increase') return 'ɪnˈkriːs';
    if (nounCloseContext && normalized === 'close') return 'kloʊz';
    if (nounRefundContext && normalized === 'refund') return 'ˈriːfʌnd';
    if (nounUseContext && normalized === 'use') {
      return wordIpa(token, '', '');
    }
    if (verbUseContext && normalized === 'use') return 'juːz';
    if (reducedUsedToContext && normalized === 'used') return 'juːst';
    if (reducedUsedToContext && normalized === 'to') return 'tə';
    return wordIpa(token, targetWord, targetIpa, metadataAppliesToToken ? metadata : {});
  }).filter(Boolean).join(' ');
  if (!rendered) throw new IpaGenerationError(`No pronounceable English tokens in "${normalizedText}".`);
  return '/' + rendered + '/';
}

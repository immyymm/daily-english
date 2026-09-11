import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { IpaGenerationError, ipaFor } from './phonetics.mjs';

describe('ipaFor', () => {
  it('transcribes lexical someone/something placeholders and curly possessives', () => {
    expect(ipaFor('provide someone with something')).toBe('/prəˈvaɪd ˈsʌmˌwʌn ˈwɪð ˈsʌmθɪŋ/');
    expect(ipaFor('meet someone’s needs')).toBe('/ˈmiːt ˈsʌmˌwʌnz ˈniːdz/');
    expect(ipaFor('lose one’s life')).toBe('/ˈluːz ˈwʌnz ˈlaɪf/');
  });

  it('does not turn an orthographic slash into an extra IPA delimiter', () => {
    const rendered = ipaFor('someone/something');
    expect(rendered).toBe('/ˈsʌmˌwʌn ˈsʌmθɪŋ/');
    expect(rendered.slice(1, -1)).not.toContain('/');
  });

  it('transcribes wh- labels and clause instead of leaking their spelling', () => {
    const rendered = ipaFor('explain wh- + clause', 'explain', '/ɪkˈspleɪn/');
    expect(rendered).toBe('/ɪkˈspleɪn ˌdʌbəljuːˈeɪtʃ ˈklɔːz/');
    expect(rendered).not.toMatch(/\b(?:wh|clause)\b/i);
  });

  it('omits paired uppercase A/B grammar slots without dropping lowercase articles', () => {
    expect(ipaFor('compare A with B', 'compare', '/kəmˈper/')).toBe('/kəmˈper ˈwɪð/');
    expect(ipaFor('a useful idea')).toBe('/ə ˈjuːsfəl aɪˈdiːə/');
    expect(() => ipaFor('A/B')).toThrow(IpaGenerationError);
  });

  it('uses reviewed American IPA for CMUdict gaps and unsuitable entries', () => {
    expect(ipaFor('causally')).toBe('/ˈkɔːzəli/');
    expect(ipaFor('eat healthily')).toBe('/ˈiːt ˈhɛlθəli/');
    expect(ipaFor('vend')).toBe('/ˈvɛnd/');
    expect(ipaFor('unnoticed')).toBe('/ˌʌnˈnoʊtɪst/');
    expect(ipaFor('shortlist')).toBe('/ˈʃɔːrtlɪst/');
    expect(ipaFor('audiobook')).toBe('/ˈɑːdioʊbʊk/');
    expect(ipaFor('unachievable')).toBe('/ˌʌnəˈtʃiːvəbəl/');
    expect(ipaFor('solvability')).toBe('/ˌsɑːlvəˈbɪləti/');
    expect(ipaFor('realization')).toBe('/ˌriːələˈzeɪʃən/');
    expect(ipaFor('duration')).toBe('/dʊˈreɪʃən/');
    expect(ipaFor('overhear')).toBe('/ˌoʊvɚˈhɪr/');
    expect(ipaFor('attendee')).toBe('/əˌtɛnˈdiː/');
    expect(ipaFor('leaved')).toBe('/liːvd/');
  });

  it('fails closed for an unknown word instead of copying ASCII into slashes', () => {
    expect(() => ipaFor('a qwertyword')).toThrowError(
      'No American IPA pronunciation is available for "qwertyword".'
    );
  });

  it('preserves target-word and contextual use/used-to behavior', () => {
    expect(ipaFor('lead a team', 'lead', '/liːd/')).toBe('/liːd ə ˈtiːm/');
    expect(ipaFor('make good use of', 'use', '/juːz/')).toBe('/ˈmeɪk ˈɡʊd ˈjuːs ˈʌv/');
    expect(ipaFor('used to work', 'use', '/juːz/')).toBe('/juːst tə ˈwɝːk/');
  });

  it('uses the noun and adjective readings of heteronyms in reviewed phrases', () => {
    for (const phrase of ['put something to good use', 'be of use to someone', 'make full use of']) {
      expect(ipaFor(phrase, 'use', '/juːz/'), phrase).toContain('juːs');
      expect(ipaFor(phrase, 'use', '/juːz/'), phrase).not.toContain('juːz');
    }
    for (const phrase of ['watch live television', 'live audience', 'live electrical wire', 'live data', 'go live']) {
      expect(ipaFor(phrase, 'live', '/lɪv/'), phrase).toContain('laɪv');
      expect(ipaFor(phrase, 'live', '/lɪv/'), phrase).not.toContain('lɪv');
    }
  });

  it('selects the intended read, lead, use, and live pronunciations from context', () => {
    expect(ipaFor('can read music', 'can', '/kæn/')).toContain('riːd');
    expect(ipaFor('can read music', 'can', '/kæn/')).not.toContain('rɛd');
    for (const phrase of ['can lead to delays', 'could lead to delays', 'take the lead']) {
      expect(ipaFor(phrase), phrase).toContain('liːd');
      expect(ipaFor(phrase), phrase).not.toContain('lɛd');
    }
    expect(ipaFor('could use some help', 'could', '/kʊd/')).toContain('juːz');
    expect(ipaFor('could use some help', 'could', '/kʊd/')).not.toContain('juːs');
    for (const phrase of ['live to tell the tale', 'where you live', 'live']) {
      expect(ipaFor(phrase), phrase).toContain('lɪv');
      expect(ipaFor(phrase), phrase).not.toContain('laɪv');
    }
    expect(ipaFor('hearsay')).toBe('/ˈhɪrˌseɪ/');
  });

  it('keeps consonant-plus-yod onset clusters inside the stressed syllable', () => {
    expect(ipaFor('view')).toBe('/ˈvjuː/');
    expect(ipaFor('few')).toBe('/ˈfjuː/');
    expect(ipaFor('music')).toBe('/ˈmjuːzɪk/');
    expect(ipaFor('future')).toBe('/ˈfjuːtʃɚ/');
    expect(ipaFor('excuse')).toBe('/ɪkˈskjuːs/');
    expect(ipaFor('commute')).toBe('/kəˈmjuːt/');
  });

  it('uses reduced short vowels in unstressed IY0 and UW0 syllables', () => {
    expect(ipaFor('duty')).toBe('/ˈduːti/');
    expect(ipaFor('community')).toContain('mjuː');
    expect(ipaFor('community')).toMatch(/i\/$/);
  });

  it('uses POS-aware IPA for relation vocabulary without changing the opposite class', () => {
    const noun = (word, chinese = '') => ipaFor(word, '', '', { partOfSpeech: 'n.', chinese });
    const verb = (word, chinese = '') => ipaFor(word, '', '', { partOfSpeech: 'v.', chinese });
    expect(noun('impact')).toBe('/ˈɪmpækt/');
    expect(verb('impact')).toBe('/ɪmˈpækt/');
    expect(noun('address')).toBe('/ˈædrɛs/');
    expect(verb('address')).toBe('/əˈdrɛs/');
    expect(noun('record')).toBe('/ˈrɛkərd/');
    expect(verb('record')).toBe('/rɪˈkɔːrd/');
    expect(noun('transport')).toBe('/ˈtrænspɔːrt/');
    expect(verb('transport')).toBe('/trænˈspɔːrt/');
    expect(noun('merchandise')).toBe('/ˈmɝːtʃəndaɪs/');
    expect(verb('merchandise')).toBe('/ˈmɝːtʃəndaɪz/');
    expect(noun('bass', '低音乐器')).toBe('/beɪs/');
    expect(verb('transfer')).toBe('/trænsˈfɝː/');
    for (const [word, expected] of Object.entries({
      accent: '/ˈæksent/', concrete: '/ˈkɑːnkriːt/', contract: '/ˈkɑːntrækt/',
      discount: '/ˈdɪskaʊnt/', insult: '/ˈɪnsʌlt/', produce: '/ˈproʊduːs/',
      recess: '/ˈriːses/', refund: '/ˈriːfʌnd/', research: '/ˈriːsɝːtʃ/',
      subject: '/ˈsʌbdʒɪkt/', suspect: '/ˈsʌspɛkt/', survey: '/ˈsɝːveɪ/',
      update: '/ˈʌpdeɪt/'
    })) expect(noun(word), word).toBe(expected);
    for (const [word, expected] of Object.entries({
      contrast: '/kənˈtræst/', converse: '/kənˈvɝːs/', increase: '/ɪnˈkriːs/',
      object: '/əbˈdʒɛkt/', present: '/prɪˈzɛnt/', recall: '/rɪˈkɔːl/'
    })) expect(verb(word), word).toBe(expected);
  });

  it('selects noun and verb readings inside reviewed multiword contexts', () => {
    const expectedFragments = new Map([
      ['use jointly', 'juːz'],
      ['speak with a formal accent', 'ˈæksent'],
      ['compare survey responses', 'ˈsɝːveɪ'],
      ['describe a suspect', 'ˈsʌspɛkt'],
      ['choose two delegates', 'ˈdɛlɪɡəts'],
      ['public transport', 'ˈtrænspɔːrt'],
      ['end a contract', 'ˈkɑːntrækt'],
      ['make progress', 'ˈprɑːɡrɛs'],
      ['depend on imports', 'ˈɪmpɔːrts'],
      ['cause costs to increase', 'ɪnˈkriːs'],
      ['end at the close of business', 'kloʊz'],
      ['get a refund', 'ˈriːfʌnd'],
      ['buy shares at a discount', 'ˈdɪskaʊnt'],
      ['add insult to injury', 'ˈɪnsʌlt'],
      ['spend less on transport', 'ˈtrænspɔːrt'],
      ['means of transport', 'ˈtrænspɔːrt'],
      ['could not read the sign', 'riːd']
    ]);
    for (const [phrase, fragment] of expectedFragments) expect(ipaFor(phrase), phrase).toContain(fragment);
    expect(ipaFor('kilometers')).toBe('/kəˈlɑːmɪtərz/');
    expect(ipaFor('agree to object to the proposal')).toContain('əbˈdʒɛkt');
    expect(ipaFor('discover useful survey evidence')).toContain('ˈsɝːveɪ');
  });

  it('uses one deliberate stress hierarchy for reviewed compounds', () => {
    for (const [source, expected] of Object.entries({
      twofold: '/ˈtuːfoʊld/', Shanghai: '/ˌʃæŋˈhaɪ/', downstream: '/ˌdaʊnˈstriːm/',
      outside: '/ˌaʊtˈsaɪd/', handmade: '/ˌhændˈmeɪd/', overseas: '/ˌoʊvɚˈsiːz/',
      overnight: '/ˌoʊvɚˈnaɪt/', worldwide: '/ˌwɝːldˈwaɪd/', uphill: '/ˌʌpˈhɪl/',
      widespread: '/ˈwaɪdˌsprɛd/', lifelong: '/ˈlaɪfˌlɔːŋ/',
      downstairs: '/ˌdaʊnˈstɛrz/', downtown: '/ˌdaʊnˈtaʊn/', halfway: '/ˌhæfˈweɪ/',
      headfirst: '/ˈhɛdˌfɝːst/', nearby: '/ˌnɪrˈbaɪ/', outdoors: '/ˌaʊtˈdɔːrz/',
      overdo: '/ˌoʊvɚˈduː/', upside: '/ˈʌpˌsaɪd/',
      'all-time': '/ˈɔːlˌtaɪm/', 'cross-departmental': '/ˌkrɔːsdɪˌpɑːrtˈmɛntəl/',
      'cross-legged': '/ˌkrɔːsˈlɛɡɪd/', 'follow-up': '/ˈfɑːloʊˌʌp/',
      'full-time': '/ˈfʊlˌtaɪm/', 'gluten-free': '/ˌɡluːtənˈfriː/',
      'long-term': '/ˈlɔːŋˌtɝːm/', 'low-cost': '/ˈloʊˌkɑːst/',
      'must-have': '/ˈmʌstˌhæv/', 'part-time': '/ˈpɑːrtˌtaɪm/',
      'resource-allocation': '/ˌriːsɔːrsˌæləˈkeɪʃən/', 'self-control': '/ˌsɛlfkənˈtroʊl/',
      'six-month': '/ˈsɪksˌmʌnθ/', 'trade-off': '/ˈtreɪdˌɔːf/'
    })) expect(ipaFor(source), source).toBe(expected);
  });

  it('keeps reviewed compounds intact inside longer phrases', () => {
    expect(ipaFor('work full-time')).toBe('/ˈwɝːk ˈfʊlˌtaɪm/');
    expect(ipaFor('live downtown', 'live', '/lɪv/')).toBe('/lɪv ˌdaʊnˈtaʊn/');
    expect(ipaFor('turn something upside down')).toContain('ˈʌpˌsaɪd');
    expect(ipaFor('provide low-cost care')).toContain('ˈloʊˌkɑːst');
  });

  it('gives productive hyphenated compounds one primary stress', () => {
    expect(ipaFor('fifty-four')).toBe('/ˌfɪftiˈfɔːr/');
    expect(ipaFor('three-year')).toBe('/ˈθriːˌjɪr/');
  });

  it('uses reachable whole-expression overrides before splitting compounds', () => {
    expect(ipaFor('far-reaching')).toBe('/ˌfɑːrˈriːtʃɪŋ/');
    expect(ipaFor('self-explanatory')).toBe('/ˌsɛlfɪkˈsplænətɔːri/');
  });

  it('places stress after illegal intervocalic cluster prefixes', () => {
    expect(ipaFor('complete')).toBe('/kəmˈpliːt/');
  });

  it('uses reviewed American IPA for audited headwords and derivatives', () => {
    const reviewed = {
      hear: '/hɪr/', hearing: '/ˈhɪrɪŋ/', doer: '/ˈduːər/',
      unsupported: '/ˌʌnsəˈpɔːrtɪd/', unreachable: '/ˌʌnˈriːtʃəbəl/',
      unrealized: '/ˌʌnˈriːəlaɪzd/', unacceptable: '/ˌʌnəkˈsɛptəbəl/', unasked: '/ˌʌnˈæskt/',
      unavoidably: '/ˌʌnəˈvɔɪdəbli/', unmanageable: '/ˌʌnˈmænɪdʒəbəl/',
      unsolved: '/ˌʌnˈsɑːlvd/', report: '/rɪˈpɔːrt/', required: '/rɪˈkwaɪrd/',
      reporting: '/rɪˈpɔːrtɪŋ/', returnable: '/rɪˈtɝːnəbəl/', prepared: '/prɪˈperd/',
      unprepared: '/ˌʌnprɪˈperd/', developmental: '/dɪˌvɛləpˈmɛntəl/',
      shareholder: '/ˈʃerˌhoʊldər/', increasing: '/ɪnˈkriːsɪŋ/',
      increasingly: '/ɪnˈkriːsɪŋli/', comparison: '/kəmˈperəsən/',
      mismanage: '/ˌmɪsˈmænɪdʒ/', mismanagement: '/ˌmɪsˈmænɪdʒmənt/',
      improvement: '/ɪmˈpruːvmənt/', improved: '/ɪmˈpruːvd/', improving: '/ɪmˈpruːvɪŋ/',
      discoverer: '/dɪˈskʌvərər/', discovery: '/dɪˈskʌvəri/',
      expressionless: '/ɪkˈsprɛʃənləs/', discourage: '/dɪsˈkɝːɪdʒ/',
      discouraging: '/dɪsˈkɝːɪdʒɪŋ/', inclusivity: '/ˌɪnkluˈsɪvəti/',
      waitlist: '/ˈweɪtˌlɪst/'
    };
    for (const [word, expected] of Object.entries(reviewed)) expect(ipaFor(word), word).toBe(expected);
  });

  it('can generate IPA for every phonetic source in all 150 cards', () => {
    const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
    const cardDirectory = path.resolve(scriptDirectory, '..', 'content', 'cards');
    const files = fs.readdirSync(cardDirectory).filter((file) => file.endsWith('.json')).sort();
    const sources = [];
    const collect = (value, location) => {
      if (!value || typeof value !== 'object') return;
      if (typeof value.phonetic === 'string') {
        const source = value.phrase ?? value.word;
        if (source) sources.push([source, `${location}.phonetic`]);
      }
      if (typeof value.wrongPhonetic === 'string' && value.wrong) {
        sources.push([value.wrong, `${location}.wrongPhonetic`]);
      }
      if (typeof value.rightPhonetic === 'string' && value.right) {
        sources.push([value.right, `${location}.rightPhonetic`]);
      }
      for (const [key, child] of Object.entries(value)) collect(child, `${location}.${key}`);
    };

    for (const file of files) {
      const card = JSON.parse(fs.readFileSync(path.join(cardDirectory, file), 'utf8'));
      sources.push([card.word, `${file}.phonetic`]);
      collect(card, file);
    }

    expect(files).toHaveLength(150);
    expect(sources.length).toBeGreaterThan(1_000);
    for (const [source, location] of sources) {
      const rendered = ipaFor(source);
      expect(rendered, location).toMatch(/^\/[^/]+\/$/);
    }
  });
});

import { BookOpenText, Check, Heart, Layers3, Link2, Sparkles, Volume2 } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import type { CardProgress, WordCard } from '../types';
import { ModalShell } from './ModalShell';

type DetailTab = 'memory' | 'meanings' | 'phrases' | 'examples' | 'family';

interface CardDetailModalProps {
  card?: WordCard;
  progress?: CardProgress;
  open: boolean;
  onClose: () => void;
  onLearn: (card: WordCard) => Promise<void>;
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.86;
  const preferred = window.speechSynthesis.getVoices().find((voice) => voice.lang === 'en-US');
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

function ListenButton({ text, label = '播放发音' }: { text: string; label?: string }) {
  return <button className="mini-sound" onClick={() => speak(text)} aria-label={label}><Volume2 size={16} /></button>;
}

function SectionTitle({ number, children }: { number: string; children: ReactNode }) {
  return <div className="detail-section-heading"><span>{number}</span><h4>{children}</h4></div>;
}

export function CardDetailModal({ card, progress, open, onClose, onLearn }: CardDetailModalProps) {
  const [tab, setTab] = useState<DetailTab>('memory');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setTab('memory');
  }, [card?.id, open]);

  if (!card) return null;

  const markLearned = async () => {
    setSaving(true);
    try {
      await onLearn(card);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      open={open}
      title="完整单词词卡"
      eyebrow={progress?.status ?? '今日新词'}
      onClose={onClose}
      footer={
        <button className="primary-button" disabled={saving} onClick={markLearned}>
          {progress ? <Check size={19} /> : <Heart size={19} />}
          {progress ? '已加入学习记录' : saving ? '正在保存…' : '学完了，安排间隔复习'}
        </button>
      }
    >
      <div className="word-hero">
        <div>
          <div className="word-heading"><h3>{card.word}</h3><span>{card.partOfSpeech}</span></div>
          <p className="phonetic">{card.phonetic} · {card.syllables}</p>
          <p className="word-meaning">{card.coreMemory.chinese}</p>
          <div className="word-meta"><span>{card.frequencyBand}</span><span>{card.difficulty}</span>{card.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
        <button className="sound-button" onClick={() => speak(card.word)} aria-label={'播放 ' + card.word + ' 的发音'}><Volume2 size={22} /></button>
      </div>

      <div className="detail-progress" aria-label="完整词卡共十个章节"><span>完整模板</span><b>10 个学习章节</b></div>
      <div className="detail-tabs" role="tablist" aria-label="词卡内容">
        <button className={tab === 'memory' ? 'active' : ''} onClick={() => setTab('memory')}><Sparkles size={15} />速记</button>
        <button className={tab === 'meanings' ? 'active' : ''} onClick={() => setTab('meanings')}><BookOpenText size={15} />释义</button>
        <button className={tab === 'phrases' ? 'active' : ''} onClick={() => setTab('phrases')}><Link2 size={15} />搭配</button>
        <button className={tab === 'examples' ? 'active' : ''} onClick={() => setTab('examples')}><Volume2 size={15} />例句</button>
        <button className={tab === 'family' ? 'active' : ''} onClick={() => setTab('family')}><Layers3 size={15} />词族</button>
      </div>

      {tab === 'memory' && (
        <div className="detail-stack">
          <SectionTitle number="01">核心记忆表</SectionTitle>
          <section className="memory-table">
            <div><span>中文核心义</span><strong>{card.coreMemory.chinese}</strong></div>
            <div><span>Simple English</span><p>{card.coreMemory.english}</p></div>
            <div><span>核心结构</span><strong>{card.coreMemory.structure}</strong></div>
            <div><span>最直接近义词</span><strong>{card.coreMemory.directSynonym}</strong></div>
            <div><span>最直接反义词</span><strong>{card.coreMemory.directAntonym}</strong></div>
            <div><span>常用派生词</span><strong>{card.coreMemory.derivatives}</strong></div>
          </section>
          <section className="example-card featured">
            <span className="content-label">核心例句</span><p>{card.coreMemory.example}</p><span>{card.coreMemory.exampleChinese}</span>
            <button onClick={() => speak(card.coreMemory.example)}><Volume2 size={16} />听例句</button>
          </section>
          <section className="tip-card warning"><strong>常见错误</strong><p>{card.coreMemory.commonError}</p></section>
          <section className="study-focus">
            <span className="content-label">学完这张卡，请带走这四点</span>
            <ol><li>{card.studyFocus.coreMeaning}</li><li>{card.studyFocus.keyCollocation}</li><li>{card.studyFocus.commonMistake}</li><li>{card.studyFocus.mustUseExample}</li></ol>
          </section>
        </div>
      )}

      {tab === 'meanings' && (
        <div className="detail-stack">
          <SectionTitle number="02">词性与常用义项</SectionTitle>
          {card.meanings.map((meaning, index) => (
            <section className="meaning-card" key={meaning.partOfSpeech + index}>
              <div className="meaning-head"><span>{meaning.partOfSpeech}</span><strong>{meaning.chinese}</strong></div>
              <p className="english-definition">{meaning.english}</p>
              <div className="meaning-example"><p>{meaning.example}</p><span>{meaning.translation}</span><ListenButton text={meaning.example} label="播放义项例句" /></div>
            </section>
          ))}
        </div>
      )}

      {tab === 'phrases' && (
        <div className="detail-stack">
          <SectionTitle number="03">语境词组</SectionTitle>
          {card.contextPhrases.map((group) => (
            <section className="content-card" key={group.category}>
              <span className="content-label">{group.category}</span>
              {group.items.map((item) => (
                <div className="phrase-row" key={item.phrase}>
                  <div><strong>{item.phrase}</strong><small>{item.phonetic}</small><p>{item.chinese}</p></div>
                  <ListenButton text={item.phrase} label={'播放 ' + item.phrase} />
                </div>
              ))}
            </section>
          ))}
          <SectionTitle number="04">固定搭配与短语</SectionTitle>
          {card.fixedPhrases.map((item) => (
            <section className="fixed-card" key={item.phrase}>
              <div className="fixed-head"><div><strong>{item.phrase}</strong><small>{item.phonetic}</small></div><ListenButton text={item.phrase} /></div>
              <p className="fixed-meaning">{item.chinese}</p><p>{item.example}</p><span>{item.translation}</span>
            </section>
          ))}
        </div>
      )}

      {tab === 'examples' && (
        <div className="detail-stack">
          <SectionTitle number="10">高频场景例句</SectionTitle>
          {card.examples.map((example, index) => (
            <section className="example-card" key={example.scene + index}>
              <span className="scene-label">{String(index + 1).padStart(2, '0')} · {example.scene}</span>
              <p>{example.english}</p><span>{example.chinese}</span>
              <button onClick={() => speak(example.english)}><Volume2 size={16} />听一听</button>
            </section>
          ))}
          <section className="tip-card"><strong>主动输出</strong><p>盖住中文，先朗读英文；再替换句中的人物、时间或地点，口头说出一个和自己有关的新句子。</p></section>
        </div>
      )}

      {tab === 'family' && (
        <div className="detail-stack">
          <SectionTitle number="05">近义词辨析</SectionTitle>
          <div className="relation-list">{card.synonyms.map((item) => <RelationRow key={item.word} word={item.word} phonetic={item.phonetic} meta={item.partOfSpeech + ' · ' + item.chinese} note={item.difference} />)}</div>
          <SectionTitle number="06">反义词</SectionTitle>
          <div className="relation-list">{card.antonyms.map((item) => <RelationRow key={item.word} word={item.word} phonetic={item.phonetic} meta={item.partOfSpeech + ' · ' + item.chinese} note={item.usage} />)}</div>
          <SectionTitle number="07">常用派生词</SectionTitle>
          {card.derivatives.length ? <div className="relation-list">{card.derivatives.map((item) => <RelationRow key={item.word} word={item.word} phonetic={item.phonetic} meta={item.partOfSpeech + ' · ' + item.chinese} note={item.note} />)}</div> : <EmptySection>本词没有需要强记的高频派生词，先把核心用法学扎实。</EmptySection>}
          <SectionTitle number="08">易混淆词</SectionTitle>
          {card.confusables.length ? <div className="relation-list">{card.confusables.map((item) => <RelationRow key={item.word} word={item.word} phonetic={item.phonetic} meta={item.partOfSpeech + ' · ' + item.chinese} note={item.difference} />)}</div> : <EmptySection>暂无高频且真正容易混淆的词，不为凑数量加入生僻内容。</EmptySection>}
          <SectionTitle number="09">相关词汇组</SectionTitle>
          {card.relatedVocabulary.map((group) => (
            <section className="content-card" key={group.category}>
              <span className="content-label">{group.category}</span>
              {group.items.map((item) => <RelationRow key={item.word} word={item.word} phonetic={item.phonetic} meta={item.partOfSpeech + ' · ' + item.chinese} />)}
            </section>
          ))}
          <p className="source-note">{card.sourceNote} · 内容版本 {card.contentVersion}</p>
        </div>
      )}
    </ModalShell>
  );
}

function RelationRow({ word, phonetic, meta, note }: { word: string; phonetic: string; meta: string; note?: string }) {
  return (
    <article className="relation-row">
      <div className="relation-word"><div><strong>{word}</strong><small>{phonetic}</small></div><ListenButton text={word} label={'播放 ' + word} /></div>
      <p>{meta}</p>{note && <span>{note}</span>}
    </article>
  );
}

function EmptySection({ children }: { children: ReactNode }) {
  return <p className="empty-section">{children}</p>;
}

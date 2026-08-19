import { Check, ChevronDown, Heart, ListTree, Maximize2, Minimize2, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CardProgress, WordCard } from '../types';
import { ModalShell } from './ModalShell';

type SectionId = 'memory' | 'meanings' | 'context' | 'phrases' | 'synonyms' | 'antonyms' | 'derivatives' | 'confusables' | 'related' | 'examples';

interface CardDetailModalProps {
  card?: WordCard;
  progress?: CardProgress;
  open: boolean;
  onClose: () => void;
  onLearn: (card: WordCard) => Promise<void>;
}

const sectionMeta: Array<{ id: SectionId; number: string; name: string }> = [
  { id: 'memory', number: '01', name: '核心记忆' },
  { id: 'meanings', number: '02', name: '词性与释义' },
  { id: 'context', number: '03', name: '常用语境词组' },
  { id: 'phrases', number: '04', name: '固定搭配和短语' },
  { id: 'synonyms', number: '05', name: '近义词' },
  { id: 'antonyms', number: '06', name: '反义词' },
  { id: 'derivatives', number: '07', name: '派生词' },
  { id: 'confusables', number: '08', name: '易混词' },
  { id: 'related', number: '09', name: '同类词汇分类' },
  { id: 'examples', number: '10', name: '高频例句' },
];

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

export function CardDetailModal({ card, progress, open, onClose, onLearn }: CardDetailModalProps) {
  const [expanded, setExpanded] = useState<Set<SectionId>>(new Set(['memory', 'meanings']));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setExpanded(new Set(['memory', 'meanings']));
  }, [card?.id, open]);

  const counts = useMemo<Record<SectionId, number>>(() => {
    if (!card) return { memory: 0, meanings: 0, context: 0, phrases: 0, synonyms: 0, antonyms: 0, derivatives: 0, confusables: 0, related: 0, examples: 0 };
    return {
      memory: 1 + (card.coreMemory.structures?.length ?? 1) + (card.coreMemory.commonErrors?.length ?? 1),
      meanings: card.meanings.length,
      context: card.contextPhrases.reduce((sum, group) => sum + group.items.length, 0),
      phrases: card.fixedPhrases.length,
      synonyms: card.synonyms.length,
      antonyms: card.antonyms.length,
      derivatives: card.derivatives.length,
      confusables: card.confusables.length,
      related: card.relatedVocabulary.reduce((sum, group) => sum + group.items.length, 0),
      examples: card.examples.length,
    };
  }, [card]);

  if (!card) return null;

  const toggle = (id: SectionId) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const jumpTo = (id: SectionId) => {
    setExpanded((current) => new Set(current).add(id));
    window.setTimeout(() => document.getElementById(`card-section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const allExpanded = expanded.size === sectionMeta.length;
  const toggleAll = () => setExpanded(allExpanded ? new Set(['memory']) : new Set(sectionMeta.map((section) => section.id)));

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
      title={card.detailLevel === 'template-complete' ? '完整单词词卡' : '标准单词词卡'}
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
          <div className="word-meta">
            <span>{card.cocaRankLabel ?? card.frequencyBand}</span>
            <span>{card.detailLevel === 'template-complete' ? '模板完整版' : '已核实基础版'}</span>
            <span>{card.difficulty}</span>
            {card.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
        <button className="sound-button" onClick={() => speak(card.word)} aria-label={'播放 ' + card.word + ' 的发音'}><Volume2 size={22} /></button>
      </div>

      <div className="detail-toolbar">
        <div><ListTree size={16} /><span>10 个学习章节，全部内容都在本页</span></div>
        <button className="expand-all-button" onClick={toggleAll}>
          {allExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          {allExpanded ? '收起' : '展开全部'}
        </button>
      </div>

      <nav className="detail-jump-list" aria-label="快速跳转到词卡章节">
        {sectionMeta.map((section) => (
          <button key={section.id} onClick={() => jumpTo(section.id)}>
            <b>{section.number}</b><span>{section.name}</span>
          </button>
        ))}
      </nav>

      <div className="complete-card-sections">
        <LearningSection meta={sectionMeta[0]} count={counts.memory} open={expanded.has('memory')} onToggle={() => toggle('memory')}>
          <section className="memory-table">
            <div><span>单词与词频</span><strong>{card.word} · {card.cocaRankLabel ?? card.frequencyBand}</strong></div>
            <div><span>美式音标</span><strong>{card.phonetic}</strong></div>
            <div><span>音节划分</span><strong>{card.syllables}</strong></div>
            <div><span>词性</span><strong>{card.partOfSpeech}</strong></div>
            <div><span>中文核心义</span><strong>{card.coreMemory.chinese}</strong></div>
            <div><span>Simple English</span><p>{card.coreMemory.english}</p></div>
            <div>
              <span>最直接近义词</span>
              <CoreRelationList
                items={card.synonyms}
                fallback={card.coreMemory.directSynonym}
                relationLabel="近义词"
              />
            </div>
            <div>
              <span>最直接反义词</span>
              <CoreRelationList
                items={card.antonyms}
                fallback={card.coreMemory.directAntonym}
                relationLabel="反义词"
              />
            </div>
            <div><span>常用派生词</span><strong>{card.coreMemory.derivatives}</strong></div>
          </section>
          <section className="content-card">
            <span className="content-label">核心结构</span>
            {card.coreMemory.structures?.length ? card.coreMemory.structures.map((item) => (
              <div className="phrase-row" key={item.phrase}>
                <div><strong>{item.phrase}</strong><small>{item.phonetic}</small><p>{item.chinese}</p></div>
                <ListenButton text={item.phrase} />
              </div>
            )) : <p>{card.coreMemory.structure}</p>}
          </section>
          <section className="example-card featured">
            <span className="content-label">核心例句</span>
            <p>{card.coreMemory.example}</p><span>{card.coreMemory.exampleChinese}</span>
            <button onClick={() => speak(card.coreMemory.example)}><Volume2 size={16} />听例句</button>
          </section>
          <section className="tip-card warning">
            <strong>常见错误结构</strong>
            {card.coreMemory.commonErrors?.length ? (
              <div className="error-structure-list">
                {card.coreMemory.commonErrors.map((item) => (
                  <article key={item.wrong + item.right}>
                    <p className="wrong-structure">✕ {item.wrong}<small>{item.wrongPhonetic}</small></p>
                    <p className="right-structure">✓ {item.right}<small>{item.rightPhonetic}</small></p>
                    <span>{item.note}</span>
                  </article>
                ))}
              </div>
            ) : <p>{card.coreMemory.commonError}</p>}
          </section>
          <section className="study-focus">
            <span className="content-label">学完这张卡，请带走这四点</span>
            <ol><li>{card.studyFocus.coreMeaning}</li><li>{card.studyFocus.keyCollocation}</li><li>{card.studyFocus.commonMistake}</li><li>{card.studyFocus.mustUseExample}</li></ol>
          </section>
        </LearningSection>

        <LearningSection meta={sectionMeta[1]} count={counts.meanings} open={expanded.has('meanings')} onToggle={() => toggle('meanings')}>
          {card.meanings.map((meaning, index) => (
            <section className="meaning-card" key={meaning.partOfSpeech + meaning.chinese + index}>
              <div className="meaning-head"><span>{meaning.partOfSpeech}</span><strong>{meaning.chinese}</strong></div>
              <p className="english-definition">{meaning.english}</p>
              <div className="meaning-example"><p>{meaning.example}</p><span>{meaning.translation}</span><ListenButton text={meaning.example} label="播放义项例句" /></div>
            </section>
          ))}
        </LearningSection>

        <LearningSection meta={sectionMeta[2]} count={counts.context} open={expanded.has('context')} onToggle={() => toggle('context')}>
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
        </LearningSection>

        <LearningSection meta={sectionMeta[3]} count={counts.phrases} open={expanded.has('phrases')} onToggle={() => toggle('phrases')}>
          {card.fixedPhrases.map((item) => (
            <section className="fixed-card" key={item.phrase}>
              <div className="fixed-head"><div><strong>{item.phrase}</strong><small>{item.phonetic}</small></div><ListenButton text={item.phrase} /></div>
              <p className="fixed-meaning">{item.chinese}</p><p>{item.example}</p><span>{item.translation}</span>
            </section>
          ))}
        </LearningSection>

        <LearningSection meta={sectionMeta[4]} count={counts.synonyms} open={expanded.has('synonyms')} onToggle={() => toggle('synonyms')}>
          <div className="relation-list">{card.synonyms.map((item) => <RelationRow key={item.word} word={item.word} phonetic={item.phonetic} meta={item.partOfSpeech + ' · ' + item.chinese} note={item.difference} />)}</div>
        </LearningSection>

        <LearningSection meta={sectionMeta[5]} count={counts.antonyms} open={expanded.has('antonyms')} onToggle={() => toggle('antonyms')}>
          <div className="relation-list">{card.antonyms.map((item) => <RelationRow key={item.word} word={item.word} phonetic={item.phonetic} meta={item.partOfSpeech + ' · ' + item.chinese} note={item.usage} />)}</div>
        </LearningSection>

        <LearningSection meta={sectionMeta[6]} count={counts.derivatives} open={expanded.has('derivatives')} onToggle={() => toggle('derivatives')}>
          {card.derivatives.length ? <div className="relation-list">{card.derivatives.map((item) => <RelationRow key={item.word} word={item.word} phonetic={item.phonetic} meta={item.partOfSpeech + ' · ' + item.chinese} note={item.note} />)}</div> : <EmptySection>本词没有需要强记的高频派生词，先把核心用法学扎实。</EmptySection>}
        </LearningSection>

        <LearningSection meta={sectionMeta[7]} count={counts.confusables} open={expanded.has('confusables')} onToggle={() => toggle('confusables')}>
          {card.confusables.length ? <div className="relation-list">{card.confusables.map((item) => <RelationRow key={item.word} word={item.word} phonetic={item.phonetic} meta={item.partOfSpeech + ' · ' + item.chinese} note={item.difference} />)}</div> : <EmptySection>暂无高频且真正容易混淆的词，不为凑数量加入生僻内容。</EmptySection>}
        </LearningSection>

        <LearningSection meta={sectionMeta[8]} count={counts.related} open={expanded.has('related')} onToggle={() => toggle('related')}>
          {card.relatedVocabulary.map((group) => (
            <section className="content-card" key={group.category}>
              <span className="content-label">{group.category}</span>
              {group.items.map((item) => <RelationRow key={item.word} word={item.word} phonetic={item.phonetic} meta={item.partOfSpeech + ' · ' + item.chinese} />)}
            </section>
          ))}
        </LearningSection>

        <LearningSection meta={sectionMeta[9]} count={counts.examples} open={expanded.has('examples')} onToggle={() => toggle('examples')}>
          {card.examples.map((example, index) => (
            <section className="example-card" key={example.scene + index}>
              <span className="scene-label">{String(index + 1).padStart(2, '0')} · {example.scene}</span>
              <p>{example.english}</p><span>{example.chinese}</span>
              <button onClick={() => speak(example.english)}><Volume2 size={16} />听一听</button>
            </section>
          ))}
          <section className="tip-card"><strong>主动输出</strong><p>盖住中文，先朗读英文；再替换句中的人物、时间或地点，口头说出一个和自己有关的新句子。</p></section>
        </LearningSection>

        <p className="source-note">{card.sourceNote} · 模板版本 {card.templateVersion} · 内容版本 {card.contentVersion}</p>
      </div>
    </ModalShell>
  );
}

function LearningSection({ meta, count, open, onToggle, children }: {
  meta: { id: SectionId; number: string; name: string };
  count: number;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className={'learning-section' + (open ? ' expanded' : '')} id={'card-section-' + meta.id}>
      <button className="learning-section-toggle" onClick={onToggle} aria-expanded={open}>
        <span className="section-number">{meta.number}</span>
        <span className="section-name">{meta.name}<small>{count ? `${count} 项内容` : '按需学习'}</small></span>
        <ChevronDown size={18} />
      </button>
      {open && <div className="learning-section-body">{children}</div>}
    </section>
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

function CoreRelationList({
  items,
  fallback,
  relationLabel
}: {
  items: Array<{ word: string; phonetic: string; chinese: string }>;
  fallback: string;
  relationLabel: string;
}) {
  if (!items.length) return <strong>{fallback}</strong>;
  return (
    <div className="memory-relation-list">
      {items.map((item) => (
        <div className="memory-relation-item" key={item.word}>
          <div><strong>{item.word}</strong><small>{item.phonetic} · {item.chinese}</small></div>
          <ListenButton text={item.word} label={`播放${relationLabel} ${item.word} 的发音`} />
        </div>
      ))}
    </div>
  );
}

function EmptySection({ children }: { children: ReactNode }) {
  return <p className="empty-section">{children}</p>;
}

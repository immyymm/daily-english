import { Check, ChevronDown, Heart, ListTree, Maximize2, Minimize2, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CardProgress, WordCard } from '../types';
import { ModalShell } from './ModalShell';

type SectionId = 'memory' | 'phrases' | 'context' | 'derivatives' | 'synonyms' | 'antonyms' | 'confusables' | 'related';

interface CardDetailModalProps {
  card?: WordCard;
  progress?: CardProgress;
  open: boolean;
  onClose: () => void;
  onLearn: (card: WordCard) => Promise<void>;
}

const sectionMeta: Array<{ id: SectionId; number: string; name: string }> = [
  { id: 'memory', number: '01', name: '核心记忆' },
  { id: 'phrases', number: '02', name: '固定搭配和短语' },
  { id: 'context', number: '03', name: '常用语境词组' },
  { id: 'derivatives', number: '04', name: '派生词' },
  { id: 'synonyms', number: '05', name: '近义词' },
  { id: 'antonyms', number: '06', name: '反义词' },
  { id: 'confusables', number: '07', name: '易混词' },
  { id: 'related', number: '08', name: '同类词汇分类' },
];

const derivativeOrder = ['v', 'n', 'adj', 'adv'] as const;

function derivativeRank(partOfSpeech: string) {
  const parts = partOfSpeech
    .toLowerCase()
    .replaceAll('.', '')
    .split(/\s*\/\s*|\s+/)
    .filter(Boolean);
  const ranks = parts
    .map((part) => derivativeOrder.indexOf(part as (typeof derivativeOrder)[number]))
    .filter((rank) => rank >= 0);
  return ranks.length ? Math.min(...ranks) : -1;
}

function sortDerivatives(items: WordCard['derivatives']) {
  return items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => derivativeRank(item.partOfSpeech) >= 0)
    .sort((left, right) => {
      return derivativeRank(left.item.partOfSpeech) - derivativeRank(right.item.partOfSpeech) || left.index - right.index;
    })
    .map(({ item }) => item);
}

function getMeaningRows(card: WordCard) {
  return card.meanings.length
    ? card.meanings
    : [{
        partOfSpeech: card.partOfSpeech,
        english: card.coreMemory.english,
        chinese: card.coreMemory.chinese,
        example: card.coreMemory.example,
        translation: card.coreMemory.exampleChinese,
      }];
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

export function CardDetailModal({ card, progress, open, onClose, onLearn }: CardDetailModalProps) {
  const [expanded, setExpanded] = useState<Set<SectionId>>(new Set(['memory']));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setExpanded(new Set(['memory']));
  }, [card?.id, open]);

  const sortedDerivatives = useMemo(() => card ? sortDerivatives(card.derivatives) : [], [card]);
  const meaningRows = useMemo(() => card ? getMeaningRows(card) : [], [card]);

  const counts = useMemo<Record<SectionId, number>>(() => {
    if (!card) return { memory: 0, phrases: 0, context: 0, derivatives: 0, synonyms: 0, antonyms: 0, confusables: 0, related: 0 };
    return {
      memory: 2 + meaningRows.length + sortedDerivatives.length + card.synonyms.length + card.antonyms.length + (card.coreMemory.structures?.length ?? 1) + (card.coreMemory.commonErrors?.length ?? 1),
      phrases: card.fixedPhrases.length,
      context: card.contextPhrases.reduce((sum, group) => sum + group.items.length, 0),
      derivatives: sortedDerivatives.length,
      synonyms: card.synonyms.length,
      antonyms: card.antonyms.length,
      confusables: card.confusables.length,
      related: card.relatedVocabulary.reduce((sum, group) => sum + group.items.length, 0),
    };
  }, [card, meaningRows.length, sortedDerivatives]);

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
  const isDetailed = card.detailLevel !== 'template-structured';
  const detailLabel = card.detailLevel === 'template-reference'
    ? '锁定 work 示例卡'
    : card.detailLevel === 'template-curated'
      ? '人工精校详卡'
      : '模板结构版 · 待深度补全';

  return (
    <ModalShell
      open={open}
      title={isDetailed ? '完整单词词卡' : '模板结构词卡'}
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
          <p className="word-meaning">{card.coreMemory.chinese}</p>
          <p className="phonetic">{card.syllables} · {card.phonetic}</p>
          <div className="word-meta">
            <span>{card.cocaRankLabel ?? card.frequencyBand}</span>
            <span>{detailLabel}</span>
            <span>{card.difficulty}</span>
            {card.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
        <button className="sound-button" onClick={() => speak(card.word)} aria-label={'播放 ' + card.word + ' 的发音'}><Volume2 size={22} /></button>
      </div>

      <div className="detail-toolbar">
        <div><ListTree size={16} /><span>{sectionMeta.length} 个学习章节，全部内容都在本页</span></div>
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
            <div className="core-memory-row">
              <span>单词与完整释义</span>
              <div className="memory-main-entry">
                <div className="memory-main-head">
                  <div><strong>{card.word}</strong><small>{card.cocaRankLabel ?? card.frequencyBand}</small></div>
                  <ListenButton text={card.word} label={'播放 ' + card.word + ' 的发音'} />
                </div>
                <div className="memory-meaning-list">
                  <div className="memory-core-summary">
                    <span>{card.partOfSpeech}</span>
                    <strong>{card.coreMemory.chinese}</strong>
                    <em>核心义</em>
                  </div>
                  {meaningRows.map((meaning) => (
                    <div className="memory-meaning-item" key={meaning.partOfSpeech + meaning.english}>
                      <div className="memory-meaning-chinese">
                        <span>{meaning.partOfSpeech}</span>
                        <b>{meaning.chinese}</b>
                      </div>
                      <p>{meaning.english}</p>
                    </div>
                  ))}
                </div>
                <div className="memory-pronunciation">
                  <strong>{card.syllables}</strong>
                  <span className="memory-phonetic">{card.phonetic}</span>
                </div>
              </div>
            </div>
            {sortedDerivatives.length > 0 && (
              <div>
                <span>常用派生词</span>
                <CoreDerivativeList items={sortedDerivatives} />
              </div>
            )}
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
          </section>
          <section className="content-card">
            <span className="content-label">核心结构</span>
            {card.coreMemory.structures?.length ? card.coreMemory.structures.map((item) => (
              <LexicalEntry className="phrase-row" key={item.phrase} term={item.phrase} meaning={item.chinese} phonetic={item.phonetic} />
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

        <LearningSection meta={sectionMeta[1]} count={counts.phrases} open={expanded.has('phrases')} onToggle={() => toggle('phrases')}>
          {card.fixedPhrases.map((item) => (
            <section className="fixed-card" key={item.phrase}>
              <LexicalEntry className="fixed-head" term={item.phrase} meaning={item.chinese} phonetic={item.phonetic} />
              <p className="fixed-example">{item.example}</p><span>{item.translation}</span>
            </section>
          ))}
        </LearningSection>

        <LearningSection meta={sectionMeta[2]} count={counts.context} open={expanded.has('context')} onToggle={() => toggle('context')}>
          {card.contextPhrases.map((group) => (
            <section className="content-card" key={group.category}>
              <span className="content-label">{group.category}</span>
              {group.items.map((item) => (
                <LexicalEntry className="phrase-row" key={item.phrase} term={item.phrase} meaning={item.chinese} phonetic={item.phonetic} />
              ))}
            </section>
          ))}
        </LearningSection>

        <LearningSection meta={sectionMeta[3]} count={counts.derivatives} open={expanded.has('derivatives')} onToggle={() => toggle('derivatives')}>
          {sortedDerivatives.length ? <div className="relation-list">{sortedDerivatives.map((item) => <RelationRow key={item.word} word={item.word} phonetic={item.phonetic} partOfSpeech={item.partOfSpeech} meaning={item.chinese} note={item.note} />)}</div> : <EmptySection>本词没有需要强记的高频派生词，先把核心用法学扎实。</EmptySection>}
        </LearningSection>

        <LearningSection meta={sectionMeta[4]} count={counts.synonyms} open={expanded.has('synonyms')} onToggle={() => toggle('synonyms')}>
          <div className="relation-list">{card.synonyms.map((item) => <RelationRow key={item.word} word={item.word} phonetic={item.phonetic} partOfSpeech={item.partOfSpeech} meaning={item.chinese} note={item.difference} />)}</div>
        </LearningSection>

        <LearningSection meta={sectionMeta[5]} count={counts.antonyms} open={expanded.has('antonyms')} onToggle={() => toggle('antonyms')}>
          <div className="relation-list">{card.antonyms.map((item) => <RelationRow key={item.word} word={item.word} phonetic={item.phonetic} partOfSpeech={item.partOfSpeech} meaning={item.chinese} note={item.usage} />)}</div>
        </LearningSection>

        <LearningSection meta={sectionMeta[6]} count={counts.confusables} open={expanded.has('confusables')} onToggle={() => toggle('confusables')}>
          {card.confusables.length ? <div className="relation-list">{card.confusables.map((item) => <RelationRow key={item.word} word={item.word} phonetic={item.phonetic} partOfSpeech={item.partOfSpeech} meaning={item.chinese} note={item.difference} />)}</div> : <EmptySection>暂无高频且真正容易混淆的词，不为凑数量加入生僻内容。</EmptySection>}
        </LearningSection>

        <LearningSection meta={sectionMeta[7]} count={counts.related} open={expanded.has('related')} onToggle={() => toggle('related')}>
          {card.relatedVocabulary.map((group) => (
            <section className="content-card" key={group.category}>
              <span className="content-label">{group.category}</span>
              {group.items.map((item) => <RelationRow key={item.word} word={item.word} phonetic={item.phonetic} partOfSpeech={item.partOfSpeech} meaning={item.chinese} />)}
            </section>
          ))}
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

function LexicalEntry({
  term,
  meaning,
  phonetic,
  partOfSpeech,
  className = '',
  label,
}: {
  term: string;
  meaning: string;
  phonetic: string;
  partOfSpeech?: string;
  className?: string;
  label?: string;
}) {
  return (
    <div className={'lexical-entry' + (className ? ` ${className}` : '')}>
      <div className="lexical-entry-copy">
        <strong className="lexical-entry-term">{term}</strong>
        <p className="lexical-entry-meaning">{partOfSpeech && <span>{partOfSpeech}</span>}{meaning}</p>
        <small className="lexical-entry-phonetic">{phonetic}</small>
      </div>
      <ListenButton text={term} label={label ?? `播放 ${term} 的发音`} />
    </div>
  );
}

function RelationRow({ word, phonetic, partOfSpeech, meaning, note }: { word: string; phonetic: string; partOfSpeech: string; meaning: string; note?: string }) {
  return (
    <article className="relation-row">
      <LexicalEntry term={word} meaning={meaning} phonetic={phonetic} partOfSpeech={partOfSpeech} />
      {note && <span>{note}</span>}
    </article>
  );
}

function CoreRelationList({
  items,
  fallback,
  relationLabel
}: {
  items: Array<{ word: string; phonetic: string; partOfSpeech?: string; chinese: string }>;
  fallback: string;
  relationLabel: string;
}) {
  if (!items.length) return <strong>{fallback}</strong>;
  return (
    <div className="memory-relation-list">
      {items.map((item) => (
        <LexicalEntry
          className="memory-relation-item"
          key={item.word}
          term={item.word}
          meaning={item.chinese}
          phonetic={item.phonetic}
          partOfSpeech={item.partOfSpeech}
          label={`播放${relationLabel} ${item.word} 的发音`}
        />
      ))}
    </div>
  );
}

function CoreDerivativeList({ items }: { items: WordCard['derivatives'] }) {
  return (
    <div className="memory-relation-list">
      {items.map((item) => (
        <LexicalEntry
          className="memory-relation-item"
          key={item.word}
          term={item.word}
          meaning={item.chinese}
          phonetic={item.phonetic}
          partOfSpeech={item.partOfSpeech}
          label={`播放派生词 ${item.word} 的发音`}
        />
      ))}
    </div>
  );
}

function EmptySection({ children }: { children: ReactNode }) {
  return <p className="empty-section">{children}</p>;
}

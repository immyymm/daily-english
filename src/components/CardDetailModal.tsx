import { BookOpenText, Check, Ear, Heart, Link2, Sparkles, Volume2 } from 'lucide-react';
import { useState } from 'react';
import type { CardProgress, WordCard } from '../types';
import { ModalShell } from './ModalShell';

type DetailTab = 'core' | 'phrases' | 'examples' | 'relations';

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

export function CardDetailModal({ card, progress, open, onClose, onLearn }: CardDetailModalProps) {
  const [tab, setTab] = useState<DetailTab>('core');
  const [saving, setSaving] = useState(false);
  if (!card) return null;

  const markLearned = async () => {
    setSaving(true);
    await onLearn(card);
    setSaving(false);
  };

  return (
    <ModalShell
      open={open}
      title="单词词卡"
      eyebrow={progress?.status ?? '今日新词'}
      onClose={onClose}
      footer={
        <button className="primary-button" disabled={saving} onClick={markLearned}>
          {progress ? <Check size={19} /> : <Heart size={19} />}
          {progress ? '已加入学习记录' : saving ? '正在保存…' : '我学会了，安排复习'}
        </button>
      }
    >
      <div className="word-hero">
        <div>
          <div className="word-heading">
            <h3>{card.word}</h3>
            <span>{card.partOfSpeech}</span>
          </div>
          <p className="phonetic">{card.phonetic} · {card.syllables}</p>
          <p className="word-meaning">{card.coreMemory.chinese}</p>
        </div>
        <button className="sound-button" onClick={() => speak(card.word)} aria-label={'播放 ' + card.word + ' 的发音'}>
          <Volume2 size={22} />
        </button>
      </div>

      <div className="detail-tabs" role="tablist" aria-label="词卡内容">
        <button className={tab === 'core' ? 'active' : ''} onClick={() => setTab('core')}><Sparkles size={15} />核心</button>
        <button className={tab === 'phrases' ? 'active' : ''} onClick={() => setTab('phrases')}><Link2 size={15} />搭配</button>
        <button className={tab === 'examples' ? 'active' : ''} onClick={() => setTab('examples')}><BookOpenText size={15} />例句</button>
        <button className={tab === 'relations' ? 'active' : ''} onClick={() => setTab('relations')}><Ear size={15} />辨析</button>
      </div>

      {tab === 'core' && (
        <div className="detail-stack">
          <section className="content-card accent">
            <span className="content-label">SIMPLE ENGLISH</span>
            <p className="english-definition">{card.coreMemory.english}</p>
          </section>
          <section className="content-card">
            <span className="content-label">核心结构</span>
            <strong>{card.coreMemory.structure}</strong>
          </section>
          <section className="example-card">
            <p>{card.coreMemory.example}</p>
            <span>{card.coreMemory.exampleChinese}</span>
            <button onClick={() => speak(card.coreMemory.example)} aria-label="播放例句"><Volume2 size={16} /> 听例句</button>
          </section>
          <section className="tip-card">
            <strong>容易犯的错误</strong>
            <p>{card.coreMemory.commonError}</p>
          </section>
        </div>
      )}

      {tab === 'phrases' && (
        <div className="detail-stack">
          {card.contextPhrases.map((group) => (
            <section className="content-card" key={group.category}>
              <span className="content-label">{group.category}</span>
              {group.items.map((item) => (
                <div className="phrase-row" key={item.phrase}>
                  <div><strong>{item.phrase}</strong><p>{item.chinese}</p></div>
                  <button className="mini-sound" onClick={() => speak(item.phrase)} aria-label="播放搭配"><Volume2 size={16} /></button>
                </div>
              ))}
            </section>
          ))}
          {card.fixedPhrases.map((item) => (
            <section className="example-card" key={item.phrase}>
              <strong>{item.phrase}</strong>
              <p>{item.example}</p>
              <span>{item.translation}</span>
            </section>
          ))}
        </div>
      )}

      {tab === 'examples' && (
        <div className="detail-stack">
          {card.examples.map((example) => (
            <section className="example-card" key={example.scene}>
              <span className="content-label">{example.scene}</span>
              <p>{example.english}</p>
              <span>{example.chinese}</span>
              <button onClick={() => speak(example.english)}><Volume2 size={16} /> 听一听</button>
            </section>
          ))}
        </div>
      )}

      {tab === 'relations' && (
        <div className="detail-stack">
          <section className="relation-grid">
            <div><span>近义词</span><strong>{card.coreMemory.directSynonym}</strong></div>
            <div><span>反义词</span><strong>{card.coreMemory.directAntonym}</strong></div>
          </section>
          {card.synonyms.map((item) => (
            <section className="content-card" key={item.word}>
              <span className="content-label">近义辨析</span>
              <strong>{item.word}</strong>
              <p>{item.difference}</p>
            </section>
          ))}
          <section className="tip-card focus">
            <strong>这张卡最要记住</strong>
            <p>{card.studyFocus.coreMeaning}</p>
            <p>{card.studyFocus.keyCollocation}</p>
            <p>{card.studyFocus.mustUseExample}</p>
          </section>
        </div>
      )}
    </ModalShell>
  );
}

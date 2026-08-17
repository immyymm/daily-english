import { CheckCircle2, FileText, LoaderCircle, Mic2, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toLocalDateKey } from '../learning/reviewEngine';
import { evaluateAnswer } from '../services/ai';
import type { AIEvaluation, Attempt, EvaluationResult, WordCard } from '../types';
import { LocalRecorder } from './LocalRecorder';
import { ModalShell } from './ModalShell';

interface WeeklyTestModalProps {
  open: boolean;
  cards: WordCard[];
  aiConsent: boolean;
  onNeedConsent: () => void;
  onClose: () => void;
  onSave: (attempt: Attempt, evaluation: AIEvaluation) => Promise<void>;
}

const makeId = () => typeof crypto.randomUUID === 'function'
  ? crypto.randomUUID()
  : Date.now().toString(36) + Math.random().toString(36).slice(2);

export function WeeklyTestModal({ open, cards, aiConsent, onNeedConsent, onClose, onSave }: WeeklyTestModalProps) {
  const [mode, setMode] = useState<'writing' | 'speaking'>('writing');
  const [answer, setAnswer] = useState('');
  const [shownAt, setShownAt] = useState(Date.now());
  const [speechLatency, setSpeechLatency] = useState<number>();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<EvaluationResult>();
  const [error, setError] = useState<string>();
  const targetWords = useMemo(() => cards.slice(0, 10), [cards]);
  const requiredWords = useMemo(() => targetWords.slice(0, 5), [targetWords]);
  const suggestedPhrases = useMemo(
    () => targetWords.flatMap((card) => card.fixedPhrases.slice(0, 1).map((phrase) => phrase.phrase)).slice(0, 5),
    [targetWords]
  );

  useEffect(() => {
    if (open) {
      setAnswer('');
      setResult(undefined);
      setError(undefined);
      setShownAt(Date.now());
      setSpeechLatency(undefined);
    }
  }, [open, mode]);

  if (!targetWords.length) return null;
  const representative = targetWords[0];
  const questionType = mode === 'writing' ? 'weekly_writing' : 'weekly_speaking';
  const prompt = mode === 'writing'
    ? `写一段 180–240 词的英文短文，主题是“一个让生活变得更好的小改变”。至少自然使用 5 个本周词（${requiredWords.map((card) => card.word).join('、')}）和 2 个词卡搭配（${suggestedPhrases.join('、')}）；至少加入一次原因解释、一个具体例子和一句近义词或反义词对比。不要强行堆词。`
    : `进行 2–3 分钟的即兴表达：描述你最近正在培养的一个习惯。至少自然使用 5 个本周词（${requiredWords.map((card) => card.word).join('、')}）和 2 个词卡搭配（${suggestedPhrases.join('、')}），并用一个具体场景说明效果。录音后，请输入或确认文字稿。`;

  const submit = async () => {
    if (!aiConsent) {
      onNeedConsent();
      return;
    }
    if (answer.trim().length < 20) {
      setError('内容还太短，请先完成一段较完整的英文表达。');
      return;
    }
    setSubmitting(true);
    setError(undefined);
    const requestId = makeId();
    const createdAt = new Date().toISOString();
    try {
      const response = await evaluateAnswer({
        requestId,
        card: representative,
        questionType,
        stage: 'T5',
        prompt,
        answer,
        responseMs: speechLatency ?? Date.now() - shownAt,
        weeklyWords: targetWords.map((card) => card.word)
      });
      const evaluation: AIEvaluation = {
        requestId,
        cardId: 'weekly-' + toLocalDateKey(),
        questionType,
        stage: 'T5',
        answer,
        status: 'complete',
        createdAt,
        model: response.model,
        rubricVersion: '2026.08.17',
        result: response.result
      };
      const attempt: Attempt = {
        id: makeId(),
        cardId: evaluation.cardId,
        questionId: evaluation.cardId + '-' + mode,
        questionType,
        stage: 'T5',
        prompt,
        answer,
        correctAnswer: response.result.correctedAnswer,
        score: response.result.overallScore,
        correct: response.result.overallScore >= 75,
        responseMs: speechLatency ?? Date.now() - shownAt,
        errorTypes: response.result.errorTypes,
        createdAt,
        ai: true
      };
      await onSave(attempt, evaluation);
      setResult(response.result);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'AI 评分暂时不可用';
      const pending: AIEvaluation = {
        requestId,
        cardId: 'weekly-' + toLocalDateKey(),
        questionType,
        stage: 'T5',
        answer,
        status: 'pending',
        createdAt,
        rubricVersion: '2026.08.17',
        errorMessage: message
      };
      await onSave({
        id: makeId(),
        cardId: pending.cardId,
        questionId: pending.cardId + '-' + mode,
        questionType,
        stage: 'T5',
        prompt,
        answer,
        correctAnswer: '',
        score: 0,
        correct: false,
        responseMs: Date.now() - shownAt,
        errorTypes: ['等待 AI 评分'],
        createdAt,
        ai: true
      }, pending);
      setError('内容已保存在本机待评分队列，配置密钥或联网后可再次提交。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell open={open} title="本周综合测试" eyebrow="WEEKLY CHECK-IN" onClose={onClose} wide>
      <div className="mode-switch">
        <button className={mode === 'writing' ? 'active' : ''} onClick={() => setMode('writing')}><FileText size={17} />短文</button>
        <button className={mode === 'speaking' ? 'active' : ''} onClick={() => setMode('speaking')}><Mic2 size={17} />即兴口语</button>
      </div>
      <section className="weekly-prompt">
        <span>来自完整词卡的本次考点</span>
        <div className="word-chip-list">{targetWords.map((card) => <b key={card.id}>{card.word}</b>)}</div>
        <p>{prompt}</p>
        <div className="weekly-requirements">
          <strong>评分会重点检查</strong>
          <ul>
            <li>目标词的词义和语境是否准确</li>
            <li>固定搭配、介词和词性是否自然</li>
            <li>是否避免中文直译，并形成连贯表达</li>
          </ul>
        </div>
      </section>
      {mode === 'speaking' && <LocalRecorder shownAt={shownAt} onStarted={setSpeechLatency} />}
      <label className="answer-field">
        <span>{mode === 'speaking' ? '输入或确认你的文字稿' : '你的英文短文'}</span>
        <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows={9} placeholder="Write naturally in English…" disabled={Boolean(result)} />
      </label>
      <div className="character-count">{answer.trim().split(/\s+/).filter(Boolean).length} words</div>
      {error && <p className="form-error">{error}</p>}
      {result && (
        <section className="feedback-card success">
          <div className="feedback-title"><CheckCircle2 size={20} /><strong>{result.overallScore} 分</strong></div>
          <p>{result.reasonZh}</p>
          <p><b>自然版本：</b>{result.naturalVersion}</p>
          <p><b>需要关注：</b>{result.errorTypes.length ? result.errorTypes.join(' · ') : '表达自然，没有明显问题'}</p>
        </section>
      )}
      {!result && (
        <button className="primary-button" disabled={submitting} onClick={() => void submit()}>
          {submitting ? <LoaderCircle className="spin" size={18} /> : <Sparkles size={18} />}
          {submitting ? '正在综合点评…' : '交给 AI 点评'}
        </button>
      )}
    </ModalShell>
  );
}

import { CheckCircle2, FileText, LoaderCircle, Mic2, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toLocalDateKey } from '../learning/reviewEngine';
import { evaluateAnswer } from '../services/ai';
import type { AIEvaluation, Attempt, EvaluationResult, WordCard } from '../types';
import { LocalRecorder } from './LocalRecorder';
import { EvaluationResultDetails } from './EvaluationResultDetails';
import { ModalShell } from './ModalShell';

interface WeeklyTestModalProps {
  open: boolean;
  cards: WordCard[];
  aiConsent: boolean;
  onNeedConsent: () => void;
  onClose: () => void;
  onSave: (attempt: Attempt, evaluation: AIEvaluation) => Promise<void>;
  onQueueEvaluation: (evaluation: AIEvaluation) => Promise<void>;
}

const makeId = () => typeof crypto.randomUUID === 'function'
  ? crypto.randomUUID()
  : Date.now().toString(36) + Math.random().toString(36).slice(2);

export function WeeklyTestModal({ open, cards, aiConsent, onNeedConsent, onClose, onSave, onQueueEvaluation }: WeeklyTestModalProps) {
  const [mode, setMode] = useState<'writing' | 'speaking'>('writing');
  const [answer, setAnswer] = useState('');
  const [shownAt, setShownAt] = useState(Date.now());
  const [speechLatency, setSpeechLatency] = useState<number>();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<EvaluationResult>();
  const [error, setError] = useState<string>();
  const [queued, setQueued] = useState(false);
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
      setQueued(false);
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

  const submit = () => {
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
    const cardId = 'weekly-' + toLocalDateKey();
    const questionId = cardId + '-' + mode;
    const savedAnswer = answer.trim();
    const responseMs = speechLatency ?? Date.now() - shownAt;
    const pending: AIEvaluation = {
      requestId,
      cardId,
      questionType,
      stage: 'T5',
      answer: savedAnswer,
      status: 'pending',
      createdAt,
      updatedAt: createdAt,
      rubricVersion: '2026.08.18.6',
      prompt,
      questionId,
      correctAnswer: '',
      responseMs
    };
    setQueued(true);
    setSubmitting(false);
    void onQueueEvaluation(pending)
      .then(() => evaluateAnswer({
        requestId,
        card: representative,
        questionId,
        questionType,
        stage: 'T5',
        prompt,
        answer: savedAnswer,
        responseMs,
        rubricVersion: pending.rubricVersion,
        weeklyWords: targetWords.map((card) => card.word)
      }))
      .then(async (response) => {
        if (response.status !== 'complete') return;
        const evaluation: AIEvaluation = {
          ...pending,
          status: 'complete',
          updatedAt: new Date().toISOString(),
          model: response.model,
          result: response.result
        };
        const attempt: Attempt = {
          id: requestId,
          cardId,
          questionId,
          questionType,
          stage: 'T5',
          prompt,
          answer: savedAnswer,
          correctAnswer: response.result.correctedAnswer,
          score: response.result.overallScore,
          correct: response.result.overallScore >= 75 && !response.result.needsRetry,
          responseMs,
          errorTypes: response.result.errorTypes,
          createdAt,
          ai: true,
          scheduleImpact: false
        };
        await onSave(attempt, evaluation);
        setResult(response.result);
      })
      .catch((requestError) => {
        const message = requestError instanceof Error ? requestError.message : 'AI 评分暂时不可用';
        void onQueueEvaluation({ ...pending, status: 'failed', updatedAt: new Date().toISOString(), errorMessage: message });
        setError('答案已保存；连接恢复后可在“我的”中重试，成功结果会保留。');
      });
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
      {queued && !result && !error && (
        <section className="feedback-card pending">
          <div className="feedback-title"><Sparkles size={20} /><strong>已进入后台点评</strong></div>
          <p>现在可以关闭本页继续学习；完成后的详细点评会自动保存，可随时回来查看。</p>
        </section>
      )}
      {result && (
        <section className="feedback-card success">
          <div className="feedback-title"><CheckCircle2 size={20} /><strong>{result.overallScore} 分</strong></div>
          <EvaluationResultDetails result={result} />
        </section>
      )}
      {!result && !queued && (
        <button className="primary-button" disabled={submitting} onClick={submit}>
          {submitting ? <LoaderCircle className="spin" size={18} /> : <Sparkles size={18} />}
          {submitting ? '正在综合点评…' : '交给 AI 点评'}
        </button>
      )}
    </ModalShell>
  );
}

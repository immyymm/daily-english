import { ArrowRight, Brain, CheckCircle2, CloudOff, LoaderCircle, RotateCcw, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { objectiveScore } from '../learning/reviewEngine';
import { selectReviewQuestions } from '../learning/questionSelection';
import { evaluateAnswer } from '../services/ai';
import type { AIEvaluation, Attempt, CardProgress, EvaluationResult, QuestionType, WordCard } from '../types';
import { LocalRecorder } from './LocalRecorder';
import { ModalShell } from './ModalShell';

interface ReviewSessionModalProps {
  open: boolean;
  card?: WordCard;
  progress?: CardProgress;
  aiConsent: boolean;
  onNeedConsent: () => void;
  onClose: () => void;
  onComplete: (cardId: string, attempts: Attempt[], evaluations: AIEvaluation[]) => Promise<void>;
}

const id = () => typeof crypto.randomUUID === 'function'
  ? crypto.randomUUID()
  : Date.now().toString(36) + Math.random().toString(36).slice(2);

const questionLabels: Record<QuestionType, string> = {
  meaning_choice: '词义与辨析',
  recall: '主动回忆',
  collocation: '搭配与例句',
  free_sentence: '真实造句',
  dialogue: '语境对话',
  weekly_writing: '综合写作',
  weekly_speaking: '即兴口语'
};

export function ReviewSessionModal({
  open,
  card,
  progress,
  aiConsent,
  onNeedConsent,
  onClose,
  onComplete
}: ReviewSessionModalProps) {
  const questions = useMemo(
    () => card && progress ? selectReviewQuestions(card, progress.stage) : [],
    [card, progress]
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ score?: number; correct?: boolean; result?: EvaluationResult; pending?: boolean; message?: string }>();
  const [submitting, setSubmitting] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [evaluations, setEvaluations] = useState<AIEvaluation[]>([]);
  const [shownAt, setShownAt] = useState(Date.now());
  const [speechLatency, setSpeechLatency] = useState<number>();

  useEffect(() => {
    if (open) {
      setQuestionIndex(0);
      setAnswer('');
      setFeedback(undefined);
      setSubmitting(false);
      setAttempts([]);
      setEvaluations([]);
      setShownAt(Date.now());
      setSpeechLatency(undefined);
    }
  }, [open, card?.id]);

  if (!card || !progress || !questions.length) return null;
  const question = questions[questionIndex];
  const responseMs = speechLatency ?? Date.now() - shownAt;

  const makeAttempt = (score: number, errors: string[], correctAnswer: string, ai: boolean): Attempt => ({
    id: id(),
    cardId: card.id,
    questionId: question.id,
    questionType: question.type,
    stage: progress.stage,
    prompt: question.prompt,
    answer,
    correctAnswer,
    score,
    correct: score >= 75,
    responseMs,
    errorTypes: errors,
    createdAt: new Date().toISOString(),
    ai
  });

  const submitObjective = () => {
    if (!answer.trim()) {
      setFeedback({ message: '先写下你的答案吧。' });
      return;
    }
    const scored = objectiveScore(answer, question.answer, responseMs);
    const attempt = makeAttempt(scored.score, scored.errors, question.answer, false);
    setAttempts((current) => [...current, attempt]);
    setFeedback({ score: scored.score, correct: scored.score >= 75, message: scored.score >= 75 ? '答对了，记忆正在变得更牢。' : '先看正确答案，再重新读一遍搭配。' });
  };

  const submitAI = async () => {
    if (!aiConsent) {
      onNeedConsent();
      return;
    }
    if (answer.trim().length < 3) {
      setFeedback({ message: '请至少写一个完整的英文短句。' });
      return;
    }
    setSubmitting(true);
    setFeedback(undefined);
    const requestId = id();
    const createdAt = new Date().toISOString();
    const baseEvaluation: AIEvaluation = {
      requestId,
      cardId: card.id,
      questionType: question.type,
      stage: progress.stage,
      answer,
      status: 'pending',
      createdAt,
      rubricVersion: '2026.08.17'
    };
    try {
      const evaluated = await evaluateAnswer({
        requestId,
        card,
        questionType: question.type,
        stage: progress.stage,
        prompt: question.prompt,
        answer,
        responseMs
      });
      const completed: AIEvaluation = {
        ...baseEvaluation,
        status: 'complete',
        model: evaluated.model,
        result: evaluated.result
      };
      setEvaluations((current) => [...current, completed]);
      setAttempts((current) => [...current, makeAttempt(
        evaluated.result.overallScore,
        evaluated.result.errorTypes,
        evaluated.result.correctedAnswer,
        true
      )]);
      setFeedback({ score: evaluated.result.overallScore, correct: evaluated.result.overallScore >= 75, result: evaluated.result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'AI 评分暂时不可用';
      setEvaluations((current) => [...current, { ...baseEvaluation, status: 'pending', errorMessage: message }]);
      setFeedback({ pending: true, message: '答案已留在本机待评分队列。联网或配置密钥后可以重试。' });
    } finally {
      setSubmitting(false);
    }
  };

  const next = async () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      setAnswer('');
      setFeedback(undefined);
      setShownAt(Date.now());
      setSpeechLatency(undefined);
      return;
    }
    await onComplete(card.id, attempts, evaluations);
    onClose();
  };

  const retry = () => {
    setAnswer('');
    setFeedback(undefined);
    setShownAt(Date.now());
  };

  const isOpenAnswer = question.ai;
  const showRecorder = question.type === 'dialogue';
  const hasOptions = Boolean(question.options?.length);

  return (
    <ModalShell
      open={open}
      title={card.word}
      eyebrow={progress.stage + ' · ' + (questionIndex + 1) + ' / ' + questions.length}
      onClose={onClose}
    >
      <div className="quiz-progress"><span style={{ width: ((questionIndex + 1) / questions.length * 100) + '%' }} /></div>
      <section className="quiz-prompt">
        <span className="quiz-type">{isOpenAnswer ? <Sparkles size={15} /> : <Brain size={15} />}{questionLabels[question.type]} · {isOpenAnswer ? 'AI 辅助评分' : '本地评分'}</span>
        <h3>{question.prompt}</h3>
        <p>本题来自完整词卡内容；本阶段共抽取 {questions.length} 个不同考点。</p>
      </section>

      {showRecorder && <LocalRecorder shownAt={shownAt} onStarted={setSpeechLatency} />}

      {hasOptions ? (
        <div className="choice-list">
          {question.options?.map((option) => (
            <button
              key={option}
              onClick={() => setAnswer(option)}
              disabled={Boolean(feedback)}
              className={[
                answer === option ? 'selected' : '',
                feedback && option === question.answer ? 'correct-option' : '',
                feedback && answer === option && option !== question.answer ? 'wrong-option' : ''
              ].filter(Boolean).join(' ')}
            >
              <span>{option}</span>{answer === option && <CheckCircle2 size={18} />}
            </button>
          ))}
        </div>
      ) : (
        <label className="answer-field">
          <span>{showRecorder ? '输入或确认你的文字稿' : '你的回答'}</span>
          {isOpenAnswer ? (
            <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Write your answer in English…" rows={5} disabled={Boolean(feedback)} />
          ) : (
            <input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Type your answer…" autoCapitalize="none" disabled={Boolean(feedback)} />
          )}
        </label>
      )}

      {feedback && (
        <section className={feedback.pending ? 'feedback-card pending' : feedback.correct ? 'feedback-card success' : 'feedback-card retry'}>
          <div className="feedback-title">
            {feedback.pending ? <CloudOff size={20} /> : feedback.correct ? <CheckCircle2 size={20} /> : <RotateCcw size={20} />}
            <strong>{feedback.pending ? '等待联网评分' : feedback.score !== undefined ? feedback.score + ' 分' : '再想一想'}</strong>
          </div>
          {feedback.message && <p>{feedback.message}</p>}
          {!feedback.correct && !feedback.pending && !isOpenAnswer && <p><b>正确答案：</b>{question.answer}</p>}
          {feedback.result && (
            <div className="ai-feedback">
              <p><b>简短点评：</b>{feedback.result.reasonZh}</p>
              <p><b>修正表达：</b>{feedback.result.correctedAnswer}</p>
              <p><b>更自然地说：</b>{feedback.result.naturalVersion}</p>
              {feedback.result.collocationSuggestions.length > 0 && <p><b>推荐搭配：</b>{feedback.result.collocationSuggestions.join(' · ')}</p>}
            </div>
          )}
        </section>
      )}

      <div className="quiz-actions">
        {!feedback && (
          <button className="primary-button" disabled={submitting || !answer.trim()} onClick={() => isOpenAnswer ? void submitAI() : submitObjective()}>
            {submitting ? <LoaderCircle className="spin" size={18} /> : isOpenAnswer ? <Sparkles size={18} /> : <CheckCircle2 size={18} />}
            {submitting ? '正在点评…' : '提交答案'}
          </button>
        )}
        {feedback && (
          <>
            {!feedback.correct && !feedback.pending && <button className="secondary-button" onClick={retry}><RotateCcw size={17} />重新回答</button>}
            <button className="primary-button" onClick={() => void next()}>
              {questionIndex === questions.length - 1 ? '完成本词复习' : '下一题'}<ArrowRight size={18} />
            </button>
          </>
        )}
      </div>
    </ModalShell>
  );
}

import { ArrowRight, Brain, CheckCircle2, LoaderCircle, RotateCcw, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { dimensionForQuestionType } from '../learning/mastery';
import { objectiveScore } from '../learning/reviewEngine';
import { selectReviewQuestions } from '../learning/questionSelection';
import { evaluateAnswer } from '../services/ai';
import type { AIEvaluation, Attempt, CardProgress, CardQuestion, EvaluationResult, QuestionType, WordCard } from '../types';
import { LocalRecorder } from './LocalRecorder';
import { EvaluationResultDetails } from './EvaluationResultDetails';
import { ModalShell } from './ModalShell';

interface ReviewSessionModalProps {
  open: boolean;
  card?: WordCard;
  progress?: CardProgress;
  aiConsent: boolean;
  onNeedConsent: () => void;
  onClose: () => void;
  onComplete: (cardId: string, attempts: Attempt[], evaluations: AIEvaluation[]) => Promise<void>;
  onRecordAttempt: (attempt: Attempt) => Promise<void>;
  onQueueEvaluation: (evaluation: AIEvaluation) => Promise<void>;
  onCompleteEvaluation: (
    evaluation: AIEvaluation,
    result: EvaluationResult,
    model: string,
    attempt: Omit<Attempt, 'score' | 'correct' | 'errorTypes' | 'ai'>
  ) => Promise<void>;
  batchPosition?: number;
  batchTotal?: number;
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
  onComplete,
  onRecordAttempt,
  onQueueEvaluation,
  onCompleteEvaluation,
  batchPosition = 1,
  batchTotal = 1
}: ReviewSessionModalProps) {
  const [questions, setQuestions] = useState<CardQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ score?: number; correct?: boolean; result?: EvaluationResult; pending?: boolean; message?: string }>();
  const [submitting, setSubmitting] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [shownAt, setShownAt] = useState(Date.now());
  const [speechLatency, setSpeechLatency] = useState<number>();
  const [sessionId, setSessionId] = useState(id());

  useEffect(() => {
    if (open) {
      setQuestions(card && progress ? selectReviewQuestions(card, progress) : []);
      setQuestionIndex(0);
      setAnswer('');
      setFeedback(undefined);
      setSubmitting(false);
      setAttempts([]);
      setShownAt(Date.now());
      setSpeechLatency(undefined);
      setSessionId(id());
    }
  }, [open, card?.id]);

  if (!card || !progress || !questions.length) return null;
  const question = questions[questionIndex];
  const responseMs = speechLatency ?? Date.now() - shownAt;

  const makeAttempt = (score: number, errors: string[], correctAnswer: string, ai: boolean, attemptId = id()): Attempt => ({
    id: attemptId,
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
    ai,
    dimensionScores: dimensionForQuestionType(question.type)
      ? { [dimensionForQuestionType(question.type)!]: score }
      : undefined,
    sessionId,
    scheduleImpact: !ai
  });

  const submitObjective = () => {
    if (!answer.trim()) {
      setFeedback({ message: '先写下你的答案吧。' });
      return;
    }
    const scored = objectiveScore(answer, question.answer, responseMs);
    const attempt = makeAttempt(scored.score, scored.errors, question.answer, false);
    setAttempts((current) => [...current, attempt]);
    void onRecordAttempt(attempt);
    setFeedback({ score: scored.score, correct: scored.score >= 75, message: scored.score >= 75 ? '答对了，记忆正在变得更牢。' : '先看正确答案，再重新读一遍搭配。' });
  };

  const submitAI = () => {
    if (!aiConsent) {
      onNeedConsent();
      return;
    }
    if (answer.trim().length < 3) {
      setFeedback({ message: '请至少写一个完整的英文短句。' });
      return;
    }
    setSubmitting(true);
    const requestId = id();
    const createdAt = new Date().toISOString();
    const savedAnswer = answer.trim();
    const savedResponseMs = responseMs;
    const baseEvaluation: AIEvaluation = {
      requestId,
      cardId: card.id,
      questionType: question.type,
      stage: progress.stage,
      answer: savedAnswer,
      status: 'pending',
      createdAt,
      updatedAt: createdAt,
      rubricVersion: '2026.08.18.8',
      prompt: question.prompt,
      questionId: question.id,
      correctAnswer: question.answer,
      responseMs: savedResponseMs
    };
    const attemptBase: Omit<Attempt, 'score' | 'correct' | 'errorTypes' | 'ai'> = {
      id: requestId,
      cardId: card.id,
      questionId: question.id,
      questionType: question.type,
      stage: progress.stage,
      prompt: question.prompt,
      answer: savedAnswer,
      correctAnswer: question.answer,
      responseMs: savedResponseMs,
      createdAt,
      sessionId,
      scheduleImpact: false
    };

    setFeedback({ pending: true, message: '答案已保存，AI 正在后台点评；你现在就可以继续下一题。完成后会自动出现在“掌握详情”中。' });
    setSubmitting(false);
    void onQueueEvaluation(baseEvaluation)
      .then(() => evaluateAnswer({
        requestId,
        card,
        questionId: question.id,
        questionType: question.type,
        stage: progress.stage,
        prompt: question.prompt,
        answer: savedAnswer,
        correctAnswer: question.answer,
        responseMs: savedResponseMs,
        rubricVersion: baseEvaluation.rubricVersion
      }))
      .then(async (evaluated) => {
        if (evaluated.status === 'complete') {
          await onCompleteEvaluation(baseEvaluation, evaluated.result, evaluated.model, {
            ...attemptBase,
            correctAnswer: evaluated.result.correctedAnswer
          });
        }
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'AI 评分暂时不可用';
        void onQueueEvaluation({ ...baseEvaluation, status: 'failed', updatedAt: new Date().toISOString(), errorMessage: message });
      });
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
    await onComplete(card.id, attempts, []);
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
      eyebrow={`本次第 ${batchPosition} / ${batchTotal} 词 · ${progress.stage} · ${questionIndex + 1} / ${questions.length} 题`}
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
            {feedback.pending ? <Sparkles size={20} /> : feedback.correct ? <CheckCircle2 size={20} /> : <RotateCcw size={20} />}
            <strong>{feedback.pending ? '已进入后台点评' : feedback.score !== undefined ? feedback.score + ' 分' : '再想一想'}</strong>
          </div>
          {feedback.message && <p>{feedback.message}</p>}
          {!feedback.correct && !feedback.pending && !isOpenAnswer && <p><b>正确答案：</b>{question.answer}</p>}
          {feedback.result && (
            <EvaluationResultDetails result={feedback.result} compact />
          )}
        </section>
      )}

      <div className="quiz-actions">
        {!feedback && (
          <button className="primary-button" disabled={submitting || !answer.trim()} onClick={() => isOpenAnswer ? submitAI() : submitObjective()}>
            {submitting ? <LoaderCircle className="spin" size={18} /> : isOpenAnswer ? <Sparkles size={18} /> : <CheckCircle2 size={18} />}
            {submitting ? '正在点评…' : '提交答案'}
          </button>
        )}
        {feedback && (
          <>
            {!feedback.correct && !feedback.pending && <button className="secondary-button" onClick={retry}><RotateCcw size={17} />重新回答</button>}
            <button className="primary-button" onClick={() => void next()}>
              {questionIndex === questions.length - 1
                ? batchPosition < batchTotal ? '完成本词，继续下一个' : '完成本次复习'
                : '下一题'}<ArrowRight size={18} />
            </button>
          </>
        )}
      </div>
    </ModalShell>
  );
}

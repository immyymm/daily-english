import { AlertCircle, Brain, CheckCircle2, Clock3, RefreshCw, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { masteryDimensionLabels, masteryDimensions } from '../learning/mastery';
import type { AIEvaluation, Attempt, CardProgress, WordCard } from '../types';
import { ModalShell } from './ModalShell';

interface MasteryDetailModalProps {
  open: boolean;
  card?: WordCard;
  progress?: CardProgress;
  attempts: Attempt[];
  evaluations: AIEvaluation[];
  onClose: () => void;
  onRetry: (evaluation: AIEvaluation) => void;
}

const statusText: Record<AIEvaluation['status'], string> = {
  pending: '排队中',
  processing: '点评中',
  complete: '已完成',
  failed: '等待重试'
};

function formatTime(value?: string) {
  if (!value) return '暂无';
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

export function MasteryDetailModal({
  open,
  card,
  progress,
  attempts,
  evaluations,
  onClose,
  onRetry
}: MasteryDetailModalProps) {
  const wordAttempts = useMemo(() => attempts
    .filter((attempt) => attempt.cardId === card?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [attempts, card?.id]);
  const wordEvaluations = useMemo(() => evaluations
    .filter((evaluation) => evaluation.cardId === card?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [evaluations, card?.id]);
  if (!card) return null;
  const errorEntries = Object.entries(progress?.errorCounts ?? {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);
  const score = progress?.masteryScore ?? progress?.lastScore;

  return (
    <ModalShell open={open} title={card.word + ' · 掌握详情'} eyebrow="MASTERY DIAGNOSIS" onClose={onClose} wide>
      <section className="mastery-overview-card">
        <div className="mastery-score-ring"><strong>{score === undefined ? '—' : Math.round(score)}</strong><span>综合掌握</span></div>
        <div>
          <span className={'status-tag ' + (progress?.weak ? 'weak' : '')}>{progress?.status ?? '未测试'}</span>
          <h3>{progress?.stage ?? 'T0'} 阶段 · 已完成 {progress?.attemptCount ?? wordAttempts.length} 次检测</h3>
          <p><Clock3 size={15} />下次复习：{formatTime(progress?.nextReviewAt)}</p>
        </div>
      </section>

      <section className="mastery-detail-section">
        <div className="mastery-section-title"><Brain size={18} /><div><h3>五维掌握画像</h3><p>低于 75 分的维度会自动增加题量和复习频率</p></div></div>
        <div className="dimension-list">
          {masteryDimensions.map((dimension) => {
            const value = progress?.dimensionScores?.[dimension];
            const weak = typeof value === 'number' && value < 75;
            return (
              <div className={weak ? 'dimension-row weak' : 'dimension-row'} key={dimension}>
                <span>{masteryDimensionLabels[dimension]}</span>
                <div><i style={{ width: (value ?? 0) + '%' }} /></div>
                <b>{value === undefined ? '未测' : Math.round(value)}</b>
              </div>
            );
          })}
        </div>
        {(progress?.weakDimensions?.length ?? 0) > 0 && (
          <div className="weak-focus-note"><AlertCircle size={17} /><p>当前重点：{progress!.weakDimensions!.map((dimension) => masteryDimensionLabels[dimension]).join('、')}。系统会在下一轮优先抽取对应题型。</p></div>
        )}
      </section>

      <section className="mastery-detail-section">
        <div className="mastery-section-title"><AlertCircle size={18} /><div><h3>具体问题分布</h3><p>根据所有客观题和 AI 点评实时累计</p></div></div>
        {errorEntries.length ? (
          <div className="error-chip-list">{errorEntries.map(([name, count]) => <span key={name}>{name}<b>{count}</b></span>)}</div>
        ) : <p className="mastery-empty">目前没有累计到明确错误；继续完成复测后画像会更准确。</p>}
      </section>

      <section className="mastery-detail-section">
        <div className="mastery-section-title"><Sparkles size={18} /><div><h3>AI 点评记录</h3><p>即使当时关闭页面，后台完成的结果也会永久保留在账户中</p></div></div>
        {wordEvaluations.length ? (
          <div className="evaluation-history">
            {wordEvaluations.map((evaluation) => (
              <details key={evaluation.requestId} open={wordEvaluations.length === 1}>
                <summary>
                  <span className={'evaluation-state ' + evaluation.status}>
                    {evaluation.status === 'complete' ? <CheckCircle2 size={15} /> : evaluation.status === 'failed' ? <AlertCircle size={15} /> : <Sparkles size={15} />}
                    {statusText[evaluation.status]}
                  </span>
                  <strong>{evaluation.result ? evaluation.result.overallScore + ' 分' : formatTime(evaluation.updatedAt ?? evaluation.createdAt)}</strong>
                </summary>
                <div className="evaluation-body">
                  {evaluation.prompt && <p><b>题目</b>{evaluation.prompt}</p>}
                  <p><b>你的回答</b>{evaluation.answer}</p>
                  {evaluation.result ? (
                    <>
                      <p><b>问题分析</b>{evaluation.result.reasonZh}</p>
                      <p><b>修正表达</b>{evaluation.result.correctedAnswer}</p>
                      <p><b>自然表达</b>{evaluation.result.naturalVersion}</p>
                      <p><b>错误类型</b>{evaluation.result.errorTypes.length ? evaluation.result.errorTypes.join(' · ') : '没有明显问题'}</p>
                      {evaluation.result.collocationSuggestions.length > 0 && <p><b>推荐搭配</b>{evaluation.result.collocationSuggestions.join(' · ')}</p>}
                    </>
                  ) : (
                    <>
                      <p><b>当前状态</b>{evaluation.errorMessage ?? (evaluation.status === 'processing' ? '模型正在分析，完成后会自动更新。' : '答案已经保存，等待后台处理。')}</p>
                      {evaluation.status === 'failed' && <button className="secondary-button mastery-retry" onClick={() => onRetry(evaluation)}><RefreshCw size={16} />重新提交点评</button>}
                    </>
                  )}
                </div>
              </details>
            ))}
          </div>
        ) : <p className="mastery-empty">这个词还没有开放题点评。完成“真实造句”或“语境对话”后会显示详细分析。</p>}
      </section>

      <section className="mastery-detail-section">
        <div className="mastery-section-title"><CheckCircle2 size={18} /><div><h3>最近答题</h3><p>用于核对系统为什么判定为当前掌握状态</p></div></div>
        {wordAttempts.length ? (
          <div className="attempt-history">{wordAttempts.slice(0, 10).map((attempt) => (
            <article key={attempt.id}>
              <span className={attempt.correct ? 'attempt-result correct' : 'attempt-result'}>{attempt.score}</span>
              <div><strong>{attempt.prompt}</strong><p>{attempt.answer || '未作答'} · {formatTime(attempt.createdAt)}</p></div>
            </article>
          ))}</div>
        ) : <p className="mastery-empty">还没有答题记录。</p>}
      </section>
    </ModalShell>
  );
}

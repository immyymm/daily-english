import { AlertCircle, CheckCircle2, GitCompareArrows, ListChecks, Sparkles } from 'lucide-react';
import { masteryDimensionLabels, masteryDimensions } from '../learning/mastery';
import type { EvaluationResult, MasteryDimension } from '../types';

const dimensionMaximum: Record<MasteryDimension, number> = {
  meaningContext: 25,
  activeRecall: 20,
  collocation: 20,
  grammar: 15,
  naturalness: 10
};

export function EvaluationResultDetails({ result, compact = false }: { result: EvaluationResult; compact?: boolean }) {
  return (
    <div className={compact ? 'evaluation-result-details compact' : 'evaluation-result-details'}>
      <section className={result.taskCompliance.passed ? 'evaluation-compliance passed' : 'evaluation-compliance failed'}>
        <div>
          {result.taskCompliance.passed ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
          <strong>题目要求 {result.taskCompletionScore}/10</strong>
        </div>
        <p>{result.taskCompliance.summaryZh}</p>
        {result.taskCompliance.checks.length > 0 && (
          <ul>
            {result.taskCompliance.checks.map((check) => (
              <li className={check.passed ? 'passed' : 'failed'} key={check.id}>
                {check.passed ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span><b>{check.labelZh}</b><small>{check.evidenceZh}</small></span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="evaluation-dimensions">
        <div className="evaluation-subtitle"><ListChecks size={16} /><strong>评分依据</strong></div>
        {masteryDimensions.map((dimension) => {
          const score = result.dimensionScores[dimension];
          const maximum = dimensionMaximum[dimension];
          return (
            <article key={dimension}>
              <div><span>{masteryDimensionLabels[dimension]}</span><b>{score}/{maximum}</b></div>
              <i><span style={{ width: `${score / maximum * 100}%` }} /></i>
              {result.dimensionFeedback[dimension] && <p>{result.dimensionFeedback[dimension]}</p>}
            </article>
          );
        })}
      </section>

      <section className="evaluation-language-review">
        <p><b>总体分析</b><span>{result.reasonZh}</span></p>
        {result.issues.length > 0 && (
          <div className="evaluation-issues">
            {result.issues.map((issue, index) => (
              <article className={issue.severity} key={`${issue.category}-${index}`}>
                <div><span>{issue.category}</span><small>{issue.severity === 'major' ? '重点问题' : '细节优化'}</small></div>
                {issue.originalText && <p><b>原表达</b>{issue.originalText}</p>}
                {issue.suggestedText && <p><b>建议</b>{issue.suggestedText}</p>}
                <p><b>原因</b>{issue.explanationZh}</p>
              </article>
            ))}
          </div>
        )}
        <p><b>修正表达</b><span lang="en">{result.correctedAnswer}</span></p>
        <p><b>自然表达</b><span lang="en">{result.naturalVersion}</span></p>
      </section>

      <section className="evaluation-natural-reason">
        <div className="evaluation-subtitle"><GitCompareArrows size={16} /><strong>为什么更自然</strong></div>
        <p>{result.naturalVersionReasonZh}</p>
        {result.naturalChanges.length > 0 && (
          <div className="natural-change-list">
            {result.naturalChanges.map((change, index) => (
              <article key={`${change.from}-${change.to}-${index}`}>
                <div><del>{change.from}</del><span>→</span><ins>{change.to}</ins></div>
                <p>{change.reasonZh}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {result.collocationSuggestions.length > 0 && (
        <section className="evaluation-collocations">
          <div className="evaluation-subtitle"><Sparkles size={16} /><strong>下一步可练搭配</strong></div>
          <div>{result.collocationSuggestions.map((item) => <span key={item}>{item}</span>)}</div>
        </section>
      )}

      <footer className="evaluation-result-meta">
        <span>{result.needsRetry ? '建议重新作答' : '本题通过'}</span>
        <span>AI 置信度 {Math.round(result.confidence * 100)}%</span>
      </footer>
    </div>
  );
}

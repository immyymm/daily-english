import { GitCompareArrows, ListChecks, Sparkles } from 'lucide-react';
import { masteryDimensionLabels, masteryDimensions } from '../learning/mastery';
import { reconstructNaturalVersion } from '../schemas/evaluationConstraints';
import type { EvaluationResult, MasteryDimension } from '../types';

const dimensionMaximum: Record<MasteryDimension, number> = {
  meaningContext: 25,
  activeRecall: 20,
  collocation: 20,
  grammar: 15,
  naturalness: 10
};

export function EvaluationResultDetails({ result, compact = false }: { result: EvaluationResult; compact?: boolean }) {
  const reconstructedNaturalVersion = reconstructNaturalVersion(
    result.correctedAnswer,
    result.naturalVersion,
    result.naturalChanges
  );
  const verifiedNaturalChanges = reconstructedNaturalVersion ? result.naturalChanges : [];

  return (
    <div className={compact ? 'evaluation-result-details compact' : 'evaluation-result-details'}>
      <section className="evaluation-dimensions">
        <div className="evaluation-subtitle"><ListChecks size={16} /><strong>能力分析</strong></div>
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
        <div className="evaluation-subtitle"><GitCompareArrows size={16} /><strong>具体改了什么，为什么更自然</strong></div>
        {verifiedNaturalChanges.length > 0 && (
          <div className="natural-change-list">
            {verifiedNaturalChanges.map((change, index) => (
              <article key={`${change.from}-${change.to}-${index}`}>
                <strong>词语修改 {index + 1}</strong>
                <div className="natural-change-words">
                  <span><small>原词 / 短语</small><del lang="en">{change.from}</del></span>
                  <i aria-hidden="true">→</i>
                  <span><small>改为</small><ins lang="en">{change.to}</ins></span>
                </div>
                <div className="natural-change-explanation">
                  <p><b>原表达的问题</b>{change.sourceIssueZh}</p>
                  <p><b>为什么改成“{change.to}”</b>{change.replacementReasonZh}</p>
                </div>
              </article>
            ))}
            <p className="natural-change-verification">
              <b>逐项替换后的完整句（与上方自然表达一致）</b>
              <span lang="en">{reconstructedNaturalVersion}</span>
            </p>
          </div>
        )}
        {verifiedNaturalChanges.length === 0 && <p>{result.naturalVersionReasonZh}</p>}
      </section>

      {result.collocationSuggestions.length > 0 && (
        <section className="evaluation-collocations">
          <div className="evaluation-subtitle"><Sparkles size={16} /><strong>下一步可练搭配</strong></div>
          <div>{result.collocationSuggestions.map((item) => <span key={item}>{item}</span>)}</div>
        </section>
      )}

      <footer className="evaluation-result-meta">
        <span>{result.needsRetry ? '建议重新作答' : '本题通过'}</span>
      </footer>
    </div>
  );
}

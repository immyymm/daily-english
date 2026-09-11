// Runtime mirror of content/release.json. scripts/validate-content.mjs fails the
// build if any value drifts, while keeping Vercel Functions independent of JSON
// module-resolution differences.
export const releaseConfig = {
  releaseVersion: '2026.09.10.4',
  contentVersion: '2026.09.10.4',
  templateVersion: 'learning-template-2026.09.10.4',
  templateLockVersion: '2026.09.10.4',
  evaluationRubricVersion: '2026.08.19.2',
  reviewScheduleVersion: '2026.08.19.2'
} as const;

import { describe, expect, it } from 'vitest';
import { checkTaskRequirements, deriveTaskRequirements, includesLemma } from './taskRequirements';

describe('task requirements', () => {
  it('treats improve on as an exact phrase instead of separately requiring improve', () => {
    const requirements = deriveTaskRequirements({
      questionType: 'free_sentence',
      prompt: '请用完整搭配 “improve on” 写一个与自己有关的自然英文句子。',
      targetWord: 'improve'
    });
    expect(requirements.mustUseExact).toEqual(['improve on']);
    expect(requirements.mustUseLemma).toEqual([]);
    expect(checkTaskRequirements('I want to improve on my last result.', requirements).every((item) => item.passed)).toBe(true);
  });

  it('accepts reasonable inflections for a lemma requirement', () => {
    expect(includesLemma('My writing improved after daily practice.', 'improve')).toBe(true);
    expect(includesLemma('My writing is getting better.', 'improve')).toBe(false);
  });

  it('checks dialogue turns and weekly writing requirements deterministically', () => {
    const dialogue = deriveTaskRequirements({
      questionType: 'dialogue',
      prompt: '写一段 2–4 轮真实对话，自然使用 “improve your English”。',
      targetWord: 'improve'
    });
    const checks = checkTaskRequirements('A: How can I improve my English?\nB: Read every day to improve your English.', dialogue);
    expect(checks.every((item) => item.passed)).toBe(true);

    const weekly = deriveTaskRequirements({
      questionType: 'weekly_writing',
      prompt: '写一段 180–240 词的英文短文，至少自然使用 5 个本周词（improve、notice、manage、reason、habit）和 2 个词卡搭配（improve on、pay attention）。',
      targetWord: 'improve',
      weeklyWords: ['improve', 'notice', 'manage', 'reason', 'habit']
    });
    const weeklyChecks = checkTaskRequirements('I improve on a habit because I notice a reason and manage to pay attention.', weekly);
    expect(weeklyChecks.find((item) => item.id === 'word-count')?.passed).toBe(false);
    expect(weeklyChecks.find((item) => item.id === 'weekly-words')?.passed).toBe(true);
    expect(weeklyChecks.find((item) => item.id === 'weekly-collocations')?.passed).toBe(true);
  });
});

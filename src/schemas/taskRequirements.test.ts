import { describe, expect, it } from 'vitest';
import { checkTaskRequirements, deriveTaskRequirements, includesLemma, includesUsagePattern } from './taskRequirements';

describe('task requirements', () => {
  it('treats improve on as an inflectable usage pattern instead of separately requiring improve', () => {
    const requirements = deriveTaskRequirements({
      questionType: 'free_sentence',
      prompt: '请用完整搭配 “improve on” 写一个与自己有关的自然英文句子。',
      targetWord: 'improve'
    });
    expect(requirements.mustUseExact).toEqual([]);
    expect(requirements.mustUsePatterns).toEqual(['improve on']);
    expect(requirements.mustUseLemma).toEqual([]);
    expect(checkTaskRequirements('I want to improve on my last result.', requirements).every((item) => item.passed)).toBe(true);
    expect(checkTaskRequirements('I improved on my last result.', requirements).every((item) => item.passed)).toBe(true);
  });

  it('treats do as a grammar slot in manage to do', () => {
    const requirements = deriveTaskRequirements({
      questionType: 'free_sentence',
      prompt: '请使用 “manage to do” 结构写一个与自己有关的自然英文句子；do 表示任意合适的动词原形。',
      targetWord: 'manage'
    });

    expect(requirements.mustUsePatterns).toEqual(['manage to do']);
    expect(checkTaskRequirements('I manage to save money every month.', requirements).every((item) => item.passed)).toBe(true);
    expect(checkTaskRequirements('I managed to finish the report.', requirements).every((item) => item.passed)).toBe(true);
    expect(checkTaskRequirements('I manage my money carefully.', requirements).every((item) => item.passed)).toBe(false);
  });

  it('instantiates person, thing, gerund, pronoun and A/B slots', () => {
    expect(includesUsagePattern('My teacher encouraged me to speak more.', 'encourage someone to do')).toBe(true);
    expect(includesUsagePattern('I spend time reading every evening.', 'spend time doing')).toBe(true);
    expect(includesUsagePattern('I believe in myself.', 'believe in yourself')).toBe(true);
    expect(includesUsagePattern('I prefer tea to coffee.', 'prefer A to B')).toBe(true);
  });

  it('accepts reasonable inflections for a lemma requirement', () => {
    expect(includesLemma('My writing improved after daily practice.', 'improve')).toBe(true);
    expect(includesLemma('My writing is getting better.', 'improve')).toBe(false);
    expect(includesLemma('She planned the lesson carefully.', 'plan')).toBe(true);
    expect(includesLemma('I wrote a short message.', 'write')).toBe(true);
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

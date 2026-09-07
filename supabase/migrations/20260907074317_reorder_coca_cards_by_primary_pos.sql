-- Keep stable card ids and user mastery rows, but make every future new-word
-- batch follow the audited primary-POS order: verb, noun, adjective, adverb,
-- other; within each group use the matching COCA lemma rank. The update is
-- performed in place: no catalog row or user-owned learning row is deleted.
alter table private.daily_english_card_catalog
  drop constraint daily_english_card_catalog_sequence_no_key;

alter table private.daily_english_card_catalog
  add constraint daily_english_card_catalog_sequence_no_key
  unique (sequence_no) deferrable initially deferred;

with desired as (
  select card_id, sequence_no::smallint
  from unnest(array[
  'mean-v', 'become-v', 'happen-v', 'seem-v', 'believe-v',
  'write-v', 'read-v', 'provide-v', 'understand-v', 'change-v',
  'create-v', 'learn-v', 'include-v', 'follow-v', 'remember-v',
  'speak-v', 'allow-v', 'continue-v', 'spend-v', 'consider-v',
  'offer-v', 'expect-v', 'require-v', 'listen-v', 'decide-v',
  'suggest-v', 'support-v', 'reach-v', 'remain-v', 'explain-v',
  'choose-v', 'develop-v', 'share-v', 'realize-v', 'describe-v',
  'increase-v', 'protect-v', 'compare-v', 'reduce-v', 'accept-v',
  'prepare-v', 'avoid-v', 'notice-v', 'affect-v', 'manage-v',
  'improve-v', 'discover-v', 'handle-v', 'achieve-v', 'express-v',
  'encourage-v', 'depend-v', 'prefer-v', 'solve-v', 'time-n',
  'family-n', 'place-n', 'problem-n', 'question-n', 'work-n',
  'money-n', 'system-n', 'story-n', 'job-n', 'friend-n',
  'business-n', 'home-n', 'study-n', 'issue-n', 'idea-n',
  'team-n', 'service-n', 'information-n', 'health-n', 'reason-n',
  'community-n', 'level-n', 'result-n', 'moment-n', 'experience-n',
  'plan-n', 'decision-n', 'value-n', 'relationship-n', 'difference-n',
  'effort-n', 'situation-n', 'activity-n', 'choice-n', 'opportunity-n',
  'future-n', 'attention-n', 'goal-n', 'behavior-n', 'language-n',
  'ability-n', 'quality-n', 'benefit-n', 'skill-n', 'success-n',
  'purpose-n', 'environment-n', 'challenge-n', 'advice-n', 'progress-n',
  'balance-n', 'confidence-n', 'travel-n', 'habit-n', 'different-adj',
  'important-adj', 'possible-adj', 'clear-adj', 'certain-adj', 'available-adj',
  'ready-adj', 'likely-adj', 'difficult-adj', 'common-adj', 'similar-adj',
  'natural-adj', 'serious-adj', 'effective-adj', 'responsible-adj', 'aware-adj',
  'familiar-adj', 'comfortable-adj', 'useful-adj', 'careful-adj', 'patient-adj',
  'still-adv', 'actually-adv', 'however-adv', 'already-adv', 'together-adv',
  'often-adv', 'enough-adv', 'probably-adv', 'perhaps-adv', 'especially-adv',
  'finally-adv', 'simply-adv', 'nearly-adv', 'recently-adv', 'usually-adv',
  'forward-adv', 'quickly-adv', 'clearly-adv', 'instead-adv', 'directly-adv'
]::text[]) with ordinality as cards(card_id, sequence_no)
)
update private.daily_english_card_catalog as catalog
set sequence_no = desired.sequence_no,
    content_version = '2026.09.07.1'
from desired
where catalog.card_id = desired.card_id;

do $$
begin
  if (select count(*) from private.daily_english_card_catalog) <> 150
    or (select min(sequence_no) from private.daily_english_card_catalog) <> 1
    or (select max(sequence_no) from private.daily_english_card_catalog) <> 150
    or (select count(*) from private.daily_english_card_catalog where content_version = '2026.09.07.1') <> 150 then
    raise exception 'daily_english_card_catalog reorder is incomplete';
  end if;
end
$$;

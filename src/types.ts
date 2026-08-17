export type TabId = 'today' | 'review' | 'library' | 'profile';
export type ReviewStage = 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7';
export type MasteryStatus =
  | '未测试'
  | '学习中'
  | '识别词汇'
  | '待巩固'
  | '基本掌握'
  | '主动掌握'
  | '长期掌握'
  | '薄弱词';

export type QuestionType =
  | 'meaning_choice'
  | 'recall'
  | 'collocation'
  | 'free_sentence'
  | 'dialogue'
  | 'weekly_writing'
  | 'weekly_speaking';

export interface CardQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  answer: string;
  stage: ReviewStage;
  ai: boolean;
}

export interface WordCard {
  id: string;
  word: string;
  lemma: string;
  cocaRanks?: Array<{
    rank: number;
    pos: string;
    frequency: number;
    partOfSpeech: string;
  }>;
  cocaRankLabel?: string;
  phonetic: string;
  syllables: string;
  partOfSpeech: string;
  frequencyBand: string;
  difficulty: string;
  tags: string[];
  coreMemory: {
    chinese: string;
    english: string;
    structure: string;
    structures?: Array<{
      phrase: string;
      phonetic: string;
      chinese: string;
    }>;
    commonError: string;
    commonErrors?: Array<{
      wrong: string;
      wrongPhonetic: string;
      right: string;
      rightPhonetic: string;
      note: string;
    }>;
    directSynonym: string;
    directAntonym: string;
    derivatives: string;
    example: string;
    exampleChinese: string;
  };
  meanings: Array<{
    partOfSpeech: string;
    english: string;
    chinese: string;
    example: string;
    translation: string;
  }>;
  contextPhrases: Array<{
    category: string;
    items: Array<{ phrase: string; phonetic: string; chinese: string }>;
  }>;
  fixedPhrases: Array<{
    phrase: string;
    phonetic: string;
    chinese: string;
    example: string;
    translation: string;
  }>;
  synonyms: Array<{
    word: string;
    phonetic: string;
    partOfSpeech: string;
    chinese: string;
    difference: string;
  }>;
  antonyms: Array<{
    word: string;
    phonetic: string;
    partOfSpeech: string;
    chinese: string;
    usage: string;
  }>;
  derivatives: Array<{
    word: string;
    phonetic: string;
    partOfSpeech: string;
    chinese: string;
    note: string;
  }>;
  confusables: Array<{
    word: string;
    phonetic: string;
    partOfSpeech: string;
    chinese: string;
    difference: string;
  }>;
  relatedVocabulary: Array<{
    category: string;
    items: Array<{ word: string; phonetic: string; partOfSpeech: string; chinese: string }>;
  }>;
  examples: Array<{ scene: string; english: string; chinese: string }>;
  studyFocus: {
    coreMeaning: string;
    keyCollocation: string;
    commonMistake: string;
    mustUseExample: string;
  };
  questions: CardQuestion[];
  reviewStages: Record<ReviewStage, QuestionType[]>;
  detailLevel?: 'template-complete' | 'standard';
  contentVersion: string;
  reviewed: boolean;
  sourceNote: string;
}

export interface ContentBundle {
  contentVersion: string;
  total: number;
  cards: WordCard[];
}

export interface AppSettings {
  id: 'settings';
  firstUseDate: string;
  lastStudyDate?: string;
  streak: number;
  aiConsent: boolean;
  reduceMotion: boolean;
  dailyAiLimit: number;
  installHintDismissed?: boolean;
}

export interface CardProgress {
  cardId: string;
  learnedAt: string;
  stage: ReviewStage;
  nextReviewAt: string;
  lastReviewedAt?: string;
  status: MasteryStatus;
  lastScore?: number;
  correctStreak: number;
  wrongCount: number;
  unstableCount: number;
  weak: boolean;
  passedT7: boolean;
  passedT30: boolean;
  passedT60: boolean;
}

export interface Attempt {
  id: string;
  cardId: string;
  questionId: string;
  questionType: QuestionType;
  stage: ReviewStage;
  prompt: string;
  answer: string;
  correctAnswer: string;
  score: number;
  correct: boolean;
  responseMs: number;
  errorTypes: string[];
  createdAt: string;
  ai: boolean;
}

export interface AIEvaluation {
  requestId: string;
  cardId: string;
  questionType: QuestionType;
  stage: ReviewStage;
  answer: string;
  status: 'complete' | 'pending' | 'failed';
  createdAt: string;
  model?: string;
  rubricVersion: string;
  result?: EvaluationResult;
  errorMessage?: string;
}

export interface EvaluationResult {
  overallScore: number;
  dimensionScores: {
    meaningContext: number;
    activeRecall: number;
    collocation: number;
    grammar: number;
    naturalness: number;
  };
  errorTypes: string[];
  correctedAnswer: string;
  naturalVersion: string;
  reasonZh: string;
  collocationSuggestions: string[];
  needsRetry: boolean;
  confidence: number;
}

export interface DailyPlanRecord {
  date: string;
  studyDay: number;
  cycle: number;
  cardIds: string[];
  completedCardIds: string[];
  contentVersion: string;
}

export interface AppSnapshot {
  settings: AppSettings;
  progress: CardProgress[];
  attempts: Attempt[];
  aiEvaluations: AIEvaluation[];
  dailyPlans: DailyPlanRecord[];
  exportedAt: string;
  schemaVersion: 1;
}

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type CardStatus = 'new' | 'learning' | 'review' | 'mastered';

export type SrsRating = 'again' | 'hard' | 'good' | 'easy';

export interface Card {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: 'Adjective' | 'Noun' | 'Verb' | 'Adverb' | 'Idiom' | 'Phrase';
  definition: string;
  vietnameseMeaning: string;
  exampleSentence: string;
  usageContext?: string;
  rootOrigin?: string;
  synonyms: string[];
  antonyms?: string[];
  collocations?: string[];
  imageUrl?: string;
  easeFactor: number; // default 2.5
  intervalDays: number;
  repetitions: number;
  dueDate: string; // ISO date string
  lastReviewDate?: string;
  status: CardStatus;
  isBookmarked?: boolean;
}

export interface Deck {
  id: string;
  title: string;
  category: 'IELTS' | 'Oxford 3000' | 'Business' | 'Daily' | 'GRE / Roots' | 'Specialized' | 'Custom';
  level: CefrLevel;
  description: string;
  cardCount: number;
  dueCount: number;
  masteryRate: number; // 0 - 100
  lastReviewed: string;
  iconName?: string;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'sky' | 'rose' | 'violet';
  tags: string[];
  cards: Card[];
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  count: number;
  accuracy: number;
}

export interface UserStats {
  name: string;
  handle: string;
  levelTitle: string;
  currentStreak: number;
  longestStreak: number;
  totalWordsMastered: number;
  sessionAccuracy: number;
  currentXp: number;
  nextLevelXp: number;
  dailyGoalTarget: number;
  dailyGoalCompleted: number;
  maturePct: number;
  learningPct: number;
  unseenPct: number;
  desiredRetention: number; // 80 - 95%
  maxNewCardsPerDay: number;
  dailyReviewLimit: number;
  soundEffects: boolean;
  autoplayAudio: boolean;
}

export type ViewMode = 'dashboard' | 'study' | 'decks' | 'analytics' | 'practice' | 'profile';

export interface AiPracticeWord {
  word: string;
  status: 'completed' | 'in_progress' | 'pending';
  cefr: CefrLevel;
  partOfSpeech: string;
  definition: string;
  collocations: string[];
  retentionRate: number;
  promptChallenge: string;
  sampleAnswer?: string;
}

export interface AiEvaluationResult {
  score: number;
  cefrVerified: string;
  summary: string;
  grammarTonePoints: string[];
  collocations: string[];
  modelAlternative: string;
  xpEarned: number;
}

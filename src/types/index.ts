// JLPT Levels
export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

// User Profile
export interface UserProfile {
  id: string;
  name: string;
  currentLevel: JLPTLevel;
  createdAt: Date;
  lastActive: Date;
}

// Progress Tracking
export interface SkillProgress {
  vocabulary: number; // 0-100
  kanji: number;
  grammar: number;
  reading: number;
}

export interface LevelProgress {
  level: JLPTLevel;
  skills: SkillProgress;
  vocabularyMastered: number;
  kanjiMastered: number;
  grammarPatternsMastered: number;
  articlesRead: number;
  // JLPT Score Estimation
  estimatedJLPTScore?: {
    total: number; // 0-180
    languageKnowledge: number; // 0-60 or 0-120
    reading: number; // 0-60 or 0 for N4-N5
    listening: number; // 0-60
    passed: boolean;
    lastUpdated: Date;
  };
}

// Content Types
export type ContentSource = 'curated' | 'ai-generated' | 'user-requested' | 'external';

export interface Content {
  id: string;
  title: string;
  level: JLPTLevel;
  type: 'article' | 'lesson' | 'exercise';
  source: ContentSource;
  content: string;
  vocabulary: VocabularyItem[];
  grammarPoints: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Vocabulary
export interface VocabularyItem {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  level: JLPTLevel;
  partOfSpeech: string;
  examples: string[];
  mastered: boolean;
  lastReviewed?: Date;
  nextReview?: Date;
}

// Kanji
export type KanjiCategory = 'numbers' | 'days' | 'time' | 'people' | 'verbs' | 'adjectives' | 'places' | 'common';

export interface KanjiItem {
  id: string;
  character: string;
  meaning: string;
  category: KanjiCategory;
  readings: {
    onyomi: string[];
    kunyomi: string[];
  };
  romaji?: {
    onyomi: string[];
    kunyomi: string[];
  };
  level: JLPTLevel;
  strokes: number;
  radicals: string[];
  mastered: boolean;
  lastReviewed?: Date;
  nextReview?: Date;
}

// Grammar
export interface GrammarPattern {
  id: string;
  pattern: string;
  meaning: string;
  level: JLPTLevel;
  explanation: string;
  examples: {
    japanese: string;
    english: string;
  }[];
  mastered: boolean;
}

// Difficulty Dial Settings
export interface DifficultySettings {
  showFurigana: boolean;
  showRomaji: boolean;
  showEnglish: boolean;
  showGrammarNotes: boolean;
  highlightUnknownWords: boolean;
}

// User Settings
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  defaultDifficulty: DifficultySettings;
  offlineMode: boolean;
  dataSyncEnabled: boolean;
}

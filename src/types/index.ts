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
export interface KanjiItem {
  id: string;
  character: string;
  meaning: string;
  readings: {
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

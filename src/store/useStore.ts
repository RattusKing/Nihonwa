import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, LevelProgress, JLPTLevel, DifficultySettings, AppSettings } from '../types';
import type { LessonProgress } from '../types/lesson';

interface AppState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Progress
  progress: LevelProgress[];
  updateProgress: (level: JLPTLevel, progress: Partial<LevelProgress>) => void;

  // Lesson Progress & XP
  lessonProgress: LessonProgress[];
  updateLessonProgress: (lessonId: string, progress: Partial<LessonProgress>) => void;
  totalXP: number;
  addXP: (amount: number) => void;

  // Difficulty Settings
  difficultySettings: DifficultySettings;
  setDifficultySettings: (settings: Partial<DifficultySettings>) => void;

  // App Settings
  appSettings: AppSettings;
  setAppSettings: (settings: Partial<AppSettings>) => void;

  // UI State
  showLevelSelector: boolean;
  setShowLevelSelector: (show: boolean) => void;
}

const defaultDifficultySettings: DifficultySettings = {
  showFurigana: true,
  showRomaji: false,
  showEnglish: false,
  showGrammarNotes: true,
  highlightUnknownWords: true,
};

const defaultAppSettings: AppSettings = {
  theme: 'light',
  defaultDifficulty: defaultDifficultySettings,
  offlineMode: true,
  dataSyncEnabled: false,
};

const initialProgress: LevelProgress[] = [
  {
    level: 'N5',
    skills: { vocabulary: 0, kanji: 0, grammar: 0, reading: 0 },
    vocabularyMastered: 0,
    kanjiMastered: 0,
    grammarPatternsMastered: 0,
    articlesRead: 0,
  },
  {
    level: 'N4',
    skills: { vocabulary: 0, kanji: 0, grammar: 0, reading: 0 },
    vocabularyMastered: 0,
    kanjiMastered: 0,
    grammarPatternsMastered: 0,
    articlesRead: 0,
  },
  {
    level: 'N3',
    skills: { vocabulary: 0, kanji: 0, grammar: 0, reading: 0 },
    vocabularyMastered: 0,
    kanjiMastered: 0,
    grammarPatternsMastered: 0,
    articlesRead: 0,
  },
  {
    level: 'N2',
    skills: { vocabulary: 0, kanji: 0, grammar: 0, reading: 0 },
    vocabularyMastered: 0,
    kanjiMastered: 0,
    grammarPatternsMastered: 0,
    articlesRead: 0,
  },
  {
    level: 'N1',
    skills: { vocabulary: 0, kanji: 0, grammar: 0, reading: 0 },
    vocabularyMastered: 0,
    kanjiMastered: 0,
    grammarPatternsMastered: 0,
    articlesRead: 0,
  },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),

      // Progress
      progress: initialProgress,
      updateProgress: (level, newProgress) =>
        set((state) => ({
          progress: state.progress.map((p) =>
            p.level === level ? { ...p, ...newProgress } : p
          ),
        })),

      // Lesson Progress & XP
      lessonProgress: [],
      updateLessonProgress: (lessonId, newProgress) =>
        set((state) => {
          const existing = state.lessonProgress.find((p) => p.lessonId === lessonId);
          if (existing) {
            return {
              lessonProgress: state.lessonProgress.map((p) =>
                p.lessonId === lessonId ? { ...p, ...newProgress } : p
              ),
            };
          } else {
            return {
              lessonProgress: [
                ...state.lessonProgress,
                { lessonId, completed: false, xp: 0, ...newProgress },
              ],
            };
          }
        }),
      totalXP: 0,
      addXP: (amount) =>
        set((state) => ({
          totalXP: state.totalXP + amount,
        })),

      // Difficulty Settings
      difficultySettings: defaultDifficultySettings,
      setDifficultySettings: (settings) =>
        set((state) => ({
          difficultySettings: { ...state.difficultySettings, ...settings },
        })),

      // App Settings
      appSettings: defaultAppSettings,
      setAppSettings: (settings) =>
        set((state) => ({
          appSettings: { ...state.appSettings, ...settings },
        })),

      // UI State
      showLevelSelector: true, // Show on first load
      setShowLevelSelector: (show) => set({ showLevelSelector: show }),
    }),
    {
      name: 'nihonwa-storage',
    }
  )
);

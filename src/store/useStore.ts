import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, LevelProgress, JLPTLevel, DifficultySettings, AppSettings } from '../types';
import type { LessonProgress } from '../types/lesson';

interface UserProgressData {
  lessonProgress: LessonProgress[];
  totalXP: number;
  progress: LevelProgress[];
}

interface AppState {
  // User & Profiles
  user: UserProfile | null;
  allProfiles: UserProfile[];
  setUser: (user: UserProfile | null) => void;
  createProfile: (profile: UserProfile) => void;
  deleteProfile: (profileId: string) => void;

  // Progress (scoped by user ID)
  userProgress: Record<string, UserProgressData>;
  progress: LevelProgress[];
  updateProgress: (level: JLPTLevel, progress: Partial<LevelProgress>) => void;

  // Lesson Progress & XP (scoped by user ID)
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
    (set, get) => ({
      // User & Profiles
      user: null,
      allProfiles: [],
      setUser: (user) => {
        if (user) {
          // Update lastActive when switching profiles
          const updatedProfile = { ...user, lastActive: new Date() };
          set((state) => ({
            user: updatedProfile,
            allProfiles: state.allProfiles.map(p =>
              p.id === user.id ? updatedProfile : p
            ),
          }));
        } else {
          set({ user });
        }
      },
      createProfile: (profile) =>
        set((state) => ({
          allProfiles: [...state.allProfiles, profile],
        })),
      deleteProfile: (profileId) =>
        set((state) => ({
          allProfiles: state.allProfiles.filter(p => p.id !== profileId),
          user: state.user?.id === profileId ? null : state.user,
        })),

      // User Progress Storage
      userProgress: {},

      // Progress (computed from current user)
      get progress() {
        const state = get();
        const userId = state.user?.id;
        if (!userId) return initialProgress;
        return state.userProgress[userId]?.progress || initialProgress;
      },
      updateProgress: (level, newProgress) =>
        set((state) => {
          const userId = state.user?.id;
          if (!userId) return state;

          const currentUserData = state.userProgress[userId] || {
            lessonProgress: [],
            totalXP: 0,
            progress: initialProgress,
          };

          return {
            userProgress: {
              ...state.userProgress,
              [userId]: {
                ...currentUserData,
                progress: currentUserData.progress.map((p) =>
                  p.level === level ? { ...p, ...newProgress } : p
                ),
              },
            },
          };
        }),

      // Lesson Progress & XP (computed from current user)
      get lessonProgress() {
        const state = get();
        const userId = state.user?.id;
        if (!userId) return [];
        return state.userProgress[userId]?.lessonProgress || [];
      },
      updateLessonProgress: (lessonId, newProgress) =>
        set((state) => {
          const userId = state.user?.id;
          if (!userId) return state;

          const currentUserData = state.userProgress[userId] || {
            lessonProgress: [],
            totalXP: 0,
            progress: initialProgress,
          };

          const existing = currentUserData.lessonProgress.find((p) => p.lessonId === lessonId);
          let updatedLessonProgress;

          if (existing) {
            updatedLessonProgress = currentUserData.lessonProgress.map((p) =>
              p.lessonId === lessonId ? { ...p, ...newProgress } : p
            );
          } else {
            updatedLessonProgress = [
              ...currentUserData.lessonProgress,
              { lessonId, completed: false, xp: 0, ...newProgress },
            ];
          }

          return {
            userProgress: {
              ...state.userProgress,
              [userId]: {
                ...currentUserData,
                lessonProgress: updatedLessonProgress,
              },
            },
          };
        }),
      get totalXP() {
        const state = get();
        const userId = state.user?.id;
        if (!userId) return 0;
        return state.userProgress[userId]?.totalXP || 0;
      },
      addXP: (amount) =>
        set((state) => {
          const userId = state.user?.id;
          if (!userId) return state;

          const currentUserData = state.userProgress[userId] || {
            lessonProgress: [],
            totalXP: 0,
            progress: initialProgress,
          };

          return {
            userProgress: {
              ...state.userProgress,
              [userId]: {
                ...currentUserData,
                totalXP: currentUserData.totalXP + amount,
              },
            },
          };
        }),

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

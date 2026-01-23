import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, LevelProgress, JLPTLevel, DifficultySettings, AppSettings } from '../types';
import type { LessonProgress } from '../types/lesson';
import { calculateEstimatedJLPTScore } from '../utils/jlptScoring';

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

  // Current user's cached progress (for reactivity)
  progress: LevelProgress[];
  lessonProgress: LessonProgress[];
  totalXP: number;

  // Update functions
  updateProgress: (level: JLPTLevel, progress: Partial<LevelProgress>) => void;
  updateLessonProgress: (lessonId: string, progress: Partial<LessonProgress>) => void;
  addXP: (amount: number) => void;
  syncCurrentUserProgress: () => void;
  recalculateJLPTScore: (level: JLPTLevel) => void;

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
      // User & Profiles
      user: null,
      allProfiles: [],

      setUser: (user) => {
        if (user) {
          const updatedProfile = { ...user, lastActive: new Date() };
          set((state) => {
            const profileExists = state.allProfiles.some(p => p.id === user.id);

            // Get user's progress
            const userData = state.userProgress[user.id] || {
              lessonProgress: [],
              totalXP: 0,
              progress: [...initialProgress],
            };

            console.log('setUser - loading progress:', {
              userId: user.id,
              totalXP: userData.totalXP,
              lessonCount: userData.lessonProgress.length,
            });

            return {
              user: updatedProfile,
              allProfiles: profileExists
                ? state.allProfiles.map(p => p.id === user.id ? updatedProfile : p)
                : [...state.allProfiles, updatedProfile],
              // Sync current user's cached progress
              progress: userData.progress,
              lessonProgress: userData.lessonProgress,
              totalXP: userData.totalXP,
            };
          });
        } else {
          set({
            user: null,
            progress: [...initialProgress],
            lessonProgress: [],
            totalXP: 0,
          });
        }
      },

      createProfile: (profile) =>
        set((state) => {
          console.log('createProfile:', profile.name);
          return {
            allProfiles: [...state.allProfiles, profile],
          };
        }),

      deleteProfile: (profileId) =>
        set((state) => ({
          allProfiles: state.allProfiles.filter(p => p.id !== profileId),
          user: state.user?.id === profileId ? null : state.user,
          progress: state.user?.id === profileId ? [...initialProgress] : state.progress,
          lessonProgress: state.user?.id === profileId ? [] : state.lessonProgress,
          totalXP: state.user?.id === profileId ? 0 : state.totalXP,
        })),

      // User Progress Storage
      userProgress: {},

      // Current user's cached progress
      progress: [...initialProgress],
      lessonProgress: [],
      totalXP: 0,

      // Sync function to update cached progress from userProgress
      syncCurrentUserProgress: () => {
        set((state) => {
          const userId = state.user?.id;
          if (!userId) return {};

          const userData = state.userProgress[userId] || {
            lessonProgress: [],
            totalXP: 0,
            progress: [...initialProgress],
          };

          return {
            progress: userData.progress,
            lessonProgress: userData.lessonProgress,
            totalXP: userData.totalXP,
          };
        });
      },

      updateProgress: (level, newProgress) =>
        set((state) => {
          const userId = state.user?.id;
          if (!userId) {
            console.warn('No user ID when updating progress');
            return {};
          }

          const currentUserData = state.userProgress[userId] || {
            lessonProgress: [],
            totalXP: 0,
            progress: [...initialProgress],
          };

          const updatedProgress = currentUserData.progress.map((p) =>
            p.level === level ? { ...p, ...newProgress } : p
          );

          return {
            userProgress: {
              ...state.userProgress,
              [userId]: {
                ...currentUserData,
                progress: updatedProgress,
              },
            },
            progress: updatedProgress, // Update cached value
          };
        }),

      updateLessonProgress: (lessonId, newProgress) =>
        set((state) => {
          const userId = state.user?.id;
          if (!userId) {
            console.warn('No user ID when updating lesson progress');
            return {};
          }

          const currentUserData = state.userProgress[userId] || {
            lessonProgress: [],
            totalXP: 0,
            progress: [...initialProgress],
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
              {
                lessonId,
                completed: false,
                sectionType: 'languageKnowledge' as const,
                sectionScore: 0,
                correctAnswers: 0,
                totalQuestions: 0,
                xp: 0,
                ...newProgress
              } as LessonProgress,
            ];
          }

          console.log('updateLessonProgress:', {
            userId,
            lessonId,
            newProgress,
            totalLessons: updatedLessonProgress.length,
          });

          return {
            userProgress: {
              ...state.userProgress,
              [userId]: {
                ...currentUserData,
                lessonProgress: updatedLessonProgress,
              },
            },
            lessonProgress: updatedLessonProgress, // Update cached value
          };
        }),

      recalculateJLPTScore: (level) =>
        set((state) => {
          const userId = state.user?.id;
          if (!userId) {
            console.warn('No user ID when recalculating JLPT score');
            return {};
          }

          const currentUserData = state.userProgress[userId] || {
            lessonProgress: [],
            totalXP: 0,
            progress: [...initialProgress],
          };

          // Filter lessons for this level that have been completed
          const levelLessons = currentUserData.lessonProgress.filter((lp) => {
            // Extract level from lessonId (e.g., "n5-lesson-1" -> "N5")
            const lessonLevel = lp.lessonId.split('-')[0].toUpperCase() as JLPTLevel;
            return lessonLevel === level && lp.completed && lp.sectionScore !== undefined;
          });

          if (levelLessons.length === 0) {
            // No completed lessons, no score to calculate
            return {};
          }

          // Prepare lesson scores for calculation
          const lessonScores = levelLessons.map((lp) => ({
            sectionType: lp.sectionType || 'languageKnowledge',
            score: lp.sectionScore || 0,
          }));

          // Calculate estimated JLPT score
          const jlptScore = calculateEstimatedJLPTScore(lessonScores, level);

          // Update progress for this level
          const updatedProgress = currentUserData.progress.map((p) =>
            p.level === level
              ? {
                  ...p,
                  estimatedJLPTScore: {
                    total: jlptScore.total,
                    languageKnowledge: jlptScore.sections.languageKnowledge,
                    reading: jlptScore.sections.reading,
                    listening: jlptScore.sections.listening,
                    passed: jlptScore.passed,
                    lastUpdated: new Date(),
                  },
                }
              : p
          );

          console.log('recalculateJLPTScore:', {
            userId,
            level,
            lessonCount: levelLessons.length,
            estimatedScore: jlptScore.total,
            passed: jlptScore.passed,
          });

          return {
            userProgress: {
              ...state.userProgress,
              [userId]: {
                ...currentUserData,
                progress: updatedProgress,
              },
            },
            progress: updatedProgress, // Update cached value
          };
        }),

      addXP: (amount) =>
        set((state) => {
          const userId = state.user?.id;
          if (!userId) {
            console.warn('No user ID when adding XP');
            return {};
          }

          const currentUserData = state.userProgress[userId] || {
            lessonProgress: [],
            totalXP: 0,
            progress: [...initialProgress],
          };

          const newTotalXP = currentUserData.totalXP + amount;

          console.log('addXP:', {
            userId,
            amount,
            previousXP: currentUserData.totalXP,
            newTotalXP,
          });

          return {
            userProgress: {
              ...state.userProgress,
              [userId]: {
                ...currentUserData,
                totalXP: newTotalXP,
              },
            },
            totalXP: newTotalXP, // Update cached value
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
      showLevelSelector: true,
      setShowLevelSelector: (show) => set({ showLevelSelector: show }),
    }),
    {
      name: 'nihonwa-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          try {
            const { state } = JSON.parse(str);

            // Convert date strings back to Date objects for profiles
            if (state.allProfiles) {
              state.allProfiles = state.allProfiles.map((profile: any) => ({
                ...profile,
                createdAt: profile.createdAt ? new Date(profile.createdAt) : new Date(),
                lastActive: profile.lastActive ? new Date(profile.lastActive) : new Date(),
              }));
            }

            if (state.user) {
              state.user = {
                ...state.user,
                createdAt: state.user.createdAt ? new Date(state.user.createdAt) : new Date(),
                lastActive: state.user.lastActive ? new Date(state.user.lastActive) : new Date(),
              };
            }

            // Convert date strings in lesson progress
            if (state.userProgress) {
              Object.keys(state.userProgress).forEach((userId) => {
                const userData = state.userProgress[userId];
                if (userData.lessonProgress) {
                  userData.lessonProgress = userData.lessonProgress.map((lp: any) => ({
                    ...lp,
                    completedAt: lp.completedAt ? new Date(lp.completedAt) : undefined,
                  }));
                }
              });
            }

            return { state };
          } catch (e) {
            console.error('Error parsing stored state:', e);
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

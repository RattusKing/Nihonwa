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
          set((state) => {
            // Check if profile exists in allProfiles
            const profileExists = state.allProfiles.some(p => p.id === user.id);

            console.log('setUser called:', {
              userId: user.id,
              userName: user.name,
              profileExists,
              currentProfileCount: state.allProfiles.length,
            });

            const newState = {
              user: updatedProfile,
              allProfiles: profileExists
                ? state.allProfiles.map(p => p.id === user.id ? updatedProfile : p)
                : [...state.allProfiles, updatedProfile],
            };

            console.log('New state after setUser:', {
              profileCount: newState.allProfiles.length,
              profiles: newState.allProfiles.map(p => ({ id: p.id, name: p.name })),
            });

            return newState;
          });
        } else {
          console.log('setUser called with null');
          set({ user });
        }
      },
      createProfile: (profile) =>
        set((state) => {
          console.log('createProfile called:', {
            profileId: profile.id,
            profileName: profile.name,
            currentProfileCount: state.allProfiles.length,
          });

          const newState = {
            allProfiles: [...state.allProfiles, profile],
          };

          console.log('New profile count after createProfile:', newState.allProfiles.length);

          return newState;
        }),
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
          if (!userId) {
            console.warn('No user ID found when updating progress');
            return {};
          }

          const currentUserData = state.userProgress[userId] || {
            lessonProgress: [],
            totalXP: 0,
            progress: [...initialProgress],
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
          if (!userId) {
            console.warn('No user ID found when updating lesson progress');
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
              { lessonId, completed: false, xp: 0, ...newProgress },
            ];
          }

          console.log('Updating lesson progress:', {
            userId,
            lessonId,
            newProgress,
            updatedLessonProgress,
          });

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
          if (!userId) {
            console.warn('No user ID found when adding XP');
            return {};
          }

          const currentUserData = state.userProgress[userId] || {
            lessonProgress: [],
            totalXP: 0,
            progress: [...initialProgress],
          };

          const newTotalXP = currentUserData.totalXP + amount;

          console.log('Adding XP:', {
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

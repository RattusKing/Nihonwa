import type { JLPTLevel } from '../types';

export const JLPT_LEVELS: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

export const JLPT_LEVEL_INFO = {
  N5: {
    name: 'N5 - Beginner',
    description: 'Basic Japanese for everyday situations',
    color: 'n5',
    vocabulary: 800,
    kanji: 100,
  },
  N4: {
    name: 'N4 - Elementary',
    description: 'Understand basic Japanese in daily contexts',
    color: 'n4',
    vocabulary: 1500,
    kanji: 300,
  },
  N3: {
    name: 'N3 - Intermediate',
    description: 'Understand Japanese in everyday situations',
    color: 'n3',
    vocabulary: 3750,
    kanji: 650,
  },
  N2: {
    name: 'N2 - Advanced',
    description: 'Understand Japanese in a variety of contexts',
    color: 'n2',
    vocabulary: 6000,
    kanji: 1000,
  },
  N1: {
    name: 'N1 - Native Level',
    description: 'Understand Japanese in a wide range of situations',
    color: 'n1',
    vocabulary: 10000,
    kanji: 2000,
  },
};

export function getLevelColor(level: JLPTLevel): string {
  const colorMap = {
    N5: '#10B981', // green
    N4: '#3B82F6', // blue
    N3: '#EAB308', // yellow
    N2: '#F97316', // orange
    N1: '#EF4444', // red
  };
  return colorMap[level];
}

export function getLevelBadgeClass(level: JLPTLevel): string {
  return `badge-${level.toLowerCase()}`;
}

export function getNextLevel(currentLevel: JLPTLevel): JLPTLevel | null {
  const currentIndex = JLPT_LEVELS.indexOf(currentLevel);
  if (currentIndex === -1 || currentIndex === JLPT_LEVELS.length - 1) {
    return null;
  }
  return JLPT_LEVELS[currentIndex + 1];
}

export function getPreviousLevel(currentLevel: JLPTLevel): JLPTLevel | null {
  const currentIndex = JLPT_LEVELS.indexOf(currentLevel);
  if (currentIndex <= 0) {
    return null;
  }
  return JLPT_LEVELS[currentIndex - 1];
}

export function getLevelIndex(level: JLPTLevel): number {
  return JLPT_LEVELS.indexOf(level);
}

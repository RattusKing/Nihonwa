import type { JLPTLevel } from '../types';

/**
 * Official JLPT Scoring System
 * Based on JLPT Foundation standards
 * Source: https://www.jlpt.jp/e/about/levelsummary.html
 */

export interface JLPTSectionScores {
  languageKnowledge: number; // 0-60 (N1-N3) or 0-120 (N4-N5, combined with reading)
  reading: number; // 0-60 (N1-N3 only, included in languageKnowledge for N4-N5)
}

export interface JLPTScore {
  total: number; // 0-120
  sections: JLPTSectionScores;
  passed: boolean;
  sectionsPassed: boolean; // All sections meet minimum
  breakdown: {
    totalRequired: number;
    sectionMinimum: number;
    sectionsStatus: {
      languageKnowledge: boolean;
      reading: boolean;
    };
  };
}

export interface JLPTRequirements {
  totalPassMark: number;
  sectionMinimum: number;
  hasSeparateReading: boolean; // false for N4-N5
}

/**
 * Official JLPT passing requirements by level
 */
export const JLPT_REQUIREMENTS: Record<JLPTLevel, JLPTRequirements> = {
  N5: {
    totalPassMark: 80,
    sectionMinimum: 19, // Applied as 38/120 for combined section
    hasSeparateReading: false,
  },
  N4: {
    totalPassMark: 90,
    sectionMinimum: 19,
    hasSeparateReading: false,
  },
  N3: {
    totalPassMark: 95,
    sectionMinimum: 19,
    hasSeparateReading: true,
  },
  N2: {
    totalPassMark: 90,
    sectionMinimum: 19,
    hasSeparateReading: true,
  },
  N1: {
    totalPassMark: 100,
    sectionMinimum: 19,
    hasSeparateReading: true,
  },
};

/**
 * Convert percentage score to JLPT scaled score
 * JLPT uses scaled scores, not raw percentages
 * This is a simplified conversion for app purposes
 */
export function percentageToScaledScore(
  percentage: number,
  maxScore: number
): number {
  // Clamp percentage between 0-100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  // Convert to scaled score (0 to maxScore)
  const scaled = (clampedPercentage / 100) * maxScore;

  // Round to nearest integer
  return Math.round(scaled);
}

/**
 * Calculate JLPT score from lesson performance
 * @param correctAnswers Number of correct answers
 * @param totalQuestions Total questions in lesson
 * @param sectionType Which section this lesson contributes to
 * @param level JLPT level for context
 */
export function calculateLessonScore(
  correctAnswers: number,
  totalQuestions: number,
  sectionType: 'languageKnowledge' | 'reading',
  level: JLPTLevel
): number {
  const percentage = (correctAnswers / totalQuestions) * 100;
  const requirements = JLPT_REQUIREMENTS[level];

  // Determine max score based on section and level
  let maxScore = 60;
  if (sectionType === 'languageKnowledge' && !requirements.hasSeparateReading) {
    maxScore = 120; // N4-N5 combined section
  }

  return percentageToScaledScore(percentage, maxScore);
}

/**
 * Calculate estimated JLPT score from multiple lesson performances
 * Uses average of all lessons per section
 */
export function calculateEstimatedJLPTScore(
  lessonScores: {
    sectionType: 'languageKnowledge' | 'reading' | 'listening';
    score: number;
  }[],
  level: JLPTLevel
): JLPTScore {
  const requirements = JLPT_REQUIREMENTS[level];

  // Group scores by section
  const sectionGroups = {
    languageKnowledge: lessonScores.filter(l => l.sectionType === 'languageKnowledge'),
    reading: lessonScores.filter(l => l.sectionType === 'reading'),
  };

  // Calculate average score per section
  const avgLanguageKnowledge = sectionGroups.languageKnowledge.length > 0
    ? Math.round(
        sectionGroups.languageKnowledge.reduce((sum, l) => sum + l.score, 0) /
        sectionGroups.languageKnowledge.length
      )
    : 0;

  const avgReading = requirements.hasSeparateReading && sectionGroups.reading.length > 0
    ? Math.round(
        sectionGroups.reading.reduce((sum, l) => sum + l.score, 0) /
        sectionGroups.reading.length
      )
    : 0;

  const sections: JLPTSectionScores = {
    languageKnowledge: avgLanguageKnowledge,
    reading: avgReading,
  };

  const total = avgLanguageKnowledge + avgReading;

  // Check pass/fail conditions
  const sectionsStatus = {
    languageKnowledge: requirements.hasSeparateReading
      ? avgLanguageKnowledge >= requirements.sectionMinimum
      : avgLanguageKnowledge >= requirements.sectionMinimum * 2, // N4-N5: 38/120
    reading: requirements.hasSeparateReading
      ? avgReading >= requirements.sectionMinimum
      : true, // N4-N5 don't have separate reading
  };

  const sectionsPassed = Object.values(sectionsStatus).every(passed => passed);
  const passed = total >= requirements.totalPassMark && sectionsPassed;

  return {
    total,
    sections,
    passed,
    sectionsPassed,
    breakdown: {
      totalRequired: requirements.totalPassMark,
      sectionMinimum: requirements.sectionMinimum,
      sectionsStatus,
    },
  };
}

/**
 * Get section name display text
 */
export function getSectionName(
  sectionType: 'languageKnowledge' | 'reading',
  level: JLPTLevel
): string {
  const requirements = JLPT_REQUIREMENTS[level];

  if (sectionType === 'languageKnowledge') {
    return requirements.hasSeparateReading
      ? 'Language Knowledge (Vocabulary/Grammar)'
      : 'Language Knowledge (Vocabulary/Grammar/Reading)';
  }

  return 'Reading';
}

/**
 * Get max score for a section
 */
export function getSectionMaxScore(
  sectionType: 'languageKnowledge' | 'reading',
  level: JLPTLevel
): number {
  const requirements = JLPT_REQUIREMENTS[level];

  if (sectionType === 'languageKnowledge' && !requirements.hasSeparateReading) {
    return 120; // N4-N5
  }

  return 60; // All other sections
}

/**
 * Get minimum passing score for a section
 */
export function getSectionMinimum(
  sectionType: 'languageKnowledge' | 'reading',
  level: JLPTLevel
): number {
  const requirements = JLPT_REQUIREMENTS[level];

  if (sectionType === 'languageKnowledge' && !requirements.hasSeparateReading) {
    return requirements.sectionMinimum * 2; // 38 for N4-N5
  }

  return requirements.sectionMinimum; // 19 for all other sections
}

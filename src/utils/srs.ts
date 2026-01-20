/**
 * Spaced Repetition System (SRS) Utilities
 * Based on simplified SM-2 algorithm
 */

export interface SRSData {
  easeFactor: number; // How easy the card is (default 2.5)
  interval: number; // Days until next review
  repetitions: number; // Number of successful repetitions
}

/**
 * Calculate next review date based on user response
 * @param quality - User response quality (0-5)
 *   0: Complete blackout
 *   1: Incorrect, but recognized
 *   2: Incorrect, but easy to recall
 *   3: Correct, but difficult
 *   4: Correct, with hesitation
 *   5: Correct, perfect recall
 */
export function calculateNextReview(
  quality: number,
  currentData?: SRSData
): { nextReview: Date; srsData: SRSData } {
  // Default values for new cards
  const current: SRSData = currentData || {
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
  };

  let { easeFactor, interval, repetitions } = current;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1; // 1 day
    } else if (repetitions === 1) {
      interval = 6; // 6 days
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect response - reset repetitions but keep ease factor
    repetitions = 0;
    interval = 1;
  }

  // Adjust ease factor based on quality
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Minimum ease factor is 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    nextReview,
    srsData: {
      easeFactor,
      interval,
      repetitions,
    },
  };
}

/**
 * Simplified response mapping:
 * Incorrect -> quality 1
 * Correct -> quality 4
 * Perfect -> quality 5
 */
export function getQualityFromResponse(response: 'incorrect' | 'correct' | 'perfect'): number {
  switch (response) {
    case 'incorrect':
      return 1;
    case 'correct':
      return 4;
    case 'perfect':
      return 5;
    default:
      return 3;
  }
}

/**
 * Get cards due for review
 */
export function isDue(nextReview?: Date): boolean {
  if (!nextReview) return true; // Never reviewed
  return new Date() >= new Date(nextReview);
}

/**
 * Get the next review interval in human-readable format
 */
export function getIntervalText(days: number): string {
  if (days === 0) return 'Now';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  if (days < 365) {
    const months = Math.round(days / 30);
    return months === 1 ? '1 month' : `${months} months`;
  }
  const years = Math.round(days / 365);
  return years === 1 ? '1 year' : `${years} years`;
}

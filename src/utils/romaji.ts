import * as wanakana from 'wanakana';

/**
 * Convert Japanese kana (hiragana/katakana) to romaji (English letters)
 * @param kana - Japanese text in hiragana or katakana
 * @returns Romanized version for pronunciation
 */
export function toRomaji(kana: string): string {
  return wanakana.toRomaji(kana);
}

/**
 * Format romaji for display (capitalize first letter)
 */
export function formatRomaji(kana: string): string {
  const romaji = toRomaji(kana);
  return romaji.charAt(0).toUpperCase() + romaji.slice(1);
}

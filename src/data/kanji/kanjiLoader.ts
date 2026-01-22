import { addKanji, getKanjiByLevel } from '../../utils/db';
import { n5Kanji } from './n5-kanji';

/**
 * Load JLPT kanji datasets into IndexedDB
 * Only loads if the level hasn't been loaded before
 */

export async function loadN5Kanji(): Promise<void> {
  try {
    // Check if N5 kanji already exists
    const existing = await getKanjiByLevel('N5');

    if (existing.length > 0) {
      console.log('N5 kanji already loaded');
      return;
    }

    console.log('Loading N5 kanji...');

    // Add each kanji item
    for (const kanji of n5Kanji) {
      await addKanji(kanji);
    }

    console.log(`Loaded ${n5Kanji.length} N5 kanji characters`);
  } catch (error) {
    console.error('Error loading N5 kanji:', error);
  }
}

export async function loadAllKanji(): Promise<void> {
  await loadN5Kanji();
  // Future: await loadN4Kanji();
  // Future: await loadN3Kanji();
  // etc.
}

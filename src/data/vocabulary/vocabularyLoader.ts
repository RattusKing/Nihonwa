import { addVocabulary, getVocabularyByLevel } from '../../utils/db';
import { n5Vocabulary } from './n5-vocabulary';
import type { VocabularyItem } from '../../types';

/**
 * Load JLPT vocabulary datasets into IndexedDB
 * Only loads if the level hasn't been loaded before
 */

export async function loadN5Vocabulary(): Promise<void> {
  try {
    // Check if N5 vocabulary already exists
    const existing = await getVocabularyByLevel('N5');

    if (existing.length > 0) {
      console.log('N5 vocabulary already loaded');
      return;
    }

    console.log('Loading N5 vocabulary...');

    // Add each vocabulary item
    for (const vocab of n5Vocabulary) {
      const item: VocabularyItem = {
        ...vocab,
        id: crypto.randomUUID(),
        mastered: false,
      };
      await addVocabulary(item);
    }

    console.log(`Loaded ${n5Vocabulary.length} N5 vocabulary words`);
  } catch (error) {
    console.error('Error loading N5 vocabulary:', error);
  }
}

export async function loadAllVocabulary(): Promise<void> {
  await loadN5Vocabulary();
  // Future: await loadN4Vocabulary();
  // Future: await loadN3Vocabulary();
  // etc.
}

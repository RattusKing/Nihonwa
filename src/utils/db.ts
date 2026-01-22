import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Content, VocabularyItem, KanjiItem, GrammarPattern } from '../types';

interface NihonwaDB extends DBSchema {
  content: {
    key: string;
    value: Content;
    indexes: { 'by-level': string };
  };
  vocabulary: {
    key: string;
    value: VocabularyItem;
    indexes: { 'by-level': string; 'by-mastered': number };
  };
  kanji: {
    key: string;
    value: KanjiItem;
    indexes: { 'by-level': string; 'by-mastered': number };
  };
  grammar: {
    key: string;
    value: GrammarPattern;
    indexes: { 'by-level': string; 'by-mastered': number };
  };
}

let db: IDBPDatabase<NihonwaDB>;

export async function initDB() {
  db = await openDB<NihonwaDB>('nihonwa-db', 2, {
    upgrade(db, oldVersion, _newVersion, transaction) {
      // Version 1: Initial database creation
      if (oldVersion < 1) {
        // Content store
        const contentStore = db.createObjectStore('content', { keyPath: 'id' });
        contentStore.createIndex('by-level', 'level');

        // Vocabulary store
        const vocabStore = db.createObjectStore('vocabulary', { keyPath: 'id' });
        vocabStore.createIndex('by-level', 'level');
        vocabStore.createIndex('by-mastered', 'mastered');

        // Kanji store
        const kanjiStore = db.createObjectStore('kanji', { keyPath: 'id' });
        kanjiStore.createIndex('by-level', 'level');
        kanjiStore.createIndex('by-mastered', 'mastered');

        // Grammar store
        const grammarStore = db.createObjectStore('grammar', { keyPath: 'id' });
        grammarStore.createIndex('by-level', 'level');
        grammarStore.createIndex('by-mastered', 'mastered');
      }

      // Version 2: Clear kanji data to reload with updated categories
      // NOTE: User profiles are stored in localStorage (not IndexedDB), so they're unaffected
      if (oldVersion >= 1 && oldVersion < 2) {
        const kanjiStore = transaction.objectStore('kanji');
        kanjiStore.clear();
      }
    },
  });

  return db;
}

// Content operations
export async function addContent(content: Content) {
  const db = await initDB();
  return db.add('content', content);
}

export async function getContentByLevel(level: string) {
  const db = await initDB();
  return db.getAllFromIndex('content', 'by-level', level);
}

export async function getAllContent() {
  const db = await initDB();
  return db.getAll('content');
}

export async function updateContent(content: Content) {
  const db = await initDB();
  return db.put('content', content);
}

export async function deleteContent(id: string) {
  const db = await initDB();
  return db.delete('content', id);
}

// Vocabulary operations
export async function addVocabulary(vocab: VocabularyItem) {
  const db = await initDB();
  return db.add('vocabulary', vocab);
}

export async function getVocabularyByLevel(level: string) {
  const db = await initDB();
  return db.getAllFromIndex('vocabulary', 'by-level', level);
}

export async function updateVocabulary(vocab: VocabularyItem) {
  const db = await initDB();
  return db.put('vocabulary', vocab);
}

// Kanji operations
export async function addKanji(kanji: KanjiItem) {
  const db = await initDB();
  return db.add('kanji', kanji);
}

export async function getKanjiByLevel(level: string) {
  const db = await initDB();
  return db.getAllFromIndex('kanji', 'by-level', level);
}

export async function updateKanji(kanji: KanjiItem) {
  const db = await initDB();
  return db.put('kanji', kanji);
}

// Grammar operations
export async function addGrammar(grammar: GrammarPattern) {
  const db = await initDB();
  return db.add('grammar', grammar);
}

export async function getGrammarByLevel(level: string) {
  const db = await initDB();
  return db.getAllFromIndex('grammar', 'by-level', level);
}

export async function updateGrammar(grammar: GrammarPattern) {
  const db = await initDB();
  return db.put('grammar', grammar);
}

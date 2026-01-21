import type { JLPTLevel, VocabularyItem } from './index';

export interface Lesson {
  id: string;
  level: JLPTLevel;
  title: string;
  description: string;
  vocabularyIds: string[]; // IDs of vocabulary items
  order: number;
  locked: boolean;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  xp: number;
  completedAt?: Date;
  score?: number; // Percentage correct
}

export interface ExerciseType {
  type: 'multiple-choice-jp' | 'multiple-choice-en' | 'type-answer' | 'match-pairs' | 'fill-blank';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Exercise {
  id: string;
  type: ExerciseType['type'];
  vocab: VocabularyItem;
  question: string;
  correctAnswer: string;
  options?: string[]; // For multiple choice
  optionsWithDetails?: VocabularyItem[]; // For multiple choice with Japanese options
  hint?: string;
}

// N5 Lesson Structure
export const n5Lessons: Omit<Lesson, 'vocabularyIds' | 'locked'>[] = [
  {
    id: 'n5-lesson-1',
    level: 'N5',
    title: 'Greetings & Basics',
    description: 'Learn essential greetings and polite expressions',
    order: 1,
  },
  {
    id: 'n5-lesson-2',
    level: 'N5',
    title: 'Self Introduction',
    description: 'Introduce yourself and talk about basics',
    order: 2,
  },
  {
    id: 'n5-lesson-3',
    level: 'N5',
    title: 'Numbers 1-10',
    description: 'Count from 1 to 10 in Japanese',
    order: 3,
  },
  {
    id: 'n5-lesson-4',
    level: 'N5',
    title: 'Time & Days',
    description: 'Tell time and talk about days of the week',
    order: 4,
  },
  {
    id: 'n5-lesson-5',
    level: 'N5',
    title: 'Family Members',
    description: 'Talk about your family',
    order: 5,
  },
  {
    id: 'n5-lesson-6',
    level: 'N5',
    title: 'Common Verbs 1',
    description: 'Essential action verbs for daily life',
    order: 6,
  },
  {
    id: 'n5-lesson-7',
    level: 'N5',
    title: 'Places',
    description: 'Common places you visit every day',
    order: 7,
  },
  {
    id: 'n5-lesson-8',
    level: 'N5',
    title: 'Food & Drinks',
    description: 'Order food and talk about what you eat',
    order: 8,
  },
  {
    id: 'n5-lesson-9',
    level: 'N5',
    title: 'Colors & Adjectives',
    description: 'Describe things with colors and basic adjectives',
    order: 9,
  },
  {
    id: 'n5-lesson-10',
    level: 'N5',
    title: 'Common Verbs 2',
    description: 'More essential verbs for communication',
    order: 10,
  },
];

/**
 * Organize vocabulary into lessons based on word content and themes
 * This function categorizes vocabulary items into themed lessons
 */
export function organizeVocabularyIntoLessons(vocabulary: VocabularyItem[]): Lesson[] {
  const lessons: Lesson[] = [];

  // Lesson 1: Greetings & Basics
  const greetings = vocabulary.filter(v =>
    ['おはよう', 'こんにちは', 'こんばんは', 'さようなら', 'ありがとう',
     'ありがとうございます', 'すみません', 'ごめんなさい', 'いただきます',
     'ごちそうさまでした', 'はい', 'いいえ'].includes(v.word)
  );
  if (greetings.length > 0) {
    lessons.push({
      ...n5Lessons[0],
      vocabularyIds: greetings.map(v => v.id),
      locked: false,
    });
  }

  // Lesson 2: Self Introduction
  const intro = vocabulary.filter(v =>
    ['私', 'あなた', '名前', '学生', '先生', '人', '日本人', '日本', '日本語',
     'です', 'は', 'の'].includes(v.word)
  );
  if (intro.length > 0) {
    lessons.push({
      ...n5Lessons[1],
      vocabularyIds: intro.map(v => v.id),
      locked: lessons.length === 0, // Unlock if lesson 1 doesn't exist
    });
  }

  // Lesson 3: Numbers 1-10
  const numbers = vocabulary.filter(v =>
    ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'].includes(v.word)
  );
  if (numbers.length > 0) {
    lessons.push({
      ...n5Lessons[2],
      vocabularyIds: numbers.map(v => v.id),
      locked: true,
    });
  }

  // Lesson 4: Time & Days
  const time = vocabulary.filter(v =>
    ['今', '今日', '明日', '昨日', '朝', '昼', '夜', '月曜日', '火曜日', '水曜日',
     '木曜日', '金曜日', '土曜日', '日曜日'].includes(v.word)
  );
  if (time.length > 0) {
    lessons.push({
      ...n5Lessons[3],
      vocabularyIds: time.map(v => v.id),
      locked: true,
    });
  }

  // Lesson 5: Family Members
  const family = vocabulary.filter(v =>
    ['家族', '父', '母', '兄', '姉', '弟', '妹', 'お父さん', 'お母さん',
     'お兄さん', 'お姉さん'].includes(v.word)
  );
  if (family.length > 0) {
    lessons.push({
      ...n5Lessons[4],
      vocabularyIds: family.map(v => v.id),
      locked: true,
    });
  }

  // Lesson 6: Common Verbs 1
  const verbs1 = vocabulary.filter(v =>
    ['行く', '来る', '帰る', '食べる', '飲む', '見る', '聞く', 'する'].includes(v.word)
  );
  if (verbs1.length > 0) {
    lessons.push({
      ...n5Lessons[5],
      vocabularyIds: verbs1.map(v => v.id),
      locked: true,
    });
  }

  // Lesson 7: Places
  const places = vocabulary.filter(v =>
    ['学校', '会社', '駅', 'レストラン', 'デパート', 'スーパー', '家',
     'トイレ', 'ここ', 'そこ', 'あそこ', 'どこ'].includes(v.word)
  );
  if (places.length > 0) {
    lessons.push({
      ...n5Lessons[6],
      vocabularyIds: places.map(v => v.id),
      locked: true,
    });
  }

  // Lesson 8: Food & Drinks
  const food = vocabulary.filter(v =>
    ['水', 'お茶', 'コーヒー', 'ジュース', '牛乳', 'ご飯', 'パン', '肉', '魚',
     '野菜', '果物', '卵'].includes(v.word)
  );
  if (food.length > 0) {
    lessons.push({
      ...n5Lessons[7],
      vocabularyIds: food.map(v => v.id),
      locked: true,
    });
  }

  // Lesson 9: Colors & Adjectives
  const adjectives = vocabulary.filter(v =>
    ['白い', '黒い', '赤い', '青い', '大きい', '小さい', '高い', '新しい',
     '古い', 'いい', '良い'].includes(v.word)
  );
  if (adjectives.length > 0) {
    lessons.push({
      ...n5Lessons[8],
      vocabularyIds: adjectives.map(v => v.id),
      locked: true,
    });
  }

  // Lesson 10: Common Verbs 2
  const verbs2 = vocabulary.filter(v =>
    ['話す', '読む', '書く', '買う', '勉強する', '働く', '寝る', '起きる'].includes(v.word)
  );
  if (verbs2.length > 0) {
    lessons.push({
      ...n5Lessons[9],
      vocabularyIds: verbs2.map(v => v.id),
      locked: true,
    });
  }

  return lessons;
}

/**
 * Generate exercises from vocabulary items
 * Mix different exercise types for variety
 */
export function generateExercises(
  vocabulary: VocabularyItem[],
  allVocabulary: VocabularyItem[]
): Exercise[] {
  const exercises: Exercise[] = [];

  vocabulary.forEach((vocab, index) => {
    // Mix up exercise types - only multiple choice
    const exerciseTypes: ExerciseType['type'][] = [
      'multiple-choice-jp',
      'multiple-choice-en',
    ];

    const type = exerciseTypes[index % exerciseTypes.length];

    switch (type) {
      case 'multiple-choice-jp':
        // Show Japanese, pick English meaning
        exercises.push({
          id: `ex-${vocab.id}-mc-jp`,
          type: 'multiple-choice-jp',
          vocab,
          question: `What does "${vocab.word}" (${vocab.reading}) mean?`,
          correctAnswer: vocab.meaning,
          options: generateMCOptions(vocab.meaning, allVocabulary.map(v => v.meaning)),
        });
        break;

      case 'multiple-choice-en':
        // Show English, pick Japanese word
        const japaneseOptions = generateMCOptions(vocab.word, allVocabulary.map(v => v.word));
        const optionsWithDetails = japaneseOptions.map(option =>
          allVocabulary.find(v => v.word === option) || vocab
        );
        exercises.push({
          id: `ex-${vocab.id}-mc-en`,
          type: 'multiple-choice-en',
          vocab,
          question: `How do you say "${vocab.meaning}" in Japanese?`,
          correctAnswer: vocab.word,
          options: japaneseOptions,
          optionsWithDetails,
        });
        break;
    }
  });

  // Shuffle exercises
  return exercises.sort(() => Math.random() - 0.5);
}

/**
 * Generate 4 multiple choice options (3 wrong + 1 correct)
 */
function generateMCOptions(correct: string, allOptions: string[]): string[] {
  const wrongOptions = allOptions
    .filter(opt => opt !== correct)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const options = [...wrongOptions, correct];
  return options.sort(() => Math.random() - 0.5);
}

import type { GrammarPattern } from '../../types';

export const n5GrammarPatterns: GrammarPattern[] = [
  {
    id: 'n5-grammar-1',
    pattern: 'です (desu)',
    meaning: 'to be (polite)',
    level: 'N5',
    explanation: 'です is the polite copula used to state that something "is" something. It\'s one of the most fundamental patterns in Japanese.',
    examples: [
      {
        japanese: '私は学生です。',
        english: 'I am a student.',
      },
      {
        japanese: 'これは本です。',
        english: 'This is a book.',
      },
      {
        japanese: '今日は月曜日です。',
        english: 'Today is Monday.',
      },
    ],
    mastered: false,
  },
  {
    id: 'n5-grammar-2',
    pattern: 'は (wa) - Topic Marker',
    meaning: 'topic marker particle',
    level: 'N5',
    explanation: 'は (pronounced "wa") marks the topic of the sentence - what you\'re talking about.',
    examples: [
      {
        japanese: '私は田中です。',
        english: 'As for me, I am Tanaka.',
      },
      {
        japanese: '日本語は楽しいです。',
        english: 'Japanese is fun.',
      },
      {
        japanese: '今日は暑いです。',
        english: 'Today is hot.',
      },
    ],
    mastered: false,
  },
  {
    id: 'n5-grammar-3',
    pattern: 'の (no) - Possessive',
    meaning: 'possession/connection particle',
    level: 'N5',
    explanation: 'の connects nouns to show possession, relationship, or description. Like the English "\'s" or "of".',
    examples: [
      {
        japanese: '私の本',
        english: 'my book',
      },
      {
        japanese: '日本の食べ物',
        english: 'Japanese food',
      },
      {
        japanese: '先生の名前',
        english: 'the teacher\'s name',
      },
    ],
    mastered: false,
  },
  {
    id: 'n5-grammar-4',
    pattern: 'を (wo/o) - Object Marker',
    meaning: 'direct object particle',
    level: 'N5',
    explanation: 'を marks the direct object of an action verb - the thing that the action is done to.',
    examples: [
      {
        japanese: '水を飲みます。',
        english: 'I drink water.',
      },
      {
        japanese: '本を読みます。',
        english: 'I read a book.',
      },
      {
        japanese: '日本語を勉強します。',
        english: 'I study Japanese.',
      },
    ],
    mastered: false,
  },
  {
    id: 'n5-grammar-5',
    pattern: 'に (ni) - Location/Time',
    meaning: 'location/time/direction particle',
    level: 'N5',
    explanation: 'に indicates a specific point in time or space, destination, or indirect object.',
    examples: [
      {
        japanese: '学校に行きます。',
        english: 'I go to school.',
      },
      {
        japanese: '７時に起きます。',
        english: 'I wake up at 7 o\'clock.',
      },
      {
        japanese: '机の上に本があります。',
        english: 'There is a book on the desk.',
      },
    ],
    mastered: false,
  },
  {
    id: 'n5-grammar-6',
    pattern: 'で (de) - Location/Means',
    meaning: 'location of action/means particle',
    level: 'N5',
    explanation: 'で marks where an action takes place or the means/method by which something is done.',
    examples: [
      {
        japanese: 'レストランで食べます。',
        english: 'I eat at a restaurant.',
      },
      {
        japanese: '電車で行きます。',
        english: 'I go by train.',
      },
      {
        japanese: '日本語で話します。',
        english: 'I speak in Japanese.',
      },
    ],
    mastered: false,
  },
  {
    id: 'n5-grammar-7',
    pattern: 'か (ka) - Question',
    meaning: 'question particle',
    level: 'N5',
    explanation: 'か at the end of a sentence turns it into a yes/no question.',
    examples: [
      {
        japanese: 'これは本ですか。',
        english: 'Is this a book?',
      },
      {
        japanese: '日本人ですか。',
        english: 'Are you Japanese?',
      },
      {
        japanese: '食べますか。',
        english: 'Will you eat?',
      },
    ],
    mastered: false,
  },
  {
    id: 'n5-grammar-8',
    pattern: 'も (mo)',
    meaning: 'also, too',
    level: 'N5',
    explanation: 'も means "also" or "too" and replaces は, が, or を.',
    examples: [
      {
        japanese: '私も学生です。',
        english: 'I am also a student.',
      },
      {
        japanese: '水も飲みます。',
        english: 'I drink water too.',
      },
      {
        japanese: '日本語も勉強します。',
        english: 'I study Japanese too.',
      },
    ],
    mastered: false,
  },
  {
    id: 'n5-grammar-9',
    pattern: 'ません (masen)',
    meaning: 'negative polite ending',
    level: 'N5',
    explanation: 'ません is the negative polite form of verbs. Replace ます with ません to make it negative.',
    examples: [
      {
        japanese: '食べません。',
        english: 'I don\'t eat.',
      },
      {
        japanese: '行きません。',
        english: 'I won\'t go.',
      },
      {
        japanese: '分かりません。',
        english: 'I don\'t understand.',
      },
    ],
    mastered: false,
  },
  {
    id: 'n5-grammar-10',
    pattern: 'ました (mashita)',
    meaning: 'past tense polite ending',
    level: 'N5',
    explanation: 'ました is the past tense polite form of verbs. Replace ます with ました.',
    examples: [
      {
        japanese: '食べました。',
        english: 'I ate.',
      },
      {
        japanese: '行きました。',
        english: 'I went.',
      },
      {
        japanese: '見ました。',
        english: 'I saw.',
      },
    ],
    mastered: false,
  },
];

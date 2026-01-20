import type { Content } from '../types';

export const sampleContent: Content[] = [
  {
    id: 'sample-n5-1',
    title: 'はじめまして - Nice to Meet You',
    level: 'N5',
    type: 'lesson',
    source: 'curated',
    content: `はじめまして。
わたしは田中です。
日本人です。
東京に住んでいます。
よろしくおねがいします。`,
    vocabulary: [
      {
        id: 'v1',
        word: 'はじめまして',
        reading: 'はじめまして',
        meaning: 'Nice to meet you (first time greeting)',
        level: 'N5',
        partOfSpeech: 'expression',
        examples: [],
        mastered: false,
      },
      {
        id: 'v2',
        word: '私',
        reading: 'わたし',
        meaning: 'I, me',
        level: 'N5',
        partOfSpeech: 'pronoun',
        examples: [],
        mastered: false,
      },
      {
        id: 'v3',
        word: '日本人',
        reading: 'にほんじん',
        meaning: 'Japanese person',
        level: 'N5',
        partOfSpeech: 'noun',
        examples: [],
        mastered: false,
      },
      {
        id: 'v4',
        word: '住む',
        reading: 'すむ',
        meaning: 'to live, to reside',
        level: 'N5',
        partOfSpeech: 'verb',
        examples: [],
        mastered: false,
      },
    ],
    grammarPoints: [
      'です - copula (is/am/are)',
      'に - particle (location)',
      'ています - progressive/continuous form',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'sample-n4-1',
    title: '週末の予定 - Weekend Plans',
    level: 'N4',
    type: 'article',
    source: 'curated',
    content: `今週末は友達と映画を見に行くつもりです。
新しいアニメ映画が公開されました。
とても楽しみにしています。
映画の後で、レストランで食事をする予定です。`,
    vocabulary: [
      {
        id: 'v5',
        word: '週末',
        reading: 'しゅうまつ',
        meaning: 'weekend',
        level: 'N4',
        partOfSpeech: 'noun',
        examples: [],
        mastered: false,
      },
      {
        id: 'v6',
        word: '予定',
        reading: 'よてい',
        meaning: 'plan, schedule',
        level: 'N4',
        partOfSpeech: 'noun',
        examples: [],
        mastered: false,
      },
      {
        id: 'v7',
        word: '公開',
        reading: 'こうかい',
        meaning: 'public release, showing',
        level: 'N4',
        partOfSpeech: 'noun/verb',
        examples: [],
        mastered: false,
      },
    ],
    grammarPoints: [
      'つもりです - intention (plan to)',
      'に行く - go to (do something)',
      'ています - expressing state/result',
      '予定です - scheduled to',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'sample-n3-1',
    title: '環境問題について - About Environmental Issues',
    level: 'N3',
    type: 'article',
    source: 'curated',
    content: `最近、環境問題がますます深刻になっています。
特に気候変動は世界中で大きな課題となっています。
私たち一人一人が環境保護のために何かできることがあるはずです。
例えば、プラスチックの使用を減らしたり、公共交通機関を利用したりすることが重要です。`,
    vocabulary: [
      {
        id: 'v8',
        word: '環境',
        reading: 'かんきょう',
        meaning: 'environment',
        level: 'N3',
        partOfSpeech: 'noun',
        examples: [],
        mastered: false,
      },
      {
        id: 'v9',
        word: '深刻',
        reading: 'しんこく',
        meaning: 'serious, severe',
        level: 'N3',
        partOfSpeech: 'な-adjective',
        examples: [],
        mastered: false,
      },
      {
        id: 'v10',
        word: '課題',
        reading: 'かだい',
        meaning: 'problem, issue, challenge',
        level: 'N3',
        partOfSpeech: 'noun',
        examples: [],
        mastered: false,
      },
    ],
    grammarPoints: [
      'ますます - more and more',
      'はずです - should be, expected to',
      'たり～たり - listing actions',
      '一人一人 - each person, everyone',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'sample-n2-1',
    title: 'AI Generated',
    level: 'N2',
    type: 'article',
    source: 'ai-generated',
    content: `人工知能の発展に伴い、私たちの生活は劇的に変化しつつあります。
一方で、技術の進歩がもたらす利便性を享受する反面、プライバシーや雇用に関する懸念も高まっています。
このような状況において、技術と人間の共存のあり方を模索することが求められています。`,
    vocabulary: [
      {
        id: 'v11',
        word: '人工知能',
        reading: 'じんこうちのう',
        meaning: 'artificial intelligence',
        level: 'N2',
        partOfSpeech: 'noun',
        examples: [],
        mastered: false,
      },
      {
        id: 'v12',
        word: '享受',
        reading: 'きょうじゅ',
        meaning: 'enjoyment, reception',
        level: 'N2',
        partOfSpeech: 'noun/verb',
        examples: [],
        mastered: false,
      },
      {
        id: 'v13',
        word: '懸念',
        reading: 'けねん',
        meaning: 'concern, worry',
        level: 'N2',
        partOfSpeech: 'noun',
        examples: [],
        mastered: false,
      },
    ],
    grammarPoints: [
      'に伴い - in accordance with, along with',
      'つつある - in the process of',
      '一方で～反面 - on one hand ~ on the other hand',
      'において - in, at (formal)',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'sample-n1-1',
    title: '言語習得の認知プロセス',
    level: 'N1',
    type: 'article',
    source: 'external',
    content: `言語習得における認知プロセスは極めて複雑であり、単なる暗記や反復練習のみでは十分な習熟には至らない。
むしろ、文脈に即した理解と運用能力の向上が不可欠である。
近年の研究によれば、母語話者との実践的な交流を通じて、言語の微妙なニュアンスや社会言語学的側面を体得することが、真の言語能力の獲得につながるとされている。`,
    vocabulary: [
      {
        id: 'v14',
        word: '習得',
        reading: 'しゅうとく',
        meaning: 'acquisition, learning',
        level: 'N1',
        partOfSpeech: 'noun/verb',
        examples: [],
        mastered: false,
      },
      {
        id: 'v15',
        word: '体得',
        reading: 'たいとく',
        meaning: 'mastery through experience',
        level: 'N1',
        partOfSpeech: 'noun/verb',
        examples: [],
        mastered: false,
      },
      {
        id: 'v16',
        word: 'ニュアンス',
        reading: 'ニュアンス',
        meaning: 'nuance',
        level: 'N1',
        partOfSpeech: 'noun',
        examples: [],
        mastered: false,
      },
    ],
    grammarPoints: [
      'における - in, at (formal)',
      'のみでは - only...is not enough',
      'むしろ - rather, instead',
      'に即した - in accordance with',
      'とされている - it is said that',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function seedSampleContent() {
  const { addContent, getAllContent } = await import('../utils/db');

  try {
    const existing = await getAllContent();
    if (existing.length === 0) {
      for (const content of sampleContent) {
        await addContent(content);
      }
      console.log('Sample content seeded successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error seeding sample content:', error);
    return false;
  }
}

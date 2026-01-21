export interface ReadingPassage {
  id: string;
  title: string;
  titleReading: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  content: string;
  translation: string;
  vocabularyList: Array<{
    word: string;
    reading: string;
    meaning: string;
  }>;
}

export const n5ReadingPassages: ReadingPassage[] = [
  {
    id: 'n5-reading-1',
    title: '私の家族',
    titleReading: 'わたしのかぞく',
    level: 'N5',
    content: `私の家族は四人です。父と母と弟がいます。
父は会社員です。母は先生です。
弟は学生です。私も学生です。
毎日、家族でご飯を食べます。
とても楽しいです。`,
    translation: `My family has four people. There is my father, mother, and younger brother.
My father is a company employee. My mother is a teacher.
My younger brother is a student. I am also a student.
Every day, we eat meals together as a family.
It is very fun.`,
    vocabularyList: [
      { word: '家族', reading: 'かぞく', meaning: 'family' },
      { word: '四人', reading: 'よにん', meaning: 'four people' },
      { word: '父', reading: 'ちち', meaning: 'father' },
      { word: '母', reading: 'はは', meaning: 'mother' },
      { word: '弟', reading: 'おとうと', meaning: 'younger brother' },
      { word: '会社員', reading: 'かいしゃいん', meaning: 'company employee' },
      { word: '先生', reading: 'せんせい', meaning: 'teacher' },
      { word: '学生', reading: 'がくせい', meaning: 'student' },
      { word: '毎日', reading: 'まいにち', meaning: 'every day' },
      { word: 'ご飯', reading: 'ごはん', meaning: 'meal, rice' },
      { word: '食べます', reading: 'たべます', meaning: 'to eat' },
      { word: '楽しい', reading: 'たのしい', meaning: 'fun, enjoyable' },
    ],
  },
  {
    id: 'n5-reading-2',
    title: '私の一日',
    titleReading: 'わたしのいちにち',
    level: 'N5',
    content: `私は毎朝七時に起きます。
朝ご飯を食べて、学校に行きます。
学校で日本語を勉強します。
三時に学校が終わります。
家に帰って、テレビを見ます。
十一時に寝ます。`,
    translation: `I wake up at 7 o'clock every morning.
I eat breakfast and go to school.
I study Japanese at school.
School ends at 3 o'clock.
I go home and watch TV.
I sleep at 11 o'clock.`,
    vocabularyList: [
      { word: '毎朝', reading: 'まいあさ', meaning: 'every morning' },
      { word: '七時', reading: 'しちじ', meaning: '7 o\'clock' },
      { word: '起きます', reading: 'おきます', meaning: 'to wake up' },
      { word: '朝ご飯', reading: 'あさごはん', meaning: 'breakfast' },
      { word: '学校', reading: 'がっこう', meaning: 'school' },
      { word: '行きます', reading: 'いきます', meaning: 'to go' },
      { word: '日本語', reading: 'にほんご', meaning: 'Japanese language' },
      { word: '勉強します', reading: 'べんきょうします', meaning: 'to study' },
      { word: '三時', reading: 'さんじ', meaning: '3 o\'clock' },
      { word: '終わります', reading: 'おわります', meaning: 'to end' },
      { word: '家', reading: 'いえ', meaning: 'house, home' },
      { word: '帰ります', reading: 'かえります', meaning: 'to return home' },
      { word: 'テレビ', reading: 'てれび', meaning: 'television' },
      { word: '見ます', reading: 'みます', meaning: 'to watch, to see' },
      { word: '十一時', reading: 'じゅういちじ', meaning: '11 o\'clock' },
      { word: '寝ます', reading: 'ねます', meaning: 'to sleep' },
    ],
  },
  {
    id: 'n5-reading-3',
    title: 'レストランで',
    titleReading: 'れすとらんで',
    level: 'N5',
    content: `今日、友達とレストランに行きました。
私はラーメンを食べました。
友達はカレーを食べました。
とてもおいしかったです。
コーヒーも飲みました。
楽しかったです。`,
    translation: `Today, I went to a restaurant with my friend.
I ate ramen.
My friend ate curry.
It was very delicious.
I also drank coffee.
It was fun.`,
    vocabularyList: [
      { word: '今日', reading: 'きょう', meaning: 'today' },
      { word: '友達', reading: 'ともだち', meaning: 'friend' },
      { word: 'レストラン', reading: 'れすとらん', meaning: 'restaurant' },
      { word: '行きました', reading: 'いきました', meaning: 'went' },
      { word: 'ラーメン', reading: 'らーめん', meaning: 'ramen' },
      { word: '食べました', reading: 'たべました', meaning: 'ate' },
      { word: 'カレー', reading: 'かれー', meaning: 'curry' },
      { word: 'おいしい', reading: 'おいしい', meaning: 'delicious' },
      { word: 'コーヒー', reading: 'こーひー', meaning: 'coffee' },
      { word: '飲みました', reading: 'のみました', meaning: 'drank' },
    ],
  },
];

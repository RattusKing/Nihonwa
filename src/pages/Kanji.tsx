import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { KanjiStudy } from '../components/KanjiStudy';
import { KanjiFlashcard } from '../components/KanjiFlashcard';
import { getKanjiByLevel, updateKanji } from '../utils/db';
import { loadAllKanji } from '../data/kanji/kanjiLoader';
import { KanjiItem, JLPTLevel } from '../types';
import { getLevelColor } from '../utils/jlptHelpers';

type StudyMode = 'grid' | 'flashcard' | 'progressive';
type Category = 'all' | 'numbers' | 'days' | 'time' | 'people' | 'verbs' | 'adjectives' | 'places' | 'common';

export default function Kanji() {
  const { user } = useStore();
  const [kanjiList, setKanjiList] = useState<KanjiItem[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>(user?.currentLevel || 'N5');
  const [studyMode, setStudyMode] = useState<StudyMode>('grid');
  const [category, setCategory] = useState<Category>('all');
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showStudySection, setShowStudySection] = useState(true);

  const levels: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

  useEffect(() => {
    loadKanjiData();
  }, [selectedLevel]);

  const loadKanjiData = async () => {
    setLoading(true);
    try {
      await loadAllKanji();
      const kanji = await getKanjiByLevel(selectedLevel);
      setKanjiList(kanji);
    } catch (error) {
      console.error('Error loading kanji:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredKanji = (): KanjiItem[] => {
    if (category === 'all') return kanjiList;

    const categoryRanges: Record<Category, number[]> = {
      all: [],
      numbers: [0, 13], // 一二三四五六七八九十百千万 (1-10, 100, 1000, 10000)
      days: [13, 20], // 日月火水木金土 (Sun-Sat)
      time: [20, 24], // 年時分半 (Year, Hour, Minute, Half)
      people: [24, 34], // 人男女子母父友先生学
      verbs: [34, 50], // 見行来出入食飲買読書聞話言立休会
      adjectives: [50, 62], // 大小高安新古長多少白赤青
      places: [62, 81], // 上下中外前後右左北南東西国京山川駅校店
      common: [81, 99], // 本名何今毎車電天気手口目耳足雨花円力
    };

    const range = categoryRanges[category];
    if (!range || range.length === 0) return kanjiList;

    return kanjiList.slice(range[0], range[1]);
  };

  const handleKanjiMastered = async (kanjiId: string) => {
    try {
      const kanji = kanjiList.find((k) => k.id === kanjiId);
      if (!kanji) return;

      const updatedKanji: KanjiItem = {
        ...kanji,
        mastered: true,
        lastReviewed: new Date(),
      };

      await updateKanji(updatedKanji);
      setKanjiList((prev) =>
        prev.map((k) => (k.id === kanjiId ? updatedKanji : k))
      );

      // Move to next flashcard
      if (studyMode === 'flashcard') {
        handleNextFlashcard();
      }
    } catch (error) {
      console.error('Error updating kanji:', error);
    }
  };

  const handleNextFlashcard = () => {
    const filtered = getFilteredKanji();
    if (currentFlashcardIndex < filtered.length - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
    } else {
      setCurrentFlashcardIndex(0);
    }
  };

  const handlePreviousFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(currentFlashcardIndex - 1);
    } else {
      const filtered = getFilteredKanji();
      setCurrentFlashcardIndex(filtered.length - 1);
    }
  };

  const filteredKanji = getFilteredKanji();
  const masteredCount = kanjiList.filter((k) => k.mastered).length;
  const progressPercentage = kanjiList.length > 0 ? Math.round((masteredCount / kanjiList.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Kanji Dojo 漢字道場
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Master Japanese kanji characters through visual learning and practice
        </p>
      </div>

      {/* Progress Summary */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Your Progress</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {masteredCount} of {kanjiList.length} kanji mastered
            </p>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {progressPercentage}%
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Level Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Select JLPT Level</h3>
        <div className="flex flex-wrap gap-3">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setCurrentFlashcardIndex(0);
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedLevel === level
                  ? 'shadow-lg scale-105'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                backgroundColor: selectedLevel === level ? getLevelColor(level) : undefined,
                color: selectedLevel === level ? 'white' : getLevelColor(level),
                border: `2px solid ${getLevelColor(level)}`,
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Study Section Toggle */}
      <div className="card">
        <button
          onClick={() => setShowStudySection(!showStudySection)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold">
            Study Before Lessons - Child-Friendly Learning
          </h3>
          <svg
            className={`w-6 h-6 transition-transform ${showStudySection ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showStudySection && (
          <div className="mt-6 space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                How to Learn Like a Child
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400">1.</span>
                  <span><strong>See & Recognize:</strong> Look at the kanji character and its meaning together</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400">2.</span>
                  <span><strong>Hear & Repeat:</strong> Say the romaji readings out loud multiple times</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400">3.</span>
                  <span><strong>Practice Daily:</strong> Review the same kanji every day until it feels natural</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400">4.</span>
                  <span><strong>Start Simple:</strong> Master numbers and common words before moving to complex kanji</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400">5.</span>
                  <span><strong>Use Categories:</strong> Learn related kanji together (like days of the week)</span>
                </li>
              </ul>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Study by Category</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  { value: 'all', label: 'All Kanji', icon: '全', desc: 'All N5 kanji' },
                  { value: 'numbers', label: 'Numbers', icon: '一二三', desc: '0-10, 100, 1000, 10000' },
                  { value: 'days', label: 'Days of Week', icon: '日月火', desc: 'Sunday - Saturday' },
                  { value: 'time', label: 'Time Words', icon: '年時分', desc: 'Year, hour, minute' },
                  { value: 'people', label: 'People & Family', icon: '人男女', desc: 'Person, family, student' },
                  { value: 'verbs', label: 'Action Verbs', icon: '見行来', desc: 'See, go, eat, read' },
                  { value: 'adjectives', label: 'Descriptions', icon: '大小高', desc: 'Big, small, colors' },
                  { value: 'places', label: 'Places', icon: '上下中', desc: 'Directions, locations' },
                  { value: 'common', label: 'Common Words', icon: '本名車', desc: 'Book, name, car' },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setCategory(cat.value as Category);
                      setCurrentFlashcardIndex(0);
                    }}
                    className={`p-3 rounded-xl text-left transition-all border-2 ${
                      category === cat.value
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-600 shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-semibold text-sm">{cat.label}</span>
                    </div>
                    <div className={`text-xs ${category === cat.value ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {cat.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Study Mode Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Study Mode</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setStudyMode('grid')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              studyMode === 'grid'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Grid View
          </button>
          <button
            onClick={() => setStudyMode('flashcard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              studyMode === 'flashcard'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Flashcard
          </button>
        </div>
      </div>

      {/* Study Content */}
      {loading ? (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading kanji...</p>
        </div>
      ) : filteredKanji.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No Kanji Available</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Kanji data for {selectedLevel} is not yet available.
          </p>
        </div>
      ) : (
        <>
          {studyMode === 'grid' && (
            <div className="card">
              <KanjiStudy kanjiList={filteredKanji} onKanjiClick={(kanji) => console.log(kanji)} />
            </div>
          )}

          {studyMode === 'flashcard' && (
            <div className="space-y-4">
              {/* Category Info */}
              <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      {category === 'all' ? 'All Kanji' :
                       category === 'numbers' ? 'Numbers (1-10, 100, 1000, 10000)' :
                       category === 'days' ? 'Days of the Week (日月火水木金土)' :
                       category === 'time' ? 'Time Words (Year, Hour, Minute, Half)' :
                       category === 'people' ? 'People & Family' :
                       category === 'verbs' ? 'Action Verbs' :
                       category === 'adjectives' ? 'Descriptions & Colors' :
                       category === 'places' ? 'Places & Directions' :
                       'Common Words'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {filteredKanji.length} kanji in this category
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {currentFlashcardIndex + 1} / {filteredKanji.length}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handlePreviousFlashcard}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  ← Previous
                </button>
                <button
                  onClick={handleNextFlashcard}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  Next →
                </button>
              </div>

              {/* Flashcard */}
              <div className="card">
                <KanjiFlashcard
                  kanji={filteredKanji[currentFlashcardIndex]}
                  showRomaji={true}
                  onMastered={handleKanjiMastered}
                />
              </div>

              {/* Quick Navigation */}
              <div className="card">
                <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Quick Jump</h4>
                <div className="flex flex-wrap gap-2">
                  {filteredKanji.map((kanji, index) => (
                    <button
                      key={kanji.id}
                      onClick={() => setCurrentFlashcardIndex(index)}
                      className={`w-12 h-12 rounded-lg font-bold transition-all ${
                        index === currentFlashcardIndex
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110'
                          : kanji.mastered
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {kanji.character}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

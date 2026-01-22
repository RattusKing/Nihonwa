import React, { useState } from 'react';
import { KanjiItem } from '../types';

interface KanjiStudyProps {
  kanjiList: KanjiItem[];
  onKanjiClick?: (kanji: KanjiItem) => void;
}

export const KanjiStudy: React.FC<KanjiStudyProps> = ({ kanjiList, onKanjiClick }) => {
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem | null>(null);
  const [showRomaji, setShowRomaji] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);

  const handleKanjiClick = (kanji: KanjiItem) => {
    setSelectedKanji(kanji);
    onKanjiClick?.(kanji);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-4 items-center justify-between flex-wrap">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showRomaji}
              onChange={(e) => setShowRomaji(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
            />
            <span className="text-sm">Show Romaji</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMeaning}
              onChange={(e) => setShowMeaning(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
            />
            <span className="text-sm">Show Meaning</span>
          </label>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total: {kanjiList.length} kanji • Mastered: {kanjiList.filter(k => k.mastered).length}
        </div>
      </div>

      {/* Kanji Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {kanjiList.map((kanji) => (
          <div
            key={kanji.id}
            onClick={() => handleKanjiClick(kanji)}
            className={`
              relative p-4 rounded-lg border-2 cursor-pointer transition-all
              ${selectedKanji?.id === kanji.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }
              ${kanji.mastered ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-gray-800'}
            `}
          >
            {/* Mastered Badge */}
            {kanji.mastered && (
              <div className="absolute top-1 right-1">
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            {/* Kanji Character */}
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{kanji.character}</div>

              {/* Meaning */}
              {showMeaning && (
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {kanji.meaning}
                </div>
              )}

              {/* Romaji Readings */}
              {showRomaji && kanji.romaji && (
                <div className="space-y-1 text-xs">
                  {kanji.romaji.onyomi.length > 0 && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">On: </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {kanji.romaji.onyomi.join(', ')}
                      </span>
                    </div>
                  )}
                  {kanji.romaji.kunyomi.length > 0 && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Kun: </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {kanji.romaji.kunyomi.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Stroke Count */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {kanji.strokes} strokes
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Kanji Detail */}
      {selectedKanji && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedKanji(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-3xl font-bold">Kanji Details</h3>
              <button
                onClick={() => setSelectedKanji(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Large Kanji Display */}
              <div className="text-center">
                <div className="text-9xl font-bold mb-4">{selectedKanji.character}</div>
                <div className="text-2xl text-gray-700 dark:text-gray-300">{selectedKanji.meaning}</div>
              </div>

              {/* Readings */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Onyomi (音読み)</h4>
                  <div className="space-y-1">
                    {selectedKanji.readings.onyomi.map((reading, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="font-medium">{reading}</span>
                        {selectedKanji.romaji && (
                          <span className="text-gray-600 dark:text-gray-400">
                            {selectedKanji.romaji.onyomi[idx]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Kunyomi (訓読み)</h4>
                  <div className="space-y-1">
                    {selectedKanji.readings.kunyomi.map((reading, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="font-medium">{reading}</span>
                        {selectedKanji.romaji && (
                          <span className="text-gray-600 dark:text-gray-400">
                            {selectedKanji.romaji.kunyomi[idx]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Strokes:</span>
                  <span className="ml-2 font-semibold">{selectedKanji.strokes}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Level:</span>
                  <span className="ml-2 font-semibold">{selectedKanji.level}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Radicals:</span>
                  <span className="ml-2 font-semibold">{selectedKanji.radicals.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

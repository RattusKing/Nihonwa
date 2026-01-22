import React, { useState } from 'react';
import { KanjiItem } from '../types';

interface KanjiFlashcardProps {
  kanji: KanjiItem;
  showRomaji?: boolean;
  onMastered?: (kanjiId: string) => void;
}

export const KanjiFlashcard: React.FC<KanjiFlashcardProps> = ({
  kanji,
  showRomaji = true,
  onMastered,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMastered = () => {
    onMastered?.(kanji.id);
  };

  return (
    <div className="perspective-1000">
      <div
        className={`relative w-full h-96 transition-transform duration-500 transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
      >
        {/* Front of card - Kanji Character */}
        <div className="absolute inset-0 backface-hidden">
          <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center border-2 border-gray-200 dark:border-gray-700">
            <div className="text-9xl font-bold mb-6">{kanji.character}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tap to reveal details
            </div>
            {kanji.mastered && (
              <div className="mt-4 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <span className="text-green-700 dark:text-green-300 text-sm font-medium">
                  ✓ Mastered
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Back of card - Details */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-xl p-8 flex flex-col border-2 border-blue-200 dark:border-blue-700">
            <div className="flex-1 space-y-6">
              {/* Meaning */}
              <div className="text-center">
                <div className="text-6xl font-bold mb-3">{kanji.character}</div>
                <div className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                  {kanji.meaning}
                </div>
              </div>

              {/* Readings */}
              <div className="space-y-4">
                {/* Onyomi */}
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Onyomi (音読み)
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-medium">
                      {kanji.readings.onyomi.join(', ')}
                    </div>
                    {showRomaji && kanji.romaji && kanji.romaji.onyomi.length > 0 && (
                      <div className="text-lg text-blue-600 dark:text-blue-400">
                        {kanji.romaji.onyomi.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Kunyomi */}
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Kunyomi (訓読み)
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-medium">
                      {kanji.readings.kunyomi.join(', ')}
                    </div>
                    {showRomaji && kanji.romaji && kanji.romaji.kunyomi.length > 0 && (
                      <div className="text-lg text-green-600 dark:text-green-400">
                        {kanji.romaji.kunyomi.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Strokes: </span>
                    <span className="font-semibold">{kanji.strokes}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Level: </span>
                    <span className="font-semibold">{kanji.level}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600 dark:text-gray-400">Radicals: </span>
                    <span className="font-semibold">{kanji.radicals.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-4">
              {!kanji.mastered && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMastered();
                  }}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Mark as Mastered
                </button>
              )}
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              Tap to flip back
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

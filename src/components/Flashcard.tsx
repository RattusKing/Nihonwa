import { useState } from 'react';
import type { VocabularyItem } from '../types';
import { toRomaji } from '../utils/romaji';

interface FlashcardProps {
  vocab: VocabularyItem;
  onCorrect: () => void;
  onIncorrect: () => void;
  onSkip: () => void;
}

export default function Flashcard({ vocab, onCorrect, onIncorrect, onSkip }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCorrect = () => {
    onCorrect();
    setIsFlipped(false);
  };

  const handleIncorrect = () => {
    onIncorrect();
    setIsFlipped(false);
  };

  const handleSkip = () => {
    onSkip();
    setIsFlipped(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Flashcard */}
      <div
        onClick={handleFlip}
        className="relative h-96 cursor-pointer perspective-1000"
      >
        <div
          className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front of card */}
          <div className={`absolute w-full h-full backface-hidden ${isFlipped ? 'hidden' : ''}`}>
            <div className="card h-full flex flex-col items-center justify-center bg-gradient-to-br from-n4-light to-n4">
              <div className={`badge-${vocab.level.toLowerCase()} mb-4`}>
                {vocab.level}
              </div>
              <div className="text-6xl font-bold text-white mb-4">
                {vocab.word}
              </div>
              <div className="text-xl text-white opacity-90">
                {vocab.reading}
              </div>
              <div className="text-md text-white opacity-75 mb-2">
                ({toRomaji(vocab.reading)})
              </div>
              <div className="mt-6 text-sm text-white opacity-75">
                Click to reveal meaning
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className={`absolute w-full h-full backface-hidden ${!isFlipped ? 'hidden' : ''}`}>
            <div className="card h-full flex flex-col bg-white">
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className={`badge-${vocab.level.toLowerCase()} mb-4`}>
                  {vocab.level}
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {vocab.word}
                </div>
                <div className="text-xl text-gray-600 mb-1">
                  {vocab.reading}
                </div>
                <div className="text-md text-gray-500 mb-4">
                  ({toRomaji(vocab.reading)})
                </div>
                <div className="text-2xl text-n4 font-semibold mb-4">
                  {vocab.meaning}
                </div>
                <div className="text-sm text-gray-500 mb-6">
                  {vocab.partOfSpeech}
                </div>

                {vocab.examples.length > 0 && (
                  <div className="w-full mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Example:</div>
                    <div className="text-gray-700">{vocab.examples[0]}</div>
                  </div>
                )}
              </div>

              {/* Response Buttons */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIncorrect();
                    }}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    ❌ Incorrect
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSkip();
                    }}
                    className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors"
                  >
                    ⏭️ Skip
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCorrect();
                    }}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    ✅ Correct
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mt-6 text-gray-600 text-sm">
        Click the card to flip • Mark how well you knew it
      </div>
    </div>
  );
}

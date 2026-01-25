import { useState } from 'react';
import type { ReadingComprehensionQuestion } from '../../data/reading/n5-reading';
import { toRomaji } from '../../utils/romaji';

interface ReadingComprehensionExerciseProps {
  question: ReadingComprehensionQuestion;
  onAnswer: (correct: boolean) => void;
}

export default function ReadingComprehensionExercise({
  question,
  onAnswer
}: ReadingComprehensionExerciseProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (index: number) => {
    if (showFeedback) return; // Already answered

    setSelected(index);
    setShowFeedback(true);

    const isCorrect = index === question.correctAnswer;

    // Show feedback briefly, then move to next
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null);
      setShowFeedback(false);
    }, 2000);
  };

  const isCorrect = selected === question.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        {/* Question */}
        <div className="mb-8">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Reading Comprehension
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {question.question}
            </h2>
            <div className="text-xl text-n4 font-medium mb-1">
              {question.questionReading}
            </div>
            <div className="text-md text-gray-600 dark:text-gray-400">
              ({toRomaji(question.questionReading)})
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, index) => {
            const isSelected = selected === index;
            const isCorrectOption = index === question.correctAnswer;

            let bgColor = 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600';
            if (showFeedback && isSelected) {
              bgColor = isCorrect
                ? 'bg-green-100 dark:bg-green-900 border-green-500'
                : 'bg-red-100 dark:bg-red-900 border-red-500';
            } else if (showFeedback && isCorrectOption) {
              bgColor = 'bg-green-100 dark:bg-green-900 border-green-500';
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={showFeedback}
                className={`p-4 border-2 rounded-lg text-left transition-all ${bgColor} ${
                  showFeedback ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xl text-gray-800 dark:text-gray-100 font-bold mb-1">
                      {option.text}
                    </span>
                    <span className="text-sm text-n4 font-medium">
                      {option.reading}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      ({toRomaji(option.reading)})
                    </span>
                  </div>
                  <div>
                    {showFeedback && isCorrectOption && (
                      <span className="ml-2 text-green-600 text-xl">✓</span>
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <span className="ml-2 text-red-600 text-xl">✗</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-lg ${
            isCorrect ? 'bg-green-50 dark:bg-green-900 border-2 border-green-500' : 'bg-red-50 dark:bg-red-900 border-2 border-red-500'
          }`}>
            <div className={`font-bold text-xl mb-2 ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {isCorrect ? '🎉 Perfect!' : '❌ Not Quite'}
            </div>
            {question.explanation && (
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <div className="text-gray-700 dark:text-gray-300">
                  {question.explanation}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

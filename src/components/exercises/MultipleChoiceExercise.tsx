import { useState } from 'react';
import type { Exercise } from '../../types/lesson';
import { toRomaji } from '../../utils/romaji';

interface MultipleChoiceExerciseProps {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function MultipleChoiceExercise({ exercise, onAnswer }: MultipleChoiceExerciseProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (option: string) => {
    if (showFeedback) return; // Already answered

    setSelected(option);
    setShowFeedback(true);

    const isCorrect = option === exercise.correctAnswer;

    // Show feedback briefly, then move to next
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null);
      setShowFeedback(false);
    }, 1500);
  };

  const isCorrect = selected === exercise.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        {/* Question */}
        <div className="mb-8 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            {exercise.type === 'multiple-choice-jp' ? 'Japanese → English' : 'English → Japanese'}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {exercise.question}
          </h2>
          {exercise.type === 'multiple-choice-jp' && (
            <>
              <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                {exercise.vocab.word}
              </div>
              <div className="text-2xl text-n4 font-medium mb-1">
                {exercise.vocab.reading}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                ({toRomaji(exercise.vocab.reading)})
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {exercise.vocab.partOfSpeech}
              </div>
            </>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {exercise.options?.map((option, index) => {
            const isSelected = selected === option;
            const isCorrectOption = option === exercise.correctAnswer;
            const optionDetails = exercise.optionsWithDetails?.[index];

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
                onClick={() => handleSelect(option)}
                disabled={showFeedback}
                className={`p-4 border-2 rounded-lg text-left font-medium transition-all ${bgColor} ${
                  showFeedback ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xl text-gray-800 dark:text-gray-100 font-bold">{option}</span>
                    {optionDetails && exercise.type === 'multiple-choice-en' && (
                      <>
                        <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">{optionDetails.reading}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">({toRomaji(optionDetails.reading)})</span>
                      </>
                    )}
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
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {exercise.vocab.word}
              </div>
              <div className="text-lg text-n4 font-medium">
                {exercise.vocab.reading}
              </div>
              <div className="text-md text-gray-600 dark:text-gray-400 mb-2">
                ({toRomaji(exercise.vocab.reading)})
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <strong>Meaning:</strong> {exercise.vocab.meaning}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

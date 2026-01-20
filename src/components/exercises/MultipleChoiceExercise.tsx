import { useState } from 'react';
import type { Exercise } from '../../types/lesson';

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
          <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
            {exercise.type === 'multiple-choice-jp' ? 'Japanese → English' : 'English → Japanese'}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {exercise.question}
          </h2>
          {exercise.type === 'multiple-choice-jp' && (
            <div className="text-4xl font-bold text-n4 mb-2">
              {exercise.vocab.word}
            </div>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {exercise.options?.map((option, index) => {
            const isSelected = selected === option;
            const isCorrectOption = option === exercise.correctAnswer;

            let bgColor = 'bg-white hover:bg-gray-50 border-gray-300';
            if (showFeedback && isSelected) {
              bgColor = isCorrect
                ? 'bg-green-100 border-green-500'
                : 'bg-red-100 border-red-500';
            } else if (showFeedback && isCorrectOption) {
              bgColor = 'bg-green-100 border-green-500';
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
                <span className="text-gray-700">{option}</span>
                {showFeedback && isCorrectOption && (
                  <span className="ml-2 text-green-600">✓</span>
                )}
                {showFeedback && isSelected && !isCorrect && (
                  <span className="ml-2 text-red-600">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-lg ${
            isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="font-semibold mb-1">
              {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
            </div>
            {!isCorrect && (
              <div className="text-sm">
                The correct answer is: <strong>{exercise.correctAnswer}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

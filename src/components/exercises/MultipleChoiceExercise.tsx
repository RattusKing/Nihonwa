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
          <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
            {exercise.type === 'multiple-choice-jp' ? 'Japanese → English' : 'English → Japanese'}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {exercise.question}
          </h2>
          {exercise.type === 'multiple-choice-jp' && (
            <>
              <div className="text-5xl font-bold text-gray-900 mb-3">
                {exercise.vocab.word}
              </div>
              <div className="text-2xl text-n4 font-medium mb-1">
                {exercise.vocab.reading}
              </div>
              <div className="text-lg text-gray-600 mb-2">
                ({toRomaji(exercise.vocab.reading)})
              </div>
              <div className="text-sm text-gray-500">
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
            isCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
          }`}>
            <div className={`font-bold text-xl mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? '🎉 Perfect!' : '❌ Not Quite'}
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {exercise.vocab.word}
              </div>
              <div className="text-lg text-n4 font-medium">
                {exercise.vocab.reading}
              </div>
              <div className="text-md text-gray-600 mb-2">
                ({toRomaji(exercise.vocab.reading)})
              </div>
              <div className="text-gray-700">
                <strong>Meaning:</strong> {exercise.vocab.meaning}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

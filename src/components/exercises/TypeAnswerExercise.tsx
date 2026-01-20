import { useState } from 'react';
import type { Exercise } from '../../types/lesson';
import { toRomaji } from '../../utils/romaji';

interface TypeAnswerExerciseProps {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function TypeAnswerExercise({ exercise, onAnswer }: TypeAnswerExerciseProps) {
  const [answer, setAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showFeedback || !answer.trim()) return;

    // Normalize answers (remove spaces, lowercase for hiragana)
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = exercise.correctAnswer.toLowerCase();

    const correct = userAnswer === correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    // Show feedback briefly, then move to next
    setTimeout(() => {
      onAnswer(correct);
      setAnswer('');
      setShowFeedback(false);
      setShowHint(false);
    }, 2000);
  };

  const handleSkip = () => {
    setShowFeedback(true);
    setIsCorrect(false);

    setTimeout(() => {
      onAnswer(false);
      setAnswer('');
      setShowFeedback(false);
      setShowHint(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        {/* Question */}
        <div className="mb-8 text-center">
          <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
            Type the Answer
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {exercise.question}
          </h2>
          <div className="text-5xl font-bold text-gray-900 mb-3">
            {exercise.vocab.word}
          </div>
          <div className="text-sm text-gray-500">
            ({exercise.vocab.meaning} - {exercise.vocab.partOfSpeech})
          </div>
        </div>

        {/* Input Form */}
        {!showFeedback ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-lg focus:border-n4 focus:ring-2 focus:ring-n4 focus:outline-none"
              autoFocus
            />

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
              >
                💡 Hint
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={!answer.trim()}
                className="flex-1 btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Check Answer
              </button>
            </div>
          </form>
        ) : (
          <div className={`p-6 rounded-lg ${
            isCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
          }`}>
            <div className={`text-2xl font-bold mb-4 text-center ${
              isCorrect ? 'text-green-700' : 'text-red-700'
            }`}>
              {isCorrect ? '🎉 Perfect!' : '❌ Not quite'}
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-center mb-3">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {exercise.vocab.word}
                </div>
                <div className="text-xl text-n4 font-medium">
                  Correct reading: {exercise.correctAnswer}
                </div>
                <div className="text-lg text-gray-600 mb-2">
                  ({toRomaji(exercise.correctAnswer)})
                </div>
                <div className="text-gray-700">
                  <strong>Meaning:</strong> {exercise.vocab.meaning}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hint */}
        {showHint && exercise.hint && !showFeedback && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-800 text-sm">
            <strong>💡 Hint:</strong> {exercise.hint}
          </div>
        )}
      </div>
    </div>
  );
}

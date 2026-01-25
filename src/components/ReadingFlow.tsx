import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { ReadingPassage } from '../data/reading/n5-reading';
import ReadingComprehensionExercise from './exercises/ReadingComprehensionExercise';
import { toRomaji } from '../utils/romaji';

interface ReadingFlowProps {
  passage: ReadingPassage;
  onComplete: () => void;
}

export default function ReadingFlow({ passage, onComplete }: ReadingFlowProps) {
  const { user, updateProgress, recalculateJLPTScore } = useStore();
  const [stage, setStage] = useState<'reading' | 'questions' | 'results'>('reading');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showTranslation, setShowTranslation] = useState(false);

  const handleStartQuestions = () => {
    setStage('questions');
  };

  const handleAnswer = (correct: boolean) => {
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    // Move to next question or show results
    if (currentQuestionIndex < passage.comprehensionQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      showResults();
    }
  };

  const showResults = () => {
    setStage('results');

    const correctAnswers = score.correct + 1; // +1 for last question
    const totalQuestions = score.total + 1;
    const percentage = (correctAnswers / totalQuestions) * 100;
    const passed = percentage >= 80; // 80% to pass

    // Update progress
    if (user && passed) {
      // Increment articlesRead
      const currentProgress = useStore.getState().progress.find(p => p.level === passage.level);
      if (currentProgress) {
        const newArticlesRead = (currentProgress.articlesRead || 0) + 1;

        // Calculate reading skill percentage (simple: based on articles completed)
        // For N5: assume 10 reading passages total
        const totalPassages = 10; // This can be adjusted per level
        const readingSkillPercentage = Math.min(100, (newArticlesRead / totalPassages) * 100);

        updateProgress(passage.level, {
          ...currentProgress,
          articlesRead: newArticlesRead,
          skills: {
            ...currentProgress.skills,
            reading: readingSkillPercentage,
          },
        });

        // Recalculate JLPT score to include this reading result
        recalculateJLPTScore(passage.level);
      }
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  if (stage === 'reading') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {passage.title}
            </h1>
            <div className="text-2xl text-n4 font-medium mb-1">
              {passage.titleReading}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              ({toRomaji(passage.titleReading)})
            </div>
          </div>

          {/* Passage Content */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
            <div className="text-xl leading-relaxed text-gray-900 dark:text-gray-100 mb-4 whitespace-pre-line">
              {passage.content}
            </div>
          </div>

          {/* Translation Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              {showTranslation ? 'Hide Translation' : 'Show Translation'}
            </button>
            {showTranslation && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {passage.translation}
                </p>
              </div>
            )}
          </div>

          {/* Vocabulary List */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Key Vocabulary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {passage.vocabularyList.map((vocab, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600"
                >
                  <div className="font-bold text-gray-900 dark:text-gray-100">
                    {vocab.word}
                  </div>
                  <div className="text-sm text-n4 font-medium">
                    {vocab.reading}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ({toRomaji(vocab.reading)})
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {vocab.meaning}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStartQuestions}
              className="btn-primary px-8 py-3 text-lg"
            >
              Start Comprehension Questions
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'questions') {
    const currentQuestion = passage.comprehensionQuestions[currentQuestionIndex];
    return (
      <div>
        <div className="mb-4 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {passage.comprehensionQuestions.length}
          </div>
        </div>
        <ReadingComprehensionExercise
          question={currentQuestion}
          onAnswer={handleAnswer}
        />
      </div>
    );
  }

  // Results stage
  const correctAnswers = score.correct + 1;
  const totalQuestions = score.total + 1;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const passed = percentage >= 80;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card text-center">
        <div className="mb-6">
          {passed ? (
            <div className="text-6xl mb-4">🎉</div>
          ) : (
            <div className="text-6xl mb-4">📚</div>
          )}
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {passed ? 'Great Job!' : 'Keep Practicing!'}
          </h2>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {percentage}%
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            {correctAnswers} out of {totalQuestions} correct
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Reading Comprehension
            </div>
            <div className={`text-2xl font-bold ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
              {passed ? 'Passed' : 'Review Recommended'}
            </div>
          </div>
        </div>

        <button
          onClick={handleFinish}
          className="btn-primary px-8 py-3"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

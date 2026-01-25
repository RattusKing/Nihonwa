import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { GrammarPattern } from '../types';
import GrammarExerciseComponent from './exercises/GrammarExercise';
import { toRomaji } from '../utils/romaji';

interface GrammarPracticeFlowProps {
  pattern: GrammarPattern;
  onComplete: () => void;
}

export default function GrammarPracticeFlow({ pattern, onComplete }: GrammarPracticeFlowProps) {
  const { user, updateProgress, recalculateJLPTScore } = useStore();
  const [stage, setStage] = useState<'study' | 'practice' | 'results'>('study');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handleStartPractice = () => {
    setStage('practice');
  };

  const handleAnswer = (correct: boolean) => {
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    // Move to next exercise or show results
    if (currentExerciseIndex < pattern.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      showResults();
    }
  };

  const showResults = () => {
    setStage('results');

    const correctAnswers = score.correct + 1; // +1 for last question
    const totalQuestions = score.total + 1;
    const percentage = (correctAnswers / totalQuestions) * 100;
    const passed = percentage >= 80; // 80% to master a pattern

    // Update progress
    if (user && passed && !pattern.mastered) {
      const currentProgress = useStore.getState().progress.find(p => p.level === pattern.level);
      if (currentProgress) {
        const newGrammarMastered = (currentProgress.grammarPatternsMastered || 0) + 1;

        // Calculate grammar skill percentage
        // For N5: 10 patterns total (can be adjusted per level)
        const totalPatterns = 10; // This should ideally come from level info
        const grammarSkillPercentage = Math.min(100, (newGrammarMastered / totalPatterns) * 100);

        updateProgress(pattern.level, {
          ...currentProgress,
          grammarPatternsMastered: newGrammarMastered,
          skills: {
            ...currentProgress.skills,
            grammar: grammarSkillPercentage,
          },
        });

        // Mark pattern as mastered (this would need to be stored somewhere)
        // For now, this is handled in the grammar data itself

        // Recalculate JLPT score to include this grammar result
        recalculateJLPTScore(pattern.level);
      }
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  if (stage === 'study') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card">
          {/* Pattern Header */}
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              {pattern.level} Grammar Pattern
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {pattern.pattern}
            </h1>
            <div className="text-2xl text-n4 font-medium">
              {pattern.meaning}
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Explanation
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {pattern.explanation}
            </p>
          </div>

          {/* Examples */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Examples
            </h3>
            <div className="space-y-4">
              {pattern.examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {example.japanese}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    ({toRomaji(example.japanese)})
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    {example.english}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Info */}
          <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <div className="text-2xl mr-3">💡</div>
              <div>
                <div className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                  Ready to Practice?
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  You'll answer {pattern.exercises.length} fill-in-the-blank questions to test your understanding.
                  Get 80% or more correct to master this pattern!
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStartPractice}
              className="btn-primary px-8 py-3 text-lg"
            >
              Start Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'practice') {
    const currentExercise = pattern.exercises[currentExerciseIndex];
    return (
      <div>
        <div className="mb-4 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {pattern.pattern}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Exercise {currentExerciseIndex + 1} of {pattern.exercises.length}
          </div>
        </div>
        <GrammarExerciseComponent
          exercise={currentExercise}
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
            <div className="text-6xl mb-4">📝</div>
          )}
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {passed ? 'Pattern Mastered!' : 'Keep Practicing!'}
          </h2>
          <div className="text-lg text-gray-600 dark:text-gray-400">
            {pattern.pattern}
          </div>
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
              Grammar Practice
            </div>
            <div className={`text-2xl font-bold ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
              {passed ? 'Mastered' : 'Review Recommended'}
            </div>
          </div>
        </div>

        {!passed && (
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6 text-left">
            <div className="font-bold text-gray-800 dark:text-gray-100 mb-2">
              💡 Study Tip
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Review the examples and explanation, then try practicing again to master this pattern!
            </div>
          </div>
        )}

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

import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getVocabularyByLevel } from '../utils/db';
import { generateExercises } from '../types/lesson';
import type { Exercise, Lesson } from '../types/lesson';
import MultipleChoiceExercise from './exercises/MultipleChoiceExercise';
import TypeAnswerExercise from './exercises/TypeAnswerExercise';

interface LessonFlowProps {
  lesson: Lesson;
  onComplete: () => void;
}

export default function LessonFlow({ lesson, onComplete }: LessonFlowProps) {
  const { addXP, updateLessonProgress } = useStore();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadExercises();
  }, [lesson]);

  const loadExercises = async () => {
    try {
      // Get all vocabulary for this level (for generating wrong answers)
      const allVocab = await getVocabularyByLevel(lesson.level);

      // Get vocabulary for this lesson
      const lessonVocab = allVocab.filter((v) => lesson.vocabularyIds.includes(v.id));

      // Generate mixed exercises
      const generatedExercises = generateExercises(lessonVocab, allVocab);

      setExercises(generatedExercises);
    } catch (error) {
      console.error('Error loading exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (correct: boolean) => {
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    // Move to next exercise or show results
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      showLessonResults();
    }
  };

  const showLessonResults = () => {
    setShowResults(true);

    // Calculate XP based on score
    const percentage = ((score.correct + 1) / (score.total + 1)) * 100; // +1 for last question
    const xp = Math.round(percentage * 10); // Max 1000 XP per lesson

    // Add XP
    addXP(xp);

    // Update lesson progress
    updateLessonProgress(lesson.id, {
      lessonId: lesson.id,
      completed: percentage >= 70, // 70% pass rate
      xp,
      completedAt: new Date(),
      score: Math.round(percentage),
    });
  };

  const handleContinue = () => {
    onComplete();
  };

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-600">Loading lesson...</div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          No exercises available
        </h2>
        <p className="text-gray-600 mb-6">
          This lesson doesn't have any exercises yet.
        </p>
        <button onClick={onComplete} className="btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  // Results Screen
  if (showResults) {
    const finalScore = ((score.correct + 1) / (score.total + 1)) * 100;
    const passed = finalScore >= 70;
    const xp = Math.round(finalScore * 10);

    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          {/* Success Animation */}
          <div className="text-8xl mb-6 animate-bounce">
            {passed ? '🎉' : '📚'}
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {passed ? 'Lesson Complete!' : 'Keep Practicing!'}
          </h1>

          <div className="text-xl text-gray-600 mb-8">
            {lesson.title}
          </div>

          {/* Score */}
          <div className="bg-gradient-to-r from-n4-light to-n4 text-white rounded-xl p-8 mb-6">
            <div className="text-6xl font-bold mb-2">
              {Math.round(finalScore)}%
            </div>
            <div className="text-xl">
              {score.correct + 1} / {score.total + 1} correct
            </div>
          </div>

          {/* XP Earned */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 mb-6">
            <div className="text-3xl font-bold text-yellow-700 mb-1">
              +{xp} XP
            </div>
            <div className="text-yellow-600">Experience Points Earned</div>
          </div>

          {/* Message */}
          <div className="mb-8 text-gray-700">
            {passed ? (
              <p>
                Great job! You've mastered this lesson. Keep up the momentum!
              </p>
            ) : (
              <p>
                You got {Math.round(finalScore)}%. Try to get 70% or higher to pass. Don't give up!
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            {!passed && (
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setScore({ correct: 0, total: 0 });
                  setShowResults(false);
                }}
                className="px-8 py-3 bg-n4 hover:bg-n4-dark text-white font-semibold rounded-lg"
              >
                Try Again
              </button>
            )}
            <button
              onClick={handleContinue}
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg"
            >
              {passed ? 'Continue' : 'Back to Lessons'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exercise Screen
  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex + 1) / exercises.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onComplete}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Exit Lesson
          </button>
          <div className="text-sm text-gray-600">
            Question {currentIndex + 1} of {exercises.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-n5 via-n4 to-n3 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Exercise */}
      {currentExercise.type === 'multiple-choice-jp' || currentExercise.type === 'multiple-choice-en' ? (
        <MultipleChoiceExercise
          exercise={currentExercise}
          onAnswer={handleAnswer}
        />
      ) : currentExercise.type === 'type-answer' ? (
        <TypeAnswerExercise
          exercise={currentExercise}
          onAnswer={handleAnswer}
        />
      ) : null}

      {/* Score Display */}
      <div className="text-center text-sm text-gray-500">
        Current Score: {score.correct} / {score.total} correct
      </div>
    </div>
  );
}

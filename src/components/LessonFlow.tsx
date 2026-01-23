import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getVocabularyByLevel } from '../utils/db';
import { generateExercises } from '../types/lesson';
import type { Exercise, Lesson } from '../types/lesson';
import MultipleChoiceExercise from './exercises/MultipleChoiceExercise';
import { calculateLessonScore, JLPT_REQUIREMENTS } from '../utils/jlptScoring';
import { JLPT_LEVEL_INFO } from '../utils/jlptHelpers';

interface LessonFlowProps {
  lesson: Lesson;
  onComplete: () => void;
}

export default function LessonFlow({ lesson, onComplete }: LessonFlowProps) {
  const { updateLessonProgress, recalculateJLPTScore, updateProgress, progress: levelProgress, lessonProgress } = useStore();
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

    // Calculate JLPT-style score
    const correctAnswers = score.correct + 1; // +1 for last question
    const totalQuestions = score.total + 1;

    // For now, all lessons are vocabulary/grammar (Language Knowledge section)
    // TODO: Add reading and listening lessons later
    const sectionType = 'languageKnowledge';

    // Calculate scaled JLPT score for this lesson
    const sectionScore = calculateLessonScore(
      correctAnswers,
      totalQuestions,
      sectionType,
      lesson.level
    );

    // Get requirements for this level
    const requirements = JLPT_REQUIREMENTS[lesson.level];
    const sectionMinimum = !requirements.hasSeparateReading
      ? requirements.sectionMinimum * 2 // N4-N5: 38/120
      : requirements.sectionMinimum; // N1-N3: 19/60

    // Determine if passed (meets minimum for section)
    const passed = sectionScore >= sectionMinimum;

    // Check if this lesson was already completed
    const previousProgress = lessonProgress.find(lp => lp.lessonId === lesson.id);
    const wasAlreadyCompleted = previousProgress?.completed || false;

    // Update lesson progress with JLPT scoring
    updateLessonProgress(lesson.id, {
      lessonId: lesson.id,
      completed: passed,
      sectionType,
      sectionScore,
      correctAnswers,
      totalQuestions,
      completedAt: new Date(),
      // Keep old fields for backwards compatibility
      score: Math.round((correctAnswers / totalQuestions) * 100),
      xp: Math.round((correctAnswers / totalQuestions) * 1000),
    });

    // Update level progress if lesson was passed for the first time
    if (passed && !wasAlreadyCompleted) {
      const currentProgress = levelProgress.find(p => p.level === lesson.level);
      const levelInfo = JLPT_LEVEL_INFO[lesson.level];

      // Calculate new mastered count
      const vocabInLesson = lesson.vocabularyIds.length;
      const newVocabularyMastered = (currentProgress?.vocabularyMastered || 0) + vocabInLesson;

      // Calculate vocabulary skill percentage
      const vocabPercentage = Math.min(100, Math.round((newVocabularyMastered / levelInfo.vocabulary) * 100));

      // Update progress with new vocabulary count and percentage
      updateProgress(lesson.level, {
        vocabularyMastered: newVocabularyMastered,
        skills: {
          vocabulary: vocabPercentage,
          kanji: currentProgress?.skills.kanji || 0,
          grammar: currentProgress?.skills.grammar || 0,
          reading: currentProgress?.skills.reading || 0,
        },
      });
    }

    // Recalculate estimated JLPT score for this level
    recalculateJLPTScore(lesson.level);
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
    const correctAnswers = score.correct + 1;
    const totalQuestions = score.total + 1;
    const percentage = (correctAnswers / totalQuestions) * 100;

    // Calculate JLPT score
    const sectionType = 'languageKnowledge';
    const sectionScore = calculateLessonScore(
      correctAnswers,
      totalQuestions,
      sectionType,
      lesson.level
    );

    // Get requirements
    const requirements = JLPT_REQUIREMENTS[lesson.level];
    const sectionMaxScore = !requirements.hasSeparateReading ? 120 : 60;
    const sectionMinimum = !requirements.hasSeparateReading
      ? requirements.sectionMinimum * 2
      : requirements.sectionMinimum;

    const passed = sectionScore >= sectionMinimum;

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

          {/* JLPT Score */}
          <div className="bg-gradient-to-r from-n4-light to-n4 text-white rounded-xl p-8 mb-6">
            <div className="text-sm uppercase tracking-wide mb-2 opacity-90">
              JLPT {lesson.level} - Language Knowledge
            </div>
            <div className="text-6xl font-bold mb-2">
              {sectionScore}<span className="text-3xl">/{sectionMaxScore}</span>
            </div>
            <div className="text-xl mb-3">
              {correctAnswers} / {totalQuestions} correct ({Math.round(percentage)}%)
            </div>
            <div className="text-sm opacity-90">
              Minimum to pass: {sectionMinimum}/{sectionMaxScore}
            </div>
          </div>

          {/* Pass/Fail Status */}
          <div className={`border-2 rounded-lg p-6 mb-6 ${
            passed
              ? 'bg-green-50 border-green-300'
              : 'bg-orange-50 border-orange-300'
          }`}>
            <div className={`text-3xl font-bold mb-1 ${
              passed ? 'text-green-700' : 'text-orange-700'
            }`}>
              {passed ? '✓ PASSED' : '✗ BELOW MINIMUM'}
            </div>
            <div className={passed ? 'text-green-600' : 'text-orange-600'}>
              {passed
                ? 'Your score meets JLPT standards for this section'
                : `You need ${sectionMinimum - sectionScore} more points to meet the minimum`
              }
            </div>
          </div>

          {/* Message */}
          <div className="mb-8 text-gray-700">
            {passed ? (
              <p>
                Excellent work! Your performance meets JLPT standards. Keep building your skills!
              </p>
            ) : (
              <p>
                Keep practicing! Focus on understanding the material deeply to improve your score.
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
      <MultipleChoiceExercise
        exercise={currentExercise}
        onAnswer={handleAnswer}
      />

      {/* Score Display */}
      <div className="text-center text-sm text-gray-500">
        Current Score: {score.correct} / {score.total} correct
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getVocabularyByLevel } from '../utils/db';
import { organizeVocabularyIntoLessons } from '../types/lesson';
import type { Lesson } from '../types/lesson';
import type { VocabularyItem } from '../types';
import LessonFlow from '../components/LessonFlow';

export default function VocabularyNew() {
  const { user, lessonProgress, totalXP } = useStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, [user]);

  const loadLessons = async () => {
    if (!user) return;

    try {
      const vocab = await getVocabularyByLevel(user.currentLevel);
      setVocabulary(vocab);

      // Organize vocabulary into lessons
      const organizedLessons = organizeVocabularyIntoLessons(vocab);

      // Unlock lessons based on progress
      const updatedLessons = organizedLessons.map((lesson, index) => {
        if (index === 0) {
          return { ...lesson, locked: false }; // First lesson always unlocked
        }

        // Check if previous lesson is completed
        const previousLesson = organizedLessons[index - 1];
        const previousProgress = lessonProgress.find((p) => p.lessonId === previousLesson.id);
        const previousCompleted = previousProgress?.completed || false;

        return {
          ...lesson,
          locked: !previousCompleted,
        };
      });

      setLessons(updatedLessons);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = () => {
    setSelectedLesson(null);
    loadLessons(); // Reload to update unlock status
  };

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-600">Loading lessons...</div>
      </div>
    );
  }

  // If a lesson is selected, show the lesson flow
  if (selectedLesson) {
    return (
      <LessonFlow
        lesson={selectedLesson}
        onComplete={handleLessonComplete}
      />
    );
  }

  // Lesson Selection Screen
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Vocabulary Lessons</h1>
          <p className="text-gray-600 dark:text-gray-400">Master {user?.currentLevel} vocabulary step by step</p>
        </div>

        {/* XP Display */}
        <div className="card bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
          <div className="text-3xl font-bold">{totalXP}</div>
          <div className="text-sm">Total XP</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-n5 bg-opacity-10 border-2 border-n5">
          <div className="text-3xl font-bold text-n5">{lessons.length}</div>
          <div className="text-gray-700 dark:text-gray-300 text-sm">Total Lessons</div>
        </div>
        <div className="card bg-n4 bg-opacity-10 border-2 border-n4">
          <div className="text-3xl font-bold text-n4">
            {lessonProgress.filter((p) => p.completed).length}
          </div>
          <div className="text-gray-700 dark:text-gray-300 text-sm">Completed</div>
        </div>
        <div className="card bg-n3 bg-opacity-10 border-2 border-n3">
          <div className="text-3xl font-bold text-n3">{vocabulary.length}</div>
          <div className="text-gray-700 dark:text-gray-300 text-sm">Total Words</div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Choose a Lesson</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => {
            const progress = lessonProgress.find((p) => p.lessonId === lesson.id);
            const isCompleted = progress?.completed || false;
            const score = progress?.score;

            return (
              <button
                key={lesson.id}
                onClick={() => !lesson.locked && setSelectedLesson(lesson)}
                disabled={lesson.locked}
                className={`card text-left transition-all ${
                  lesson.locked
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-105 hover:shadow-xl cursor-pointer'
                } ${
                  isCompleted
                    ? 'border-2 border-green-500 bg-green-50'
                    : ''
                }`}
              >
                {/* Lesson Number & Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`badge-${lesson.level.toLowerCase()}`}>
                    Lesson {lesson.order}
                  </div>
                  {lesson.locked && (
                    <span className="text-2xl">🔒</span>
                  )}
                  {isCompleted && (
                    <span className="text-2xl">✅</span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {lesson.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {lesson.description}
                </p>

                {/* Vocabulary Count */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>📝</span>
                  <span>{lesson.vocabularyIds.length} words</span>
                </div>

                {/* Score (if completed) */}
                {isCompleted && score !== undefined && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Best Score: <span className="font-bold text-green-600">{score}%</span>
                    </div>
                  </div>
                )}

                {/* XP Display */}
                {progress && progress.xp && progress.xp > 0 && (
                  <div className="mt-2 text-xs text-yellow-600">
                    +{progress.xp} XP earned
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {lessons.length === 0 && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No lessons available yet
            </h2>
            <p className="text-gray-600 mb-6">
              Vocabulary for {user?.currentLevel} is being loaded. Please refresh the page.
            </p>
          </div>
        )}
      </div>

      {/* How it Works */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">🎓 How Lessons Work</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Complete lessons in order to unlock the next one</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Each lesson has mixed exercises: multiple choice, typing, and more</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Earn XP for correct answers and completing lessons</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Get 70% or higher to pass and unlock the next lesson</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Retake lessons anytime to improve your score</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

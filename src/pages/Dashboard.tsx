import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { JLPT_LEVEL_INFO, JLPT_LEVELS } from '../utils/jlptHelpers';
import { JLPT_REQUIREMENTS, getSectionName, getSectionMaxScore } from '../utils/jlptScoring';
import type { JLPTLevel } from '../types';

export default function Dashboard() {
  const { user, progress, lessonProgress, totalXP, setUser } = useStore();

  if (!user) return null;

  const currentProgress = progress.find((p) => p.level === user.currentLevel);

  // Calculate level completion progress
  const completedLessons = lessonProgress.filter(lp => lp.completed).length;
  const totalLessons = lessonProgress.length;
  const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Determine if user can advance to next level
  // Requirements: 80% of lessons completed AND at least 5000 XP
  const canAdvance = completionRate >= 80 && totalXP >= 5000;
  const currentLevelIndex = JLPT_LEVELS.indexOf(user.currentLevel);
  const nextLevel: JLPTLevel | null = currentLevelIndex < JLPT_LEVELS.length - 1
    ? JLPT_LEVELS[currentLevelIndex + 1]
    : null;

  const handleAdvanceLevel = () => {
    if (!nextLevel || !canAdvance) return;

    if (confirm(`Congratulations! You've completed ${user.currentLevel}. Advance to ${nextLevel}?`)) {
      setUser({ ...user, currentLevel: nextLevel });
    }
  };

  const learningModes = [
    {
      title: 'Vocabulary Builder',
      description: 'Master essential words with spaced repetition',
      icon: '📝',
      path: '/vocabulary',
      color: 'bg-n5',
    },
    {
      title: 'Kanji Dojo',
      description: 'Learn kanji characters step by step',
      icon: '漢',
      path: '/kanji',
      color: 'bg-n4',
    },
    {
      title: 'Grammar Lessons',
      description: 'Understand Japanese grammar patterns',
      icon: '📖',
      path: '/grammar',
      color: 'bg-n3',
    },
    {
      title: 'Reading Practice',
      description: 'Read graded content at your level',
      icon: '📰',
      path: '/reading',
      color: 'bg-n2',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-n4 to-n4-dark text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-lg opacity-90">
          Continue your journey to {JLPT_LEVEL_INFO[user.currentLevel].name}
        </p>
      </div>

      {/* Level Advancement Banner */}
      {canAdvance && nextLevel && (
        <div className="card bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold mb-2">🎉 Ready to Level Up!</div>
              <p className="text-lg opacity-90 mb-1">
                You've completed {completedLessons} lessons and earned {totalXP} XP!
              </p>
              <p className="opacity-80">
                Advance from {user.currentLevel} to {nextLevel} and unlock new content!
              </p>
            </div>
            <button
              onClick={handleAdvanceLevel}
              className="px-6 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Advance to {nextLevel}
            </button>
          </div>
        </div>
      )}

      {/* Progress Toward Next Level */}
      {!canAdvance && nextLevel && (
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Progress to {nextLevel}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete requirements to advance to the next level
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Lesson Completion */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 dark:text-gray-300">
                  Lessons Completed (need 80%)
                </span>
                <span className={`font-bold ${completionRate >= 80 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`}>
                  {completedLessons}/{totalLessons} ({Math.round(completionRate)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${completionRate >= 80 ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(completionRate, 100)}%` }}
                />
              </div>
            </div>

            {/* XP Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 dark:text-gray-300">
                  Total XP (need 5,000)
                </span>
                <span className={`font-bold ${totalXP >= 5000 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`}>
                  {totalXP.toLocaleString()} XP
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${totalXP >= 5000 ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: `${Math.min((totalXP / 5000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JLPT Score Overview */}
      {currentProgress?.estimatedJLPTScore && (
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your Estimated JLPT {user.currentLevel} Score</h2>
              <p className="text-sm text-gray-600 mt-1">
                Based on your completed lessons and performance
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-lg font-bold ${
              currentProgress.estimatedJLPTScore.passed
                ? 'bg-green-500 text-white'
                : 'bg-orange-500 text-white'
            }`}>
              {currentProgress.estimatedJLPTScore.passed ? '✓ PASS LEVEL' : 'IN PROGRESS'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Score */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Total Score</div>
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {currentProgress.estimatedJLPTScore.total}
                  <span className="text-2xl text-gray-400">/180</span>
                </div>
                <div className="text-sm text-gray-600">
                  Pass mark: {JLPT_REQUIREMENTS[user.currentLevel].totalPassMark}/180
                </div>
                {!currentProgress.estimatedJLPTScore.passed && (
                  <div className="mt-2 text-sm font-semibold text-orange-600">
                    {JLPT_REQUIREMENTS[user.currentLevel].totalPassMark - currentProgress.estimatedJLPTScore.total} points needed to pass
                  </div>
                )}
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-sm font-bold text-gray-700 mb-3">Section Scores</div>
              <div className="space-y-3">
                {/* Language Knowledge */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      {getSectionName('languageKnowledge', user.currentLevel)}
                    </span>
                    <span className="font-bold text-gray-800">
                      {currentProgress.estimatedJLPTScore.languageKnowledge}/{getSectionMaxScore('languageKnowledge', user.currentLevel)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-n5 h-2 rounded-full"
                      style={{
                        width: `${(currentProgress.estimatedJLPTScore.languageKnowledge / getSectionMaxScore('languageKnowledge', user.currentLevel)) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Reading (N1-N3 only) */}
                {JLPT_REQUIREMENTS[user.currentLevel].hasSeparateReading && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Reading</span>
                      <span className="font-bold text-gray-800">
                        {currentProgress.estimatedJLPTScore.reading}/60
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-n3 h-2 rounded-full"
                        style={{ width: `${(currentProgress.estimatedJLPTScore.reading / 60) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Listening */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Listening</span>
                    <span className="font-bold text-gray-400">
                      {currentProgress.estimatedJLPTScore.listening}/60 (No lessons yet)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-400 h-2 rounded-full"
                      style={{ width: `${(currentProgress.estimatedJLPTScore.listening / 60) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/progress"
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
            >
              View Detailed Progress →
            </Link>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-n5 bg-opacity-10 border-2 border-n5">
          <div className="text-3xl font-bold text-n5">
            {currentProgress?.vocabularyMastered || 0}
          </div>
          <div className="text-gray-700 dark:text-gray-300 font-medium">Vocabulary Mastered</div>
        </div>
        <div className="card bg-n4 bg-opacity-10 border-2 border-n4">
          <div className="text-3xl font-bold text-n4">
            {currentProgress?.kanjiMastered || 0}
          </div>
          <div className="text-gray-700 dark:text-gray-300 font-medium">Kanji Learned</div>
        </div>
        <div className="card bg-n3 bg-opacity-10 border-2 border-n3">
          <div className="text-3xl font-bold text-n3">
            {currentProgress?.grammarPatternsMastered || 0}
          </div>
          <div className="text-gray-700 dark:text-gray-300 font-medium">Grammar Patterns</div>
        </div>
        <div className="card bg-n2 bg-opacity-10 border-2 border-n2">
          <div className="text-3xl font-bold text-n2">
            {currentProgress?.articlesRead || 0}
          </div>
          <div className="text-gray-700 dark:text-gray-300 font-medium">Articles Read</div>
        </div>
      </div>

      {/* Learning Modes */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Learning Modes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningModes.map((mode) => (
            <Link
              key={mode.path}
              to={mode.path}
              className="card hover:scale-105 transition-transform"
            >
              <div className={`${mode.color} text-white w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4`}>
                {mode.icon}
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{mode.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{mode.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Immersion Zone CTA */}
      <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">🌍 Immersion Zone</h2>
            <p className="text-lg opacity-90 mb-4">
              Dive into real Japanese content with interactive tools
            </p>
            <Link
              to="/immersion"
              className="inline-block bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Start Exploring
            </Link>
          </div>
        </div>
      </div>

      {/* Content Manager Access (Admin) */}
      <div className="card border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Content Manager</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add and manage learning content</p>
          </div>
          <Link
            to="/content-manager"
            className="btn-secondary"
          >
            Manage Content
          </Link>
        </div>
      </div>
    </div>
  );
}

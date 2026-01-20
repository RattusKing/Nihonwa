import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { JLPT_LEVEL_INFO } from '../utils/jlptHelpers';

export default function Dashboard() {
  const { user, progress } = useStore();

  if (!user) return null;

  const currentProgress = progress.find((p) => p.level === user.currentLevel);

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
        <h1 className="text-3xl font-bold mb-2">Welcome back to Nihonwa!</h1>
        <p className="text-lg opacity-90">
          Continue your journey to {JLPT_LEVEL_INFO[user.currentLevel].name}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-n5 bg-opacity-10 border-2 border-n5">
          <div className="text-3xl font-bold text-n5">
            {currentProgress?.vocabularyMastered || 0}
          </div>
          <div className="text-gray-700 font-medium">Vocabulary Mastered</div>
        </div>
        <div className="card bg-n4 bg-opacity-10 border-2 border-n4">
          <div className="text-3xl font-bold text-n4">
            {currentProgress?.kanjiMastered || 0}
          </div>
          <div className="text-gray-700 font-medium">Kanji Learned</div>
        </div>
        <div className="card bg-n3 bg-opacity-10 border-2 border-n3">
          <div className="text-3xl font-bold text-n3">
            {currentProgress?.grammarPatternsMastered || 0}
          </div>
          <div className="text-gray-700 font-medium">Grammar Patterns</div>
        </div>
        <div className="card bg-n2 bg-opacity-10 border-2 border-n2">
          <div className="text-3xl font-bold text-n2">
            {currentProgress?.articlesRead || 0}
          </div>
          <div className="text-gray-700 font-medium">Articles Read</div>
        </div>
      </div>

      {/* Learning Modes */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Learning Modes</h2>
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
              <h3 className="font-semibold text-gray-800 mb-2">{mode.title}</h3>
              <p className="text-sm text-gray-600">{mode.description}</p>
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
      <div className="card border-2 border-dashed border-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Content Manager</h3>
            <p className="text-sm text-gray-600">Add and manage learning content</p>
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

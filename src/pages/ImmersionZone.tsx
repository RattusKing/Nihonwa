import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { getAllContent } from '../utils/db';
import { JLPT_LEVELS, JLPT_LEVEL_INFO } from '../utils/jlptHelpers';
import type { Content, JLPTLevel } from '../types';

export default function ImmersionZone() {
  const { user } = useStore();
  const [content, setContent] = useState<Content[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'ALL'>(user?.currentLevel || 'ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const allContent = await getAllContent();
      setContent(allContent);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = selectedLevel === 'ALL'
    ? content
    : content.filter((c) => c.level === selectedLevel);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🌍 Immersion Zone</h1>
        <p className="text-gray-600">Dive into real Japanese content with interactive tools</p>
      </div>

      {/* Level Filter */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-3">Filter by Level</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedLevel('ALL')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedLevel === 'ALL'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Levels
          </button>
          {JLPT_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedLevel === level
                  ? `bg-${JLPT_LEVEL_INFO[level].color} text-white`
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Content Library */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Library</h2>

        {loading ? (
          <div className="card text-center py-12">
            <div className="text-gray-600">Loading content...</div>
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No content yet</h3>
            <p className="text-gray-600 mb-6">
              Head to the Content Manager to add your first article or lesson
            </p>
            <Link to="/content-manager" className="btn-primary">
              Add Content
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.map((item) => (
              <Link
                key={item.id}
                to={`/content/${item.id}`}
                className="card hover:scale-105 transition-transform"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`badge-${item.level.toLowerCase()}`}>
                    {item.level}
                  </span>
                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                    {item.source === 'ai-generated' && '🤖 AI'}
                    {item.source === 'curated' && '✓ Curated'}
                    {item.source === 'user-requested' && '👤 User'}
                    {item.source === 'external' && '🔗 External'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {item.content.substring(0, 100)}...
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <span>{item.vocabulary.length} vocab</span>
                  <span>•</span>
                  <span>{item.grammarPoints.length} grammar</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Content Analyzer Tool */}
      <div className="card bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <h2 className="text-2xl font-bold mb-2">🔍 Content Analyzer</h2>
        <p className="mb-4 opacity-90">
          Paste any Japanese text to instantly analyze difficulty, extract vocabulary, and create a custom lesson
        </p>
        <div className="text-sm opacity-75">Coming soon</div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { getAllContent } from '../utils/db';
import type { Content } from '../types';
import { toRomaji } from '../utils/romaji';

export default function ContentReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { difficultySettings, setDifficultySettings } = useStore();
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    loadContent();
  }, [id]);

  const loadContent = async () => {
    try {
      const allContent = await getAllContent();
      const found = allContent.find((c) => c.id === id);
      if (found) {
        setContent(found);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  if (!content) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate('/immersion')}
            className="text-n4 hover:text-n4-dark mb-2 flex items-center gap-2"
          >
            ← Back to Immersion Zone
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{content.title}</h1>
          <div className="flex items-center gap-3">
            <span className={`badge-${content.level.toLowerCase()}`}>
              {content.level}
            </span>
            <span className="text-sm text-gray-500">
              {content.source === 'ai-generated' && '🤖 AI Generated'}
              {content.source === 'curated' && '✓ Curated Content'}
              {content.source === 'user-requested' && '👤 User Requested'}
              {content.source === 'external' && '🔗 External Source'}
            </span>
          </div>
        </div>
      </div>

      {/* Difficulty Dial */}
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          🎚️ Difficulty Dial
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={difficultySettings.showFurigana}
              onChange={(e) =>
                setDifficultySettings({ showFurigana: e.target.checked })
              }
              className="w-5 h-5 text-n4 rounded"
            />
            <span className="text-sm font-medium">Furigana</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={difficultySettings.showRomaji}
              onChange={(e) =>
                setDifficultySettings({ showRomaji: e.target.checked })
              }
              className="w-5 h-5 text-n4 rounded"
            />
            <span className="text-sm font-medium">Romaji</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={difficultySettings.showEnglish}
              onChange={(e) =>
                setDifficultySettings({ showEnglish: e.target.checked })
              }
              className="w-5 h-5 text-n4 rounded"
            />
            <span className="text-sm font-medium">English</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={difficultySettings.showGrammarNotes}
              onChange={(e) =>
                setDifficultySettings({ showGrammarNotes: e.target.checked })
              }
              className="w-5 h-5 text-n4 rounded"
            />
            <span className="text-sm font-medium">Grammar Notes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={difficultySettings.highlightUnknownWords}
              onChange={(e) =>
                setDifficultySettings({ highlightUnknownWords: e.target.checked })
              }
              className="w-5 h-5 text-n4 rounded"
            />
            <span className="text-sm font-medium">Highlight Unknown</span>
          </label>
        </div>
      </div>

      {/* Content */}
      <div className="card">
        <div className="prose prose-lg max-w-none">
          <div className="text-lg leading-relaxed whitespace-pre-wrap">
            {content.content}
          </div>
        </div>
      </div>

      {/* Vocabulary List */}
      {content.vocabulary.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Vocabulary ({content.vocabulary.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {content.vocabulary.map((vocab) => (
              <div
                key={vocab.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-lg font-bold text-gray-800">{vocab.word}</span>
                    <span className="text-sm text-gray-600 ml-2">{vocab.reading}</span>
                    <span className="text-xs text-gray-500 ml-2">({toRomaji(vocab.reading)})</span>
                  </div>
                  <span className={`badge-${vocab.level.toLowerCase()} text-xs`}>
                    {vocab.level}
                  </span>
                </div>
                <div className="text-sm text-gray-700">{vocab.meaning}</div>
                <div className="text-xs text-gray-500 mt-1">{vocab.partOfSpeech}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grammar Points */}
      {content.grammarPoints.length > 0 && difficultySettings.showGrammarNotes && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Grammar Points ({content.grammarPoints.length})
          </h2>
          <div className="space-y-2">
            {content.grammarPoints.map((point, index) => (
              <div key={index} className="p-3 bg-n3 bg-opacity-10 rounded-lg">
                <span className="font-medium text-gray-800">{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

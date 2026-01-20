import { useState, useEffect } from 'react';
import { addContent, getAllContent, deleteContent } from '../utils/db';
import { JLPT_LEVELS } from '../utils/jlptHelpers';
import type { Content, JLPTLevel, ContentSource } from '../types';

export default function ContentManager() {
  const [contents, setContents] = useState<Content[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    level: 'N5' as JLPTLevel,
    type: 'article' as Content['type'],
    source: 'curated' as ContentSource,
    content: '',
    vocabularyText: '',
    grammarPointsText: '',
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const allContent = await getAllContent();
    setContents(allContent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse vocabulary (format: word|reading|meaning|level|partOfSpeech, one per line)
    const vocabulary = formData.vocabularyText
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        const [word, reading, meaning, level, partOfSpeech] = line.split('|').map((s) => s.trim());
        return {
          id: crypto.randomUUID(),
          word,
          reading,
          meaning,
          level: (level as JLPTLevel) || formData.level,
          partOfSpeech: partOfSpeech || 'noun',
          examples: [],
          mastered: false,
        };
      });

    // Parse grammar points (one per line)
    const grammarPoints = formData.grammarPointsText
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.trim());

    const newContent: Content = {
      id: crypto.randomUUID(),
      title: formData.title,
      level: formData.level,
      type: formData.type,
      source: formData.source,
      content: formData.content,
      vocabulary,
      grammarPoints,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await addContent(newContent);
    await loadContent();
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      level: 'N5',
      type: 'article',
      source: 'curated',
      content: '',
      vocabularyText: '',
      grammarPointsText: '',
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      await deleteContent(id);
      await loadContent();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Content Manager</h1>
          <p className="text-gray-600">Add and manage learning content</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Content'}
        </button>
      </div>

      {/* Add Content Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Content</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-n4 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  JLPT Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as JLPTLevel })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-n4 focus:border-transparent"
                >
                  {JLPT_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Content['type'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-n4 focus:border-transparent"
                >
                  <option value="article">Article</option>
                  <option value="lesson">Lesson</option>
                  <option value="exercise">Exercise</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value as ContentSource })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-n4 focus:border-transparent"
                >
                  <option value="curated">Curated</option>
                  <option value="ai-generated">AI Generated</option>
                  <option value="user-requested">User Requested</option>
                  <option value="external">External</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (Japanese Text)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-n4 focus:border-transparent"
                rows={10}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vocabulary (one per line: word|reading|meaning|level|partOfSpeech)
              </label>
              <textarea
                value={formData.vocabularyText}
                onChange={(e) => setFormData({ ...formData, vocabularyText: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-n4 focus:border-transparent font-mono text-sm"
                rows={5}
                placeholder="例|れい|example|N5|noun"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grammar Points (one per line)
              </label>
              <textarea
                value={formData.grammarPointsText}
                onChange={(e) => setFormData({ ...formData, grammarPointsText: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-n4 focus:border-transparent"
                rows={3}
                placeholder="です/ます form&#10;は particle (topic marker)"
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                Save Content
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content List */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Existing Content ({contents.length})
        </h2>

        {contents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No content yet. Click "Add Content" to create your first piece.
          </div>
        ) : (
          <div className="space-y-3">
            {contents.map((content) => (
              <div
                key={content.id}
                className="p-4 bg-gray-50 rounded-lg flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-800">{content.title}</h3>
                    <span className={`badge-${content.level.toLowerCase()}`}>
                      {content.level}
                    </span>
                    <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded">
                      {content.source === 'ai-generated' && '🤖 AI'}
                      {content.source === 'curated' && '✓ Curated'}
                      {content.source === 'user-requested' && '👤 User'}
                      {content.source === 'external' && '🔗 External'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {content.vocabulary.length} vocab • {content.grammarPoints.length} grammar points
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(content.id)}
                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

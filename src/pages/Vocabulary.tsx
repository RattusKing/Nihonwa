import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getVocabularyByLevel, updateVocabulary } from '../utils/db';
import { calculateNextReview, getQualityFromResponse, isDue } from '../utils/srs';
import Flashcard from '../components/Flashcard';
import type { VocabularyItem } from '../types';
import { toRomaji } from '../utils/romaji';

export default function Vocabulary() {
  const { user } = useStore();
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [currentCard, setCurrentCard] = useState<VocabularyItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, mastered: 0, due: 0, new: 0 });
  const [mode, setMode] = useState<'study' | 'browse'>('study');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadVocabulary();
  }, [user]);

  const loadVocabulary = async () => {
    if (!user) return;

    try {
      const vocab = await getVocabularyByLevel(user.currentLevel);
      setVocabulary(vocab);

      // Calculate stats
      const total = vocab.length;
      const mastered = vocab.filter((v) => v.mastered).length;
      const due = vocab.filter((v) => isDue(v.nextReview)).length;
      const newCards = vocab.filter((v) => !v.lastReviewed).length;

      setStats({ total, mastered, due, new: newCards });

      // Get first due card or first new card
      const dueCards = vocab.filter((v) => isDue(v.nextReview));
      if (dueCards.length > 0) {
        setCurrentCard(dueCards[0]);
      } else if (vocab.length > 0) {
        setCurrentCard(vocab[0]);
      }
    } catch (error) {
      console.error('Error loading vocabulary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (response: 'correct' | 'incorrect' | 'perfect') => {
    if (!currentCard) return;

    const quality = getQualityFromResponse(response);
    const { nextReview } = calculateNextReview(quality);

    // Update the card
    const updatedCard: VocabularyItem = {
      ...currentCard,
      mastered: response === 'perfect' || response === 'correct',
      lastReviewed: new Date(),
      nextReview,
    };

    await updateVocabulary(updatedCard);

    // Get next card
    await loadVocabulary();
  };

  const handleCorrect = () => handleResponse('correct');
  const handleIncorrect = () => handleResponse('incorrect');
  const handleSkip = async () => {
    // Move to next card without updating
    await loadVocabulary();
  };

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-600">Loading vocabulary...</div>
      </div>
    );
  }

  if (vocabulary.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Vocabulary Builder</h1>
          <p className="text-gray-600">Master essential words with spaced repetition</p>
        </div>

        <div className="card">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No vocabulary available yet
            </h2>
            <p className="text-gray-600 mb-6">
              Vocabulary for {user?.currentLevel} is being loaded. Please refresh the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Vocabulary Builder</h1>
        <p className="text-gray-600">Master essential words with spaced repetition</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-n5 bg-opacity-10 border-2 border-n5">
          <div className="text-3xl font-bold text-n5">{stats.total}</div>
          <div className="text-gray-700 text-sm">Total Words</div>
        </div>
        <div className="card bg-n4 bg-opacity-10 border-2 border-n4">
          <div className="text-3xl font-bold text-n4">{stats.due}</div>
          <div className="text-gray-700 text-sm">Due for Review</div>
        </div>
        <div className="card bg-n3 bg-opacity-10 border-2 border-n3">
          <div className="text-3xl font-bold text-n3">{stats.new}</div>
          <div className="text-gray-700 text-sm">New Cards</div>
        </div>
        <div className="card bg-n2 bg-opacity-10 border-2 border-n2">
          <div className="text-3xl font-bold text-n2">{stats.mastered}</div>
          <div className="text-gray-700 text-sm">Mastered</div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setMode('study')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            mode === 'study'
              ? 'bg-n4 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Study Mode
        </button>
        <button
          onClick={() => setMode('browse')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            mode === 'browse'
              ? 'bg-n4 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Browse All
        </button>
      </div>

      {/* Study Mode */}
      {mode === 'study' && currentCard && (
        <Flashcard
          vocab={currentCard}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
          onSkip={handleSkip}
        />
      )}

      {/* Study Mode - No cards due */}
      {mode === 'study' && !currentCard && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            All caught up!
          </h2>
          <p className="text-gray-600 mb-6">
            You've reviewed all due cards. Come back later for more practice!
          </p>
        </div>
      )}

      {/* Browse Mode */}
      {mode === 'browse' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              All Vocabulary ({vocabulary.length} words)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 20))}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg font-medium"
              >
                ← Previous
              </button>
              <button
                onClick={() => setCurrentIndex(Math.min(vocabulary.length - 1, currentIndex + 20))}
                disabled={currentIndex + 20 >= vocabulary.length}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg font-medium"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vocabulary.slice(currentIndex, currentIndex + 20).map((vocab) => (
              <div key={vocab.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className={`badge-${vocab.level.toLowerCase()}`}>{vocab.level}</div>
                  {vocab.mastered && <span className="text-green-500">✓</span>}
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{vocab.word}</div>
                <div className="text-sm text-gray-600 mb-1">{vocab.reading}</div>
                <div className="text-xs text-gray-500 mb-2">({toRomaji(vocab.reading)})</div>
                <div className="text-gray-700 mb-2">{vocab.meaning}</div>
                <div className="text-xs text-gray-500">{vocab.partOfSpeech}</div>
                {vocab.nextReview && (
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    Next review: {new Date(vocab.nextReview).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

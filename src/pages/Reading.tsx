import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { n5ReadingPassages, type ReadingPassage } from '../data/reading/n5-reading';
import { toRomaji } from '../utils/romaji';
import ReadingFlow from '../components/ReadingFlow';

export default function Reading() {
  const { user } = useStore();
  const [passages, setPassages] = useState<ReadingPassage[]>([]);
  const [selectedPassage, setSelectedPassage] = useState<ReadingPassage | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [inPracticeMode, setInPracticeMode] = useState(false);

  useEffect(() => {
    // Load reading passages based on user level
    if (user?.currentLevel === 'N5') {
      setPassages(n5ReadingPassages);
    }
    // Add more levels as data becomes available
  }, [user]);

  const handlePassageSelect = (passage: ReadingPassage) => {
    setSelectedPassage(passage);
    setShowTranslation(false);
    setInPracticeMode(false);
  };

  const handleStartPractice = () => {
    setInPracticeMode(true);
  };

  const handlePracticeComplete = () => {
    setInPracticeMode(false);
    setSelectedPassage(null);
  };

  // If in practice mode, show the ReadingFlow component
  if (selectedPassage && inPracticeMode) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setInPracticeMode(false)}
          className="text-n4 hover:text-n4-dark font-medium flex items-center gap-2"
        >
          ← Back to Reading
        </button>
        <ReadingFlow passage={selectedPassage} onComplete={handlePracticeComplete} />
      </div>
    );
  }

  if (selectedPassage) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedPassage(null)}
          className="text-n4 hover:text-n4-dark font-medium flex items-center gap-2"
        >
          ← Back to Passages
        </button>

        {/* Title */}
        <div>
          <div className={`badge-${selectedPassage.level.toLowerCase()} mb-3 inline-block`}>
            {selectedPassage.level}
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {selectedPassage.title}
          </h1>
          <div className="text-xl text-gray-600 dark:text-gray-400 mb-1">
            {selectedPassage.titleReading}
          </div>
          <div className="text-lg text-gray-500 dark:text-gray-500">
            ({toRomaji(selectedPassage.titleReading)})
          </div>
        </div>

        {/* Reading Content */}
        <div className="card">
          <div className="mb-4">
            <div className="text-2xl leading-relaxed text-gray-800 dark:text-gray-100 whitespace-pre-line mb-4">
              {selectedPassage.content}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400 whitespace-pre-line mb-4">
              {toRomaji(selectedPassage.content)}
            </div>
          </div>

          {/* Translation Toggle */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="btn-secondary w-full"
            >
              {showTranslation ? '🙈 Hide Translation' : '👁️ Show Translation'}
            </button>

            {showTranslation && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">English Translation</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {selectedPassage.translation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Vocabulary List */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Key Vocabulary ({selectedPassage.vocabularyList.length} words)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedPassage.vocabularyList.map((vocab, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex flex-col mb-2">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {vocab.word}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {vocab.reading}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    ({toRomaji(vocab.reading)})
                  </span>
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  {vocab.meaning}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Button */}
        <div className="card bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">Ready to Test Your Comprehension?</h3>
              <p className="text-blue-100">
                Answer {selectedPassage.comprehensionQuestions.length} questions about this passage
              </p>
            </div>
            <button
              onClick={handleStartPractice}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
            >
              Start Practice →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Reading Practice</h1>
        <p className="text-gray-600 dark:text-gray-400">Read graded content at your {user?.currentLevel} level</p>
      </div>

      {/* Passage List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passages.map((passage) => (
          <button
            key={passage.id}
            onClick={() => handlePassageSelect(passage)}
            className="card hover:scale-105 transition-transform cursor-pointer text-left"
          >
            <div className={`badge-${passage.level.toLowerCase()} mb-3 inline-block`}>
              {passage.level}
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {passage.title}
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {passage.titleReading}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              ({toRomaji(passage.titleReading)})
            </div>
            <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              📝 {passage.vocabularyList.length} vocabulary words
            </div>
          </button>
        ))}
      </div>

      {passages.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            No Reading Passages Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Reading passages for {user?.currentLevel} will be available soon
          </p>
        </div>
      )}
    </div>
  );
}

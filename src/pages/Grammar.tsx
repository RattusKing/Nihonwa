import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { n5GrammarPatterns } from '../data/grammar/n5-grammar';
import { toRomaji } from '../utils/romaji';
import type { GrammarPattern } from '../types';

export default function Grammar() {
  const { user } = useStore();
  const [patterns, setPatterns] = useState<GrammarPattern[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<GrammarPattern | null>(null);

  useEffect(() => {
    // Load grammar patterns based on user level
    if (user?.currentLevel === 'N5') {
      setPatterns(n5GrammarPatterns);
    }
    // Add more levels as data becomes available
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Grammar Patterns</h1>
        <p className="text-gray-600 dark:text-gray-400">Master essential {user?.currentLevel} grammar structures</p>
      </div>

      {/* Pattern List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            onClick={() => setSelectedPattern(pattern)}
            className="card hover:scale-105 transition-transform cursor-pointer text-left"
          >
            <div className={`badge-${pattern.level.toLowerCase()} mb-3 inline-block`}>
              {pattern.level}
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {pattern.pattern}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {pattern.meaning}
            </p>
          </button>
        ))}
      </div>

      {patterns.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            No Grammar Patterns Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Grammar patterns for {user?.currentLevel} will be available soon
          </p>
        </div>
      )}

      {/* Pattern Detail Modal */}
      {selectedPattern && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className={`badge-${selectedPattern.level.toLowerCase()} mb-2`}>
                    {selectedPattern.level}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {selectedPattern.pattern}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {selectedPattern.meaning}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPattern(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Explanation */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Explanation</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedPattern.explanation}</p>
              </div>

              {/* Examples */}
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 text-xl">Examples</h3>
                <div className="space-y-4">
                  {selectedPattern.examples.map((example, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="mb-3">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {example.japanese}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {toRomaji(example.japanese)}
                        </div>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">→</span>
                        <span>{example.english}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedPattern(null)}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

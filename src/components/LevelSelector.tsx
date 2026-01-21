import { useState } from 'react';
import { useStore } from '../store/useStore';
import { JLPT_LEVELS, JLPT_LEVEL_INFO } from '../utils/jlptHelpers';
import type { JLPTLevel } from '../types';

export default function LevelSelector() {
  const { setUser, setShowLevelSelector } = useStore();
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');

  const handleStart = () => {
    const newUser = {
      id: crypto.randomUUID(),
      name: 'User', // Default name
      currentLevel: selectedLevel,
      createdAt: new Date(),
      lastActive: new Date(),
    };
    setUser(newUser);
    setShowLevelSelector(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-n4-light via-n3-light to-n5-light flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-n4">日本話</span> Nihonwa
          </h1>
          <p className="text-xl text-gray-600">
            Your fully immersive Japanese learning journey
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Choose Your Starting Level
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Don't worry - you can always adjust this later and access content at any level
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {JLPT_LEVELS.map((level) => {
              const info = JLPT_LEVEL_INFO[level];
              const isSelected = selectedLevel === level;

              return (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    isSelected
                      ? `border-${info.color} bg-${info.color} bg-opacity-10 shadow-lg scale-105`
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className={`badge-${level.toLowerCase()} text-lg px-4 py-2`}>
                      {level}
                    </span>
                    <h3 className="font-semibold text-gray-800">{info.name}</h3>
                    <p className="text-sm text-gray-600 text-center">
                      {info.description}
                    </p>
                    <div className="text-xs text-gray-500 mt-2">
                      <div>{info.vocabulary} vocabulary</div>
                      <div>{info.kanji} kanji</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleStart}
            className="btn-primary text-lg px-12 py-4"
          >
            Start Learning
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold text-gray-800 mb-1">Learn at Your Pace</h3>
              <p className="text-sm text-gray-600">No pressure, no daily reminders</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎮</div>
              <h3 className="font-semibold text-gray-800 mb-1">Real Content, Game-like</h3>
              <p className="text-sm text-gray-600">Immerse yourself in authentic Japanese</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💾</div>
              <h3 className="font-semibold text-gray-800 mb-1">Works Offline</h3>
              <p className="text-sm text-gray-600">Study anywhere, anytime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

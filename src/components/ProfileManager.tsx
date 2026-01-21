import { useState } from 'react';
import { useStore } from '../store/useStore';
import { JLPT_LEVELS, JLPT_LEVEL_INFO } from '../utils/jlptHelpers';
import type { JLPTLevel, UserProfile } from '../types';

export default function ProfileManager() {
  const { allProfiles, setUser, createProfile, setShowLevelSelector } = useStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');

  const handleCreateProfile = () => {
    if (!profileName.trim()) {
      alert('Please enter a profile name');
      return;
    }

    const newProfile: UserProfile = {
      id: `profile-${Date.now()}`,
      name: profileName.trim(),
      currentLevel: selectedLevel,
      createdAt: new Date(),
      lastActive: new Date(),
    };

    console.log('Creating new profile:', newProfile);
    createProfile(newProfile);
    console.log('Setting user to new profile');
    setUser(newProfile);
    setShowLevelSelector(false);
  };

  const handleSelectProfile = (profile: UserProfile) => {
    setUser(profile);
    setShowLevelSelector(false);
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-n5 via-n4 to-n3 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <button
            onClick={() => setShowCreateForm(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Create Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Set up your Japanese learning journey</p>

          {/* Profile Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Name
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-n4 focus:ring-2 focus:ring-n4 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              autoFocus
            />
          </div>

          {/* Starting Level */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Choose Your Starting Level
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {JLPT_LEVELS.map((level) => {
                const info = JLPT_LEVEL_INFO[level];
                const isSelected = selectedLevel === level;

                return (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? `border-${info.color} bg-${info.color} bg-opacity-10 scale-105`
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <span className={`badge-${level.toLowerCase()} mb-2 inline-block`}>
                      {level}
                    </span>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {info.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {info.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateProfile}
            className="w-full btn-primary py-4 text-lg"
          >
            Create Profile & Start Learning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-n5 via-n4 to-n3 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            日本話 Nihonwa
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your journey from N5 to N1
          </p>
        </div>

        {/* Existing Profiles */}
        {allProfiles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Select Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile)}
                  className="card text-left hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {profile.name}
                    </h3>
                    <span className={`badge-${profile.currentLevel.toLowerCase()}`}>
                      {profile.currentLevel}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Last active: {new Date(profile.lastActive).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Create New Profile Button */}
        <div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-n4 dark:hover:border-n4 rounded-lg text-gray-600 dark:text-gray-400 hover:text-n4 font-semibold transition-colors"
          >
            + Create New Profile
          </button>
        </div>

        {allProfiles.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
            Create your first profile to start learning Japanese
          </p>
        )}
      </div>
    </div>
  );
}

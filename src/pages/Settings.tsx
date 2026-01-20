import { useStore } from '../store/useStore';
import { JLPT_LEVELS, JLPT_LEVEL_INFO } from '../utils/jlptHelpers';
import type { JLPTLevel } from '../types';

export default function Settings() {
  const { user, setUser, appSettings, setAppSettings, setShowLevelSelector } = useStore();

  const handleLevelChange = (newLevel: JLPTLevel) => {
    if (user) {
      setUser({ ...user, currentLevel: newLevel });
    }
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setUser(null);
      setShowLevelSelector(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your learning experience</p>
      </div>

      {/* Current Level */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Current Level</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {JLPT_LEVELS.map((level) => {
            const info = JLPT_LEVEL_INFO[level];
            const isSelected = user?.currentLevel === level;

            return (
              <button
                key={level}
                onClick={() => handleLevelChange(level)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? `border-${info.color} bg-${info.color} bg-opacity-10`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`badge-${level.toLowerCase()} mb-2 inline-block`}>
                  {level}
                </span>
                <div className="text-sm font-medium text-gray-800">{info.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* App Settings */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">App Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <div className="font-medium text-gray-800">Theme</div>
              <div className="text-sm text-gray-600">Choose your preferred theme</div>
            </div>
            <select
              value={appSettings.theme}
              onChange={(e) => setAppSettings({ theme: e.target.value as 'light' | 'dark' | 'auto' })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-n4 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <div className="font-medium text-gray-800">Offline Mode</div>
              <div className="text-sm text-gray-600">Save content for offline access</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appSettings.offlineMode}
                onChange={(e) => setAppSettings({ offlineMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-n4-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-n4"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-gray-800">Data Sync</div>
              <div className="text-sm text-gray-600">Sync progress across devices</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appSettings.dataSyncEnabled}
                onChange={(e) => setAppSettings({ dataSyncEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-n4-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-n4"></div>
            </label>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">About Nihonwa</h2>
        <div className="space-y-2 text-gray-600">
          <p>
            <strong className="text-gray-800">Version:</strong> 0.1.0
          </p>
          <p>
            <strong className="text-gray-800">Description:</strong> Fully immersive Japanese learning experience from N5 to N1
          </p>
          <p className="text-sm mt-4">
            Nihonwa is a self-paced, no-pressure learning platform designed to help you master Japanese through real-world content and interactive tools.
          </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-2 border-red-200 bg-red-50">
        <h2 className="text-xl font-bold text-red-800 mb-4">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-red-800">Reset All Progress</div>
            <div className="text-sm text-red-600">This will delete all your learning data</div>
          </div>
          <button
            onClick={handleResetProgress}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
}

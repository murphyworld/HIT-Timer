import { Header } from '../components/layout';
import { Card } from '../components/common';
import { useSettingsStore } from '../store/settingsStore';
import { speechService } from '../services/speechService';

export function SettingsPage() {
  const {
    voiceEnabled,
    voiceVolume,
    units,
    theme,
    userWeight,
    setVoiceEnabled,
    setVoiceVolume,
    setUnits,
    setTheme,
    setUserWeight,
  } = useSettingsStore();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setVoiceVolume(volume);
    speechService.setVolume(volume);
  };

  const handleTestVoice = () => {
    speechService.speak('This is how voice cues will sound during your workout.');
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header title="Settings" />

      <main className="flex-1 p-4 space-y-4">
        {/* Voice Settings */}
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Voice Cues</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Enable Voice</span>
              <button
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  speechService.setEnabled(!voiceEnabled);
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  voiceEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    voiceEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {voiceEnabled && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Volume</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.round(voiceVolume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={voiceVolume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleTestVoice}
                  className="text-blue-600 dark:text-blue-400 text-sm font-medium"
                >
                  Test Voice
                </button>
              </>
            )}
          </div>
        </Card>

        {/* User Profile */}
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Profile</h2>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 dark:text-gray-300">Body Weight</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                (for calorie calculation)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={userWeight}
                onChange={(e) => setUserWeight(parseFloat(e.target.value) || 70)}
                min={30}
                max={200}
                step={0.5}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span className="text-gray-500 dark:text-gray-400">
                {units === 'metric' ? 'kg' : 'lbs'}
              </span>
            </div>
          </div>
        </Card>

        {/* Units */}
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Units</h2>

          <div className="flex gap-2">
            <button
              onClick={() => setUnits('metric')}
              className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
                units === 'metric'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Metric (kg, cm)
            </button>
            <button
              onClick={() => setUnits('imperial')}
              className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
                units === 'imperial'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Imperial (lbs, in)
            </button>
          </div>
        </Card>

        {/* Theme */}
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Theme</h2>

          <div className="flex gap-2">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex-1 py-2 rounded-xl font-medium capitalize transition-colors ${
                  theme === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        {/* About */}
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">About</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            HIT Timer - High Intensity Interval Training
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Version 1.0.0
          </p>
        </Card>
      </main>
    </div>
  );
}

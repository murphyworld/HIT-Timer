import type { TimerSettings } from '../App';
import { resumeAudio } from '../utils/sounds';

interface SetupScreenProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
  onStart: () => void;
}

export function SetupScreen({ settings, onSettingsChange, onStart }: SetupScreenProps) {
  const handleStart = () => {
    resumeAudio(); // Enable audio after user interaction
    onStart();
  };

  return (
    <div className="setup-screen">
      <h1 className="title">HIT TIMER</h1>
      <p className="subtitle">GET READY TO SWEAT</p>

      <div className="slider-section">
        <label className="slider-label">
          WORK TIME
          <span className="slider-value">{settings.activeTime}s</span>
        </label>
        <input
          type="range"
          min="5"
          max="120"
          step="5"
          value={settings.activeTime}
          onChange={(e) =>
            onSettingsChange({ ...settings, activeTime: parseInt(e.target.value) })
          }
          className="arcade-slider"
        />
        <div className="slider-range">
          <span>5s</span>
          <span>120s</span>
        </div>
      </div>

      <div className="slider-section">
        <label className="slider-label">
          REST TIME
          <span className="slider-value">{settings.restTime}s</span>
        </label>
        <input
          type="range"
          min="5"
          max="120"
          step="5"
          value={settings.restTime}
          onChange={(e) =>
            onSettingsChange({ ...settings, restTime: parseInt(e.target.value) })
          }
          className="arcade-slider"
        />
        <div className="slider-range">
          <span>5s</span>
          <span>120s</span>
        </div>
      </div>

      <button className="start-button" onClick={handleStart}>
        START
      </button>

      <div className="sound-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) =>
              onSettingsChange({ ...settings, soundEnabled: e.target.checked })
            }
          />
          <span className="toggle-switch"></span>
          SOUND {settings.soundEnabled ? 'ON' : 'OFF'}
        </label>
      </div>

      <div className="insert-coin">INSERT COIN TO CONTINUE</div>
    </div>
  );
}

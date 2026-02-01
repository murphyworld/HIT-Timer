import { useState } from 'react';
import { SetupScreen } from './screens/SetupScreen';
import { TimerScreen } from './screens/TimerScreen';

export type Screen = 'setup' | 'timer';

export interface TimerSettings {
  activeTime: number;
  restTime: number;
  soundEnabled: boolean;
}

function App() {
  const [screen, setScreen] = useState<Screen>('setup');
  const [settings, setSettings] = useState<TimerSettings>({
    activeTime: 30,
    restTime: 15,
    soundEnabled: true,
  });

  const handleStart = () => {
    setScreen('timer');
  };

  const handleExit = () => {
    setScreen('setup');
  };

  return (
    <div className="app">
      {screen === 'setup' && (
        <SetupScreen
          settings={settings}
          onSettingsChange={setSettings}
          onStart={handleStart}
        />
      )}
      {screen === 'timer' && (
        <TimerScreen
          settings={settings}
          onExit={handleExit}
        />
      )}
    </div>
  );
}

export default App;

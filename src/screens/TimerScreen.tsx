import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimerSettings } from '../App';
import {
  playCountdownBeep,
  playStartSequence,
  playStopTone,
} from '../utils/sounds';

type Phase = 'getReady' | 'starting' | 'work' | 'rest';

interface TimerScreenProps {
  settings: TimerSettings;
  onExit: () => void;
}

export function TimerScreen({ settings, onExit }: TimerScreenProps) {
  const [phase, setPhase] = useState<Phase>('getReady');
  const [timeLeft, setTimeLeft] = useState(10); // 10 second get ready
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const lastBeepRef = useRef<number>(10);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startWorkPhase = useCallback(() => {
    setPhase('work');
    setTimeLeft(settings.activeTime);
  }, [settings.activeTime]);

  const startRestPhase = useCallback(() => {
    if (settings.soundEnabled) {
      playStopTone();
    }
    setPhase('rest');
    setTimeLeft(settings.restTime);
  }, [settings.restTime, settings.soundEnabled]);

  const startGetReady = useCallback(() => {
    setPhase('getReady');
    setTimeLeft(10);
    lastBeepRef.current = 10;
  }, []);

  // Handle the 3-beep start sequence
  const startStartingSequence = useCallback(() => {
    setPhase('starting');
    setTimeLeft(3);
    if (settings.soundEnabled) {
      playStartSequence(() => {
        // This callback fires after the beeps
      });
    }
  }, [settings.soundEnabled]);

  // Main timer logic
  useEffect(() => {
    if (isPaused) {
      clearTimer();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        // Get ready phase countdown beeps
        if (phase === 'getReady' && settings.soundEnabled && newTime < lastBeepRef.current && newTime > 0) {
          playCountdownBeep();
          lastBeepRef.current = newTime;
        }

        // Phase transitions
        if (newTime <= 0) {
          if (phase === 'getReady') {
            startStartingSequence();
            return 3;
          } else if (phase === 'starting') {
            startWorkPhase();
            return settings.activeTime;
          } else if (phase === 'work') {
            startRestPhase();
            return settings.restTime;
          } else if (phase === 'rest') {
            // After rest, go back to starting sequence (3 beeps) then work
            startStartingSequence();
            return 3;
          }
        }

        return newTime;
      });
    }, 1000);

    return clearTimer;
  }, [
    phase,
    isPaused,
    settings,
    clearTimer,
    startStartingSequence,
    startWorkPhase,
    startRestPhase,
  ]);

  const handlePause = () => {
    setIsPaused((p) => !p);
  };

  const handleReset = () => {
    clearTimer();
    if (phase === 'work') {
      setTimeLeft(settings.activeTime);
    } else if (phase === 'rest') {
      setTimeLeft(settings.restTime);
    } else {
      startGetReady();
    }
    setIsPaused(false);
  };

  const handleExit = () => {
    clearTimer();
    onExit();
  };

  const getPhaseClass = () => {
    switch (phase) {
      case 'getReady':
      case 'starting':
        return 'phase-getready';
      case 'work':
        return 'phase-work';
      case 'rest':
        return 'phase-rest';
      default:
        return '';
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'getReady':
        return 'GET READY';
      case 'starting':
        return 'GO!';
      case 'work':
        return 'WORK!';
      case 'rest':
        return 'REST';
      default:
        return '';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return seconds.toString();
  };

  return (
    <div className={`timer-screen ${getPhaseClass()}`}>
      <div className="phase-label">{getPhaseText()}</div>

      <div className="timer-display">
        {formatTime(timeLeft)}
      </div>

      {isPaused && <div className="paused-label">PAUSED</div>}

      <div className="controls">
        <button className="control-button pause-button" onClick={handlePause}>
          {isPaused ? '▶' : '❚❚'}
        </button>
        <button className="control-button reset-button" onClick={handleReset}>
          RESET
        </button>
        <button className="control-button exit-button" onClick={handleExit}>
          EXIT
        </button>
      </div>
    </div>
  );
}

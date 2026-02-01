import { useEffect, useRef, useCallback } from 'react';
import { useMachine } from '@xstate/react';
import { timerMachine, type TimerContext } from '../machines/timerMachine';
import { speechService } from '../services/speechService';
import { VOICE_PHRASES } from '../constants/voicePhrases';
import type { Exercise } from '../types';

interface UseTimerOptions {
  voiceEnabled?: boolean;
}

export function useTimer(options: UseTimerOptions = {}) {
  const { voiceEnabled = true } = options;
  const [state, send] = useMachine(timerMachine);
  const intervalRef = useRef<number | null>(null);
  const prevStateRef = useRef<string>('idle');
  const prevTimeRef = useRef<number>(0);

  const context = state.context as TimerContext;

  // Handle voice announcements on state changes
  useEffect(() => {
    if (!voiceEnabled) return;

    const currentState = state.value as string;
    const prevState = prevStateRef.current;

    if (currentState !== prevState) {
      switch (currentState) {
        case 'getReady':
          speechService.speak(VOICE_PHRASES.getReady, true);
          break;
        case 'working':
          if (prevState === 'getReady' || prevState === 'resting') {
            speechService.speak(VOICE_PHRASES.beginSet, true);
          }
          break;
        case 'resting':
          speechService.speak(VOICE_PHRASES.rest, true);
          if (context.currentSet < context.totalSets) {
            setTimeout(() => {
              speechService.speak(
                VOICE_PHRASES.setComplete(context.currentSet, context.totalSets)
              );
            }, 1500);
          }
          break;
        case 'repInput':
          speechService.speak(VOICE_PHRASES.howManyReps, true);
          break;
        case 'completed':
          speechService.speak(VOICE_PHRASES.workoutComplete, true);
          break;
      }
      prevStateRef.current = currentState;
    }
  }, [state.value, voiceEnabled, context.currentSet, context.totalSets]);

  // Handle countdown announcements
  useEffect(() => {
    if (!voiceEnabled) return;

    const currentState = state.value as string;
    const time = context.timeRemaining;
    const prevTime = prevTimeRef.current;

    if (time !== prevTime && time > 0) {
      // Announce countdown in getReady phase
      if (currentState === 'getReady') {
        speechService.speak(VOICE_PHRASES.countdown(time), true);
      }
      // Announce last 5 seconds in working/resting
      else if ((currentState === 'working' || currentState === 'resting') && time <= 5) {
        speechService.speak(VOICE_PHRASES.countdown(time), true);
      }
      // Announce halfway point
      else if (currentState === 'working' && time === Math.floor(context.workDuration / 2)) {
        speechService.speak(VOICE_PHRASES.halfwayThere);
      }
      prevTimeRef.current = time;
    }
  }, [context.timeRemaining, state.value, voiceEnabled, context.workDuration]);

  // Handle interval for ticking
  useEffect(() => {
    const currentState = state.value as string;
    const isRunning = ['getReady', 'working', 'resting'].includes(currentState);

    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        send({ type: 'TICK' });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.value, send]);

  const configure = useCallback(
    (exercise: Exercise, workDuration: number, restDuration: number, sets: number) => {
      send({
        type: 'CONFIGURE',
        exercise,
        workDuration,
        restDuration,
        sets,
      });
    },
    [send]
  );

  const start = useCallback(() => {
    send({ type: 'START' });
  }, [send]);

  const pause = useCallback(() => {
    send({ type: 'PAUSE' });
  }, [send]);

  const resume = useCallback(() => {
    send({ type: 'RESUME' });
  }, [send]);

  const stop = useCallback(() => {
    speechService.cancel();
    send({ type: 'STOP' });
  }, [send]);

  const submitReps = useCallback(
    (reps: number) => {
      if (voiceEnabled) {
        speechService.speak(VOICE_PHRASES.repsRecorded(reps));
      }
      send({ type: 'SUBMIT_REPS', reps });
    },
    [send, voiceEnabled]
  );

  const skipRepInput = useCallback(() => {
    send({ type: 'SKIP_REP_INPUT' });
  }, [send]);

  return {
    state: state.value as string,
    context,
    configure,
    start,
    pause,
    resume,
    stop,
    submitReps,
    skipRepInput,
    isIdle: state.matches('idle'),
    isRunning: ['getReady', 'working', 'resting'].includes(state.value as string),
    isPaused: state.matches('paused'),
    isCompleted: state.matches('completed'),
    isRepInput: state.matches('repInput'),
  };
}

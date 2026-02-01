import { createMachine, assign } from 'xstate';
import type { Exercise } from '../types';

export interface TimerContext {
  exercise: Exercise | null;
  workDuration: number;
  restDuration: number;
  totalSets: number;
  currentSet: number;
  timeRemaining: number;
  repsPerSet: number[];
  pausedFrom: 'getReady' | 'working' | 'resting' | null;
}

export type TimerEvent =
  | { type: 'CONFIGURE'; exercise: Exercise; workDuration: number; restDuration: number; sets: number }
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'TICK' }
  | { type: 'SUBMIT_REPS'; reps: number }
  | { type: 'SKIP_REP_INPUT' };

const initialContext: TimerContext = {
  exercise: null,
  workDuration: 30,
  restDuration: 15,
  totalSets: 3,
  currentSet: 0,
  timeRemaining: 0,
  repsPerSet: [],
  pausedFrom: null,
};

export const timerMachine = createMachine({
  id: 'timer',
  initial: 'idle',
  context: initialContext,
  states: {
    idle: {
      on: {
        CONFIGURE: {
          actions: assign({
            exercise: ({ event }) => event.exercise,
            workDuration: ({ event }) => event.workDuration,
            restDuration: ({ event }) => event.restDuration,
            totalSets: ({ event }) => event.sets,
            currentSet: 0,
            repsPerSet: [],
            pausedFrom: null,
          }),
        },
        START: {
          target: 'getReady',
          guard: ({ context }) => context.exercise !== null,
          actions: assign({
            timeRemaining: 3,
            currentSet: 1,
            repsPerSet: [],
          }),
        },
      },
    },
    getReady: {
      on: {
        TICK: [
          {
            guard: ({ context }) => context.timeRemaining > 1,
            actions: assign({
              timeRemaining: ({ context }) => context.timeRemaining - 1,
            }),
          },
          {
            target: 'working',
            actions: assign({
              timeRemaining: ({ context }) => context.workDuration,
            }),
          },
        ],
        PAUSE: {
          target: 'paused',
          actions: assign({ pausedFrom: 'getReady' }),
        },
        STOP: {
          target: 'idle',
          actions: assign(initialContext),
        },
      },
    },
    working: {
      on: {
        TICK: [
          {
            guard: ({ context }) => context.timeRemaining > 1,
            actions: assign({
              timeRemaining: ({ context }) => context.timeRemaining - 1,
            }),
          },
          {
            target: 'repInput',
          },
        ],
        PAUSE: {
          target: 'paused',
          actions: assign({ pausedFrom: 'working' }),
        },
        STOP: {
          target: 'idle',
          actions: assign(initialContext),
        },
      },
    },
    repInput: {
      on: {
        SUBMIT_REPS: [
          {
            guard: ({ context }) => context.currentSet < context.totalSets,
            target: 'resting',
            actions: assign({
              repsPerSet: ({ context, event }) => [...context.repsPerSet, event.reps],
              timeRemaining: ({ context }) => context.restDuration,
            }),
          },
          {
            target: 'completed',
            actions: assign({
              repsPerSet: ({ context, event }) => [...context.repsPerSet, event.reps],
            }),
          },
        ],
        SKIP_REP_INPUT: [
          {
            guard: ({ context }) => context.currentSet < context.totalSets,
            target: 'resting',
            actions: assign({
              repsPerSet: ({ context }) => [...context.repsPerSet, 0],
              timeRemaining: ({ context }) => context.restDuration,
            }),
          },
          {
            target: 'completed',
            actions: assign({
              repsPerSet: ({ context }) => [...context.repsPerSet, 0],
            }),
          },
        ],
        STOP: {
          target: 'idle',
          actions: assign(initialContext),
        },
      },
    },
    resting: {
      on: {
        TICK: [
          {
            guard: ({ context }) => context.timeRemaining > 1,
            actions: assign({
              timeRemaining: ({ context }) => context.timeRemaining - 1,
            }),
          },
          {
            target: 'working',
            actions: assign({
              currentSet: ({ context }) => context.currentSet + 1,
              timeRemaining: ({ context }) => context.workDuration,
            }),
          },
        ],
        PAUSE: {
          target: 'paused',
          actions: assign({ pausedFrom: 'resting' }),
        },
        STOP: {
          target: 'idle',
          actions: assign(initialContext),
        },
      },
    },
    paused: {
      on: {
        RESUME: [
          {
            guard: ({ context }) => context.pausedFrom === 'getReady',
            target: 'getReady',
            actions: assign({ pausedFrom: null }),
          },
          {
            guard: ({ context }) => context.pausedFrom === 'working',
            target: 'working',
            actions: assign({ pausedFrom: null }),
          },
          {
            guard: ({ context }) => context.pausedFrom === 'resting',
            target: 'resting',
            actions: assign({ pausedFrom: null }),
          },
        ],
        STOP: {
          target: 'idle',
          actions: assign(initialContext),
        },
      },
    },
    completed: {
      on: {
        STOP: {
          target: 'idle',
          actions: assign(initialContext),
        },
        START: {
          target: 'getReady',
          actions: assign({
            timeRemaining: 3,
            currentSet: 1,
            repsPerSet: [],
          }),
        },
      },
    },
  },
});

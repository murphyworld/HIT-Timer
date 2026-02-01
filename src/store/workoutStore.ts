import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Exercise, ExerciseLog, SetLog, Workout } from '../types';
import { db } from '../db/database';
import { calorieService } from '../services/calorieService';

interface CurrentWorkout {
  exercise: Exercise | null;
  workDuration: number;
  restDuration: number;
  sets: number;
  exerciseLogs: ExerciseLog[];
  currentExerciseLog: ExerciseLog | null;
  startTime: Date | null;
}

interface WorkoutStore {
  currentWorkout: CurrentWorkout;
  recentWorkouts: Workout[];

  // Current workout actions
  setExercise: (exercise: Exercise) => void;
  setWorkDuration: (duration: number) => void;
  setRestDuration: (duration: number) => void;
  setSets: (sets: number) => void;
  startWorkout: () => void;
  addSetLog: (reps: number, duration: number) => void;
  finishExercise: () => void;
  saveWorkout: (routineId?: string, routineName?: string) => Promise<Workout>;
  resetCurrentWorkout: () => void;

  // History actions
  loadRecentWorkouts: () => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
}

const initialCurrentWorkout: CurrentWorkout = {
  exercise: null,
  workDuration: 30,
  restDuration: 15,
  sets: 3,
  exerciseLogs: [],
  currentExerciseLog: null,
  startTime: null,
};

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  currentWorkout: initialCurrentWorkout,
  recentWorkouts: [],

  setExercise: (exercise) => {
    set((state) => ({
      currentWorkout: { ...state.currentWorkout, exercise },
    }));
  },

  setWorkDuration: (duration) => {
    set((state) => ({
      currentWorkout: { ...state.currentWorkout, workDuration: duration },
    }));
  },

  setRestDuration: (duration) => {
    set((state) => ({
      currentWorkout: { ...state.currentWorkout, restDuration: duration },
    }));
  },

  setSets: (sets) => {
    set((state) => ({
      currentWorkout: { ...state.currentWorkout, sets },
    }));
  },

  startWorkout: () => {
    const { exercise } = get().currentWorkout;
    if (!exercise) return;

    set((state) => ({
      currentWorkout: {
        ...state.currentWorkout,
        startTime: new Date(),
        currentExerciseLog: {
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          sets: [],
          totalCalories: 0,
        },
      },
    }));
  },

  addSetLog: (reps, duration) => {
    const { currentWorkout } = get();
    if (!currentWorkout.currentExerciseLog || !currentWorkout.exercise) return;

    const calories = calorieService.calculateSetCalories(currentWorkout.exercise, duration);
    const setLog: SetLog = {
      setNumber: currentWorkout.currentExerciseLog.sets.length + 1,
      reps,
      duration,
      calories,
    };

    set((state) => ({
      currentWorkout: {
        ...state.currentWorkout,
        currentExerciseLog: state.currentWorkout.currentExerciseLog
          ? {
              ...state.currentWorkout.currentExerciseLog,
              sets: [...state.currentWorkout.currentExerciseLog.sets, setLog],
              totalCalories: state.currentWorkout.currentExerciseLog.totalCalories + calories,
            }
          : null,
      },
    }));
  },

  finishExercise: () => {
    const { currentExerciseLog } = get().currentWorkout;
    if (!currentExerciseLog) return;

    set((state) => ({
      currentWorkout: {
        ...state.currentWorkout,
        exerciseLogs: [...state.currentWorkout.exerciseLogs, currentExerciseLog],
        currentExerciseLog: null,
      },
    }));
  },

  saveWorkout: async (routineId?: string, routineName?: string) => {
    const { currentWorkout } = get();

    // Include current exercise log if exists
    let exerciseLogs = [...currentWorkout.exerciseLogs];
    if (currentWorkout.currentExerciseLog && currentWorkout.currentExerciseLog.sets.length > 0) {
      exerciseLogs.push(currentWorkout.currentExerciseLog);
    }

    const totalCalories = exerciseLogs.reduce((sum, log) => sum + log.totalCalories, 0);
    const totalDuration = exerciseLogs.reduce(
      (sum, log) => sum + log.sets.reduce((s, set) => s + set.duration, 0),
      0
    );

    const workout: Workout = {
      id: uuidv4(),
      routineId,
      routineName,
      exercises: exerciseLogs,
      totalCalories,
      totalDuration,
      date: currentWorkout.startTime || new Date(),
    };

    await db.workouts.add(workout);

    // Reset and reload
    get().resetCurrentWorkout();
    await get().loadRecentWorkouts();

    return workout;
  },

  resetCurrentWorkout: () => {
    set({ currentWorkout: initialCurrentWorkout });
  },

  loadRecentWorkouts: async () => {
    const workouts = await db.workouts.orderBy('date').reverse().limit(50).toArray();
    set({ recentWorkouts: workouts });
  },

  deleteWorkout: async (id) => {
    await db.workouts.delete(id);
    await get().loadRecentWorkouts();
  },
}));

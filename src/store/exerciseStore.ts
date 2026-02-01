import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Exercise, MuscleGroup } from '../types';
import { db } from '../db/database';

interface ExerciseStore {
  exercises: Exercise[];
  loadExercises: () => Promise<void>;
  getExercise: (id: string) => Exercise | undefined;
  getExercisesByMuscleGroup: (muscleGroup: MuscleGroup) => Exercise[];
  addCustomExercise: (
    name: string,
    muscleGroup: MuscleGroup,
    metValue: number
  ) => Promise<Exercise>;
  updateExercise: (id: string, updates: Partial<Exercise>) => Promise<void>;
  deleteCustomExercise: (id: string) => Promise<void>;
}

export const useExerciseStore = create<ExerciseStore>((set, get) => ({
  exercises: [],

  loadExercises: async () => {
    const exercises = await db.exercises.toArray();
    set({ exercises });
  },

  getExercise: (id) => {
    return get().exercises.find((e) => e.id === id);
  },

  getExercisesByMuscleGroup: (muscleGroup) => {
    return get().exercises.filter((e) => e.muscleGroup === muscleGroup);
  },

  addCustomExercise: async (name, muscleGroup, metValue) => {
    const exercise: Exercise = {
      id: uuidv4(),
      name,
      muscleGroup,
      metValue,
      isCustom: true,
    };

    await db.exercises.add(exercise);
    await get().loadExercises();
    return exercise;
  },

  updateExercise: async (id, updates) => {
    const exercise = await db.exercises.get(id);
    if (!exercise) return;

    await db.exercises.put({ ...exercise, ...updates });
    await get().loadExercises();
  },

  deleteCustomExercise: async (id) => {
    const exercise = await db.exercises.get(id);
    if (!exercise || !exercise.isCustom) return;

    await db.exercises.delete(id);
    await get().loadExercises();
  },
}));

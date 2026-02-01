import { calculateCalories } from '../utils/calculateCalories';
import type { Exercise, ExerciseLog, SetLog } from '../types';

const DEFAULT_WEIGHT_KG = 70; // Default weight if not set

export class CalorieService {
  private weightKg: number = DEFAULT_WEIGHT_KG;

  setWeight(weightKg: number) {
    this.weightKg = weightKg;
  }

  getWeight(): number {
    return this.weightKg;
  }

  calculateSetCalories(exercise: Exercise, durationSeconds: number): number {
    return calculateCalories(exercise.metValue, this.weightKg, durationSeconds);
  }

  calculateExerciseCalories(
    exercise: Exercise,
    sets: SetLog[]
  ): number {
    return sets.reduce((total, set) => {
      return total + calculateCalories(exercise.metValue, this.weightKg, set.duration);
    }, 0);
  }

  calculateWorkoutCalories(exerciseLogs: ExerciseLog[]): number {
    return exerciseLogs.reduce((total, log) => total + log.totalCalories, 0);
  }

  estimateCaloriesForRoutine(
    exercises: Array<{ exercise: Exercise; workDuration: number; sets: number }>
  ): number {
    return exercises.reduce((total, { exercise, workDuration, sets }) => {
      const perSet = calculateCalories(exercise.metValue, this.weightKg, workDuration);
      return total + perSet * sets;
    }, 0);
  }
}

export const calorieService = new CalorieService();

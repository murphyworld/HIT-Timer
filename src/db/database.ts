import Dexie, { type EntityTable } from 'dexie';
import type { Exercise, Routine, Workout, BodyMetric, WeekSchedule, Settings } from '../types';

interface ExerciseRecord extends Exercise {}
interface RoutineRecord extends Omit<Routine, 'createdAt' | 'updatedAt'> {
  createdAt: Date;
  updatedAt: Date;
}
interface WorkoutRecord extends Omit<Workout, 'date'> {
  date: Date;
}
interface BodyMetricRecord extends Omit<BodyMetric, 'date'> {
  date: Date;
}
interface WeekScheduleRecord extends WeekSchedule {}
interface SettingsRecord extends Settings {
  id: string;
}

const db = new Dexie('HitTimerDB') as Dexie & {
  exercises: EntityTable<ExerciseRecord, 'id'>;
  routines: EntityTable<RoutineRecord, 'id'>;
  workouts: EntityTable<WorkoutRecord, 'id'>;
  bodyMetrics: EntityTable<BodyMetricRecord, 'id'>;
  weekSchedule: EntityTable<WeekScheduleRecord, 'id'>;
  settings: EntityTable<SettingsRecord, 'id'>;
};

db.version(1).stores({
  exercises: 'id, name, muscleGroup, isCustom',
  routines: 'id, name, createdAt',
  workouts: 'id, date, routineId',
  bodyMetrics: 'id, date',
  weekSchedule: 'id',
  settings: 'id',
});

export { db };
export type { ExerciseRecord, RoutineRecord, WorkoutRecord, BodyMetricRecord, WeekScheduleRecord, SettingsRecord };

// Exercise types
export type MuscleGroup = 'push' | 'pull' | 'legs' | 'core' | 'cardio' | 'full-body';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  metValue: number;
  isCustom: boolean;
}

// Routine types
export interface RoutineStep {
  id: string;
  exerciseId: string;
  workDuration: number; // seconds
  restDuration: number; // seconds
  sets: number;
}

export interface Routine {
  id: string;
  name: string;
  steps: RoutineStep[];
  createdAt: Date;
  updatedAt: Date;
}

// Week Schedule
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface WeekSchedule {
  id: string;
  assignments: Record<DayOfWeek, string | null>; // routineId or null for rest
}

// Workout Log
export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
  totalCalories: number;
}

export interface SetLog {
  setNumber: number;
  reps: number;
  duration: number; // seconds
  calories: number;
}

export interface Workout {
  id: string;
  routineId?: string;
  routineName?: string;
  exercises: ExerciseLog[];
  totalCalories: number;
  totalDuration: number; // seconds
  date: Date;
}

// Body Metrics
export interface BodyMetric {
  id: string;
  date: Date;
  weight?: number; // kg
  waist?: number; // cm
}

// Timer State
export type TimerPhase = 'idle' | 'getReady' | 'working' | 'resting' | 'paused' | 'repInput' | 'completed';

export interface TimerContext {
  currentExercise: Exercise | null;
  workDuration: number;
  restDuration: number;
  totalSets: number;
  currentSet: number;
  timeRemaining: number;
  phase: TimerPhase;
  repsPerSet: number[];
  isPaused: boolean;
  pausedFrom: TimerPhase | null;
}

// Settings
export interface Settings {
  voiceEnabled: boolean;
  voiceVolume: number;
  countdownFrom: number; // for "get ready" countdown
  units: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'system';
}

// Muscle Balance
export interface MuscleBalance {
  push: number;
  pull: number;
  legs: number;
  core: number;
  cardio: number;
  'full-body': number;
}

// Weekly Stats
export interface WeeklyStats {
  totalWorkouts: number;
  totalCalories: number;
  totalDuration: number;
  muscleBalance: MuscleBalance;
  workoutDays: DayOfWeek[];
}

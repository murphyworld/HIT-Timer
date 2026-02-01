import type { Exercise } from '../types';

export const DEFAULT_EXERCISES: Exercise[] = [
  // Push exercises
  { id: 'push-ups', name: 'Push-ups', muscleGroup: 'push', metValue: 8.0, isCustom: false },
  { id: 'diamond-push-ups', name: 'Diamond Push-ups', muscleGroup: 'push', metValue: 8.0, isCustom: false },
  { id: 'wide-push-ups', name: 'Wide Push-ups', muscleGroup: 'push', metValue: 8.0, isCustom: false },
  { id: 'decline-push-ups', name: 'Decline Push-ups', muscleGroup: 'push', metValue: 8.5, isCustom: false },
  { id: 'pike-push-ups', name: 'Pike Push-ups', muscleGroup: 'push', metValue: 8.0, isCustom: false },
  { id: 'tricep-dips', name: 'Tricep Dips', muscleGroup: 'push', metValue: 5.0, isCustom: false },
  { id: 'shoulder-taps', name: 'Shoulder Taps', muscleGroup: 'push', metValue: 6.0, isCustom: false },

  // Pull exercises
  { id: 'pull-ups', name: 'Pull-ups', muscleGroup: 'pull', metValue: 8.0, isCustom: false },
  { id: 'chin-ups', name: 'Chin-ups', muscleGroup: 'pull', metValue: 8.0, isCustom: false },
  { id: 'inverted-rows', name: 'Inverted Rows', muscleGroup: 'pull', metValue: 5.0, isCustom: false },
  { id: 'superman', name: 'Superman', muscleGroup: 'pull', metValue: 3.8, isCustom: false },
  { id: 'reverse-snow-angels', name: 'Reverse Snow Angels', muscleGroup: 'pull', metValue: 3.0, isCustom: false },

  // Leg exercises
  { id: 'squats', name: 'Squats', muscleGroup: 'legs', metValue: 5.0, isCustom: false },
  { id: 'jump-squats', name: 'Jump Squats', muscleGroup: 'legs', metValue: 8.0, isCustom: false },
  { id: 'lunges', name: 'Lunges', muscleGroup: 'legs', metValue: 5.0, isCustom: false },
  { id: 'jumping-lunges', name: 'Jumping Lunges', muscleGroup: 'legs', metValue: 8.0, isCustom: false },
  { id: 'wall-sit', name: 'Wall Sit', muscleGroup: 'legs', metValue: 2.0, isCustom: false },
  { id: 'calf-raises', name: 'Calf Raises', muscleGroup: 'legs', metValue: 3.0, isCustom: false },
  { id: 'glute-bridges', name: 'Glute Bridges', muscleGroup: 'legs', metValue: 3.5, isCustom: false },
  { id: 'single-leg-deadlift', name: 'Single Leg Deadlift', muscleGroup: 'legs', metValue: 4.0, isCustom: false },
  { id: 'box-jumps', name: 'Box Jumps', muscleGroup: 'legs', metValue: 8.0, isCustom: false },

  // Core exercises
  { id: 'plank', name: 'Plank', muscleGroup: 'core', metValue: 3.8, isCustom: false },
  { id: 'side-plank', name: 'Side Plank', muscleGroup: 'core', metValue: 3.8, isCustom: false },
  { id: 'crunches', name: 'Crunches', muscleGroup: 'core', metValue: 3.8, isCustom: false },
  { id: 'bicycle-crunches', name: 'Bicycle Crunches', muscleGroup: 'core', metValue: 4.5, isCustom: false },
  { id: 'leg-raises', name: 'Leg Raises', muscleGroup: 'core', metValue: 4.0, isCustom: false },
  { id: 'mountain-climbers', name: 'Mountain Climbers', muscleGroup: 'core', metValue: 8.0, isCustom: false },
  { id: 'russian-twists', name: 'Russian Twists', muscleGroup: 'core', metValue: 4.0, isCustom: false },
  { id: 'dead-bug', name: 'Dead Bug', muscleGroup: 'core', metValue: 3.0, isCustom: false },
  { id: 'flutter-kicks', name: 'Flutter Kicks', muscleGroup: 'core', metValue: 4.5, isCustom: false },

  // Cardio exercises
  { id: 'jumping-jacks', name: 'Jumping Jacks', muscleGroup: 'cardio', metValue: 8.0, isCustom: false },
  { id: 'high-knees', name: 'High Knees', muscleGroup: 'cardio', metValue: 8.0, isCustom: false },
  { id: 'butt-kicks', name: 'Butt Kicks', muscleGroup: 'cardio', metValue: 8.0, isCustom: false },
  { id: 'burpees', name: 'Burpees', muscleGroup: 'cardio', metValue: 10.0, isCustom: false },
  { id: 'skaters', name: 'Skaters', muscleGroup: 'cardio', metValue: 7.0, isCustom: false },
  { id: 'running-in-place', name: 'Running in Place', muscleGroup: 'cardio', metValue: 8.0, isCustom: false },
  { id: 'star-jumps', name: 'Star Jumps', muscleGroup: 'cardio', metValue: 8.5, isCustom: false },

  // Full-body exercises
  { id: 'bear-crawl', name: 'Bear Crawl', muscleGroup: 'full-body', metValue: 8.0, isCustom: false },
  { id: 'inchworms', name: 'Inchworms', muscleGroup: 'full-body', metValue: 6.0, isCustom: false },
  { id: 'thruster', name: 'Thruster', muscleGroup: 'full-body', metValue: 8.0, isCustom: false },
  { id: 'man-makers', name: 'Man Makers', muscleGroup: 'full-body', metValue: 9.0, isCustom: false },
];

export const MUSCLE_GROUP_COLORS: Record<string, string> = {
  push: '#ef4444', // red
  pull: '#3b82f6', // blue
  legs: '#22c55e', // green
  core: '#f59e0b', // amber
  cardio: '#ec4899', // pink
  'full-body': '#8b5cf6', // purple
};

export const MUSCLE_GROUP_LABELS: Record<string, string> = {
  push: 'Push',
  pull: 'Pull',
  legs: 'Legs',
  core: 'Core',
  cardio: 'Cardio',
  'full-body': 'Full Body',
};

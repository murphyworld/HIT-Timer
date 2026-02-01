export const VOICE_PHRASES = {
  getReady: 'Get ready',
  beginSet: 'Begin your set now',
  rest: 'Rest',
  workoutComplete: 'Workout complete. Great job!',
  nextExercise: (name: string) => `Next exercise: ${name}`,
  setComplete: (current: number, total: number) => `Set ${current} of ${total} complete`,
  lastSet: 'This is your last set. Give it everything!',
  halfwayThere: 'Halfway there',
  almostDone: 'Almost done',
  howManyReps: 'How many reps did you complete?',
  repsRecorded: (count: number) => `${count} reps recorded`,
  countdown: (n: number) => String(n),
};

export const COUNTDOWN_START = 3; // "Get ready" countdown starts from 3

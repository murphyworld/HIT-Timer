import { useEffect } from 'react';
import { Header } from '../components/layout';
import { Card } from '../components/common';
import { useWorkoutStore } from '../store/workoutStore';
import { formatRelativeDate, formatDate } from '../utils/dateUtils';
import { formatTimeVerbose } from '../utils/formatTime';
import type { Workout } from '../types';

export function HistoryPage() {
  const { recentWorkouts, loadRecentWorkouts, deleteWorkout } = useWorkoutStore();

  useEffect(() => {
    loadRecentWorkouts();
  }, [loadRecentWorkouts]);

  // Group workouts by date
  const groupedWorkouts = recentWorkouts.reduce<Record<string, Workout[]>>((acc, workout) => {
    const dateKey = formatDate(new Date(workout.date));
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(workout);
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header title="History" />

      <main className="flex-1 p-4">
        {recentWorkouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <svg
              className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">No workouts yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Complete a workout to see it here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedWorkouts).map(([dateKey, workouts]) => (
              <div key={dateKey}>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {formatRelativeDate(new Date(workouts[0].date))}
                </h2>
                <div className="space-y-3">
                  {workouts.map((workout) => (
                    <WorkoutCard
                      key={workout.id}
                      workout={workout}
                      onDelete={() => deleteWorkout(workout.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

interface WorkoutCardProps {
  workout: Workout;
  onDelete: () => void;
}

function WorkoutCard({ workout, onDelete }: WorkoutCardProps) {
  const totalReps = workout.exercises.reduce(
    (total, ex) => total + ex.sets.reduce((sum, set) => sum + set.reps, 0),
    0
  );

  const totalSets = workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {workout.routineName || workout.exercises.map((e) => e.exerciseName).join(', ')}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTimeVerbose(workout.totalDuration)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              {Math.round(workout.totalCalories)} cal
            </span>
            <span>{totalSets} sets</span>
            <span>{totalReps} reps</span>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Exercise details */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="space-y-2">
          {workout.exercises.map((exercise, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">{exercise.exerciseName}</span>
              <span className="text-gray-500 dark:text-gray-400">
                {exercise.sets.length} sets x{' '}
                {exercise.sets.map((s) => s.reps).join(', ')} reps
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

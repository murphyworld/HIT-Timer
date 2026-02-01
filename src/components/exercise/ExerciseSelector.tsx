import { useState } from 'react';
import type { Exercise, MuscleGroup } from '../../types';
import { Card, Button, Modal } from '../common';
import { MUSCLE_GROUP_COLORS, MUSCLE_GROUP_LABELS } from '../../constants/exercises';
import { CategoryFilter } from './CategoryFilter';

interface ExerciseSelectorProps {
  exercises: Exercise[];
  selectedExercise: Exercise | null;
  onSelect: (exercise: Exercise) => void;
  disabled?: boolean;
}

export function ExerciseSelector({
  exercises,
  selectedExercise,
  onSelect,
  disabled = false,
}: ExerciseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<MuscleGroup | 'all'>('all');

  const filteredExercises =
    filter === 'all'
      ? exercises
      : exercises.filter((e) => e.muscleGroup === filter);

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
    setIsOpen(false);
  };

  return (
    <>
      <Card
        className={`cursor-pointer transition-all hover:border-blue-300 dark:hover:border-blue-600 ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Exercise</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedExercise?.name || 'Select an exercise'}
            </p>
            {selectedExercise && (
              <span
                className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: MUSCLE_GROUP_COLORS[selectedExercise.muscleGroup] }}
              >
                {MUSCLE_GROUP_LABELS[selectedExercise.muscleGroup]}
              </span>
            )}
          </div>
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Card>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Select Exercise">
        <div className="flex flex-col gap-4">
          <CategoryFilter selected={filter} onSelect={setFilter} />

          <div className="max-h-[50vh] overflow-y-auto -mx-4 px-4">
            <div className="space-y-2">
              {filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => handleSelect(exercise)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    selectedExercise?.id === exercise.id
                      ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {exercise.name}
                    </span>
                    <span
                      className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
                      style={{ backgroundColor: MUSCLE_GROUP_COLORS[exercise.muscleGroup] }}
                    >
                      {MUSCLE_GROUP_LABELS[exercise.muscleGroup]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button variant="secondary" onClick={() => setIsOpen(false)} fullWidth>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}

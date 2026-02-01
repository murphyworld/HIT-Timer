import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Header } from '../components/layout';
import { Card, Button, Modal, NumberInput } from '../components/common';
import { WeekScheduler } from '../components/routine';
import { useRoutineStore } from '../store/routineStore';
import { useExerciseStore } from '../store/exerciseStore';
import type { Routine, RoutineStep, Exercise } from '../types';
import { MUSCLE_GROUP_COLORS, MUSCLE_GROUP_LABELS } from '../constants/exercises';
import { formatDuration } from '../utils/formatTime';

export function RoutinesPage() {
  const navigate = useNavigate();
  const { routines, weekSchedule, loadRoutines, loadSchedule, createRoutine, updateRoutine, deleteRoutine, assignRoutineToDay } = useRoutineStore();
  const { exercises, loadExercises } = useExerciseStore();
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadRoutines();
    loadSchedule();
    loadExercises();
  }, [loadRoutines, loadSchedule, loadExercises]);

  const handleCreateRoutine = async (name: string, steps: Omit<RoutineStep, 'id'>[]) => {
    await createRoutine(name, steps);
    setIsModalOpen(false);
  };

  const handleUpdateRoutine = async (name: string, steps: Omit<RoutineStep, 'id'>[]) => {
    if (!editingRoutine) return;
    await updateRoutine(editingRoutine.id, {
      name,
      steps: steps.map((step) => ({ ...step, id: uuidv4() })),
    });
    setEditingRoutine(null);
    setIsModalOpen(false);
  };

  const handleOpenCreate = () => {
    setEditingRoutine(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (routine: Routine) => {
    setEditingRoutine(routine);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingRoutine(null);
    setIsModalOpen(false);
  };

  const calculateRoutineDuration = (routine: Routine) => {
    return routine.steps.reduce((total, step) => {
      return total + (step.workDuration + step.restDuration) * step.sets;
    }, 0);
  };

  const handleStartRoutine = (routine: Routine) => {
    navigate(`/?routine=${routine.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header
        title="Routines"
        rightAction={
          <button
            onClick={handleOpenCreate}
            className="p-2 text-blue-600 dark:text-blue-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        }
      />

      <main className="flex-1 p-4 space-y-6">
        {/* Week Scheduler */}
        <WeekScheduler
          schedule={weekSchedule}
          routines={routines}
          onAssign={assignRoutineToDay}
          onStartToday={handleStartRoutine}
        />

        {/* Routines List */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">My Routines</h2>
          {routines.length === 0 ? (
            <Card>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <svg
                  className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 mb-4">No routines yet</p>
                <Button onClick={handleOpenCreate}>Create Your First Routine</Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {routines.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  exercises={exercises}
                  duration={calculateRoutineDuration(routine)}
                  onStart={() => handleStartRoutine(routine)}
                  onEdit={() => handleOpenEdit(routine)}
                  onDelete={() => deleteRoutine(routine.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <RoutineModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={editingRoutine ? handleUpdateRoutine : handleCreateRoutine}
        exercises={exercises}
        routine={editingRoutine}
      />
    </div>
  );
}

interface RoutineCardProps {
  routine: Routine;
  exercises: Exercise[];
  duration: number;
  onStart: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function RoutineCard({ routine, exercises, duration, onStart, onEdit, onDelete }: RoutineCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const getExercise = (id: string) => exercises.find((e) => e.id === id);

  return (
    <>
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{routine.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {routine.steps.length} exercises - {formatDuration(duration)}
            </p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-500"
              title="Edit routine"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 text-gray-400 hover:text-red-500"
              title="Delete routine"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {routine.steps.map((step, idx) => {
            const exercise = getExercise(step.exerciseId);
            return exercise ? (
              <span
                key={idx}
                className="px-2 py-1 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: MUSCLE_GROUP_COLORS[exercise.muscleGroup] }}
              >
                {exercise.name}
              </span>
            ) : null;
          })}
        </div>

        <Button onClick={onStart} fullWidth>
          Start Routine
        </Button>
      </Card>

      <Modal isOpen={showConfirmDelete} onClose={() => setShowConfirmDelete(false)} title="Delete Routine">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Are you sure you want to delete "{routine.name}"? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)} fullWidth>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onDelete();
              setShowConfirmDelete(false);
            }}
            fullWidth
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}

interface RoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, steps: Omit<RoutineStep, 'id'>[]) => void;
  exercises: Exercise[];
  routine: Routine | null; // null for create, Routine for edit
}

function RoutineModal({ isOpen, onClose, onSave, exercises, routine }: RoutineModalProps) {
  const [name, setName] = useState('');
  const [steps, setSteps] = useState<Array<{ exerciseId: string; workDuration: number; restDuration: number; sets: number }>>([]);
  const [showExerciseSelect, setShowExerciseSelect] = useState(false);

  const isEditing = routine !== null;

  // Initialize form when routine changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (routine) {
        setName(routine.name);
        setSteps(routine.steps.map((step) => ({
          exerciseId: step.exerciseId,
          workDuration: step.workDuration,
          restDuration: step.restDuration,
          sets: step.sets,
        })));
      } else {
        setName('');
        setSteps([]);
      }
    }
  }, [isOpen, routine]);

  const handleAddExercise = (exerciseId: string) => {
    setSteps([...steps, { exerciseId, workDuration: 30, restDuration: 15, sets: 3 }]);
    setShowExerciseSelect(false);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleUpdateStep = (index: number, updates: Partial<typeof steps[0]>) => {
    setSteps(steps.map((step, i) => (i === index ? { ...step, ...updates } : step)));
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const handleSave = () => {
    if (name.trim() && steps.length > 0) {
      onSave(name.trim(), steps);
    }
  };

  const handleClose = () => {
    setName('');
    setSteps([]);
    onClose();
  };

  const getExercise = (id: string) => exercises.find((e) => e.id === id);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? 'Edit Routine' : 'Create Routine'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Routine Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Morning HIIT"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Exercises
            </label>
            <button
              onClick={() => setShowExerciseSelect(true)}
              className="text-sm text-blue-600 dark:text-blue-400 font-medium"
            >
              + Add Exercise
            </button>
          </div>

          {steps.length === 0 ? (
            <p className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
              No exercises added yet
            </p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {steps.map((step, index) => {
                const exercise = getExercise(step.exerciseId);
                return (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {/* Reorder buttons */}
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleMoveStep(index, 'up')}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleMoveStep(index, 'down')}
                            disabled={index === steps.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {exercise?.name || 'Unknown'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveStep(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <NumberInput
                        value={step.workDuration}
                        onChange={(v) => handleUpdateStep(index, { workDuration: v })}
                        min={5}
                        max={120}
                        step={5}
                        label="Work"
                        unit="s"
                      />
                      <NumberInput
                        value={step.restDuration}
                        onChange={(v) => handleUpdateStep(index, { restDuration: v })}
                        min={5}
                        max={120}
                        step={5}
                        label="Rest"
                        unit="s"
                      />
                      <NumberInput
                        value={step.sets}
                        onChange={(v) => handleUpdateStep(index, { sets: v })}
                        min={1}
                        max={10}
                        label="Sets"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={handleClose} fullWidth>
            Cancel
          </Button>
          <Button onClick={handleSave} fullWidth disabled={!name.trim() || steps.length === 0}>
            {isEditing ? 'Save Changes' : 'Create Routine'}
          </Button>
        </div>
      </div>

      {/* Exercise Selection Modal */}
      <Modal isOpen={showExerciseSelect} onClose={() => setShowExerciseSelect(false)} title="Add Exercise">
        <div className="max-h-64 overflow-y-auto space-y-2">
          {exercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => handleAddExercise(exercise.id)}
              className="w-full p-3 rounded-xl text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">{exercise.name}</span>
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
      </Modal>
    </Modal>
  );
}

import { useEffect } from 'react';
import { Header } from '../components/layout';
import { TimerDisplay, TimerControls, TimerConfig, RepInputModal } from '../components/timer';
import { ExerciseSelector } from '../components/exercise';
import { useTimer } from '../hooks/useTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { useExerciseStore } from '../store/exerciseStore';
import { useWorkoutStore } from '../store/workoutStore';
import { useSettingsStore } from '../store/settingsStore';

export function TimerPage() {
  const exercises = useExerciseStore((s) => s.exercises);
  const loadExercises = useExerciseStore((s) => s.loadExercises);
  const voiceEnabled = useSettingsStore((s) => s.voiceEnabled);

  const {
    currentWorkout,
    setExercise,
    setWorkDuration,
    setRestDuration,
    setSets,
    startWorkout,
    addSetLog,
    saveWorkout,
  } = useWorkoutStore();

  const timer = useTimer({ voiceEnabled });
  const wakeLock = useWakeLock();

  // Load exercises on mount
  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  // Configure timer when settings change
  useEffect(() => {
    if (currentWorkout.exercise) {
      timer.configure(
        currentWorkout.exercise,
        currentWorkout.workDuration,
        currentWorkout.restDuration,
        currentWorkout.sets
      );
    }
  }, [
    currentWorkout.exercise,
    currentWorkout.workDuration,
    currentWorkout.restDuration,
    currentWorkout.sets,
    timer.configure,
  ]);

  // Manage wake lock based on timer state
  useEffect(() => {
    if (timer.isRunning) {
      wakeLock.request();
    } else if (!timer.isPaused) {
      wakeLock.release();
    }
  }, [timer.isRunning, timer.isPaused, wakeLock]);

  const handleStart = () => {
    startWorkout();
    timer.start();
  };

  const handleStop = async () => {
    timer.stop();
    if (timer.context.repsPerSet.length > 0) {
      // Save workout if any sets were completed
      await saveWorkout();
    }
  };

  const handleSubmitReps = (reps: number) => {
    addSetLog(reps, currentWorkout.workDuration);
    timer.submitReps(reps);
  };

  const handleSkipRepInput = () => {
    addSetLog(0, currentWorkout.workDuration);
    timer.skipRepInput();
  };

  const getTotalTime = () => {
    switch (timer.state) {
      case 'getReady':
        return 3;
      case 'working':
        return currentWorkout.workDuration;
      case 'resting':
        return currentWorkout.restDuration;
      default:
        return 0;
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header title="HIT Timer" />

      <main className="flex-1 flex flex-col gap-6 p-4">
        {/* Timer Display */}
        <div className="flex-1 flex items-center justify-center py-4">
          <TimerDisplay
            timeRemaining={timer.context.timeRemaining}
            totalTime={getTotalTime()}
            phase={timer.state}
            currentSet={timer.context.currentSet}
            totalSets={timer.context.totalSets}
            exerciseName={timer.context.exercise?.name}
          />
        </div>

        {/* Configuration */}
        <div className="space-y-4">
          <ExerciseSelector
            exercises={exercises}
            selectedExercise={currentWorkout.exercise}
            onSelect={setExercise}
            disabled={!timer.isIdle}
          />

          <TimerConfig
            workDuration={currentWorkout.workDuration}
            restDuration={currentWorkout.restDuration}
            sets={currentWorkout.sets}
            onWorkDurationChange={setWorkDuration}
            onRestDurationChange={setRestDuration}
            onSetsChange={setSets}
            disabled={!timer.isIdle}
          />

          {/* Controls */}
          <TimerControls
            isIdle={timer.isIdle}
            isRunning={timer.isRunning}
            isPaused={timer.isPaused}
            isCompleted={timer.isCompleted}
            canStart={currentWorkout.exercise !== null}
            onStart={handleStart}
            onPause={timer.pause}
            onResume={timer.resume}
            onStop={handleStop}
          />
        </div>
      </main>

      {/* Rep Input Modal */}
      <RepInputModal
        isOpen={timer.isRepInput}
        setNumber={timer.context.currentSet}
        onSubmit={handleSubmitReps}
        onSkip={handleSkipRepInput}
      />
    </div>
  );
}

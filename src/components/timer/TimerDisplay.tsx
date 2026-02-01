import { formatTime } from '../../utils/formatTime';

interface TimerDisplayProps {
  timeRemaining: number;
  totalTime: number;
  phase: string;
  currentSet: number;
  totalSets: number;
  exerciseName?: string;
}

export function TimerDisplay({
  timeRemaining,
  totalTime,
  phase,
  currentSet,
  totalSets,
  exerciseName,
}: TimerDisplayProps) {
  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getPhaseColor = () => {
    switch (phase) {
      case 'getReady':
        return 'text-yellow-500';
      case 'working':
        return 'text-green-500';
      case 'resting':
        return 'text-blue-500';
      case 'completed':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStrokeColor = () => {
    switch (phase) {
      case 'getReady':
        return 'stroke-yellow-500';
      case 'working':
        return 'stroke-green-500';
      case 'resting':
        return 'stroke-blue-500';
      case 'completed':
        return 'stroke-purple-500';
      default:
        return 'stroke-gray-300';
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case 'idle':
        return 'Ready';
      case 'getReady':
        return 'Get Ready';
      case 'working':
        return 'Work!';
      case 'resting':
        return 'Rest';
      case 'paused':
        return 'Paused';
      case 'repInput':
        return 'Enter Reps';
      case 'completed':
        return 'Complete!';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Exercise Name */}
      {exerciseName && (
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {exerciseName}
        </h2>
      )}

      {/* Timer Circle */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={`${getStrokeColor()} transition-all duration-200`}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-sm font-medium uppercase tracking-wider ${getPhaseColor()}`}>
            {getPhaseLabel()}
          </span>
          <span className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mt-1">
            {formatTime(timeRemaining)}
          </span>
          {phase !== 'idle' && phase !== 'completed' && (
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Set {currentSet} of {totalSets}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

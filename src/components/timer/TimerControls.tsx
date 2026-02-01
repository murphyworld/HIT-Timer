import { Button } from '../common';

interface TimerControlsProps {
  isIdle: boolean;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  canStart: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function TimerControls({
  isIdle,
  isRunning,
  isPaused,
  isCompleted,
  canStart,
  onStart,
  onPause,
  onResume,
  onStop,
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {isIdle && (
        <Button
          size="lg"
          onClick={onStart}
          disabled={!canStart}
          className="px-12"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Start
        </Button>
      )}

      {isRunning && (
        <>
          <Button size="lg" variant="secondary" onClick={onPause}>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
            Pause
          </Button>
          <Button size="lg" variant="danger" onClick={onStop}>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
            Stop
          </Button>
        </>
      )}

      {isPaused && (
        <>
          <Button size="lg" onClick={onResume}>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Resume
          </Button>
          <Button size="lg" variant="danger" onClick={onStop}>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
            Stop
          </Button>
        </>
      )}

      {isCompleted && (
        <>
          <Button size="lg" onClick={onStart}>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
            </svg>
            Restart
          </Button>
          <Button size="lg" variant="secondary" onClick={onStop}>
            Done
          </Button>
        </>
      )}
    </div>
  );
}

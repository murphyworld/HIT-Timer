import { Card, NumberInput } from '../common';

interface TimerConfigProps {
  workDuration: number;
  restDuration: number;
  sets: number;
  onWorkDurationChange: (value: number) => void;
  onRestDurationChange: (value: number) => void;
  onSetsChange: (value: number) => void;
  disabled?: boolean;
}

export function TimerConfig({
  workDuration,
  restDuration,
  sets,
  onWorkDurationChange,
  onRestDurationChange,
  onSetsChange,
  disabled = false,
}: TimerConfigProps) {
  return (
    <Card className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <div className="grid grid-cols-3 gap-4">
        <NumberInput
          value={workDuration}
          onChange={onWorkDurationChange}
          min={5}
          max={300}
          step={5}
          label="Work"
          unit="sec"
        />
        <NumberInput
          value={restDuration}
          onChange={onRestDurationChange}
          min={5}
          max={120}
          step={5}
          label="Rest"
          unit="sec"
        />
        <NumberInput
          value={sets}
          onChange={onSetsChange}
          min={1}
          max={20}
          label="Sets"
        />
      </div>
    </Card>
  );
}

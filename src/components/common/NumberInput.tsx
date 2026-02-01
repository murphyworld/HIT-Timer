interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  label,
  unit,
}: NumberInputProps) {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xl disabled:opacity-50 active:scale-95 transition-transform"
        >
          -
        </button>
        <div className="flex-1 text-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </span>
          {unit && (
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
              {unit}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xl disabled:opacity-50 active:scale-95 transition-transform"
        >
          +
        </button>
      </div>
    </div>
  );
}

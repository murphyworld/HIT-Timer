import type { MuscleGroup } from '../../types';
import { MUSCLE_GROUP_COLORS, MUSCLE_GROUP_LABELS } from '../../constants/exercises';

interface CategoryFilterProps {
  selected: MuscleGroup | 'all';
  onSelect: (category: MuscleGroup | 'all') => void;
}

const CATEGORIES: Array<MuscleGroup | 'all'> = [
  'all',
  'push',
  'pull',
  'legs',
  'core',
  'cardio',
  'full-body',
];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            selected === category
              ? 'text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          style={
            selected === category
              ? {
                  backgroundColor:
                    category === 'all' ? '#3b82f6' : MUSCLE_GROUP_COLORS[category],
                }
              : undefined
          }
        >
          {category === 'all' ? 'All' : MUSCLE_GROUP_LABELS[category]}
        </button>
      ))}
    </div>
  );
}

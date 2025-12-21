import type { DifficultyLevel } from '../types';

interface DifficultySelectorProps {
  currentDifficulty: DifficultyLevel;
  onChange: (difficulty: DifficultyLevel) => void;
  size?: 'sm' | 'md';
}

const difficulties: { value: DifficultyLevel; label: string }[] = [
  { value: 'easier', label: 'Easier' },
  { value: 'normal', label: 'Normal' },
  { value: 'harder', label: 'Harder' },
];

export function DifficultySelector({
  currentDifficulty,
  onChange,
  size = 'md',
}: DifficultySelectorProps) {
  const baseClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  const getButtonClasses = (difficulty: DifficultyLevel) => {
    const isSelected = currentDifficulty === difficulty;
    const base = `${baseClasses} font-medium transition-all`;

    if (difficulty === 'easier') {
      return `${base} ${
        isSelected
          ? 'bg-green-500 text-white'
          : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
      }`;
    }
    if (difficulty === 'normal') {
      return `${base} ${
        isSelected
          ? 'bg-blue-500 text-white'
          : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
      }`;
    }
    // harder
    return `${base} ${
      isSelected
        ? 'bg-orange-500 text-white'
        : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'
    }`;
  };

  return (
    <div className="inline-flex rounded-lg overflow-hidden border border-slate-600">
      {difficulties.map((diff, idx) => (
        <button
          key={diff.value}
          onClick={() => onChange(diff.value)}
          className={`${getButtonClasses(diff.value)} ${
            idx > 0 ? 'border-l border-slate-600' : ''
          }`}
        >
          {diff.label}
        </button>
      ))}
    </div>
  );
}

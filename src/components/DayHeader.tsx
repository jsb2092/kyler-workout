import { Pencil } from 'lucide-react';
import { isRestDay } from '../data/workouts';
import type { DayName, DifficultyLevel, WorkoutDay } from '../types';
import { DifficultySelector } from './DifficultySelector';

interface DayHeaderProps {
  day: DayName;
  workout: WorkoutDay;
  isCustomized: boolean;
  onBack: () => void;
  onEdit: () => void;
  dayDifficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
}

export function DayHeader({ day, workout, isCustomized, onBack, onEdit, dayDifficulty, onDifficultyChange }: DayHeaderProps) {
  const showDifficulty = !isRestDay(day);

  return (
    <>
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300"
      >
        ← Back to Day Selection
      </button>
      <div className={`${workout.color} rounded-xl p-6 mb-6 shadow-lg relative`}>
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          aria-label="Edit workout"
        >
          <Pencil className="w-5 h-5" />
        </button>
        <h2 className="text-3xl font-bold mb-2">
          {workout.name}
          {isCustomized && (
            <span className="ml-2 text-sm font-normal bg-white/20 px-2 py-1 rounded">
              Customized
            </span>
          )}
        </h2>
        <p className="text-xl opacity-90">{workout.title}</p>
        {showDifficulty && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm opacity-75">Difficulty:</span>
            <DifficultySelector
              currentDifficulty={dayDifficulty}
              onChange={onDifficultyChange}
            />
          </div>
        )}
      </div>
    </>
  );
}

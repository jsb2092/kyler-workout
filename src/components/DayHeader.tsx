import { workoutData, isRestDay } from '../data/workouts';
import type { DayName, DifficultyLevel } from '../types';
import { DifficultySelector } from './DifficultySelector';

interface DayHeaderProps {
  day: DayName;
  onBack: () => void;
  dayDifficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
}

export function DayHeader({ day, onBack, dayDifficulty, onDifficultyChange }: DayHeaderProps) {
  const workout = workoutData[day];
  const showDifficulty = !isRestDay(day);

  return (
    <>
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300"
      >
        ← Back to Day Selection
      </button>
      <div className={`${workout.color} rounded-xl p-6 mb-6 shadow-lg`}>
        <h2 className="text-3xl font-bold mb-2">{workout.name}</h2>
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

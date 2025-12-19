import { workoutData } from '../data/workouts';
import type { DayName } from '../types';

interface DayHeaderProps {
  day: DayName;
  onBack: () => void;
}

export function DayHeader({ day, onBack }: DayHeaderProps) {
  const workout = workoutData[day];

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
      </div>
    </>
  );
}

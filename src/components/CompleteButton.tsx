import type { DayName } from '../types';
import { isRestDay } from '../data/workouts';

interface CompleteButtonProps {
  day: DayName;
  streak: number;
  completedToday: DayName | null;
  onComplete: () => void;
}

export function CompleteButton({ day, streak, completedToday, onComplete }: CompleteButtonProps) {
  const isRest = isRestDay(day);
  const alreadyCompleted = completedToday === day;

  if (alreadyCompleted) {
    return (
      <div className="mt-6">
        <div className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl text-xl shadow-lg flex items-center justify-center gap-3 opacity-75">
          <span className="text-2xl">✓</span>
          {isRest ? 'Rest Day Logged!' : 'Workout Complete!'}
          <span className="text-2xl">🎉</span>
        </div>
        {streak > 0 && (
          <p className="text-center text-slate-400 mt-2">
            Current streak: {streak} day{streak !== 1 ? 's' : ''} 🔥
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        onClick={onComplete}
        className={`w-full ${
          isRest
            ? 'bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600'
            : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
        } text-white font-bold py-4 px-6 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-3`}
      >
        <span className="text-2xl">✓</span>
        {isRest ? 'Rest Day Complete!' : 'I Completed My Workout!'}
        <span className="text-2xl">{isRest ? '😴' : '💪'}</span>
      </button>
      {streak > 0 && (
        <p className="text-center text-slate-400 mt-2">
          Current streak: {streak} day{streak !== 1 ? 's' : ''} 🔥
        </p>
      )}
    </div>
  );
}

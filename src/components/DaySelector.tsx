import { Calendar } from 'lucide-react';
import { workoutData, days } from '../data/workouts';
import type { DayName } from '../types';

interface DaySelectorProps {
  onSelectDay: (day: DayName) => void;
}

export function DaySelector({ onSelectDay }: DaySelectorProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold">Select Your Workout Day</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => onSelectDay(day)}
            className={`${workoutData[day].color} hover:opacity-90 transition-all p-6 rounded-xl shadow-lg transform hover:scale-105 text-left`}
          >
            <div className="text-xl font-bold mb-1">{workoutData[day].name}</div>
            <div className="text-sm opacity-90">{workoutData[day].title}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

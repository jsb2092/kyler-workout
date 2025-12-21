import { Calendar, Check } from 'lucide-react';
import { workoutData, days } from '../data/workouts';
import type { DayName } from '../types';
import { getTodayDayName } from '../database';

interface DaySelectorProps {
  onSelectDay: (day: DayName) => void;
  weekCompletions: Set<DayName>;
}

export function DaySelector({ onSelectDay, weekCompletions }: DaySelectorProps) {
  const today = getTodayDayName();

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold">Select Your Workout Day</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {days.map((day) => {
          const isCompleted = weekCompletions.has(day);
          const isToday = day === today;

          return (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              className={`${workoutData[day].color} hover:opacity-90 transform hover:scale-105 transition-all p-6 rounded-xl shadow-lg text-left relative`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold mb-1 flex items-center gap-2">
                    {workoutData[day].name}
                    {isToday && (
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Today</span>
                    )}
                  </div>
                  <div className="text-sm opacity-90">{workoutData[day].title}</div>
                </div>
                {isCompleted && (
                  <div className="bg-green-500 rounded-full p-2">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

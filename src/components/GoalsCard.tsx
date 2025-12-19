import { Target } from 'lucide-react';

const GOALS = ['Pull-ups', 'L-Sit', 'Core Strength', 'Push-ups', 'Upper & Lower Body'];

export function GoalsCard() {
  return (
    <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold">Your Goals</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {GOALS.map((goal, i) => (
          <div key={i} className="flex items-center gap-2 text-slate-300">
            <span className="text-2xl">🎯</span>
            <span>{goal}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Target, Pencil } from 'lucide-react';

interface GoalsCardProps {
  goals: string[];
  onEdit: () => void;
}

export function GoalsCard({ goals, onEdit }: GoalsCardProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold">Your Goals</h2>
        </div>
        <button
          onClick={onEdit}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          aria-label="Edit goals"
        >
          <Pencil className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {goals.map((goal, i) => (
          <div key={i} className="flex items-center gap-2 text-slate-300">
            <span className="text-2xl">🎯</span>
            <span>{goal}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

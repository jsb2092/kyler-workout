import { Dumbbell } from 'lucide-react';

interface HeaderProps {
  streak: number;
  showCelebration: boolean;
}

export function Header({ streak, showCelebration }: HeaderProps) {
  return (
    <div className="text-center mb-8 pt-6">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Dumbbell className="w-10 h-10 text-blue-400" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Workout Planner
        </h1>
      </div>
      <p className="text-slate-400 text-lg">Your personalized weekly training program</p>
      {streak > 0 && (
        <div className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 px-4 py-2 rounded-full">
          <span className="text-2xl">🔥</span>
          <span className="text-orange-400 font-bold">{streak} Day Streak!</span>
        </div>
      )}
      {showCelebration && (
        <div className="mt-3 animate-bounce text-2xl">🎉 Workout Complete! Keep it up! 🎉</div>
      )}
    </div>
  );
}

import { Dumbbell, Coins, Snowflake, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  streak: number;
  showCelebration: boolean;
  points: number;
  streakFreezes: number;
  onOpenShop: () => void;
}

export function Header({ streak, showCelebration, points, streakFreezes, onOpenShop }: HeaderProps) {
  return (
    <div className="mb-8 pt-6">
      <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Dumbbell className="w-10 h-10 text-theme-accent-400" />
          <h1 className="text-4xl font-bold text-theme-accent-500">
            Workout Planner
          </h1>
        </div>
        <p className="text-theme-text-muted text-lg">Your personalized weekly training program</p>
      </div>

      {/* Points, Freezes, and Shop - centered row */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 px-3 py-1.5 rounded-full">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span className="text-yellow-500 font-bold">{points}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-cyan-500/20 border border-cyan-500/30 px-3 py-1.5 rounded-full">
          <Snowflake className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-400 font-bold">{streakFreezes}</span>
        </div>
        <button
          onClick={onOpenShop}
          className="flex items-center gap-1.5 bg-theme-accent-500/20 border border-theme-accent-500/30 px-3 py-1.5 rounded-full hover:bg-theme-accent-500/30 transition-colors"
        >
          <ShoppingBag className="w-4 h-4 text-theme-accent-500" />
          <span className="text-theme-accent-500 font-bold">Shop</span>
        </button>
      </div>

      {/* Streak and celebration - centered */}
      <div className="text-center">
        {streak > 0 && (
          <div className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 px-4 py-2 rounded-full">
            <span className="text-2xl">🔥</span>
            <span className="text-orange-400 font-bold">{streak} Day Streak!</span>
          </div>
        )}
        {showCelebration && (
          <div className="mt-3 animate-bounce text-2xl">Workout Complete! Keep it up!</div>
        )}
      </div>
    </div>
  );
}

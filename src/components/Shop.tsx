import { X, Coins, Snowflake, ShoppingBag } from 'lucide-react';

interface ShopProps {
  points: number;
  streakFreezes: number;
  freezeCost: number;
  onPurchaseFreeze: () => Promise<boolean>;
  onClose: () => void;
}

export function Shop({ points, streakFreezes, freezeCost, onPurchaseFreeze, onClose }: ShopProps) {
  const canAfford = points >= freezeCost;

  const handlePurchase = async () => {
    const success = await onPurchaseFreeze();
    if (!success) {
      // Could show an error, but the button should be disabled anyway
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-theme-bg-secondary rounded-2xl max-w-sm w-full border border-theme-border shadow-2xl">
        <div className="flex justify-between items-center p-6 pb-4 border-b border-theme-border">
          <h3 className="text-xl font-bold text-theme-text-primary flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-theme-accent-400" />
            Shop
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-theme-bg-tertiary rounded-full">
            <X className="w-6 h-6 text-theme-text-primary" />
          </button>
        </div>

        <div className="p-6">
          {/* Current Balance */}
          <div className="flex items-center justify-between mb-6 p-4 bg-theme-bg-tertiary rounded-xl">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="text-theme-text-secondary">Your Points</span>
            </div>
            <span className="text-2xl font-bold text-yellow-500">{points}</span>
          </div>

          {/* Current Freezes */}
          <div className="flex items-center justify-between mb-6 p-4 bg-theme-bg-tertiary rounded-xl">
            <div className="flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-cyan-400" />
              <span className="text-theme-text-secondary">Streak Freezes</span>
            </div>
            <span className="text-2xl font-bold text-cyan-400">{streakFreezes}</span>
          </div>

          {/* Shop Items */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-theme-text-secondary">Available Items</h4>

            <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                  <Snowflake className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-theme-text-primary">Streak Freeze</h5>
                  <p className="text-sm text-theme-text-muted mb-3">
                    Automatically saves your streak if you miss a day
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Coins className="w-4 h-4" />
                      <span className="font-bold">{freezeCost}</span>
                    </div>
                    <button
                      onClick={handlePurchase}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        canAfford
                          ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                          : 'bg-theme-bg-tertiary text-theme-text-muted cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Buy' : 'Not enough points'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Earn points info */}
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <h5 className="font-semibold text-yellow-500 mb-1">How to earn points</h5>
            <p className="text-sm text-theme-text-muted">
              Complete your daily workout to earn <span className="text-yellow-500 font-bold">10 points</span>.
              Points add up as you build your streak!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

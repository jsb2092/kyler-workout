import { Timer, X, Play, Pause, RotateCcw } from 'lucide-react';

interface StopwatchProps {
  elapsedTime: number;
  isRunning: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onReset: () => void;
  onOpenChange: (open: boolean) => void;
  formatTime: (ms: number) => { minutes: string; seconds: string; centiseconds: string };
}

export function Stopwatch({ elapsedTime, isRunning, isOpen, onToggle, onReset, onOpenChange, formatTime }: StopwatchProps) {

  const time = formatTime(elapsedTime);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => onOpenChange(true)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-theme-accent-500 hover:bg-theme-accent-600 text-white shadow-lg flex items-center justify-center transition-all"
      >
        <Timer className="w-6 h-6" />
        {isRunning && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Stopwatch Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-theme-bg-secondary rounded-2xl p-6 w-full max-w-sm border border-theme-border shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-theme-text-primary flex items-center gap-2">
                <Timer className="w-5 h-5 text-theme-accent-500" />
                Stopwatch
              </h2>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 hover:bg-theme-bg-tertiary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-theme-text-muted" />
              </button>
            </div>

            {/* Time Display */}
            <div className="text-center mb-8">
              <div className="font-mono text-5xl font-bold text-theme-text-primary tracking-wider">
                <span>{time.minutes}</span>
                <span className="text-theme-accent-500">:</span>
                <span>{time.seconds}</span>
                <span className="text-2xl text-theme-text-muted">.{time.centiseconds}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onReset}
                className="p-4 rounded-full bg-theme-bg-tertiary hover:bg-theme-bg-primary text-theme-text-secondary transition-colors"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              <button
                onClick={onToggle}
                className={`p-6 rounded-full text-white transition-colors ${
                  isRunning
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isRunning ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>

              <button
                onClick={() => onOpenChange(false)}
                className="p-4 rounded-full bg-theme-bg-tertiary hover:bg-theme-bg-primary text-theme-text-secondary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tip */}
            <p className="text-center text-theme-text-muted text-sm mt-6">
              Stopwatch keeps running when minimized
            </p>
          </div>
        </div>
      )}
    </>
  );
}

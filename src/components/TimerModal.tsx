import { Timer, X, Play, Pause, RotateCcw } from 'lucide-react';
import type { TimerData, TimerType } from '../types';

interface TimerModalProps {
  timerData: TimerData;
  timerType: TimerType;
  currentExerciseIndex: number;
  timeRemaining: number;
  isPaused: boolean;
  isComplete: boolean;
  onClose: () => void;
  onTogglePause: () => void;
  onReset: () => void;
  formatTime: (seconds: number) => string;
  getProgress: () => number;
}

export function TimerModal({
  timerData,
  timerType,
  currentExerciseIndex,
  timeRemaining,
  isPaused,
  isComplete,
  onClose,
  onTogglePause,
  onReset,
  formatTime,
  getProgress,
}: TimerModalProps) {
  const colorConfig = {
    warmup: {
      icon: 'text-green-400',
      border: 'border-green-500/40',
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-400',
    },
    cooldown: {
      icon: 'text-blue-400',
      border: 'border-blue-500/40',
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      gradient: 'bg-gradient-to-r from-blue-500 to-cyan-400',
    },
    exercise: {
      icon: 'text-yellow-400',
      border: 'border-yellow-500/40',
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      gradient: 'bg-gradient-to-r from-yellow-500 to-orange-400',
    },
  };

  const config = colorConfig[timerType];
  const timerLabel = timerType === 'warmup' ? 'Warm-Up' : timerType === 'cooldown' ? 'Cool-Down' : 'Exercise';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-600 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Timer className={`w-6 h-6 ${config.icon}`} />
            {timerLabel} Timer
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="text-center mb-6">
          <div
            className={`text-5xl font-mono font-bold mb-2 ${
              timeRemaining <= 5 && timeRemaining > 0 ? 'text-red-400 animate-pulse' : 'text-slate-300'
            }`}
          >
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-slate-500 mb-6">{timerData.timePerExercise}s per exercise</div>
          <div className={`${config.bg} border-2 ${config.border} rounded-xl p-6 mb-4`}>
            <div className="text-sm text-slate-400 mb-2">
              Exercise {currentExerciseIndex + 1} of {timerData.exercises.length}
            </div>
            <div className={`text-4xl font-bold ${config.text} min-h-[80px] flex items-center justify-center`}>
              {timerData.exercises[currentExerciseIndex]}
            </div>
          </div>
          {currentExerciseIndex < timerData.exercises.length - 1 && !isComplete && (
            <div className="text-sm text-slate-500">
              Next: <span className="text-slate-300">{timerData.exercises[currentExerciseIndex + 1]}</span>
            </div>
          )}
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 mb-6 overflow-hidden">
          <div
            className={`${config.gradient} h-full transition-all duration-1000`}
            style={{ width: `${getProgress()}%` }}
          />
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={onTogglePause}
            className={`${
              isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'
            } p-4 rounded-full transition-colors`}
          >
            {isPaused ? <Play className="w-8 h-8" /> : <Pause className="w-8 h-8" />}
          </button>
          <button onClick={onReset} className="bg-slate-600 hover:bg-slate-500 p-4 rounded-full transition-colors">
            <RotateCcw className="w-8 h-8" />
          </button>
        </div>
        {isComplete && (
          <div className="mt-6 text-center text-green-400 text-xl font-bold animate-pulse">
            🎉 {timerLabel} Complete!
          </div>
        )}
      </div>
    </div>
  );
}

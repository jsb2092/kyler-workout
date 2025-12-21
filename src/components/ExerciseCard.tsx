import { ChevronDown, ChevronUp, Timer, TrendingUp } from 'lucide-react';
import type { Exercise, ExerciseVariant, DifficultyLevel } from '../types';
import { DifficultySelector } from './DifficultySelector';

interface ExerciseCardProps {
  exercise: Exercise;
  effectiveExercise: Exercise | ExerciseVariant;
  difficulty: DifficultyLevel;
  onDifficultyChange?: (difficulty: DifficultyLevel) => void;
  isExpanded: boolean;
  onToggle: () => void;
  onStartTimer: (exercise: Exercise, type: 'warmup' | 'cooldown') => void;
  onStartExerciseTimer: (exercise: Exercise) => void;
  hasTimedSets: (exercise: Exercise) => boolean;
}

export function ExerciseCard({
  exercise,
  effectiveExercise,
  difficulty,
  onDifficultyChange,
  isExpanded,
  onToggle,
  onStartTimer,
  onStartExerciseTimer,
  hasTimedSets,
}: ExerciseCardProps) {
  const borderClass = exercise.isWarmup
    ? 'border-green-500/30'
    : exercise.isCooldown
    ? 'border-blue-500/30'
    : exercise.isStretch
    ? 'border-purple-500/30'
    : 'border-slate-700';

  // Use effective exercise for display
  const displayName = effectiveExercise.name;
  const displaySets = effectiveExercise.sets ?? ('duration' in effectiveExercise ? effectiveExercise.duration : undefined);
  const displayMuscles = effectiveExercise.muscles;
  const displayDescription = effectiveExercise.description;

  // Show difficulty selector for exercises with variants
  const showDifficultySelector = exercise.hasVariants && onDifficultyChange;

  // Check if easier/harder are strings (tips) or full variants
  const hasStringTips = !exercise.hasVariants && (typeof exercise.easier === 'string' || typeof exercise.harder === 'string');

  return (
    <div className={`bg-slate-800 rounded-xl border ${borderClass} overflow-hidden`}>
      <button
        onClick={onToggle}
        className="w-full p-5 text-left hover:bg-slate-750 transition-colors flex items-center justify-between"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span className="text-lg font-semibold">{displayName}</span>
            {displaySets && (
              <span className="text-blue-400 text-sm font-medium px-3 py-1 bg-blue-400/10 rounded-full">
                {displaySets}
              </span>
            )}
            {difficulty !== 'normal' && exercise.hasVariants && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  difficulty === 'easier'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-orange-500/20 text-orange-400'
                }`}
              >
                {difficulty === 'easier' ? 'Easier' : 'Harder'}
              </span>
            )}
            {exercise.isWarmup && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartTimer(exercise, 'warmup');
                }}
                className="flex items-center gap-1 text-green-400 text-sm font-medium px-3 py-1 bg-green-400/10 rounded-full hover:bg-green-400/20 transition-colors"
              >
                <Timer className="w-4 h-4" />
                Start Timer
              </button>
            )}
            {exercise.isCooldown && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartTimer(exercise, 'cooldown');
                }}
                className="flex items-center gap-1 text-blue-400 text-sm font-medium px-3 py-1 bg-blue-400/10 rounded-full hover:bg-blue-400/20 transition-colors"
              >
                <Timer className="w-4 h-4" />
                Start Timer
              </button>
            )}
            {hasTimedSets(exercise) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartExerciseTimer(exercise);
                }}
                className="flex items-center gap-1 text-yellow-400 text-sm font-medium px-3 py-1 bg-yellow-400/10 rounded-full hover:bg-yellow-400/20 transition-colors"
              >
                <Timer className="w-4 h-4" />
                Start Timer
              </button>
            )}
          </div>
          <div className="text-slate-400 text-sm">{displayMuscles}</div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-700 pt-4">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">HOW TO DO IT</h4>
            <p className="text-slate-300 leading-relaxed">{displayDescription}</p>
          </div>

          {showDifficultySelector && (
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm text-slate-400">Adjust difficulty:</span>
              <DifficultySelector
                currentDifficulty={difficulty}
                onChange={onDifficultyChange}
                size="sm"
              />
            </div>
          )}

          {hasStringTips && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {typeof exercise.easier === 'string' && exercise.easier && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <span className="text-green-400 font-semibold text-sm">EASIER VERSION</span>
                  <p className="text-slate-300 text-sm mt-2">{exercise.easier}</p>
                </div>
              )}
              {typeof exercise.harder === 'string' && exercise.harder && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 font-semibold text-sm">HARDER VERSION</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-2">{exercise.harder}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

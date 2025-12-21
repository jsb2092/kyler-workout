import { workoutData } from '../data/workouts';
import { ExerciseCard } from './ExerciseCard';
import type { DayName, Exercise, ExerciseVariant, DifficultyLevel } from '../types';

interface ExerciseListProps {
  day: DayName;
  expandedExercise: number | null;
  onToggleExpand: (index: number | null) => void;
  onStartTimer: (exercise: Exercise, type: 'warmup' | 'cooldown') => void;
  onStartExerciseTimer: (exercise: Exercise) => void;
  hasTimedSets: (exercise: Exercise) => boolean;
  getEffectiveDifficulty: (exercise: Exercise) => DifficultyLevel;
  getEffectiveExercise: (exercise: Exercise) => Exercise | ExerciseVariant;
  onExerciseDifficultyChange: (exerciseId: string, difficulty: DifficultyLevel) => void;
}

export function ExerciseList({
  day,
  expandedExercise,
  onToggleExpand,
  onStartTimer,
  onStartExerciseTimer,
  hasTimedSets,
  getEffectiveDifficulty,
  getEffectiveExercise,
  onExerciseDifficultyChange,
}: ExerciseListProps) {
  const workout = workoutData[day];

  return (
    <div className="space-y-4">
      {workout.exercises.map((exercise, index) =>
        exercise.category ? (
          <div key={exercise.id} className="pt-4 first:pt-0">
            <h3 className="text-lg font-bold text-slate-300 border-b border-slate-600 pb-2 mb-2">
              {exercise.name}
            </h3>
          </div>
        ) : (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            effectiveExercise={getEffectiveExercise(exercise)}
            difficulty={getEffectiveDifficulty(exercise)}
            onDifficultyChange={
              exercise.hasVariants
                ? (diff) => onExerciseDifficultyChange(exercise.id, diff)
                : undefined
            }
            isExpanded={expandedExercise === index}
            onToggle={() => onToggleExpand(expandedExercise === index ? null : index)}
            onStartTimer={onStartTimer}
            onStartExerciseTimer={onStartExerciseTimer}
            hasTimedSets={hasTimedSets}
          />
        )
      )}
    </div>
  );
}

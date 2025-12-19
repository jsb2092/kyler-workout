import { workoutData } from '../data/workouts';
import { ExerciseCard } from './ExerciseCard';
import type { DayName, Exercise } from '../types';

interface ExerciseListProps {
  day: DayName;
  expandedExercise: number | null;
  onToggleExpand: (index: number | null) => void;
  onStartTimer: (exercise: Exercise, type: 'warmup' | 'cooldown') => void;
  onStartExerciseTimer: (exercise: Exercise) => void;
  hasTimedSets: (exercise: Exercise) => boolean;
}

export function ExerciseList({
  day,
  expandedExercise,
  onToggleExpand,
  onStartTimer,
  onStartExerciseTimer,
  hasTimedSets,
}: ExerciseListProps) {
  const workout = workoutData[day];

  return (
    <div className="space-y-4">
      {workout.exercises.map((exercise, index) =>
        exercise.category ? (
          <div key={index} className="pt-4 first:pt-0">
            <h3 className="text-lg font-bold text-slate-300 border-b border-slate-600 pb-2 mb-2">
              {exercise.name}
            </h3>
          </div>
        ) : (
          <ExerciseCard
            key={index}
            exercise={exercise}
            index={index}
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

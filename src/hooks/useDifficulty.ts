import { useState, useEffect, useCallback } from 'react';
import type { DayName, DifficultyLevel, Exercise, ExerciseVariant } from '../types';
import {
  getDayDifficulty,
  setDayDifficulty as saveDayDifficulty,
  getExerciseDifficulties,
  setExerciseDifficulty as saveExerciseDifficulty,
} from '../database';

interface UseDifficultyReturn {
  dayDifficulty: DifficultyLevel;
  exerciseDifficulties: Record<string, DifficultyLevel>;
  isLoading: boolean;
  setDayDifficulty: (difficulty: DifficultyLevel) => Promise<void>;
  setExerciseDifficulty: (exerciseId: string, difficulty: DifficultyLevel) => Promise<void>;
  getEffectiveDifficulty: (exercise: Exercise) => DifficultyLevel;
  getEffectiveExercise: (exercise: Exercise) => Exercise | ExerciseVariant;
}

export function useDifficulty(dayName: DayName | null): UseDifficultyReturn {
  const [dayDifficulty, setDayDifficultyState] = useState<DifficultyLevel>('normal');
  const [exerciseDifficulties, setExerciseDifficulties] = useState<Record<string, DifficultyLevel>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences when day changes
  useEffect(() => {
    if (dayName) {
      setIsLoading(true);
      Promise.all([
        getDayDifficulty(dayName),
        getExerciseDifficulties(dayName),
      ]).then(([dayDiff, exerciseDiffs]) => {
        setDayDifficultyState(dayDiff);
        setExerciseDifficulties(exerciseDiffs);
        setIsLoading(false);
      });
    } else {
      setDayDifficultyState('normal');
      setExerciseDifficulties({});
      setIsLoading(false);
    }
  }, [dayName]);

  const setDayDifficulty = useCallback(async (difficulty: DifficultyLevel) => {
    if (!dayName) return;
    setDayDifficultyState(difficulty);
    await saveDayDifficulty(dayName, difficulty);
  }, [dayName]);

  const setExerciseDifficulty = useCallback(async (exerciseId: string, difficulty: DifficultyLevel) => {
    if (!dayName) return;
    setExerciseDifficulties(prev => ({ ...prev, [exerciseId]: difficulty }));
    await saveExerciseDifficulty(dayName, exerciseId, difficulty);
  }, [dayName]);

  const getEffectiveDifficulty = useCallback((exercise: Exercise): DifficultyLevel => {
    // Exercise-level override takes precedence, then day-level
    return exerciseDifficulties[exercise.id] ?? dayDifficulty;
  }, [exerciseDifficulties, dayDifficulty]);

  const getEffectiveExercise = useCallback((exercise: Exercise): Exercise | ExerciseVariant => {
    const difficulty = getEffectiveDifficulty(exercise);

    // If normal or no variants, return the exercise as-is
    if (difficulty === 'normal' || !exercise.hasVariants) {
      return exercise;
    }

    // Get the variant
    const variant = difficulty === 'easier' ? exercise.easier : exercise.harder;

    // If variant is just a string tip (not a full variant), return original exercise
    if (typeof variant === 'string') {
      return exercise;
    }

    return variant;
  }, [getEffectiveDifficulty]);

  return {
    dayDifficulty,
    exerciseDifficulties,
    isLoading,
    setDayDifficulty,
    setExerciseDifficulty,
    getEffectiveDifficulty,
    getEffectiveExercise,
  };
}

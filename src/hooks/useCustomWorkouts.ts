import { useState, useEffect, useCallback } from 'react';
import type { DayName, Exercise, WorkoutData } from '../types';
import { workoutData as defaultWorkoutData } from '../data/workouts';
import {
  getCustomGoals,
  saveCustomGoals,
  resetCustomGoals,
  getAllCustomWorkouts,
  saveCustomWorkout,
  resetCustomWorkout,
  resetAllCustomizations,
} from '../database';

const DEFAULT_GOALS = ['Pull-ups', 'L-Sit', 'Core Strength', 'Push-ups', 'Upper & Lower Body'];

export function useCustomWorkouts() {
  const [goals, setGoals] = useState<string[]>(DEFAULT_GOALS);
  const [customWorkouts, setCustomWorkouts] = useState<Map<DayName, { title?: string; color?: string; exercises: Exercise[] }>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Load custom data on mount
  useEffect(() => {
    async function loadCustomData() {
      try {
        // Load custom goals
        const savedGoals = await getCustomGoals();
        if (savedGoals) {
          setGoals(savedGoals);
        }

        // Load custom workouts
        const savedWorkouts = await getAllCustomWorkouts();
        setCustomWorkouts(savedWorkouts);
      } catch (error) {
        console.error('Failed to load custom data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCustomData();
  }, []);

  // Get merged workout data (custom + defaults)
  const getWorkoutData = useCallback((): WorkoutData => {
    const result = { ...defaultWorkoutData };

    for (const [dayName, custom] of customWorkouts) {
      result[dayName] = {
        ...result[dayName],
        title: custom.title || result[dayName].title,
        color: custom.color || result[dayName].color,
        exercises: custom.exercises,
      };
    }

    return result;
  }, [customWorkouts]);

  // Check if a day has customizations
  const isCustomized = useCallback((dayName: DayName): boolean => {
    return customWorkouts.has(dayName);
  }, [customWorkouts]);

  // Save goals
  const handleSaveGoals = useCallback(async (newGoals: string[]) => {
    await saveCustomGoals(newGoals);
    setGoals(newGoals);
  }, []);

  // Reset goals to defaults
  const handleResetGoals = useCallback(async () => {
    await resetCustomGoals();
    setGoals(DEFAULT_GOALS);
  }, []);

  // Save workout for a day
  const handleSaveWorkout = useCallback(async (
    dayName: DayName,
    exercises: Exercise[],
    title?: string,
    color?: string
  ) => {
    await saveCustomWorkout({ dayName, exercises, title, color });
    setCustomWorkouts(prev => {
      const next = new Map(prev);
      next.set(dayName, { exercises, title, color });
      return next;
    });
  }, []);

  // Reset a single day to defaults
  const handleResetDay = useCallback(async (dayName: DayName) => {
    await resetCustomWorkout(dayName);
    setCustomWorkouts(prev => {
      const next = new Map(prev);
      next.delete(dayName);
      return next;
    });
  }, []);

  // Reset all customizations
  const handleResetAll = useCallback(async () => {
    await resetAllCustomizations();
    setGoals(DEFAULT_GOALS);
    setCustomWorkouts(new Map());
  }, []);

  return {
    goals,
    defaultGoals: DEFAULT_GOALS,
    workouts: getWorkoutData(),
    isLoading,
    isCustomized,
    saveGoals: handleSaveGoals,
    resetGoals: handleResetGoals,
    saveWorkout: handleSaveWorkout,
    resetDay: handleResetDay,
    resetAll: handleResetAll,
  };
}

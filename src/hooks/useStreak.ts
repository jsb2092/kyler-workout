import { useState, useEffect, useCallback } from 'react';
import {
  calculateStreak,
  markDayComplete,
  wasCompletedToday,
  getWeekStatus,
  checkAndUseFreezes,
  getUserData,
  buyStreakFreeze,
  getFreezeCost,
} from '../database';
import type { DayName } from '../types';
import { isRestDay } from '../data/workouts';

export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedToday, setCompletedToday] = useState<DayName | null>(null);
  const [weekCompletions, setWeekCompletions] = useState<Set<DayName>>(new Set());
  const [weekFrozen, setWeekFrozen] = useState<Set<DayName>>(new Set());
  const [points, setPoints] = useState(0);
  const [streakFreezes, setStreakFreezes] = useState(0);
  const [completionError, setCompletionError] = useState<string | null>(null);

  const refreshUserData = useCallback(async () => {
    const userData = await getUserData();
    setPoints(userData.points);
    setStreakFreezes(userData.streakFreezes);
  }, []);

  const refreshStreak = useCallback(async () => {
    const currentStreak = await calculateStreak();
    setStreak(currentStreak);
    const { completed, frozen } = await getWeekStatus();
    setWeekCompletions(completed);
    setWeekFrozen(frozen);
    await refreshUserData();
  }, [refreshUserData]);

  const checkCompletedToday = useCallback(async (day: DayName) => {
    const completed = await wasCompletedToday(day);
    setCompletedToday(completed ? day : null);
    return completed;
  }, []);

  const completeWorkout = useCallback(async (day: DayName): Promise<{ success: boolean; error?: string }> => {
    const alreadyCompleted = await wasCompletedToday(day);
    if (alreadyCompleted) {
      return { success: false, error: 'Already completed today!' };
    }

    const result = await markDayComplete(day, isRestDay(day));

    if (!result.success) {
      setCompletionError(result.error || 'Failed to complete workout');
      // Clear error after 5 seconds
      setTimeout(() => setCompletionError(null), 5000);
      return result;
    }

    await refreshStreak();
    setCompletedToday(day);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
    return { success: true };
  }, [refreshStreak]);

  const purchaseFreeze = useCallback(async (): Promise<boolean> => {
    const success = await buyStreakFreeze();
    if (success) {
      await refreshUserData();
    }
    return success;
  }, [refreshUserData]);

  // Initial load - check for missed days and use freezes if needed
  useEffect(() => {
    const initStreak = async () => {
      // First check and use freezes for any missed days
      await checkAndUseFreezes();
      // Then refresh streak (which will be accurate now)
      await refreshStreak();
    };
    initStreak();
  }, [refreshStreak]);

  return {
    streak,
    showCelebration,
    completedToday,
    weekCompletions,
    weekFrozen,
    points,
    streakFreezes,
    freezeCost: getFreezeCost(),
    completionError,
    completeWorkout,
    checkCompletedToday,
    refreshStreak,
    purchaseFreeze,
  };
}

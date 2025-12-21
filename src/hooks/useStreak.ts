import { useState, useEffect, useCallback } from 'react';
import { calculateStreak, markDayComplete, wasCompletedToday, getWeekCompletions } from '../database';
import type { DayName } from '../types';
import { isRestDay } from '../data/workouts';

export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedToday, setCompletedToday] = useState<DayName | null>(null);
  const [weekCompletions, setWeekCompletions] = useState<Set<DayName>>(new Set());

  const refreshStreak = useCallback(async () => {
    const currentStreak = await calculateStreak();
    setStreak(currentStreak);
    const completions = await getWeekCompletions();
    setWeekCompletions(completions);
  }, []);

  const checkCompletedToday = useCallback(async (day: DayName) => {
    const completed = await wasCompletedToday(day);
    setCompletedToday(completed ? day : null);
    return completed;
  }, []);

  const completeWorkout = useCallback(async (day: DayName) => {
    const alreadyCompleted = await wasCompletedToday(day);
    if (alreadyCompleted) return;

    await markDayComplete(day, isRestDay(day));
    await refreshStreak();
    setCompletedToday(day);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  }, [refreshStreak]);

  useEffect(() => {
    refreshStreak();
  }, [refreshStreak]);

  return {
    streak,
    showCelebration,
    completedToday,
    weekCompletions,
    completeWorkout,
    checkCompletedToday,
    refreshStreak,
  };
}

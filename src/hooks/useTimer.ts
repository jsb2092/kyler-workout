import { useState, useEffect, useCallback } from 'react';
import type { TimerData, TimerType, Exercise } from '../types';

export function useTimer() {
  const [timerActive, setTimerActive] = useState(false);
  const [timerData, setTimerData] = useState<TimerData | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timerType, setTimerType] = useState<TimerType>('warmup');

  const parseExercises = (name: string, type: TimerType): string[] => {
    const prefix = type === 'warmup' ? 'Warm-up:' : 'Cool-down:';
    const parts = name.replace(prefix, '').split(',').map(e => e.trim()).filter(e => e);
    return parts.length > 0 ? parts : [name];
  };

  const parseDuration = (durationStr?: string): number | null => {
    if (!durationStr) return null;
    const match = durationStr.match(/(\d+)(?:-(\d+))?\s*sec/);
    if (match) {
      const firstNum = match[1];
      const secondNum = match[2];
      if (secondNum) return parseInt(secondNum, 10);
      if (firstNum) return parseInt(firstNum, 10);
    }
    const minMatch = durationStr.match(/(\d+)\s*min/);
    if (minMatch && minMatch[1]) return parseInt(minMatch[1], 10) * 60;
    return null;
  };

  const startTimer = useCallback((exercise: Exercise, type: TimerType = 'warmup') => {
    const exercises = parseExercises(exercise.name, type);
    const timePerExercise = Math.floor(120 / exercises.length);
    setTimerData({ exercises, timePerExercise, totalTime: 120 });
    setCurrentExerciseIndex(0);
    setTimeRemaining(timePerExercise);
    setIsPaused(false);
    setTimerType(type);
    setTimerActive(true);
  }, []);

  const startExerciseTimer = useCallback((exercise: Exercise) => {
    const duration = parseDuration(exercise.sets || exercise.duration);
    if (!duration) return;
    setTimerData({ exercises: [exercise.name], timePerExercise: duration, totalTime: duration });
    setCurrentExerciseIndex(0);
    setTimeRemaining(duration);
    setIsPaused(false);
    setTimerType('exercise');
    setTimerActive(true);
  }, []);

  const closeTimer = useCallback(() => {
    setTimerActive(false);
    setTimerData(null);
    setCurrentExerciseIndex(0);
    setTimeRemaining(0);
    setIsPaused(false);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerData) {
      setCurrentExerciseIndex(0);
      setTimeRemaining(timerData.timePerExercise);
      setIsPaused(false);
    }
  }, [timerData]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (!timerData) return 0;
    const elapsed = (timerData.timePerExercise - timeRemaining) + (currentExerciseIndex * timerData.timePerExercise);
    return (elapsed / timerData.totalTime) * 100;
  };

  const hasTimedSets = (exercise: Exercise): boolean => {
    const str = exercise.sets || exercise.duration || '';
    return str.includes('sec') && !exercise.isWarmup && !exercise.isCooldown && !exercise.isStretch;
  };

  const isComplete = timerData && currentExerciseIndex === timerData.exercises.length - 1 && timeRemaining === 0;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
    } else if (timerActive && !isPaused && timeRemaining === 0 && timerData) {
      if (currentExerciseIndex < timerData.exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setTimeRemaining(timerData.timePerExercise);
      } else {
        setIsPaused(true);
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, isPaused, timeRemaining, currentExerciseIndex, timerData]);

  return {
    timerActive,
    timerData,
    currentExerciseIndex,
    timeRemaining,
    isPaused,
    timerType,
    isComplete,
    startTimer,
    startExerciseTimer,
    closeTimer,
    resetTimer,
    togglePause,
    formatTime,
    getProgress,
    hasTimedSets,
  };
}

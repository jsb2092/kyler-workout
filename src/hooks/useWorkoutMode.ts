import { useState, useEffect, useCallback } from 'react';

export type WorkoutMode = 'standard' | 'senior';

const STORAGE_KEY = 'workout-mode';

function getStoredMode(): WorkoutMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'standard' || stored === 'senior') {
      return stored;
    }
  } catch {
    // Ignore parse errors
  }
  return 'standard';
}

export function useWorkoutMode() {
  const [mode, setModeState] = useState<WorkoutMode>(getStoredMode);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const setMode = useCallback((newMode: WorkoutMode) => {
    setModeState(newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState(prev => prev === 'standard' ? 'senior' : 'standard');
  }, []);

  return {
    mode,
    setMode,
    toggleMode,
  };
}

import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';
export type ThemeColor = 'blue' | 'green' | 'purple' | 'red' | 'orange';

export const THEME_COLORS: ThemeColor[] = ['blue', 'green', 'purple', 'red', 'orange'];

export const COLOR_DISPLAY_NAMES: Record<ThemeColor, string> = {
  blue: 'Blue',
  green: 'Green',
  purple: 'Purple',
  red: 'Red',
  orange: 'Orange',
};

export const COLOR_HEX: Record<ThemeColor, string> = {
  blue: '#3b82f6',
  green: '#22c55e',
  purple: '#a855f7',
  red: '#ef4444',
  orange: '#f97316',
};

interface Theme {
  mode: ThemeMode;
  color: ThemeColor;
}

const STORAGE_KEY = 'app-theme';

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        mode: parsed.mode === 'light' ? 'light' : 'dark',
        color: THEME_COLORS.includes(parsed.color) ? parsed.color : 'blue',
      };
    }
  } catch {
    // Ignore parse errors
  }
  return { mode: 'dark', color: 'blue' };
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-mode', theme.mode);
  document.documentElement.setAttribute('data-color', theme.color);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  // Apply theme on mount and changes
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  }, [theme]);

  const setMode = (mode: ThemeMode) => {
    setTheme(prev => ({ ...prev, mode }));
  };

  const setColor = (color: ThemeColor) => {
    setTheme(prev => ({ ...prev, color }));
  };

  const toggleMode = () => {
    setTheme(prev => ({ ...prev, mode: prev.mode === 'dark' ? 'light' : 'dark' }));
  };

  return {
    mode: theme.mode,
    color: theme.color,
    setMode,
    setColor,
    toggleMode,
  };
}

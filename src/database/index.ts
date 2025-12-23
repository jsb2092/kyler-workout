import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { DayName, WorkoutCompletion, DifficultyPreference, DifficultyLevel, CustomGoals, CustomWorkout, UserData } from '../types';

interface WorkoutDB extends DBSchema {
  completions: {
    key: number;
    value: WorkoutCompletion;
    indexes: {
      'by-date': string;
      'by-day': string;
    };
  };
  difficultyPreferences: {
    key: number;
    value: DifficultyPreference;
    indexes: {
      'by-day': string;
      'by-day-exercise': string;
    };
  };
  customGoals: {
    key: number;
    value: CustomGoals;
  };
  customWorkouts: {
    key: number;
    value: CustomWorkout;
    indexes: {
      'by-day': DayName;
    };
  };
  userData: {
    key: number;
    value: UserData;
  };
}

const DB_NAME = 'kyler-workout-db';
const DB_VERSION = 5;

let dbPromise: Promise<IDBPDatabase<WorkoutDB>> | null = null;

export async function initDatabase(): Promise<IDBPDatabase<WorkoutDB>> {
  if (!dbPromise) {
    dbPromise = openDB<WorkoutDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const store = db.createObjectStore('completions', {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('by-date', 'completedDate');
          store.createIndex('by-day', 'dayName');
        }
        if (oldVersion < 2) {
          const prefStore = db.createObjectStore('difficultyPreferences', {
            keyPath: 'id',
            autoIncrement: true,
          });
          prefStore.createIndex('by-day', 'dayName');
          prefStore.createIndex('by-day-exercise', ['dayName', 'exerciseId']);
        }
        if (oldVersion < 3) {
          db.createObjectStore('customGoals', {
            keyPath: 'id',
            autoIncrement: true,
          });
          const workoutStore = db.createObjectStore('customWorkouts', {
            keyPath: 'id',
            autoIncrement: true,
          });
          workoutStore.createIndex('by-day', 'dayName');
        }
        if (oldVersion < 5) {
          db.createObjectStore('userData', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      },
    });
  }
  return dbPromise;
}

export async function markDayComplete(dayName: DayName, isRestDay: boolean): Promise<{ success: boolean; error?: string }> {
  // Only allow completing today's workout
  const today = getTodayDayName();
  if (dayName !== today) {
    return { success: false, error: `You can only complete ${today}'s workout today.` };
  }

  const db = await initDatabase();
  const todayDate = getLocalDateString(getCurrentDate());

  // Check if already completed today
  const existing = await db.getAllFromIndex('completions', 'by-date', todayDate);
  const alreadyCompleted = existing.some(c => c.dayName === dayName);

  if (alreadyCompleted) {
    return { success: false, error: 'Already completed today!' };
  }

  // Add completion
  await db.add('completions', {
    dayName,
    completedDate: todayDate,
    isRestDay,
    createdAt: new Date().toISOString(),
  });

  // Award 10 points for completing a workout
  await addPoints(10);

  return { success: true };
}

export async function getCompletionHistory(limit: number = 30): Promise<WorkoutCompletion[]> {
  const db = await initDatabase();
  const all = await db.getAllFromIndex('completions', 'by-date');
  // Sort by date descending and limit
  return all.sort((a, b) => b.completedDate.localeCompare(a.completedDate)).slice(0, limit);
}

export async function wasCompletedToday(dayName: DayName): Promise<boolean> {
  const db = await initDatabase();
  // Check if this day was completed for its expected date this week
  const expectedDate = getMostRecentDateForDay(dayName);
  const completions = await db.getAllFromIndex('completions', 'by-date', expectedDate);
  return completions.some(c => c.dayName === dayName);
}

// JS day mapping: 0=Sun, 1=Mon, ..., 6=Sat
const JS_DAY_NAMES: DayName[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// Dev mode date override (only works in development)
// Persisted to localStorage so it survives refresh
let devDateOverride: Date | null = null;

// Initialize from localStorage on module load
if (import.meta.env.DEV) {
  const stored = localStorage.getItem('dev-date-override');
  if (stored) {
    devDateOverride = new Date(stored);
  }
}

export function setDevDateOverride(date: Date | null): void {
  if (import.meta.env.DEV) {
    devDateOverride = date;
    if (date) {
      localStorage.setItem('dev-date-override', date.toISOString());
    } else {
      localStorage.removeItem('dev-date-override');
    }
  }
}

export function getDevDateOverride(): Date | null {
  return import.meta.env.DEV ? devDateOverride : null;
}

// Get the current date (respects dev override)
function getCurrentDate(): Date {
  if (import.meta.env.DEV && devDateOverride) {
    return new Date(devDateOverride);
  }
  return new Date();
}

// Get local date string in YYYY-MM-DD format (not UTC)
function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Parse a YYYY-MM-DD string as local date (not UTC)
function parseLocalDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year!, month! - 1, day!);
}

// Get today's day name
export function getTodayDayName(): DayName {
  return JS_DAY_NAMES[getCurrentDate().getDay()]!;
}

// Get the most recent date for a given day of the week
// If that day is today, returns today. Otherwise returns the most recent past occurrence.
export function getMostRecentDateForDay(dayName: DayName): string {
  const today = getCurrentDate();
  const todayDayIndex = today.getDay();
  const targetDayIndex = JS_DAY_NAMES.indexOf(dayName);

  let daysAgo = todayDayIndex - targetDayIndex;
  if (daysAgo < 0) {
    daysAgo += 7; // wrap around to previous week
  }

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() - daysAgo);

  return getLocalDateString(targetDate);
}

// Get all days completed or frozen in the current week cycle
// Returns both completed days and frozen days separately
export async function getWeekStatus(): Promise<{ completed: Set<DayName>; frozen: Set<DayName> }> {
  const db = await initDatabase();
  const all = await db.getAll('completions');
  const userData = await getUserData();
  const completed = new Set<DayName>();
  const frozen = new Set<DayName>();

  // Build a map of each day's most recent expected date
  const weekDates: Record<string, string> = {};
  for (const dayName of JS_DAY_NAMES) {
    weekDates[dayName] = getMostRecentDateForDay(dayName);
  }

  // Create a set of frozen dates for fast lookup
  const frozenDates = new Set(userData.freezesUsed);

  for (const dayName of JS_DAY_NAMES) {
    const expectedDate = weekDates[dayName]!;
    const wasCompleted = all.some(c => c.dayName === dayName && c.completedDate === expectedDate);
    const wasFrozen = frozenDates.has(expectedDate);

    if (wasCompleted) {
      completed.add(dayName);
    } else if (wasFrozen) {
      frozen.add(dayName);
    }
  }

  // If all 7 days are complete/frozen, reset for a new week cycle
  if (completed.size + frozen.size === 7) {
    return { completed: new Set<DayName>(), frozen: new Set<DayName>() };
  }

  return { completed, frozen };
}

// Legacy function for backwards compatibility
export async function getWeekCompletions(): Promise<Set<DayName>> {
  const { completed } = await getWeekStatus();
  return completed;
}

export async function calculateStreak(): Promise<number> {
  const db = await initDatabase();
  const all = await db.getAll('completions');
  const userData = await getUserData();

  if (all.length === 0) return 0;

  // Create a set of all completion dates for fast lookup
  const completedDates = new Set(all.map(c => c.completedDate));
  const freezesUsed = new Set(userData.freezesUsed);

  // Start from today and count backwards through consecutive days
  let streak = 0;
  const date = getCurrentDate();
  const todayStr = getLocalDateString(date);

  // If today isn't completed yet, start counting from yesterday
  // (user might still complete today, so don't break streak yet)
  if (!completedDates.has(todayStr) && !freezesUsed.has(todayStr)) {
    date.setDate(date.getDate() - 1);
  }

  while (true) {
    const dateStr = getLocalDateString(date);

    if (completedDates.has(dateStr)) {
      // Day was completed - add to streak
      streak++;
      date.setDate(date.getDate() - 1);
    } else if (freezesUsed.has(dateStr)) {
      // Freeze was used - maintains streak but doesn't add to it
      // Just continue to the previous day without incrementing
      date.setDate(date.getDate() - 1);
    } else {
      // No completion and no freeze - streak broken
      break;
    }
  }

  return streak;
}

// Check for missed days and use freezes automatically
export async function checkAndUseFreezes(): Promise<{ freezeUsed: boolean; streakLost: boolean }> {
  const db = await initDatabase();
  const all = await db.getAll('completions');
  const userData = await getUserData();

  if (all.length === 0) {
    return { freezeUsed: false, streakLost: false };
  }

  // Find the most recent completion date
  const completedDates = all.map(c => c.completedDate).sort((a, b) => b.localeCompare(a));
  const lastCompletionDate = completedDates[0];
  if (!lastCompletionDate) {
    return { freezeUsed: false, streakLost: false };
  }

  // Parse as local date (not UTC) to avoid timezone issues
  const lastDate = parseLocalDateString(lastCompletionDate);
  const todayDate = getCurrentDate();

  // Normalize both dates to start of day for accurate comparison
  lastDate.setHours(0, 0, 0, 0);
  todayDate.setHours(0, 0, 0, 0);

  // Calculate days between last completion and today
  const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  // If more than 1 day has passed, we have missed days
  if (daysDiff <= 1) {
    return { freezeUsed: false, streakLost: false };
  }

  // Don't try to use freezes if too many days have passed (streak is definitely broken)
  // Only attempt to save streaks for gaps of up to 3 days
  if (daysDiff > 4) {
    return { freezeUsed: false, streakLost: true };
  }

  // Check each missed day (excluding today, as user might complete it)
  const freezesUsed = new Set(userData.freezesUsed);
  let freezeUsed = false;
  let streakLost = false;

  for (let i = 1; i < daysDiff; i++) {
    const missedDate = new Date(lastDate);
    missedDate.setDate(missedDate.getDate() + i);
    const missedDateStr = getLocalDateString(missedDate);

    // Check if we already used a freeze or completed this day
    const completedThisDay = all.some(c => c.completedDate === missedDateStr);
    const alreadyFroze = freezesUsed.has(missedDateStr);

    if (!completedThisDay && !alreadyFroze) {
      // Try to use a freeze
      const used = await useStreakFreeze(missedDateStr);
      if (used) {
        freezeUsed = true;
        freezesUsed.add(missedDateStr);
      } else {
        // No freeze available - streak is lost
        streakLost = true;
        break;
      }
    }
  }

  return { freezeUsed, streakLost };
}

export async function getLastWorkoutDate(): Promise<string | null> {
  const db = await initDatabase();
  const all = await db.getAllFromIndex('completions', 'by-date');
  if (all.length === 0) return null;

  const sorted = all.sort((a, b) => b.completedDate.localeCompare(a.completedDate));
  return sorted[0]?.completedDate ?? null;
}

// Export all data as JSON
export async function exportData(): Promise<string> {
  const db = await initDatabase();
  const completions = await db.getAll('completions');
  const customGoals = await db.getAll('customGoals');
  const customWorkouts = await db.getAll('customWorkouts');

  const exportObj = {
    version: 2,
    exportedAt: new Date().toISOString(),
    completions: completions.map(({ id, ...rest }) => rest),
    customGoals: customGoals.length > 0 ? customGoals[0]?.goals : null,
    customWorkouts: customWorkouts.map(({ id, ...rest }) => rest),
  };

  return JSON.stringify(exportObj, null, 2);
}

// Import data from JSON
export async function importData(jsonString: string): Promise<{ success: boolean; imported: number; error?: string }> {
  try {
    const data = JSON.parse(jsonString);

    if (!data.completions || !Array.isArray(data.completions)) {
      return { success: false, imported: 0, error: 'Invalid data format' };
    }

    const db = await initDatabase();

    // Clear existing data
    await db.clear('completions');
    await db.clear('customGoals');
    await db.clear('customWorkouts');

    // Import all completions
    let imported = 0;
    for (const completion of data.completions) {
      if (completion.dayName && completion.completedDate && completion.createdAt) {
        await db.add('completions', {
          dayName: completion.dayName,
          completedDate: completion.completedDate,
          isRestDay: completion.isRestDay ?? false,
          createdAt: completion.createdAt,
        });
        imported++;
      }
    }

    // Import custom goals (version 2+)
    if (data.customGoals && Array.isArray(data.customGoals)) {
      await db.add('customGoals', {
        goals: data.customGoals,
        updatedAt: new Date().toISOString(),
      });
    }

    // Import custom workouts (version 2+)
    if (data.customWorkouts && Array.isArray(data.customWorkouts)) {
      for (const workout of data.customWorkouts) {
        if (workout.dayName && workout.exercises) {
          await db.add('customWorkouts', {
            dayName: workout.dayName,
            title: workout.title,
            color: workout.color,
            exercises: workout.exercises,
            updatedAt: workout.updatedAt || new Date().toISOString(),
          });
        }
      }
    }

    return { success: true, imported };
  } catch (e) {
    return { success: false, imported: 0, error: 'Failed to parse JSON' };
  }
}

// Clear all data
export async function clearAllData(): Promise<void> {
  const db = await initDatabase();
  await db.clear('completions');
  await db.clear('difficultyPreferences');
  await db.clear('customGoals');
  await db.clear('customWorkouts');
  await db.clear('userData');
}

// Clear just completions and user data (for testing)
export async function clearCompletionsAndUserData(): Promise<void> {
  const db = await initDatabase();
  await db.clear('completions');
  await db.clear('userData');
}

// Get day-level difficulty preference
export async function getDayDifficulty(dayName: DayName): Promise<DifficultyLevel> {
  const db = await initDatabase();
  const prefs = await db.getAllFromIndex('difficultyPreferences', 'by-day', dayName);
  const dayPref = prefs.find(p => p.exerciseId === null);
  return dayPref?.difficulty ?? 'normal';
}

// Set day-level difficulty preference
export async function setDayDifficulty(dayName: DayName, difficulty: DifficultyLevel): Promise<void> {
  const db = await initDatabase();
  const prefs = await db.getAllFromIndex('difficultyPreferences', 'by-day', dayName);
  const existing = prefs.find(p => p.exerciseId === null);

  if (existing?.id) {
    await db.put('difficultyPreferences', {
      ...existing,
      difficulty,
      updatedAt: new Date().toISOString(),
    });
  } else {
    await db.add('difficultyPreferences', {
      dayName,
      exerciseId: null,
      difficulty,
      updatedAt: new Date().toISOString(),
    });
  }
}

// Get all exercise-level difficulties for a day
export async function getExerciseDifficulties(dayName: DayName): Promise<Record<string, DifficultyLevel>> {
  const db = await initDatabase();
  const prefs = await db.getAllFromIndex('difficultyPreferences', 'by-day', dayName);
  const result: Record<string, DifficultyLevel> = {};
  for (const pref of prefs) {
    if (pref.exerciseId !== null) {
      result[pref.exerciseId] = pref.difficulty;
    }
  }
  return result;
}

// Set exercise-level difficulty preference
export async function setExerciseDifficulty(dayName: DayName, exerciseId: string, difficulty: DifficultyLevel): Promise<void> {
  const db = await initDatabase();
  const prefs = await db.getAllFromIndex('difficultyPreferences', 'by-day', dayName);
  const existing = prefs.find(p => p.exerciseId === exerciseId);

  if (existing?.id) {
    await db.put('difficultyPreferences', {
      ...existing,
      difficulty,
      updatedAt: new Date().toISOString(),
    });
  } else {
    await db.add('difficultyPreferences', {
      dayName,
      exerciseId,
      difficulty,
      updatedAt: new Date().toISOString(),
    });
  }
}

// Reset all difficulties for a day back to normal
export async function resetDayDifficulties(dayName: DayName): Promise<void> {
  const db = await initDatabase();
  const prefs = await db.getAllFromIndex('difficultyPreferences', 'by-day', dayName);
  for (const pref of prefs) {
    if (pref.id) {
      await db.delete('difficultyPreferences', pref.id);
    }
  }
}

// ==================== Custom Goals ====================

export async function getCustomGoals(): Promise<string[] | null> {
  const db = await initDatabase();
  const all = await db.getAll('customGoals');
  if (all.length === 0) return null;
  return all[0]?.goals ?? null;
}

export async function saveCustomGoals(goals: string[]): Promise<void> {
  const db = await initDatabase();
  const all = await db.getAll('customGoals');

  if (all.length > 0 && all[0]?.id) {
    await db.put('customGoals', {
      id: all[0].id,
      goals,
      updatedAt: new Date().toISOString(),
    });
  } else {
    await db.add('customGoals', {
      goals,
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function resetCustomGoals(): Promise<void> {
  const db = await initDatabase();
  await db.clear('customGoals');
}

// ==================== Custom Workouts ====================

export async function getCustomWorkout(dayName: DayName): Promise<CustomWorkout | null> {
  const db = await initDatabase();
  const all = await db.getAllFromIndex('customWorkouts', 'by-day', dayName);
  return all[0] ?? null;
}

export async function getAllCustomWorkouts(): Promise<Map<DayName, CustomWorkout>> {
  const db = await initDatabase();
  const all = await db.getAll('customWorkouts');
  const map = new Map<DayName, CustomWorkout>();
  for (const workout of all) {
    map.set(workout.dayName, workout);
  }
  return map;
}

export async function saveCustomWorkout(workout: Omit<CustomWorkout, 'id' | 'updatedAt'> & { id?: number }): Promise<void> {
  const db = await initDatabase();
  const existing = await db.getAllFromIndex('customWorkouts', 'by-day', workout.dayName);

  if (existing.length > 0 && existing[0]?.id) {
    await db.put('customWorkouts', {
      ...workout,
      id: existing[0].id,
      updatedAt: new Date().toISOString(),
    });
  } else {
    await db.add('customWorkouts', {
      ...workout,
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function resetCustomWorkout(dayName: DayName): Promise<void> {
  const db = await initDatabase();
  const all = await db.getAllFromIndex('customWorkouts', 'by-day', dayName);
  for (const workout of all) {
    if (workout.id) {
      await db.delete('customWorkouts', workout.id);
    }
  }
}

export async function resetAllCustomizations(): Promise<void> {
  const db = await initDatabase();
  await db.clear('customGoals');
  await db.clear('customWorkouts');
}

// ==================== Points & Streak Freezes ====================

const FREEZE_COST = 50;

export async function getUserData(): Promise<UserData> {
  const db = await initDatabase();
  const all = await db.getAll('userData');
  if (all.length === 0) {
    // Initialize default user data
    const defaultData: UserData = {
      points: 0,
      streakFreezes: 0,
      freezesUsed: [],
      updatedAt: new Date().toISOString(),
    };
    const id = await db.add('userData', defaultData);
    return { ...defaultData, id };
  }
  return all[0]!;
}

export async function addPoints(amount: number): Promise<void> {
  const db = await initDatabase();
  const userData = await getUserData();

  await db.put('userData', {
    ...userData,
    points: userData.points + amount,
    updatedAt: new Date().toISOString(),
  });
}

export async function getPoints(): Promise<number> {
  const userData = await getUserData();
  return userData.points;
}

export async function getStreakFreezes(): Promise<number> {
  const userData = await getUserData();
  return userData.streakFreezes;
}

export async function buyStreakFreeze(): Promise<boolean> {
  const userData = await getUserData();

  if (userData.points < FREEZE_COST) {
    return false; // Not enough points
  }

  const db = await initDatabase();
  await db.put('userData', {
    ...userData,
    points: userData.points - FREEZE_COST,
    streakFreezes: userData.streakFreezes + 1,
    updatedAt: new Date().toISOString(),
  });

  return true;
}

export async function useStreakFreeze(dateStr: string): Promise<boolean> {
  const userData = await getUserData();

  if (userData.streakFreezes <= 0) {
    return false; // No freezes available
  }

  // Check if already used a freeze for this date
  if (userData.freezesUsed.includes(dateStr)) {
    return true; // Already used, consider it a success
  }

  const db = await initDatabase();
  await db.put('userData', {
    ...userData,
    streakFreezes: userData.streakFreezes - 1,
    freezesUsed: [...userData.freezesUsed, dateStr],
    updatedAt: new Date().toISOString(),
  });

  return true;
}

export function getFreezeCost(): number {
  return FREEZE_COST;
}

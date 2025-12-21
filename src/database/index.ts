import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { DayName, WorkoutCompletion, DifficultyPreference, DifficultyLevel, CustomGoals, CustomWorkout } from '../types';

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
}

const DB_NAME = 'kyler-workout-db';
const DB_VERSION = 3;

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
      },
    });
  }
  return dbPromise;
}

export async function markDayComplete(dayName: DayName, isRestDay: boolean): Promise<void> {
  const db = await initDatabase();
  // Use the expected date for this day (e.g., marking Friday on Saturday uses Friday's date)
  const expectedDate = getMostRecentDateForDay(dayName);

  // Check if already completed for this week's occurrence
  const existing = await db.getAllFromIndex('completions', 'by-date', expectedDate);
  const alreadyCompleted = existing.some(c => c.dayName === dayName);

  if (!alreadyCompleted) {
    await db.add('completions', {
      dayName,
      completedDate: expectedDate,
      isRestDay,
      createdAt: new Date().toISOString(),
    });
  }
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

// Get today's day name
export function getTodayDayName(): DayName {
  return JS_DAY_NAMES[new Date().getDay()]!;
}

// Get the most recent date for a given day of the week
// If that day is today, returns today. Otherwise returns the most recent past occurrence.
export function getMostRecentDateForDay(dayName: DayName): string {
  const today = new Date();
  const todayDayIndex = today.getDay();
  const targetDayIndex = JS_DAY_NAMES.indexOf(dayName);

  let daysAgo = todayDayIndex - targetDayIndex;
  if (daysAgo < 0) {
    daysAgo += 7; // wrap around to previous week
  }

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() - daysAgo);

  return targetDate.toISOString().split('T')[0]!;
}

// Get all days completed in the past week (each day on its most recent occurrence)
export async function getWeekCompletions(): Promise<Set<DayName>> {
  const db = await initDatabase();
  const all = await db.getAll('completions');
  const completed = new Set<DayName>();

  for (const dayName of JS_DAY_NAMES) {
    const expectedDate = getMostRecentDateForDay(dayName);
    const wasCompleted = all.some(c => c.dayName === dayName && c.completedDate === expectedDate);
    if (wasCompleted) {
      completed.add(dayName);
    }
  }

  return completed;
}

export async function calculateStreak(): Promise<number> {
  const db = await initDatabase();
  const all = await db.getAll('completions');

  if (all.length === 0) return 0;

  // Create a set of all completion dates for fast lookup
  const completedDates = new Set(all.map(c => c.completedDate));

  // Start from today and count backwards through consecutive days
  let streak = 0;
  const date = new Date();

  while (true) {
    const dateStr = date.toISOString().split('T')[0]!;
    if (completedDates.has(dateStr)) {
      streak++;
      date.setDate(date.getDate() - 1); // Go back one day
    } else {
      break;
    }
  }

  return streak;
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

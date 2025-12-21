import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { DayName, WorkoutCompletion, DifficultyPreference, DifficultyLevel } from '../types';

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
}

const DB_NAME = 'kyler-workout-db';
const DB_VERSION = 2;

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
      },
    });
  }
  return dbPromise;
}

export async function markDayComplete(dayName: DayName, isRestDay: boolean): Promise<void> {
  const db = await initDatabase();
  const today = new Date().toISOString().split('T')[0]!;

  // Check if already completed today
  const existing = await db.getAllFromIndex('completions', 'by-date', today);
  const alreadyCompleted = existing.some(c => c.dayName === dayName);

  if (!alreadyCompleted) {
    await db.add('completions', {
      dayName,
      completedDate: today,
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
  const today = new Date().toISOString().split('T')[0]!;
  const completions = await db.getAllFromIndex('completions', 'by-date', today);
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
function getMostRecentDateForDay(dayName: DayName): string {
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
  // Get this week's completions (same logic as getWeekCompletions)
  const completedDays = await getWeekCompletions();

  if (completedDays.size === 0) return 0;

  // Days in display order (Mon-Sun)
  const dayOrder: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Find the longest consecutive streak in the week
  let maxStreak = 0;

  for (let startIdx = 0; startIdx < 7; startIdx++) {
    if (!completedDays.has(dayOrder[startIdx]!)) continue;

    let streak = 0;
    for (let i = 0; i < 7; i++) {
      const dayIdx = (startIdx + i) % 7;
      const day = dayOrder[dayIdx]!;
      if (completedDays.has(day)) {
        streak++;
      } else {
        break;
      }
    }
    maxStreak = Math.max(maxStreak, streak);
  }

  return maxStreak;
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

  const exportObj = {
    version: 1,
    exportedAt: new Date().toISOString(),
    completions: completions.map(({ id, ...rest }) => rest), // Remove auto-generated IDs
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

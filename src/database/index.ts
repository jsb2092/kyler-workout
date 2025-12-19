import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { DayName, WorkoutCompletion } from '../types';

interface WorkoutDB extends DBSchema {
  completions: {
    key: number;
    value: WorkoutCompletion;
    indexes: {
      'by-date': string;
      'by-day': string;
    };
  };
}

const DB_NAME = 'kyler-workout-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<WorkoutDB>> | null = null;

export async function initDatabase(): Promise<IDBPDatabase<WorkoutDB>> {
  if (!dbPromise) {
    dbPromise = openDB<WorkoutDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore('completions', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by-date', 'completedDate');
        store.createIndex('by-day', 'dayName');
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

export async function calculateStreak(): Promise<number> {
  const db = await initDatabase();
  const all = await db.getAllFromIndex('completions', 'by-date');

  if (all.length === 0) return 0;

  // Days in weekly order
  const dayOrder: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Get all unique days that have been completed
  const completedDays = new Set(all.map(c => c.dayName));

  // Find the longest consecutive streak in the week
  // Start from each completed day and count consecutive days forward
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
}

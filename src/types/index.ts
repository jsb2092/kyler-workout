export type DifficultyLevel = 'easier' | 'normal' | 'harder';

export interface ExerciseVariant {
  name: string;
  duration?: string;
  sets?: string;
  muscles: string;
  description: string;
}

export interface Exercise {
  id: string;
  name: string;
  duration?: string;
  sets?: string;
  muscles: string;
  description: string;
  easier: string | ExerciseVariant;
  harder: string | ExerciseVariant;
  hasVariants?: boolean;
  isWarmup?: boolean;
  isCooldown?: boolean;
  isStretch?: boolean;
  category?: boolean;
}

export interface WorkoutDay {
  name: string;
  title: string;
  color: string;
  exercises: Exercise[];
}

export type DayName = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type WorkoutData = Record<DayName, WorkoutDay>;

export interface WorkoutCompletion {
  id?: number;
  dayName: DayName;
  completedDate: string;
  isRestDay: boolean;
  createdAt: string;
}

export interface DifficultyPreference {
  id?: number;
  dayName: DayName;
  exerciseId: string | null;  // null = day-level preference
  difficulty: DifficultyLevel;
  updatedAt: string;
}

export interface TimerData {
  exercises: string[];
  timePerExercise: number;
  totalTime: number;
}

export type TimerType = 'warmup' | 'cooldown' | 'exercise';

// Custom workout types for user customization
export interface CustomGoals {
  id?: number;
  goals: string[];
  updatedAt: string;
}

export interface CustomWorkout {
  id?: number;
  dayName: DayName;
  title?: string;
  color?: string;
  exercises: Exercise[];
  updatedAt: string;
}

// Points and streak freeze system
export interface UserData {
  id?: number;
  points: number;
  streakFreezes: number;
  freezesUsed: string[]; // dates when freezes were used
  updatedAt: string;
}


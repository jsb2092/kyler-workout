export interface Exercise {
  name: string;
  duration?: string;
  sets?: string;
  muscles: string;
  description: string;
  easier: string;
  harder: string;
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

export interface TimerData {
  exercises: string[];
  timePerExercise: number;
  totalTime: number;
}

export type TimerType = 'warmup' | 'cooldown' | 'exercise';

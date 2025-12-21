import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { GoalsCard } from './components/GoalsCard';
import { GoalsEditor } from './components/GoalsEditor';
import { DaySelector } from './components/DaySelector';
import { DayHeader } from './components/DayHeader';
import { ExerciseList } from './components/ExerciseList';
import { TimerModal } from './components/TimerModal';
import { TipsCard } from './components/TipsCard';
import { CompleteButton } from './components/CompleteButton';
import { DataManager } from './components/DataManager';
import { VoiceButton } from './components/VoiceButton';
import { WorkoutEditor } from './components/WorkoutEditor';
import { useDatabase } from './hooks/useDatabase';
import { useStreak } from './hooks/useStreak';
import { useTimer } from './hooks/useTimer';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { useDifficulty } from './hooks/useDifficulty';
import { useWakeLock } from './hooks/useWakeLock';
import { useCustomWorkouts } from './hooks/useCustomWorkouts';
import { useTheme } from './hooks/useTheme';
import type { DayName } from './types';

export default function App() {
  const [selectedDay, setSelectedDay] = useState<DayName | null>(null);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [showGoalsEditor, setShowGoalsEditor] = useState(false);
  const [showWorkoutEditor, setShowWorkoutEditor] = useState(false);
  const [banTimeLeft, setBanTimeLeft] = useState<number>(0);
  const [assistantName, setAssistantName] = useState<string>(() => {
    return localStorage.getItem('assistant-name') || 'Rocky';
  });
  const [selectedVoice, setSelectedVoice] = useState<string | null>(() => {
    // Load saved voice preference from localStorage
    return localStorage.getItem('kbot-voice');
  });

  // Check for K-Bot ban
  useEffect(() => {
    const checkBan = () => {
      const banUntil = localStorage.getItem('kbot-ban-until');
      if (banUntil) {
        const remaining = parseInt(banUntil, 10) - Date.now();
        if (remaining > 0) {
          setBanTimeLeft(Math.ceil(remaining / 1000));
        } else {
          localStorage.removeItem('kbot-ban-until');
          setBanTimeLeft(0);
        }
      }
    };

    checkBan();
    const interval = setInterval(checkBan, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVoiceChange = (voiceName: string | null) => {
    setSelectedVoice(voiceName);
    if (voiceName) {
      localStorage.setItem('kbot-voice', voiceName);
    } else {
      localStorage.removeItem('kbot-voice');
    }
  };

  const handleAssistantNameChange = (name: string) => {
    setAssistantName(name);
    localStorage.setItem('assistant-name', name);
  };

  const { isReady } = useDatabase();
  const { streak, showCelebration, completedToday, weekCompletions, completeWorkout, checkCompletedToday, refreshStreak } = useStreak();
  const {
    goals,
    defaultGoals,
    workouts,
    isCustomized,
    saveGoals,
    resetGoals,
    saveWorkout,
    resetDay,
  } = useCustomWorkouts();

  // Keep screen on while app is active
  useWakeLock();

  // Theme
  const { mode: themeMode, color: themeColor, setMode: setThemeMode, setColor: setThemeColor } = useTheme();
  const {
    dayDifficulty,
    setDayDifficulty,
    setExerciseDifficulty,
    getEffectiveDifficulty,
    getEffectiveExercise,
  } = useDifficulty(selectedDay);
  const {
    timerActive,
    timerData,
    timerType,
    currentExerciseIndex,
    timeRemaining,
    isPaused,
    isComplete,
    startTimer,
    startExerciseTimer,
    closeTimer,
    resetTimer,
    togglePause,
    formatTime,
    getProgress,
    hasTimedSets,
  } = useTimer();

  // Check if the selected day was already completed today
  useEffect(() => {
    if (selectedDay && isReady) {
      checkCompletedToday(selectedDay);
    }
  }, [selectedDay, isReady, checkCompletedToday]);

  const handleSelectDay = (day: DayName) => {
    setSelectedDay(day);
    setExpandedExercise(null);
  };

  const handleBack = () => {
    setSelectedDay(null);
    setExpandedExercise(null);
  };

  const handleComplete = () => {
    if (selectedDay) {
      completeWorkout(selectedDay);
    }
  };

  // Voice assistant callbacks
  const handleVoiceStartWarmup = useCallback(() => {
    if (selectedDay) {
      const warmupExercise = workouts[selectedDay].exercises.find(e => e.isWarmup);
      if (warmupExercise) {
        startTimer(warmupExercise, 'warmup');
      }
    }
  }, [selectedDay, workouts, startTimer]);

  const handleVoiceStartCooldown = useCallback(() => {
    if (selectedDay) {
      const cooldownExercise = workouts[selectedDay].exercises.find(e => e.isCooldown);
      if (cooldownExercise) {
        startTimer(cooldownExercise, 'cooldown');
      }
    }
  }, [selectedDay, workouts, startTimer]);

  // Get current day's exercises for voice assistant
  const currentExercises = selectedDay ? workouts[selectedDay].exercises : [];

  const { isListening, isSupported, alwaysOn, isSpeaking, lastCommand, toggleListening } = useVoiceAssistant({
    onSelectDay: handleSelectDay,
    onBack: handleBack,
    onStartWarmup: handleVoiceStartWarmup,
    onStartCooldown: handleVoiceStartCooldown,
    onTogglePause: togglePause,
    onResetTimer: resetTimer,
    onCloseTimer: closeTimer,
    onCompleteWorkout: handleComplete,
    selectedDay,
    timerActive,
    isPaused,
    completedToday,
    exercises: currentExercises,
    selectedVoice,
    enabled: banTimeLeft === 0,
    assistantName,
  });

  if (!isReady) {
    return (
      <div className="min-h-screen bg-theme-bg-primary text-theme-text-primary flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Assistant ban screen
  if (banTimeLeft > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-theme-bg-primary to-theme-bg-primary text-theme-text-primary flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-bold mb-2">{assistantName} is upset!</h1>
          <p className="text-xl text-theme-text-secondary mb-6">Maybe next time you'll be nicer...</p>
          <div className="bg-theme-bg-secondary rounded-2xl p-6 border border-red-500/30">
            <div className="text-5xl font-mono font-bold text-red-400">{banTimeLeft}s</div>
            <p className="text-theme-text-muted mt-2">until {assistantName} forgives you</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg-primary text-theme-text-primary p-4 pb-32">
      {timerActive && timerData && (
        <TimerModal
          timerData={timerData}
          timerType={timerType}
          currentExerciseIndex={currentExerciseIndex}
          timeRemaining={timeRemaining}
          isPaused={isPaused}
          isComplete={!!isComplete}
          onClose={closeTimer}
          onTogglePause={togglePause}
          onReset={resetTimer}
          formatTime={formatTime}
          getProgress={getProgress}
        />
      )}

      <div className="max-w-4xl mx-auto">
        <Header streak={streak} showCelebration={showCelebration} />

        {!selectedDay && (
          <GoalsCard
            goals={goals}
            onEdit={() => setShowGoalsEditor(true)}
          />
        )}

        {!selectedDay ? (
          <DaySelector onSelectDay={handleSelectDay} weekCompletions={weekCompletions} />
        ) : (
          <div>
            <DayHeader
              day={selectedDay}
              workout={workouts[selectedDay]}
              isCustomized={isCustomized(selectedDay)}
              onBack={handleBack}
              onEdit={() => setShowWorkoutEditor(true)}
              dayDifficulty={dayDifficulty}
              onDifficultyChange={setDayDifficulty}
            />

            <ExerciseList
              exercises={workouts[selectedDay].exercises}
              expandedExercise={expandedExercise}
              onToggleExpand={setExpandedExercise}
              onStartTimer={startTimer}
              onStartExerciseTimer={startExerciseTimer}
              hasTimedSets={hasTimedSets}
              getEffectiveDifficulty={getEffectiveDifficulty}
              getEffectiveExercise={getEffectiveExercise}
              onExerciseDifficultyChange={setExerciseDifficulty}
            />

            <TipsCard />

            <CompleteButton
              day={selectedDay}
              streak={streak}
              completedToday={completedToday}
              onComplete={handleComplete}
            />
          </div>
        )}
      </div>

      <DataManager
          onDataChange={refreshStreak}
          selectedVoice={selectedVoice}
          onVoiceChange={handleVoiceChange}
          assistantName={assistantName}
          onAssistantNameChange={handleAssistantNameChange}
          themeMode={themeMode}
          themeColor={themeColor}
          onThemeModeChange={setThemeMode}
          onThemeColorChange={setThemeColor}
        />

      {/* Voice Debug Panel */}
      {lastCommand && (
        <div className="fixed bottom-20 left-4 right-4 bg-theme-bg-secondary/95 backdrop-blur border border-theme-border rounded-xl p-3 text-sm z-40">
          <div className="text-theme-text-muted text-xs mb-1">Last heard:</div>
          <div className="text-theme-text-primary font-mono break-words">{lastCommand}</div>
          <div className="text-theme-text-muted text-xs mt-2">
            Looking for: "{assistantName.toLowerCase()}" prefix
          </div>
        </div>
      )}

      <VoiceButton
        isListening={isListening}
        isSupported={isSupported}
        alwaysOn={alwaysOn}
        isSpeaking={isSpeaking}
        onToggle={toggleListening}
      />

      {/* Goals Editor Modal */}
      {showGoalsEditor && (
        <GoalsEditor
          goals={goals}
          defaultGoals={defaultGoals}
          onSave={saveGoals}
          onReset={resetGoals}
          onClose={() => setShowGoalsEditor(false)}
        />
      )}

      {/* Workout Editor Modal */}
      {showWorkoutEditor && selectedDay && (
        <WorkoutEditor
          dayName={selectedDay}
          workout={workouts[selectedDay]}
          isCustomized={isCustomized(selectedDay)}
          onSave={(exercises, title, color) => saveWorkout(selectedDay, exercises, title, color)}
          onReset={() => resetDay(selectedDay)}
          onClose={() => setShowWorkoutEditor(false)}
        />
      )}
    </div>
  );
}

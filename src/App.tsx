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
import type { DayName } from './types';

export default function App() {
  const [selectedDay, setSelectedDay] = useState<DayName | null>(null);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [showGoalsEditor, setShowGoalsEditor] = useState(false);
  const [showWorkoutEditor, setShowWorkoutEditor] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(() => {
    // Load saved voice preference from localStorage
    return localStorage.getItem('kbot-voice');
  });

  const handleVoiceChange = (voiceName: string | null) => {
    setSelectedVoice(voiceName);
    if (voiceName) {
      localStorage.setItem('kbot-voice', voiceName);
    } else {
      localStorage.removeItem('kbot-voice');
    }
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

  const { isListening, isSupported, alwaysOn, isSpeaking, toggleListening } = useVoiceAssistant({
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
  });

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 pb-32">
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
        />

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

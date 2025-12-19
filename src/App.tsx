import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { GoalsCard } from './components/GoalsCard';
import { DaySelector } from './components/DaySelector';
import { DayHeader } from './components/DayHeader';
import { ExerciseList } from './components/ExerciseList';
import { TimerModal } from './components/TimerModal';
import { TipsCard } from './components/TipsCard';
import { CompleteButton } from './components/CompleteButton';
import { DataManager } from './components/DataManager';
import { VoiceButton } from './components/VoiceButton';
import { useDatabase } from './hooks/useDatabase';
import { useStreak } from './hooks/useStreak';
import { useTimer } from './hooks/useTimer';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { workoutData } from './data/workouts';
import type { DayName } from './types';

export default function App() {
  const [selectedDay, setSelectedDay] = useState<DayName | null>(null);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);

  const { isReady } = useDatabase();
  const { streak, showCelebration, completedToday, completeWorkout, checkCompletedToday, refreshStreak } = useStreak();
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
      const warmupExercise = workoutData[selectedDay].exercises.find(e => e.isWarmup);
      if (warmupExercise) {
        startTimer(warmupExercise, 'warmup');
      }
    }
  }, [selectedDay, startTimer]);

  const handleVoiceStartCooldown = useCallback(() => {
    if (selectedDay) {
      const cooldownExercise = workoutData[selectedDay].exercises.find(e => e.isCooldown);
      if (cooldownExercise) {
        startTimer(cooldownExercise, 'cooldown');
      }
    }
  }, [selectedDay, startTimer]);

  // Get current day's exercises for voice assistant
  const currentExercises = selectedDay ? workoutData[selectedDay].exercises : [];

  const { isListening, isSupported, lastCommand, debugInfo, toggleListening } = useVoiceAssistant({
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
  });

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 pb-24">
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

        {!selectedDay && <GoalsCard />}

        {!selectedDay ? (
          <DaySelector onSelectDay={handleSelectDay} />
        ) : (
          <div>
            <DayHeader day={selectedDay} onBack={handleBack} />

            <ExerciseList
              day={selectedDay}
              expandedExercise={expandedExercise}
              onToggleExpand={setExpandedExercise}
              onStartTimer={startTimer}
              onStartExerciseTimer={startExerciseTimer}
              hasTimedSets={hasTimedSets}
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

      <DataManager onDataChange={refreshStreak} />

      <VoiceButton
        isListening={isListening}
        isSupported={isSupported}
        lastCommand={lastCommand}
        debugInfo={debugInfo}
        onToggle={toggleListening}
      />
    </div>
  );
}

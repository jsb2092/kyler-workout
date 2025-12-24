import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Flame, Settings, Mic, Timer, Calendar, Target, Dumbbell } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string;
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to Your Workout App!",
    description: "Let's take a quick tour to help you get started. This app helps you stay consistent with your fitness goals.",
    icon: <Dumbbell className="w-12 h-12 text-theme-accent-400" />,
  },
  {
    title: "Your Streak",
    description: "The flame icon shows your current workout streak. Complete workouts on consecutive days to build your streak and earn points!",
    icon: <Flame className="w-12 h-12 text-orange-500" />,
    highlight: "streak",
  },
  {
    title: "Weekly Goals",
    description: "Your fitness goals are displayed at the top. You can customize these in the settings to match what you're working towards.",
    icon: <Target className="w-12 h-12 text-green-500" />,
    highlight: "goals",
  },
  {
    title: "Choose Your Day",
    description: "Tap any day to see that day's workout. Each day focuses on different muscle groups. A checkmark means you've completed that workout this week.",
    icon: <Calendar className="w-12 h-12 text-blue-500" />,
    highlight: "days",
  },
  {
    title: "Exercise Timers",
    description: "When viewing a workout, tap on exercises to expand them. Many exercises have built-in timers to help you track your sets and rest periods.",
    icon: <Timer className="w-12 h-12 text-purple-500" />,
  },
  {
    title: "Voice Assistant",
    description: "Tap the microphone button to use voice commands! Say the assistant's name followed by commands like 'start warmup' or 'read exercise 1'.",
    icon: <Mic className="w-12 h-12 text-red-500" />,
    highlight: "voice",
  },
  {
    title: "Settings",
    description: "Tap the gear icon to access settings. You can change themes, switch between Standard and Senior workout modes, backup your data, and more!",
    icon: <Settings className="w-12 h-12 text-gray-400" />,
    highlight: "settings",
  },
  {
    title: "You're All Set!",
    description: "That's everything you need to know. Pick a day and start your workout. Stay consistent and watch your streak grow!",
    icon: <Flame className="w-12 h-12 text-orange-500" />,
  },
];

interface GuidedTourProps {
  onComplete: () => void;
}

export function GuidedTour({ onComplete }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = tourSteps[currentStep]!;
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Tour Card */}
      <div className="relative bg-theme-bg-secondary rounded-2xl max-w-md w-full border border-theme-border shadow-2xl overflow-hidden">
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 hover:bg-theme-bg-tertiary rounded-full transition-colors z-10"
          aria-label="Skip tour"
        >
          <X className="w-5 h-5 text-theme-text-muted" />
        </button>

        {/* Progress bar */}
        <div className="h-1 bg-theme-bg-tertiary">
          <div
            className="h-full bg-theme-accent-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-theme-bg-tertiary rounded-full">
              {step.icon}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-theme-text-primary mb-3">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-theme-text-secondary leading-relaxed mb-8">
            {step.description}
          </p>

          {/* Step indicator */}
          <div className="flex justify-center gap-2 mb-6">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-theme-accent-500'
                    : index < currentStep
                    ? 'bg-theme-accent-500/50'
                    : 'bg-theme-bg-tertiary'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="flex-1 flex items-center justify-center gap-2 bg-theme-bg-tertiary hover:bg-theme-bg-primary text-theme-text-primary py-3 px-4 rounded-xl font-semibold transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className={`flex-1 flex items-center justify-center gap-2 bg-theme-accent-500 hover:bg-theme-accent-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors ${
                isFirstStep ? 'w-full' : ''
              }`}
            >
              {isLastStep ? "Let's Go!" : 'Next'}
              {!isLastStep && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

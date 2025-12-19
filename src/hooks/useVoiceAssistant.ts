import { useState, useEffect, useCallback, useRef } from 'react';
import type { DayName } from '../types';

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface VoiceActions {
  onSelectDay: (day: DayName) => void;
  onBack: () => void;
  onStartWarmup: () => void;
  onStartCooldown: () => void;
  onTogglePause: () => void;
  onResetTimer: () => void;
  onCloseTimer: () => void;
  onCompleteWorkout: () => void;
  selectedDay: DayName | null;
  timerActive: boolean;
  isPaused: boolean;
  completedToday: DayName | null;
}

const DAY_KEYWORDS: Record<string, DayName> = {
  'monday': 'monday',
  'tuesday': 'tuesday',
  'wednesday': 'wednesday',
  'thursday': 'thursday',
  'friday': 'friday',
  'saturday': 'saturday',
  'sunday': 'sunday',
};

export function useVoiceAssistant(actions: VoiceActions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Check for browser support
  useEffect(() => {
    const SpeechRecognitionAPI = (window as WindowWithSpeechRecognition).SpeechRecognition ||
                                  (window as WindowWithSpeechRecognition).webkitSpeechRecognition;
    const supported = !!SpeechRecognitionAPI && !!window.speechSynthesis;
    setIsSupported(supported);

    if (supported) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    synthRef.current.speak(utterance);
  }, []);

  const processCommand = useCallback((transcript: string) => {
    const command = transcript.toLowerCase().trim();
    setLastCommand(command);

    // Day navigation commands
    for (const [keyword, day] of Object.entries(DAY_KEYWORDS)) {
      if (command.includes(keyword) && (command.includes('go to') || command.includes('open') || command.includes('start') || command.includes('show') || command === keyword)) {
        if (actions.selectedDay === null) {
          actions.onSelectDay(day);
          speak(`Opening ${keyword}'s workout`);
          return true;
        } else {
          speak(`Going back first, then to ${keyword}`);
          actions.onBack();
          setTimeout(() => actions.onSelectDay(day), 100);
          return true;
        }
      }
    }

    // Back/home commands
    if (command.includes('go back') || command.includes('back') || command.includes('home') || command.includes('main menu')) {
      if (actions.selectedDay !== null) {
        actions.onBack();
        speak('Going back to day selection');
        return true;
      } else {
        speak('Already on the main screen');
        return true;
      }
    }

    // Timer commands
    if (command.includes('warm up') || command.includes('warmup') || command.includes('warm-up')) {
      if (command.includes('start')) {
        actions.onStartWarmup();
        speak('Starting warmup timer');
        return true;
      }
    }

    if (command.includes('cool down') || command.includes('cooldown') || command.includes('cool-down')) {
      if (command.includes('start')) {
        actions.onStartCooldown();
        speak('Starting cooldown timer');
        return true;
      }
    }

    // Timer controls
    if (actions.timerActive) {
      if (command.includes('pause')) {
        if (!actions.isPaused) {
          actions.onTogglePause();
          speak('Timer paused');
          return true;
        } else {
          speak('Timer is already paused');
          return true;
        }
      }

      if (command.includes('resume') || command.includes('continue') || command.includes('play')) {
        if (actions.isPaused) {
          actions.onTogglePause();
          speak('Timer resumed');
          return true;
        } else {
          speak('Timer is already running');
          return true;
        }
      }

      if (command.includes('reset') || command.includes('restart')) {
        actions.onResetTimer();
        speak('Timer reset');
        return true;
      }

      if (command.includes('stop') || command.includes('close') || command.includes('cancel')) {
        actions.onCloseTimer();
        speak('Timer closed');
        return true;
      }
    }

    // Complete workout
    if (command.includes('complete') || command.includes('done') || command.includes('finish') || command.includes('finished')) {
      if (actions.selectedDay) {
        if (actions.completedToday) {
          speak('Workout already completed for today');
        } else {
          actions.onCompleteWorkout();
          speak('Workout complete! Great job!');
        }
        return true;
      } else {
        speak('Please select a workout day first');
        return true;
      }
    }

    // Help command
    if (command.includes('help') || command.includes('commands')) {
      speak('You can say: go to Monday, start warmup, start cooldown, pause, resume, reset, stop, or complete workout');
      return true;
    }

    // Command not recognized
    speak("Sorry, I didn't understand. Say help for available commands.");
    return false;
  }, [actions, speak]);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognitionAPI = (window as WindowWithSpeechRecognition).SpeechRecognition ||
                                  (window as WindowWithSpeechRecognition).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0];
      if (result && result[0]) {
        const transcript = result[0].transcript;
        processCommand(transcript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        speak('Microphone access denied. Please enable microphone permissions.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, processCommand, speak]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    lastCommand,
    startListening,
    stopListening,
    toggleListening,
    speak,
  };
}

// TypeScript declarations for Web Speech API
interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

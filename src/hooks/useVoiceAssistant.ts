import { useState, useEffect, useCallback, useRef } from 'react';
import type { DayName, Exercise } from '../types';

// K-Bot - the voice assistant name
const ASSISTANT_NAME = 'K-Bot';

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
  exercises: Exercise[];
}

// Map ordinal words to numbers
const ORDINAL_MAP: Record<string, number> = {
  'first': 1, '1st': 1,
  'second': 2, '2nd': 2,
  'third': 3, '3rd': 3,
  'fourth': 4, '4th': 4,
  'fifth': 5, '5th': 5,
  'sixth': 6, '6th': 6,
  'seventh': 7, '7th': 7,
  'eighth': 8, '8th': 8,
  'ninth': 9, '9th': 9,
  'tenth': 10, '10th': 10,
  'next': -1, // special case
  'last': -2, // special case
};

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0] || 'th');
}

// Convert "3 × 10-15" to "3 sets of 10 to 15 reps"
function formatSetsForSpeech(sets: string): string {
  // Match patterns like "3 × 10-15", "3 x 10", "3 × 20-30 sec"
  const match = sets.match(/(\d+)\s*[×x]\s*(\d+)(?:-(\d+))?\s*(sec|seconds|min|minutes)?/i);

  if (match) {
    const numSets = match[1];
    const repsStart = match[2];
    const repsEnd = match[3];
    const unit = match[4];

    let result = `${numSets} sets of `;

    if (repsEnd) {
      result += `${repsStart} to ${repsEnd}`;
    } else {
      result += repsStart;
    }

    if (unit) {
      // Normalize the unit
      if (unit.toLowerCase().startsWith('sec')) {
        result += ' seconds';
      } else if (unit.toLowerCase().startsWith('min')) {
        result += ' minutes';
      }
    } else {
      result += ' reps';
    }

    return result;
  }

  // If pattern doesn't match, return as-is
  return sets;
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

export interface DebugInfo {
  command: string;
  foundOrdinal: boolean;
  exerciseIndex: number;
  isExerciseQuestion: boolean;
  selectedDay: string | null;
  exerciseCount: number;
  result: string;
}

export function useVoiceAssistant(actions: VoiceActions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [alwaysOn, setAlwaysOn] = useState(true); // Always-on listening mode
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const shouldRestartRef = useRef(true); // Track if we should auto-restart

  // Check for browser support
  useEffect(() => {
    const SpeechRecognitionAPI = (window as WindowWithSpeechRecognition).SpeechRecognition ||
                                  (window as WindowWithSpeechRecognition).webkitSpeechRecognition;
    const supported = !!SpeechRecognitionAPI && !!window.speechSynthesis;
    setIsSupported(supported);

    if (supported) {
      synthRef.current = window.speechSynthesis;
      // iOS: voices are loaded asynchronously
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = () => {
          // Voices loaded, ready to speak
        };
      }
      // Trigger voice loading
      synthRef.current.getVoices();
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    // Pause listening while speaking to avoid hearing ourselves
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    // iOS fix: need to use a voice explicitly
    const voices = synthRef.current.getVoices();
    if (voices.length > 0) {
      // Prefer English US voices, then any English voice
      const englishUSVoice = voices.find(v => v.lang === 'en-US');
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      utterance.voice = englishUSVoice || englishVoice || voices[0] || null;
    }

    // Resume listening after speech ends
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    // iOS workaround: add small delay and use speechSynthesis directly
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  }, [isListening]);

  const processCommand = useCallback((transcript: string) => {
    let command = transcript.toLowerCase().trim();
    setLastCommand(command);

    // Strip "K-Bot" or "kay bot" prefix if present
    command = command.replace(/^(k-bot|kay bot|kbot|k bot),?\s*/i, '');

    // Get exercises excluding category headers, warm-ups, and cool-downs
    const realExercises = actions.exercises.filter(e => !e.category && !e.isWarmup && !e.isCooldown);

    // Check for ordinal words or numbers first (for exercise lookup)
    let exerciseIndex = -1;
    let foundOrdinal = false;

    for (const [word, num] of Object.entries(ORDINAL_MAP)) {
      if (command.includes(word)) {
        foundOrdinal = true;
        if (num === -1) { // "next" - default to first
          exerciseIndex = 0;
        } else if (num === -2) { // "last"
          exerciseIndex = realExercises.length - 1;
        } else {
          exerciseIndex = num - 1; // Convert to 0-based index
        }
        break;
      }
    }

    // Check for numeric digits (e.g., "exercise 2", "number 3")
    if (exerciseIndex === -1) {
      const numMatch = command.match(/(\d+)/);
      if (numMatch && numMatch[1]) {
        exerciseIndex = parseInt(numMatch[1], 10) - 1;
        foundOrdinal = true;
      }
    }

    // Exercise lookup - trigger on ordinals + exercise context, or "what is/what's" questions
    // Be forgiving of speech recognition errors (exerices, exercize, etc.)
    const isExerciseQuestion = command.includes('exercise') ||
                               command.includes('exer') ||  // catches exerices, exercize, etc.
                               command.includes('what is') ||
                               command.includes("what's") ||
                               command.includes('whats') ||
                               command.includes('what is my') ||
                               command.includes('tell me') ||
                               command.includes('my first') ||
                               command.includes('my second') ||
                               command.includes('my third') ||
                               command.includes('my last') ||
                               command.includes('my next');

    // Set debug info
    const debug: DebugInfo = {
      command,
      foundOrdinal,
      exerciseIndex,
      isExerciseQuestion,
      selectedDay: actions.selectedDay,
      exerciseCount: realExercises.length,
      result: 'not matched yet',
    };

    if (foundOrdinal && isExerciseQuestion) {
      if (!actions.selectedDay) {
        debug.result = 'no day selected';
        setDebugInfo(debug);
        speak("Please select a workout day first, then I can tell you about your exercises.");
        return true;
      }

      if (exerciseIndex >= 0 && exerciseIndex < realExercises.length) {
        const exercise = realExercises[exerciseIndex];
        if (exercise) {
          const position = getOrdinalSuffix(exerciseIndex + 1);
          const isLast = exerciseIndex === realExercises.length - 1;

          let response = `Your ${position} exercise is ${exercise.name}.`;
          if (exercise.sets) {
            response += ` Do ${formatSetsForSpeech(exercise.sets)}.`;
          } else if (exercise.duration) {
            response += ` Duration: ${exercise.duration}.`;
          }
          if (isLast) {
            response += " This is your last exercise on the list!";
          }
          debug.result = `success: ${exercise.name}`;
          setDebugInfo(debug);
          speak(response);
          return true;
        }
      } else if (exerciseIndex >= realExercises.length) {
        debug.result = `index ${exerciseIndex} out of range`;
        setDebugInfo(debug);
        speak(`You only have ${realExercises.length} exercises today.`);
        return true;
      }
    }

    // Update debug for non-exercise commands
    setDebugInfo(debug);

    // How many exercises question
    if (command.includes('how many') && command.includes('exercise')) {
      if (!actions.selectedDay) {
        speak("Please select a workout day first.");
        return true;
      }
      speak(`You have ${realExercises.length} exercises for ${actions.selectedDay}'s workout.`);
      return true;
    }

    // Day navigation commands
    for (const [keyword, day] of Object.entries(DAY_KEYWORDS)) {
      if (command.includes(keyword) && (command.includes('go to') || command.includes('open') || command.includes('start') || command.includes('show') || command === keyword)) {
        if (actions.selectedDay === null) {
          actions.onSelectDay(day);
          speak(`Opening ${keyword}'s workout. Let's do this!`);
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
        speak("You're already on the main screen");
        return true;
      }
    }

    // Timer commands
    if (command.includes('warm up') || command.includes('warmup') || command.includes('warm-up')) {
      if (command.includes('start')) {
        actions.onStartWarmup();
        speak("Starting warmup timer. Let's get those muscles ready!");
        return true;
      }
    }

    if (command.includes('cool down') || command.includes('cooldown') || command.includes('cool-down')) {
      if (command.includes('start')) {
        actions.onStartCooldown();
        speak('Starting cooldown timer. Great work today!');
        return true;
      }
    }

    // Timer controls
    if (actions.timerActive) {
      if (command.includes('pause')) {
        if (!actions.isPaused) {
          actions.onTogglePause();
          speak('Timer paused. Take a breather!');
          return true;
        } else {
          speak('Timer is already paused');
          return true;
        }
      }

      if (command.includes('resume') || command.includes('continue') || command.includes('play')) {
        if (actions.isPaused) {
          actions.onTogglePause();
          speak("Timer resumed. Let's go!");
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
          speak("You've already crushed this workout today! Rest up, champ!");
        } else {
          actions.onCompleteWorkout();
          speak('Workout complete! Amazing work! Keep that streak going!');
        }
        return true;
      } else {
        speak('Please select a workout day first');
        return true;
      }
    }

    // Help command
    if (command.includes('help') || command.includes('commands') || command.includes('what can you do')) {
      speak(`I'm ${ASSISTANT_NAME}, your workout buddy! You can say things like: go to Monday, what's my first exercise, what's my second exercise, start warmup, pause, resume, or complete workout.`);
      return true;
    }

    // Greeting
    if (command.includes('hello') || command.includes('hi') || command.includes('hey')) {
      speak(`Hey there! I'm ${ASSISTANT_NAME}, ready to help with your workout. What can I do for you?`);
      return true;
    }

    // Command not recognized
    speak(`Sorry, I didn't catch that. Say "help" to hear what I can do!`);
    return false;
  }, [actions, speak]);

  const startListening = useCallback(() => {
    if (!isSupported) return;
    if (recognitionRef.current) return; // Already listening

    const SpeechRecognitionAPI = (window as WindowWithSpeechRecognition).SpeechRecognition ||
                                  (window as WindowWithSpeechRecognition).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    // iOS fix: "prime" speech synthesis with a silent utterance on user gesture
    if (synthRef.current) {
      const primer = new SpeechSynthesisUtterance('');
      primer.volume = 0;
      synthRef.current.speak(primer);
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true; // Keep listening continuously
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Get the latest result (continuous mode can have multiple)
      const lastResultIndex = event.results.length - 1;
      const result = event.results[lastResultIndex];
      if (result && result[0] && result.isFinal) {
        const transcript = result[0].transcript;
        processCommand(transcript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      // Don't set isListening to false for no-speech errors in always-on mode
      if (event.error === 'not-allowed') {
        setIsListening(false);
        shouldRestartRef.current = false;
        speak('Microphone access denied. Please enable microphone permissions.');
      } else if (event.error === 'no-speech' || event.error === 'aborted') {
        // These are normal in always-on mode, will auto-restart
      } else {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      // Auto-restart if in always-on mode and should restart
      if (alwaysOn && shouldRestartRef.current && !isSpeaking) {
        setTimeout(() => {
          if (shouldRestartRef.current && !isSpeaking) {
            startListening();
          }
        }, 300); // Small delay before restarting
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
    }
  }, [isSupported, processCommand, speak, alwaysOn, isSpeaking]);

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false; // Prevent auto-restart
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      setAlwaysOn(false);
      stopListening();
    } else {
      setAlwaysOn(true);
      shouldRestartRef.current = true;
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Auto-start listening when component mounts (if supported)
  useEffect(() => {
    if (isSupported && alwaysOn && !isListening && !isSpeaking) {
      // Small delay to ensure everything is initialized
      const timer = setTimeout(() => {
        if (shouldRestartRef.current) {
          startListening();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSupported, alwaysOn, isListening, isSpeaking, startListening]);

  // Restart listening after speaking ends
  useEffect(() => {
    if (!isSpeaking && alwaysOn && !isListening && shouldRestartRef.current) {
      const timer = setTimeout(() => {
        if (shouldRestartRef.current && !isSpeaking) {
          startListening();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, alwaysOn, isListening, startListening]);

  return {
    isListening,
    isSupported,
    lastCommand,
    debugInfo,
    alwaysOn,
    isSpeaking,
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

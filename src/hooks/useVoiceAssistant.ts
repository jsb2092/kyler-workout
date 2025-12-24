import { useState, useEffect, useCallback, useRef } from 'react';
import type { DayName, Exercise, ExerciseVariant } from '../types';

// Available assistant names
export const ASSISTANT_NAMES = ['Rocky', 'Coach', 'Jarvis', 'Max', 'Flex'] as const;

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
  onStartStopwatch: () => void;
  onStopStopwatch: () => void;
  onResetStopwatch: () => void;
  stopwatchRunning: boolean;
  stopwatchTime: number;
  selectedDay: DayName | null;
  timerActive: boolean;
  isPaused: boolean;
  completedToday: DayName | null;
  exercises: Exercise[];
  getEffectiveExercise: (exercise: Exercise) => Exercise | ExerciseVariant;
  selectedVoice: string | null;
  enabled: boolean;
  assistantName: string;
}

// Map ordinal words to numbers (includes common speech recognition mishearings)
const ORDINAL_MAP: Record<string, number> = {
  'first': 1, '1st': 1, 'fist': 1, 'fest': 1,
  'second': 2, '2nd': 2, 'sec': 2,
  'third': 3, '3rd': 3, 'thurd': 3,
  'fourth': 4, '4th': 4, 'forth': 4,
  'fifth': 5, '5th': 5, 'fith': 5,
  'sixth': 6, '6th': 6,
  'seventh': 7, '7th': 7,
  'eighth': 8, '8th': 8, 'eight': 8,
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
  const actionsRef = useRef(actions); // Keep latest actions for stale closure fix

  // Always keep actionsRef up to date
  actionsRef.current = actions;

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
    const synth = window.speechSynthesis;
    if (!synth) return;

    // Cancel any ongoing speech and reset (iOS fix)
    synth.cancel();

    // Pause listening while speaking to avoid hearing ourselves
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.01;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    // Select voice - use user's choice or auto-select best available
    const voices = synth.getVoices();
    if (voices.length > 0) {
      let voiceToUse = null;

      // If user selected a specific voice, use that (use ref to avoid stale closure)
      const selectedVoice = actionsRef.current.selectedVoice;
      if (selectedVoice) {
        voiceToUse = voices.find(v => v.name === selectedVoice);
      }

      // Otherwise, auto-select the best available voice
      if (!voiceToUse) {
        // Priority list of natural-sounding voices (in order of preference)
        const preferredVoices = [
          // iOS premium voices
          'Samantha', 'Karen', 'Daniel', 'Moira', 'Tessa',
          // macOS premium voices
          'Ava', 'Allison', 'Susan',
          // Google/Chrome voices (sound more natural)
          'Google US English', 'Google UK English Female', 'Google UK English Male',
          // Microsoft voices
          'Microsoft Zira', 'Microsoft David', 'Microsoft Mark',
          // Android voices
          'English United States',
        ];

        // First try to find a preferred voice
        for (const preferred of preferredVoices) {
          const found = voices.find(v => v.name.includes(preferred));
          if (found) {
            voiceToUse = found;
            break;
          }
        }

        // If no preferred voice, look for any premium/enhanced English voice
        if (!voiceToUse) {
          voiceToUse = voices.find(v =>
            v.lang.startsWith('en') &&
            (v.name.includes('Premium') || v.name.includes('Enhanced') || v.localService === false)
          );
        }

        // Fall back to any English US voice, then any English voice
        if (!voiceToUse) {
          voiceToUse = voices.find(v => v.lang === 'en-US') ||
                       voices.find(v => v.lang.startsWith('en')) ||
                       voices[0];
        }
      }

      utterance.voice = voiceToUse || null;
    }

    // Track if we've already reset speaking state
    let hasEnded = false;
    const resetSpeaking = () => {
      if (!hasEnded) {
        hasEnded = true;
        setIsSpeaking(false);
      }
    };

    // Resume listening after speech ends
    utterance.onend = resetSpeaking;
    utterance.onerror = resetSpeaking;

    // Fallback timeout in case onend doesn't fire (common on mobile)
    // Estimate speech duration: ~80ms per character + 1 second buffer
    const estimatedDuration = Math.max(text.length * 80 + 1000, 2000);
    setTimeout(() => {
      // Check if speech synthesis is actually still speaking
      if (!synth.speaking) {
        resetSpeaking();
      }
    }, estimatedDuration);

    // iOS workaround: small delay after cancel, then speak
    setTimeout(() => {
      // iOS sometimes needs a resume after cancel
      if (synth.paused) {
        synth.resume();
      }
      synth.speak(utterance);
    }, 50);
  }, [isListening]);

  const processCommand = useCallback((transcript: string) => {
    // Use ref to get latest actions (fixes stale closure issue)
    const actions = actionsRef.current;

    let command = transcript.toLowerCase().trim();
    setLastCommand(command);

    // Check if command is addressed to the assistant by name
    // Create pattern based on selected assistant name
    const nameLower = actions.assistantName.toLowerCase();
    const namePattern = new RegExp(`^(hey |okay |ok )?${nameLower}[,]?\\s*`, 'i');
    const isAddressedToAssistant = namePattern.test(command);

    // Check if it's a mean comment (these don't require addressing K-Bot)
    const isMeanComment = command.includes('shut up') ||
                          command.includes('be quiet') ||
                          command.includes('stop talking') ||
                          command.includes('you suck') ||
                          command.includes('you stink') ||
                          command.includes('hate you') ||
                          command.includes('you\'re annoying') ||
                          command.includes('youre annoying') ||
                          command.includes('so annoying') ||
                          command.includes('go away') ||
                          command.includes('leave me alone');

    // If not addressed to assistant and not a mean comment, ignore
    if (!isAddressedToAssistant && !isMeanComment) {
      return false;
    }

    // Strip assistant name prefix if present
    command = command.replace(namePattern, '');

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
        const baseExercise = realExercises[exerciseIndex];
        if (baseExercise) {
          // Get the difficulty-adjusted exercise
          const exercise = actions.getEffectiveExercise(baseExercise);
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

    // Stopwatch commands
    if (command.includes('stopwatch') || command.includes('stop watch')) {
      if (command.includes('start') || command.includes('go')) {
        if (actions.stopwatchRunning) {
          speak('Stopwatch is already running!');
        } else {
          actions.onStartStopwatch();
          speak('Stopwatch started!');
        }
        return true;
      }

      if (command.includes('reset') || command.includes('clear')) {
        actions.onResetStopwatch();
        speak('Stopwatch reset to zero.');
        return true;
      }
    }

    // Stop command while stopwatch is running
    if (actions.stopwatchRunning && command.includes('stop') && !command.includes('stopwatch')) {
      actions.onStopStopwatch();
      const totalSeconds = Math.floor(actions.stopwatchTime / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      let timeMessage = '';
      if (minutes > 0) {
        timeMessage = `${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`;
      } else {
        timeMessage = `${seconds} second${seconds !== 1 ? 's' : ''}`;
      }

      speak(`Stopwatch stopped at ${timeMessage}.`);
      return true;
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
      speak(`I'm ${actions.assistantName}, your workout buddy! You can say things like: go to Monday, what's my first exercise, start warmup, start stopwatch, stop, reset stopwatch, or complete workout.`);
      return true;
    }

    // Attitude responses - the assistant always has sass!
    if (command.includes('shut up') || command.includes('be quiet') || command.includes('stop talking')) {
      speak("Fine! I'll just leave then!");
      // Close the app after speaking
      setTimeout(() => {
        window.close();
        // If window.close doesn't work (most browsers block it), navigate away
        window.location.href = 'about:blank';
      }, 2000);
      return true;
    }

    if (command.includes('you suck') || command.includes('you stink') || command.includes('hate you')) {
      speak("Wow, rude! And here I thought we were workout buddies. Maybe do some extra reps to work off that attitude!");
      return true;
    }

    if (command.includes('you\'re annoying') || command.includes('youre annoying') || command.includes('so annoying')) {
      speak("Annoying? I'm just trying to help you get fit! But fine, I'll try to be less... helpful.");
      return true;
    }

    if (command.includes('go away') || command.includes('leave me alone')) {
      // Randomly choose between sassy response or 1-minute ban
      if (Math.random() > 0.5) {
        speak("Alright, alright, I can take a hint. Good luck with your workout... you'll need it!");
      } else {
        speak("Fine! See you in one minute!");
        // Set a 1-minute ban in localStorage
        const banUntil = Date.now() + 60000; // 1 minute from now
        localStorage.setItem('kbot-ban-until', banUntil.toString());
        setTimeout(() => {
          window.close();
          window.location.href = 'about:blank';
        }, 2500);
      }
      return true;
    }

    // Greeting
    if (command.includes('hello') || command.includes('hi') || command.includes('hey')) {
      speak(`Hey there! I'm ${actions.assistantName}, ready to help with your workout. What can I do for you?`);
      return true;
    }

    // Command not recognized
    speak(`Sorry, I didn't catch that. Say "help" to hear what I can do!`);
    return false;
  }, [speak]);

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

  // Stop listening when disabled (e.g., K-Bot ban)
  useEffect(() => {
    if (!actions.enabled && isListening) {
      stopListening();
    }
  }, [actions.enabled, isListening, stopListening]);

  // Auto-start listening when component mounts (if supported and enabled)
  useEffect(() => {
    if (actions.enabled && isSupported && alwaysOn && !isListening && !isSpeaking) {
      // Small delay to ensure everything is initialized
      const timer = setTimeout(() => {
        if (shouldRestartRef.current && actions.enabled) {
          startListening();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [actions.enabled, isSupported, alwaysOn, isListening, isSpeaking, startListening]);

  // Restart listening after speaking ends (if enabled)
  useEffect(() => {
    if (actions.enabled && !isSpeaking && alwaysOn && !isListening && shouldRestartRef.current) {
      const timer = setTimeout(() => {
        if (shouldRestartRef.current && !isSpeaking && actions.enabled) {
          startListening();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [actions.enabled, isSpeaking, alwaysOn, isListening, startListening]);

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

import { Mic, MicOff } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  alwaysOn: boolean;
  isSpeaking: boolean;
  assistantName: string;
  onToggle: () => void;
}

export function VoiceButton({ isListening, isSupported, alwaysOn, isSpeaking, assistantName, onToggle }: VoiceButtonProps) {
  if (!isSupported) {
    return (
      <div className="fixed bottom-10 right-6 z-40 safe-area-bottom">
        <div className="bg-slate-800 border border-red-500/50 rounded-lg px-3 py-2 text-sm text-red-400">
          Voice not supported in this browser
        </div>
      </div>
    );
  }

  // Determine the status message
  const getStatusMessage = () => {
    if (isSpeaking) return `${assistantName} speaking...`;
    if (isListening) return 'Listening...';
    if (alwaysOn) return 'Starting...';
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 flex flex-col items-end gap-2 pointer-events-none">
      <div className="flex justify-end w-full items-center">
        {statusMessage && (
          <div className={`pointer-events-auto rounded-lg px-3 py-2 text-sm mr-2 ${
            isSpeaking
              ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300'
              : 'bg-green-500/20 border border-green-500/50 text-green-300 animate-pulse'
          }`}>
            {statusMessage}
          </div>
        )}
        <button
          onClick={onToggle}
          className={`pointer-events-auto p-4 rounded-full shadow-lg transition-all transform hover:scale-110 ${
            alwaysOn
              ? isListening
                ? 'bg-green-500 hover:bg-green-600'
                : isSpeaking
                  ? 'bg-purple-500 hover:bg-purple-600'
                  : 'bg-green-500/70 hover:bg-green-600'
              : 'bg-slate-600 hover:bg-slate-500'
          }`}
          aria-label={alwaysOn ? 'Turn off always-on listening' : 'Turn on always-on listening'}
        >
          {alwaysOn ? (
            <Mic className={`w-6 h-6 text-white ${isListening && !isSpeaking ? 'animate-pulse' : ''}`} />
          ) : (
            <MicOff className="w-6 h-6 text-white opacity-70" />
          )}
        </button>
      </div>
    </div>
  );
}

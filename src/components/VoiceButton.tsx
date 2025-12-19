import { Mic, MicOff } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  lastCommand: string | null;
  onToggle: () => void;
}

export function VoiceButton({ isListening, isSupported, lastCommand, onToggle }: VoiceButtonProps) {
  if (!isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {lastCommand && (
        <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 max-w-[200px] animate-fade-in">
          "{lastCommand}"
        </div>
      )}
      <button
        onClick={onToggle}
        className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-110 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        aria-label={isListening ? 'Stop listening' : 'Start voice command'}
      >
        {isListening ? (
          <Mic className="w-6 h-6 text-white" />
        ) : (
          <MicOff className="w-6 h-6 text-white" />
        )}
      </button>
      {isListening && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
      )}
    </div>
  );
}

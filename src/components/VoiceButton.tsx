import { Mic, Volume2 } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  lastCommand: string | null;
  onToggle: () => void;
}

export function VoiceButton({ isListening, isSupported, lastCommand, onToggle }: VoiceButtonProps) {
  if (!isSupported) {
    return (
      <div className="fixed bottom-10 right-6 z-40 safe-area-bottom">
        <div className="bg-slate-800 border border-red-500/50 rounded-lg px-3 py-2 text-sm text-red-400">
          Voice not supported in this browser
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 flex flex-col items-end gap-2 pointer-events-none">
      {lastCommand && (
        <div className="pointer-events-auto bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 max-w-[250px] animate-fade-in">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>"{lastCommand}"</span>
          </div>
        </div>
      )}
      <div className="flex justify-end w-full">
        {isListening && (
          <div className="pointer-events-auto bg-red-500/20 border border-red-500/50 rounded-lg px-3 py-2 text-sm text-red-300 animate-pulse mr-2">
            Listening... speak now
          </div>
        )}
        <button
          onClick={onToggle}
          className={`pointer-events-auto p-4 rounded-full shadow-lg transition-all transform hover:scale-110 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start voice command'}
        >
          {isListening ? (
            <Mic className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white opacity-70" />
          )}
        </button>
      </div>
    </div>
  );
}

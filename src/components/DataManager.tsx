import { useState, useRef, useEffect } from 'react';
import { Download, Upload, Trash2, Settings, X, Volume2 } from 'lucide-react';
import { exportData, importData, clearAllData } from '../database';

interface DataManagerProps {
  onDataChange: () => void;
  selectedVoice: string | null;
  onVoiceChange: (voiceName: string | null) => void;
}

export function DataManager({ onDataChange, selectedVoice, onVoiceChange }: DataManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      // Filter to English voices only
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      setAvailableVoices(englishVoices);
    };

    loadVoices();

    // Voices may load asynchronously
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const handleVoiceChange = (voiceName: string) => {
    onVoiceChange(voiceName === 'auto' ? null : voiceName);
  };

  const testVoice = () => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance("Hi! I'm K-Bot, your workout buddy!");
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    if (selectedVoice) {
      const voice = availableVoices.find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }

    synth.speak(utterance);
  };

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kyler-workout-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Data exported successfully!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to export data' });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = await importData(text);
      if (result.success) {
        setMessage({ type: 'success', text: `Imported ${result.imported} workout records!` });
        onDataChange();
      } else {
        setMessage({ type: 'error', text: result.error || 'Import failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to read file' });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClear = async () => {
    await clearAllData();
    setShowConfirmClear(false);
    setMessage({ type: 'success', text: 'All data cleared' });
    onDataChange();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-slate-700 hover:bg-slate-600 p-3 rounded-full shadow-lg transition-colors"
        aria-label="Settings"
      >
        <Settings className="w-6 h-6 text-slate-300" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-600 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Data Management</h3>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-700 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                : 'bg-red-500/20 border border-red-500/30 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 p-4 rounded-xl transition-colors"
          >
            <Download className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Export Data</div>
              <div className="text-sm text-slate-400">Download your workout history</div>
            </div>
          </button>

          <button
            onClick={handleImportClick}
            className="w-full flex items-center gap-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 p-4 rounded-xl transition-colors"
          >
            <Upload className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Import Data</div>
              <div className="text-sm text-slate-400">Restore from a backup file</div>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          {!showConfirmClear ? (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="w-full flex items-center gap-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 p-4 rounded-xl transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Clear All Data</div>
                <div className="text-sm text-slate-400">Delete all workout history</div>
              </div>
            </button>
          ) : (
            <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-xl">
              <p className="text-red-400 mb-3">Are you sure? This cannot be undone!</p>
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 px-4 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-slate-500 text-center">
          Export your data regularly to keep a backup!
        </p>

        {/* Voice Settings */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">K-Bot Voice</h4>
          <div className="flex gap-2">
            <select
              value={selectedVoice || 'auto'}
              onChange={(e) => handleVoiceChange(e.target.value)}
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="auto">Auto (Best Available)</option>
              {availableVoices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name}
                </option>
              ))}
            </select>
            <button
              onClick={testVoice}
              className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 px-3 py-2 rounded-lg transition-colors"
              aria-label="Test voice"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-500">Version 1.2.9</p>
        </div>
      </div>
    </div>
  );
}

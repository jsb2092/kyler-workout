import { useState, useEffect } from 'react';
import { Bookmark, X, Plus, Trash2 } from 'lucide-react';

interface DevNote {
  id: string;
  text: string;
  createdAt: string;
}

export function DevNotes() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<DevNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [devModeEnabled, setDevModeEnabled] = useState(false);

  // Check for dev mode from localStorage
  useEffect(() => {
    const checkDevMode = () => {
      setDevModeEnabled(localStorage.getItem('dev-mode') === 'true');
    };

    checkDevMode();
    // Listen for storage changes (in case settings updates dev mode)
    window.addEventListener('storage', checkDevMode);
    // Also check periodically for same-tab changes
    const interval = setInterval(checkDevMode, 500);

    return () => {
      window.removeEventListener('storage', checkDevMode);
      clearInterval(interval);
    };
  }, []);

  // Only show if dev mode is enabled via password in settings
  if (!devModeEnabled) {
    return null;
  }

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dev-notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = (updatedNotes: DevNote[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('dev-notes', JSON.stringify(updatedNotes));
  };

  const addNote = () => {
    if (!newNote.trim()) return;

    const note: DevNote = {
      id: Date.now().toString(),
      text: newNote.trim(),
      createdAt: new Date().toLocaleString(),
    };

    saveNotes([note, ...notes]);
    setNewNote('');
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  const clearAll = () => {
    if (confirm('Delete all notes?')) {
      saveNotes([]);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-6 z-40 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg flex items-center justify-center transition-all"
        title="Dev Notes"
      >
        <Bookmark className="w-5 h-5" />
        {notes.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
            {notes.length}
          </span>
        )}
      </button>

      {/* Notes Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-theme-bg-secondary rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col border border-purple-500/30 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-theme-border">
              <h2 className="text-xl font-bold text-theme-text-primary flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-purple-500" />
                Dev Notes
                <span className="text-sm font-normal text-purple-400">(dev only)</span>
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-theme-bg-tertiary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-theme-text-muted" />
              </button>
            </div>

            {/* Add Note */}
            <div className="p-4 border-b border-theme-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addNote()}
                  placeholder="Add a note..."
                  className="flex-1 px-3 py-2 bg-theme-bg-tertiary border border-theme-border rounded-lg text-theme-text-primary placeholder-theme-text-muted focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notes.length === 0 ? (
                <p className="text-center text-theme-text-muted py-8">
                  No notes yet. Add things you want to change!
                </p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-theme-bg-tertiary rounded-lg p-3 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-theme-text-primary flex-1">{note.text}</p>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                    <p className="text-xs text-theme-text-muted mt-1">{note.createdAt}</p>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notes.length > 0 && (
              <div className="p-4 border-t border-theme-border">
                <button
                  onClick={clearAll}
                  className="w-full py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                >
                  Clear All Notes
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

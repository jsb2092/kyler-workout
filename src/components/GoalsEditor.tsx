import { useState } from 'react';
import { X, Plus, Trash2, RotateCcw } from 'lucide-react';

interface GoalsEditorProps {
  goals: string[];
  defaultGoals: string[];
  onSave: (goals: string[]) => void;
  onReset: () => void;
  onClose: () => void;
}

export function GoalsEditor({ goals, defaultGoals, onSave, onReset, onClose }: GoalsEditorProps) {
  const [editedGoals, setEditedGoals] = useState<string[]>(goals);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleGoalChange = (index: number, value: string) => {
    const updated = [...editedGoals];
    updated[index] = value;
    setEditedGoals(updated);
  };

  const handleAddGoal = () => {
    setEditedGoals([...editedGoals, '']);
  };

  const handleRemoveGoal = (index: number) => {
    setEditedGoals(editedGoals.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Filter out empty goals
    const validGoals = editedGoals.filter(g => g.trim() !== '');
    onSave(validGoals);
    onClose();
  };

  const handleReset = () => {
    onReset();
    setEditedGoals(defaultGoals);
    setShowConfirmReset(false);
  };

  const isModified = JSON.stringify(editedGoals) !== JSON.stringify(goals);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-600 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Edit Your Goals</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {editedGoals.map((goal, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={goal}
                onChange={(e) => handleGoalChange(index, e.target.value)}
                placeholder="Enter a goal..."
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={() => handleRemoveGoal(index)}
                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                aria-label="Remove goal"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddGoal}
          className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 p-3 rounded-xl transition-colors mb-6"
        >
          <Plus className="w-5 h-5" />
          Add Goal
        </button>

        {!showConfirmReset ? (
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirmReset(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 py-3 px-4 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={!isModified && editedGoals.length > 0}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:text-slate-400 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="bg-orange-500/20 border border-orange-500/30 p-4 rounded-xl">
            <p className="text-orange-400 mb-3 text-sm">Reset goals to defaults?</p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 px-4 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { X, Plus, Pencil, Trash2, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
import type { DayName, Exercise, WorkoutDay } from '../types';
import { ExerciseEditor } from './ExerciseEditor';

interface WorkoutEditorProps {
  dayName: DayName;
  workout: WorkoutDay;
  isCustomized: boolean;
  onSave: (exercises: Exercise[], title?: string, color?: string) => void;
  onReset: () => void;
  onClose: () => void;
}

export function WorkoutEditor({ dayName, workout, isCustomized, onSave, onReset, onClose }: WorkoutEditorProps) {
  const [exercises, setExercises] = useState<Exercise[]>(workout.exercises);
  const [title, setTitle] = useState(workout.title);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...exercises];
    [updated[index - 1], updated[index]] = [updated[index]!, updated[index - 1]!];
    setExercises(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === exercises.length - 1) return;
    const updated = [...exercises];
    [updated[index], updated[index + 1]] = [updated[index + 1]!, updated[index]!];
    setExercises(updated);
  };

  const handleDelete = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSaveExercise = (exercise: Exercise) => {
    if (editingExercise) {
      // Update existing
      setExercises(exercises.map(e => e.id === editingExercise.id ? exercise : e));
    } else {
      // Add new
      setExercises([...exercises, exercise]);
    }
    setEditingExercise(null);
    setIsAddingExercise(false);
  };

  const handleSave = () => {
    onSave(exercises, title);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  const getExerciseTypeStyle = (exercise: Exercise) => {
    if (exercise.isWarmup) return 'border-l-green-500';
    if (exercise.isCooldown) return 'border-l-blue-500';
    if (exercise.isStretch) return 'border-l-purple-500';
    if (exercise.category) return 'border-l-slate-500 bg-slate-700/50';
    return 'border-l-slate-600';
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full border border-slate-600 shadow-2xl max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit {dayName.charAt(0).toUpperCase() + dayName.slice(1)}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Workout Title */}
          <div className="mb-4">
            <label className="block text-sm text-slate-400 mb-1">Workout Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Upper Body Push"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Exercise List */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {exercises.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                No exercises yet. Add one below!
              </div>
            ) : (
              exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className={`bg-slate-700/50 rounded-lg p-3 border-l-4 ${getExerciseTypeStyle(exercise)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">{exercise.name}</div>
                      <div className="text-sm text-slate-400">
                        {exercise.sets || exercise.duration || 'No sets/duration'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-600 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === exercises.length - 1}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-600 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingExercise(exercise)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-600 rounded"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Exercise Button */}
          <button
            onClick={() => setIsAddingExercise(true)}
            className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 p-3 rounded-xl transition-colors mb-4"
          >
            <Plus className="w-5 h-5" />
            Add Exercise
          </button>

          {/* Actions */}
          {!showConfirmReset ? (
            <div className="flex gap-3">
              {isCustomized && (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 py-3 px-4 rounded-xl transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-3 px-4 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="bg-orange-500/20 border border-orange-500/30 p-4 rounded-xl">
              <p className="text-orange-400 mb-3 text-sm">Reset this workout to defaults?</p>
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

      {/* Exercise Editor Modal */}
      {(editingExercise || isAddingExercise) && (
        <ExerciseEditor
          exercise={editingExercise}
          onSave={handleSaveExercise}
          onClose={() => {
            setEditingExercise(null);
            setIsAddingExercise(false);
          }}
        />
      )}
    </>
  );
}

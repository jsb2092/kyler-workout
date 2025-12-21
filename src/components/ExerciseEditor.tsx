import { useState } from 'react';
import { X } from 'lucide-react';
import type { Exercise } from '../types';

interface ExerciseEditorProps {
  exercise: Exercise | null; // null = adding new exercise
  onSave: (exercise: Exercise) => void;
  onClose: () => void;
}

export function ExerciseEditor({ exercise, onSave, onClose }: ExerciseEditorProps) {
  const [name, setName] = useState(exercise?.name || '');
  const [sets, setSets] = useState(exercise?.sets || '');
  const [duration, setDuration] = useState(exercise?.duration || '');
  const [muscles, setMuscles] = useState(exercise?.muscles || '');
  const [description, setDescription] = useState(exercise?.description || '');
  const [isWarmup, setIsWarmup] = useState(exercise?.isWarmup || false);
  const [isCooldown, setIsCooldown] = useState(exercise?.isCooldown || false);
  const [isStretch, setIsStretch] = useState(exercise?.isStretch || false);
  const [easier, setEasier] = useState(typeof exercise?.easier === 'string' ? exercise.easier : '');
  const [harder, setHarder] = useState(typeof exercise?.harder === 'string' ? exercise.harder : '');

  const handleSave = () => {
    if (!name.trim()) return;

    const newExercise: Exercise = {
      id: exercise?.id || `custom-${Date.now()}`,
      name: name.trim(),
      muscles: muscles.trim() || 'General',
      description: description.trim() || 'No description provided.',
      easier: easier.trim() || 'Do fewer reps or shorter duration',
      harder: harder.trim() || 'Do more reps or longer duration',
      ...(sets && { sets }),
      ...(duration && { duration }),
      ...(isWarmup && { isWarmup }),
      ...(isCooldown && { isCooldown }),
      ...(isStretch && { isStretch }),
    };

    onSave(newExercise);
    onClose();
  };

  const isValid = name.trim() !== '' && (sets.trim() !== '' || duration.trim() !== '');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full border border-slate-600 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">
            {exercise ? 'Edit Exercise' : 'Add Exercise'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Exercise Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Push-ups"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Sets or Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Sets/Reps</label>
              <input
                type="text"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                placeholder="e.g., 3 × 10"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 2 min"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Muscles */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Target Muscles</label>
            <input
              type="text"
              value={muscles}
              onChange={(e) => setMuscles(e.target.value)}
              placeholder="e.g., Chest, Shoulders, Triceps"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="How to perform this exercise..."
              rows={3}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Exercise Type */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Exercise Type</label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-2 bg-slate-700 px-3 py-2 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWarmup}
                  onChange={(e) => {
                    setIsWarmup(e.target.checked);
                    if (e.target.checked) {
                      setIsCooldown(false);
                      setIsStretch(false);
                    }
                  }}
                  className="rounded"
                />
                <span className="text-green-400">Warmup</span>
              </label>
              <label className="flex items-center gap-2 bg-slate-700 px-3 py-2 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCooldown}
                  onChange={(e) => {
                    setIsCooldown(e.target.checked);
                    if (e.target.checked) {
                      setIsWarmup(false);
                      setIsStretch(false);
                    }
                  }}
                  className="rounded"
                />
                <span className="text-blue-400">Cooldown</span>
              </label>
              <label className="flex items-center gap-2 bg-slate-700 px-3 py-2 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={isStretch}
                  onChange={(e) => {
                    setIsStretch(e.target.checked);
                    if (e.target.checked) {
                      setIsWarmup(false);
                      setIsCooldown(false);
                    }
                  }}
                  className="rounded"
                />
                <span className="text-purple-400">Stretch</span>
              </label>
            </div>
          </div>

          {/* Easier/Harder Tips */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-green-400 mb-1">Easier Tip</label>
              <input
                type="text"
                value={easier}
                onChange={(e) => setEasier(e.target.value)}
                placeholder="How to make easier..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-orange-400 mb-1">Harder Tip</label>
              <input
                type="text"
                value={harder}
                onChange={(e) => setHarder(e.target.value)}
                placeholder="How to make harder..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-3 px-4 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:text-slate-400 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
          >
            {exercise ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

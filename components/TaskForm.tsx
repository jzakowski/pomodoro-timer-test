'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (title: string, estimatedPomodoros: number, priority: 'high' | 'medium' | 'low') => void;
  onCancel?: () => void;
  editData?: {
    title: string;
    estimatedPomodoros: number;
    priority: 'high' | 'medium' | 'low';
  } | null;
}

export default function TaskForm({ onSubmit, onCancel, editData }: TaskFormProps) {
  const [title, setTitle] = useState(editData?.title || '');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(editData?.estimatedPomodoros || 1);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>(
    editData?.priority || 'medium'
  );

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setEstimatedPomodoros(editData.estimatedPomodoros);
      setPriority(editData.priority);
    }
  }, [editData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim(), estimatedPomodoros, priority);
      // Reset form only if not editing
      if (!editData) {
        setTitle('');
        setEstimatedPomodoros(1);
        setPriority('medium');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {editData ? 'Edit Task' : 'Add New Task'}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Task Title */}
        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Task Title
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to work on?"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
            autoFocus
          />
        </div>

        {/* Estimated Pomodoros */}
        <div>
          <label
            htmlFor="pomodoro-count"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Estimated Pomodoros
          </label>
          <div className="flex items-center gap-3">
            <input
              id="pomodoro-count"
              type="number"
              min="1"
              max="20"
              value={estimatedPomodoros}
              onChange={(e) => setEstimatedPomodoros(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-24 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {estimatedPomodoros === 1 ? 'pomodoro' : 'pomodoros'} (~
              {estimatedPomodoros * 25} minutes)
            </span>
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <div className="flex gap-3">
            {(['high', 'medium', 'low'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium capitalize transition-all ${
                  priority === p
                    ? p === 'high'
                      ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : p === 'medium'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            {editData ? 'Update Task' : 'Add Task'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

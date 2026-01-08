'use client';

import React, { useState, FormEvent } from 'react';
import { Plus } from 'lucide-react';

interface AddTaskFormProps {
  onAdd: (title: string, estimatedPomodoros: number, priority: 'high' | 'medium' | 'low') => void;
}

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(4);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    onAdd(title.trim(), estimatedPomodoros, priority);

    // Reset form
    setTitle('');
    setEstimatedPomodoros(4);
    setPriority('medium');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Title Input */}
        <div>
          <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What are you working on?
          </label>
          <input
            type="text"
            id="taskTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            autoComplete="off"
          />
        </div>

        {/* Pomodoro Estimate and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pomodoro Estimate */}
          <div>
            <label htmlFor="pomodoroEstimate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estimated Pomodoros: {estimatedPomodoros}
            </label>
            <input
              type="range"
              id="pomodoroEstimate"
              min="1"
              max="10"
              value={estimatedPomodoros}
              onChange={(e) => setEstimatedPomodoros(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          {/* Priority Selector */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!title.trim()}
          className="
            w-full px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600
            text-white font-medium transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
            flex items-center justify-center gap-2
          "
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </form>
    </div>
  );
}

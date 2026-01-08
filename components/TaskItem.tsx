'use client';

import React from 'react';
import { Check, ChevronRight, Trash2, Edit2, Play } from 'lucide-react';
import { Task } from '@/types/timer';

interface TaskItemProps {
  task: Task;
  onToggleComplete: () => void;
  onSetActive: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export default function TaskItem({
  task,
  onToggleComplete,
  onSetActive,
  onDelete,
  onEdit,
}: TaskItemProps) {
  const priorityColors = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };

  const priorityLabels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  return (
    <div
      className={`group flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${
        task.isActive
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-md'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      } ${task.isCompleted ? 'opacity-60' : ''}`}
    >
      {/* Checkbox */}
      <button
        onClick={onToggleComplete}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          task.isCompleted
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500'
        }`}
        aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.isCompleted && <Check size={14} />}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3
            className={`font-medium truncate ${
              task.isCompleted
                ? 'line-through text-gray-500 dark:text-gray-500'
                : 'text-gray-800 dark:text-white'
            }`}
          >
            {task.title}
          </h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}
          >
            {priorityLabels[task.priority]}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span>
            {task.completedPomodoros} / {task.estimatedPomodoros} pomodoros
          </span>
          {task.isActive && (
            <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
              <Play size={12} /> Active
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!task.isActive && !task.isCompleted && (
          <button
            onClick={onSetActive}
            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
            aria-label="Set as active task"
          >
            <ChevronRight size={18} />
          </button>
        )}
        <button
          onClick={onEdit}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          aria-label="Edit task"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

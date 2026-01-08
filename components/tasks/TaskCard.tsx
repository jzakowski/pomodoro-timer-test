'use client';

import React from 'react';
import { Task } from '@/types/timer';
import { Star, Pencil, Trash2, Check } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleActive: () => void;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskCard({
  task,
  onToggleActive,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getPriorityLabel = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const progressPercentage = (task.completedPomodoros / task.estimatedPomodoros) * 100;

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-3
        transition-all duration-200 hover:shadow-lg
        ${task.isActive ? 'ring-2 ring-blue-500' : ''}
        ${task.isCompleted ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        {/* Task Title and Priority */}
        <div className="flex-1 mr-4">
          <h3
            className={`
              text-lg font-semibold mb-1
              ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}
            `}
          >
            {task.title}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`
                text-xs font-medium px-2 py-1 rounded-full
                ${getPriorityColor(task.priority)}
              `}
            >
              {getPriorityLabel(task.priority)}
            </span>
            {task.isActive && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleActive}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${task.isActive
                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-yellow-50 hover:text-yellow-600'
              }
            `}
            aria-label={task.isActive ? 'Remove as active' : 'Set as active'}
            title={task.isActive ? 'Active task' : 'Set as active'}
          >
            <Star className={`w-4 h-4 ${task.isActive ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={onToggleComplete}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${task.isCompleted
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-green-50 hover:text-green-600'
              }
            `}
            aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            title={task.isCompleted ? 'Completed' : 'Mark complete'}
          >
            <Check className={`w-4 h-4 ${task.isCompleted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={onEdit}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all duration-200"
            aria-label="Edit task"
            title="Edit task"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={onDelete}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all duration-200"
            aria-label="Delete task"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Progress</span>
          <span className="font-medium">
            {task.completedPomodoros} / {task.estimatedPomodoros} pomodoros
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className={`
              h-full rounded-full transition-all duration-300
              ${task.isCompleted
                ? 'bg-green-500'
                : progressPercentage >= 100
                  ? 'bg-blue-500'
                  : 'bg-blue-500'
              }
            `}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

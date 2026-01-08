'use client';

import React, { useState } from 'react';
import { useTasks } from '@/contexts/TasksContext';
import TaskCard from './TaskCard';
import { Filter } from 'lucide-react';

export default function TaskList() {
  const { tasks, filterTasks, toggleTaskComplete, setActiveTask, deleteTask, clearCompletedTasks } = useTasks();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const filteredTasks = filterTasks(filter);
  const hasCompletedTasks = tasks.some(t => t.isCompleted);

  const handleEdit = (taskId: string) => {
    setEditingTaskId(taskId);
    // TODO: Implement edit modal/dialog
    console.log('Edit task:', taskId);
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <div className="flex gap-2 flex-1">
          <button
            onClick={() => setFilter('all')}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${filter === 'active'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            Active ({tasks.filter(t => !t.isCompleted).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${filter === 'completed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            Completed ({tasks.filter(t => t.isCompleted).length})
          </button>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {filter === 'completed' ? 'No completed tasks yet' :
             filter === 'active' ? 'No active tasks' :
             'No tasks yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filter === 'completed' ? 'Complete a task to see it here' :
             filter === 'active' ? 'All tasks are completed!' :
             'Add your first task to get started'}
          </p>
        </div>
      ) : (
        <div>
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleActive={() => setActiveTask(task.isActive ? null : task.id)}
              onToggleComplete={() => toggleTaskComplete(task.id)}
              onEdit={() => handleEdit(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </div>
      )}

      {/* Clear Completed Button */}
      {hasCompletedTasks && (
        <div className="mt-6 text-center">
          <button
            onClick={clearCompletedTasks}
            className="
              px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200
              dark:bg-gray-700 dark:hover:bg-gray-600
              text-gray-700 dark:text-gray-300 font-medium
              transition-all duration-200
            "
          >
            Clear Completed Tasks
          </button>
        </div>
      )}
    </div>
  );
}

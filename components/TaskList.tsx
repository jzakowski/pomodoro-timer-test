'use client';

import React, { useState } from 'react';
import { Task } from '@/types/timer';
import { useTasks } from '@/contexts/TaskContext';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { Plus, Filter } from 'lucide-react';

type FilterType = 'all' | 'active' | 'completed';

export default function TaskList() {
  const { tasks, deleteTask, toggleTaskComplete, setActiveTask, updateTask, addTask } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const handleAddTask = (title: string, estimatedPomodoros: number, priority: 'high' | 'medium' | 'low') => {
    addTask(title, estimatedPomodoros, priority);
    setShowForm(false);
  };

  const handleUpdateTask = (title: string, estimatedPomodoros: number, priority: 'high' | 'medium' | 'low') => {
    if (editingTask) {
      updateTask(editingTask.id, title, estimatedPomodoros, priority);
      setEditingTask(null);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(false);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by: active first, then incomplete, then completed
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    if (a.isCompleted && !b.isCompleted) return 1;
    if (!a.isCompleted && b.isCompleted) return -1;
    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Tasks</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {completedCount} of {totalCount} tasks completed
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingTask(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Add/Edit Task Form */}
      {(showForm || editingTask) && (
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          editData={
            editingTask
              ? {
                  title: editingTask.title,
                  estimatedPomodoros: editingTask.estimatedPomodoros,
                  priority: editingTask.priority,
                }
              : null
          }
        />
      )}

      {/* Filter Buttons */}
      {tasks.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-gray-500 dark:text-gray-400" />
          <div className="flex gap-2">
            {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {filter === 'completed'
              ? 'No completed tasks yet'
              : filter === 'active'
              ? 'No active tasks'
              : 'No tasks yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {filter === 'all'
              ? 'Add your first task to get started!'
              : 'Try a different filter'}
          </p>
          {filter === 'all' && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Create your first task →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={() => toggleTaskComplete(task.id)}
              onSetActive={() => setActiveTask(task.id)}
              onDelete={() => handleDeleteTask(task.id)}
              onEdit={() => handleEditTask(task)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

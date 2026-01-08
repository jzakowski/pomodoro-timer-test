'use client';

import React from 'react';
import { useTasks } from '@/contexts/TasksContext';
import AddTaskForm from './tasks/AddTaskForm';
import TaskList from './tasks/TaskList';

export default function Tasks() {
  const { tasks, addTask } = useTasks();

  const handleAddTask = (
    title: string,
    estimatedPomodoros: number,
    priority: 'high' | 'medium' | 'low'
  ) => {
    addTask(title, estimatedPomodoros, priority);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Tasks
      </h2>

      {/* Add Task Form */}
      <AddTaskForm onAdd={handleAddTask} />

      {/* Task List */}
      <TaskList />
    </div>
  );
}

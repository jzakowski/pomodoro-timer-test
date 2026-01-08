'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task } from '@/types/timer';

interface TasksContextType {
  tasks: Task[];
  activeTask: Task | null;
  addTask: (title: string, estimatedPomodoros: number, priority: 'high' | 'medium' | 'low') => void;
  editTask: (id: string, title: string, estimatedPomodoros: number, priority: 'high' | 'medium' | 'low') => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  setActiveTask: (id: string | null) => void;
  incrementTaskPomodoro: (id: string) => void;
  clearCompletedTasks: () => void;
  filterTasks: (filter: 'all' | 'active' | 'completed') => Task[];
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const TASKS_STORAGE_KEY = 'pomodoro_tasks';

// Helper functions for localStorage
function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return [];
  }
}

function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);

    // Set active task from localStorage
    const activeId = loadedTasks.find(t => t.isActive)?.id || null;
    setActiveTaskId(activeId);
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0 || loadTasks().length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const addTask = useCallback((
    title: string,
    estimatedPomodoros: number,
    priority: 'high' | 'medium' | 'low'
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      estimatedPomodoros,
      completedPomodoros: 0,
      priority,
      isActive: false,
      isCompleted: false,
      createdAt: Date.now(),
    };

    setTasks(prev => {
      // If this is the first task, make it active
      if (prev.length === 0) {
        newTask.isActive = true;
        setActiveTaskId(newTask.id);
      }
      return [...prev, newTask];
    });
  }, []);

  const editTask = useCallback((
    id: string,
    title: string,
    estimatedPomodoros: number,
    priority: 'high' | 'medium' | 'low'
  ) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, title, estimatedPomodoros, priority }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const filtered = prev.filter(task => task.id !== id);

      // If we deleted the active task, clear active state
      if (activeTaskId === id) {
        setActiveTaskId(null);
      }

      return filtered;
    });
  }, [activeTaskId]);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  }, []);

  const setActiveTask = useCallback((id: string | null) => {
    setTasks(prev =>
      prev.map(task => ({
        ...task,
        isActive: id ? task.id === id : false
      }))
    );
    setActiveTaskId(id);
  }, []);

  const incrementTaskPomodoro = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              completedPomodoros: Math.min(
                task.completedPomodoros + 1,
                task.estimatedPomodoros
              )
            }
          : task
      )
    );
  }, []);

  const clearCompletedTasks = useCallback(() => {
    setTasks(prev => prev.filter(task => !task.isCompleted));
  }, []);

  const filterTasks = useCallback((filter: 'all' | 'active' | 'completed') => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.isCompleted);
      case 'completed':
        return tasks.filter(task => task.isCompleted);
      default:
        return tasks;
    }
  }, [tasks]);

  const activeTask = tasks.find(t => t.id === activeTaskId) || null;

  const value: TasksContextType = {
    tasks,
    activeTask,
    addTask,
    editTask,
    deleteTask,
    toggleTaskComplete,
    setActiveTask,
    incrementTaskPomodoro,
    clearCompletedTasks,
    filterTasks,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}

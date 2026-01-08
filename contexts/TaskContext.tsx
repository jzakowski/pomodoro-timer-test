'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Task } from '@/types/timer';

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, estimatedPomodoros: number, priority: 'high' | 'medium' | 'low') => void;
  updateTask: (id: string, title: string, estimatedPomodoros: number, priority: 'high' | 'medium' | 'low') => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  setActiveTask: (id: string) => void;
  incrementTaskPomodoros: (id: string) => void;
  getCompletedCount: () => number;
  getTotalCount: () => number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = 'pomodoro-tasks';

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const isInitialMount = useRef(true);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    }
    isInitialMount.current = false;
  }, []);

  // Save tasks to localStorage whenever they change (but not on initial mount)
  useEffect(() => {
    if (!isInitialMount.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (
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
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (
    id: string,
    title: string,
    estimatedPomodoros: number,
    priority: 'high' | 'medium' | 'low'
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, title, estimatedPomodoros, priority }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, isCompleted: !task.isCompleted, isActive: false }
          : task
      )
    );
  };

  const setActiveTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        isActive: task.id === id,
      }))
    );
  };

  const incrementTaskPomodoros = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completedPomodoros: task.completedPomodoros + 1,
            }
          : task
      )
    );
  };

  const getCompletedCount = () => {
    return tasks.filter((t) => t.isCompleted).length;
  };

  const getTotalCount = () => {
    return tasks.length;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        setActiveTask,
        incrementTaskPomodoros,
        getCompletedCount,
        getTotalCount,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

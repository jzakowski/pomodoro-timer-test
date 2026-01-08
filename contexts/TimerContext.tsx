'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TimerState, TimerSettings, SessionMode } from '@/types/timer';
import { saveTimerState, loadTimerState, loadSettings, saveSettings } from '@/lib/storage';
import { useStats } from './StatsContext';
import { useTasks } from './TasksContext';

interface TimerContextType {
  mode: SessionMode;
  timeRemaining: number;
  isRunning: boolean;
  currentSession: number;
  settings: TimerSettings;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipToNextSession: () => void;
  updateSettings: (newSettings: Partial<TimerSettings>) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const INITIAL_STATE: TimerState = {
  mode: 'work',
  timeRemaining: 25 * 60, // 25 minutes in seconds
  isRunning: false,
  currentSession: 1,
  totalSessions: 0,
};

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timerState, setTimerState] = useState<TimerState>(INITIAL_STATE);
  const [settings, setSettings] = useState<TimerSettings>(loadSettings());
  const { recordSession } = useStats();
  const { activeTask, incrementTaskPomodoro } = useTasks();

  // Load timer state from localStorage on mount
  useEffect(() => {
    const saved = loadTimerState();
    if (saved) {
      setTimerState(saved);
    }
  }, []);

  // Save timer state whenever it changes
  useEffect(() => {
    saveTimerState(timerState);
  }, [timerState]);

  // Timer countdown logic
  useEffect(() => {
    if (!timerState.isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setTimerState((prev) => {
        if (prev.timeRemaining <= 1) {
          // Timer completed
          return {
            ...prev,
            isRunning: false,
            timeRemaining: 0,
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState.isRunning]);

  // Handle session completion
  useEffect(() => {
    if (timerState.timeRemaining === 0 && !timerState.isRunning) {
      // Play notification sound (to be implemented)
      console.log('Timer completed!');

      // Record the completed session
      const duration = getDurationForMode(timerState.mode, settings);
      recordSession(timerState.mode, duration, true);

      // Increment active task's pomodoro count if work session completed
      if (timerState.mode === 'work' && activeTask) {
        incrementTaskPomodoro(activeTask.id);
        console.log(`Incremented pomodoro for task: ${activeTask.title}`);
      }

      // Auto-switch to next session if enabled
      if (settings.autoStart) {
        setTimeout(() => {
          skipToNextSession();
        }, 1000);
      }
    }
  }, [timerState.timeRemaining, timerState.isRunning, timerState.mode, settings, activeTask, incrementTaskPomodoro]);

  const startTimer = useCallback(() => {
    setTimerState((prev) => ({ ...prev, isRunning: true }));
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    const duration = getDurationForMode(timerState.mode, settings);
    setTimerState((prev) => ({
      ...prev,
      timeRemaining: duration * 60,
      isRunning: false,
    }));
  }, [timerState.mode, settings]);

  const skipToNextSession = useCallback(() => {
    setTimerState((prev) => {
      let nextMode: SessionMode;
      let nextSession = prev.currentSession;

      if (prev.mode === 'work') {
        // After work, determine break type
        if (prev.currentSession >= settings.sessionsUntilLongBreak) {
          nextMode = 'longBreak';
          nextSession = 1; // Reset session count after long break
        } else {
          nextMode = 'shortBreak';
        }
      } else {
        // After any break, go back to work
        nextMode = 'work';
        nextSession = prev.currentSession + 1;
      }

      const duration = getDurationForMode(nextMode, settings);

      return {
        ...prev,
        mode: nextMode,
        currentSession: nextSession,
        timeRemaining: duration * 60,
        isRunning: settings.autoStart,
      };
    });
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<TimerSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
  }, [settings]);

  const value: TimerContextType = {
    mode: timerState.mode,
    timeRemaining: timerState.timeRemaining,
    isRunning: timerState.isRunning,
    currentSession: timerState.currentSession,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToNextSession,
    updateSettings,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}

// Helper function to get duration based on mode
function getDurationForMode(mode: SessionMode, settings: TimerSettings): number {
  switch (mode) {
    case 'work':
      return settings.workDuration;
    case 'shortBreak':
      return settings.shortBreakDuration;
    case 'longBreak':
      return settings.longBreakDuration;
  }
}

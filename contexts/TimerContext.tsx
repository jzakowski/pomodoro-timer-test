'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SessionMode } from '@/types/timer';

interface TimerContextType {
  mode: SessionMode;
  timeRemaining: number;
  isRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipToNextSession: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within TimerProvider');
  }
  return context;
}

// Default durations in seconds
const DEFAULT_DURATIONS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<SessionMode>('work');
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('pomodoro_mode') as SessionMode;
    const savedTime = localStorage.getItem('pomodoro_timeRemaining');
    const savedRunning = localStorage.getItem('pomodoro_isRunning');

    if (savedMode) setMode(savedMode);
    if (savedTime) setTimeRemaining(parseInt(savedTime, 10));
    if (savedRunning) setIsRunning(savedRunning === 'true');
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pomodoro_mode', mode);
    localStorage.setItem('pomodoro_timeRemaining', timeRemaining.toString());
    localStorage.setItem('pomodoro_isRunning', isRunning.toString());
  }, [mode, timeRemaining, isRunning]);

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer completed
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining]);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);

    // Play notification sound (if enabled)
    // Show notification (if enabled)
    // Auto-switch to next session

    // For now, just switch mode
    skipToNextSession();
  }, []);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeRemaining(DEFAULT_DURATIONS[mode]);
    setIsRunning(false);
  }, [mode]);

  const skipToNextSession = useCallback(() => {
    setMode((prevMode) => {
      let nextMode: SessionMode;

      switch (prevMode) {
        case 'work':
          // After work, go to short break
          nextMode = 'shortBreak';
          break;
        case 'shortBreak':
          // After short break, go back to work
          nextMode = 'work';
          break;
        case 'longBreak':
          // After long break, go back to work
          nextMode = 'work';
          break;
        default:
          nextMode = 'work';
      }

      // Reset time for new mode
      setTimeRemaining(DEFAULT_DURATIONS[nextMode]);
      setIsRunning(false);

      return nextMode;
    });
  }, []);

  return (
    <TimerContext.Provider
      value={{
        mode,
        timeRemaining,
        isRunning,
        startTimer,
        pauseTimer,
        resetTimer,
        skipToNextSession,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

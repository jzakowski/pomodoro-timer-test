'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Stats, SessionRecord, SessionMode } from '@/types/timer';
import { loadStats, saveStats, DEFAULT_STATS } from '@/lib/storage';

interface StatsContextType {
  stats: Stats;
  recordSession: (mode: SessionMode, duration: number, completed: boolean) => void;
  resetStats: () => void;
  getTodaySessions: () => number;
  getTodayMinutes: () => number;
  getLast7DaysSessions: () => number[];
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);

  // Load stats from localStorage on mount
  useEffect(() => {
    const loaded = loadStats();
    setStats(loaded);
  }, []);

  // Save stats whenever they change
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  // Helper to get today's date in YYYY-MM-DD format
  const getTodayDate = useCallback((): string => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Calculate streak
  const calculateStreak = useCallback((sessionsByDate: Record<string, number>, lastActiveDate: string): number => {
    if (!lastActiveDate) return 0;

    let streak = 0;
    let currentDate = new Date(lastActiveDate);
    const today = new Date(getTodayDate());

    // Check if last active date is today or yesterday
    const daysDiff = Math.floor((today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 1) return 0; // Streak broken

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (sessionsByDate[dateStr] && sessionsByDate[dateStr] > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [getTodayDate]);

  // Record a completed session
  const recordSession = useCallback((mode: SessionMode, duration: number, completed: boolean) => {
    const today = getTodayDate();
    const timestamp = Date.now();

    setStats((prev) => {
      const isWork = mode === 'work';
      const newSession: SessionRecord = {
        id: `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
        date: today,
        mode,
        duration,
        completed,
        timestamp,
      };

      const updatedSessionsByDate = {
        ...prev.sessionsByDate,
        [today]: (prev.sessionsByDate[today] || 0) + (isWork ? 1 : 0),
      };

      const newTotalMinutes = prev.totalMinutes + duration;
      const newWorkMinutes = prev.workMinutes + (isWork ? duration : 0);
      const newBreakMinutes = prev.breakMinutes + (!isWork ? duration : 0);
      const newTotalSessions = prev.totalSessions + (isWork ? 1 : 0);

      // Calculate new streak
      const newStreak = calculateStreak(updatedSessionsByDate, today);
      const newBestStreak = Math.max(prev.bestStreak, newStreak);

      return {
        ...prev,
        totalSessions: newTotalSessions,
        totalMinutes: newTotalMinutes,
        workMinutes: newWorkMinutes,
        breakMinutes: newBreakMinutes,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        sessionsByDate: updatedSessionsByDate,
        lastActiveDate: today,
        sessionHistory: [newSession, ...prev.sessionHistory].slice(0, 100), // Keep last 100 sessions
      };
    });
  }, [getTodayDate, calculateStreak]);

  // Reset all statistics
  const resetStats = useCallback(() => {
    if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
      setStats(DEFAULT_STATS);
    }
  }, []);

  // Get today's session count
  const getTodaySessions = useCallback((): number => {
    const today = getTodayDate();
    return stats.sessionsByDate[today] || 0;
  }, [stats.sessionsByDate, getTodayDate]);

  // Get today's focus minutes
  const getTodayMinutes = useCallback((): number => {
    const today = getTodayDate();
    return stats.sessionHistory
      .filter((session) => session.date === today && session.mode === 'work' && session.completed)
      .reduce((total, session) => total + session.duration, 0);
  }, [stats.sessionHistory, getTodayDate]);

  // Get last 7 days sessions
  const getLast7DaysSessions = useCallback((): number[] => {
    const sessions: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      sessions.push(stats.sessionsByDate[dateStr] || 0);
    }
    return sessions;
  }, [stats.sessionsByDate]);

  const value: StatsContextType = {
    stats,
    recordSession,
    resetStats,
    getTodaySessions,
    getTodayMinutes,
    getLast7DaysSessions,
  };

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}

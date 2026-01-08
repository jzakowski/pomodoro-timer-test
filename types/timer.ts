export type SessionMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerState {
  mode: SessionMode;
  timeRemaining: number; // in seconds
  isRunning: boolean;
  currentSession: number; // current work session number (1-4)
  totalSessions: number; // total work sessions completed
}

export interface TimerSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsUntilLongBreak: number;
  autoStart: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  volume: number; // 0-100
  soundType: 'chime' | 'bell' | 'gong';
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
}

export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
  isCompleted: boolean;
  createdAt: number;
}

export interface SessionRecord {
  id: string;
  date: string; // ISO date string
  mode: SessionMode;
  duration: number; // in minutes
  completed: boolean;
  timestamp: number; // Unix timestamp
}

export interface Stats {
  totalSessions: number;
  totalMinutes: number;
  workMinutes: number;
  breakMinutes: number;
  currentStreak: number;
  bestStreak: number;
  sessionsByDate: Record<string, number>;
  lastActiveDate: string;
  sessionHistory: SessionRecord[];
}

'use client';

import { useState } from 'react';
import TimerDisplay from '@/components/TimerDisplay';
import TimerControls from '@/components/TimerControls';
import TabNavigation from '@/components/TabNavigation';
import Settings from '@/components/Settings';
import Stats from '@/components/Stats';
import Tasks from '@/components/Tasks';
import { TimerProvider, useTimer } from '@/contexts/TimerContext';
import { StatsProvider } from '@/contexts/StatsContext';
import { TasksProvider, useTasks } from '@/contexts/TasksContext';
import { SessionMode } from '@/types/timer';

function TimerContent() {
  const { mode, timeRemaining } = useTimer();
  const { activeTask } = useTasks();

  return (
    <div className="flex flex-col items-center">
      {activeTask && (
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-6 py-3">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
            Currently working on:
          </p>
          <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">
            {activeTask.title}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-blue-600 dark:text-blue-400">
              Progress: {activeTask.completedPomodoros} / {activeTask.estimatedPomodoros} pomodoros
            </span>
          </div>
        </div>
      )}
      <TimerDisplay />
      <TimerControls />
    </div>
  );
}

function HomeContent() {
  const [activeTab, setActiveTab] = useState<'timer' | 'tasks' | 'stats' | 'settings'>('timer');
  const { mode, timeRemaining } = useTimer();

  // Background gradient based on session mode
  const getBackgroundGradient = () => {
    switch (mode) {
      case 'work':
        return 'from-red-50 to-red-100 dark:from-red-950 dark:to-red-900';
      case 'shortBreak':
        return 'from-green-50 to-green-100 dark:from-green-950 dark:to-green-900';
      case 'longBreak':
        return 'from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900';
      default:
        return 'from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900';
    }
  };

  return (
    <main className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-colors duration-500`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Pomodoro Timer
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Stay productive, one session at a time
          </p>
        </header>

        {/* Main Content Area */}
        <div className="mb-8">
          {activeTab === 'timer' && <TimerContent />}
          {activeTab === 'tasks' && <Tasks />}
          {activeTab === 'stats' && <Stats />}
          {activeTab === 'settings' && <Settings />}
        </div>

        {/* Bottom Navigation (Mobile) / Top Navigation (Desktop) */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <StatsProvider>
      <TasksProvider>
        <TimerProvider>
          <HomeContent />
        </TimerProvider>
      </TasksProvider>
    </StatsProvider>
  );
}

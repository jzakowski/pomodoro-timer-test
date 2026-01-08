'use client';

import { useState } from 'react';
import TimerDisplay from '@/components/TimerDisplay';
import TimerControls from '@/components/TimerControls';
import TabNavigation from '@/components/TabNavigation';
import Settings from '@/components/Settings';
import { TimerProvider, useTimer } from '@/contexts/TimerContext';
import { SessionMode } from '@/types/timer';

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
          {activeTab === 'timer' && (
            <div className="flex flex-col items-center">
              <TimerDisplay />
              <TimerControls />
            </div>
          )}
          {activeTab === 'tasks' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Tasks</h2>
              <p className="text-gray-600 dark:text-gray-300">Task management coming soon...</p>
            </div>
          )}
          {activeTab === 'stats' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Statistics</h2>
              <p className="text-gray-600 dark:text-gray-300">Statistics dashboard coming soon...</p>
            </div>
          )}
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
    <TimerProvider>
      <HomeContent />
    </TimerProvider>
  );
}

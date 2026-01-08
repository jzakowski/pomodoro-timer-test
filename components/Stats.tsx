'use client';

import React from 'react';
import { useStats } from '@/contexts/StatsContext';
import { Flame, Clock, Target, TrendingUp } from 'lucide-react';
import WeeklyChart from './stats/WeeklyChart';
import WorkBreakPieChart from './stats/WorkBreakPieChart';
import SessionHistory from './stats/SessionHistory';

export default function Stats() {
  const { stats, getTodaySessions, getTodayMinutes, resetStats } = useStats();

  const todaySessions = getTodaySessions();
  const todayMinutes = getTodayMinutes();
  const todayHours = Math.floor(todayMinutes / 60);
  const todayRemainingMinutes = todayMinutes % 60;

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Statistics</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Track your productivity</p>
        </div>
        <button
          onClick={resetStats}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          Reset Stats
        </button>
      </div>

      {/* Today's Stats Grid */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Today's Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            icon={Target}
            label="Sessions Completed"
            value={todaySessions}
            color="bg-blue-500"
          />
          <StatCard
            icon={Clock}
            label="Focus Time"
            value={`${todayHours}h ${todayRemainingMinutes}m`}
            color="bg-green-500"
          />
        </div>
      </div>

      {/* All-Time Stats Grid */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">All-Time Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            icon={Target}
            label="Total Sessions"
            value={stats.totalSessions}
            color="bg-purple-500"
          />
          <StatCard
            icon={Clock}
            label="Total Focus Time"
            value={formatTime(stats.workMinutes)}
            color="bg-indigo-500"
          />
          <StatCard
            icon={Flame}
            label="Current Streak"
            value={`${stats.currentStreak} days`}
            color="bg-orange-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Best Streak"
            value={`${stats.bestStreak} days`}
            color="bg-pink-500"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyChart />
        <WorkBreakPieChart />
      </div>

      {/* Session History */}
      <SessionHistory />
    </div>
  );
}

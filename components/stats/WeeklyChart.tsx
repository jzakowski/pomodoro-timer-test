'use client';

import React from 'react';
import { useStats } from '@/contexts/StatsContext';

export default function WeeklyChart() {
  const { getLast7DaysSessions } = useStats();
  const sessions = getLast7DaysSessions();

  // Generate last 7 days labels
  const getDayLabels = (): string[] => {
    const labels: string[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(days[date.getDay()]);
    }
    return labels;
  };

  const dayLabels = getDayLabels();
  const maxSessions = Math.max(...sessions, 1); // Avoid division by zero

  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Last 7 Days
      </h3>

      <div className="flex items-end justify-between gap-2 h-48">
        {sessions.map((count, index) => {
          const heightPercentage = (count / maxSessions) * 100;
          const isToday = index === sessions.length - 1;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative w-full flex flex-col justify-end h-40">
                {/* Bar */}
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    isToday
                      ? 'bg-gradient-to-t from-blue-600 to-blue-400'
                      : 'bg-gradient-to-t from-gray-400 to-gray-300 dark:from-gray-500 dark:to-gray-400'
                  }`}
                  style={{ height: `${heightPercentage}%` }}
                >
                  {/* Count label on top of bar */}
                  {count > 0 && (
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {count}
                    </span>
                  )}
                </div>
              </div>
              {/* Day label */}
              <span
                className={`mt-2 text-xs font-medium ${
                  isToday
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {dayLabels[index]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {sessions.every((count) => count === 0) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No sessions yet</p>
        </div>
      )}
    </div>
  );
}

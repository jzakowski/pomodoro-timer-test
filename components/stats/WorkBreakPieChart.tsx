'use client';

import React from 'react';
import { useStats } from '@/contexts/StatsContext';
import { Clock } from 'lucide-react';

export default function WorkBreakPieChart() {
  const { stats } = useStats();
  const { workMinutes, breakMinutes } = stats;
  const totalMinutes = workMinutes + breakMinutes;

  const workPercentage = totalMinutes > 0 ? (workMinutes / totalMinutes) * 100 : 0;
  const breakPercentage = totalMinutes > 0 ? (breakMinutes / totalMinutes) * 100 : 0;

  // SVG pie chart calculations
  const radius = 80;
  const centerX = 100;
  const centerY = 100;
  const circumference = 2 * Math.PI * radius;

  const workOffset = circumference - (workPercentage / 100) * circumference;

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Work vs Break
      </h3>

      {totalMinutes === 0 ? (
        <div className="flex flex-col items-center justify-center h-48">
          <Clock className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">No data yet</p>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="200" height="200" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                stroke="#E5E7EB"
                strokeWidth="20"
                fill="none"
                className="dark:stroke-gray-600"
              />

              {/* Work segment */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                stroke="#3B82F6"
                strokeWidth="20"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={workOffset}
                className="transition-all duration-500"
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {Math.round(workPercentage)}%
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Work</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      {totalMinutes > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Work</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatTime(workMinutes)} ({Math.round(workPercentage)}%)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-500"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Break</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatTime(breakMinutes)} ({Math.round(breakPercentage)}%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

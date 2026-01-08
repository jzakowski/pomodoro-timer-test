'use client';

import React from 'react';
import { useTimer } from '@/contexts/TimerContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function TimerDisplay() {
  const { mode, timeRemaining, isRunning } = useTimer();

  // Calculate progress percentage
  const getDurationForMode = () => {
    switch (mode) {
      case 'work':
        return 25 * 60;
      case 'shortBreak':
        return 5 * 60;
      case 'longBreak':
        return 15 * 60;
    }
  };

  const totalTime = getDurationForMode();
  const progress = (totalTime - timeRemaining) / totalTime;
  const circumference = 2 * Math.PI * 120; // radius = 120
  const strokeDashoffset = circumference * (1 - progress);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get color based on mode
  const getModeColor = () => {
    switch (mode) {
      case 'work':
        return '#EF4444';
      case 'shortBreak':
        return '#10B981';
      case 'longBreak':
        return '#8B5CF6';
    }
  };

  // Get mode label
  const getModeLabel = () => {
    switch (mode) {
      case 'work':
        return 'Work';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="region"
      aria-label="Timer display"
    >
      {/* Session Type Label */}
      <motion.div
        className="mb-4"
        key={mode}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          className="text-lg font-semibold px-4 py-2 rounded-full inline-block"
          style={{
            backgroundColor: `${getModeColor()}20`,
            color: getModeColor(),
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.15 }}
          role="status"
          aria-live="polite"
        >
          {getModeLabel()}
        </motion.span>
      </motion.div>

      {/* Circular Timer */}
      <div className="relative" role="timer" aria-label={`Pomodoro timer: ${formatTime(timeRemaining)} remaining`}>
        <motion.svg
          width="300"
          height="300"
          className="transform -rotate-90"
          initial={{ rotate: -90 }}
          animate={{ rotate: -90 }}
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle
            cx="150"
            cy="150"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <motion.circle
            cx="150"
            cy="150"
            r="120"
            stroke={getModeColor()}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.3, ease: "linear" }}
          />
        </motion.svg>

        {/* Time Display in Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className="text-8xl font-mono font-bold text-gray-800 dark:text-white tabular-nums"
              key={timeRemaining}
              initial={{ scale: 1.05, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.1 }}
              aria-live="off"
              aria-atomic="true"
            >
              {formatTime(timeRemaining)}
            </motion.div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              <AnimatePresence mode="wait">
                {isRunning ? (
                  <motion.span
                    key="running"
                    className="flex items-center justify-center gap-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    role="status"
                    aria-live="polite"
                  >
                    <motion.div
                      className="w-2 h-2 bg-green-500 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      aria-hidden="true"
                    />
                    Running
                  </motion.span>
                ) : (
                  <motion.span
                    key="paused"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    role="status"
                    aria-live="polite"
                  >
                    Paused
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import React from 'react';
import { useTimer } from '@/contexts/TimerContext';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TimerControls() {
  const { isRunning, startTimer, pauseTimer, resetTimer, skipToNextSession, mode } = useTimer();

  const getModeColor = () => {
    switch (mode) {
      case 'work':
        return 'bg-red-500 hover:bg-red-600';
      case 'shortBreak':
        return 'bg-green-500 hover:bg-green-600';
      case 'longBreak':
        return 'bg-purple-500 hover:bg-purple-600';
    }
  };

  const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.05 }
  };

  return (
    <motion.div
      className="flex items-center justify-center gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Skip Button */}
      <motion.button
        onClick={skipToNextSession}
        className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center group"
        aria-label="Skip to next session"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        transition={{ duration: 0.15 }}
      >
        <motion.div
          animate={{ rotate: 0 }}
          whileHover={{ rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SkipForward className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </motion.div>
      </motion.button>

      {/* Start/Pause Button (Larger, Prominent) */}
      <motion.button
        onClick={isRunning ? pauseTimer : startTimer}
        className={`w-24 h-24 rounded-full ${getModeColor()} transition-colors duration-200 flex items-center justify-center shadow-lg`}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        transition={{ duration: 0.15 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isRunning ? 'pause' : 'play'}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {isRunning ? (
              <Pause className="w-12 h-12 text-white" />
            ) : (
              <Play className="w-12 h-12 text-white ml-1" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Reset Button */}
      <motion.button
        onClick={resetTimer}
        className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center group"
        aria-label="Reset timer"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        transition={{ duration: 0.15 }}
      >
        <motion.div
          whileHover={{ rotate: -180 }}
          transition={{ duration: 0.3 }}
        >
          <RotateCcw className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </motion.div>
      </motion.button>
    </motion.div>
  );
}

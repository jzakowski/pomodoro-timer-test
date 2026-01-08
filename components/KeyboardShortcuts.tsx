'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Shortcut {
  key: string;
  description: string;
}

const shortcuts: Shortcut[] = [
  { key: 'Space', description: 'Start/Pause timer' },
  { key: 'R', description: 'Reset timer' },
  { key: 'S', description: 'Skip to next session' },
  { key: '1-4', description: 'Switch tabs (Timer, Tasks, Stats, Settings)' },
];

export default function KeyboardShortcuts() {
  return (
    <motion.div
      className="mt-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <details className="inline-block">
        <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          ⌨️ Keyboard Shortcuts
        </summary>
        <motion.div
          className="mt-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-left"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-2 gap-3 text-sm">
            {shortcuts.map((shortcut, index) => (
              <motion.div
                key={shortcut.key}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                  {shortcut.key}
                </kbd>
                <span className="text-gray-600 dark:text-gray-400">
                  {shortcut.description}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </details>
    </motion.div>
  );
}

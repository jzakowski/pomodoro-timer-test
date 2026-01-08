'use client';

import React from 'react';
import { Clock, CheckSquare, BarChart3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface TabNavigationProps {
  activeTab: 'timer' | 'tasks' | 'stats' | 'settings';
  onTabChange: (tab: 'timer' | 'tasks' | 'stats' | 'settings') => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'timer' as const, label: 'Timer', icon: Clock },
    { id: 'tasks' as const, label: 'Tasks', icon: CheckSquare },
    { id: 'stats' as const, label: 'Stats', icon: BarChart3 },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 md:relative md:bg-transparent md:border-0 md:py-0">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-around md:justify-center md:gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex flex-col md:flex-row items-center md:gap-2 px-4 py-2 rounded-lg relative
                  ${isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }
                `}
                aria-label={`Switch to ${tab.label} tab`}
                aria-current={isActive ? 'page' : undefined}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex flex-col md:flex-row items-center md:gap-2">
                  <motion.div
                    animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <span className="text-xs md:text-sm font-medium mt-1 md:mt-0">
                    {tab.label}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

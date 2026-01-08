'use client';

import React, { useState } from 'react';
import { useTimer } from '@/contexts/TimerContext';
import {
  Clock,
  Volume2,
  Palette,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Bell,
  BellOff,
} from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

function SettingsSection({
  title,
  icon: Icon,
  children,
  defaultExpanded = true,
}: SettingsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit?: string;
  description?: string;
}

function Slider({ label, value, onChange, min, max, unit = '', description }: SliderProps) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{description}</p>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400"
        aria-label={`${label}: ${value}${unit}`}
      />
    </div>
  );
}

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  icon?: React.ElementType;
}

function Toggle({ label, checked, onChange, description, icon: Icon }: ToggleProps) {
  return (
    <div className="flex items-center justify-between mb-4 last:mb-0">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        </div>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const { settings, updateSettings } = useTimer();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExportData = () => {
    const data = {
      settings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pomodoro-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.settings) {
            updateSettings(data.settings);
            alert('Settings imported successfully!');
          }
        } catch (error) {
          alert('Failed to import settings. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset all settings to default values?')) {
      updateSettings({
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsUntilLongBreak: 4,
        autoStart: false,
        soundEnabled: true,
        notificationsEnabled: false,
        volume: 80,
        soundType: 'chime',
        theme: 'system',
        accentColor: '#3B82F6',
      });
    }
  };

  const accentColors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Green', value: '#10B981' },
    { name: 'Orange', value: '#F59E0B' },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <SettingsSection title="Timer Durations" icon={Clock} defaultExpanded={true}>
        <Slider
          label="Work Duration"
          value={settings.workDuration}
          onChange={(value) => updateSettings({ workDuration: value })}
          min={1}
          max={60}
          unit=" min"
          description="Duration of work sessions"
        />
        <Slider
          label="Short Break"
          value={settings.shortBreakDuration}
          onChange={(value) => updateSettings({ shortBreakDuration: value })}
          min={1}
          max={15}
          unit=" min"
          description="Duration of short breaks between work sessions"
        />
        <Slider
          label="Long Break"
          value={settings.longBreakDuration}
          onChange={(value) => updateSettings({ longBreakDuration: value })}
          min={5}
          max={30}
          unit=" min"
          description="Duration of long breaks after completing work sessions"
        />
        <Slider
          label="Sessions until Long Break"
          value={settings.sessionsUntilLongBreak}
          onChange={(value) => updateSettings({ sessionsUntilLongBreak: value })}
          min={1}
          max={10}
          unit=""
          description="Number of work sessions before a long break"
        />
      </SettingsSection>

      <SettingsSection title="Auto-start" icon={Clock} defaultExpanded={true}>
        <Toggle
          label="Auto-start next session"
          checked={settings.autoStart}
          onChange={(checked) => updateSettings({ autoStart: checked })}
          description="Automatically start the next session phase without manual intervention"
        />
      </SettingsSection>

      <SettingsSection title="Notifications & Sound" icon={Volume2} defaultExpanded={true}>
        <Toggle
          label="Sound Notifications"
          checked={settings.soundEnabled}
          onChange={(checked) => updateSettings({ soundEnabled: checked })}
          description="Play sound when timer completes"
          icon={Bell}
        />
        <Toggle
          label="Browser Notifications"
          checked={settings.notificationsEnabled}
          onChange={(checked) => {
            updateSettings({ notificationsEnabled: checked });
            if (checked && 'Notification' in window && Notification.permission === 'default') {
              Notification.requestPermission();
            }
          }}
          description="Show browser notification when timer completes"
          icon={BellOff}
        />
        <Slider
          label="Volume"
          value={settings.volume}
          onChange={(value) => updateSettings({ volume: value })}
          min={0}
          max={100}
          unit="%"
          description="Notification sound volume"
        />
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Notification Sound
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['chime', 'bell', 'gong'] as const).map((sound) => (
              <button
                key={sound}
                onClick={() => updateSettings({ soundType: sound })}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  settings.soundType === sound
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {sound.charAt(0).toUpperCase() + sound.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Appearance" icon={Palette} defaultExpanded={true}>
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'dark', 'system'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => updateSettings({ theme })}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  settings.theme === theme
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            Accent Color
          </label>
          <div className="flex gap-3">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => updateSettings({ accentColor: color.value })}
                className={`relative w-12 h-12 rounded-full transition-all duration-200 ${
                  settings.accentColor === color.value
                    ? 'ring-4 ring-offset-2 ring-blue-500 scale-110 shadow-lg'
                    : 'ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-600 hover:scale-105'
                }`}
                style={{ backgroundColor: color.value }}
                aria-label={`${color.name} accent color`}
              >
                {settings.accentColor === color.value && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-lg">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Data Management" icon={Download} defaultExpanded={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Data
          </button>
          <label className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors cursor-pointer">
            <Upload className="w-5 h-5" />
            Import Data
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={handleResetToDefaults}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset Defaults
          </button>
          <button
            onClick={handleClearAllData}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Clear All Data
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}

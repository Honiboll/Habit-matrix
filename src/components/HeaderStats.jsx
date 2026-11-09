import React from 'react';
import { Calendar, Trash2, CheckSquare, Sun, Moon, Globe, ArrowUpCircle } from 'lucide-react';
import { APP_VERSION } from '../constants/initialHabits';

export default function HeaderStats({
  habits,
  currentDay,
  daysInMonth,
  monthTitle,
  fullDateString,
  calendarMode,
  theme,
  hasUpdate,
  onToggleTheme,
  onToggleCalendar,
  onOpenUpdates,
  onClearAll,
  onUncheckAll
}) {
  const totalHabits = habits.length;

  let totalCompletedSoFar = 0;
  habits.forEach((h) => {
    const completedDays = Array.isArray(h.activeDays) ? h.activeDays : [];
    totalCompletedSoFar += completedDays.filter((d) => d <= currentDay).length;
  });

  const possibleSoFar = totalHabits * currentDay;
  const overallPct = possibleSoFar > 0 ? Math.round((totalCompletedSoFar / possibleSoFar) * 100) : 0;
  const avgDaily = currentDay > 0 ? (totalCompletedSoFar / currentDay).toFixed(1) : "0.0";

  // Circle progress calculation (r = 28 => circumference = 2 * π * 28 ≈ 175.9)
  const circumference = 175.9;
  const strokeDashoffset = circumference - (overallPct / 100) * circumference;

  const isLight = theme === 'light';
  const isJalali = calendarMode === 'jalali';

  return (
    <div
      className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-6 border-b transition-colors gap-4"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Title & Live System Date */}
      <div>
        <div className="flex items-center gap-3">
          <h1
            className="text-3xl font-semibold tracking-tight transition-colors"
            style={{ color: 'var(--text-main)' }}
          >
            {monthTitle}
          </h1>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-md border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              color: 'var(--accent)'
            }}
          >
            {isJalali ? 'Solar Hijri (شمسی)' : 'Gregorian (میلادی)'}
          </span>
        </div>
        <p
          className="text-xs mt-1.5 flex items-center flex-wrap gap-2 transition-colors font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          <span className="flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
            <Calendar className="w-3.5 h-3.5" />
            <span>{fullDateString}</span>
          </span>
          <span>•</span>
          <span>Day {currentDay} of {daysInMonth}</span>
        </p>
      </div>

      {/* Stats Row */}
      <div className="flex items-center flex-wrap gap-5 sm:gap-8">
        {/* Active Habits */}
        <div className="flex flex-col">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Active habits
          </span>
          <span
            className="text-2xl font-semibold transition-colors"
            style={{ color: 'var(--text-main)' }}
          >
            {totalHabits}
          </span>
        </div>

        {/* Avg Daily Done */}
        <div className="flex flex-col">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Avg. daily done
          </span>
          <span
            className="text-2xl font-semibold transition-colors"
            style={{ color: 'var(--text-main)' }}
          >
            {avgDaily}
          </span>
        </div>

        {/* Ring Chart */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90 transform" viewBox="0 0 72 72">
              <circle
                className="fill-none"
                cx="36"
                cy="36"
                r="28"
                stroke="var(--border)"
                strokeWidth="6"
              />
              <circle
                className="fill-none transition-[stroke-dashoffset] duration-500 ease-out"
                cx="36"
                cy="36"
                r="28"
                stroke="var(--accent)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={isNaN(strokeDashoffset) ? circumference : strokeDashoffset}
              />
            </svg>
          </div>

          <div className="flex flex-col">
            <span
              className="text-2xl font-semibold transition-colors"
              style={{ color: 'var(--text-main)' }}
            >
              {overallPct}%
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Monthly goal
            </span>
          </div>
        </div>

        {/* Action Controls: Updates, Calendar, Theme, Reset */}
        <div className="flex items-center gap-2">
          {/* Check for Updates Button */}
          <button
            onClick={onOpenUpdates}
            title={`Check for Updates (Current: v${APP_VERSION})`}
            className="relative px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer flex items-center gap-1.5 hover:opacity-85"
            style={{
              backgroundColor: hasUpdate ? 'rgba(245, 208, 135, 0.15)' : 'var(--bg-card)',
              borderColor: hasUpdate ? 'var(--accent)' : 'var(--border)',
              color: hasUpdate ? 'var(--accent)' : 'var(--text-main)'
            }}
          >
            <ArrowUpCircle className={`w-3.5 h-3.5 ${hasUpdate ? 'animate-bounce' : ''}`} />
            <span>{hasUpdate ? 'Update Available' : `v${APP_VERSION}`}</span>
            {hasUpdate && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-1 -right-1" />
            )}
          </button>

          {/* Calendar Mode Toggle */}
          <button
            onClick={onToggleCalendar}
            title={isJalali ? "Switch to Gregorian Calendar (میلادی)" : "تغییر به تقویم شمسی (Solar Hijri)"}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer flex items-center gap-1.5 hover:opacity-85"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              color: 'var(--text-main)'
            }}
          >
            <Globe className="w-3.5 h-3.5 text-[#f5d087]" />
            <span>{isJalali ? 'شمسی' : 'میلادی'}</span>
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={onToggleTheme}
            title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            className="p-2 rounded-lg transition-colors border cursor-pointer flex items-center justify-center hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              color: 'var(--text-main)'
            }}
          >
            {isLight ? (
              <Moon className="w-4 h-4 text-amber-600" />
            ) : (
              <Sun className="w-4 h-4 text-[#f5d087]" />
            )}
          </button>

          {/* Reset All Checkmarks */}
          {totalHabits > 0 && onUncheckAll && (
            <button
              onClick={onUncheckAll}
              title="Uncheck all completed days for this month"
              className="px-2.5 py-1.5 text-xs rounded-lg transition-colors border flex items-center gap-1.5 cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
                color: 'var(--text-muted)'
              }}
            >
              <CheckSquare className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              <span>Reset Checks</span>
            </button>
          )}

          {/* Clear All Habits */}
          {totalHabits > 0 && onClearAll && (
            <button
              onClick={onClearAll}
              title="Delete all habits and start fresh"
              className="px-2.5 py-1.5 text-xs rounded-lg transition-colors border flex items-center gap-1.5 cursor-pointer hover:text-red-400"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
                color: 'var(--text-muted)'
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

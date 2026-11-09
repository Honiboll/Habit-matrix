import React, { useState, useEffect, useMemo } from 'react';
import HeaderStats from './components/HeaderStats';
import HabitMatrix from './components/HabitMatrix';
import ConsistencyTrend from './components/ConsistencyTrend';
import HabitAnalysis from './components/HabitAnalysis';
import TopHabits from './components/TopHabits';
import UpdateModal from './components/UpdateModal';
import {
  DEFAULT_HABITS,
  STORAGE_KEY,
  THEME_KEY,
  CALENDAR_KEY,
  APP_VERSION
} from './constants/initialHabits';
import { getCalendarDetails } from './utils/calendar';

export default function App() {
  // Theme state: dark / light
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Calendar Mode: 'gregorian' | 'jalali'
  const [calendarMode, setCalendarMode] = useState(() => {
    try {
      return localStorage.getItem(CALENDAR_KEY) || 'jalali';
    } catch {
      return 'jalali';
    }
  });

  // Update modal state & update badge
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [hasUpdateBadge, setHasUpdateBadge] = useState(false);

  // Background check for updates on startup
  useEffect(() => {
    const silentCheckUpdates = async () => {
      try {
        const res = await fetch(
          'https://api.github.com/repos/Honiboll/Habit-matrix/releases/latest',
          { headers: { Accept: 'application/vnd.github.v3+json' } }
        );
        if (res.ok) {
          const data = await res.json();
          const latestTag = (data.tag_name || data.name || '').replace(/^v/, '');
          const current = APP_VERSION.replace(/^v/, '');
          
          const lParts = latestTag.split('.').map(Number);
          const cParts = current.split('.').map(Number);
          for (let i = 0; i < Math.max(lParts.length, cParts.length); i++) {
            const l = lParts[i] || 0;
            const c = cParts[i] || 0;
            if (l > c) {
              setHasUpdateBadge(true);
              break;
            }
            if (l < c) break;
          }
        }
      } catch {
        // Silently ignore if offline
      }
    };

    silentCheckUpdates();
  }, []);

  // Live system date ticker (updates every 30 seconds)
  const [systemDate, setSystemDate] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemDate(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Compute active calendar details synchronized with systemDate
  const calendarData = useMemo(() => {
    return getCalendarDetails(calendarMode, systemDate);
  }, [calendarMode, systemDate]);

  // Habit list state
  const [habits, setHabits] = useState(() => {
    try {
      localStorage.removeItem("mac_habit_matrix_v1");
      localStorage.removeItem("mac_habit_matrix_v2");

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.error("Error reading habits from localStorage:", err);
    }
    return DEFAULT_HABITS;
  });

  // Sync theme attribute to <html> tag and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (err) {
      console.error("Error saving theme to localStorage:", err);
    }
  }, [theme]);

  // Persist calendarMode
  useEffect(() => {
    try {
      localStorage.setItem(CALENDAR_KEY, calendarMode);
    } catch (err) {
      console.error("Error saving calendarMode to localStorage:", err);
    }
  }, [calendarMode]);

  // Save habits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (err) {
      console.error("Error saving habits to localStorage:", err);
    }
  }, [habits]);

  // Toggle Dark/Light Theme
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toggle Calendar Mode (Gregorian <-> Jalali)
  const handleToggleCalendar = () => {
    setCalendarMode((prev) => (prev === 'gregorian' ? 'jalali' : 'gregorian'));
  };

  // Toggle Day completed for the active calendar
  const handleToggleDay = (habitId, day) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;

        const isJalali = calendarMode === 'jalali';
        const currentDaysList = isJalali ? (h.daysJalali || []) : (h.days || []);
        const exists = currentDaysList.includes(day);
        const updatedDays = exists
          ? currentDaysList.filter((d) => d !== day)
          : [...currentDaysList, day].sort((a, b) => a - b);

        return isJalali
          ? { ...h, daysJalali: updatedDays }
          : { ...h, days: updatedDays };
      })
    );
  };

  // Delete habit
  const handleDeleteHabit = (habitId) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  // Add new habit
  const handleAddHabit = ({ icon, name }) => {
    const newHabit = {
      id: Date.now(),
      icon,
      name,
      days: [],
      daysJalali: []
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  // Uncheck all days for active calendar
  const handleUncheckAll = () => {
    const confirmMsg =
      calendarMode === 'jalali'
        ? "آیا مایلید تمام تیک‌های روزهای تقویم شمسی پاک شوند؟"
        : "Are you sure you want to uncheck all days for the Gregorian calendar?";

    if (window.confirm(confirmMsg)) {
      setHabits((prev) =>
        prev.map((h) =>
          calendarMode === 'jalali'
            ? { ...h, daysJalali: [] }
            : { ...h, days: [] }
        )
      );
    }
  };

  // Clear all habits
  const handleClearAll = () => {
    const confirmMsg =
      calendarMode === 'jalali'
        ? "آیا از حذف تمام عادت‌ها مطمئن هستید؟"
        : "Are you sure you want to delete all habits and start fresh?";

    if (window.confirm(confirmMsg)) {
      setHabits([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error("Error clearing storage:", err);
      }
    }
  };

  // Prepare habits with activeDays based on current calendar mode
  const habitsForRender = useMemo(() => {
    return habits.map((h) => ({
      ...h,
      activeDays: calendarMode === 'jalali' ? (h.daysJalali || []) : (h.days || [])
    }));
  }, [habits, calendarMode]);

  return (
    <div
      data-theme={theme}
      className="min-h-screen transition-colors duration-200 px-5 sm:px-8 lg:px-9 py-7 selection:bg-[#f5d087]/20 selection:text-[#f5d087]"
      style={{
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-main)'
      }}
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Header Stats & Action Controls */}
        <HeaderStats
          habits={habitsForRender}
          currentDay={calendarData.currentDay}
          daysInMonth={calendarData.daysInMonth}
          monthTitle={calendarData.monthTitle}
          fullDateString={calendarData.fullDateString}
          calendarMode={calendarMode}
          theme={theme}
          hasUpdate={hasUpdateBadge}
          onToggleTheme={handleToggleTheme}
          onToggleCalendar={handleToggleCalendar}
          onOpenUpdates={() => setIsUpdateModalOpen(true)}
          onClearAll={handleClearAll}
          onUncheckAll={handleUncheckAll}
        />

        {/* Habit Matrix */}
        <HabitMatrix
          habits={habitsForRender}
          currentDay={calendarData.currentDay}
          daysInMonth={calendarData.daysInMonth}
          getDayLetter={calendarData.getDayLetter}
          calendarMode={calendarMode}
          onToggleDay={handleToggleDay}
          onDeleteHabit={handleDeleteHabit}
          onAddHabit={handleAddHabit}
        />

        {/* Bottom Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-[1.5fr_1.1fr_1fr] gap-5">
          <ConsistencyTrend
            habits={habitsForRender}
            currentDay={calendarData.currentDay}
            daysInMonth={calendarData.daysInMonth}
          />
          <HabitAnalysis
            habits={habitsForRender}
            currentDay={calendarData.currentDay}
          />
          <TopHabits
            habits={habitsForRender}
            currentDay={calendarData.currentDay}
          />
        </div>
      </div>

      {/* In-App Update Modal */}
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        currentVersion={APP_VERSION}
      />
    </div>
  );
}

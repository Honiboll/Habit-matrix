import React, { useState, useEffect } from 'react';
import HeaderStats from './components/HeaderStats';
import HabitMatrix from './components/HabitMatrix';
import ConsistencyTrend from './components/ConsistencyTrend';
import HabitAnalysis from './components/HabitAnalysis';
import TopHabits from './components/TopHabits';
import {
  DEFAULT_HABITS,
  STORAGE_KEY,
  THEME_KEY
} from './constants/initialHabits';

export default function App() {
  // Theme state: dark / light
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Dynamic system dates
  const [currentDay, setCurrentDay] = useState(() => new Date().getDate());
  const [daysInMonth, setDaysInMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  });
  const [monthName, setMonthName] = useState(() =>
    new Date().toLocaleString('en-US', { month: 'long' })
  );
  const [fullDateString, setFullDateString] = useState(() =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  );

  // Periodically synchronize with system clock
  useEffect(() => {
    const syncWithSystemDate = () => {
      const now = new Date();
      setCurrentDay(now.getDate());
      setDaysInMonth(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
      setMonthName(now.toLocaleString('en-US', { month: 'long' }));
      setFullDateString(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      );
    };

    const timer = setInterval(syncWithSystemDate, 30000);
    return () => clearInterval(timer);
  }, []);

  // Habit list state - starting completely clean with no pre-checked items
  const [habits, setHabits] = useState(() => {
    try {
      // Clear legacy storage keys with pre-filled demo data
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

  // Toggle Day completed
  const handleToggleDay = (habitId, day) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.days.includes(day);
        const updatedDays = exists
          ? h.days.filter((d) => d !== day)
          : [...h.days, day].sort((a, b) => a - b);
        return { ...h, days: updatedDays };
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
      days: []
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  // Uncheck all days
  const handleUncheckAll = () => {
    if (window.confirm("Are you sure you want to uncheck all days?")) {
      setHabits((prev) => prev.map((h) => ({ ...h, days: [] })));
    }
  };

  // Clear all habits
  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all habits and start fresh?")) {
      setHabits([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error("Error clearing storage:", err);
      }
    }
  };

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
          habits={habits}
          currentDay={currentDay}
          daysInMonth={daysInMonth}
          monthName={monthName}
          fullDateString={fullDateString}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onClearAll={handleClearAll}
          onUncheckAll={handleUncheckAll}
        />

        {/* Habit Matrix */}
        <HabitMatrix
          habits={habits}
          currentDay={currentDay}
          daysInMonth={daysInMonth}
          onToggleDay={handleToggleDay}
          onDeleteHabit={handleDeleteHabit}
          onAddHabit={handleAddHabit}
        />

        {/* Bottom Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-[1.5fr_1.1fr_1fr] gap-5">
          <ConsistencyTrend
            habits={habits}
            currentDay={currentDay}
            daysInMonth={daysInMonth}
          />
          <HabitAnalysis habits={habits} currentDay={currentDay} />
          <TopHabits habits={habits} currentDay={currentDay} />
        </div>
      </div>
    </div>
  );
}

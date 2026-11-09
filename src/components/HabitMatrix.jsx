import React, { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

export default function HabitMatrix({
  habits,
  currentDay,
  daysInMonth,
  getDayLetter,
  calendarMode,
  onToggleDay,
  onDeleteHabit,
  onAddHabit
}) {
  const [icon, setIcon] = useState('✨');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddHabit({
      icon: icon || '✨',
      name: name.trim()
    });
    setName('');
  };

  return (
    <div
      className="border rounded-2xl p-5 sm:p-6 mb-6 transition-colors"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-base font-semibold transition-colors"
          style={{ color: 'var(--text-main)' }}
        >
          Habit matrix
        </h2>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-colors flex items-center gap-1.5"
            style={{
              backgroundColor: 'var(--today-badge-bg)',
              color: 'var(--today-badge-text)',
              borderColor: 'var(--border)'
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Day {currentDay} of {daysInMonth} (Today)
          </span>
        </div>
      </div>

      {/* Table Container with horizontal scroll */}
      <div className="overflow-x-auto pb-2">
        <table className="w-full border-separate border-spacing-y-2 min-w-[980px]">
          <thead>
            <tr>
              <th
                className="text-left text-[11px] font-medium tracking-wider w-[210px] pb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                MY HABITS
              </th>
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const letter = getDayLetter ? getDayLetter(day) : '';
                const isToday = day === currentDay;

                return (
                  <th key={day} className="text-center pb-2">
                    <span
                      className="block text-[10px] mb-1 font-medium transition-colors"
                      style={{
                        color: isToday ? 'var(--accent)' : 'var(--text-muted)'
                      }}
                    >
                      {letter}
                    </span>
                    <span
                      className="inline-block w-[22px] h-[22px] leading-[22px] rounded-md text-xs transition-all"
                      style={
                        isToday
                          ? {
                              backgroundColor: 'var(--today-badge-bg)',
                              color: 'var(--today-badge-text)',
                              fontWeight: 700,
                              boxShadow: '0 0 8px rgba(245, 208, 135, 0.45)',
                              border: '1.5px solid var(--accent)'
                            }
                          : {
                              color: 'var(--text-main)'
                            }
                      }
                      title={isToday ? `Today is Day ${day}` : `Day ${day}`}
                    >
                      {day}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {habits.length === 0 ? (
              <tr>
                <td
                  colSpan={daysInMonth + 1}
                  className="text-center py-12 text-xs font-normal"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">🌱</span>
                    <p
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-main)' }}
                    >
                      No habits added yet
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Pick an icon, enter a habit name below and click "Add Habit" to start tracking.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              habits.map((habit) => {
                const completedDays = Array.isArray(habit.activeDays) ? habit.activeDays : [];

                return (
                  <tr
                    key={habit.id}
                    className="group transition-colors rounded-lg hover:opacity-95"
                  >
                    {/* Habit Name Cell */}
                    <td className="pr-3.5 h-[32px] align-middle">
                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center gap-2.5 text-sm font-medium truncate max-w-[170px]"
                          style={{ color: 'var(--text-main)' }}
                        >
                          <span className="text-base select-none shrink-0">{habit.icon}</span>
                          <span className="truncate" title={habit.name}>{habit.name}</span>
                        </div>

                        <button
                          onClick={() => onDeleteHabit(habit.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded cursor-pointer hover:text-red-400"
                          style={{ color: 'var(--text-muted)' }}
                          title="Delete habit"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Day Checkboxes */}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1;
                      const isCompleted = completedDays.includes(day);
                      const isToday = day === currentDay;
                      const isUpcoming = day > currentDay;

                      let customStyle = {};
                      let cellClasses =
                        'w-[22px] h-[22px] rounded-md flex items-center justify-center cursor-pointer transition-all duration-150 border text-xs mx-auto ';

                      if (isCompleted) {
                        customStyle = {
                          backgroundColor: 'var(--cell-done)',
                          color: 'var(--cell-done-text)',
                          borderColor: 'var(--cell-done-border)'
                        };
                        cellClasses += 'hover:scale-105';
                      } else if (isToday) {
                        customStyle = {
                          backgroundColor: 'var(--cell-empty)',
                          borderColor: 'var(--accent)',
                          borderWidth: '1.5px'
                        };
                        cellClasses += 'hover:scale-105';
                      } else if (isUpcoming) {
                        customStyle = {
                          backgroundColor: 'var(--cell-empty)',
                          borderColor: 'transparent'
                        };
                        cellClasses += 'hover:scale-105';
                      } else {
                        // Missed past day
                        customStyle = {
                          backgroundColor: 'var(--cell-missed)',
                          borderColor: 'transparent'
                        };
                        cellClasses += 'hover:scale-105';
                      }

                      return (
                        <td key={day} className="text-center align-middle p-0">
                          <div
                            onClick={() => onToggleDay(habit.id, day)}
                            style={customStyle}
                            className={cellClasses}
                            title={`Day ${day}${isToday ? ' (Today)' : ''}: ${isCompleted ? 'Completed' : 'Not completed'}`}
                          >
                            {isCompleted ? (
                              <Check className="w-3 h-3 stroke-[3]" />
                            ) : isUpcoming ? (
                              <span
                                className="w-1 h-1 rounded-full"
                                style={{ backgroundColor: 'var(--text-muted)' }}
                              />
                            ) : null}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: Legend & Add Form */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 mt-3 border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Legend */}
        <div
          className="flex flex-wrap items-center gap-4 text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-4 h-4 rounded-md flex items-center justify-center text-[10px] border"
              style={{
                backgroundColor: 'var(--cell-done)',
                borderColor: 'var(--cell-done-border)',
                color: 'var(--cell-done-text)'
              }}
            >
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
            <span>Completed</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className="w-4 h-4 rounded-md inline-block border"
              style={{
                backgroundColor: 'var(--cell-missed)',
                borderColor: 'transparent'
              }}
            />
            <span>Missed</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className="w-4 h-4 rounded-md inline-block border"
              style={{
                backgroundColor: 'var(--cell-empty)',
                borderColor: 'var(--accent)',
                borderWidth: '1.5px'
              }}
            />
            <span>Due today</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className="w-4 h-4 rounded-md flex items-center justify-center border"
              style={{
                backgroundColor: 'var(--cell-empty)',
                borderColor: 'transparent'
              }}
            >
              <span
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: 'var(--text-muted)' }}
              />
            </span>
            <span>Upcoming</span>
          </div>
        </div>

        {/* Add Habit Form with EmojiPicker Popover */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto relative">
          <EmojiPicker
            selectedEmoji={icon}
            onSelectEmoji={(selected) => setIcon(selected)}
          />

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New habit name..."
            required
            className="flex-1 sm:w-52 text-xs px-3 py-1.5 rounded-lg border focus:outline-none transition-colors"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--border)',
              color: 'var(--text-main)'
            }}
          />
          <button
            type="submit"
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 hover:opacity-90"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#09090b'
            }}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Add Habit
          </button>
        </form>
      </div>
    </div>
  );
}

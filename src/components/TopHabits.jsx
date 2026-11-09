import React from 'react';

export default function TopHabits({ habits, currentDay }) {
  const stats = habits.map((h) => {
    const completedDays = Array.isArray(h.activeDays) ? h.activeDays : [];
    const doneCount = completedDays.filter((d) => d <= currentDay).length;
    const pct = currentDay > 0 ? Math.round((doneCount / currentDay) * 100) : 0;
    return { ...h, doneCount, pct };
  });

  const sortedTop = [...stats].sort((a, b) => b.doneCount - a.doneCount).slice(0, 5);

  return (
    <div
      className="border rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-[280px] transition-colors"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-base font-semibold transition-colors"
          style={{ color: 'var(--text-main)' }}
        >
          Top habits
        </h3>
        <span
          className="text-xs uppercase tracking-wider font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          Ranking
        </span>
      </div>

      {/* Top List */}
      <div className="flex-1 flex flex-col justify-center">
        {sortedTop.length === 0 ? (
          <div
            className="text-center text-xs py-6"
            style={{ color: 'var(--text-muted)' }}
          >
            Rankings will appear as you complete habits
          </div>
        ) : (
          <div className="flex flex-col justify-around h-full">
            {sortedTop.map((habit, idx) => (
              <div
                key={habit.id}
                className="flex items-center justify-between text-xs pb-2 border-b last:border-b-0"
                style={{ borderColor: 'var(--border)' }}
              >
                <span
                  className="w-6 font-mono"
                  style={{ color: 'var(--text-muted)' }}
                >
                  0{idx + 1}
                </span>
                <span
                  className="flex-1 font-medium truncate px-2"
                  style={{ color: 'var(--text-main)' }}
                >
                  {habit.name}
                </span>
                <span
                  className="text-[11px] mr-3 font-mono"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {habit.doneCount}/{currentDay}
                </span>
                <span
                  className="font-semibold w-9 text-right font-mono"
                  style={{ color: 'var(--text-main)' }}
                >
                  {habit.pct}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

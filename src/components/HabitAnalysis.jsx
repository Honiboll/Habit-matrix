import React from 'react';

export default function HabitAnalysis({ habits, currentDay }) {
  const stats = habits.map((h) => {
    const doneCount = h.days.filter((d) => d <= currentDay).length;
    const pct = currentDay > 0 ? Math.round((doneCount / currentDay) * 100) : 0;
    return { ...h, doneCount, pct };
  });

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
          Habit analysis
        </h3>
        <span
          className="text-xs uppercase tracking-wider font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          Completion
        </span>
      </div>

      {/* Analysis List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 flex flex-col justify-center">
        {stats.length === 0 ? (
          <div
            className="text-center text-xs py-6"
            style={{ color: 'var(--text-muted)' }}
          >
            No habit data to analyze yet
          </div>
        ) : (
          stats.map((habit) => (
            <div key={habit.id} className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-xs truncate block font-normal"
                    style={{ color: 'var(--text-main)' }}
                  >
                    {habit.name}
                  </span>
                </div>
                <div
                  className="w-full h-[5px] rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--border)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--accent)',
                      width: `${habit.pct}%`
                    }}
                  />
                </div>
              </div>
              <span
                className="text-xs font-semibold w-9 text-right shrink-0"
                style={{ color: 'var(--text-main)' }}
              >
                {habit.pct}%
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

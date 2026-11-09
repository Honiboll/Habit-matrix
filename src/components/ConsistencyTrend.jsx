import React, { useState } from 'react';
import { DAYS_IN_MONTH } from '../constants/initialHabits';

export default function ConsistencyTrend({
  habits,
  currentDay,
  daysInMonth = DAYS_IN_MONTH
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const totalHabits = habits.length;
  const width = 500;
  const height = 135;
  const padLeft = 36;
  const padBottom = 20;
  const chartW = width - padLeft - 10;
  const chartH = height - padBottom - 10;

  // Calculate coordinates for days 1 .. currentDay
  const points = [];
  if (totalHabits > 0) {
    for (let d = 1; d <= currentDay; d++) {
      let count = 0;
      habits.forEach((h) => {
        if (h.days.includes(d)) count++;
      });

      const pct = totalHabits > 0 ? count / totalHabits : 0;
      const x = padLeft + ((d - 1) / (daysInMonth - 1)) * chartW;
      const y = 10 + (1 - pct) * chartH;
      points.push({ day: d, count, pct: Math.round(pct * 100), x, y });
    }
  }

  // Smooth bezier curve path
  let pathD = "";
  let areaD = "";
  points.forEach((pt, i) => {
    if (i === 0) {
      pathD += `M ${pt.x},${pt.y}`;
      areaD += `M ${pt.x},${10 + chartH} L ${pt.x},${pt.y}`;
    } else {
      const prev = points[i - 1];
      const cx = (prev.x + pt.x) / 2;
      pathD += ` C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
      areaD += ` C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
    }
  });

  if (points.length > 0) {
    const last = points[points.length - 1];
    areaD += ` L ${last.x},${10 + chartH} Z`;
  }

  return (
    <div
      className="border rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-[280px] transition-colors"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3
          className="text-base font-semibold transition-colors"
          style={{ color: 'var(--text-main)' }}
        >
          Consistency trend
        </h3>
        <span
          className="text-xs font-medium tracking-wide"
          style={{ color: 'var(--text-muted)' }}
        >
          • Daily completion
        </span>
      </div>

      {/* Chart */}
      <div className="relative w-full h-[190px] flex items-center justify-center">
        {totalHabits === 0 ? (
          <div
            className="text-center text-xs py-8"
            style={{ color: 'var(--text-muted)' }}
          >
            Trend chart will appear once you add habits and mark completed days.
          </div>
        ) : (
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line
              x1={padLeft}
              y1={10}
              x2={width}
              y2={10}
              stroke="var(--chart-grid)"
              strokeWidth="1"
            />
            <line
              x1={padLeft}
              y1={10 + chartH / 2}
              x2={width}
              y2={10 + chartH / 2}
              stroke="var(--chart-grid)"
              strokeWidth="1"
            />
            <line
              x1={padLeft}
              y1={10 + chartH}
              x2={width}
              y2={10 + chartH}
              stroke="var(--chart-grid)"
              strokeWidth="1"
            />

            {/* Y Axis Labels */}
            <text x="0" y="14" fill="var(--text-muted)" fontSize="10" fontWeight="500">
              100%
            </text>
            <text x="6" y={14 + chartH / 2} fill="var(--text-muted)" fontSize="10" fontWeight="500">
              50%
            </text>
            <text x="12" y={14 + chartH} fill="var(--text-muted)" fontSize="10" fontWeight="500">
              0%
            </text>

            {/* X Axis Labels */}
            <text x={padLeft} y={height - 2} fill="var(--text-muted)" fontSize="10">
              01
            </text>
            <text x={padLeft + chartW * (9 / (daysInMonth - 1))} y={height - 2} fill="var(--text-muted)" fontSize="10">
              10
            </text>
            <text x={padLeft + chartW * (19 / (daysInMonth - 1))} y={height - 2} fill="var(--text-muted)" fontSize="10">
              20
            </text>
            <text x={padLeft + chartW - 5} y={height - 2} fill="var(--text-muted)" fontSize="10">
              {daysInMonth}
            </text>

            {/* Area Under Curve */}
            {areaD && <path d={areaD} fill="url(#trendGradient)" />}

            {/* Smooth Trend Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="var(--chart-line)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            )}

            {/* Interactive Dots */}
            {points.map((pt) => (
              <g key={pt.day}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint?.day === pt.day ? 4.5 : 2}
                  className="transition-all duration-150 cursor-pointer"
                  fill="var(--accent)"
                  stroke={hoveredPoint?.day === pt.day ? 'var(--bg-main)' : 'transparent'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            ))}
          </svg>
        )}

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute -top-2 px-2.5 py-1 rounded-md text-[11px] pointer-events-none shadow-lg transform -translate-x-1/2 flex items-center gap-2 border"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              color: 'var(--text-main)'
            }}
          >
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Day {hoveredPoint.day}:
            </span>
            <span>{hoveredPoint.pct}%</span>
            <span style={{ color: 'var(--text-muted)' }}>
              ({hoveredPoint.count}/{totalHabits})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { progressHistory } from "@/data/mockData";

export default function ProgressChart() {
  const maxScore = 100;
  const chartHeight = 200;
  const chartWidth = 600;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const points = progressHistory.map((d, i) => ({
    x: padding.left + (i / (progressHistory.length - 1)) * innerWidth,
    y: padding.top + innerHeight - (d.score / maxScore) * innerHeight,
    ...d,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    padding.top + innerHeight
  } L ${points[0].x} ${padding.top + innerHeight} Z`;

  const gridLines = [0, 25, 50, 75, 100];

  return (
    <div className="card-glow animate-fade-in-up rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Skill Progress</h3>
          <p className="mt-0.5 text-xs text-zinc-500">Overall skill score over time</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-teal-400">
            {progressHistory[progressHistory.length - 1].score}%
          </span>
          <span className="rounded-md bg-emerald-900/30 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
            +{progressHistory[progressHistory.length - 1].score - progressHistory[0].score}%
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full min-w-[400px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((v) => {
            const y = padding.top + innerHeight - (v / maxScore) * innerHeight;
            return (
              <g key={v}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#27272a"
                  strokeDasharray="4 4"
                />
                <text x={padding.left - 8} y={y + 4} textAnchor="end" className="fill-zinc-600 text-[10px]">
                  {v}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="6" fill="#09090b" stroke="#0d9488" strokeWidth="2" />
              <circle cx={p.x} cy={p.y} r="3" fill="#14b8a6" />
              {/* Month label */}
              <text
                x={p.x}
                y={padding.top + innerHeight + 20}
                textAnchor="middle"
                className="fill-zinc-500 text-[11px]"
              >
                {p.month}
              </text>
              {/* Score label */}
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                className="fill-zinc-400 text-[10px] font-medium"
              >
                {p.score}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

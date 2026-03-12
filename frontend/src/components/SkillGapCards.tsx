"use client";

import { skillGaps } from "@/data/mockData";

const priorityConfig = {
  Critical: { color: "text-red-400", bg: "bg-red-900/30", bar: "from-red-500 to-red-400" },
  High: { color: "text-amber-400", bg: "bg-amber-900/30", bar: "from-amber-500 to-amber-400" },
  Medium: { color: "text-teal-400", bg: "bg-teal-900/30", bar: "from-teal-500 to-teal-400" },
  Low: { color: "text-zinc-400", bg: "bg-zinc-700/30", bar: "from-zinc-500 to-zinc-400" },
};

export default function SkillGapCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {skillGaps.map((gap, i) => {
        const config = priorityConfig[gap.priority];
        const gapPercent = Math.round((gap.gap / gap.required) * 100);

        return (
          <div
            key={gap.skill}
            className={`card-glow animate-fade-in-up stagger-${i + 1} rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all`}
          >
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
              <h3 className="text-sm font-semibold text-white">{gap.skill}</h3>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${config.color} ${config.bg}`}>
                {gap.priority}
              </span>
            </div>

            {/* Current vs Required */}
            <div className="mb-3 space-y-2">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-zinc-500">Current</span>
                  <span className="font-medium text-zinc-300">{gap.current}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-zinc-500 transition-all duration-700"
                    style={{ width: `${gap.current}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-zinc-500">Required</span>
                  <span className="font-medium text-zinc-300">{gap.required}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${config.bar} transition-all duration-700`}
                    style={{ width: `${gap.required}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Gap indicator */}
            <div className="flex items-center justify-between rounded-lg bg-zinc-800/60 px-3 py-2">
              <span className="text-xs text-zinc-500">Gap</span>
              <span className={`text-lg font-bold ${config.color}`}>
                {gapPercent}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

export default function ProgressChart({ matchPercentage }: { matchPercentage?: number }) {
  const maxScore = 100;
  const displayScore = matchPercentage ?? 0;

  return (
    <div className="card-glow animate-fade-in-up rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Skill Match</h3>
          <p className="mt-0.5 text-xs text-zinc-500">Current skill match percentage</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-teal-400">{displayScore}%</span>
          <span className="rounded-md bg-indigo-900/30 px-2 py-0.5 text-[11px] font-medium text-indigo-400">Live</span>
        </div>
      </div>

      {/* Simple radial progress indicator when no history data */}
      <div className="flex items-center justify-center py-6">
        <svg viewBox="0 0 120 120" className="h-32 w-32">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#27272a" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#14b8a6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(displayScore / 100) * 326.72} 326.72`}
            transform="rotate(-90 60 60)"
            className="transition-all duration-1000"
          />
          <text x="60" y="65" textAnchor="middle" className="fill-zinc-200 text-sm font-bold">
            {displayScore}%
          </text>
        </svg>
      </div>
    </div>
  );
}

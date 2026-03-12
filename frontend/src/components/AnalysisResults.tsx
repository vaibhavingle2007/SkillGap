"use client";

export interface AnalysisResponse {
  matched_skills: string[];
  missing_skills: string[];
  skill_gap_score: number;
  target_role?: string;
}

function GapScoreGauge({ score }: { score: number }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return { from: "#10b981", to: "#34d399", label: "Excellent", ring: "ring-emerald-500/20" };
    if (s >= 60) return { from: "#0d9488", to: "#14b8a6", label: "Good", ring: "ring-teal-500/20" };
    if (s >= 40) return { from: "#f59e0b", to: "#fbbf24", label: "Needs Work", ring: "ring-amber-500/20" };
    return { from: "#ef4444", to: "#f87171", label: "Critical", ring: "ring-red-500/20" };
  };

  const color = getColor(score);
  const gradientId = "gapGaugeGrad";

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-36 w-36">
        <svg className="circular-progress h-full w-full" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#27272a" strokeWidth="7" />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color.from} />
              <stop offset="100%" stopColor={color.to} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{score}%</span>
          <span className="text-[10px] font-medium text-zinc-500">Gap Score</span>
        </div>
      </div>
      <span className={`mt-2 rounded-full px-3 py-1 text-xs font-semibold ring-2 ${color.ring}`}
        style={{ color: color.from }}
      >
        {color.label}
      </span>
    </div>
  );
}

export default function AnalysisResults({ data }: { data: AnalysisResponse }) {
  const totalSkills = data.matched_skills.length + data.missing_skills.length;
  const matchPercent = totalSkills > 0 ? Math.round((data.matched_skills.length / totalSkills) * 100) : 0;

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/15">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Analysis Results</h2>
          <p className="text-xs text-zinc-500">
            {data.target_role ? `Target: ${data.target_role}` : "Based on your submitted skills"}
          </p>
        </div>
      </div>

      {/* Score + Stats Row */}
      <div className="grid gap-5 sm:grid-cols-[auto_1fr]">
        <div className="card-glow flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <GapScoreGauge score={data.skill_gap_score} />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Matched",
              value: data.matched_skills.length,
              total: totalSkills,
              icon: "✅",
              color: "text-emerald-400",
              bg: "bg-emerald-900/20",
            },
            {
              label: "Missing",
              value: data.missing_skills.length,
              total: totalSkills,
              icon: "⚠️",
              color: "text-amber-400",
              bg: "bg-amber-900/20",
            },
            {
              label: "Match Rate",
              value: `${matchPercent}%`,
              total: null,
              icon: "📊",
              color: "text-teal-400",
              bg: "bg-teal-900/20",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card-glow flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
            >
              <span className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-lg ${stat.bg}`}>
                {stat.icon}
              </span>
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-xs text-zinc-500">
                {stat.label}
                {stat.total !== null && ` / ${stat.total}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Matched Skills */}
      {data.matched_skills.length > 0 && (
        <section className="animate-fade-in-up stagger-1">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px]">✓</span>
            Matched Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.matched_skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-600/10 px-3 py-1.5 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-600/15"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Missing Skills Cards */}
      {data.missing_skills.length > 0 && (
        <section className="animate-fade-in-up stagger-2">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[10px]">!</span>
            Missing Skills — You Need to Learn
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.missing_skills.map((skill, i) => {
              const priorityIndex = i;
              const priority =
                priorityIndex < 2 ? "Critical" : priorityIndex < 4 ? "High" : "Medium";
              const priorityConfig = {
                Critical: { color: "text-red-400", bg: "bg-red-900/25", border: "border-red-500/20", icon: "🔴" },
                High: { color: "text-amber-400", bg: "bg-amber-900/25", border: "border-amber-500/20", icon: "🟡" },
                Medium: { color: "text-teal-400", bg: "bg-teal-900/25", border: "border-teal-500/20", icon: "🟢" },
              };
              const pc = priorityConfig[priority];

              return (
                <div
                  key={skill}
                  className={`card-glow group rounded-xl border ${pc.border} bg-zinc-900/60 p-4 transition-all`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${pc.bg} text-sm`}>
                        {pc.icon}
                      </span>
                      <h4 className="text-sm font-semibold text-white">{skill}</h4>
                    </div>
                    <span className={`rounded-md ${pc.bg} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${pc.color}`}>
                      {priority}
                    </span>
                  </div>

                  <p className="mb-3 text-xs leading-relaxed text-zinc-500">
                    This skill is required for your target role but was not found in your profile.
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-700"
                        style={{ width: "0%" }}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-zinc-500">0%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Action CTA */}
      <div className="animate-fade-in-up stagger-3 flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-white">Ready to bridge the gap?</p>
          <p className="text-xs text-zinc-500">View your personalized learning roadmap to start closing skill gaps.</p>
        </div>
        <a
          href="/roadmap"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/20 transition-all hover:shadow-lg hover:brightness-110"
        >
          View Roadmap
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </div>
  );
}

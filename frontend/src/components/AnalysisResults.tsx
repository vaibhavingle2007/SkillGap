"use client";


export interface SkillGap {
  skill_name: string;
  required_proficiency: string;
  current_proficiency: string | null;
  gap_level: "missing" | "needs_improvement" | "met";
}

export interface AnalysisResponse {
  target_role: string;
  match_percentage: number;
  skill_gaps: SkillGap[];
  met_skills: SkillGap[];
  skill_gap_score?: number;
}

// Radar chart data points
const skillCategories = [
  "Frontend",
  "Backend",
  "DevOps",
  "Data",
  "System Design",
  " Soft Skills",
];

function RadarChart({
  current,
  required,
}: {
  current: number[];
  required: number[];
}) {
  const maxValue = 100;

  // Calculate points for polygon
  const angleStep = (2 * Math.PI) / skillCategories.length;
  const radius = 120;

  const getPoints = (values: number[]) => {
    return values
      .map((v, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (v / maxValue) * radius;
        const x = 160 + r * Math.cos(angle);
        const y = 160 + r * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(" ");
  };

  const currentPoints = getPoints(current);
  const requiredPoints = getPoints(required);

  // Grid lines
  const gridLevels = [25, 50, 75, 100];

  return (
    <div className="relative w-full max-w-[360px] mx-auto">
      <svg viewBox="0 0 320 320" className="w-full h-auto">
        {/* Grid circles */}
        {gridLevels.map((level) => (
          <circle
            key={level}
            cx="160"
            cy="160"
            r={(level / maxValue) * radius}
            fill="none"
            stroke="#3f3f46"
            strokeWidth="1"
            strokeDasharray={level === 100 ? "none" : "4 4"}
            opacity={0.5}
          />
        ))}

        {/* Axis lines */}
        {skillCategories.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = 160 + radius * Math.cos(angle);
          const y = 160 + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1="160"
              y1="160"
              x2={x}
              y2={y}
              stroke="#3f3f46"
              strokeWidth="1"
              opacity={0.5}
            />
          );
        })}

        {/* Required skills polygon */}
        <polygon
          points={requiredPoints}
          fill="rgba(99, 102, 241, 0.2)"
          stroke="#6366f1"
          strokeWidth="2"
        />

        {/* Current skills polygon */}
        <polygon
          points={currentPoints}
          fill="rgba(16, 185, 129, 0.2)"
          stroke="#10b981"
          strokeWidth="2"
        />

        {/* Skill labels */}
        {skillCategories.map((skill, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelRadius = radius + 25;
          const x = 160 + labelRadius * Math.cos(angle);
          const y = 160 + labelRadius * Math.sin(angle);

          return (
            <text
              key={skill}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-zinc-400 text-[10px] font-bold uppercase tracking-wider"
            >
              {skill}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-emerald-500/50 border border-emerald-500" />
          <span className="text-xs font-medium text-zinc-400">Current Skills</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-indigo-500/50 border border-indigo-500" />
          <span className="text-xs font-medium text-zinc-400">Required</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Match Gauge ─── */
function MatchGauge({ score }: { score: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "#10b981";
    if (s >= 60) return "#6366f1";
    if (s >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const color = getColor(score);

  return (
    <div className="relative h-36 w-36">
      <div className="absolute inset-0 rounded-full opacity-30 blur-xl" style={{ background: `radial-gradient(circle, ${color}40 0%, transparent 70%)` }} />
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#27272a" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white">{Math.round(score)}%</span>
        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">Match</span>
      </div>
    </div>
  );
}

export default function AnalysisResults({ data }: { data: AnalysisResponse }) {
  const matchPct = data.match_percentage ?? data.skill_gap_score ?? 0;
  const gapCount = data.skill_gaps?.length || 0;
  const metCount = data.met_skills?.length || 0;

  // Generate mock radar data
  const currentData = [
    metCount * 15,
    (metCount % 3) * 20 + 30,
    25,
    20,
    15,
    30,
  ];
  const requiredData = [
    metCount * 15 + gapCount * 10,
    (metCount % 3) * 20 + gapCount * 15,
    50,
    45,
    40,
    50,
  ];

  return (
    <div className="space-y-6 animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Skill Analysis</h2>
          <p className="text-sm text-zinc-500">Current vs Required</p>
        </div>
        <MatchGauge score={matchPct} />
      </div>

      {/* Radar Chart */}
      <div className="glass-card rounded-2xl border border-zinc-800/50 p-6">
        <RadarChart current={currentData} required={requiredData} />
      </div>

      {/* Skill Breakdown */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Matched Skills */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Matched ({metCount})
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.met_skills?.slice(0, 6).map((skill, i) => (
              <span
                key={i}
                className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-200/80"
              >
                {skill.skill_name}
              </span>
            ))}
            {(!data.met_skills || data.met_skills.length === 0) && (
              <p className="text-xs text-zinc-500">No skills matched yet</p>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            To Learn ({gapCount})
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.skill_gaps?.slice(0, 6).map((skill, i) => (
              <span
                key={i}
                className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3 py-1.5 text-xs font-medium text-indigo-200/80"
              >
                {skill.skill_name}
              </span>
            ))}
            {(!data.skill_gaps || data.skill_gaps.length === 0) && (
              <p className="text-xs text-zinc-500">No gaps identified</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
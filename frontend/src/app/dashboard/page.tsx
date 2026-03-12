"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AnalysisData {
  matched_skills: string[];
  missing_skills: string[];
  skill_gap_score: number;
}

interface RoadmapSkill {
  skill: string;
  learning_steps: string[];
  estimated_time: string;
}

interface DashboardState {
  analysis: AnalysisData | null;
  roadmap: RoadmapSkill[];
  targetRole: string;
  isLoading: boolean;
  error: string | null;
}

/* ─── Circular Gauge ─── */
function GapScoreGauge({ score }: { score: number }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getGrade = (s: number) => {
    if (s >= 80) return { from: "#10b981", to: "#34d399", label: "Excellent", bg: "bg-emerald-900/20", text: "text-emerald-400" };
    if (s >= 60) return { from: "#0d9488", to: "#14b8a6", label: "Good", bg: "bg-teal-900/20", text: "text-teal-400" };
    if (s >= 40) return { from: "#f59e0b", to: "#fbbf24", label: "Needs Work", bg: "bg-amber-900/20", text: "text-amber-400" };
    return { from: "#ef4444", to: "#f87171", label: "Critical", bg: "bg-red-900/20", text: "text-red-400" };
  };

  const grade = getGrade(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-40 w-40">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#27272a" strokeWidth="8" />
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={`url(#dashGaugeGrad)`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
          <defs>
            <linearGradient id="dashGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={grade.from} />
              <stop offset="100%" stopColor={grade.to} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{score}%</span>
          <span className="text-[11px] font-medium text-zinc-500">Gap Score</span>
        </div>
      </div>
      <span className={`rounded-full ${grade.bg} px-3 py-1 text-xs font-semibold ${grade.text}`}>
        {grade.label}
      </span>
    </div>
  );
}

/* ─── Mini Bar Chart ─── */
function SkillBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 truncate text-xs font-medium text-zinc-300">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-[11px] font-semibold text-zinc-400">{pct}%</span>
    </div>
  );
}

/* ─── Roadmap Progress Ring ─── */
function MiniRing({ percent, size = 48, strokeWidth = 4 }: { percent: number; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#27272a" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="#14b8a6"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
      />
    </svg>
  );
}

/* ─── Skeleton ─── */
function DashSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl border border-zinc-800 bg-zinc-900/60 animate-pulse" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="h-72 rounded-xl border border-zinc-800 bg-zinc-900/60 animate-pulse" />
        <div className="h-72 rounded-xl border border-zinc-800 bg-zinc-900/60 animate-pulse" />
      </div>
      <div className="h-48 rounded-xl border border-zinc-800 bg-zinc-900/60 animate-pulse" />
    </div>
  );
}

/* ─── Fallback data ─── */
const fallbackAnalysis: AnalysisData = {
  matched_skills: ["Python", "JavaScript", "React", "Git", "CSS", "HTML"],
  missing_skills: ["System Design", "Machine Learning", "Docker", "TypeScript", "AWS", "PostgreSQL"],
  skill_gap_score: 62,
};

const fallbackRoadmap: RoadmapSkill[] = [
  { skill: "System Design", learning_steps: ["Scalability", "Load Balancing", "DB Sharding", "Practice", "Case Studies"], estimated_time: "6 weeks" },
  { skill: "Machine Learning", learning_steps: ["NumPy/Pandas", "ML Algorithms", "Deep Learning", "Kaggle", "Deploy"], estimated_time: "8 weeks" },
  { skill: "Docker", learning_steps: ["Containers vs VMs", "Dockerfiles", "Compose", "K8s basics"], estimated_time: "3 weeks" },
  { skill: "TypeScript", learning_steps: ["Generics", "Utility Types", "Zod", "Advanced Patterns"], estimated_time: "2 weeks" },
  { skill: "AWS", learning_steps: ["EC2/S3", "Lambda", "IAM", "CDK"], estimated_time: "4 weeks" },
];

/* ═════════════════════════════════════════════ */
/*              MAIN DASHBOARD                  */
/* ═════════════════════════════════════════════ */
export default function DashboardPage() {
  const [state, setState] = useState<DashboardState>({
    analysis: null,
    roadmap: [],
    targetRole: "",
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setState((p) => ({ ...p, isLoading: true, error: null }));

    let skills: { name: string; level: number }[] = [];
    let target_role = "Full-Stack Developer";

    try {
      const stored = sessionStorage.getItem("skillforge_analysis");
      if (stored) {
        const parsed = JSON.parse(stored);
        skills = parsed.skills || [];
        target_role = parsed.target_role || target_role;
      }
    } catch { /* ignore */ }

    let analysis: AnalysisData | null = null;
    let roadmap: RoadmapSkill[] = [];
    let hasError = false;

    // Fetch analysis
    try {
      const res = await fetch(`${API_BASE}/analyze-skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, target_role }),
      });
      if (res.ok) analysis = await res.json();
      else throw new Error("fail");
    } catch {
      analysis = fallbackAnalysis;
      hasError = true;
    }

    // Fetch roadmap
    try {
      const res = await fetch(`${API_BASE}/learning-roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, target_role }),
      });
      if (res.ok) {
        const data = await res.json();
        roadmap = data.roadmap || [];
      } else throw new Error("fail");
    } catch {
      roadmap = fallbackRoadmap;
      hasError = true;
    }

    setState({
      analysis,
      roadmap,
      targetRole: target_role,
      isLoading: false,
      error: hasError ? "Using sample data — backend not reachable." : null,
    });
  };

  const { analysis, roadmap, targetRole, isLoading, error } = state;
  const totalSkills = analysis ? analysis.matched_skills.length + analysis.missing_skills.length : 0;
  const matchRate = totalSkills > 0 ? Math.round((analysis!.matched_skills.length / totalSkills) * 100) : 0;
  const totalRoadmapSteps = roadmap.reduce((s, r) => s + r.learning_steps.length, 0);

  return (
    <div className="px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">Career Progress</p>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
        </div>
        {targetRole && (
          <span className="rounded-lg border border-teal-500/20 bg-teal-900/15 px-3 py-1.5 text-xs font-medium text-teal-300">
            🎯 Target: {targetRole}
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 animate-fade-in flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-900/10 px-4 py-3">
          <span className="text-amber-400">⚠️</span>
          <p className="flex-1 text-sm text-amber-300">{error}</p>
          <button onClick={fetchDashboardData} className="text-xs font-medium text-teal-400 hover:underline">Retry</button>
        </div>
      )}

      {isLoading ? (
        <DashSkeleton />
      ) : analysis ? (
        <div className="space-y-6">

          {/* ─── Row 1: Stats Cards ─── */}
          <div className="animate-fade-in-up grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Gap Score", value: `${analysis.skill_gap_score}%`, icon: "📊", color: "text-teal-400", bg: "bg-teal-900/20" },
              { label: "Matched Skills", value: `${analysis.matched_skills.length}`, icon: "✅", color: "text-emerald-400", bg: "bg-emerald-900/20" },
              { label: "Skills to Learn", value: `${analysis.missing_skills.length}`, icon: "📚", color: "text-amber-400", bg: "bg-amber-900/20" },
              { label: "Roadmap Steps", value: `${totalRoadmapSteps}`, icon: "🗺️", color: "text-cyan-400", bg: "bg-cyan-900/20" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`card-glow stagger-${i + 1} animate-fade-in-up rounded-xl border border-zinc-800 bg-zinc-900/60 p-4`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg} text-lg`}>
                    {stat.icon}
                  </span>
                  <div>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-zinc-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ─── Row 2: Gauge + Skill Bars ─── */}
          <div className="animate-fade-in-up stagger-2 grid gap-6 lg:grid-cols-[280px_1fr]">

            {/* Gauge Card */}
            <div className="card-glow flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
              <GapScoreGauge score={analysis.skill_gap_score} />
              <div className="mt-4 text-center">
                <p className="text-sm font-semibold text-white">{targetRole}</p>
                <p className="text-[11px] text-zinc-500">Target Role</p>
              </div>
            </div>

            {/* Skill Coverage Chart */}
            <div className="card-glow rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">Skill Coverage</h2>
                  <p className="text-[11px] text-zinc-500">Match rate across all required skills</p>
                </div>
                <span className="rounded-lg bg-teal-900/20 px-2.5 py-1 text-xs font-bold text-teal-400">{matchRate}%</span>
              </div>

              {/* Horizontal bar breakdown */}
              <div className="space-y-3">
                <SkillBar label="Matched" value={analysis.matched_skills.length} max={totalSkills} color="bg-gradient-to-r from-emerald-600 to-emerald-400" />
                <SkillBar label="Missing" value={analysis.missing_skills.length} max={totalSkills} color="bg-gradient-to-r from-amber-600 to-amber-400" />
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-zinc-800" />

              {/* Donut-style breakdown with colored segments */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Matched ({analysis.matched_skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matched_skills.map((s) => (
                      <span key={s} className="rounded-md border border-emerald-500/15 bg-emerald-600/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Missing ({analysis.missing_skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missing_skills.map((s) => (
                      <span key={s} className="rounded-md border border-amber-500/15 bg-amber-600/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Row 3: Roadmap Progress ─── */}
          <div className="animate-fade-in-up stagger-3">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">Roadmap Progress</h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                {roadmap.length} skills to master · {totalRoadmapSteps} total learning steps
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roadmap.map((item, idx) => {
                const completedSteps = 0;
                const pct = item.learning_steps.length > 0 ? Math.round((completedSteps / item.learning_steps.length) * 100) : 0;

                return (
                  <div
                    key={idx}
                    className="card-glow rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700"
                  >
                    {/* Header with ring */}
                    <div className="flex items-start gap-3">
                      <div className="relative flex items-center justify-center">
                        <MiniRing percent={pct} size={44} strokeWidth={3} />
                        <span className="absolute text-[10px] font-bold text-zinc-400">{pct}%</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-white">{item.skill}</h3>
                        <p className="text-[11px] text-zinc-500">{item.estimated_time}</p>
                      </div>
                    </div>

                    {/* Steps list */}
                    <div className="mt-3 space-y-1.5">
                      {item.learning_steps.slice(0, 4).map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2">
                          <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />
                          <p className="text-[11px] leading-tight text-zinc-400">{typeof step === "string" ? step : step}</p>
                        </div>
                      ))}
                      {item.learning_steps.length > 4 && (
                        <p className="pl-3.5 text-[10px] text-zinc-600">
                          +{item.learning_steps.length - 4} more steps
                        </p>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-zinc-500">
                        {completedSteps}/{item.learning_steps.length}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Row 4: Quick Actions ─── */}
          <div className="animate-fade-in-up stagger-4 grid gap-3 sm:grid-cols-2">
            <a
              href="/skill-input"
              className="card-glow flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition-all hover:border-teal-500/30"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-900/20 text-2xl">✏️</span>
              <div>
                <p className="text-sm font-semibold text-white">Update Skills</p>
                <p className="text-xs text-zinc-500">Re-analyze with new skills or a different target role</p>
              </div>
            </a>
            <a
              href="/roadmap"
              className="card-glow flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition-all hover:border-teal-500/30"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-900/20 text-2xl">🗺️</span>
              <div>
                <p className="text-sm font-semibold text-white">View Full Roadmap</p>
                <p className="text-xs text-zinc-500">See detailed learning steps and YouTube videos</p>
              </div>
            </a>
          </div>

        </div>
      ) : null}
    </div>
  );
}

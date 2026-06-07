"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useData, AnalysisResponse, RoadmapItem } from "@/context/DataContext";

/* ------------------------------------------------------------------ */
/*  Local UI types                                                    */
/* ------------------------------------------------------------------ */
interface Resource {
  title: string;
  url: string;
  type: "youtube" | "article" | "cheatsheet" | "notes" | "course" | "docs" | "github";
  duration?: string;
  channel?: string;
}

interface RoadmapSkill {
  skill: string;
  learning_steps: string[];
  estimated_time: string;
  resources?: Resource[];
}

/* ------------------------------------------------------------------ */
/*  Helper: map context RoadmapItem -> local RoadmapSkill            */
/* ------------------------------------------------------------------ */
function adaptRoadmap(items: RoadmapItem[]): RoadmapSkill[] {
  return items.map((r) => ({
    skill: r.skill,
    learning_steps: r.learning_steps,
    estimated_time: r.estimated_time,
    resources: (r.youtube_videos || []).map((v) => ({
      title: v.title,
      url: `https://www.youtube.com/watch?v=${v.video_id}`,
      type: "youtube" as const,
      duration: "Video",
      channel: v.title,
    })),
  }));
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 ring-1 ring-indigo-500/20">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white">Start Your Journey</h2>
      <p className="mt-3 max-w-md text-zinc-400">Complete a skill analysis to unlock your personalized dashboard with gap insights, roadmaps, and curated resources.</p>
      <Link
        href="/skill-input"
        className="mt-8 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-indigo-900/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-indigo-900/40 active:scale-95"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Begin Analysis
      </Link>
    </div>
  );
}

function GapScoreGauge({ score }: { score: number }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getGrade = (s: number) => {
    if (s >= 80) return { from: "#10b981", to: "#34d399", label: "Market Ready", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" };
    if (s >= 60) return { from: "#6366f1", to: "#818cf8", label: "Strong Match", bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" };
    if (s >= 40) return { from: "#f59e0b", to: "#fbbf24", label: "In Progress", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" };
    return { from: "#ef4444", to: "#f87171", label: "Developing", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" };
  };

  const grade = getGrade(score);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-44 w-44">
        <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${grade.from}15 0%, transparent 70%)` }} />
        <div className="absolute inset-2 rounded-full border border-indigo-500/5 animate-pulse" />

        <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#27272a" strokeWidth="10" />
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={`url(#dashGaugeGrad)`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1500 ease-out"
          />
          <defs>
            <linearGradient id="dashGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={grade.from} />
              <stop offset="100%" stopColor={grade.to} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black tracking-tighter text-white">{score}<span className="text-2xl text-zinc-500">%</span></span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Readiness</span>
        </div>
      </div>
      <div className={`flex items-center gap-2 rounded-full border ${grade.border} ${grade.bg} px-4 py-1.5`}>
        <div className={`h-2 w-2 rounded-full animate-pulse`} style={{ background: grade.from }} />
        <span className={`text-xs font-bold uppercase tracking-wider ${grade.text}`}>{grade.label}</span>
      </div>
    </div>
  );
}

function DashSkeleton() {
  return (
    <div className="space-y-8 px-6 py-8 lg:px-10">
      <div className="h-10 w-48 rounded-lg bg-zinc-800/50 animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-zinc-800/30 border border-zinc-800 animate-pulse" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-2xl bg-zinc-800/30 border border-zinc-800 animate-pulse" />
        <div className="h-80 rounded-2xl bg-zinc-800/30 border border-zinc-800 animate-pulse" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Resource helpers                                                    */
/* ------------------------------------------------------------------ */
function typeLabel(type: Resource["type"]) {
  switch (type) {
    case "youtube": return "Video";
    case "course": return "Course";
    case "article": return "Article";
    case "cheatsheet": return "Cheatsheet";
    case "notes": return "Notes";
    case "docs": return "Docs";
    case "github": return "Repo";
    default: return "Resource";
  }
}
function typeChip(type: Resource["type"]) {
  switch (type) {
    case "youtube": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "course": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    case "article": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "cheatsheet": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "notes": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    case "docs": return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    case "github": return "bg-white/10 text-white border-white/20";
    default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard                                                    */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  const { analysis, roadmap } = useData();
  const [mounted, setMounted] = useState(false);

  // avoid flash-of-empty on page transition before Context hydrates
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <DashSkeleton />;

  const skillRoadmap = roadmap ? adaptRoadmap(roadmap.roadmap) : [];

  if (!analysis) return <EmptyState />;

  const gapResult = analysis;
  const score = Math.round(gapResult.match_percentage || gapResult.skill_gap_score || 0);
  const matchedSkills = gapResult.matched_skills || [];
  const missingSkills = gapResult.missing_skills || [];
  const steps = skillRoadmap;

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 lg:px-10 lg:py-12">
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-6 animate-fade-in">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-500">
            <span className="h-px w-8 bg-zinc-800" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Career Intelligence</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white lg:text-5xl">Dashboard</h1>
        </div>

        {gapResult.target_role && (
          <div className="glass-card rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 lg:p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl">🎯</div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Target Role</p>
                <p className="text-lg font-bold text-white">{gapResult.target_role}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KPI Row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Match Score */}
        <div className="glass-card rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Match Score</p>
            <p className="text-2xl font-black text-white">{score}<span className="text-sm text-zinc-600 font-medium">%</span></p>
          </div>
        </div>

        {/* Matched Skills */}
        <div className="glass-card rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Matched Skills</p>
            <p className="text-2xl font-black text-white">{matchedSkills.length}</p>
          </div>
        </div>

        {/* Missing Skills */}
        <div className="glass-card rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Missing Skills</p>
            <p className="text-2xl font-black text-white">{missingSkills.length}</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3 animate-fade-in">
        {/* Left Column — Gap Score + Skill Tags */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 flex flex-col items-center justify-center">
            <GapScoreGauge score={score} />
          </div>

          <div className="glass-card rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
            <h3 className="mb-4 text-sm font-bold text-white flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              Matched Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((s) => (
                <span key={s} className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">{s}</span>
              ))}
              {matchedSkills.length === 0 && <p className="text-xs text-zinc-600">No matched skills yet.</p>}
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
            <h3 className="mb-4 text-sm font-bold text-white flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-rose-400" />
              Missing Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((s) => (
                <span key={s} className="rounded-lg bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">{s}</span>
              ))}
              {missingSkills.length === 0 && <p className="text-xs text-zinc-600">No missing skills — great!</p>}
            </div>
          </div>
        </div>

        {/* Center + Right — Roadmap + Resources */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Roadmap */}
          <div className="glass-card rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Learning Roadmap
              </h3>
              <Link
                href="/skill-input"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/><polyline points="1 4 1 10 7 10"/></svg>
                Re-analyze
              </Link>
            </div>

            {steps.length > 0 ? (
              <div className="relative space-y-4">
                {/* Connector line */}
                <div className="absolute left-[18px] top-8 bottom-4 w-px bg-zinc-800" />

                {steps.map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-2">
                    <div className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${idx === 0 ? "bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]" : "bg-zinc-800 text-zinc-500"}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-bold truncate ${idx === 0 ? "text-white" : "text-zinc-400"}`}>{item.skill}</h4>
                        {idx === 0 && <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Start Here</span>}
                      </div>
                      <p className="text-xs text-zinc-500 mb-2">{item.estimated_time}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.learning_steps.map((step, sIdx) => (
                          <span key={sIdx} className="text-[10px] bg-zinc-800/60 text-zinc-400 px-2 py-0.5 rounded-md">{step}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 text-center py-6">No roadmap available. Try selecting a different role.</p>
            )}
          </div>

          {/* Recommended Resources */}
          <div className="glass-card rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Recommended Resources
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">{steps.length} Skills</span>
            </div>

            <div className="space-y-3">
              {steps.slice(0, 5).flatMap((item) => item.resources || []).length > 0 ? (
                steps.slice(0, 3).flatMap((item) =>
                  (item.resources || []).map((r, i) => (
                    <a
                      key={`${item.skill}-${i}`}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/20 px-4 py-3 transition-all hover:border-zinc-700"
                    >
                      <div className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider border ${typeChip(r.type)}`}>
                        {typeLabel(r.type)}
                      </div>
                      <span className="flex-1 truncate text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{r.title}</span>
                      {r.duration && <span className="text-[10px] text-zinc-600 font-medium">{r.duration}</span>}
                      <svg className="h-4 w-4 shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  ))
                )
              ) : (
                <div className="text-center py-6 text-zinc-500 text-sm">
                  <p>No specific resources for your roadmap yet.</p>
                  <Link href="/skill-input" className="mt-2 inline-block text-indigo-400 font-bold hover:text-indigo-300">Run a new analysis</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

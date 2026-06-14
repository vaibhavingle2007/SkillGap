"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import CountUp from "@/components/landing/CountUp";
import Reveal from "@/components/landing/Reveal";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
interface Resource {
  title: string;
  url: string;
  type: "youtube" | "article" | "cheatsheet" | "notes" | "course" | "docs" | "github";
  duration?: string;
  channel?: string;
}

interface RoadmapItem {
  skill: string;
  learning_steps: string[];
  estimated_time: string;
  resources?: Resource[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
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
    default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
}

function getGrade(score: number) {
  if (score >= 80) return { label: "A", color: "text-emerald-400", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20", from: "#10b981", to: "#34d399" };
  if (score >= 60) return { label: "B", color: "text-indigo-400", bg: "bg-indigo-500/10", ring: "ring-indigo-500/20", from: "#6366f1", to: "#818cf8" };
  if (score >= 40) return { label: "C", color: "text-amber-400", bg: "bg-amber-500/10", ring: "ring-amber-500/20", from: "#f59e0b", to: "#fbbf24" };
  return { label: "D", color: "text-red-400", bg: "bg-red-500/10", ring: "ring-red-500/20", from: "#ef4444", to: "#f87171" };
}

/* ------------------------------------------------------------------ */
/*  Progress Chart (Gauge)                                            */
/* ------------------------------------------------------------------ */
function ProgressGauge({ score }: { score: number }) {
  const [animated, setAnimated] = useState(false);
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = animated ? circumference - (score / 100) * circumference : circumference;
  const grade = getGrade(score);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className="relative h-44 w-44">
        {/* Radial glow */}
        <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${grade.from}15 0%, transparent 70%)` }} />
        <div className={`absolute inset-2 rounded-full border ${score < 40 ? "animate-pulse" : ""}`} style={{ borderColor: `${grade.from}10` }} />

        <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#27272a" strokeWidth="10" />
          <motion.circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={`url(#gaugeGrad)`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={grade.from} />
              <stop offset="100%" stopColor={grade.to} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black tracking-tighter text-white">
            {score}<span className="text-2xl text-zinc-500">%</span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Readiness</span>
        </div>
      </div>
      <div className={`flex items-center gap-2 rounded-full border ${grade.ring} ${grade.bg} px-4 py-1.5`}>
        <div className={`h-2 w-2 rounded-full ${score < 40 ? "animate-pulse" : ""}`} style={{ background: grade.from }} />
        <span className={`text-xs font-bold uppercase tracking-wider ${grade.color}`}>{grade.label}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dash Skeleton                                                     */
/* ------------------------------------------------------------------ */
function DashSkeleton() {
  return (
    <div className="space-y-8 px-6 py-8 lg:px-10">
      <div className="h-10 w-48 rounded-lg bg-zinc-800/50 animate-pulse" />
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
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
/*  Empty State                                                       */
/* ------------------------------------------------------------------ */
function EmptyState() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-20 text-center px-6">
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
        className="mt-8 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-indigo-900/30 transition-all hover:scale-105 active:scale-95"
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

/* ------------------------------------------------------------------ */
/*  Heatmap                                                           */
/* ------------------------------------------------------------------ */
function Heatmap({ completionRate }: { completionRate: number }) {
  const weeks = 12;
  const days = 7;
  const totalSquares = weeks * days;
  const activeSquares = Math.round(totalSquares * completionRate);

  // Generate deterministic "activity" based on completion rate
  const data = Array.from({ length: totalSquares }, (_, i) => {
    if (i < activeSquares) {
      // Higher completion = more green, medium = purple
      return i < activeSquares * 0.6 ? "#10b981" : "#6366f1";
    }
    return null;
  });

  const streakDays = Math.max(1, Math.round(completionRate * 14));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Activity</h4>
        <span className="flex items-center gap-1 text-xs text-zinc-400">
          <svg className="h-3.5 w-3.5 text-orange-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M7.87438 20.6206C8.18252 21.0525 8.85212 21.0376 9.14182 20.5904C11.712 16.6515 14.0671 16.0371 14.0671 13.3231C14.0671 10.2165 12.1039 7.87185 9.3412 7.81576C6.34882 7.75544 4.24865 10.4089 4.26772 13.4179C4.29199 17.1773 6.93144 18.0253 7.87438 20.6206ZM13.6826 17.9483C13.6826 19.5267 15.0212 22.0915 15.4778 22.4875C15.7782 22.7517 16.452 22.4889 16.47 22.1456C17.2793 19.3589 19.3976 17.6338 19.3976 14.5225C19.3976 12.2212 17.9961 10.0056 15.6387 10.2233C13.183 10.4498 12.1722 12.3937 12.1722 14.2293C12.1722 15.8471 13.2209 16.6535 13.6826 17.9483Z" />
          </svg>
          {streakDays} day streak
        </span>
      </div>
      <div className="flex gap-[3px]">
        {Array.from({ length: weeks }, (_, w) => (
          <div key={w} className="flex flex-col gap-[3px]">
            {Array.from({ length: days }, (_, d) => {
              const idx = w * days + d;
              const color = data[idx];
              return (
                <div
                  key={d}
                  className="h-[10px] w-[10px] rounded-sm transition-colors duration-300"
                  style={{
                    backgroundColor: color || "#27272a",
                    opacity: color ? (color === "#10b981" ? 1 : 0.8) : 0.5,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bento KPI Card                                                    */
/* ------------------------------------------------------------------ */
function BentoCard({
  children,
  color,
  colSpan = 1,
  rowSpan = 1,
}: {
  children: React.ReactNode;
  color: string;
  colSpan?: number;
  rowSpan?: number;
}) {
  return (
    <div
      className="group relative glass-card rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 transition-all hover:-translate-y-1"
      style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}` }}
    >
      {/* Radial glow blob */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-[60px] opacity-0 transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: color }}
      />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard                                                    */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  const { analysis, roadmap, setAnalysis, setRoadmap } = useData();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [skillFilter, setSkillFilter] = useState<"all" | "matched" | "missing">("all");
  const [roadmapProgress, setRoadmapProgress] = useState<Record<string, string[]>>({});

  const firstName = user?.displayName?.split(" ")[0] || "Explorer";

  useEffect(() => {
    setMounted(true);
    const update = () => setNow(new Date());
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  // Load cached data from sessionStorage if context is empty
  useEffect(() => {
    if (!analysis) {
      try {
        const cachedAnalysis = sessionStorage.getItem("skillgap_cached_analysis");
        if (cachedAnalysis) {
          const parsed = JSON.parse(cachedAnalysis);
          setAnalysis(parsed);
        }
      } catch {
        // ignore corrupt sessionStorage
      }
    }
    if (!roadmap) {
      try {
        const cachedRoadmap = sessionStorage.getItem("skillgap_cached_roadmap");
        if (cachedRoadmap) {
          const parsed = JSON.parse(cachedRoadmap);
          setRoadmap(parsed);
        }
      } catch {
        // ignore corrupt sessionStorage
      }
    }
    // Read roadmap quest progress
    try {
      const progressRaw = sessionStorage.getItem("skillgap_roadmap_progress");
      if (progressRaw) setRoadmapProgress(JSON.parse(progressRaw));
    } catch {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep quest progress in sync after completing quests on the roadmap page.
  // The dashboard may stay mounted across client-side navigation, so re-read
  // progress whenever the tab regains focus/visibility or storage changes.
  useEffect(() => {
    const syncProgress = () => {
      try {
        const progressRaw = sessionStorage.getItem("skillgap_roadmap_progress");
        setRoadmapProgress(progressRaw ? JSON.parse(progressRaw) : {});
      } catch {
        // ignore corrupt sessionStorage
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") syncProgress();
    };
    window.addEventListener("focus", syncProgress);
    window.addEventListener("storage", syncProgress);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", syncProgress);
      window.removeEventListener("storage", syncProgress);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  /* ── Derived values (before any early return) ── */
  const baseScore = analysis ? Math.round(analysis.match_percentage || analysis.skill_gap_score || 0) : 0;
  const matchedSkills = useMemo(() => analysis?.matched_skills || [], [analysis]);
  const missingSkills = useMemo(() => analysis?.missing_skills || [], [analysis]);

  /* Quest progress calculation */
  const totalSteps = roadmap
    ? roadmap.roadmap.reduce((acc, r) => acc + (r.learning_steps?.length || 0), 0)
    : 0;
  const completedSteps = roadmap && roadmapProgress
    ? roadmap.roadmap.reduce((acc, r) => {
        const key = r.skill.toLowerCase().trim();
        return acc + (roadmapProgress[key] || []).length;
      }, 0)
    : 0;
  const questProgress = totalSteps > 0 ? completedSteps / totalSteps : 0;
  const score = Math.round(baseScore + (100 - baseScore) * questProgress);

  const roadmapItems: RoadmapItem[] = roadmap
    ? roadmap.roadmap.map((r) => ({
        skill: r.skill,
        learning_steps: r.learning_steps,
        estimated_time: r.estimated_time,
        resources: (r.youtube_videos || []).map((v) => ({
          title: v.title,
          url: `https://www.youtube.com/watch?v=${v.video_id}`,
          type: "youtube" as const,
          duration: "~10 min",
          channel: v.title,
        })),
      }))
    : [];

  const filteredSkills = useMemo(() => {
    switch (skillFilter) {
      case "matched":
        return matchedSkills;
      case "missing":
        return missingSkills;
      default:
        return [...matchedSkills, ...missingSkills];
    }
  }, [skillFilter, matchedSkills, missingSkills]);

  /* ── Early returns after ALL hooks ── */
  if (!mounted) return <DashSkeleton />;
  if (!analysis) return <EmptyState />;

  const timeString = now
    ? now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 lg:px-10 lg:py-12">
      {/* ── Header ── */}
      <Reveal>
        <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="h-px w-8 bg-zinc-800" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Career Intelligence</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white lg:text-4xl">
              Welcome back, <span className="text-gradient">{firstName}</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {timeString}
            </div>
          </div>

          {analysis.target_role && (
            <div className="glass-card rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 lg:p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl">🎯</div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Target Role</p>
                  <p className="text-lg font-bold text-white">{analysis.target_role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Reveal>

      {/* ── Bento KPI Grid ── */}
      <div className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Match Score - spans 2 rows */}
        <BentoCard color="#10b981" colSpan={1} rowSpan={2}>
          <ProgressGauge score={score} />
        </BentoCard>

        {/* Matched Skills */}
        <BentoCard color="#6366f1">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Match Score</p>
              <p className="text-2xl font-black text-white">
                <CountUp value={score} />%
              </p>
            </div>
          </div>
        </BentoCard>

        {/* Matched Count */}
        <BentoCard color="#6366f1">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Matched</p>
              <p className="text-2xl font-black text-white">
                <CountUp value={matchedSkills.length} />
              </p>
            </div>
          </div>
        </BentoCard>

        {/* Missing Count */}
        <BentoCard color="#ef4444">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Missing</p>
              <p className="text-2xl font-black text-white">
                <CountUp value={missingSkills.length} />
              </p>
            </div>
          </div>
        </BentoCard>

        {/* Activity Heatmap - spans 2 cols */}
        <BentoCard color="#f59e0b" colSpan={2} rowSpan={1}>
          <Heatmap completionRate={questProgress} />
        </BentoCard>
      </div>

      {/* ── Skill Tags with Filters ── */}
      <div className="mb-8 glass-card rounded-2xl border border-zinc-800/50 p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-2 w-2 rounded-full bg-indigo-400" />
          <h3 className="text-sm font-bold text-white">Skill Breakdown</h3>
          <div className="ml-auto flex gap-1 rounded-full bg-zinc-900/50 p-1">
            {(["all", "matched", "missing"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setSkillFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-bold capitalize transition-all ${
                  skillFilter === f ? "bg-indigo-500 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {filteredSkills.map((s) => {
              const isMatched = matchedSkills.includes(s);
              const isMissing = missingSkills.includes(s);
              return (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                  className={`rounded-lg px-3 py-1 text-xs font-semibold border ${
                    isMissing
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      : isMatched
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                  }`}
                >
                  {s}
                </motion.span>
              );
            })}
          </AnimatePresence>
          {filteredSkills.length === 0 && <p className="text-xs text-zinc-600">No skills in this category.</p>}
        </div>
      </div>

      {/* ── Roadmap Summary + Resources Grid ── */}
      <div className="grid gap-8 lg:grid-cols-2 mb-8">
        {/* Roadmap */}
        <div className="glass-card rounded-2xl border border-zinc-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Learning Roadmap
            </h3>
            <Link
              href="/skill-input"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                <polyline points="1 4 1 10 7 10" />
              </svg>
              Re-analyze
            </Link>
          </div>

          {roadmapItems.length > 0 ? (
            <div className="space-y-4">
              {roadmapItems.slice(0, 4).map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-4"
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    idx === 0 ? "bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]" : "bg-zinc-800 text-zinc-500"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${idx === 0 ? "text-white" : "text-zinc-400"}`}>{item.skill}</p>
                    <p className="text-xs text-zinc-500">{item.estimated_time}</p>
                  </div>
                  {item.learning_steps.length > 0 && (
                    <span className="text-xs text-zinc-600">{item.learning_steps.length} steps</span>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 text-center py-6">No roadmap available. Try selecting a different role.</p>
          )}
        </div>

        {/* Resources */}
        <div className="glass-card rounded-2xl border border-zinc-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Recommended Resources
            </h3>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">{roadmapItems.length} Skills</span>
          </div>

          <div className="space-y-3">
            {roadmapItems.slice(0, 3).flatMap((item) =>
              (item.resources || []).slice(0, 2).map((r, i) => (
                <a
                  key={`${item.skill}-${i}`}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/20 px-4 py-3 transition-all hover:border-zinc-700"
                >
                  <div className={`shrink-0 rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wider border ${typeChip(r.type)}`}>
                    {typeLabel(r.type)}
                  </div>
                  <span className="flex-1 truncate text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{r.title}</span>
                  {r.duration && <span className="text-xs text-zinc-600 font-medium">{r.duration}</span>}
                  <svg className="h-4 w-4 shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              ))
            )}
            {roadmapItems.filter(r => (r.resources || []).length > 0).length === 0 && (
              <div className="text-center py-6 text-zinc-500 text-sm">
                <p>No specific resources yet.</p>
                <Link href="/skill-input" className="mt-2 inline-block text-indigo-400 font-bold hover:text-indigo-300">Run a new analysis</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Coming Soon Cards ── */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-px w-8 bg-zinc-700" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Coming Soon</span>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {[
            { title: "Resume AI Review", desc: "Get your resume scored and improved by AI", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
            { title: "Mock Interviews", desc: "Practice with AI-powered interview simulations", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
            { title: "Portfolio Review", desc: "Get feedback on your project portfolio", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
          ].map((c, i) => (
            <div key={i} className="glass-card rounded-2xl border border-zinc-800/30 p-5 opacity-60 hover:opacity-80 transition-opacity">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-zinc-300">{c.title}</h4>
              </div>
              <p className="text-xs text-zinc-500">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

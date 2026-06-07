"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { saveRoadmapProgress, getRoadmapProgress } from "@/lib/userData";
import {
  Play, ExternalLink, BookOpen, FileText, Lightbulb, Link2, GitBranch,
  Clock, ChevronDown, ChevronUp, CheckCircle2, Circle, RotateCcw, Trophy,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const PROGRESS_KEY = "skillforge_roadmap_progress";

/* ──────────────────────────── */
/*  Local progress helpers       */
/* ──────────────────────────── */
function loadLocalProgress(): Record<string, string[]> {
  try { return JSON.parse(sessionStorage.getItem(PROGRESS_KEY) || "{}"); } catch { return {}; }
}
function saveLocalProgress(progress: Record<string, string[]>) {
  sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

/* ──────────────────────────── */
/*  Types & Interfaces           */
/* ──────────────────────────── */
export interface LearningStep { step: string; description?: string; }
export interface Resource {
  title: string; url: string;
  type: "youtube" | "article" | "cheatsheet" | "notes" | "course" | "docs" | "github";
  duration?: string; channel?: string;
}
export interface RoadmapItem {
  skill: string; learning_steps: string[] | LearningStep[]; estimated_time: string; resources?: Resource[];
}
export interface RoadmapResponse { roadmap: RoadmapItem[]; target_role?: string; }

/* ──────────────────────────── */
/*  Helpers                      */
/* ──────────────────────────── */
function toStepStr(step: string | LearningStep): string {
  return typeof step === "string" ? step : step.step;
}
function normaliseSkill(name: string): string {
  return name.trim().toLowerCase();
}

/* ─── ResourceCard ─── */
function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  if (resource.url === "#") return null;
  const kinds: Record<Resource["type"], { icon: React.ReactNode; cls: string; label: string }> = {
    youtube:  { icon: <Play className="h-3.5 w-3.5 fill-red-500 text-red-500" />,                  cls: "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20",              label: "Video" },
    course:   { icon: <BookOpen className="h-3.5 w-3.5 text-indigo-400" />,                     cls: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20", label: "Course" },
    article:  { icon: <FileText className="h-3.5 w-3.5 text-emerald-400" />,                    cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20", label: "Article" },
    cheatsheet:{ icon: <Lightbulb className="h-3.5 w-3.5 text-amber-400" />,                    cls: "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20",     label: "Cheatsheet" },
    notes:    { icon: <FileText className="h-3.5 w-3.5 text-cyan-400" />,                      cls: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20",        label: "Notes" },
    docs:     { icon: <BookOpen className="h-3.5 w-3.5 text-zinc-400" />,                       cls: "bg-zinc-500/10 border-zinc-500/20 text-zinc-400 hover:bg-zinc-500/20",        label: "Docs" },
    github:   { icon: <GitBranch className="h-3.5 w-3.5 text-white" />,                         cls: "bg-white/10 border-white/20 text-white hover:bg-white/20",                   label: "Repo" },
  };
  const cfg = kinds[resource.type] || kinds.article;
  return (
    <a href={resource.url} target="_blank" rel="noopener noreferrer"
       className={`group flex items-center gap-3 rounded-xl border ${cfg.cls} px-4 py-3 transition-all hover:scale-[1.02]`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/20">{cfg.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{resource.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{cfg.label}</span>
          {resource.duration && (<><span className="text-zinc-600">•</span><span className="text-[10px] font-medium opacity-70 flex items-center gap-1"><Clock className="h-3 w-3" />{resource.duration}</span></>)}
          {resource.channel && (<><span className="text-zinc-600">•</span><span className="text-[10px] font-medium opacity-70">{resource.channel}</span></>)}
        </div>
      </div>
      <ExternalLink className="h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

/* ─── Scrubber ─── */
function StepScrubber({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        <span>Progress</span>
        <span className={done === total ? "text-emerald-400" : "text-indigo-400"}>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, background: done === total ? "#10b981" : "#6366f1" }} />
      </div>
    </div>
  );
}

/* ──────────────────────────── */
/*  Mini Version                  */
/* ──────────────────────────── */
export function LearningTimelineMini({ mini = false }: { mini?: boolean }) {
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const stored = sessionStorage.getItem("skillforge_analysis");
      if (!stored) { setRoadmap(enhancedFallbackRoadmap); setIsLoading(false); return; }
      try {
        const parsed = JSON.parse(stored);
        const res = await fetch(`${API_BASE}/learning-roadmap`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ skills: parsed.skills || [], target_role: parsed.target_role || "" }) });
        if (res.ok) { const data: RoadmapResponse = await res.json(); setRoadmap(data.roadmap || []); } else throw new Error();
      } catch { setRoadmap(enhancedFallbackRoadmap); } finally { setIsLoading(false); }
    })();
  }, []);

  if (isLoading) return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-zinc-800/30 animate-pulse" />)}</div>;
  return (
    <div className="space-y-4">
      {roadmap.slice(0, 4).map((item, idx) => (
        <div key={idx} className={`relative flex items-center gap-4 rounded-xl border p-4 transition-all ${idx === 0 ? "border-indigo-500/30 bg-indigo-500/5" : "border-zinc-800 bg-zinc-900/20"}`}>
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${idx === 0 ? "bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]" : "bg-zinc-800 text-zinc-500"}`}>
            {idx === 0 ? <Play width={12} height={12} fill="currentColor" /> : idx + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold truncate ${idx === 0 ? "text-white" : "text-zinc-400"}`}>{item.skill}</p>
            <p className="text-xs text-zinc-500">{item.estimated_time}</p>
          </div>
          {item.resources && item.resources.length > 0 && (
            <div className="flex gap-1">
              {item.resources.filter(r => r.type === "youtube" && r.url !== "#").length > 0 && <span className="flex items-center gap-1 rounded-lg bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-400"><Play className="h-2.5 w-2.5" />{item.resources.filter(r => r.type === "youtube" && r.url !== "#").length}</span>}
              {item.resources.filter(r => r.type === "cheatsheet" && r.url !== "#").length > 0 && <span className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-400"><Lightbulb className="h-2.5 w-2.5" />{item.resources.filter(r => r.type === "cheatsheet" && r.url !== "#").length}</span>}
              {item.resources.filter(r => r.type === "notes" && r.url !== "#").length > 0 && <span className="flex items-center gap-1 rounded-lg bg-cyan-500/10 px-2 py-1 text-[10px] font-bold text-cyan-400"><FileText className="h-2.5 w-2.5" />{item.resources.filter(r => r.type === "notes" && r.url !== "#").length}</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────── */
/*  Full LearningTimeline        */
/* ──────────────────────────── */
export default function LearningTimeline() {
  const { user } = useAuth();
  const { roadmap } = useData();

  const [targetRole, setTargetRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIdx, setExpandedIdx] = useState<number>(0);

  /* local roadmap items (built from context or fetched) */
  const [items, setItems] = useState<RoadmapItem[]>([]);

  /* Map: skillKey (lowercase) → list of completed step strings */
  const [progress, setProgress] = useState<Record<string, string[]>>({});

  /* ── Load progress on mount ── */
  useEffect(() => {
    (async () => {
      if (user) {
        try {
          const docs = await getRoadmapProgress(user);
          const mapped: Record<string, string[]> = {};
          docs.forEach((d: any) => { const key = normaliseSkill(d.skillName || ""); mapped[key] = d.completedSteps || []; });
          setProgress(mapped);
        } catch (e) { setProgress(loadLocalProgress()); }
      } else { setProgress(loadLocalProgress()); }
    })();
  }, [user]);

  /* ── Save progress whenever it changes ── */
  useEffect(() => {
    // Guard: don't save until mounted / loaded
    if (Object.keys(progress).length === 0 && isLoading) return;
    saveLocalProgress(progress);
    (async () => {
      if (user) {
        for (const [skillKey, steps] of Object.entries(progress)) {
          try {
            // Find the original skill name by matching keys
            const original = items.find(r => normaliseSkill(r.skill) === skillKey)?.skill || skillKey;
            await saveRoadmapProgress(user, original, steps, steps.length);
          } catch { /* Firestore best-effort */ }
        }
      }
    })();
  }, [progress, user, items]);

  /* ── Build items / targetRole from DataContext, fallback to fetch/fallback ── */
  useEffect(() => {
    if (roadmap && roadmap.roadmap.length > 0) {
      const adapted = roadmap.roadmap.map((r) => {
        const steps = r.learning_steps.map((s: any) => {
          if (typeof s === "string") return s;
          if (s && typeof s === "object" && "step" in s) return s.step;
          return String(s);
        });
        const resources: Resource[] = (r.youtube_videos || []).map((v: { title: string; video_id?: string; url?: string }) => ({
          title: v.title,
          url: v.video_id ? `https://www.youtube.com/watch?v=${v.video_id}` : v.url || "#",
          type: "youtube" as const,
          duration: "Video",
        }));
        return { skill: r.skill, learning_steps: steps, estimated_time: r.estimated_time, resources };
      });
      setItems(adapted);
      setTargetRole(roadmap.target_role || "");
      setIsLoading(false);
      return;
    }

    /* fallback fetch */
    (async () => {
      setIsLoading(true);
      const stored = sessionStorage.getItem("skillforge_analysis");
      if (!stored) { setItems(enhancedFallbackRoadmap); setTargetRole("Full-Stack Developer"); setIsLoading(false); return; }
      try {
        const parsed = JSON.parse(stored);
        const res = await fetch(`${API_BASE}/learning-roadmap`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ skills: parsed.skills || [], target_role: parsed.target_role || "" }) });
        if (!res.ok) throw new Error();
        const data: RoadmapResponse = await res.json();
        setItems(data.roadmap || []);
        setTargetRole(data.target_role || parsed.target_role || "");
      } catch {
        setItems(enhancedFallbackRoadmap);
        setTargetRole("Full-Stack Developer");
      } finally { setIsLoading(false); }
    })();
  }, [roadmap]);

  /* ── Toggle individual step ── */
  const toggleStep = useCallback((skillName: string, stepName: string) => {
    const key = normaliseSkill(skillName);
    setProgress(prev => {
      const current = new Set(prev[key] || []);
      if (current.has(stepName)) current.delete(stepName); else current.add(stepName);
      return { ...prev, [key]: Array.from(current) };
    });
  }, []);

  /* ── Mark whole skill complete ── */
  const markComplete = useCallback((skillName: string, steps: (string | LearningStep)[]) => {
    const key = normaliseSkill(skillName);
    const all = steps.map(toStepStr);
    setProgress(prev => ({ ...prev, [key]: all }));
  }, []);

  /* ── Reset skill ── */
  const resetSkill = useCallback((skillName: string) => {
    const key = normaliseSkill(skillName);
    setProgress(prev => { const p = { ...prev }; delete p[key]; return p; });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-[32px_1fr] gap-4">
            <div className="h-8 w-8 rounded-full bg-zinc-800 animate-pulse" />
            <div className="h-48 rounded-2xl bg-zinc-800/30 border border-zinc-800 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) return <TimelineEmpty />;

  /* Overall percentage */
  const totalSteps = items.reduce((acc, it) => acc + (it.learning_steps?.length || 0), 0);
  const doneSteps = items.reduce((acc, it) => {
    const key = normaliseSkill(it.skill);
    const completed = progress[key] || [];
    /* count distinct completed steps that actually exist */
    const existing = new Set(it.learning_steps.map(toStepStr));
    return acc + completed.filter(s => existing.has(s)).length;
  }, 0);
  const overallPct = totalSteps === 0 ? 0 : Math.round((doneSteps / totalSteps) * 100);

  return (
    <div className="space-y-10">
      {/* Header with progress */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 mb-1">
            <span className="h-px w-8 bg-zinc-800" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Learning Path</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">{targetRole || "My Roadmap"}</h2>
          <p className="mt-1 text-sm text-zinc-500">{doneSteps} of {totalSteps} steps completed</p>
        </div>

        <div className="w-full max-w-xs">
          <StepScrubber done={doneSteps} total={totalSteps} />
          {overallPct === 100 && (
            <div className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Trophy className="h-4 w-4" /> Roadmap Complete — Nice work!
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-8">
        {items.map((item, idx) => {
          const skillKey = normaliseSkill(item.skill);
          const stepList = item.learning_steps.map(toStepStr);
          const completed = progress[skillKey] || [];
          const skillPct = stepList.length === 0 ? 0 : Math.round((completed.filter(s => stepList.includes(s)).length / stepList.length) * 100);
          const isAllDone = skillPct === 100 && stepList.length > 0;
          const isExpanded = expandedIdx === idx;
          const isCurrent = idx === 0;
          const connectorEnd = idx < items.length - 1;

          return (
            <div key={idx} className="relative flex gap-6">
              {/* Timeline connector */}
              {connectorEnd && <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-zinc-800" />}

              {/* Badge column */}
              <div className="flex flex-col items-center">
                <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  isAllDone ? "border-emerald-500 bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    : isCurrent ? "border-indigo-500 bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                    : "border-zinc-700 bg-zinc-900 text-zinc-500"
                }`}>
                  {isAllDone ? <CheckCircle2 className="h-4 w-4" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                </div>
              </div>

              {/* Card */}
              <div className="flex-1">
                <div className={`glass-card rounded-2xl border transition-all ${
                  isAllDone ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                    : isCurrent ? "border-indigo-500/30 bg-indigo-500/5"
                    : "border-zinc-800/50 hover:border-zinc-700"
                }`}>
                  {/* Collapsible header */}
                  <button onClick={() => setExpandedIdx(isExpanded ? -1 : idx)} className="w-full p-5 text-left">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className={`text-lg font-bold ${isAllDone ? "text-emerald-300" : isCurrent ? "text-white" : "text-zinc-300"}`}>{item.skill}</h3>
                          {isAllDone && (
                            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" /> Complete
                            </span>
                          )}
                          {!isAllDone && isCurrent && (
                            <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">In Progress</span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <StepScrubber done={completed.filter(s => stepList.includes(s)).length} total={stepList.length} />
                          <span className="text-xs font-bold text-zinc-600">{item.estimated_time}</span>
                        </div>
                      </div>
                      <div className="mt-1 flex gap-2">
                        {!isAllDone && stepList.length > 0 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); markComplete(item.skill, item.learning_steps); }}
                            className="rounded-lg border border-zinc-700 bg-zinc-900/40 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 transition-colors hover:border-emerald-500/30 hover:text-emerald-400"
                          >
                            Mark all done
                          </button>
                        )}
                        {completed.length > 0 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); resetSkill(item.skill); }}
                            className="rounded-lg border border-zinc-700 bg-zinc-900/40 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300"
                            title="Reset"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 transition-all ${isExpanded ? "rotate-180 border-indigo-500 bg-indigo-500/10" : ""}`}>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-indigo-400" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail — steps + resources */}
                  {isExpanded && (
                    <div className="border-t border-zinc-800/50 bg-zinc-950/20 p-5">
                      {/* Steps with checkboxes */}
                      <div className="mb-6">
                        <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Learning Steps</h4>
                        <div className="space-y-2">
                          {stepList.map((step, sIdx) => {
                            const isDone = completed.includes(step);
                            return (
                              <label key={sIdx} className={`group flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                                isDone ? "border-zinc-800/30 bg-zinc-900/20" : "border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/30"
                              }`}>
                                <div className="shrink-0">
                                  {isDone ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400 transition-transform group-active:scale-90" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-zinc-600 transition-colors group-hover:text-indigo-400" />
                                  )}
                                </div>
                                <span className={`flex-1 text-sm transition-colors ${isDone ? "text-zinc-500 line-through" : "text-zinc-300"}`}>{step}</span>
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={isDone}
                                  onChange={() => toggleStep(item.skill, step)}
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Resources */}
                      {item.resources && item.resources.filter(r => r.url !== "#").length > 0 && (
                        <div className="space-y-6">
                          {/* Group resources by type for a tidy grid */}
                          {(["youtube", "course", "cheatsheet", "notes", "article", "docs", "github"] as Resource["type"][]).map((t) => {
                            const rs = item.resources!.filter(r => r.type === t && r.url !== "#");
                            if (!rs.length) return null;
                            return (
                              <div key={t}>
                                <h4 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                                  {t === "youtube" && <Play className="h-3.5 w-3.5 text-red-400" />}
                                  {t === "course" && <BookOpen className="h-3.5 w-3.5 text-indigo-400" />}
                                  {t === "cheatsheet" && <Lightbulb className="h-3.5 w-3.5 text-amber-400" />}
                                  {t === "notes" && <FileText className="h-3.5 w-3.5 text-cyan-400" />}
                                  {t === "article" && <FileText className="h-3.5 w-3.5 text-emerald-400" />}
                                  {t === "docs" && <BookOpen className="h-3.5 w-3.5 text-zinc-400" />}
                                  {t === "github" && <GitBranch className="h-3.5 w-3.5 text-white" />}
                                  {t} ({rs.length})
                                </h4>
                                <div className="grid gap-2 sm:grid-cols-2">
                                  {rs.map((resource, rIdx) => <ResourceCard key={rIdx} resource={resource} index={rIdx} />)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {(!item.resources || item.resources.length === 0) && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <BookOpen className="h-12 w-12 text-zinc-700 mb-3" />
                          <p className="text-sm font-medium text-zinc-500">No resources yet</p>
                          <p className="text-xs text-zinc-600 mt-1">Add resource URLs in the roadmap JSON.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Empty State ─── */
function TimelineEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 ring-1 ring-indigo-500/20">
        <Play width={32} height={32} className="text-indigo-400" />
      </div>
      <h2 className="text-2xl font-bold text-white">No Roadmap Yet</h2>
      <p className="mt-3 max-w-md text-zinc-400">Complete a skill analysis to generate your personalized learning roadmap with step-by-step progress tracking.</p>
      <Link href="/skill-input" className="mt-8 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-indigo-900/30 transition-all hover:scale-105 active:scale-95">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Create Roadmap
      </Link>
    </div>
  );
}

/* ─── Fallback Data ─── */
const enhancedFallbackRoadmap: RoadmapItem[] = [
  {
    skill: "Python",
    learning_steps: ["Python Basics", "Data Types & Variables", "Functions & OOP", "Libraries & Frameworks"],
    estimated_time: "6 weeks",
    resources: [
      { title: "Python Tutorial For Beginners (Complete)", type: "youtube", url: "https://www.youtube.com/watch?v=7wnove7K-ZQ&list=PLu0W_9lII9agwh1XjRt242xIpHhPT2llg", duration: "8+ Hours", channel: "Code With Harry" },
      { title: "Python Cheatsheet", type: "cheatsheet", url: "YOUR_CHEATSHEET_URL", duration: "PDF" },
      { title: "Python Notes", type: "notes", url: "YOUR_NOTES_URL", duration: "Notes" },
    ],
  },
  {
    skill: "System Design",
    learning_steps: ["Scalability Concepts", "Load Balancing", "Database Sharding", "Caching Strategies"],
    estimated_time: "6 weeks",
    resources: [
      { title: "System Design Cheatsheet", type: "cheatsheet", url: "YOUR_CHEATSHEET_URL", duration: "PDF" },
      { title: "System Design Notes", type: "notes", url: "YOUR_NOTES_URL", duration: "Notes" },
    ],
  },
  {
    skill: "Machine Learning",
    learning_steps: ["Python for Data Science", "ML Algorithms", "Deep Learning", "Model Deployment"],
    estimated_time: "8 weeks",
    resources: [
      { title: "ML Cheatsheet", type: "cheatsheet", url: "YOUR_CHEATSHEET_URL", duration: "PDF" },
      { title: "ML Notes", type: "notes", url: "YOUR_NOTES_URL", duration: "Notes" },
    ],
  },
  {
    skill: "Docker & Kubernetes",
    learning_steps: ["Container Fundamentals", "Docker Compose", "Kubernetes Basics", "CI/CD Integration"],
    estimated_time: "4 weeks",
    resources: [
      { title: "Docker Cheatsheet", type: "cheatsheet", url: "YOUR_CHEATSHEET_URL", duration: "PDF" },
      { title: "Kubernetes Notes", type: "notes", url: "YOUR_NOTES_URL", duration: "Notes" },
    ],
  },
  {
    skill: "Advanced TypeScript",
    learning_steps: ["Generics", "Utility Types", "Branded Types", "Type-Safe APIs"],
    estimated_time: "3 weeks",
    resources: [
      { title: "TypeScript Cheatsheet", type: "cheatsheet", url: "YOUR_CHEATSHEET_URL", duration: "PDF" },
      { title: "TypeScript Notes", type: "notes", url: "YOUR_NOTES_URL", duration: "Notes" },
    ],
  },
];
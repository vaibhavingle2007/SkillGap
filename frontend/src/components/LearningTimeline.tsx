"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface LearningStep {
  step: string;
  description?: string;
}

export interface YoutubeVideo {
  title: string;
  video_id: string;
  thumbnail?: string;
}

export interface RoadmapItem {
  skill: string;
  learning_steps: string[] | LearningStep[];
  estimated_time: string;
  youtube_videos?: YoutubeVideo[];
}

export interface RoadmapResponse {
  roadmap: RoadmapItem[];
  target_role?: string;
}

const timeIcons: Record<string, string> = {
  week: "⏱️",
  weeks: "⏱️",
  month: "📅",
  months: "📅",
  hours: "🕐",
  hour: "🕐",
  day: "📆",
  days: "📆",
};

function getTimeIcon(time: string): string {
  const lower = time.toLowerCase();
  for (const [key, icon] of Object.entries(timeIcons)) {
    if (lower.includes(key)) return icon;
  }
  return "⏱️";
}

function getStepText(step: string | LearningStep): string {
  return typeof step === "string" ? step : step.step;
}

function getStepDescription(step: string | LearningStep): string | undefined {
  return typeof step === "string" ? undefined : step.description;
}

function SkeletonLoader() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-5 w-5 rounded-full bg-zinc-800 animate-pulse" />
            {i < 4 && <div className="w-0.5 flex-1 bg-zinc-800 animate-pulse" />}
          </div>
          <div className="mb-6 flex-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="h-5 w-40 rounded bg-zinc-800 animate-pulse" />
            <div className="mt-3 h-3 w-24 rounded bg-zinc-800 animate-pulse" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded bg-zinc-800/50 animate-pulse" />
              <div className="h-3 w-3/4 rounded bg-zinc-800/50 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-zinc-800/50 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LearningTimeline() {
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [targetRole, setTargetRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    setIsLoading(true);
    setError(null);

    const stored = sessionStorage.getItem("skillforge_analysis");

    // No prior analysis — show sample data instantly
    if (!stored) {
      setRoadmap(fallbackRoadmap);
      setTargetRole("Full-Stack Developer");
      setError("Complete a skill analysis first for a personalized roadmap. Showing sample data.");
      setIsLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      const skills = parsed.skills || [];
      const target_role = parsed.target_role || "Full-Stack Developer";

      const res = await fetch(`${API_BASE}/learning-roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, target_role }),
      });

      if (!res.ok) {
        throw new Error(`Server error (${res.status})`);
      }

      const data: RoadmapResponse = await res.json();
      setRoadmap(data.roadmap || []);
      setTargetRole(data.target_role || target_role);
    } catch {
      setError("Could not load roadmap from backend. Showing sample data.");
      setRoadmap(fallbackRoadmap);
      setTargetRole("Full-Stack Developer");
    } finally {
      setIsLoading(false);
    }
  };

  const totalSteps = roadmap.reduce(
    (sum, item) => sum + (Array.isArray(item.learning_steps) ? item.learning_steps.length : 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Learning Roadmap</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {targetRole
            ? `Your personalized path to becoming a ${targetRole}`
            : "Your personalized learning journey"}
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="animate-fade-in flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-900/10 px-4 py-3">
          <span className="mt-0.5 text-amber-400">⚠️</span>
          <div>
            <p className="text-sm text-amber-300">{error}</p>
            <button
              onClick={fetchRoadmap}
              className="mt-1 text-xs font-medium text-teal-400 underline-offset-2 hover:underline"
            >
              Retry connection
            </button>
          </div>
        </div>
      )}

      {/* Overall Stats Bar */}
      {!isLoading && roadmap.length > 0 && (
        <div className="animate-fade-in-up grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-900/30 text-lg">🎯</span>
              <div>
                <p className="text-xl font-bold text-white">{roadmap.length}</p>
                <p className="text-xs text-zinc-500">Skills to Learn</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-900/30 text-lg">📋</span>
              <div>
                <p className="text-xl font-bold text-white">{totalSteps}</p>
                <p className="text-xs text-zinc-500">Learning Steps</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-900/30 text-lg">⏱️</span>
              <div>
                <p className="text-xl font-bold text-white">
                  {roadmap.map((r) => r.estimated_time).join(", ").length > 30
                    ? `${roadmap.length} phases`
                    : roadmap.map((r) => r.estimated_time).join(" + ")}
                </p>
                <p className="text-xs text-zinc-500">Estimated Total</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-3xl">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="relative space-y-0">
            {roadmap.map((item, idx) => {
              const isExpanded = expandedIndex === idx;
              const isLast = idx === roadmap.length - 1;
              const staggerClass = idx < 6 ? `stagger-${idx + 1}` : "";

              return (
                <div key={idx} className={`animate-fade-in-up ${staggerClass} relative flex gap-4`}>
                  {/* Timeline column */}
                  <div className="flex flex-col items-center">
                    {/* Step number node */}
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-teal-500/40 bg-zinc-900 text-xs font-bold text-teal-400">
                      {idx + 1}
                    </div>
                    {/* Connecting line */}
                    {!isLast && (
                      <div className="w-0.5 flex-1 bg-gradient-to-b from-teal-500/40 to-zinc-700/40" />
                    )}
                  </div>

                  {/* Card content */}
                  <div className="mb-6 flex-1 pb-1">
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? -1 : idx)}
                      className="card-glow w-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 text-left transition-all hover:border-zinc-700"
                    >
                      {/* Card header */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-white">{item.skill}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-900/25 px-2.5 py-1 text-xs font-medium text-teal-300">
                            {getTimeIcon(item.estimated_time)} {item.estimated_time}
                          </span>
                          <svg
                            className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>

                      {/* Step count preview */}
                      <p className="mt-1.5 text-xs text-zinc-500">
                        {item.learning_steps.length} learning step{item.learning_steps.length !== 1 ? "s" : ""}
                        {item.youtube_videos && item.youtube_videos.length > 0 && (
                          <span> · {item.youtube_videos.length} video{item.youtube_videos.length !== 1 ? "s" : ""}</span>
                        )}
                      </p>

                      {/* Expanded: Learning Steps + Videos */}
                      {isExpanded && (
                        <div className="mt-4 border-t border-zinc-800 pt-4" onClick={(e) => e.stopPropagation()}>
                          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            Learning Steps
                          </h4>
                          <ol className="space-y-3">
                            {item.learning_steps.map((step, sIdx) => (
                              <li key={sIdx} className="flex gap-3">
                                {/* Step indicator */}
                                <div className="flex flex-col items-center pt-0.5">
                                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-400">
                                    {sIdx + 1}
                                  </div>
                                  {sIdx < item.learning_steps.length - 1 && (
                                    <div className="mt-1 w-px flex-1 bg-zinc-800" />
                                  )}
                                </div>

                                {/* Step content */}
                                <div className="flex-1 pb-1">
                                  <p className="text-sm leading-relaxed text-zinc-200">
                                    {getStepText(step)}
                                  </p>
                                  {getStepDescription(step) && (
                                    <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                                      {getStepDescription(step)}
                                    </p>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ol>

                          {/* YouTube Videos */}
                          {item.youtube_videos && item.youtube_videos.length > 0 && (
                            <div className="mt-5 border-t border-zinc-800 pt-4">
                              <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444" className="shrink-0">
                                  <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.56 9.38.56 9.38.56s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.55 15.5V8.5l6.27 3.5-6.27 3.5z" />
                                </svg>
                                Recommended Videos
                              </h4>
                              <div className="grid gap-3 sm:grid-cols-2">
                                {item.youtube_videos.map((video, vIdx) => {
                                  const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`;
                                  const watchUrl = `https://www.youtube.com/watch?v=${video.video_id}`;

                                  return (
                                    <div
                                      key={vIdx}
                                      className="group overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800/40 transition-all hover:border-zinc-700 hover:bg-zinc-800/60"
                                    >
                                      {/* Thumbnail */}
                                      <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                                        <img
                                          src={thumbnailUrl}
                                          alt={video.title}
                                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                          loading="lazy"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.parentElement!.classList.add('yt-thumb-fallback');
                                          }}
                                        />
                                        {/* Play overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 shadow-lg shadow-red-900/40">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                              <polygon points="5 3 19 12 5 21 5 3" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Info + Watch */}
                                      <div className="flex items-center gap-3 p-3">
                                        <div className="min-w-0 flex-1">
                                          <p className="truncate text-sm font-medium text-zinc-200 group-hover:text-white">
                                            {video.title}
                                          </p>
                                        </div>
                                        <a
                                          href={watchUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-red-600/15 px-3 py-1.5 text-xs font-semibold text-red-400 ring-1 ring-red-500/20 transition-all hover:bg-red-600/25 hover:text-red-300"
                                        >
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                          </svg>
                                          Watch
                                        </a>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {!isLoading && roadmap.length > 0 && (
        <div className="animate-fade-in-up mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Ready to start learning?</p>
              <p className="text-xs text-zinc-500">Head to the Dashboard to track your progress as you complete each step.</p>
            </div>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/20 transition-all hover:shadow-lg hover:brightness-110"
            >
              Go to Dashboard
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// Fallback data when backend is unavailable
const fallbackRoadmap: RoadmapItem[] = [
  {
    skill: "System Design",
    learning_steps: [
      "Learn about scalability concepts (horizontal vs vertical scaling)",
      "Study load balancing strategies and reverse proxies",
      "Understand database sharding and replication patterns",
      "Practice designing real systems (URL shortener, chat app, news feed)",
      "Review case studies from tech companies (Netflix, Uber, Twitter)",
    ],
    estimated_time: "6 weeks",
    youtube_videos: [
      { title: "System Design for Beginners", video_id: "MbjObHmDbZo" },
      { title: "Scalability & System Design for Developers", video_id: "uw-gcK9bjkk" },
    ],
  },
  {
    skill: "Machine Learning",
    learning_steps: [
      "Master Python fundamentals for data science (NumPy, Pandas)",
      "Learn core ML algorithms: linear regression, decision trees, SVM",
      "Study neural networks and deep learning with TensorFlow/PyTorch",
      "Practice on real datasets from Kaggle competitions",
      "Build and deploy an end-to-end ML model pipeline",
    ],
    estimated_time: "8 weeks",
    youtube_videos: [
      { title: "Machine Learning Course for Beginners", video_id: "NWONeJKn6kc" },
      { title: "PyTorch for Deep Learning - Full Course", video_id: "V_xro1bcAuA" },
      { title: "TensorFlow 2.0 Complete Course", video_id: "tPYj3fFJGjk" },
    ],
  },
  {
    skill: "Data Visualization",
    learning_steps: [
      "Learn data visualization principles and storytelling with data",
      "Master Matplotlib and Seaborn for static visualizations",
      "Build interactive dashboards with Plotly and Dash",
      "Create a portfolio project with real-world data visualization",
    ],
    estimated_time: "3 weeks",
    youtube_videos: [
      { title: "Data Visualization with Python - Full Course", video_id: "EljpXTh-hKs" },
      { title: "Matplotlib Tutorial (2024)", video_id: "3Xc3CA655Y4" },
    ],
  },
  {
    skill: "Docker & Containerization",
    learning_steps: [
      "Understand containers vs VMs and Docker architecture",
      "Write Dockerfiles and build custom images",
      "Use Docker Compose for multi-container applications",
      "Learn container orchestration basics with Kubernetes",
    ],
    estimated_time: "3 weeks",
    youtube_videos: [
      { title: "Docker Crash Course for Absolute Beginners", video_id: "pg19Z8LL06w" },
      { title: "Kubernetes Tutorial for Beginners", video_id: "X48VuDVv0do" },
    ],
  },
  {
    skill: "TypeScript Advanced",
    learning_steps: [
      "Master generics, conditional types, and mapped types",
      "Learn utility types and type inference patterns",
      "Build type-safe APIs with Zod validation",
      "Implement advanced patterns: branded types, discriminated unions",
    ],
    estimated_time: "2 weeks",
    youtube_videos: [
      { title: "TypeScript Full Course for Beginners", video_id: "30LWjhZzg50" },
      { title: "Advanced TypeScript - Matt Pocock", video_id: "F7O4gA0GXqI" },
    ],
  },
];

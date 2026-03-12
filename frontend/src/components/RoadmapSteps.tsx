"use client";

import { useState } from "react";
import { roadmapSteps } from "@/data/mockData";

const statusConfig = {
  completed: {
    line: "bg-teal-500",
    dot: "bg-teal-500 ring-teal-500/20",
    badge: "bg-teal-900/30 text-teal-400",
    label: "Completed",
  },
  "in-progress": {
    line: "bg-teal-500",
    dot: "bg-amber-500 ring-amber-500/20 animate-pulse",
    badge: "bg-amber-900/30 text-amber-400",
    label: "In Progress",
  },
  upcoming: {
    line: "bg-zinc-700",
    dot: "bg-zinc-600 ring-zinc-600/20",
    badge: "bg-zinc-800 text-zinc-400",
    label: "Upcoming",
  },
};

const difficultyColors = {
  Beginner: "text-emerald-400 bg-emerald-900/30",
  Intermediate: "text-amber-400 bg-amber-900/30",
  Advanced: "text-red-400 bg-red-900/30",
};

export default function RoadmapSteps() {
  const [expandedStep, setExpandedStep] = useState<string | null>("step-2");

  return (
    <div className="relative space-y-0">
      {roadmapSteps.map((step, idx) => {
        const config = statusConfig[step.status];
        const isExpanded = expandedStep === step.id;
        const isLast = idx === roadmapSteps.length - 1;

        return (
          <div key={step.id} className={`animate-fade-in-up stagger-${idx + 1} relative flex gap-4`}>
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className={`relative z-10 h-4 w-4 rounded-full ring-4 ${config.dot}`}>
                {step.status === "completed" && (
                  <svg className="absolute -left-[2px] -top-[2px] h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 ${config.line}`} />
              )}
            </div>

            {/* Content */}
            <div className="mb-6 flex-1 pb-2">
              <button
                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                className="card-glow w-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-left transition-all hover:border-zinc-700"
              >
                {/* Step header */}
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${config.badge}`}>
                    {config.label}
                  </span>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${difficultyColors[step.difficulty]}`}>
                    {step.difficulty}
                  </span>
                  <span className="ml-auto text-xs text-zinc-500">
                    {step.estimatedWeeks}w
                  </span>
                  <svg
                    className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Progress bar for in-progress */}
                {step.status === "in-progress" && (
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-zinc-500">Progress</span>
                      <span className="font-medium text-amber-400">{step.progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="relative h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                        style={{ width: `${step.progress}%` }}
                      >
                        <div className="progress-shimmer absolute inset-0" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-4 space-y-4 border-t border-zinc-800 pt-4">
                    <p className="text-sm leading-relaxed text-zinc-400">{step.description}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {step.skills.map((skill) => (
                        <span key={skill} className="rounded-md border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 text-[11px] text-zinc-300">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* YouTube resources */}
                    {step.youtubeResources.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          Recommended Videos
                        </h4>
                        <div className="space-y-2">
                          {step.youtubeResources.map((yt) => (
                            <a
                              key={yt.id}
                              href={yt.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 rounded-lg bg-zinc-800/60 p-2.5 transition-colors hover:bg-zinc-800"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex h-9 w-14 shrink-0 items-center justify-center rounded-md bg-red-600/20">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444">
                                  <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-zinc-200">{yt.title}</p>
                                <p className="text-[10px] text-zinc-500">
                                  {yt.channel} · {yt.duration} · {yt.views} views
                                </p>
                              </div>
                            </a>
                          ))}
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
  );
}

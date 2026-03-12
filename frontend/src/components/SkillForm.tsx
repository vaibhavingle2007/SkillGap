"use client";

import { useState } from "react";
import { jobRoles } from "@/data/mockData";
import AnalysisResults, { AnalysisResponse } from "./AnalysisResults";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const predefinedSkills = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL",
  "Docker", "AWS", "Machine Learning", "Data Visualization",
  "System Design", "Git", "CSS", "HTML", "Java", "C++",
  "Kubernetes", "TensorFlow", "PyTorch", "Redis",
  "PostgreSQL", "MongoDB", "GraphQL", "REST API",
];

export default function SkillForm() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResponse | null>(null);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
    if (!skillLevels[skill]) {
      setSkillLevels((prev) => ({ ...prev, [skill]: 50 }));
    }
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
      setSkillLevels((prev) => ({ ...prev, [trimmed]: 50 }));
      setCustomSkill("");
    }
  };

  const updateLevel = (skill: string, level: number) => {
    setSkillLevels((prev) => ({ ...prev, [skill]: level }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    const role = jobRoles.find((r) => r.id === selectedRole);

    const payload = {
      skills: selectedSkills.map((skill) => ({
        name: skill,
        level: skillLevels[skill] || 50,
      })),
      target_role: role?.title || selectedRole,
    };

    // Persist for roadmap page
    sessionStorage.setItem("skillforge_analysis", JSON.stringify(payload));

    try {
      const res = await fetch(`${API_BASE}/analyze-skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Server error (${res.status}): ${errBody}`);
      }

      const data: AnalysisResponse = await res.json();
      setResults({
        ...data,
        target_role: role?.title || selectedRole,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error occurred";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetResults = () => {
    setResults(null);
    setError(null);
  };

  const isValid = selectedSkills.length >= 2 && selectedRole;

  // Show results if available
  if (results) {
    return (
      <div className="space-y-6">
        <button
          onClick={resetResults}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Form
        </button>
        <AnalysisResults data={results} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Job Role Selection */}
      <section className="animate-fade-in-up">
        <h2 className="mb-1 text-lg font-semibold text-white">Target Job Role</h2>
        <p className="mb-4 text-sm text-zinc-400">Select the career role you&apos;re aiming for</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {jobRoles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`card-glow group rounded-xl border p-4 text-left transition-all duration-200 ${
                selectedRole === role.id
                  ? "border-teal-500/50 bg-teal-600/10"
                  : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{role.title}</h3>
                  <p className="mt-0.5 text-xs text-zinc-500">{role.category}</p>
                </div>
                {selectedRole === role.id && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 animate-scale-in">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-400">
                  {role.avgSalary}
                </span>
                <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                  role.demand === "High"
                    ? "bg-emerald-900/40 text-emerald-400"
                    : "bg-amber-900/40 text-amber-400"
                }`}>
                  {role.demand} Demand
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Skill Selection */}
      <section className="animate-fade-in-up stagger-2">
        <h2 className="mb-1 text-lg font-semibold text-white">Your Current Skills</h2>
        <p className="mb-4 text-sm text-zinc-400">
          Select skills you already have ({selectedSkills.length} selected, minimum 2)
        </p>

        {/* Custom skill input */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
            placeholder="Add a custom skill..."
            className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20"
          />
          <button
            onClick={addCustomSkill}
            className="rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            Add
          </button>
        </div>

        {/* Skill chips */}
        <div className="flex flex-wrap gap-2">
          {predefinedSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                selectedSkills.includes(skill)
                  ? "border-teal-500/40 bg-teal-600/15 text-teal-300"
                  : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
              }`}
            >
              {selectedSkills.includes(skill) && (
                <span className="mr-1.5 inline-block text-teal-400">✓</span>
              )}
              {skill}
            </button>
          ))}
        </div>
      </section>

      {/* Skill Levels */}
      {selectedSkills.length > 0 && (
        <section className="animate-fade-in-up stagger-3">
          <h2 className="mb-1 text-lg font-semibold text-white">Rate Your Proficiency</h2>
          <p className="mb-4 text-sm text-zinc-400">Drag the sliders to set your current skill level</p>

          <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            {selectedSkills.map((skill) => (
              <div key={skill} className="group">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-200">{skill}</span>
                  <span className="text-sm font-bold text-teal-400">
                    {skillLevels[skill] || 50}%
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skillLevels[skill] || 50}
                    onChange={(e) => updateLevel(skill, parseInt(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-teal-500 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:shadow-teal-500/30 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
                  />
                  <div
                    className="pointer-events-none absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-400"
                    style={{ width: `${skillLevels[skill] || 50}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-zinc-600">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Error message */}
      {error && (
        <div className="animate-fade-in rounded-xl border border-red-500/20 bg-red-900/10 p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] text-red-400">!</span>
            <div>
              <p className="text-sm font-medium text-red-400">Analysis Failed</p>
              <p className="mt-0.5 text-xs text-red-400/70">{error}</p>
              <p className="mt-2 text-xs text-zinc-500">
                Make sure the backend is running at <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[11px] text-zinc-400">{API_BASE}</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="animate-fade-in-up stagger-4 flex items-center gap-4 pt-2">
        <button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className={`relative rounded-xl px-8 py-3 text-sm font-semibold transition-all duration-300 ${
            isValid && !isLoading
              ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-900/30 hover:shadow-xl hover:shadow-teal-900/40 hover:brightness-110"
              : "cursor-not-allowed bg-zinc-800 text-zinc-500"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" strokeLinecap="round" />
              </svg>
              Analyzing...
            </span>
          ) : (
            "Analyze My Skills →"
          )}
        </button>
        {!isValid && !isLoading && (
          <p className="text-xs text-zinc-500">
            {!selectedRole
              ? "Select a target job role"
              : "Select at least 2 skills"}
          </p>
        )}
      </div>
    </div>
  );
}

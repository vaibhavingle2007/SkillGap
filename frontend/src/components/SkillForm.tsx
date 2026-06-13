"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnalysisResults, { AnalysisResponse } from "./AnalysisResults";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { saveUserAnalysis } from "@/lib/userData";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchedJobRole {
  id: string;
  title: string;
  category: string;
  avgSalary: string;
  demand: string;
}

const predefinedSkills = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL",
  "Docker", "AWS", "Machine Learning", "Data Visualization",
  "System Design", "Git", "CSS", "HTML", "Java", "C++",
  "Kubernetes", "TensorFlow", "PyTorch", "Redis",
  "PostgreSQL", "MongoDB", "GraphQL", "REST API",
];

const roleIcons: Record<string, string> = {
  "fullstack-developer": "💻",
  "ml-engineer": "🤖",
  "data-scientist": "📊",
  "devops-engineer": "🚀",
  "frontend-developer": "🎨",
  "backend-developer": "⚙️",
};

export default function SkillForm() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [savedToCloud, setSavedToCloud] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [jobRoles, setJobRoles] = useState<FetchedJobRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);

  const { user } = useAuth();
  const { setAnalysis, setRoadmap } = useData();
  const router = useRouter();

  // Fetch job roles from backend on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${API_BASE}/job-roles`);
        if (!res.ok) throw new Error(`Failed to fetch roles (${res.status})`);
        const data: FetchedJobRole[] = await res.json();
        setJobRoles(data);
      } catch (err) {
        setRolesError(err instanceof Error ? err.message : "Failed to load job roles");
      } finally {
        setRolesLoading(false);
      }
    };
    fetchRoles();
  }, []);

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

  const removeSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const updateLevel = (skill: string, level: number) => {
    setSkillLevels((prev) => ({ ...prev, [skill]: level }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setSavedToCloud(false);
    setSaveError(null);

    const role = jobRoles.find((r) => r.id === selectedRole);

    const payload = {
      skills: selectedSkills.map((skill) => ({
        name: skill,
        level: skillLevels[skill] || 50,
      })),
      target_role: role?.title || selectedRole,
    };

    sessionStorage.setItem("skillgap_analysis", JSON.stringify(payload));

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

      const data = await res.json();
      const targetRoleName = role?.title || selectedRole;

      /* Normalise to the shape both AnalysisResults and the dashboard expect */
      const normalized = {
        target_role: targetRoleName,
        match_percentage: data.match_percentage ?? data.skill_gap_score ?? 0,
        missing_skills: data.missing_skills || [],
        matched_skills: data.matched_skills || [],
        skill_gaps: (data.missing_skills || []).map((name: string) => ({
          skill_name: name,
          required_proficiency: "intermediate",
          current_proficiency: null,
          gap_level: "missing" as const,
        })),
        met_skills: (data.matched_skills || []).map((name: string) => ({
          skill_name: name,
          required_proficiency: "intermediate",
          current_proficiency: "intermediate",
          gap_level: "met" as const,
        })),
        skill_gap_score: data.skill_gap_score,
      };
      setResults(normalized);
      setAnalysis(normalized);

      if (user) {
        try {
          const skills = selectedSkills.map((skill) => ({
            name: skill,
            level: skillLevels[skill] || 50,
          }));
          const matchPct = normalized.match_percentage ?? 0;

          await saveUserAnalysis(user, {
            targetRole: targetRoleName,
            skills,
            matchPercentage: matchPct,
            missingSkills: data.missing_skills || [],
            matchedSkills: data.matched_skills || [],
          });
          setSavedToCloud(true);
        } catch (saveErr) {
          console.error("Failed to save to cloud:", saveErr);
          setSaveError(saveErr instanceof Error ? saveErr.message : "Failed to save to cloud");
        }
      }

      /* Also fetch the roadmap so the dashboard is ready */
      try {
        const roadmapRes = await fetch(`${API_BASE}/learning-roadmap`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (roadmapRes.ok) {
          const roadmapData = await roadmapRes.json();
          setRoadmap(roadmapData);
        }
      } catch (e) {
        console.error("Failed to fetch roadmap:", e);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const resetResults = () => {
    setResults(null);
    setError(null);
  };

  const isValid = selectedSkills.length >= 2 && selectedRole;

  if (results) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={resetResults}
            className="group inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-2.5 text-sm font-bold text-zinc-400 transition-all hover:border-zinc-700 hover:text-white"
          >
            <svg className="transition-transform group-hover:-translate-x-1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Modify Selection
          </button>
          <button
            onClick={() => router.push("/roadmap")}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-indigo-900/30 transition-all hover:shadow-2xl hover:shadow-indigo-900/40 hover:-translate-y-0.5 active:scale-95"
          >
            Go to Roadmap
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
        <AnalysisResults data={results} />
        {savedToCloud && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-4 backdrop-blur-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-sm font-medium text-emerald-300/80">Analysis secured to your profile.</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      {/* Job Role Selection */}
      <section className="animate-fade-in-up">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Select Target Role</h2>
          <p className="text-sm text-zinc-500 mt-1">Choose the career path you want to analyze</p>
        </div>

        {rolesLoading && (
          <div className="flex items-center justify-center py-12 rounded-2xl border border-zinc-800/50 bg-zinc-900/40">
            <svg className="h-5 w-5 animate-spin text-indigo-400 mr-3" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" strokeLinecap="round" />
            </svg>
            <span className="text-sm text-zinc-400">Loading career paths...</span>
          </div>
        )}

        {rolesError && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-4 text-sm text-red-300">
            {rolesError}
          </div>
        )}

        {!rolesLoading && !rolesError && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobRoles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`group relative flex flex-col items-start rounded-2xl p-6 text-left transition-all duration-500 ${
                selectedRole === role.id
                  ? "border-indigo-500/50 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/20"
                  : "glass-card border-zinc-800/50 hover:border-zinc-700 hover:-translate-y-0.5"
              }`}
            >
              {selectedRole === role.id && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-transparent to-indigo-500/5" />
              )}

              <div className="mb-4 flex w-full items-start justify-between">
                <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${
                  selectedRole === role.id
                    ? "bg-gradient-to-br from-indigo-500 to-indigo-400 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-zinc-800/50 text-zinc-400 group-hover:bg-zinc-700"
                }`}>
                  <span className="text-2xl">{roleIcons[role.id] || "💼"}</span>
                  {selectedRole === role.id && (
                    <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg animate-scale-in">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>

                <span className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  role.demand === "High" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                }`}>
                  {role.demand} Demand
                </span>
              </div>

              <h3 className="text-base font-bold text-white tracking-tight relative z-10">{role.title}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1 relative z-10">{role.category}</p>

              <div className="mt-6 flex w-full items-center justify-between border-t border-zinc-800/50 pt-4 relative z-10">
                <span className="text-[10px] font-bold text-zinc-400">{role.avgSalary}</span>
                <span className={`text-[10px] font-bold transition-all ${
                  selectedRole === role.id ? "text-indigo-400" : "text-zinc-500"
                }`}>
                  {selectedRole === role.id ? "Selected" : "Select →"}
                </span>
              </div>
            </button>
          ))}
        </div>
        )}
      </section>

      {/* Skill Selection with Tags */}
      <section className="animate-fade-in-up stagger-2">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Your Current Skills</h2>
          <p className="text-sm text-zinc-500 mt-1">Select at least 2 skills you currently possess</p>
        </div>

        {/* Glassmorphism Card */}
        <div className="glass-card rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 lg:p-8">
          {/* Selected Skills Tags */}
          {selectedSkills.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2.5">
              {selectedSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/40 hover:text-white transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Field */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
                placeholder="Type a skill and press Enter to add..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-5 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-indigo-500/40 focus:ring-4 focus:ring-indigo-500/5"
              />
            </div>
            <button
              onClick={addCustomSkill}
              className="rounded-xl bg-zinc-800 px-6 py-3 text-sm font-bold text-zinc-300 transition-all hover:bg-zinc-700 hover:text-white active:scale-95"
            >
              Add
            </button>
          </div>

          {/* Predefined Skills Grid */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {predefinedSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`group relative flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  selectedSkills.includes(skill)
                    ? "border-indigo-500/50 bg-gradient-to-r from-indigo-500/20 to-indigo-500/10 text-indigo-300 shadow-lg shadow-indigo-500/10 scale-105"
                    : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 hover:scale-105 hover:shadow-lg"
                }`}
              >
                <span className={`text-base transition-transform duration-300 ${
                  selectedSkills.includes(skill) ? "scale-110" : "group-hover:scale-110"
                }`}>
                  {selectedSkills.includes(skill) ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  )}
                </span>
                {skill}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Proficiency Sliders */}
      {selectedSkills.length > 0 && (
        <section className="animate-fade-in-up stagger-3">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Rate Proficiency</h2>
            <p className="text-sm text-zinc-500 mt-1">Set your mastery level for each skill</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {selectedSkills.map((skill) => (
              <div key={skill} className="glass-card group rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 transition-all hover:border-zinc-700">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{skill}</span>
                  <span className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-400">
                    {skillLevels[skill] || 50}%
                  </span>
                </div>

                <div className="relative flex h-6 items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skillLevels[skill] || 50}
                    onChange={(e) => updateLevel(skill, parseInt(e.target.value))}
                    className="z-10 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-indigo-500 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(99,102,241,0.5)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
                  />
                  <div
                    className="absolute left-0 top-[9px] h-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.3)] transition-all duration-300"
                    style={{ width: `${skillLevels[skill] || 50}%` }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                  <span>Novice</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-800/60 bg-zinc-950/80 p-6 backdrop-blur-xl lg:left-64">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-6">
          <div className="hidden sm:block">
            {isValid ? (
              <p className="text-sm font-medium text-zinc-400 italic">Ready to see your personalized career analysis?</p>
            ) : (
              <p className="text-sm font-medium text-zinc-500 italic">
                {!selectedRole ? "Please select a target role" : `Select ${Math.max(0, 2 - selectedSkills.length)} more skills`}
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className={`relative flex items-center justify-center gap-3 rounded-2xl px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
              isValid && !isLoading
                ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-900/30 hover:shadow-2xl hover:shadow-indigo-900/40 hover:-translate-y-1 active:scale-95"
                : "cursor-not-allowed bg-zinc-800 text-zinc-500"
            }`}
          >
            {isLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" strokeLinecap="round" />
                </svg>
                Processing...
              </>
            ) : (
              <>Save & Run Analysis →</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
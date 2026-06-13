"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AnalysisSkill {
  skill_name: string;
  required_proficiency: string;
  current_proficiency: string | null;
  gap_level: "missing" | "needs_improvement" | "met";
}

export interface AnalysisResponse {
  target_role: string;
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  skill_gaps: AnalysisSkill[];
  met_skills: AnalysisSkill[];
  skill_gap_score?: number;
}

export interface RoadmapItem {
  skill: string;
  learning_steps: string[];
  estimated_time: string;
  youtube_videos?: { title: string; video_id: string; thumbnail?: string | null }[];
}

export interface RoadmapResponse {
  roadmap: RoadmapItem[];
  target_role?: string;
}

interface DataStateValue {
  analysis: AnalysisResponse | null;
  roadmap: RoadmapResponse | null;
  cachedAt: string | null;
  authView: "signin" | "signup";
  toggleAuthView: () => void;
  setAnalysis: (val: AnalysisResponse | null) => void;
  setRoadmap: (val: RoadmapResponse | null) => void;
}

const defaultValue: DataStateValue = {
  analysis: null,
  roadmap: null,
  cachedAt: null,
  authView: "signin",
  toggleAuthView: () => {},
  setAnalysis: () => {},
  setRoadmap: () => {},
};

const DataContext = createContext<DataStateValue>(defaultValue);

export function DataProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysisState] = useState<AnalysisResponse | null>(null);
  const [roadmap, setRoadmapState] = useState<RoadmapResponse | null>(null);
  const [cachedAt, setCachedAt] = useState<string | null>(null);
  const [authView, setAuthView] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    try {
      const cachedAnalysis = sessionStorage.getItem("skillgap_cached_analysis");
      if (cachedAnalysis) setAnalysisState(JSON.parse(cachedAnalysis));

      const cachedRoadmap = sessionStorage.getItem("skillgap_cached_roadmap");
      if (cachedRoadmap) setRoadmapState(JSON.parse(cachedRoadmap));
    } catch {
      // ignore corrupt sessionStorage
    }
  }, []);

  const setAnalysis = (val: AnalysisResponse | null) => {
    setAnalysisState(val);
    if (val) sessionStorage.setItem("skillgap_cached_analysis", JSON.stringify(val));
    else sessionStorage.removeItem("skillgap_cached_analysis");
  };

  const setRoadmap = (val: RoadmapResponse | null) => {
    setRoadmapState(val);
    setCachedAt(new Date().toISOString());
    if (val) sessionStorage.setItem("skillgap_cached_roadmap", JSON.stringify(val));
    else sessionStorage.removeItem("skillgap_cached_roadmap");
  };

  const toggleAuthView = () => setAuthView((v) => (v === "signin" ? "signup" : "signin"));

  return (
    <DataContext.Provider
      value={{
        analysis,
        roadmap,
        cachedAt,
        authView,
        toggleAuthView,
        setAnalysis,
        setRoadmap,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
};

export { DataContext };

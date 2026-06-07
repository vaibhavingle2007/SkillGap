"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      {/* Navigation - Floating */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 lg:px-12 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 shadow-lg shadow-indigo-500/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tighter text-white">SkillGap.AI</span>
        </div>

        <div className="flex items-center gap-4 pointer-events-auto">
          {!user ? (
            <>
              <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/login" className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-950 hover:bg-indigo-400 transition-all hover:scale-105 active:scale-95">
                Get Started
              </Link>
            </>
          ) : (
            <Link href="/dashboard" className="rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95 backdrop-blur-md">
              Dashboard
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-6 pt-32 pb-20 text-center lg:pt-48">
        {/* Glowing Background Orb */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
          <div className="absolute right-1/4 top-1/2 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl">
          {/* Badge */}
          <div className="animate-fade-in mb-8 inline-flex items-center gap-3 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-5 py-2 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">AI-Powered Career Intelligence</span>
          </div>

          <h1 className="animate-fade-in-up text-5xl font-black leading-[1.1] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Bridge your
            <span className="block mt-2 text-gradient">Skill Gap.</span>
          </h1>

          <p className="animate-fade-in-up stagger-2 mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-zinc-500 sm:text-xl">
            AI-powered analysis to identify your exact skill gaps and build a personalized learning roadmap to your dream career.
          </p>

          <div className="animate-fade-in-up stagger-3 mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <Link
              href={user ? "/skill-input" : "/login"}
              className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-10 py-5 text-sm font-bold uppercase tracking-widest text-white shadow-2xl shadow-indigo-900/40 transition-all hover:scale-105 hover:brightness-110 active:scale-95"
            >
              Start Your Analysis
              <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link
              href="/dashboard"
              className="glass-card flex items-center gap-3 rounded-2xl px-10 py-5 text-sm font-bold uppercase tracking-widest text-zinc-300 hover:text-white"
            >
              {user ? "Your Progress" : "Explore Dashboard"}
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="animate-fade-in-up stagger-4 relative z-10 mx-auto mt-24 grid max-w-6xl gap-6 px-4 sm:grid-cols-3">
          {[
            {
              title: "AI Analysis",
              desc: "Identify exact skill gaps against real-world industry requirements with pinpoint accuracy.",
              icon: "📊",
            },
            {
              title: "Learning Roadmap",
              desc: "Follow a curated, high-velocity learning path designed to get you hired in record time.",
              icon: "🗺️",
            },
            {
              title: "Curated Resources",
              desc: "Get hand-picked, world-class resources for every single skill gap.",
              icon: "📚",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass-card group flex flex-col items-start rounded-[2rem] border border-zinc-800/50 p-8 text-left transition-all hover:-translate-y-2"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-3xl shadow-glow">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-lg font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
              <p className="text-sm font-medium leading-relaxed text-zinc-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 mt-10 border-t border-zinc-800/40 bg-zinc-950/50 py-16 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-12 px-6 md:grid-cols-4">
          {[
            { value: "50+", label: "Target Roles" },
            { value: "2k+", label: "Verified Skills" },
            { value: "10k+", label: "Resources" },
            { value: "99.2%", label: "AI Accuracy" },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <p className="text-3xl font-black tracking-tighter text-white lg:text-4xl">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800/40 bg-zinc-950 px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight text-white">SkillGap.AI © 2026</span>
          </div>

          <div className="flex gap-8">
            {["Privacy", "Terms", "Support", "Twitter"].map((link) => (
              <a key={link} href="#" className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
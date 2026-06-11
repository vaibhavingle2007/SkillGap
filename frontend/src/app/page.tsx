"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import ParticleField from "@/components/landing/ParticleField";
import Reveal from "@/components/landing/Reveal";
import CountUp from "@/components/landing/CountUp";
import Magnetic from "@/components/landing/Magnetic";
import TiltCard from "@/components/landing/TiltCard";

/* ──────────────────────────── */
/*  Landing Page — Phase 1     */
/* ──────────────────────────── */

const features = [
  {
    title: "AI Analysis",
    desc: "Identify exact skill gaps against real-world industry requirements with pinpoint accuracy.",
    iconPath: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3",
  },
  {
    title: "Learning Roadmap",
    desc: "Follow a curated, high-velocity learning path designed to get you hired in record time.",
    iconPath: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13 5.447-2.724A1 1 0 0115 13v10.618a1 1 0 01-.553.894L9 17m0-13v13m0 0l-5.447 2.724A1 1 0 011 16.382V5.618a1 1 0 011.447-.894L9 7",
  },
  {
    title: "Curated Resources",
    desc: "Get hand-picked, world-class resources for every single skill gap.",
    iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 2.999 6.253 1.5 8.084 1.5 10s.557 3.523 1.5 4.5M12 6.253v13c0-1.113.832-2.127 2-2.923 1.168-.796 2.746-1.253 4.5-1.253s3.332.477 4.5 1.253c.243.177.46.385.643.614",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Map your skills",
    desc: "Tell us what you know. We'll benchmark it against real job requirements.",
    icon: "M9 7h6m0 10v-3m6 3h-4m-6 3V7m0 3h4M3 7h1m16 6h-1",
  },
  {
    step: "02",
    title: "See the gap",
    desc: "Get a precise gap analysis with matched and missing skills for your target role.",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  },
  {
    step: "03",
    title: "Follow the roadmap",
    desc: "Receive a personalized, step-by-step learning path with curated resources.",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13 5.447-2.724A1 1 0 0115 13v10.618a1 1 0 01-.553.894L9 17m0-13v13",
  },
];

const stats = [
  { value: 50, suffix: "+", label: "Target Roles" },
  { value: 2000, suffix: "+", label: "Verified Skills" },
  { value: 10, suffix: "k+", label: "Resources" },
  { value: 99.2, decimals: 1, suffix: "%", label: "AI Accuracy" },
];

const skills = [
  "React", "TypeScript", "Node.js", "Python", "SQL", "Docker",
  "AWS", "Kubernetes", "GraphQL", " Rust", "Next.js", "Postgres",
  "Redis", "MongoDB", "TensorFlow", "PyTorch", " Go", "Java",
  "System Design", "DevOps",
];

const testimonials = [
  {
    name: "Alex Chen",
    role: "ML Engineer @ Google",
    quote: "SkillForge identified gaps I didn't even know I had. Landed my dream role in 6 months.",
    initials: "AC",
    color: "from-indigo-500 to-purple-500",
  },
  {
    name: "Marcus Rivera",
    role: "Staff Engineer @ Stripe",
    quote: "The gap analysis was scarily accurate. The roadmap was the difference between stagnation and growth.",
    initials: "MR",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Sophie Okonkwo",
    role: "Frontend Lead @ Vercel",
    quote: "I went from mid-level to senior in under a year. This tool is genuinely transformative.",
    initials: "SO",
    color: "from-amber-500 to-orange-500",
  },
];

export default function Home() {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 140]);
  const heroOpacity = useTransform(scrollY, [0, 700], [1, 0.25]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-x-hidden" ref={containerRef}>
      {/* ── Navigation ── */}
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

      {/* ── Hero Section ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center lg:pt-48 min-h-screen">
        {/* Particle Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <ParticleField />
        </div>

        {/* Background orbs with parallax */}
        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
          <div className="absolute right-1/4 top-1/2 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[100px]" />
        </motion.div>

        <div className="relative z-10 max-w-4xl">
          {/* Badge */}
          <div className="animate-fade-in mb-8 inline-flex items-center gap-3 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-5 py-2 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">AI-Powered Career Intelligence</span>
          </div>

          {/* 3D Headline */}
          <h1
            className="text-5xl font-black leading-[1.1] tracking-tight text-white sm:text-7xl lg:text-8xl"
            style={{ perspective: 900 }}
          >
            {["Bridge", " your"].map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-3"
                initial={{ opacity: 0, y: 50, rotateX: 55 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            ))}
            <span className="block mt-2 text-gradient">Skill Gap.</span>
          </h1>

          <motion.p
            className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            AI-powered analysis to identify your exact skill gaps and build a personalized learning roadmap to your dream career.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Magnetic>
              <Link
                href={user ? "/skill-input" : "/login"}
                className="shimmer-border group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-10 py-5 text-sm font-bold uppercase tracking-widest text-white shadow-2xl shadow-indigo-900/40 transition-all hover:scale-105 hover:brightness-110 active:scale-95"
              >
                Start Your Analysis
                <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </Magnetic>
            <Link
              href="/dashboard"
              className="glass-card flex items-center gap-3 rounded-2xl px-10 py-5 text-sm font-bold uppercase tracking-widest text-zinc-300 hover:text-white"
            >
              {user ? "Your Progress" : "Explore Dashboard"}
            </Link>
          </motion.div>

          {/* Floating Skill Chips */}
          <div className="hidden lg:block" aria-hidden="true">
            {["React", "Python", "SQL", "AWS"].map((skill, i) => (
              <motion.div
                key={skill}
                className="absolute rounded-full border border-zinc-700/50 bg-zinc-900/80 px-4 py-2 text-xs font-bold text-zinc-400 backdrop-blur-md"
                style={{
                  top: `${20 + i * 18}%`,
                  right: i % 2 === 0 ? "10%" : "85%",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <span
                  className="animate-float inline-block"
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  {skill}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="relative z-10 mx-auto mt-24 grid max-w-6xl gap-6 px-4 sm:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <TiltCard className="h-full" glowColor="rgba(99, 102, 241, 0.15)" tiltStrength={6}>
                <div className="glass-card group flex h-full flex-col items-start rounded-[2rem] border border-zinc-800/50 p-8 text-left transition-all hover:-translate-y-2">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 shadow-glow">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={feature.iconPath} />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
                  <p className="text-sm font-medium leading-relaxed text-zinc-300">{feature.desc}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative z-10 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-px w-8 bg-zinc-700" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">How It Works</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Zero to hired, <span className="text-gradient">three steps.</span>
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {howItWorks.map((item, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="relative group">
                  {/* Connector line (desktop) */}
                  {i < howItWorks.length - 1 && (
                    <div className="hidden sm:block absolute top-8 left-full w-full h-px">
                      <div className="h-full bg-zinc-800 w-full origin-left" />
                    </div>
                  )}
                  <div className="glass-card relative rounded-2xl border border-zinc-800/50 p-6 text-center transition-all hover:border-indigo-500/30">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white text-xs font-black">
                      {item.step}
                    </div>
                    <div className="mt-4 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto shadow-glow">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.icon} />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-zinc-300 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 border-t border-b border-zinc-800/40 bg-zinc-950/50 py-20 overflow-hidden">
        <div className="bg-grid-lines absolute inset-0 [mask-image:radial-gradient(circle_at_center,black_40%,transparent_80%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="text-center space-y-2">
                  <p className="text-3xl font-mono font-black tracking-tighter text-white lg:text-4xl">
                    <CountUp value={stat.value} decimals={stat.decimals ?? 0} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills Marquee ── */}
      <section className="relative z-10 py-16 overflow-hidden" aria-hidden="true">
        <div className="relative max-w-full">
          <div className="flex animate-marquee w-max gap-4 hover:[animation-play-state:paused]">
            {[...skills, ...skills].map((skill, i) => (
              <span
                key={i}
                className="shrink-0 rounded-full border border-zinc-700/50 bg-zinc-900/50 px-5 py-2.5 text-sm font-bold text-zinc-400 backdrop-blur-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative z-10 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-px w-8 bg-zinc-700" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Testimonials</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl mb-16">
              Loved by <span className="text-gradient">early learners</span>
            </h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <TiltCard className="h-full" tiltStrength={6} glowColor="rgba(99, 102, 241, 0.1)">
                  <div className="glass-card group relative h-full rounded-2xl border border-zinc-800/50 p-6 transition-all hover:border-zinc-700">
                    <div className="mb-4 flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-white text-sm font-black`}>
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{t.name}</p>
                        <p className="text-xs text-zinc-400">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-300 italic">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="relative z-10 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="text-center mb-12">
              <div className="mb-4 inline-flex items-center gap-2">
                <span className="h-px w-8 bg-zinc-700" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Pricing</span>
                <span className="h-px w-8 bg-zinc-700" />
              </div>
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Simple, <span className="text-gradient">transparent</span> pricing
              </h2>
            </div>
          </Reveal>

          {/* Billing Toggle */}
          <Reveal delay={0.2}>
            <div className="mb-12 flex items-center justify-center gap-4">
              <button
                onClick={() => setBilling("monthly")}
                className={`relative rounded-full px-6 py-2 text-sm font-bold transition-all ${billing === "monthly" ? "text-white" : "text-zinc-500"}`}
              >
                {billing === "monthly" && (
                  <motion.span
                    layoutId="billing-pill"
                    className="absolute inset-0 rounded-full bg-zinc-800"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Monthly</span>
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={`relative rounded-full px-6 py-2 text-sm font-bold transition-all ${billing === "yearly" ? "text-white" : "text-zinc-500"}`}
              >
                {billing === "yearly" && (
                  <motion.span
                    layoutId="billing-pill"
                    className="absolute inset-0 rounded-full bg-zinc-800"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Yearly</span>
              </button>
            </div>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-2">
            {/* Free */}
            <Reveal delay={0.1}>
              <div className="glass-card rounded-2xl border border-zinc-800/50 p-8 text-center">
                <h3 className="text-lg font-bold text-white mb-2">Free</h3>
                <p className="text-4xl font-black text-white mb-1">$0</p>
                <p className="text-xs text-zinc-500 mb-6">Forever</p>
                <ul className="text-left text-sm text-zinc-300 space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    1 skill analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Basic roadmap
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Limited resources
                  </li>
                </ul>
                <Link href="/login" className="block w-full rounded-xl border border-zinc-700 py-3 text-sm font-bold uppercase tracking-widest text-zinc-300 hover:border-zinc-500 hover:text-white transition-all">
                  Get Started
                </Link>
              </div>
            </Reveal>

            {/* Pro */}
            <Reveal delay={0.2}>
              <div className="glass-card rounded-2xl border border-indigo-500/30 p-8 text-center relative overflow-hidden bg-gradient-to-br from-indigo-500/5 to-transparent">
                <div className="absolute top-4 right-4 rounded-full bg-indigo-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                  Most Popular
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Pro</h3>
                <p className="text-4xl font-black text-white mb-1">
                  {billing === "monthly" ? "$19" : "$180"}
                </p>
                <p className="text-xs text-zinc-500 mb-6">{billing === "monthly" ? "/ month" : "/ year (save 21%)"}</p>
                <ul className="text-left text-sm text-zinc-300 space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Unlimited analyses
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Detailed roadmaps
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Curated resources
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Progress tracking
                  </li>
                </ul>
                <Magnetic strength={0.1}>
                  <Link href="/login" className="shimmer-border block w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 text-sm font-bold uppercase tracking-widest text-white hover:brightness-110 transition-all">
                    Upgrade to Pro
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="relative z-10 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-xl">
          <Reveal>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl mb-3">
                Stay in the loop
              </h2>
              <p className="text-sm text-zinc-400">Get weekly career insights and skill gap trends.</p>
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            {!subscribed ? (
              <motion.form
                key="form"
                onSubmit={handleNewsletterSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="gradient-border-anim rounded-2xl p-1"
              >
                <div className="flex items-center gap-2 rounded-xl bg-zinc-950 p-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:brightness-110 transition-all"
                  >
                    Subscribe
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-emerald-300">You&apos;re subscribed! Check your inbox.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 mt-auto border-t border-zinc-800/40 bg-zinc-950 px-6 py-16">
        {/* Animated wave */}
        <div className="mb-12 overflow-hidden" aria-hidden="true">
          <div className="animate-marquee flex w-max">
            {[0, 1].map((i) => (
              <svg key={i} className="h-12 w-full shrink-0 text-zinc-800/30" viewBox="0 0 1440 48" fill="currentColor">
                <path d="M0,24 C240,48 480,0 720,24 C960,48 1200,0 1440,24 L1440,48 L0,48 Z" />
              </svg>
            ))}
          </div>
        </div>

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
              <a key={link} href="#" className="link-underline text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

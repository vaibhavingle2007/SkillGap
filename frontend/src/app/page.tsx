import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-600/5 blur-[120px]" />
          <div className="absolute right-1/4 top-2/3 h-[300px] w-[300px] rounded-full bg-emerald-600/5 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-2xl">
          {/* Badge */}
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-600/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-medium text-teal-300">AI-Powered Career Intelligence</span>
          </div>

          <h1 className="animate-fade-in-up text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Map Your Skills.
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Shape Your Career.
            </span>
          </h1>

          <p className="animate-fade-in-up stagger-2 mx-auto mt-6 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg">
            Enter your current skills, choose your dream role, and get a personalized roadmap with curated resources to bridge the gap.
          </p>

          <div className="animate-fade-in-up stagger-3 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/skill-input"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/30 transition-all duration-300 hover:shadow-xl hover:shadow-teal-900/40 hover:brightness-110"
            >
              Start Analysis
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-8 py-3.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-700 hover:text-white"
            >
              View Demo Dashboard
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="animate-fade-in-up stagger-4 relative z-10 mx-auto mt-20 grid max-w-4xl gap-4 px-4 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              ),
              title: "Skill Gap Analysis",
              desc: "Identify exactly where you stand vs. where you need to be for your target role.",
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
              title: "Progress Tracking",
              desc: "Monitor your growth over time with detailed progress charts and milestones.",
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ),
              title: "Curated Roadmap",
              desc: "Get a step-by-step learning path with hand-picked YouTube videos and resources.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className={`card-glow rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition-all stagger-${i + 4}`}
            >
              <div className="mb-3 inline-flex rounded-lg bg-teal-600/10 p-2.5 text-teal-400">
                {feature.icon}
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-white">{feature.title}</h3>
              <p className="text-xs leading-relaxed text-zinc-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-t border-zinc-800/60 bg-zinc-950/50 px-6 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 sm:gap-16">
          {[
            { value: "50+", label: "Job Roles" },
            { value: "200+", label: "Skills Tracked" },
            { value: "1,000+", label: "Video Resources" },
            { value: "98%", label: "Accuracy" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

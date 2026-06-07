"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Map,
  BookOpen,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Skill Profile",
    href: "/skill-input",
    icon: FileText,
  },
  {
    label: "Learning Roadmap",
    href: "/roadmap",
    icon: Map,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "??";

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-900/80 backdrop-blur-xl lg:flex">
      {/* Brand Section */}
      <div className="flex items-center gap-4 px-6 py-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 shadow-lg shadow-indigo-500/20">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tighter text-white">SkillGap.AI</h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">Career Intelligence</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group relative flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-white/5 text-white shadow-sm ring-1 ring-white/10"
                      : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors duration-300 ${
                      isActive ? "text-indigo-400" : "text-zinc-600 group-hover:text-zinc-400"
                    }`}
                  />
                  {item.label}
                  {isActive && (
                    <div className="absolute right-4 h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User & Footer */}
      <div className="mt-auto p-4">
        <div className="rounded-[2rem] bg-zinc-900/40 border border-zinc-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-zinc-700">
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                {initials}
              </div>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 bg-emerald-500" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs font-bold text-white">
                {user?.displayName || "Explorer"}
              </p>
              <p className="truncate text-[10px] font-bold uppercase text-zinc-500">
                {user?.email?.split("@")[0] || "Guest"}
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-all hover:bg-red-500/10 hover:text-red-400 active:scale-95"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
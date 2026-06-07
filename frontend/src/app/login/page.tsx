"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, signInWithGithub } = useAuth();
  const router = useRouter();

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError(null);
    setIsLoading(true);
    try {
      if (provider === 'google') await signInWithGoogle();
      if (provider === 'github') await signInWithGithub();
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (msg.includes("auth/account-exists-with-different-credential")) {
        setError("Account exists with different credentials.");
      } else if (msg.includes("auth/popup-closed-by-user")) {
        setError("Sign in popup was closed.");
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          setError("Please enter your name.");
          setIsLoading(false);
          return;
        }
        await signUp(email, password, displayName.trim());
      } else {
        await signIn(email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (msg.includes("auth/email-already-in-use")) {
        setError("Email already registered.");
      } else if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password")) {
        setError("Invalid credentials.");
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 py-12">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        {/* Brand */}
        <div className="mb-10 flex flex-col items-center">
          <Link href="/" className="group mb-6 flex h-16 w-16 items-center justify-center rounded-[2rem] bg-zinc-900 border border-zinc-800 transition-all hover:scale-110 active:scale-95 shadow-2xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </Link>
          <h1 className="text-3xl font-black tracking-tighter text-white">SkillForge</h1>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">Secure Authentication</p>
        </div>

        {/* Auth Card */}
        <div className="glass-card overflow-hidden rounded-[2.5rem] border border-zinc-800/50 p-8 lg:p-10 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-xl font-black text-white tracking-tight">
              {isSignUp ? "Create Explorer Profile" : "Welcome Back"}
            </h2>
            <p className="mt-1 text-sm font-medium text-zinc-500">
              {isSignUp ? "Join 10k+ developers bridging their gaps." : "Resume your journey to mastery."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="animate-fade-in">
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 px-5 py-3.5 text-sm text-white placeholder-zinc-700 outline-none transition-all focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/5"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 px-5 py-3.5 text-sm text-white placeholder-zinc-700 outline-none transition-all focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/5"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-500">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 px-5 py-3.5 text-sm text-white placeholder-zinc-700 outline-none transition-all focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="animate-fade-in flex items-center gap-3 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3 text-xs font-bold text-red-400">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20">!</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-2xl bg-white py-4 text-xs font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-teal-400 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Authenticating..." : isSignUp ? "Establish Account" : "Access Dashboard"}
            </button>
          </form>

          {/* OAuth Separator */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-800/50" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Third Party</span>
            <div className="h-px flex-1 bg-zinc-800/50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleOAuth('google')}
              className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white"
            >
              Google
            </button>
            <button
              onClick={() => handleOAuth('github')}
              className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white"
            >
              GitHub
            </button>
          </div>

          {/* Toggle link */}
          <div className="mt-10 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-xs font-bold text-zinc-500 hover:text-teal-400 transition-colors"
            >
              {isSignUp ? "Already a member? Sign in" : "New here? Create an explorer profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

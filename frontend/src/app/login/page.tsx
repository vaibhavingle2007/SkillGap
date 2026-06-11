"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Check } from "lucide-react";

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

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    setError(null);
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b] px-4 py-12">
      {/* Background Orbs */}
      <motion.div
        className="pointer-events-none absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]"
        animate={{
          x: [0, 60, -40, 30, 0],
          y: [0, -50, 40, -20, 0],
          scale: [1, 1.15, 0.9, 1.05, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="pointer-events-none absolute -right-32 bottom-1/4 h-[400px] w-[400px] rounded-full bg-emerald-500/8 blur-[100px]"
        animate={{
          x: [0, -50, 30, -40, 0],
          y: [0, 40, -30, 20, 0],
          scale: [1, 0.85, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/8 blur-[80px]"
        animate={{
          x: [0, 40, -60, 20, 0],
          y: [0, -30, 50, -40, 0],
          scale: [1, 1.2, 0.8, 1.05, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Noise Overlay */}
      <div className="noise-overlay pointer-events-none absolute inset-0" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <motion.div
          className="mb-10 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/"
            className="group mb-6 flex h-16 w-16 items-center justify-center rounded-[2rem] border border-zinc-800 bg-zinc-900 shadow-2xl transition-all hover:scale-110 active:scale-95"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#14b8a6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </Link>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            SkillForge
          </h1>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
            Secure Authentication
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          className="glass-card overflow-hidden rounded-[2.5rem] border border-zinc-800/50 p-8 shadow-2xl lg:p-10"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <div className="mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? "signup-header" : "signin-header"}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-black tracking-tight text-white">
                  {isSignUp ? "Create Explorer Profile" : "Welcome Back"}
                </h2>
                <p className="mt-1 text-sm font-medium text-zinc-500">
                  {isSignUp
                    ? "Join 10k+ developers bridging their gaps."
                    : "Resume your journey to mastery."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`space-y-5 ${error ? "animate-shake" : ""}`}
          >
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  key="displayName"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  <div className="relative">
                    <input
                      type="text"
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder=" "
                      className="peer w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-5 pb-2.5 pt-6 text-sm text-white outline-none transition-all placeholder-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <label
                      htmlFor="displayName"
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-sm text-zinc-500 transition-all peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:text-indigo-400 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px]"
                    >
                      Full Name
                    </label>
                    {displayName.trim().length > 0 && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Check className="h-4 w-4 text-emerald-400" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
                className="peer w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-5 pb-2.5 pt-6 text-sm text-white outline-none transition-all placeholder-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <label
                htmlFor="email"
                className="absolute left-5 top-1/2 -translate-y-1/2 text-sm text-zinc-500 transition-all peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:text-indigo-400 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px]"
              >
                Email Address
              </label>
              {isEmailValid && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Check className="h-4 w-4 text-emerald-400" strokeWidth={3} />
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
                className="peer w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-5 pb-2.5 pt-6 pr-14 text-sm text-white outline-none transition-all placeholder-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <label
                htmlFor="password"
                className="absolute left-5 top-1/2 -translate-y-1/2 text-sm text-zinc-500 transition-all peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:text-indigo-400 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px]"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {isPasswordValid && !showPassword && (
                <div className="absolute right-16 top-1/2 -translate-y-1/2">
                  <Check className="h-4 w-4 text-emerald-400" strokeWidth={3} />
                </div>
              )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3 text-xs font-bold text-red-400 shadow-[0_0_15px_-3px_rgba(239,68,68,0.4)]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                      !
                    </span>
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-2xl bg-white py-4 text-xs font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-[1.02] hover:bg-indigo-400 active:scale-95 disabled:opacity-50"
            >
              {isLoading
                ? "Authenticating..."
                : isSignUp
                ? "Establish Account"
                : "Access Dashboard"}
            </button>
          </form>

          {/* OAuth Separator */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-800/50" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
              Third Party
            </span>
            <div className="h-px flex-1 bg-zinc-800/50" />
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleOAuth('google')}
              disabled={isLoading}
              className="group flex items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-white py-3 text-xs font-black uppercase tracking-widest text-zinc-900 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <svg
                className="h-5 w-5 transition-transform group-hover:scale-110"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.03 2.53-2.16 3.31v2.77h3.49c2.04-1.88 2.75-4.65 2.75-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.49-2.77c-.98.66-2.23 1.06-3.79 1.06-2.92 0-5.39-1.97-6.27-4.63H2.18v2.84C3.99 20.53 7.69 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.73 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.64 0 3.11.56 4.27 1.67l3.2-3.2C17.45 1.94 14.97 1 12 1 7.69 1 3.99 3.47 2.18 7.07l2.85 2.84C6.61 7.25 9.08 5.38 12 5.38z"
                  fill="#EA4335"
                />
              </svg>
              Google
              {isLoading && (
                <motion.div
                  className="ml-2 h-4 w-4 rounded-full border-2 border-zinc-300 border-t-zinc-900"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}
            </button>

            <button
              onClick={() => handleOAuth('github')}
              disabled={isLoading}
              className="group flex items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 py-3 text-xs font-black uppercase tracking-widest text-zinc-400 transition-all hover:scale-105 hover:bg-zinc-800 hover:text-white active:scale-95 disabled:opacity-50"
            >
              <svg
                className="h-5 w-5 transition-transform group-hover:scale-110"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.645.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.944 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.378.202 2.397.099 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
              {isLoading && (
                <motion.div
                  className="ml-2 h-4 w-4 rounded-full border-2 border-zinc-600 border-t-zinc-200"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}
            </button>
          </div>

          {/* Toggle link */}
          <div className="mt-10 text-center">
            <button
              onClick={toggleMode}
              className="text-xs font-bold text-zinc-500 transition-colors hover:text-indigo-400"
            >
              {isSignUp
                ? "Already a member? Sign in"
                : "New here? Create an explorer profile"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

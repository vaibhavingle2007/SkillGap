"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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
      router.push("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      // Clean up Firebase error messages
      if (msg.includes("auth/account-exists-with-different-credential")) {
        setError("An account already exists with the same email address but different sign-in credentials.");
      } else if (msg.includes("auth/popup-closed-by-user")) {
        setError("Sign in popup was closed before completing.");
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
      router.push("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      // Clean up Firebase error messages
      if (msg.includes("auth/email-already-in-use")) {
        setError("This email is already registered. Try signing in.");
      } else if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password")) {
        setError("Invalid email or password.");
      } else if (msg.includes("auth/user-not-found")) {
        setError("No account found with this email.");
      } else if (msg.includes("auth/weak-password")) {
        setError("Password should be at least 6 characters.");
      } else if (msg.includes("auth/invalid-email")) {
        setError("Please enter a valid email address.");
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-600/5 blur-[120px]" />
        <div className="absolute right-1/4 top-2/3 h-[300px] w-[300px] rounded-full bg-emerald-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600/20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">SkillForge</h1>
          <p className="mt-1 text-sm text-zinc-500">AI-Powered Career Intelligence</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-sm">
          <h2 className="mb-1 text-lg font-semibold text-white">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="mb-6 text-sm text-zinc-500">
            {isSignUp
              ? "Sign up to start your career journey"
              : "Sign in to access your dashboard"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (sign up only) */}
            {isSignUp && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-zinc-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20"
              />
            </div>

            {/* Password with eye icon */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-zinc-400">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 pr-12 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-zinc-500 transition-colors hover:text-zinc-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    /* Eye-off icon */
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    /* Eye icon */
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="animate-fade-in rounded-lg border border-red-500/20 bg-red-900/10 px-4 py-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/30 transition-all duration-300 hover:shadow-xl hover:shadow-teal-900/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" strokeLinecap="round" />
                  </svg>
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </span>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs text-uppercase">
                <span className="bg-zinc-900/60 px-2 text-zinc-500 backdrop-blur-sm">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOAuth('google')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                </svg>
                Google
              </button>
              <button
                onClick={() => handleOAuth('github')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </button>
            </div>
          </div>

          {/* Toggle */}
          <div className="mt-8 border-t border-zinc-800 pt-6 text-center">
            <p className="text-sm text-zinc-500">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="font-medium text-teal-400 transition-colors hover:text-teal-300"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
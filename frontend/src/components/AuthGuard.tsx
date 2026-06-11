"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login";
  const isLandingPage = pathname === "/";

  useEffect(() => {
    // Redirect to login if not authenticated and trying to access a protected page
    if (!loading && !user && !isLoginPage && !isLandingPage) {
      router.replace("/login");
    }
    // Redirect away from login if already authenticated
    if (!loading && user && isLoginPage) {
      router.replace("/dashboard");
    }
  }, [user, loading, isLoginPage, isLandingPage, router]);

  // Show loading spinner while auth state is resolving
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-zinc-700 border-t-teal-500" />
          <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">Resolving Session...</p>
        </div>
      </div>
    );
  }

  // Public pages (Login, Landing) - no sidebar
  if (isLoginPage || isLandingPage) {
    return <>{children}</>;
  }

  // Protected pages - require auth
  if (!user) return null; // will redirect

  return (
    <>
      <Sidebar />
      <main className="min-h-screen bg-[#09090b] pb-20 lg:pb-0 lg:ml-64">{children}</main>
      <MobileNav />
    </>
  );
}

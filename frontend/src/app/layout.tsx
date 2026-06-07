import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import AuthGuard from "@/components/AuthGuard";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkillForge — AI Career Skill Analyzer",
  description: "Analyze your skills, identify gaps, and get a personalized learning roadmap to land your dream career in tech.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <DataProvider>
            <AuthGuard>{children}</AuthGuard>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

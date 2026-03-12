import SkillForm from "@/components/SkillForm";

export const metadata = {
  title: "Skill Input — SkillForge",
  description: "Enter your current skills and select your target job role to get a personalized analysis.",
};

export default function SkillInputPage() {
  return (
    <div className="px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Skill Input</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Tell us about your skills and career goals — we&apos;ll do the rest.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <SkillForm />
      </div>
    </div>
  );
}

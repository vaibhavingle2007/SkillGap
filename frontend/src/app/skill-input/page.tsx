import SkillForm from "@/components/SkillForm";

export const metadata = {
  title: "Skill Input — SkillGap",
  description: "Enter your current skills and select your target job role to get a personalized analysis.",
};

export default function SkillInputPage() {
  return (
    <div className="px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-2 text-teal-500 mb-3">
          <span className="h-px w-8 bg-teal-500/50" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Career Intelligence</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white lg:text-5xl">Define Your Path</h1>
        <p className="mt-3 text-zinc-400 max-w-xl text-lg">
          Tell us where you are and where you want to go. We'll map out the skills you need to get there.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <SkillForm />
      </div>
    </div>
  );
}

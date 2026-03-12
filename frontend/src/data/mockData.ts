export interface Skill {
  name: string;
  currentLevel: number;
  requiredLevel: number;
  category: string;
}

export interface JobRole {
  id: string;
  title: string;
  category: string;
  requiredSkills: string[];
  avgSalary: string;
  demand: "High" | "Medium" | "Low";
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
  progress: number;
  estimatedWeeks: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  skills: string[];
  youtubeResources: YoutubeResource[];
}

export interface YoutubeResource {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
  views: string;
  url: string;
}

export interface SkillGap {
  skill: string;
  current: number;
  required: number;
  gap: number;
  priority: "Critical" | "High" | "Medium" | "Low";
}

export interface ProgressData {
  month: string;
  score: number;
}

export const jobRoles: JobRole[] = [
  {
    id: "fullstack-developer",
    title: "Full-Stack Developer",
    category: "Engineering",
    requiredSkills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
    avgSalary: "$120k - $180k",
    demand: "High",
  },
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    category: "AI / ML",
    requiredSkills: ["Python", "TensorFlow", "PyTorch", "Statistics", "Data Pipelines", "MLOps"],
    avgSalary: "$140k - $200k",
    demand: "High",
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    category: "Data",
    requiredSkills: ["Python", "SQL", "Statistics", "Data Visualization", "Machine Learning", "R"],
    avgSalary: "$110k - $170k",
    demand: "High",
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    category: "Infrastructure",
    requiredSkills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Linux"],
    avgSalary: "$115k - $175k",
    demand: "Medium",
  },
  {
    id: "frontend-developer",
    title: "Frontend Engineer",
    category: "Engineering",
    requiredSkills: ["React", "TypeScript", "CSS", "Testing", "Performance", "Accessibility"],
    avgSalary: "$100k - $160k",
    demand: "High",
  },
  {
    id: "backend-developer",
    title: "Backend Engineer",
    category: "Engineering",
    requiredSkills: ["Node.js", "Python", "PostgreSQL", "Redis", "System Design", "API Design"],
    avgSalary: "$110k - $170k",
    demand: "High",
  },
];

export const userSkills: Skill[] = [
  { name: "Python", currentLevel: 72, requiredLevel: 90, category: "Programming" },
  { name: "JavaScript", currentLevel: 85, requiredLevel: 80, category: "Programming" },
  { name: "React", currentLevel: 78, requiredLevel: 85, category: "Framework" },
  { name: "Node.js", currentLevel: 65, requiredLevel: 80, category: "Framework" },
  { name: "SQL", currentLevel: 60, requiredLevel: 75, category: "Database" },
  { name: "System Design", currentLevel: 40, requiredLevel: 70, category: "Architecture" },
  { name: "Data Visualization", currentLevel: 55, requiredLevel: 80, category: "Data" },
  { name: "Docker", currentLevel: 45, requiredLevel: 65, category: "DevOps" },
  { name: "TypeScript", currentLevel: 70, requiredLevel: 85, category: "Programming" },
  { name: "Machine Learning", currentLevel: 35, requiredLevel: 75, category: "AI / ML" },
];

export const skillGaps: SkillGap[] = [
  { skill: "System Design", current: 40, required: 70, gap: 30, priority: "Critical" },
  { skill: "Machine Learning", current: 35, required: 75, gap: 40, priority: "Critical" },
  { skill: "Data Visualization", current: 55, required: 80, gap: 25, priority: "High" },
  { skill: "Python", current: 72, required: 90, gap: 18, priority: "High" },
  { skill: "Docker", current: 45, required: 65, gap: 20, priority: "Medium" },
  { skill: "Node.js", current: 65, required: 80, gap: 15, priority: "Medium" },
  { skill: "TypeScript", current: 70, required: 85, gap: 15, priority: "Medium" },
  { skill: "SQL", current: 60, required: 75, gap: 15, priority: "Low" },
];

export const progressHistory: ProgressData[] = [
  { month: "Sep", score: 42 },
  { month: "Oct", score: 48 },
  { month: "Nov", score: 55 },
  { month: "Dec", score: 58 },
  { month: "Jan", score: 65 },
  { month: "Feb", score: 71 },
  { month: "Mar", score: 78 },
];

export const roadmapSteps: RoadmapStep[] = [
  {
    id: "step-1",
    title: "Assess Current Skills",
    description: "Complete the skill assessment to identify your strengths and areas for improvement.",
    status: "completed",
    progress: 100,
    estimatedWeeks: 1,
    difficulty: "Beginner",
    skills: ["Self-Assessment"],
    youtubeResources: [
      {
        id: "yt-1",
        title: "How to Assess Your Tech Skills",
        channel: "TechLead",
        duration: "12:34",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        views: "245K",
        url: "https://youtube.com",
      },
    ],
  },
  {
    id: "step-2",
    title: "Python Advanced Mastery",
    description: "Master advanced Python concepts including decorators, generators, async/await, and design patterns.",
    status: "in-progress",
    progress: 60,
    estimatedWeeks: 4,
    difficulty: "Intermediate",
    skills: ["Python", "Design Patterns", "Async Programming"],
    youtubeResources: [
      {
        id: "yt-2",
        title: "Python Advanced Tutorial - Complete Course",
        channel: "freeCodeCamp",
        duration: "5:42:18",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        views: "1.2M",
        url: "https://youtube.com",
      },
      {
        id: "yt-3",
        title: "Python Design Patterns You Should Know",
        channel: "ArjanCodes",
        duration: "28:15",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        views: "380K",
        url: "https://youtube.com",
      },
      {
        id: "yt-4",
        title: "Async Python - Full Tutorial",
        channel: "Tech With Tim",
        duration: "1:15:42",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        views: "560K",
        url: "https://youtube.com",
      },
    ],
  },
  {
    id: "step-3",
    title: "System Design Fundamentals",
    description: "Learn core system design concepts including scalability, load balancing, caching, and database sharding.",
    status: "upcoming",
    progress: 0,
    estimatedWeeks: 6,
    difficulty: "Advanced",
    skills: ["System Design", "Architecture", "Scalability"],
    youtubeResources: [
      {
        id: "yt-5",
        title: "System Design for Beginners",
        channel: "Gaurav Sen",
        duration: "45:20",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        views: "2.1M",
        url: "https://youtube.com",
      },
      {
        id: "yt-6",
        title: "Designing a URL Shortener",
        channel: "NeetCode",
        duration: "32:10",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        views: "890K",
        url: "https://youtube.com",
      },
    ],
  },
  {
    id: "step-4",
    title: "Data Structures & Algorithms",
    description: "Master essential DSA topics: arrays, trees, graphs, dynamic programming, and common interview patterns.",
    status: "upcoming",
    progress: 0,
    estimatedWeeks: 8,
    difficulty: "Intermediate",
    skills: ["Algorithms", "Data Structures", "Problem Solving"],
    youtubeResources: [
      {
        id: "yt-7",
        title: "Data Structures Full Course",
        channel: "CS Dojo",
        duration: "4:12:05",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        views: "3.4M",
        url: "https://youtube.com",
      },
      {
        id: "yt-8",
        title: "Dynamic Programming Patterns",
        channel: "NeetCode",
        duration: "1:05:30",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        views: "1.5M",
        url: "https://youtube.com",
      },
    ],
  },
  {
    id: "step-5",
    title: "Build Portfolio Projects",
    description: "Apply your skills by building real-world projects to showcase in your portfolio and GitHub profile.",
    status: "upcoming",
    progress: 0,
    estimatedWeeks: 4,
    difficulty: "Intermediate",
    skills: ["Full-Stack", "Git", "Deployment"],
    youtubeResources: [
      {
        id: "yt-9",
        title: "10 Portfolio Projects for 2025",
        channel: "Fireship",
        duration: "10:05",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        views: "2.8M",
        url: "https://youtube.com",
      },
    ],
  },
];

export const youtubeResources: YoutubeResource[] = [
  {
    id: "rec-1",
    title: "Machine Learning Roadmap 2025",
    channel: "Daniel Bourke",
    duration: "38:22",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "1.8M",
    url: "https://youtube.com",
  },
  {
    id: "rec-2",
    title: "Complete System Design Course",
    channel: "ByteByteGo",
    duration: "2:15:40",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "4.2M",
    url: "https://youtube.com",
  },
  {
    id: "rec-3",
    title: "Docker Crash Course for Developers",
    channel: "TechWorld with Nana",
    duration: "1:02:15",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "5.6M",
    url: "https://youtube.com",
  },
  {
    id: "rec-4",
    title: "Advanced TypeScript Patterns",
    channel: "Matt Pocock",
    duration: "22:45",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "920K",
    url: "https://youtube.com",
  },
  {
    id: "rec-5",
    title: "Data Visualization with Python",
    channel: "Corey Schafer",
    duration: "48:30",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "1.4M",
    url: "https://youtube.com",
  },
  {
    id: "rec-6",
    title: "SQL Tutorial for Data Analysis",
    channel: "Alex The Analyst",
    duration: "3:22:10",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "2.9M",
    url: "https://youtube.com",
  },
];

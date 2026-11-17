export interface Project {
  id: string;
  title: string;
  type: string;
  description: string;
  longDescription?: string;
  role?: string;
  team?: string;
  stack?: string[];
  status: "live" | "archived" | "coming-soon";
  statusNote?: string;
  preview?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    id: "kitchen-chicken",
    title: "Kitchen Chicken",
    type: "Restaurant Ordering Management System",
    description:
      "A team-built restaurant ordering platform with client-side ordering features and an Admin/Manager dashboard for restaurant operations.",
    longDescription:
      "Kitchen Chicken is a restaurant ordering management system designed to support online meal ordering, restaurant operations, and admin-side management workflows. The platform includes client-facing features such as login, menu browsing, cart, order flow, and restaurant pages. My main responsibility was building the Admin/Manager system, focusing on frontend architecture, CRUD management flows, dashboard interfaces, and role-based access patterns.",
    role: "Frontend Developer — Admin/Manager System",
    team: "5 members",
    stack: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "TanStack Query", "Firebase"],
    status: "archived",
    statusNote:
      "Archived project — preview available, but some backend-dependent features may be limited.",
    preview: "https://kitchen-chicken.vercel.app",
    github: "https://github.com/tanphat1102/kitchen_chicken",
  },
  {
    id: "capstone-project",
    title: "Capstone Project",
    type: "Software Engineering Project",
    description:
      "A software engineering project currently in development. Details will be added after completion.",
    status: "coming-soon",
  },
  {
    id: "interactive-web-experiment",
    title: "Interactive Web Experiment",
    type: "Motion / Interactive Interface",
    description:
      "An experimental web interface exploring modern frontend animation, visual interaction, and creative layout direction.",
    status: "coming-soon",
  },
];

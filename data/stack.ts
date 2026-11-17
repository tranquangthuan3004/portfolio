export interface StackItem {
  name: string;
  category: "frontend" | "tooling" | "backend" | "animation" | "deploy";
}

export const stack: StackItem[] = [
  { name: "React", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "JavaScript", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "shadcn/ui", category: "frontend" },
  { name: "Vite", category: "tooling" },
  { name: "TanStack Query", category: "tooling" },
  { name: "Node.js", category: "backend" },
  { name: "Firebase", category: "backend" },
  { name: "GSAP", category: "animation" },
  { name: "Three.js", category: "animation" },
  { name: "GitHub", category: "deploy" },
  { name: "Vercel", category: "deploy" },
];

export const categoryLabels: Record<StackItem["category"], string> = {
  frontend: "Frontend",
  tooling: "Tooling",
  backend: "Backend",
  animation: "Animation",
  deploy: "Deploy",
};

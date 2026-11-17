export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
}

export const services: Service[] = [
  {
    id: "landing-pages",
    title: "Landing Pages",
    description:
      "High-converting, visually striking landing pages designed to make a strong first impression. Built with clean layouts, responsive design, and performance in mind.",
    icon: "Layout",
    tags: ["React", "Next.js", "Tailwind CSS", "Responsive"],
  },
  {
    id: "portfolio-websites",
    title: "Portfolio Websites",
    description:
      "Custom portfolio websites that showcase your work with personality and polish. Designed to stand out and represent your brand with clarity.",
    icon: "Briefcase",
    tags: ["Next.js", "TypeScript", "shadcn/ui", "SEO"],
  },
  {
    id: "web-animation",
    title: "Web Animation",
    description:
      "Smooth, purposeful animations and interactive interfaces that elevate user experience. From micro-interactions to full motion sequences.",
    icon: "Sparkles",
    tags: ["GSAP", "CSS Animations", "Three.js", "Motion"],
  },
];

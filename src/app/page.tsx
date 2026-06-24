import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Code2,
  FileText,
  GitBranch,
  Globe2,
  Layers3,
  Mail,
  MonitorSmartphone,
  Network,
  Rocket,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CtaLink } from "@/components/cta-link";
import { GlassCard } from "@/components/glass-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";

type Action = {
  label: string;
  href?: string;
  icon: LucideIcon;
  external?: boolean;
  disabled?: boolean;
};

type Project = {
  title: string;
  status: string;
  description: string;
  tags: string[];
  preview: "icebot" | "kitchen" | "metary";
  actions: Action[];
  repoLinks?: { label: string; href: string }[];
  note?: string;
};

const projects: Project[] = [
  {
    title: "IceBot Web Ecosystem",
    status: "Capstone project",
    description:
      "A capstone product ecosystem for the IceBot project, including web app, kiosk, and mobile-facing interfaces. My work focused on frontend implementation, product screens, responsive UI, and user flows across multiple repositories.",
    tags: ["Capstone", "React", "Web App", "Kiosk", "Mobile", "Frontend"],
    preview: "icebot",
    repoLinks: [
      {
        label: "IceBot-WebApp",
        href: "https://github.com/SU26SE092-IceCream-arm-Robot/IceBot-WebApp",
      },
      {
        label: "IceBot-Kiosk",
        href: "https://github.com/SU26SE092-IceCream-arm-Robot/IceBot-Kiosk",
      },
      {
        label: "IceBot-Mobile",
        href: "https://github.com/SU26SE092-IceCream-arm-Robot/IceBot-Mobile",
      },
    ],
    actions: [
      {
        label: "View Organization",
        href: "https://github.com/SU26SE092-IceCream-arm-Robot",
        icon: Building2,
        external: true,
      },
      { label: "Case Study", icon: BookOpen, disabled: true },
    ],
  },
  {
    title: "Kitchen Chicken",
    status: "Archived academic project",
    description:
      "An academic web project with a GitHub repository and deployed link. It demonstrates frontend structure, UI implementation, routing, and project collaboration.",
    note:
      "Older archived academic project. The live demo may no longer be active.",
    tags: ["Academic", "React", "Frontend", "GitHub", "Vercel"],
    preview: "kitchen",
    actions: [
      {
        label: "View GitHub",
        href: "https://github.com/tanphat1102/kitchen_chicken",
        icon: GitBranch,
        external: true,
      },
      {
        label: "Live Demo",
        href: "https://kitchen-chicken.vercel.app",
        icon: Globe2,
        external: true,
      },
      { label: "Case Study", icon: BookOpen, disabled: true },
    ],
  },
  {
    title: "Minimal Web3 Hero / Metary",
    status: "Concept project",
    description:
      "A minimal Web3 and SaaS hero section concept focused on cinematic background, floating pill navbar, bottom-aligned hero content, partner-logo ribbon, and pixel-perfect responsive layout.",
    tags: ["React", "Tailwind CSS", "Web3", "Hero Section", "Responsive UI"],
    preview: "metary",
    actions: [
      { label: "Preview coming soon", icon: Globe2, disabled: true },
      { label: "Case Study", icon: BookOpen, disabled: true },
    ],
  },
];

const buildItems = [
  {
    title: "Landing Pages",
    description:
      "Responsive landing pages with clear messaging, polished sections, and strong calls to action.",
    icon: Rocket,
  },
  {
    title: "Portfolio Websites",
    description:
      "Personal websites that present identity, skills, and projects in a focused, professional way.",
    icon: MonitorSmartphone,
  },
  {
    title: "UI Motion & Polish",
    description:
      "Subtle animation, hover states, scroll reveals, and interaction details that make interfaces feel alive.",
    icon: WandSparkles,
  },
];

const stack = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "JavaScript",
  "HTML",
  "CSS",
  "shadcn/ui",
  "Three.js",
  "GSAP",
  "GitHub",
  "Vercel",
  "AI-assisted workflow",
];

const workflow = [
  {
    title: "Understand",
    description: "Clarify goal, users, pages, references, and constraints.",
  },
  {
    title: "Design",
    description: "Turn the idea into layout, hierarchy, and responsive structure.",
  },
  {
    title: "Build",
    description:
      "Implement clean UI with React, Next.js, TypeScript, and Tailwind CSS.",
  },
  {
    title: "Polish",
    description: "Refine motion, spacing, accessibility, and final presentation.",
  },
];

const aboutPills = [
  "FPT University",
  "Final-year Software Engineering",
  "Frontend Developer",
  "React / Next.js",
  "AI-assisted workflow",
];

const contactActions: Action[] = [
  {
    label: "GitHub",
    href: "https://github.com/tranquangthuan3004",
    icon: GitBranch,
    external: true,
  },
  {
    label: "Email",
    href: "mailto:PhoenixZ3004@gmail.com",
    icon: Mail,
  },
  { label: "LinkedIn", icon: Network, disabled: true },
  { label: "Resume", icon: FileText, disabled: true },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-slate-100">
      <SiteHeader />

      {/* ─── Cinematic Hero ─── */}
      <HeroSection />

      {/* ─── Featured Work ─── */}
      <section id="work" className="relative px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Featured Work"
            title="Selected work with real context and visual direction."
            description="A focused collection of academic projects and frontend concepts that show responsive UI, product thinking, and polished presentation."
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {projects.map((project) => (
              <GlassCard
                key={project.title}
                className="group flex h-full flex-col overflow-hidden p-4 sm:p-5"
              >
                <ProjectPreview type={project.preview} />

                <div className="flex flex-1 flex-col pt-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold tracking-tight text-white">
                      {project.title}
                    </h3>
                    <StatusBadge label={project.status} />
                  </div>

                  <p className="text-sm leading-7 text-slate-300">
                    {project.description}
                  </p>

                  {project.repoLinks ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.repoLinks.map((repo) => (
                        <Link
                          key={repo.href}
                          href={repo.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${repo.label} repository`}
                          className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:border-cyan-300/50 hover:text-white"
                        >
                          {repo.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}

                  {project.note ? (
                    <p className="mt-4 rounded-2xl border border-amber-300/15 bg-amber-300/[0.055] px-4 py-3 text-xs leading-6 text-amber-100">
                      {project.note}
                    </p>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-2">
                    {project.actions.map((action) => (
                      <ActionButton
                        key={`${project.title}-${action.label}`}
                        action={action}
                        ariaContext={project.title}
                      />
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── What I Build ─── */}
      <section id="build" className="relative px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What I Build"
            title="What I can help build"
          />

          <div className="grid gap-5 md:grid-cols-3">
            {buildItems.map((item) => (
              <GlassCard
                key={item.title}
                className="group relative min-h-56 overflow-hidden"
              >
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="mb-6 grid size-12 place-items-center rounded-2xl border border-violet-300/20 bg-violet-300/10 text-violet-100 transition group-hover:border-cyan-300/40 group-hover:text-cyan-100">
                  <item.icon className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {item.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Tech & Workflow ─── */}
      <section
        id="workflow"
        className="relative px-5 py-14 sm:px-8 sm:py-16 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Tech & Workflow" title="Tools and workflow" />

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <GlassCard>
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-100 ring-1 ring-cyan-300/20">
                  <Code2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Frontend stack
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Practical tools for modern UI delivery.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-3.5 py-2 text-sm font-semibold text-cyan-50 transition hover:-translate-y-0.5 hover:border-violet-300/45 hover:bg-violet-300/10"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-violet-300/10 text-violet-100 ring-1 ring-violet-300/20">
                  <Layers3 className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Delivery flow
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Compact process from idea to final polish.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {workflow.map((step, index) => (
                  <div
                    key={step.title}
                    className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                  >
                    <span className="grid size-8 place-items-center rounded-full bg-cyan-300/10 text-xs font-bold text-cyan-100">
                      0{index + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-white">{step.title}</h4>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ─── About ─── */}
      <section id="about" className="relative px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <GlassCard>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
              About PhoenixZ
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Tran Quang Thuan
            </h2>
            <p className="mt-3 text-base font-medium text-violet-100">
              Trần Quang Thuận
            </p>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              Final-year Software Engineering student at FPT University,
              focused on practical frontend development and modern interface
              craft.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="space-y-5 text-base leading-8 text-slate-300">
              <p>
                I am Tran Quang Thuan, a final-year Software Engineering
                student at FPT University and a frontend developer focused on
                turning ideas into sharp, usable web interfaces. I work mainly
                with React, Next.js, TypeScript, and Tailwind CSS, and I enjoy
                building responsive layouts, polished landing pages, and
                interactive web experiences.
              </p>
              <p>
                I actively explore modern frontend trends such as shadcn/ui,
                Three.js, GSAP, and AI-assisted development workflows. My goal
                is to grow through real projects, contribute to practical
                product development, and build interfaces that are clean,
                efficient, and easy to use.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {aboutPills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-medium text-slate-100"
                >
                  {pill}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ─── Contact ─── */}
      <section
        id="contact"
        className="relative px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-16 lg:px-10"
      >
        <div className="mx-auto max-w-4xl text-center">
          <GlassCard className="relative overflow-hidden">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
            <div className="mx-auto max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
                Contact
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Have a frontend idea that needs a polished build?
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                I am open to Frontend Developer Internship, Part-time roles,
                and selected freelance work for landing pages, portfolio
                websites, and UI polish.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {contactActions.map((action) => (
                  <ActionButton
                    key={action.label}
                    action={action}
                    ariaContext="contact"
                    primary={action.label === "Email"}
                  />
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative border-t border-white/10 px-5 py-8 text-center text-sm text-slate-400 sm:px-8 lg:px-10">
        <p>© 2026 PhoenixZ. Built with Next.js, Tailwind CSS, and Vercel.</p>
      </footer>
    </main>
  );
}

/* ─── Project preview cards ─── */

function ProjectPreview({ type }: { type: Project["preview"] }) {
  if (type === "icebot") {
    return (
      <div className="relative h-56 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_70%_25%,rgba(34,211,238,0.24),transparent_28%),linear-gradient(135deg,rgba(3,7,18,0.98),rgba(88,28,135,0.26))] p-4">
        <div className="absolute right-5 top-5 grid size-16 place-items-center rounded-full border border-cyan-200/25 bg-cyan-200/10 text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.24)]">
          <MonitorSmartphone className="size-7" />
        </div>
        <div className="grid h-full grid-cols-[1.1fr_0.8fr] gap-3">
          <PreviewPanel title="Web App" className="self-start" />
          <div className="space-y-3 pt-12">
            <PreviewPanel title="Kiosk" compact />
            <PreviewPanel title="Mobile" compact />
          </div>
        </div>
      </div>
    );
  }

  if (type === "kitchen") {
    return (
      <div className="relative h-56 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,0.22),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(49,46,129,0.48))] p-4">
        <div className="grid h-full grid-cols-[1fr_0.78fr] gap-3">
          <PreviewPanel title="Menu" warm />
          <div className="space-y-3 pt-8">
            <PreviewPanel title="Order" compact warm />
            <PreviewPanel title="Admin" compact warm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-56 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(168,85,247,0.34),transparent_30%),linear-gradient(145deg,rgba(2,6,23,1),rgba(88,28,135,0.42))] p-4">
      <div className="absolute inset-x-5 top-5 flex items-center justify-between rounded-full border border-white/15 bg-white/90 px-4 py-2 text-slate-950 shadow-2xl shadow-black/20">
        <span className="text-xs font-black">Metary</span>
        <div className="flex gap-3 text-[10px] font-bold uppercase tracking-[0.12em]">
          <span>Work</span>
          <span>Vision</span>
          <span>Join</span>
        </div>
      </div>
      <div className="absolute bottom-5 left-5 right-5">
        <p className="max-w-xs text-2xl font-black tracking-tight text-white">
          Build the next layer of web experience.
        </p>
        <div className="mt-5 flex gap-2">
          {["Nova", "Orbit", "Pixel", "Flow"].map((item) => (
            <span
              key={item}
              className="h-7 flex-1 rounded-full border border-white/10 bg-white/10 text-center text-[9px] font-bold uppercase leading-7 tracking-[0.12em] text-slate-300"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewPanel({
  title,
  compact = false,
  warm = false,
  className = "",
}: {
  title: string;
  compact?: boolean;
  warm?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-slate-950/60 p-3 shadow-2xl shadow-black/20 backdrop-blur ${className}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
          {title}
        </span>
        <span
          className={`size-2 rounded-full ${warm ? "bg-amber-200" : "bg-cyan-200"}`}
        />
      </div>
      <div className="space-y-2">
        <span
          className={`block h-2 rounded-full ${warm ? "bg-amber-200/60" : "bg-cyan-200/60"}`}
        />
        <span className="block h-2 w-4/5 rounded-full bg-white/20" />
        {!compact ? (
          <>
            <span className="block h-2 w-2/3 rounded-full bg-violet-200/35" />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <span className="h-12 rounded-xl bg-white/10" />
              <span className="h-12 rounded-xl bg-white/10" />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  const color =
    label === "Capstone project"
      ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-100"
      : label === "Archived academic project"
        ? "border-amber-300/25 bg-amber-300/10 text-amber-100"
        : "border-violet-300/25 bg-violet-300/10 text-violet-100";

  return (
    <span
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${color}`}
    >
      {label}
    </span>
  );
}

function ActionButton({
  action,
  ariaContext,
  primary = false,
}: {
  action: Action;
  ariaContext: string;
  primary?: boolean;
}) {
  if (action.disabled || !action.href) {
    return (
      <span
        aria-label={`${action.label} for ${ariaContext} coming soon`}
        className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 text-sm font-semibold text-slate-500"
      >
        <action.icon className="size-4" />
        <span>{action.label}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
          Soon
        </span>
      </span>
    );
  }

  return (
    <Link
      href={action.href}
      target={action.external ? "_blank" : undefined}
      rel={action.external ? "noreferrer" : undefined}
      aria-label={`${action.label} for ${ariaContext}`}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${
        primary
          ? "border-transparent bg-cyan-300 text-slate-950 shadow-[0_0_28px_rgba(103,232,249,0.2)] hover:bg-white"
          : "border-white/10 bg-white/[0.04] text-slate-100 hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:text-cyan-50"
      }`}
    >
      <action.icon className="size-4" />
      {action.label}
    </Link>
  );
}

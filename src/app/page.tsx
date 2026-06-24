import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  FileText,
  GitBranch,
  Globe2,
  Mail,
  MonitorSmartphone,
  Network,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { Reveal } from "@/components/reveal";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

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
  actions: Action[];
  repoLinks?: { label: string; href: string }[];
  note?: string;
};

const featuredProject: Project = {
  title: "IceBot Web Ecosystem",
  status: "Capstone project",
  description:
    "A capstone product ecosystem for the IceBot project, including web app, kiosk, and mobile-facing interfaces. My work focused on frontend implementation, product screens, responsive UI, and user flows across multiple repositories.",
  tags: ["Capstone", "React", "Web App", "Kiosk", "Mobile", "Frontend"],
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
};

const supportingProjects: Project[] = [
  {
    title: "Kitchen Chicken",
    status: "Archived academic",
    description:
      "An academic web project demonstrating frontend structure, UI implementation, routing, and project collaboration.",
    note: "Older archived academic project. The live demo may no longer be active.",
    tags: ["Academic", "React", "Frontend"],
    actions: [
      {
        label: "GitHub",
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
    ],
  },
  {
    title: "Minimal Web3 Hero / Metary",
    status: "Concept",
    description:
      "A minimal Web3 and SaaS hero section concept focused on cinematic background, floating pill navbar, and pixel-perfect responsive layout.",
    tags: ["React", "Tailwind CSS", "Web3"],
    actions: [
      { label: "Preview", icon: Globe2, disabled: true },
      { label: "Case Study", icon: BookOpen, disabled: true },
    ],
  },
];

const heroStudies = [
  {
    title: "Minimal Web3 Hero",
    subtitle: "Metary",
    gradient: "from-violet-900/80 via-indigo-900/60 to-[#0A0A0C]",
    accent: "bg-violet-400/20 border-violet-400/30",
  },
  {
    title: "3D Studio Hero",
    subtitle: "Gour",
    gradient: "from-cyan-900/70 via-teal-900/50 to-[#0A0A0C]",
    accent: "bg-cyan-400/20 border-cyan-400/30",
  },
  {
    title: "SaaS Landing Page",
    subtitle: "Plety",
    gradient: "from-rose-900/60 via-pink-900/40 to-[#0A0A0C]",
    accent: "bg-rose-400/20 border-rose-400/30",
  },
];

const buildItems = [
  { title: "Landing Pages", description: "Responsive pages with clear messaging, polished sections, and strong calls to action." },
  { title: "Portfolio Websites", description: "Personal sites that present identity, skills, and projects in a focused, professional way." },
  { title: "UI Motion & Polish", description: "Subtle animation, hover states, scroll reveals, and interaction details that make interfaces feel alive." },
];

const stack = [
  "React", "Next.js", "TypeScript", "Tailwind CSS", "JavaScript",
  "HTML", "CSS", "shadcn/ui", "Three.js", "GSAP", "GitHub", "Vercel",
];

const workflow = [
  { step: "01", title: "Understand", description: "Clarify goal, users, pages, references." },
  { step: "02", title: "Design", description: "Layout, hierarchy, responsive structure." },
  { step: "03", title: "Build", description: "Clean UI with React, Next.js, TypeScript." },
  { step: "04", title: "Polish", description: "Refine motion, spacing, presentation." },
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

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <SiteHeader />

      {/* ─── Cinematic Hero ─── */}
      <HeroSection />

      {/* ─── Featured Work ─── */}
      <section id="work" className="relative px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionEyebrow label="Featured Work" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white/90 sm:text-4xl lg:text-[2.75rem]">
              Selected work with real context<br className="hidden sm:block" />
              and visual direction.
            </h2>
          </Reveal>

          {/* Featured Project — Full Width Hero Card */}
          <Reveal delay={0.15} className="mt-12">
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all duration-500 hover:border-violet-400/20 hover:bg-white/[0.05]">
              {/* Preview Area */}
              <div className="relative h-56 overflow-hidden sm:h-72 lg:h-80 bg-gradient-to-br from-violet-950/80 via-indigo-950/60 to-[#0A0A0C] p-6 sm:p-8">
                <div className="absolute right-6 top-6 grid size-14 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-[0_0_40px_rgba(34,211,238,0.15)] sm:right-8 sm:top-8 sm:size-16">
                  <MonitorSmartphone className="size-6 sm:size-7" />
                </div>
                <div className="grid h-full max-w-md grid-cols-[1.1fr_0.8fr] gap-3 sm:gap-4">
                  <MockupPanel title="Web App" />
                  <div className="space-y-3 pt-10 sm:pt-14">
                    <MockupPanel title="Kiosk" compact />
                    <MockupPanel title="Mobile" compact />
                  </div>
                </div>
                {/* Gradient fade at bottom of preview */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0A0A0C]/80 to-transparent" />
              </div>

              {/* Content Area */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-white/90 sm:text-2xl">
                      {featuredProject.title}
                    </h3>
                    <StatusBadge label={featuredProject.status} />
                  </div>
                </div>

                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/50">
                  {featuredProject.description}
                </p>

                {/* Repo Links */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {featuredProject.repoLinks?.map((repo) => (
                    <Link
                      key={repo.href}
                      href={repo.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group/repo inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold text-white/60 transition-all duration-300 hover:border-violet-400/30 hover:text-white/90"
                    >
                      <GitBranch className="size-3" />
                      {repo.label}
                      <ArrowUpRight className="size-3 opacity-0 transition-all duration-300 group-hover/repo:opacity-100" />
                    </Link>
                  ))}
                </div>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {featuredProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-white/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {featuredProject.actions.map((action) => (
                    <ActionButton
                      key={action.label}
                      action={action}
                      ariaContext={featuredProject.title}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Supporting Projects — Two Column */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {supportingProjects.map((project, i) => (
              <Reveal key={project.title} delay={0.1 + i * 0.1}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all duration-500 hover:border-violet-400/20 hover:bg-white/[0.05]">
                  {/* Mini Preview */}
                  <div className={`relative h-40 overflow-hidden p-5 ${
                    i === 0
                      ? "bg-gradient-to-br from-amber-950/50 via-orange-950/30 to-[#0A0A0C]"
                      : "bg-gradient-to-br from-violet-950/60 via-purple-950/40 to-[#0A0A0C]"
                  }`}>
                    {i === 0 ? (
                      <div className="grid h-full grid-cols-2 gap-2">
                        <MockupPanel title="Menu" compact warm />
                        <MockupPanel title="Order" compact warm />
                      </div>
                    ) : (
                      <>
                        <div className="absolute inset-x-4 top-4 flex items-center justify-between rounded-full border border-white/15 bg-white/90 px-3 py-1.5 text-slate-950">
                          <span className="text-[10px] font-black">Metary</span>
                          <div className="flex gap-2 text-[9px] font-bold uppercase tracking-wider">
                            <span>Work</span>
                            <span>Vision</span>
                          </div>
                        </div>
                        <p className="absolute bottom-4 left-4 right-4 text-lg font-bold tracking-tight text-white/80">
                          Build the next layer of web experience.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold tracking-tight text-white/90">
                        {project.title}
                      </h3>
                      <StatusBadge label={project.status} />
                    </div>

                    <p className="mt-3 text-sm leading-7 text-white/50">
                      {project.description}
                    </p>

                    {project.note && (
                      <p className="mt-3 rounded-xl border border-amber-400/10 bg-amber-400/[0.04] px-3 py-2 text-[12px] leading-5 text-amber-200/70">
                        {project.note}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-white/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex flex-wrap gap-3 pt-5">
                      {project.actions.map((action) => (
                        <ActionButton
                          key={`${project.title}-${action.label}`}
                          action={action}
                          ariaContext={project.title}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Premium Hero Studies ─── */}
      <section id="studies" className="relative px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionEyebrow label="Premium Hero Studies" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white/90 sm:text-4xl lg:text-[2.75rem]">
              Visual directions <em className="font-serif not-italic text-white/60">I studied.</em>
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-white/45">
              Hero section concepts that explore premium layout, cinematic
              background, and modern interaction patterns.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {heroStudies.map((study, i) => (
              <Reveal key={study.title} delay={i * 0.12}>
                <div className="group relative h-72 overflow-hidden rounded-2xl border border-white/[0.08] transition-all duration-500 hover:border-white/15 hover:-translate-y-1">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${study.gradient}`} />

                  {/* Abstract Mockup Lines */}
                  <div className="absolute inset-0 p-6">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full border ${study.accent}`} />
                      <div className="h-px flex-1 bg-white/[0.06]" />
                    </div>
                    <div className="mt-6 space-y-2">
                      <div className="h-1.5 w-3/4 rounded-full bg-white/[0.08]" />
                      <div className="h-1.5 w-1/2 rounded-full bg-white/[0.05]" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="h-16 rounded-lg bg-white/[0.04]" />
                      <div className="h-16 rounded-lg bg-white/[0.03]" />
                      <div className="h-16 rounded-lg bg-white/[0.04]" />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/80 to-transparent p-6">
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                      {study.subtitle}
                    </p>
                    <h3 className="mt-1 text-lg font-bold tracking-tight text-white/85">
                      {study.title}
                    </h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How I Build Polished Interfaces ─── */}
      <section id="process" className="relative px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionEyebrow label="Process" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white/90 sm:text-4xl lg:text-[2.75rem]">
              How I build <em className="font-serif not-italic text-violet-300/80">polished</em> interfaces.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {/* What I Build */}
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-violet-300/60">
                  What I Build
                </p>
                <div className="mt-5 space-y-4">
                  {buildItems.map((item) => (
                    <div key={item.title}>
                      <h4 className="text-[15px] font-semibold text-white/85">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-[13px] leading-6 text-white/40">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Tools */}
            <Reveal delay={0.2}>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-300/60">
                  Frontend Stack
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-white/60 transition-all duration-300 hover:border-violet-400/25 hover:text-white/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Workflow */}
            <Reveal delay={0.3}>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                  Workflow
                </p>
                <div className="mt-5 space-y-3">
                  {workflow.map((step) => (
                    <div
                      key={step.step}
                      className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-violet-400/10 text-[10px] font-bold text-violet-300/70">
                        {step.step}
                      </span>
                      <div>
                        <h4 className="text-[14px] font-semibold text-white/80">
                          {step.title}
                        </h4>
                        <p className="mt-0.5 text-[12px] leading-5 text-white/40">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Contact ─── */}
      <section id="contact" className="relative px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28 lg:px-10">
        {/* Top gradient divider */}
        <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-2xl bg-gradient-to-r from-transparent via-violet-400/25 to-transparent" />

        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <SectionEyebrow label="Contact" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white/90 sm:text-4xl">
              Have a frontend idea that needs<br className="hidden sm:block" />
              a polished build?
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-white/45">
              I am open to Frontend Developer Internship, Part-time roles,
              and selected freelance work for landing pages, portfolio
              websites, and UI polish.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {contactActions.map((action) => (
                <ActionButton
                  key={action.label}
                  action={action}
                  ariaContext="contact"
                  primary={action.label === "Email"}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative border-t border-white/[0.06] px-5 py-8 text-center sm:px-8 lg:px-10">
        <p className="text-[13px] text-white/30">
          © 2026 PhoenixZ. Built with Next.js, Tailwind CSS, and Vercel.
        </p>
      </footer>
    </main>
  );
}

/* ═══════════════════════════════════════════
   LOCAL COMPONENTS
   ═══════════════════════════════════════════ */

function SectionEyebrow({ label }: { label: string }) {
  return (
    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-violet-300/60">
      {label}
    </p>
  );
}

function MockupPanel({
  title,
  compact = false,
  warm = false,
}: {
  title: string;
  compact?: boolean;
  warm?: boolean;
  className?: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0A0A0C]/60 p-3 backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
          {title}
        </span>
        <span
          className={`size-1.5 rounded-full ${warm ? "bg-amber-300/60" : "bg-cyan-300/60"}`}
        />
      </div>
      <div className="space-y-1.5">
        <span
          className={`block h-1.5 rounded-full ${warm ? "bg-amber-300/30" : "bg-cyan-300/30"}`}
        />
        <span className="block h-1.5 w-4/5 rounded-full bg-white/[0.08]" />
        {!compact && (
          <>
            <span className="block h-1.5 w-2/3 rounded-full bg-violet-300/15" />
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <span className="h-8 rounded-lg bg-white/[0.05]" />
              <span className="h-8 rounded-lg bg-white/[0.05]" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="mt-1 inline-block rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/40">
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
        className="inline-flex min-h-10 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 text-[13px] font-medium text-white/25"
      >
        <action.icon className="size-3.5" />
        <span>{action.label}</span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-white/20">
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
      className={`group inline-flex min-h-10 items-center justify-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-all duration-500 hover:-translate-y-0.5 ${
        primary
          ? "border-violet-400/30 bg-violet-400/10 text-violet-200 hover:bg-violet-400/20 hover:shadow-[0_0_30px_rgba(167,139,250,0.15)]"
          : "border-white/[0.08] bg-white/[0.03] text-white/60 hover:border-white/15 hover:text-white/90"
      }`}
    >
      <action.icon className="size-3.5" />
      {action.label}
      {!action.disabled && (
        <ArrowUpRight className="size-3 opacity-0 transition-all duration-300 group-hover:opacity-70" />
      )}
    </Link>
  );
}

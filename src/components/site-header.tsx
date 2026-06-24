"use client";

import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Build", href: "#build" },
  { label: "Workflow", href: "#workflow" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  return (
    <header className="animate-slide-down fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-5 py-3 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="#hero" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl border border-cyan-300/40 bg-cyan-300/10 text-sm font-black text-cyan-200 shadow-[0_0_28px_rgba(103,232,249,0.2)]">
              PZ
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              PhoenixZ
            </span>
          </Link>

          {/* Desktop nav — glassy pill */}
          <div className="hidden items-center gap-0.5 rounded-full border border-white/[0.08] bg-white/[0.05] p-1 shadow-[0_4px_30px_rgba(0,0,0,0.2)] backdrop-blur-2xl md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition duration-200 hover:bg-white/[0.08] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <Link
              href="#contact"
              className="hidden rounded-full border border-violet-300/40 bg-violet-400/10 px-4 py-2 text-sm font-semibold text-violet-100 transition hover:border-cyan-300/60 hover:text-cyan-100 md:block"
            >
              Let&apos;s talk
            </Link>

            {/* Mobile hamburger menu */}
            <MobileMenu />
          </div>
        </div>
      </nav>
    </header>
  );
}

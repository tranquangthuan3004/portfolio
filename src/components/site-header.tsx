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

/**
 * Floating pill navbar — centered at the top of the viewport.
 * rounded-full, backdrop-blur-md, bg-white/5, border-white/10.
 * Logo left · Nav links center · CTA right.
 * On mobile: collapses to logo + hamburger.
 */
export function SiteHeader() {
  return (
    <header
      className="animate-slide-down fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2.5rem)] max-w-3xl"
      style={{ animationDelay: "0.2s" }}
    >
      <nav className="flex items-center gap-6 rounded-full border border-white/10 backdrop-blur-md bg-white/5 px-5 py-2.5 shadow-lg shadow-black/20">
        {/* Logo */}
        <Link href="#hero" className="flex items-center gap-2 shrink-0">
          <span className="grid size-8 place-items-center rounded-full border border-white/15 bg-white/10 text-xs font-black text-white">
            PZ
          </span>
          <span className="text-sm font-bold tracking-tight text-white hidden sm:block">
            PhoenixZ
          </span>
        </Link>

        {/* Desktop nav links — center */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-white/60 transition duration-200 hover:bg-white/[0.08] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Spacer for mobile */}
        <div className="flex-1 md:hidden" />

        {/* Desktop CTA */}
        <Link
          href="#contact"
          className="hidden md:block rounded-full bg-white text-black text-sm font-medium px-4 py-1.5 transition duration-200 hover:bg-white/90 shrink-0"
        >
          Let&apos;s talk
        </Link>

        {/* Mobile hamburger */}
        <MobileMenu />
      </nav>
    </header>
  );
}

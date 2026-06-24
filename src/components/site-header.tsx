"use client";

import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Studies", href: "#studies" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export { navItems };

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
      <nav className="flex items-center gap-6 rounded-full border border-white/[0.08] backdrop-blur-md bg-[#0A0A0C]/80 px-5 py-2.5 shadow-lg shadow-black/30">
        {/* Logo */}
        <Link href="#hero" className="flex items-center gap-2 shrink-0">
          <span className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-black text-white/80">
            PZ
          </span>
          <span className="text-sm font-bold tracking-tight text-white/80 hidden sm:block">
            PhoenixZ
          </span>
        </Link>

        {/* Desktop nav links — center */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white/45 transition duration-300 hover:bg-white/[0.06] hover:text-white/80"
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
          className="hidden md:block rounded-full border border-white/10 bg-white/[0.08] text-white/70 text-[13px] font-medium px-4 py-1.5 transition duration-300 hover:bg-white/[0.12] hover:text-white/90 shrink-0"
        >
          Let&apos;s talk
        </Link>

        {/* Mobile hamburger */}
        <MobileMenu />
      </nav>
    </header>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Build", href: "#build" },
  { label: "Workflow", href: "#workflow" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  /* Lock body scroll when open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Hamburger toggle */}
      <button
        onClick={toggle}
        className="relative z-50 grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:border-cyan-300/40 hover:text-white md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Full-screen overlay */}
      {open ? (
        <div className="fixed inset-0 z-40 flex flex-col bg-slate-950/95 backdrop-blur-2xl md:hidden">
          {/* Nav links */}
          <nav className="flex flex-1 flex-col items-center justify-center gap-2">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="animate-fade-slide-up rounded-2xl px-8 py-4 text-2xl font-semibold text-slate-100 transition hover:bg-white/[0.06] hover:text-cyan-200"
                style={{ animationDelay: `${0.05 + index * 0.06}s` }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div className="animate-fade-in p-8" style={{ animationDelay: "0.35s" }}>
            <Link
              href="#contact"
              onClick={close}
              className="block rounded-full border border-violet-300/40 bg-violet-400/10 px-6 py-4 text-center text-base font-semibold text-violet-100 transition hover:border-cyan-300/60 hover:text-cyan-100"
            >
              Let&apos;s talk
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}

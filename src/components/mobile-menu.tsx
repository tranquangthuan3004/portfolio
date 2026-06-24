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
        className="relative z-50 grid size-8 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition hover:bg-white/[0.12] hover:text-white md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {/* Full-screen overlay */}
      {open ? (
        <div className="fixed inset-0 z-40 flex flex-col bg-black/95 backdrop-blur-2xl md:hidden">
          {/* Nav links */}
          <nav className="flex flex-1 flex-col items-center justify-center gap-2">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="animate-fade-slide-up rounded-full px-8 py-4 text-2xl font-semibold text-white/80 transition hover:bg-white/[0.06] hover:text-white"
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
              className="block rounded-full bg-white text-black px-6 py-4 text-center text-base font-semibold transition hover:bg-white/90"
            >
              Let&apos;s talk
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}

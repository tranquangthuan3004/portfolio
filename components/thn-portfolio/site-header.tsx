"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import styles from "./site.module.css";
import Wordmark from "./wordmark";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Engineering", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function SiteHeader({ headerAction }: { headerAction?: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const firstDesktopLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    firstMenuLinkRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 721px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (!event.matches) return;

      const focusWasInMobileNavigation =
        document.activeElement === menuButtonRef.current ||
        Boolean(mobileNavRef.current?.contains(document.activeElement));

      setMenuOpen(false);
      if (focusWasInMobileNavigation) firstDesktopLinkRef.current?.focus();
    };

    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a href="#top" className={styles.brandLink} aria-label="Thn. home">
          <Wordmark size="header" />
        </a>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              ref={index === 0 ? firstDesktopLinkRef : undefined}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {headerAction}

        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          onClick={() => setMenuOpen((open) => !open)}
          aria-controls="thn-mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      <nav
        ref={mobileNavRef}
        id="thn-mobile-navigation"
        className={styles.mobileNav}
        aria-label="Mobile navigation"
        hidden={!menuOpen}
      >
        {navItems.map((item, index) => (
          <a
            key={item.href}
            ref={index === 0 ? firstMenuLinkRef : undefined}
            href={item.href}
            onClick={closeMenu}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type CtaLinkProps = {
  href: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
  external?: boolean;
  ariaLabel?: string;
};

export function CtaLink({
  href,
  children,
  icon: Icon,
  variant = "primary",
  external = false,
  ariaLabel,
}: CtaLinkProps) {
  const classes =
    variant === "primary"
      ? "border-transparent bg-cyan-300 text-slate-950 shadow-[0_0_32px_rgba(103,232,249,0.24)] hover:bg-white"
      : "border-white/15 bg-white/[0.04] text-slate-100 hover:border-cyan-300/60 hover:bg-white/[0.08]";

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      aria-label={ariaLabel}
      className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${classes}`}
    >
      {children}
      {Icon ? (
        <Icon className="size-4 transition duration-300 group-hover:translate-x-0.5" />
      ) : null}
    </Link>
  );
}

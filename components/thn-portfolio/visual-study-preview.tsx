"use client";

import type { ReactNode } from "react";
import type { PreviewProfile } from "./preview-motion";
import CorePremiumPreview from "./core-premium-preview";
import styles from "./visual-study.module.css";

type MotionWrapperProps = {
  children: ReactNode;
  className: string;
  id: string;
  profile?: PreviewProfile;
};

type VisualStudyVariant = "monochrome" | "silver";

function VisualStudyRoot({
  variant,
  children,
  className,
  id,
  profile,
  refinedMotion = false,
}: MotionWrapperProps & { variant: VisualStudyVariant; refinedMotion?: boolean }) {
  return (
    <CorePremiumPreview
      className={`${className} ${styles.studyRoot} ${styles[variant]}`}
      id={id}
      profile={profile}
      clampAnchorArrival={variant === "silver"}
      suppressHydrationWarning={variant === "silver"}
      scrollEngine={refinedMotion ? "lenis" : "scroll-smoother"}
      motionProfile={refinedMotion ? "refined" : "default"}
      flowStory={refinedMotion}
    >
      {children}
    </CorePremiumPreview>
  );
}

export function MonochromeVisualStudy(props: MotionWrapperProps) {
  return <VisualStudyRoot {...props} variant="monochrome" />;
}

export function SilverVisualStudy(props: MotionWrapperProps) {
  return <VisualStudyRoot {...props} variant="silver" />;
}

export function SilverRefinedVisualStudy(props: MotionWrapperProps) {
  return <VisualStudyRoot {...props} variant="silver" refinedMotion />;
}

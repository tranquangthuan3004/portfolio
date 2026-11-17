import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { Project } from "@/data/projects";
import ThnPortfolioPage from "./portfolio-page";
import { CorePremiumContentWrapper } from "./core-premium-preview";
import CoreFluidHero, { type CoreHeroIdentityCopy } from "./core-hero";
import EngineeredFlowHero from "./engineered-flow-hero";
import EngineeredFlow from "./engineered-flow";
import {
  MonochromeVisualStudy,
  SilverVisualStudy,
  SilverRefinedVisualStudy,
} from "./visual-study-preview";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site-config";

export type VisualStudyVariant = "monochrome" | "silver";

export function visualStudyMetadata(variant: VisualStudyVariant): Metadata {
  const slug = variant === "monochrome" ? "visual-a" : "visual-b";
  const url = new URL(`/preview/thn-core/${slug}`, SITE_URL).toString();

  return {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    openGraph: { title: SITE_TITLE, description: SITE_DESCRIPTION, url, type: "website" },
    twitter: { card: "summary", title: SITE_TITLE, description: SITE_DESCRIPTION },
    robots: { index: false, follow: false },
  };
}

export default function ThnCoreVisualStudy({
  variant,
  artworkVisual,
  projectIds,
  headerAction,
  identityCopy,
  refinedMotion = false,
}: {
  variant: VisualStudyVariant;
  artworkVisual?: ReactNode;
  projectIds?: readonly Project["id"][];
  headerAction?: ReactNode;
  identityCopy?: CoreHeroIdentityCopy;
  refinedMotion?: boolean;
}) {
  const MotionWrapper = variant === "monochrome"
    ? MonochromeVisualStudy
    : refinedMotion ? SilverRefinedVisualStudy : SilverVisualStudy;

  return (
    <ThnPortfolioPage
      profile="core"
      projectIds={projectIds}
      headerAction={headerAction}
      backgroundVisual={refinedMotion ? <div data-thn-flow-background="" aria-hidden="true"><EngineeredFlow persistent /></div> : undefined}
      motionWrapper={MotionWrapper}
      contentWrapper={CorePremiumContentWrapper}
      heroComposition={refinedMotion ? <EngineeredFlowHero identityCopy={identityCopy} /> : (
        <CoreFluidHero
          mobileLayout="split"
          interactive
          artworkVisual={artworkVisual}
          identityCopy={identityCopy}
          showToolLine={!refinedMotion}
          cinematic={refinedMotion}
        />
      )}
    />
  );
}

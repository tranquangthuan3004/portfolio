import type { Metadata } from "next";
import CorePremiumPreview, { CorePremiumContentWrapper } from "@/components/thn-portfolio/core-premium-preview";
import CoreFluidHero from "@/components/thn-portfolio/core-hero";
import ThnPortfolioPage from "@/components/thn-portfolio/portfolio-page";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: new URL("/preview/thn-core", SITE_URL).toString(),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: false, follow: false },
};

export default function ThnCorePreview() {
  return (
    <ThnPortfolioPage
      profile="core"
      motionWrapper={CorePremiumPreview}
      contentWrapper={CorePremiumContentWrapper}
      heroComposition={<CoreFluidHero mobileLayout="split" interactive />}
    />
  );
}

import type { Metadata } from "next";
import SilverEditorialPortfolio from "@/components/thn-portfolio/silver-editorial-portfolio";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: new URL("/preview/thn-core/v2", SITE_URL).toString(),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: false, follow: false },
};

export default function ThnCoreV2Preview() {
  return <SilverEditorialPortfolio refinedMotion />;
}

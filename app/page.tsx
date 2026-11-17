import type { Metadata } from "next";
import SilverEditorialPortfolio from "@/components/thn-portfolio/silver-editorial-portfolio";
import { SITE_NAME, SITE_TITLE } from "@/lib/site-config";

const HOME_DESCRIPTION =
  "Software Engineering graduate from FPT University with hands-on experience developing web and cross-platform applications through academic projects and practical training.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: HOME_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function HomePage() {
  return <SilverEditorialPortfolio />;
}

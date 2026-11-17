import type { Metadata } from "next";
import SilverEditorialPortfolio from "@/components/thn-portfolio/silver-editorial-portfolio";
import { visualStudyMetadata } from "@/components/thn-portfolio/visual-study-page";

export const metadata: Metadata = visualStudyMetadata("silver");

export default function ThnCoreVisualBPreview() {
  return <SilverEditorialPortfolio />;
}

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL.toString(), changeFrequency: "monthly", priority: 1 }];
}

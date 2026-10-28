import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const ROUTES = [
  "/",
  "/how-to-play",
  "/strategies",
  "/hints",
  "/faq",
  "/about",
  "/privacy-policy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({
    url: `${SITE.url}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}

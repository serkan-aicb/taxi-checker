import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

const SITE_URL = "https://taxi-checker.de";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: driversRaw } = await supabase
    .from("driver_profiles")
    .select("slug, created_at")
    .order("created_at", { ascending: false });

  const drivers = (driversRaw ?? []) as { slug: string; created_at: string }[];

  const driverUrls: MetadataRoute.Sitemap = drivers.map((d) => ({
    url: `${SITE_URL}/fahrer/${d.slug}`,
    lastModified: new Date(d.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/fahrer`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/impressum`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/datenschutz`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
  ];

  return [...staticPages, ...driverUrls];
}

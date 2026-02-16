import type { MetadataRoute } from "next";
import { getAllPresets } from "@/lib/presets";
import { getAllSkills } from "@/lib/skills";

export const dynamic = "force-static";

const BASE_URL = "https://clawsets.ai";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const presets = await getAllPresets();
  const skills = await getAllSkills(presets);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/docs`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const presetPages: MetadataRoute.Sitemap = presets.map((preset) => ({
    url: `${BASE_URL}/${preset.name}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const skillPages: MetadataRoute.Sitemap = Object.keys(skills).map(
    (slug) => ({
      url: `${BASE_URL}/skill/${slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    })
  );

  return [...staticPages, ...presetPages, ...skillPages];
}

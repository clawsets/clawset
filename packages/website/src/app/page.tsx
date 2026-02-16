import { getAllPresets } from "@/lib/presets";
import { getAllSkills } from "@/lib/skills";
import { SearchPresets } from "@/components/search-presets";
import { HeroSection } from "@/components/hero-section";
import { JsonLdScript } from "next-seo";

export default async function HomePage() {
  const presets = await getAllPresets();
  const skills = await getAllSkills(presets);

  return (
    <div>
      <JsonLdScript
        scriptKey="website"
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Clawsets",
          url: "https://clawsets.ai",
          description: "Presets that give your lobster superpowers",
        }}
      />
      <HeroSection />
      <SearchPresets presets={presets} skills={skills} />
    </div>
  );
}

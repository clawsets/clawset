import { getAllPresets } from "@/lib/presets";
import { getAllSkills } from "@/lib/skills";
import { SearchPresets } from "@/components/search-presets";
import { HeroSection } from "@/components/hero-section";

export default async function HomePage() {
  const presets = await getAllPresets();
  const skills = await getAllSkills(presets);

  return (
    <div>
      <HeroSection />
      <SearchPresets presets={presets} skills={skills} />
    </div>
  );
}

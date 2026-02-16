import { getAllPresets } from "@/lib/presets";
import { SearchPresets } from "@/components/search-presets";
import { HeroSection } from "@/components/hero-section";

export default async function HomePage() {
  const presets = await getAllPresets();

  return (
    <div>
      <HeroSection />
      <SearchPresets presets={presets} />
    </div>
  );
}

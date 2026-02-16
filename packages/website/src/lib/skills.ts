import { prettyName } from "./utils";
import type { PresetData, SkillData } from "./types";

const CLAWHUB_API = "https://clawhub.ai/api/v1/skills";

interface ClawHubResponse {
  skill: {
    slug: string;
    displayName?: string;
    summary?: string;
    stats?: { downloads: number; stars: number; installs: number };
  };
  latestVersion?: { version: string; createdAt?: string; changelog?: string } | string;
  owner?: { handle: string; displayName?: string; image?: string };
  moderation?: { isSuspicious: boolean; isMalwareBlocked: boolean } | null;
}

async function fetchSkillFromHub(
  slug: string
): Promise<ClawHubResponse | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${CLAWHUB_API}/${slug}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return (await res.json()) as ClawHubResponse;
  } catch {
    return null;
  }
}

function buildSkillData(
  slug: string,
  hub: ClawHubResponse | null,
  presetNames: string[]
): SkillData {
  if (hub) {
    return {
      slug,
      displayName: hub.skill.displayName ?? prettyName(slug),
      summary: hub.skill.summary ?? null,
      owner: hub.owner ?? null,
      moderation: hub.moderation ?? null,
      stats: hub.skill.stats
        ? {
            downloads: hub.skill.stats.downloads ?? 0,
            stars: hub.skill.stats.stars ?? 0,
            installs: hub.skill.stats.installs ?? 0,
          }
        : null,
      version: hub.latestVersion
        ? typeof hub.latestVersion === "string"
          ? hub.latestVersion
          : hub.latestVersion.version
        : null,
      presets: presetNames,
      source: "clawhub",
    };
  }
  return {
    slug,
    displayName: prettyName(slug),
    summary: null,
    owner: null,
    moderation: null,
    stats: null,
    version: null,
    presets: presetNames,
    source: "native",
  };
}

export async function getAllSkills(
  presets: PresetData[]
): Promise<Record<string, SkillData>> {
  const skillToPresets = new Map<string, string[]>();
  for (const preset of presets) {
    for (const skill of preset.skills) {
      const list = skillToPresets.get(skill) ?? [];
      list.push(preset.name);
      skillToPresets.set(skill, list);
    }
  }

  const slugs = Array.from(skillToPresets.keys());
  const results = await Promise.all(slugs.map(fetchSkillFromHub));

  const skills: Record<string, SkillData> = {};
  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    skills[slug] = buildSkillData(slug, results[i], skillToPresets.get(slug)!);
  }
  return skills;
}

export function isPresetVerified(
  preset: PresetData,
  skills: Record<string, SkillData>
): boolean {
  if (preset.skills.length === 0) return false;
  return preset.skills.every((s) => {
    const skill = skills[s];
    return (
      skill &&
      skill.source === "clawhub" &&
      !skill.moderation?.isSuspicious &&
      !skill.moderation?.isMalwareBlocked
    );
  });
}

export async function getSkillByName(
  name: string,
  presets: PresetData[]
): Promise<SkillData | undefined> {
  const presetNames = presets
    .filter((p) => p.skills.includes(name))
    .map((p) => p.name);
  if (presetNames.length === 0) return undefined;
  const hub = await fetchSkillFromHub(name);
  return buildSkillData(name, hub, presetNames);
}

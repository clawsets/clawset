export interface PresetData {
  name: string;
  version: string;
  description: string;
  skills: string[];
  configure?: string[];
  cron?: string;
  docs: Record<string, string>;
  identityEmoji: string;
  downloads: number;
}

export interface SkillData {
  slug: string;
  displayName: string;
  summary: string | null;
  owner: { handle: string; displayName?: string; image?: string } | null;
  moderation: { isSuspicious: boolean; isMalwareBlocked: boolean } | null;
  stats: { downloads: number; stars: number; installs: number } | null;
  version: string | null;
  presets: string[];
  source: "clawhub" | "native";
}

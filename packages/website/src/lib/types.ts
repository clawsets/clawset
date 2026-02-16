export interface PresetData {
  name: string;
  version: string;
  description: string;
  skills: string[];
  configure?: string[];
  cron?: string;
  soulMd: string;
  identityEmoji: string;
  downloads: number;
}

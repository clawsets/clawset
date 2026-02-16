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

import fs from "node:fs";
import path from "node:path";
import type { PresetData } from "./types";

const PRESETS_DIR = path.resolve(process.cwd(), "../../presets");

function parseEmoji(identityMd: string): string {
  const match = identityMd.match(/\*\*Emoji:\*\*\s*(.+)/);
  return match ? match[1].trim() : "\uD83E\uDD16";
}

async function fetchDownloads(packageName: string): Promise<number> {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${packageName}`
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return data.downloads ?? 0;
  } catch {
    return 0;
  }
}

async function readPreset(dir: string): Promise<PresetData> {
  const pkgPath = path.join(dir, "package.json");
  const specPath = path.join(dir, "src", "spec.json");
  const soulPath = path.join(dir, "src", "SOUL.md");
  const identityPath = path.join(dir, "src", "IDENTITY.md");

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const spec = JSON.parse(fs.readFileSync(specPath, "utf-8"));

  const shortName = (pkg.name as string).replace("@clawset/", "");

  const soulMd = fs.existsSync(soulPath)
    ? fs.readFileSync(soulPath, "utf-8")
    : "";
  const identityMd = fs.existsSync(identityPath)
    ? fs.readFileSync(identityPath, "utf-8")
    : "";

  const downloads = await fetchDownloads(pkg.name);

  return {
    name: shortName,
    version: pkg.version,
    description: pkg.description,
    skills: spec.skills ?? [],
    configure: spec.configure,
    cron: spec.cron,
    soulMd,
    identityEmoji: parseEmoji(identityMd),
    downloads,
  };
}

export async function getAllPresets(): Promise<PresetData[]> {
  const entries = fs.readdirSync(PRESETS_DIR, { withFileTypes: true });
  const presets = await Promise.all(
    entries
      .filter(
        (e) =>
          e.isDirectory() &&
          fs.existsSync(path.join(PRESETS_DIR, e.name, "package.json"))
      )
      .map((e) => readPreset(path.join(PRESETS_DIR, e.name)))
  );
  return presets.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPresetByName(
  name: string
): Promise<PresetData | undefined> {
  const dir = path.join(PRESETS_DIR, name);
  if (
    !fs.existsSync(dir) ||
    !fs.existsSync(path.join(dir, "package.json"))
  ) {
    return undefined;
  }
  return readPreset(dir);
}

export async function getAllPresetNames(): Promise<string[]> {
  const presets = await getAllPresets();
  return presets.map((p) => p.name);
}

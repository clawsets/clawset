import fs from "node:fs";
import path from "node:path";
import type { PresetData } from "./types";

const PRESETS_DIR = path.resolve(process.cwd(), "../../presets");

interface UnpkgMeta {
  files?: { path: string; type: string }[];
}

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

async function fetchDocs(
  packageName: string
): Promise<Record<string, string>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const metaRes = await fetch(
      `https://unpkg.com/${packageName}/src/?meta`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!metaRes.ok) return {};

    const meta: UnpkgMeta = await metaRes.json();
    if (!meta.files) return {};

    const mdFiles = meta.files.filter(
      (f) => f.type === "file" && f.path.endsWith(".md")
    );

    const entries = await Promise.all(
      mdFiles.map(async (f) => {
        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 5000);
          const res = await fetch(
            `https://unpkg.com/${packageName}/src${f.path}`,
            { signal: ctrl.signal }
          );
          clearTimeout(t);
          if (!res.ok) return null;
          const content = await res.text();
          const key = path.basename(f.path);
          return [key, content] as const;
        } catch {
          return null;
        }
      })
    );

    const docs: Record<string, string> = {};
    for (const entry of entries) {
      if (entry) docs[entry[0]] = entry[1];
    }
    return docs;
  } catch {
    return {};
  }
}

function readLocalDocs(dir: string): Record<string, string> {
  const srcDir = path.join(dir, "src");
  if (!fs.existsSync(srcDir)) return {};
  const docs: Record<string, string> = {};
  for (const file of fs.readdirSync(srcDir)) {
    if (file.endsWith(".md")) {
      docs[file] = fs.readFileSync(
        path.join(srcDir, file),
        "utf-8"
      );
    }
  }
  return docs;
}

async function readPreset(dir: string): Promise<PresetData> {
  const pkgPath = path.join(dir, "package.json");
  const specPath = path.join(dir, "src", "spec.json");

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const spec = JSON.parse(fs.readFileSync(specPath, "utf-8"));

  const shortName = (pkg.name as string).replace("@clawset/", "");

  const [downloads, npmDocs] = await Promise.all([
    fetchDownloads(pkg.name),
    fetchDocs(pkg.name),
  ]);

  const docs =
    Object.keys(npmDocs).length > 0 ? npmDocs : readLocalDocs(dir);

  return {
    name: shortName,
    version: pkg.version,
    description: pkg.description,
    skills: spec.skills ?? [],
    configure: spec.configure,
    cron: spec.cron,
    docs,
    identityEmoji: parseEmoji(docs["IDENTITY.md"] ?? ""),
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

import pacote from "pacote";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { ClawPresetSchema, ClawPresetConfigSchema } from "./types.js";
import type { ClawPreset } from "./types.js";

const SCOPE = "@clawset";
const CACHE_DIR = path.join(os.tmpdir(), "clawset-cache");

/** Converts a short name like `"issue-triage"` to `"@clawset/issue-triage"`. */
export function resolvePackageName(name: string): string {
  if (name.startsWith(SCOPE + "/")) return name;
  return `${SCOPE}/${name}`;
}

/** Ensures a package is extracted to the cache dir, returns the extraction path. */
async function ensureExtracted(name: string): Promise<string> {
  const pkgName = resolvePackageName(name);
  const shortName = pkgName.replace(`${SCOPE}/`, "");
  const extractDir = path.join(CACHE_DIR, shortName);

  await fs.rm(extractDir, { recursive: true, force: true });
  await fs.mkdir(extractDir, { recursive: true });
  await pacote.extract(pkgName, extractDir);

  return extractDir;
}

/**
 * Fetches a preset's npm metadata and `spec.json`, returns a validated `ClawPreset`.
 * Extracts the tarball to read `spec.json` for clawset-specific config.
 */
export async function fetchPresetManifest(name: string): Promise<ClawPreset> {
  const pkgName = resolvePackageName(name);
  const manifest = await pacote.manifest(pkgName, { fullMetadata: true });
  const shortName = manifest.name!.replace(`${SCOPE}/`, "");

  const extractDir = await ensureExtracted(shortName);
  const specRaw = await fs.readFile(
    path.join(extractDir, "src", "spec.json"),
    "utf-8"
  );
  const spec = JSON.parse(specRaw);
  const config = ClawPresetConfigSchema.parse(spec);

  return ClawPresetSchema.parse({
    name: shortName,
    version: manifest.version,
    description: manifest.description ?? "",
    skills: config.skills,
    configure: config.configure,
    cron: config.cron,
  });
}

/**
 * Returns the path to the `src/` directory containing `.md` template files.
 * Extracts the tarball if not already cached.
 */
export async function fetchPresetFiles(name: string): Promise<string> {
  const extractDir = await ensureExtracted(name);
  return path.join(extractDir, "src");
}

/**
 * Queries the npm registry search endpoint to discover all `@clawset/*`
 * packages tagged with the `preset` keyword.
 */
export async function listAvailablePresets(): Promise<ClawPreset[]> {
  const url =
    "https://registry.npmjs.org/-/v1/search?text=scope:clawset+keywords:preset&size=100";

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `npm registry search failed: ${res.status} ${res.statusText}`
    );
  }

  const data = (await res.json()) as {
    objects: Array<{
      package: {
        name: string;
        version: string;
        description?: string;
      };
    }>;
  };

  const presets: ClawPreset[] = [];

  for (const obj of data.objects) {
    const pkg = obj.package;
    try {
      const preset = await fetchPresetManifest(pkg.name);
      presets.push(preset);
    } catch {
      // Skip packages that don't have valid spec.json
    }
  }

  return presets.sort((a, b) => a.name.localeCompare(b.name));
}

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const presetsDir = path.resolve(__dirname, "../../../presets");
const destDir = path.resolve(__dirname, "../dist/presets");

// Ensure dest directory exists
fs.mkdirSync(destDir, { recursive: true });

// Copy all non-TypeScript files from each preset folder
const presetFolders = fs.readdirSync(presetsDir, { withFileTypes: true });

for (const entry of presetFolders) {
  if (!entry.isDirectory()) continue;

  const presetName = entry.name;
  const presetSrcDir = path.join(presetsDir, presetName);
  const presetDestDir = path.join(destDir, presetName);

  fs.mkdirSync(presetDestDir, { recursive: true });

  const files = fs.readdirSync(presetSrcDir);
  for (const file of files) {
    // Skip TypeScript source files — only copy workspace templates
    if (file.endsWith(".ts")) continue;

    fs.copyFileSync(
      path.join(presetSrcDir, file),
      path.join(presetDestDir, file)
    );
    console.log(`Copied: ${presetName}/${file}`);
  }
}

console.log("Preset templates copied successfully.");

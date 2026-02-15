import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ClawPresetSchema } from "../src/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.resolve(__dirname, "../preset.schema.json");

const jsonSchema = zodToJsonSchema(ClawPresetSchema) as Record<string, unknown>;

// Add $schema as an allowed property so additionalProperties: false doesn't reject it
if (jsonSchema.properties && typeof jsonSchema.properties === "object") {
  (jsonSchema.properties as Record<string, unknown>)["$schema"] = {
    type: "string",
  };
}

jsonSchema.additionalProperties = false;

fs.writeFileSync(outFile, JSON.stringify(jsonSchema, null, 2) + "\n", "utf-8");
console.log(`Generated preset schema: ${outFile}`);

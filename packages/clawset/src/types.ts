import { z } from "zod";

export const ClawPresetSchema = z.object({
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string(),
  skills: z.array(z.string()).min(1),
  configure: z.array(z.string()).optional(),
  cron: z.string().optional(),
});

export type ClawPreset = z.infer<typeof ClawPresetSchema>;

export interface StepResult {
  step: string;
  success: boolean;
  message: string;
  error?: Error;
}

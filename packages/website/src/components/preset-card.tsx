import Link from "next/link";
import { Download, Clock, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { SkillBadge, SkillBadgePlain } from "@/components/skill-badge";
import { isPresetVerified } from "@/lib/skills";
import { cronToHuman } from "@/lib/cron";
import { prettyName } from "@/lib/utils";
import type { PresetData, SkillData } from "@/lib/types";

function formatDownloads(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 10_000) return `${(count / 1_000).toFixed(1)}k`;
  return count.toLocaleString();
}

export function PresetCard({
  preset,
  skills,
}: {
  preset: PresetData;
  skills: Record<string, SkillData>;
}) {
  const verified = isPresetVerified(preset, skills);

  return (
    <Link href={`/${preset.name}`}>
      <Card className="flex h-full flex-col transition-colors hover:border-accent/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-2xl">{preset.identityEmoji}</span>
            <div className="relative min-w-0 flex-1 overflow-hidden">
              <CardTitle className="whitespace-nowrap">
                {prettyName(preset.name)}
              </CardTitle>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent" />
            </div>
            {verified && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex shrink-0 text-green-500">
                    <ShieldCheck size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent>All skills verified</TooltipContent>
              </Tooltip>
            )}
            <div className="flex shrink-0 items-center gap-1 text-xs text-muted">
              <Download size={14} />
              <span>{formatDownloads(preset.downloads)}</span>
            </div>
          </div>
          <CardDescription>{preset.description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
          <div className="flex flex-wrap items-center gap-1.5">
            {preset.skills.map((skill) =>
              skills[skill] ? (
                <SkillBadge key={skill} skill={skills[skill]} linked={false} />
              ) : (
                <SkillBadgePlain key={skill} name={skill} />
              )
            )}
            {preset.cron && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex cursor-default text-muted">
                    <Clock size={14} />
                  </span>
                </TooltipTrigger>
                <TooltipContent>{cronToHuman(preset.cron)}</TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

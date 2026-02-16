import Link from "next/link";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cronToHuman } from "@/lib/cron";
import type { PresetData } from "@/lib/types";

function formatDownloads(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 10_000) return `${(count / 1_000).toFixed(1)}k`;
  return count.toLocaleString();
}

export function PresetCard({ preset }: { preset: PresetData }) {
  return (
    <Link href={`/${preset.name}`}>
      <Card className="flex h-full flex-col transition-colors hover:border-accent/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-2xl">{preset.identityEmoji}</span>
            <div className="relative min-w-0 flex-1 overflow-hidden">
              <CardTitle className="whitespace-nowrap">
                {preset.name}
              </CardTitle>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent" />
            </div>
            <div className="flex shrink-0 items-center gap-1 text-xs text-muted">
              <Download size={14} />
              <span>{formatDownloads(preset.downloads)}</span>
            </div>
          </div>
          <CardDescription>{preset.description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {preset.skills.map((skill) => (
              <Badge key={skill} variant="accent">
                {skill}
              </Badge>
            ))}
            {preset.cron && (
              <Badge variant="outline">{cronToHuman(preset.cron)}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

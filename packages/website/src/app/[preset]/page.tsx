import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPresetNames, getPresetByName, getAllPresets } from "@/lib/presets";
import { getAllSkills, isPresetVerified } from "@/lib/skills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkillBadge, SkillBadgePlain } from "@/components/skill-badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { InstallCommand } from "@/components/install-command";
import { PresetDocs } from "@/components/preset-docs";
import { cronToHuman } from "@/lib/cron";
import { prettyName } from "@/lib/utils";
import { Download, ShieldCheck } from "lucide-react";
import { SoftwareApplicationJsonLd } from "next-seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ preset: string }>;
}): Promise<Metadata> {
  const { preset: name } = await params;
  const preset = await getPresetByName(name);
  return {
    title: preset ? `Clawsets | ${prettyName(preset.name)}` : "Clawsets",
    description: preset?.description,
  };
}

export async function generateStaticParams() {
  const names = await getAllPresetNames();
  return names.map((name) => ({ preset: name }));
}

export default async function PresetPage({
  params,
}: {
  params: Promise<{ preset: string }>;
}) {
  const { preset: name } = await params;
  const preset = await getPresetByName(name);

  if (!preset) {
    notFound();
  }

  const allPresets = await getAllPresets();
  const skills = await getAllSkills(allPresets);

  const reportUrl = `https://github.com/clawsets/clawset/issues/new?title=${encodeURIComponent(`[Preset] ${preset.name}:`)}&labels=preset`;

  return (
    <div>
      <SoftwareApplicationJsonLd
        name={prettyName(preset.name)}
        description={preset.description}
        applicationCategory="DeveloperApplication"
        operatingSystem="Any"
        offers={{ price: 0, priceCurrency: "USD" }}
      />
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="shrink-0 text-4xl">{preset.identityEmoji}</span>
          <h1 className="min-w-0 truncate text-3xl font-bold">{prettyName(preset.name)}</h1>
          {isPresetVerified(preset, skills) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex shrink-0 text-green-500">
                  <ShieldCheck size={20} />
                </span>
              </TooltipTrigger>
              <TooltipContent>All skills verified</TooltipContent>
            </Tooltip>
          )}
          <Badge variant="outline">v{preset.version}</Badge>
          <div className="ml-auto flex shrink-0 items-center gap-1 text-sm text-muted">
            <Download size={16} />
            <span>{preset.downloads.toLocaleString()} / week</span>
          </div>
        </div>
        <p className="text-lg text-muted">{preset.description}</p>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-medium text-muted uppercase tracking-wider">
            Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {preset.skills.map((skill) =>
              skills[skill] ? (
                <SkillBadge key={skill} skill={skills[skill]} />
              ) : (
                <SkillBadgePlain key={skill} name={skill} />
              )
            )}
          </div>
        </div>

        {preset.configure && preset.configure.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-medium text-muted uppercase tracking-wider">
              Configure
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {preset.configure.map((c) => (
                <Badge key={c}>{c}</Badge>
              ))}
            </div>
          </div>
        )}

        {preset.cron && (
          <div>
            <h2 className="mb-2 text-sm font-medium text-muted uppercase tracking-wider">
              Schedule
            </h2>
            <p className="text-sm">
              {cronToHuman(preset.cron)}{" "}
              <span className="text-muted font-mono text-xs">
                ({preset.cron})
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-muted uppercase tracking-wider">
          Install
        </h2>
        <InstallCommand command={`npx clawset ${preset.name}`} />
      </div>

      <PresetDocs docs={preset.docs} />

      <div className="flex gap-3">
        <a href={reportUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">Report Issue</Button>
        </a>
        <a
          href={`https://github.com/clawsets/clawset/tree/main/presets/${preset.name}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost">View Source</Button>
        </a>
      </div>
    </div>
  );
}

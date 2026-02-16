import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPresetNames, getPresetByName } from "@/lib/presets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InstallCommand } from "@/components/install-command";
import { MarkdownContent } from "@/components/markdown-content";
import { cronToHuman } from "@/lib/cron";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ preset: string }>;
}): Promise<Metadata> {
  const { preset: name } = await params;
  const preset = await getPresetByName(name);
  return {
    title: preset ? `Clawsets | ${preset.name}` : "Clawsets",
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

  const reportUrl = `https://github.com/clawsets/clawset/issues/new?title=${encodeURIComponent(`[Preset] ${preset.name}:`)}&labels=preset`;

  return (
    <div>
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-4xl">{preset.identityEmoji}</span>
          <h1 className="text-3xl font-bold">{preset.name}</h1>
          <Badge variant="outline">v{preset.version}</Badge>
        </div>
        <p className="text-lg text-muted">{preset.description}</p>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-medium text-muted uppercase tracking-wider">
            Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {preset.skills.map((skill) => (
              <Badge key={skill} variant="accent">
                {skill}
              </Badge>
            ))}
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

        <div>
          <h2 className="mb-2 text-sm font-medium text-muted uppercase tracking-wider">
            Weekly Downloads
          </h2>
          <p className="text-sm">{preset.downloads.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-muted uppercase tracking-wider">
          Install
        </h2>
        <InstallCommand command={`npx clawset ${preset.name}`} />
      </div>

      {preset.soulMd && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-medium text-muted uppercase tracking-wider">
            About
          </h2>
          <div className="rounded-xl border border-border bg-surface p-6">
            <MarkdownContent content={preset.soulMd} />
          </div>
        </div>
      )}

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

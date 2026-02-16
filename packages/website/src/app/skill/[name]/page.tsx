import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPresets } from "@/lib/presets";
import { getAllSkills, getSkillByName } from "@/lib/skills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PresetCard } from "@/components/preset-card";
import {
  ExternalLink,
  Download,
  Star,
  Package,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  BadgeCheck,
  BadgeAlert,
} from "lucide-react";

export async function generateStaticParams() {
  const presets = await getAllPresets();
  const skills = await getAllSkills(presets);
  return Object.keys(skills).map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const presets = await getAllPresets();
  const skill = await getSkillByName(name, presets);
  return {
    title: skill
      ? `Clawsets | Skill: ${skill.displayName}`
      : "Clawsets | Skill",
    description: skill?.summary ?? `Details for the ${name} skill`,
  };
}

function AntivirusStatus({
  moderation,
  source,
}: {
  moderation: { isSuspicious: boolean; isMalwareBlocked: boolean } | null;
  source: "clawhub" | "native";
}) {
  if (source === "native") {
    return (
      <div className="flex items-center gap-2">
        <ShieldCheck size={16} className="text-blue-500" />
        <span className="text-sm text-muted">Native — not scanned</span>
      </div>
    );
  }
  if (moderation?.isMalwareBlocked) {
    return (
      <div className="flex items-center gap-2">
        <ShieldX size={16} className="text-red-500" />
        <span className="text-sm text-red-500 font-medium">Malware detected</span>
      </div>
    );
  }
  if (moderation?.isSuspicious) {
    return (
      <div className="flex items-center gap-2">
        <ShieldAlert size={16} className="text-yellow-500" />
        <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Suspicious code flagged</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <ShieldCheck size={16} className="text-green-500" />
      <span className="text-sm text-muted">Clean — no threats found</span>
    </div>
  );
}

function TrustedStatus({
  moderation,
  source,
}: {
  moderation: { isSuspicious: boolean; isMalwareBlocked: boolean } | null;
  source: "clawhub" | "native";
}) {
  if (source === "native") {
    return (
      <div className="flex items-center gap-2">
        <BadgeCheck size={16} className="text-blue-500" />
        <span className="text-sm text-muted">Built-in skill</span>
      </div>
    );
  }
  if (moderation?.isMalwareBlocked || moderation?.isSuspicious) {
    return (
      <div className="flex items-center gap-2">
        <BadgeAlert size={16} className="text-red-500" />
        <span className="text-sm text-red-500 font-medium">Not trusted</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <BadgeCheck size={16} className="text-green-500" />
      <span className="text-sm text-muted">Trusted</span>
    </div>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const presets = await getAllPresets();
  const skill = await getSkillByName(name, presets);

  if (!skill) {
    notFound();
  }

  const allSkills = await getAllSkills(presets);
  const usedByPresets = presets.filter((p) => skill.presets.includes(p.name));

  return (
    <div>
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <h1 className="text-3xl font-bold">{skill.displayName}</h1>
          <Badge variant={skill.source === "clawhub" ? "accent" : "outline"}>
            {skill.source === "clawhub" ? "ClawHub" : "Native"}
          </Badge>
          {skill.version && (
            <Badge variant="outline">v{skill.version}</Badge>
          )}
        </div>
        {skill.summary && (
          <p className="text-lg text-muted">{skill.summary}</p>
        )}
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-medium text-muted uppercase tracking-wider">
            Antivirus
          </h2>
          <AntivirusStatus
            moderation={skill.moderation}
            source={skill.source}
          />
        </div>

        <div>
          <h2 className="mb-2 text-sm font-medium text-muted uppercase tracking-wider">
            Trusted
          </h2>
          <TrustedStatus
            moderation={skill.moderation}
            source={skill.source}
          />
        </div>

        {skill.owner && (
          <div>
            <h2 className="mb-2 text-sm font-medium text-muted uppercase tracking-wider">
              Owner
            </h2>
            <div className="flex items-center gap-2">
              {skill.owner.image && (
                <img
                  src={skill.owner.image}
                  alt={skill.owner.handle}
                  className="h-6 w-6 rounded-full"
                />
              )}
              <span className="text-sm">
                {skill.owner.displayName ?? skill.owner.handle}
              </span>
              <span className="text-sm text-muted">@{skill.owner.handle}</span>
            </div>
          </div>
        )}

        {skill.stats && (
          <div>
            <h2 className="mb-2 text-sm font-medium text-muted uppercase tracking-wider">
              Stats
            </h2>
            <div className="flex gap-4 text-sm">
              {skill.stats.downloads != null && (
                <span className="flex items-center gap-1">
                  <Download size={14} className="text-muted" />
                  {formatNumber(skill.stats.downloads)}
                </span>
              )}
              {skill.stats.stars != null && (
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-muted" />
                  {formatNumber(skill.stats.stars)}
                </span>
              )}
              {skill.stats.installs != null && (
                <span className="flex items-center gap-1">
                  <Package size={14} className="text-muted" />
                  {formatNumber(skill.stats.installs)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-muted uppercase tracking-wider">
          Used by Presets
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {usedByPresets.map((preset) => (
            <PresetCard key={preset.name} preset={preset} skills={allSkills} />
          ))}
        </div>
      </div>

      {skill.source === "clawhub" && (
        <a
          href={`https://clawhub.ai/skills/${skill.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="gap-2">
            <ExternalLink size={16} />
            View on ClawHub
          </Button>
        </a>
      )}
    </div>
  );
}

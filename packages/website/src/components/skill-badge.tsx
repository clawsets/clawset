import Link from "next/link";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SkillData } from "@/lib/types";

function StatusIcon({ skill }: { skill: SkillData }) {
  if (skill.source === "native")
    return <ShieldCheck size={12} className="shrink-0 text-blue-500" />;
  if (skill.moderation?.isMalwareBlocked)
    return <ShieldX size={12} className="shrink-0 text-red-500" />;
  if (skill.moderation?.isSuspicious)
    return <ShieldAlert size={12} className="shrink-0 text-yellow-500" />;
  return <ShieldCheck size={12} className="shrink-0 text-green-500" />;
}

export function SkillBadge({
  skill,
  linked = true,
}: {
  skill: SkillData;
  linked?: boolean;
}) {
  const badge = (
    <Badge
      variant="accent"
      className={cn("gap-1.5", linked && "cursor-pointer hover:bg-accent/20")}
    >
      <StatusIcon skill={skill} />
      {skill.slug}
    </Badge>
  );

  if (!linked) return badge;

  return <Link href={`/skill/${skill.slug}`}>{badge}</Link>;
}

export function SkillBadgePlain({ name }: { name: string }) {
  return (
    <Badge variant="accent">
      {name}
    </Badge>
  );
}

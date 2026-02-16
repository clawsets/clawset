"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function CommandBlock({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg border border-border bg-background px-4 py-3 pr-16 font-mono text-sm text-foreground">
        <span className="text-muted select-none">$ </span>
        {command}
      </pre>
      <button
        onClick={copy}
        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md border border-border bg-surface p-1.5 text-muted transition-all hover:text-foreground"
        aria-label="Copy command"
      >
        {copied ? (
          <Check size={14} className="text-success" />
        ) : (
          <Copy size={14} />
        )}
      </button>
    </div>
  );
}

export function InstallCommand({ command }: { command: string }) {
  const args = command.replace(/^npx /, "");
  const commands = {
    npm: `npx ${args}`,
    pnpm: `pnpm dlx ${args}`,
    bun: `bunx ${args}`,
  };

  return (
    <Tabs defaultValue="npm">
      <TabsList>
        <TabsTrigger value="npm">npm</TabsTrigger>
        <TabsTrigger value="pnpm">pnpm</TabsTrigger>
        <TabsTrigger value="bun">bun</TabsTrigger>
      </TabsList>
      {Object.entries(commands).map(([key, cmd]) => (
        <TabsContent key={key} value={key}>
          <CommandBlock command={cmd} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

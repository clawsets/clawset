"use client";

import { marked } from "marked";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function sortKeys(keys: string[]): string[] {
  return [...keys].sort((a, b) => {
    const aIsSoul = a === "SOUL.md";
    const bIsSoul = b === "SOUL.md";
    if (aIsSoul !== bIsSoul) return aIsSoul ? -1 : 1;
    return a.localeCompare(b);
  });
}

export function PresetDocs({ docs }: { docs: Record<string, string> }) {
  const keys = sortKeys(Object.keys(docs));
  if (keys.length === 0) return null;

  if (keys.length === 1) {
    const html = marked.parse(docs[keys[0]], { async: false }) as string;
    return (
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-muted uppercase tracking-wider">
          {keys[0]}
        </h2>
        <div className="rounded-xl border border-border bg-surface p-6">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <Tabs defaultValue={keys[0]}>
        <TabsList variant="line">
          {keys.map((key) => (
            <TabsTrigger key={key} value={key}>
              {key}
            </TabsTrigger>
          ))}
        </TabsList>
        {keys.map((key) => {
          const html = marked.parse(docs[key], { async: false }) as string;
          return (
            <TabsContent key={key} value={key}>
              <div className="rounded-xl border border-border bg-surface p-6">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

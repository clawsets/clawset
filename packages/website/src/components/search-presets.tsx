"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { PresetCard } from "@/components/preset-card";
import type { PresetData } from "@/lib/types";

export function SearchPresets({ presets }: { presets: PresetData[] }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "/" || (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key))) {
        e.preventDefault();
        inputRef.current?.focus();
        if (e.key !== "/") {
          setQuery((q) => q + e.key);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = presets.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="relative mb-8">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder='Search presets by name, skill, or keyword...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex h-10 w-full rounded-md border border-border bg-surface pl-9 pr-10 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted">
          /
        </kbd>
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-muted py-12">
          No presets match &ldquo;{query}&rdquo;
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((preset) => (
            <PresetCard key={preset.name} preset={preset} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Check } from "lucide-react";

const COMMANDS = [
  "deep-research",
  "competitor-radar",
  "issue-triage",
  "list",
  "run deep-research",
];

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % COMMANDS.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const command = `npx clawset ${COMMANDS[index]}`;

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [command]);

  return (
    <section className="mb-16 grid items-center gap-10 md:grid-cols-2">
      <div>
        <div className="mb-3 flex items-center gap-3">
          <img
            src="/clawsets-logo.png"
            alt="Clawsets logo"
            width={56}
            height={56}
          />
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-accent">Clawsets</span>
          </h1>
        </div>
        <p className="mb-6 text-lg text-muted">
          Presets that give your lobster superpowers
        </p>
        <div className="group relative">
          <pre className="overflow-x-auto rounded-lg border border-border bg-background px-4 py-3 pr-16 font-mono text-sm text-foreground">
            <span className="text-muted select-none">$ </span>
            <span>npx clawset </span>
            <span
              key={index}
              className="inline-block text-accent animate-[fadeIn_0.4s_ease-in-out]"
            >
              {COMMANDS[index]}
            </span>
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
      </div>

      <p className="text-lg leading-relaxed text-muted">
        Clawsets are drop-in automation presets for{" "}
        <a href="https://openclaw.ai" target="_blank" rel="nofollow noopener noreferrer" className="text-foreground font-medium underline underline-offset-2 hover:text-accent">OpenClaw</a>. Each
        preset bundles an identity, skills, schedules, and configuration into a
        single package, ready to install, customize, and run in seconds.
      </p>
    </section>
  );
}

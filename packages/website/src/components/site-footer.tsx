import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} clawsets.ai. All rights reserved.
        </p>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-muted transition-colors hover:text-foreground"
          >
            Presets
          </Link>
          <Link
            href="/docs"
            className="text-muted transition-colors hover:text-foreground"
          >
            Docs
          </Link>
          <a
            href="https://github.com/clawsets/clawset"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}

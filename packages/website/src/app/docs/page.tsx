import type { Metadata } from "next";
import { InstallCommand } from "@/components/install-command";
import { FAQJsonLd } from "next-seo";

export const metadata: Metadata = {
  title: "Docs | Clawsets",
  description: "Learn how to install, use, and contribute to OpenClaw presets.",
};

export default function DocsPage() {
  return (
    <div className="space-y-16">
      <FAQJsonLd
        questions={[
          {
            question: "What is OpenClaw?",
            answer:
              "OpenClaw is an open-source framework for building autonomous AI agents. It provides a structured way to define agent identity, behavior, tools, and schedules using simple markdown and JSON files.",
          },
          {
            question: "What are skills?",
            answer:
              "Skills are capabilities that a preset uses, like github, slack, or summarize. Each skill maps to a set of tools the agent can use during execution.",
          },
          {
            question: "How do schedules work?",
            answer:
              "Presets can define a cron field in their spec.json to run on a schedule. For example, 0 9 * * 1-5 means the agent runs at 9:00 AM on weekdays. The scheduler is managed by the OpenClaw runtime.",
          },
          {
            question: "What is configure?",
            answer:
              "The configure field lists setup steps that run when installing a preset. For example, a preset with configure: [\"web\"] will prompt you to configure web access during installation.",
          },
        ]}
      />
      <section>
        <h1 className="mb-8 text-3xl font-bold">Documentation</h1>
      </section>

      {/* How to Use */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-accent">How to Use</h2>
        <div className="space-y-4">
          <p className="text-muted">
            Use npx to install any preset into your project. No global install needed.
          </p>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wider">
              Install a preset
            </h3>
            <InstallCommand command="npx clawset issue-triage" />
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wider">
              List available presets
            </h3>
            <InstallCommand command="npx clawset list" />
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wider">
              Show preset details
            </h3>
            <InstallCommand command="npx clawset show issue-triage" />
          </div>
        </div>
      </section>

      {/* Contribute */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-accent">Contribute</h2>
        <div className="space-y-4 text-muted">
          <p>
            Want to add your own preset? Every preset lives in the{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-accent-bright font-mono text-sm">
              presets/
            </code>{" "}
            directory of the repo.
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Fork the{" "}
              <a
                href="https://github.com/clawsets/clawset"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-bright transition-colors"
              >
                clawset repo
              </a>
            </li>
            <li>
              Create a new folder under{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-accent-bright font-mono text-sm">
                presets/your-preset-name/
              </code>
            </li>
            <li>
              Add a{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-accent-bright font-mono text-sm">
                spec.json
              </code>{" "}
              with name, version, description, skills, and optional cron
            </li>
            <li>
              Add{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-accent-bright font-mono text-sm">
                SOUL.md
              </code>
              ,{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-accent-bright font-mono text-sm">
                IDENTITY.md
              </code>
              , and other markdown files that define your agent&apos;s behavior
            </li>
            <li>Open a pull request</li>
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-accent">FAQ</h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-medium">What is OpenClaw?</h3>
            <p className="text-muted">
              OpenClaw is an open-source framework for building autonomous AI
              agents. It provides a structured way to define agent identity,
              behavior, tools, and schedules using simple markdown and JSON
              files.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-medium">What are skills?</h3>
            <p className="text-muted">
              Skills are capabilities that a preset uses, like{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-accent-bright font-mono text-sm">
                github
              </code>
              ,{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-accent-bright font-mono text-sm">
                slack
              </code>
              , or{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-accent-bright font-mono text-sm">
                summarize
              </code>
              . Each skill maps to a set of tools the agent can use during
              execution.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-medium">How do schedules work?</h3>
            <p className="text-muted">
              Presets can define a{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-accent-bright font-mono text-sm">
                cron
              </code>{" "}
              field in their{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-accent-bright font-mono text-sm">
                spec.json
              </code>{" "}
              to run on a schedule. For example,{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-accent-bright font-mono text-sm">
                0 9 * * 1-5
              </code>{" "}
              means the agent runs at 9:00 AM on weekdays. The scheduler is
              managed by the OpenClaw runtime.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-medium">What is configure?</h3>
            <p className="text-muted">
              The{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-accent-bright font-mono text-sm">
                configure
              </code>{" "}
              field lists setup steps that run when installing a preset. For
              example, a preset with{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-accent-bright font-mono text-sm">
                &quot;configure&quot;: [&quot;web&quot;]
              </code>{" "}
              will prompt you to configure web access during installation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

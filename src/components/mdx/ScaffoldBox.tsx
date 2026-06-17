import { useState } from "react";

import { CheckIcon, CopyIcon, TerminalIcon } from "lucide-react";

// Used inside the @indago tutorial MDX. The classic "pick a framework" box:
// a top tab bar (Vike / React Router / TanStack / Next.js) over a copyable
// `bun create @indago/app` command that reflects the selected template flag.

interface Template {
  id: string;
  label: string;
  flag: string;
}

const TEMPLATES: Template[] = [
  { id: "vike", label: "Vike", flag: "--vike" },
  { id: "react-router", label: "React Router", flag: "--react-router" },
  { id: "tanstack", label: "TanStack Start", flag: "--tanstack" },
  { id: "next", label: "Next.js", flag: "--next" },
];

export function ScaffoldBox({ projectName = "my-app" }: { projectName?: string }) {
  const [activeId, setActiveId] = useState(TEMPLATES[0].id);
  const [copied, setCopied] = useState(false);

  const active = TEMPLATES.find((t) => t.id === activeId) ?? TEMPLATES[0];
  const command = `bun create @indago/app ${projectName} ${active.flag}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (insecure context) — no-op.
    }
  };

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-gray-800 bg-gray-950">
      {/* Top bar: framework tabs */}
      <div
        role="tablist"
        aria-label="Framework template"
        className="flex flex-wrap gap-1 border-b border-gray-800 bg-gray-900/60 p-1.5"
      >
        {TEMPLATES.map((t) => {
          const selected = t.id === activeId;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(t.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                selected
                  ? "bg-brand-500/15 text-brand-300"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Copyable command */}
      <div className="flex items-center gap-3 px-4 py-3.5 font-mono text-sm">
        <TerminalIcon className="size-4 shrink-0 text-brand-400" aria-hidden="true" />
        <code className="flex-1 overflow-x-auto whitespace-nowrap text-gray-200">{command}</code>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy command"}
          className="shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          {copied ? (
            <CheckIcon className="size-4 text-green-400" />
          ) : (
            <CopyIcon className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}

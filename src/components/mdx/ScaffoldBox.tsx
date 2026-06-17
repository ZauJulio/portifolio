import { useState } from "react";

import { CheckIcon, CopyIcon, TerminalIcon } from "lucide-react";

// Used inside the @indago tutorial MDX. The classic "pick your stack" box:
// a top tab bar (framework + package manager) over a copyable
// `<pm> create @indago/app` command that reflects both selections.

interface Template {
  id: string;
  label: string;
  flag: string;
}

interface PackageManager {
  id: string;
  label: string;
  /** Builds the full create command for a template flag. */
  command: (project: string, flag: string) => string;
}

const TEMPLATES: Template[] = [
  { id: "vike", label: "Vike", flag: "--vike" },
  { id: "react-router", label: "React Router", flag: "--react-router" },
  { id: "tanstack", label: "TanStack Start", flag: "--tanstack" },
  { id: "next", label: "Next.js", flag: "--next" },
];

const PACKAGE_MANAGERS: PackageManager[] = [
  { id: "bun", label: "bun", command: (p, f) => `bun create @indago/app ${p} ${f}` },
  // npm forwards flags to the create binary only after a `--` separator.
  { id: "npm", label: "npm", command: (p, f) => `npm create @indago/app ${p} -- ${f}` },
  { id: "pnpm", label: "pnpm", command: (p, f) => `pnpm create @indago/app ${p} ${f}` },
  { id: "yarn", label: "yarn", command: (p, f) => `yarn create @indago/app ${p} ${f}` },
];

export function ScaffoldBox({ projectName = "my-app" }: { projectName?: string }) {
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [pmId, setPmId] = useState(PACKAGE_MANAGERS[0].id);
  const [copied, setCopied] = useState(false);

  const template = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
  const pm = PACKAGE_MANAGERS.find((p) => p.id === pmId) ?? PACKAGE_MANAGERS[0];
  const command = pm.command(projectName, template.flag);

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
      {/* Framework tabs */}
      <div
        role="tablist"
        aria-label="Framework template"
        className="flex flex-wrap gap-1 border-b border-gray-800 bg-gray-900/60 p-1.5"
      >
        {TEMPLATES.map((t) => (
          <Tab key={t.id} selected={t.id === templateId} onClick={() => setTemplateId(t.id)}>
            {t.label}
          </Tab>
        ))}
      </div>

      {/* Package-manager tabs */}
      <div
        role="tablist"
        aria-label="Package manager"
        className="flex flex-wrap gap-1 border-b border-gray-800 bg-gray-900/30 p-1.5"
      >
        {PACKAGE_MANAGERS.map((p) => (
          <Tab key={p.id} selected={p.id === pmId} onClick={() => setPmId(p.id)} small>
            {p.label}
          </Tab>
        ))}
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

function Tab({
  selected,
  onClick,
  small,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={`rounded-md font-medium transition-colors ${small ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"} ${
        selected
          ? "bg-brand-500/15 text-brand-300"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

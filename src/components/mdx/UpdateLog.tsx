import type { ReactNode } from "react";

interface UpdateEntry {
  date: string;
  children: ReactNode;
}

export function Update({ date, children }: UpdateEntry) {
  return (
    <div className="flex gap-4 py-3 border-b border-gray-800/50 last:border-b-0">
      <time
        dateTime={date}
        className="shrink-0 text-xs font-mono text-brand-400 pt-0.5 tabular-nums"
      >
        {date}
      </time>
      <div className="text-sm text-gray-300 [&>p]:m-0">{children}</div>
    </div>
  );
}

export function UpdateLog({ children }: { children: ReactNode }) {
  return (
    <section className="mt-12 pt-8 border-t border-gray-700/50">
      <h2 id="updates" className="text-lg font-semibold mb-4 text-gray-200">
        Updates
      </h2>
      <div className="space-y-0">{children}</div>
    </section>
  );
}

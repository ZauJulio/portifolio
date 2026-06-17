import type React from "react";

import { ArrowLeftIcon } from "lucide-react";

import { Link } from "@/components/Link";

interface PageHeaderProps {
  backToUrl: string;
  backToLabel: string;
  rightElement?: React.ReactNode;
  /** Optional element rendered in the centre of the bar (e.g. the article search). */
  centerElement?: React.ReactNode;
}

export function PageHeader({
  backToUrl,
  backToLabel,
  rightElement,
  centerElement,
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
      <Link
        to="/"
        className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block transition-transform hover:scale-110 focus:outline-none"
        aria-label="Home"
      >
        <img
          src={`${import.meta.env.BASE_URL}logo_white.svg`}
          alt="Zau Julio"
          className="h-8 w-auto"
        />
      </Link>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
        <div className={`lg:ml-16 ${centerElement ? "flex-none" : "flex-1"}`}>
          <Link
            to={backToUrl}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-300 transition-colors no-underline text-sm whitespace-nowrap"
          >
            <ArrowLeftIcon className="size-4" />
            <span className="hidden sm:inline">{backToLabel}</span>
          </Link>
        </div>

        {centerElement && <div className="flex-1 min-w-0">{centerElement}</div>}

        {/* Hidden on mobile (the fixed locale switcher owns this corner there);
            on desktop, lg:mr-36 keeps the badge clear of that switcher. */}
        {rightElement && (
          <div className="hidden lg:flex items-center gap-2 lg:mr-36 flex-none">{rightElement}</div>
        )}
      </div>
    </header>
  );
}

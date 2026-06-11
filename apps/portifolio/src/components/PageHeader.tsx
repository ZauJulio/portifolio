import type React from "react";

import { ArrowLeftIcon } from "lucide-react";

import { Link } from "@/components/Link";

interface PageHeaderProps {
  backToUrl: string;
  backToLabel: string;
  rightElement?: React.ReactNode;
}

export function PageHeader({ backToUrl, backToLabel, rightElement }: PageHeaderProps) {
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
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="lg:ml-16 flex-1">
          <Link
            to={backToUrl}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-300 transition-colors no-underline text-sm"
          >
            <ArrowLeftIcon className="size-4" />
            {backToLabel}
          </Link>
        </div>

        {rightElement && <div className="flex items-center gap-2">{rightElement}</div>}
      </div>
    </header>
  );
}

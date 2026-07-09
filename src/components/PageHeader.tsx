import type React from "react";

import { ArrowLeftIcon } from "lucide-react";

import { Link } from "@/components/Link";

interface PageHeaderProps {
  /** Back-link target. Omit to render the bar without a back button. */
  backToUrl?: string;
  backToLabel?: string;
  rightElement?: React.ReactNode;
  centerElement?: React.ReactNode;
}

function defaultBackLabel(backToUrl: string): string {
  if (backToUrl === "/" || backToUrl === `${import.meta.env.BASE_URL}`) {
    return "Back to portfolio";
  }

  if (backToUrl.includes("articles")) return "Back to articles";
  if (backToUrl.includes("cooking")) return "Back to cooking";
  if (backToUrl.includes("reviews")) return "Back to reviews";
  if (backToUrl.includes("music")) return "Back to music";
  if (backToUrl.includes("books")) return "Back to books";
  if (backToUrl.includes("movies")) return "Back to movies";
  if (backToUrl.includes("games")) return "Back to games";
  if (backToUrl.includes("photography")) return "Back to photography";

  return "Back";
}

export function PageHeader({
  backToUrl,
  backToLabel,
  rightElement,
  centerElement,
}: PageHeaderProps) {
  const resolvedBackLabel = backToUrl ? (backToLabel ?? defaultBackLabel(backToUrl)) : undefined;

  return (
    <header className="sticky py-2 top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
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
        <div className="shrink-0 lg:ml-16 lg:flex-1">
          {backToUrl && (
            <Link
              to={backToUrl}
              className="group inline-flex items-center gap-2 text-gray-400 hover:text-page-300 transition-colors no-underline text-sm"
              aria-label={resolvedBackLabel}
            >
              {/* Circle highlight around the icon on hover of the back link. */}
              <span className="inline-flex items-center justify-center rounded-full p-1.5 transition-colors group-hover:bg-page-500/10">
                <ArrowLeftIcon className="size-4" />
              </span>
              {resolvedBackLabel}
            </Link>
          )}
        </div>

        {/* Mobile: in flow, grows to fill the row between the back button and the
            fixed locale switcher (mr-24 reserves that corner). Desktop: pulled out
            of flow and absolutely centered in the header on both axes regardless of
            the back-link / badge widths. Being out of flow keeps the bar the same
            height as a header without a search. */}
        {centerElement && (
          <div className="relative flex-1 min-w-0 ml-3 mr-24 lg:ml-0 lg:mr-0 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-md lg:flex-none">
            {centerElement}
          </div>
        )}

        {/* Hidden on mobile (the fixed locale switcher owns this corner there);
            on desktop, lg:mr-36 keeps the badge clear of that switcher. */}
        {rightElement && (
          <div className="hidden lg:flex items-center gap-2 lg:mr-36">{rightElement}</div>
        )}
      </div>
    </header>
  );
}

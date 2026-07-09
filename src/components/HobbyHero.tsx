import type { ReactNode } from "react";

interface HobbyHeroProps {
  /** Lucide (or any) icon element, already sized/colored by the caller. */
  icon: ReactNode;
  /** Tailwind classes for the icon tile background (e.g. the page gradient). */
  iconWrapperClassName: string;
  title: string;
  description: string;
}

/**
 * Listing-page hero for the hobby collections (movies / books / games):
 * a horizontal row — icon tile on the left, title with the description
 * stacked directly beneath it on the right. Left-aligned (not centered)
 * so it reads as a compact section header rather than a splash block.
 */
export function HobbyHero({ icon, iconWrapperClassName, title, description }: HobbyHeroProps) {
  return (
    <div className="max-w-7xl mx-auto flex items-center gap-5">
      <div className={`inline-flex shrink-0 p-4 rounded-2xl ${iconWrapperClassName}`}>{icon}</div>

      <div className="min-w-0">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        <p className="text-gray-400 text-sm md:text-md max-w-2xl leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

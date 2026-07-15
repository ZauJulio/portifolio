import { useEffect, useState, type ReactNode } from "react";

import { AccessLinks, type AccessLink } from "@/components/AccessLinks";
import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/components/Link";
import { ShareButton } from "@/components/ShareButton";
import { getAverageColor } from "@/utils/quantize-color";

type SubjectVariant = "movie" | "game" | "book";
type SubjectStyles = { glow: string; poster: string; title: string };

interface SubjectHeaderProps {
  cover: string;
  title: string;
  meta: ReactNode;
  description?: string;
  variant: SubjectVariant;
  /** Logical path to the content's own detail page; when set, the cover becomes
   *  a link to it (left-click navigates, right-click offers "open link"). */
  slugHref?: string;
  /** External access links (streaming / stores) rendered as an "Available on" row. */
  links?: AccessLink[];
  /** Override the auto-detected accent color (raw "r g b" channels). */
  accentColor?: string;
}

// Utilize CSS variables within Tailwind arbitrary values
const variantStyles: Record<SubjectVariant, SubjectStyles> = {
  movie: {
    glow: "bg-[rgb(var(--accent)_/_0.2)]",
    poster:
      "rounded-2xl ring-1 ring-[rgb(var(--accent)_/_0.3)] shadow-lg shadow-[rgb(var(--accent)_/_0.1)]",
    title:
      "bg-linear-to-l from-white from-15% to-[rgb(var(--accent))] bg-clip-text text-transparent",
  },
  game: {
    glow: "bg-[rgb(var(--accent)_/_0.2)]",
    poster:
      "rounded-xl ring-2 ring-[rgb(var(--accent)_/_0.3)] shadow-lg shadow-[rgb(var(--accent)_/_0.1)]",
    title:
      "bg-linear-to-l from-white from-15% to-[rgb(var(--accent))] bg-clip-text text-transparent",
  },
  book: {
    glow: "bg-[rgb(var(--accent)_/_0.2)]",
    poster:
      "rounded-md ring-1 ring-[rgb(var(--accent)_/_0.3)] shadow-xl shadow-[rgb(var(--accent)_/_0.1)] -rotate-2 hover:rotate-0 transition-transform duration-300",
    title:
      "bg-linear-to-l from-white from-15% to-[rgb(var(--accent))] bg-clip-text text-transparent",
  },
};

export function SubjectHeader({
  cover,
  title,
  meta,
  description,
  variant,
  slugHref,
  links,
  accentColor,
}: SubjectHeaderProps) {
  const styles = variantStyles[variant];
  const [accentRGB, setAccentRGB] = useState<string>("0 0 0");

  useEffect(() => {
    if (typeof window === "undefined") return;
    let isMounted = true;

    if (accentColor) {
      const hex = accentColor.replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      setAccentRGB(`${r} ${g} ${b}`);
      return;
    }

    getAverageColor(cover)
      .then((rgbStr) => isMounted && setAccentRGB(rgbStr))
      .catch((_) => {});

    return () => void (isMounted = false);
  }, [cover, accentColor]);

  return (
    <div
      className="flex flex-col sm:flex-row items-start gap-6"
      style={{ "--accent": accentRGB } as React.CSSProperties}
    >
      <div className="relative w-32 sm:w-40 shrink-0">
        <div
          aria-hidden
          className={`absolute -inset-3 rounded-full blur-2xl transition-colors duration-700 ${styles.glow}`}
        />
        <div
          className={`relative aspect-2/3 overflow-hidden transition-[box-shadow,border-color] duration-700 ${styles.poster}`}
        >
          {slugHref ? (
            <Link to={slugHref} className="block h-full w-full" aria-label={title} title={title}>
              <img
                src={cover}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </Link>
          ) : (
            <CoverImage src={cover} alt={title} maxHeightClass="h-full max-h-none" fill />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <h1
            className={`text-3xl md:text-4xl font-bold transition-colors duration-700 ${styles.title}`}
          >
            {title}
          </h1>
          <ShareButton title={`Zau Julio | ${title}`} description={description} />
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-400 transition-colors duration-300">
          {meta}
        </div>

        {description && (
          <p className="text-gray-400 mt-4 max-w-2xl leading-relaxed">{description}</p>
        )}

        <AccessLinks links={links} />
      </div>
    </div>
  );
}

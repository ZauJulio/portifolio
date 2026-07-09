import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { ClapperboardIcon, GamepadIcon, MusicIcon, StarIcon, TvIcon, UserIcon } from "lucide-react";

import { Link } from "@/components/Link";

import type { Subject } from "../+data";

/** HyperJson subject card rendered above a review's MDX body — pulled live
 *  from the games/books/music/movies collections via the review's `type`+`subjectId`. */
export function SubjectCard({ subject }: { subject: Subject }) {
  const { t } = useTranslation();
  const typeLabel = t(($) => $.reviews.type[subject.kind]);

  if (subject.kind === "game") {
    const { item } = subject;
    return (
      <SubjectCardShell
        cover={item.cover}
        to={`${import.meta.env.BASE_URL}games/${item.id}`}
        title={item.title}
        icon={<GamepadIcon className="size-4" />}
        meta={[item.platform, item.genre].filter(Boolean).join(" · ")}
        rating={item.rating}
        typeLabel={typeLabel}
      />
    );
  }

  if (subject.kind === "book") {
    const { item } = subject;
    return (
      <SubjectCardShell
        cover={item.cover}
        to={`${import.meta.env.BASE_URL}books/${item.id}`}
        title={item.title}
        icon={<UserIcon className="size-4" />}
        meta={[item.author, item.genre].filter(Boolean).join(" · ")}
        rating={item.rating}
        typeLabel={typeLabel}
      />
    );
  }

  if (subject.kind === "movie") {
    const { item } = subject;
    return (
      <SubjectCardShell
        cover={item.cover}
        to={`${import.meta.env.BASE_URL}movies/${item.id}`}
        title={item.title}
        icon={
          item.kind === "series" ? (
            <TvIcon className="size-4" />
          ) : (
            <ClapperboardIcon className="size-4" />
          )
        }
        meta={[item.year?.toString(), item.genre].filter(Boolean).join(" · ")}
        rating={item.rating}
        typeLabel={typeLabel}
      />
    );
  }

  const { item } = subject;
  return (
    <SubjectCardShell
      cover={item.cover}
      to={`${import.meta.env.BASE_URL}music`}
      title={item.title}
      icon={<MusicIcon className="size-4" />}
      meta={[item.artist, item.genre].filter(Boolean).join(" · ")}
      typeLabel={typeLabel}
    />
  );
}

function SubjectCardShell({
  cover,
  to,
  title,
  icon,
  meta,
  rating,
  typeLabel,
}: {
  cover?: string;
  to: string;
  title: string;
  icon: ReactNode;
  meta: string;
  rating?: number;
  typeLabel: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900/50 p-4 no-underline hover:border-brand-500/50 transition-colors mb-8"
    >
      {cover && (
        <img
          src={cover}
          alt={title}
          className="size-20 rounded-lg object-cover shrink-0 bg-black/40"
        />
      )}

      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-white truncate">{title}</h2>
        <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-1">
          {icon}
          <span className="truncate">{meta}</span>
        </div>

        {rating !== undefined && (
          <div className="flex items-center gap-1 mt-1 text-amber-400">
            <StarIcon className="size-3.5 fill-current" />
            <span className="text-sm">{rating} / 5</span>
          </div>
        )}
      </div>
      <span className="ml-auto text-xs text-gray-500 shrink-0">{typeLabel}</span>
    </Link>
  );
}

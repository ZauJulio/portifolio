import { useTranslation } from "react-i18next";

import { MediaCard } from "@/components/MediaCard";
import { movieKindIcon } from "@/lib/movie-kind";

import type { Movie } from "@indago/hyper-json";

export function MovieCard({ movie }: { movie: Movie }) {
  const { t } = useTranslation();
  const KindIcon = movieKindIcon(movie.kind);

  return (
    <MediaCard
      href={`${import.meta.env.BASE_URL}movies/${movie.id}`}
      cover={movie.cover}
      title={movie.title}
      statusLabel={t(($) => $.movies.status[movie.status])}
      statusClassName="bg-violet-500/10 text-violet-400 border-violet-500/20"
      metaIcon={<KindIcon className="size-3.5" />}
      metaText={
        <>
          {t(($) => $.movies.kind[movie.kind])}
          {`${movie.genre ? ` • ${movie.genre}` : ""}`}
          {`${movie.year ? ` • ${movie.year}` : ""}`}
        </>
      }
      rating={movie.rating}
      description={movie.description}
      accentColor={movie.accentColor}
    />
  );
}

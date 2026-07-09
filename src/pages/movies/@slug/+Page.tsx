import { useTranslation } from "react-i18next";

import { CalendarIcon, StarIcon } from "lucide-react";
import { useData } from "vike-react/useData";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { ReviewSection } from "@/components/ReviewSection";
import { SubjectHeader } from "@/components/SubjectHeader";
import { movieKindIcon } from "@/lib/movie-kind";

// Code styling is only needed where MDX bodies render — importing it here
// (ReviewSection renders conditionally) keeps the stylesheet off every other page.
import "highlight.js/styles/github-dark.css";

import type { Data } from "./+data";

export default function MoviePage() {
  const { t } = useTranslation();
  const movie = useData<Data>();
  const KindIcon = movieKindIcon(movie.kind);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageHeader backToUrl={`${import.meta.env.BASE_URL}movies`} />

      <div className="max-w-4xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: t(($) => $.common.home), href: "/" },
            { label: t(($) => $.movies.title), href: "/movies" },
            { label: movie.title },
          ]}
        />
      </div>

      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <SubjectHeader
            variant="movie"
            cover={movie.cover}
            title={movie.title}
            description={movie.description}
            slugHref={`/movies/${movie.id}`}
            links={movie.links}
            meta={
              <>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  {t(($) => $.movies.status[movie.status])}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <KindIcon className="size-4" />
                  {t(($) => $.movies.kind[movie.kind])}
                </span>
                {movie.year && (
                  <span className="inline-flex items-center gap-1">
                    <CalendarIcon className="size-4" />
                    {movie.year}
                  </span>
                )}
                {movie.genre && <span>&bull; {movie.genre}</span>}
                {typeof movie.rating === "number" && (
                  <span className="inline-flex items-center gap-1 text-amber-400">
                    <StarIcon className="size-4 fill-amber-400" />
                    {movie.rating.toFixed(1)}
                  </span>
                )}
              </>
            }
          />

          <ReviewSection review={movie.review} />
        </div>
      </section>
    </div>
  );
}

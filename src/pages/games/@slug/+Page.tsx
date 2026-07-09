import { useTranslation } from "react-i18next";

import { ClockIcon, GamepadIcon, StarIcon } from "lucide-react";
import { useData } from "vike-react/useData";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { ReviewSection } from "@/components/ReviewSection";
import { SubjectHeader } from "@/components/SubjectHeader";

// Code styling is only needed where MDX bodies render — importing it here
// (ReviewSection renders conditionally) keeps the stylesheet off every other page.
import "highlight.js/styles/github-dark.css";

import type { Data } from "./+data";

export default function GamePage() {
  const { t } = useTranslation();
  const game = useData<Data>();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageHeader backToUrl={`${import.meta.env.BASE_URL}games`} />

      <div className="max-w-4xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: t(($) => $.common.home), href: "/" },
            { label: t(($) => $.games.title), href: "/games" },
            { label: game.title },
          ]}
        />
      </div>

      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <SubjectHeader
            variant="game"
            cover={game.cover}
            title={game.title}
            description={game.description}
            slugHref={`/games/${game.id}`}
            links={game.links}
            accentColor={game.accentColor}
            meta={
              <>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  {t(($) => $.games.status[game.status])}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <GamepadIcon className="size-4" />
                  {game.platform}
                </span>

                {game.genre && <span>&bull; {game.genre}</span>}

                {typeof game.rating === "number" && (
                  <span className="inline-flex items-center gap-1 text-amber-400">
                    <StarIcon className="size-4 fill-amber-400" />
                    {game.rating.toFixed(1)}
                  </span>
                )}

                {typeof game.hoursPlayed === "number" && (
                  <span className="inline-flex items-center gap-1">
                    <ClockIcon className="size-4" />
                    {game.hoursPlayed}h
                  </span>
                )}
              </>
            }
          />

          <ReviewSection review={game.review} />
        </div>
      </section>
    </div>
  );
}

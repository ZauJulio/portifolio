import { useTranslation } from "react-i18next";

import { GamepadIcon } from "lucide-react";

import { MediaCard } from "@/components/MediaCard";

import type { Game } from "@indago/hyper-json";

export function GameCard({ game }: { game: Game }) {
  const { t } = useTranslation();

  return (
    <MediaCard
      href={`${import.meta.env.BASE_URL}games/${game.id}`}
      cover={game.cover}
      title={game.title}
      statusLabel={t(($) => $.games.status[game.status])}
      statusClassName="bg-teal-500/10 text-teal-400 border-teal-500/20"
      metaIcon={<GamepadIcon className="size-3.5" />}
      metaText={
        <>
          {game.platform}
          {game.genre && <span>&bull; {game.genre}</span>}
        </>
      }
      rating={game.rating}
      description={game.description}
    />
  );
}

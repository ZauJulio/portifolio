import { useTranslation } from "react-i18next";

import { MediaCard } from "@/components/MediaCard";
import { resolvePlatform } from "@/lib/access-platforms";

import type { Game } from "@indago/hyper-json";

export function GameCard({ game }: { game: Game }) {
  const { t } = useTranslation();
  const platform = resolvePlatform(game.platform);

  return (
    <MediaCard
      href={`${import.meta.env.BASE_URL}games/${game.id}`}
      cover={game.cover}
      title={game.title}
      statusLabel={t(($) => $.games.status[game.status])}
      statusClassName="bg-teal-500/10 text-teal-400 border-teal-500/20"
      metaIcon={platform.icon}
      metaText={
        <>
          {game.platform}
          {`${game.genre ? ` • ${game.genre}` : ""}`}
        </>
      }
      rating={game.rating}
      description={game.description}
      accentColor={game.accentColor}
    />
  );
}

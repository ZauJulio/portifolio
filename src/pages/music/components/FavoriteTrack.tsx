import { Disc3Icon } from "lucide-react";

import { PlatformLinks } from "./PlatformLinks";

import type { Favorite } from "@indago/hyper-json";

export function FavoriteTrack({ track }: { track: Favorite }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-800 bg-gray-900/35 hover:border-brand-500/10 transition-all duration-300 group">
      {track.cover ? (
        <img
          src={track.cover}
          alt={track.title}
          className="size-14 rounded-lg object-cover shrink-0"
        />
      ) : (
        <div className="size-14 rounded-lg bg-linear-to-br from-violet-500/10 to-purple-500/5 flex items-center justify-center flex-shrink-0">
          <Disc3Icon className="size-6 text-violet-400/50" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white truncate group-hover:text-brand-300 transition-colors">
          {track.title}
        </h4>
        <p className="text-xs text-gray-400 truncate">{track.artist}</p>
        {track.album && <p className="text-xs text-gray-500 truncate">{track.album}</p>}
      </div>

      {track.genre && (
        <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 flex-shrink-0">
          {track.genre}
        </span>
      )}

      <div className="shrink-0">
        <PlatformLinks youtubeId={track.youtubeId} type="track" />
      </div>
    </div>
  );
}

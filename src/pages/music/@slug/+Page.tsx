import { useTranslation } from "react-i18next";

import { Loader2Icon, Music2Icon, PlayIcon } from "lucide-react";
import { useData } from "vike-react/useData";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { ShareButton } from "@/components/ShareButton";

import { useYouTubePlaylist } from "../hooks/useYouTubePlaylist";

import type { Data } from "./+data";

export default function PlaylistPage() {
  const { t } = useTranslation();
  const playlist = useData<Data>();
  const { tracks, loading, error } = useYouTubePlaylist(playlist.youtubeId);

  const ytLink = playlist.youtubeId
    ? `https://music.youtube.com/playlist?list=${playlist.youtubeId}`
    : "";

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageHeader backToUrl={`${import.meta.env.BASE_URL}music`} />

      <div className="max-w-4xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: t(($) => $.common.home), href: "/" },
            { label: t(($) => $.music.title), href: "/music" },
            { label: playlist.title },
          ]}
        />
      </div>

      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto flex items-start gap-6">
          <div className="relative size-24 md:size-32 rounded-xl overflow-hidden shrink-0 border border-gray-800 shadow-md">
            <img src={playlist.cover} alt={playlist.title} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{playlist.title}</h1>
                {playlist.description && (
                  <p className="text-gray-400 mt-1 max-w-2xl">{playlist.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                  {playlist.trackCount && <span>{playlist.trackCount} tracks</span>}
                  {playlist.genre && <span>&bull; {playlist.genre}</span>}
                </div>
              </div>
              <ShareButton />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2Icon className="size-10 animate-spin mb-4 text-brand-500" />
              <p>{t(($) => $.common.loading)}</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 px-6">
              <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-400 mb-4">
                <Music2Icon className="size-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Could not load tracks</h3>
              <p className="text-gray-400 max-w-md mx-auto text-sm">
                The playlist might be private, or the YouTube fetching proxy was blocked.
              </p>
              {ytLink && (
                <a
                  href={ytLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors"
                >
                  Open in YouTube Music
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {tracks.map((track, index) => (
                <a
                  key={track.id}
                  href={track.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 p-3 hover:bg-gray-800/50 rounded-xl transition-all no-underline cursor-pointer"
                >
                  <span className="w-6 text-center text-sm text-gray-500 group-hover:text-brand-400 font-medium">
                    {index + 1}
                  </span>

                  <div className="relative shrink-0">
                    {track.cover ? (
                      <div className="size-12 rounded-full overflow-hidden border border-gray-700 shadow-md group-hover:shadow-brand-500/20 group-hover:border-brand-500/50 transition-all">
                        <img
                          src={track.cover}
                          alt={track.title}
                          className="w-full h-full object-cover group-hover:animate-[spin_8s_linear_infinite]"
                        />
                        <div className="absolute inset-0 m-auto size-3 bg-gray-900 rounded-full border border-gray-700" />
                      </div>
                    ) : (
                      <div className="size-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                        <Music2Icon className="size-5 text-gray-500" />
                      </div>
                    )}

                    <div className="absolute inset-0 m-auto size-12 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                      <PlayIcon className="size-5 text-white fill-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white group-hover:text-brand-300 transition-colors truncate">
                      {track.title}
                    </p>
                    <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

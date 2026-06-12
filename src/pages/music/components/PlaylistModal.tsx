import { useTranslation } from "react-i18next";

/* eslint-disable jsx-a11y/prefer-tag-over-role */
import { Loader2Icon, Music2Icon, PlayIcon, XIcon } from "lucide-react";

import { useYouTubePlaylist } from "../hooks/useYouTubePlaylist";

import type { Playlist } from "@muttum/hyper-json";

interface PlaylistModalProps {
  playlist: Playlist | null;
  onClose: () => void;
}

export function PlaylistModal({ playlist, onClose }: PlaylistModalProps) {
  const { t } = useTranslation();

  const { tracks, loading, error } = useYouTubePlaylist(playlist?.youtubeId);

  const ytLink = playlist?.youtubeId
    ? `https://music.youtube.com/playlist?list=${playlist.youtubeId}`
    : "";

  if (!playlist) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-gray-900/35 backdrop-blur-xl border border-gray-800/50 rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-gray-800/50 bg-gray-900/30">
          <div className="relative size-16 rounded-lg overflow-hidden shrink-0 border border-gray-800 shadow-md">
            <img src={playlist.cover} alt={playlist.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate">{playlist.title}</h2>
            <p className="text-sm text-gray-400 truncate">{playlist.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-brand-400 hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <XIcon className="size-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-2 md:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2Icon className="size-10 animate-spin mb-4 text-brand-500" />
              <p>{t(($) => $.common.loading) || "Loading tracks..."}</p>
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
          ) : tracks.length > 0 ? (
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
                        {/* Center hole to make it look like a vinyl */}
                        <div className="absolute inset-0 m-auto size-3 bg-gray-900 rounded-full border border-gray-700" />
                      </div>
                    ) : (
                      <div className="size-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                        <Music2Icon className="size-5 text-gray-500" />
                      </div>
                    )}

                    {/* Play Overlay */}
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
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p>No tracks found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop click to close */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Close modal"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClose();
          }
        }}
        className="fixed inset-0 -z-10 cursor-default"
        onClick={onClose}
      />
    </div>
  );
}

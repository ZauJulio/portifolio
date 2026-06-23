import { useTranslation } from "react-i18next";

import { UsersIcon, YoutubeIcon } from "lucide-react";

import type { YouTubeChannel } from "../hooks/useYouTubeChannels";

export function ChannelCard({ channel, loading }: { channel: YouTubeChannel; loading?: boolean }) {
  const { t } = useTranslation();

  return (
    <a
      href={channel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-800 bg-gray-900/25 hover:border-brand-500/50 hover:bg-gray-900/40 transition-all duration-300 no-underline text-center"
    >
      <div className="relative size-20 rounded-full overflow-hidden shrink-0 border border-gray-800 group-hover:border-brand-500/50 transition-colors">
        {channel.avatar ? (
          <img
            src={channel.avatar}
            alt={channel.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center bg-linear-to-br from-violet-500/10 to-purple-500/5 ${
              loading ? "animate-pulse" : ""
            }`}
          >
            <YoutubeIcon className="size-8 text-red-400/60" />
          </div>
        )}
      </div>

      <div className="min-w-0 w-full">
        <h3 className="text-sm font-semibold text-white truncate group-hover:text-brand-300 transition-colors">
          {channel.title}
        </h3>
        {channel.subscribers && (
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
            <UsersIcon className="size-3" />
            {channel.subscribers} {t(($) => $.music.subscribers)}
          </p>
        )}
      </div>
    </a>
  );
}

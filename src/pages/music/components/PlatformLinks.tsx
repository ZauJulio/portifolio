import { ExternalLinkIcon } from "lucide-react";

import { YouTubeMusicIcon } from "@/components/icons/YouTubeMusicIcon";

export function PlatformLinks({
  youtubeId,
  type,
}: {
  youtubeId?: string;
  type: "playlist" | "track";
}) {
  if (!youtubeId) return null;

  const url =
    type === "playlist"
      ? `https://music.youtube.com/playlist?list=${youtubeId}`
      : `https://music.youtube.com/watch?v=${youtubeId}`;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          window.open(url, "_blank", "noopener,noreferrer");
        }}
        className="inline-flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors no-underline cursor-pointer"
      >
        <YouTubeMusicIcon className="size-5" />
        <ExternalLinkIcon className="size-3" />
      </button>
    </div>
  );
}

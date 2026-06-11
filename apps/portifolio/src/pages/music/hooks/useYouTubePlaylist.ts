import { useEffect, useState } from "react";

export interface YouTubeTrack {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
}

export function useYouTubePlaylist(playlistId?: string) {
  const [tracks, setTracks] = useState<YouTubeTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (playlistId) {
      async function fetchPlaylist() {
        try {
          setLoading(true);
          setError(null);

          const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
          if (!apiKey) {
            throw new Error(
              "VITE_YOUTUBE_API_KEY is not defined. Please configure your YouTube Data API Key.",
            );
          }

          const targetUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;

          const response = await fetch(targetUrl);
          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(
              `Failed to fetch playlist via API: ${errData?.error?.message || response.statusText}`,
            );
          }

          const data = await response.json();
          const items = data.items;

          if (!items || !Array.isArray(items)) {
            throw new Error("Invalid YouTube API response format.");
          }

          interface PlaylistItem {
            snippet?: {
              title?: string;
              videoOwnerChannelTitle?: string;
              resourceId?: { videoId?: string };
              thumbnails?: {
                maxres?: { url?: string };
                high?: { url?: string };
                default?: { url?: string };
              };
            };
          }

          const extractedTracks: YouTubeTrack[] = items
            .map((item: PlaylistItem) => {
              const snippet = item.snippet;
              if (!snippet) return null;

              const title = snippet.title;
              const artist = snippet.videoOwnerChannelTitle || "Unknown Artist";

              // Handle "Private video" or "Deleted video"
              if (title === "Private video" || title === "Deleted video") {
                return null;
              }

              const videoId = snippet.resourceId?.videoId;

              const thumbnails = snippet.thumbnails;
              // Attempt to use maxres, then high, then default
              const cover =
                thumbnails?.maxres?.url || thumbnails?.high?.url || thumbnails?.default?.url || "";

              if (!videoId) return null;

              return {
                id: videoId,
                title,
                artist: artist.replace(/ - Topic$/, ""), // Clean up auto-generated topics
                cover,
                url: `https://music.youtube.com/watch?v=${videoId}&list=${playlistId}`,
              };
            })
            .filter(Boolean) as YouTubeTrack[];

          if (isMounted) {
            setTracks(extractedTracks);
          }
        } catch (err) {
          // Console error removed
          if (isMounted) setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
          if (isMounted) setLoading(false);
        }
      }

      fetchPlaylist();
    } else {
      setTracks([]);
    }

    return () => {
      isMounted = false;
    };
  }, [playlistId]);

  return { tracks, loading, error };
}

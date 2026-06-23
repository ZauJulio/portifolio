import { useEffect, useMemo, useState } from "react";

import type { Channel } from "@indago/hyper-json";

export interface YouTubeChannel {
  /** Stable id coming from the content JSON (used as React key). */
  id: string;
  title: string;
  avatar: string;
  url: string;
  subscribers?: string;
  description?: string;
}

type Query =
  | { kind: "handle"; value: string }
  | { kind: "id"; value: string }
  | { kind: "username"; value: string }
  | null;

/** Turns a channel URL into the right YouTube Data API lookup. */
function parseChannelUrl(rawUrl: string): Query {
  try {
    const { pathname } = new URL(rawUrl);
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return null;

    const [first, second] = segments;

    if (first.startsWith("@")) return { kind: "handle", value: first.slice(1) };
    if (first === "channel" && second) return { kind: "id", value: second };
    if ((first === "user" || first === "c") && second) return { kind: "username", value: second };

    return null;
  } catch {
    return null;
  }
}

/** Compact "@handle" → "handle" fallback label shown until the API responds. */
function fallbackTitle(rawUrl: string): string {
  const query = parseChannelUrl(rawUrl);
  return query?.value ?? rawUrl;
}

function formatSubscribers(count?: string, locale = "en"): string | undefined {
  if (!count) return undefined;
  const value = Number(count);
  if (!Number.isFinite(value)) return undefined;
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}

interface ChannelApiItem {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
  statistics?: { subscriberCount?: string; hiddenSubscriberCount?: boolean };
}

async function fetchChannel(
  item: Channel,
  apiKey: string,
  locale: string,
): Promise<YouTubeChannel> {
  const fallback: YouTubeChannel = {
    id: item.id,
    title: fallbackTitle(item.url),
    avatar: "",
    url: item.url,
  };

  const query = parseChannelUrl(item.url);
  if (!query) return fallback;

  const param =
    query.kind === "handle"
      ? `forHandle=${encodeURIComponent(query.value)}`
      : query.kind === "id"
        ? `id=${encodeURIComponent(query.value)}`
        : `forUsername=${encodeURIComponent(query.value)}`;

  const endpoint = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&${param}&key=${apiKey}`;

  const response = await fetch(endpoint);
  if (!response.ok) return fallback;

  const data = await response.json();
  const channel: ChannelApiItem | undefined = data?.items?.[0];
  const snippet = channel?.snippet;
  if (!snippet) return fallback;

  const avatar =
    snippet.thumbnails?.high?.url ||
    snippet.thumbnails?.medium?.url ||
    snippet.thumbnails?.default?.url ||
    "";

  return {
    id: item.id,
    title: snippet.title || fallback.title,
    avatar,
    url: item.url,
    description: snippet.description,
    subscribers: channel?.statistics?.hiddenSubscriberCount
      ? undefined
      : formatSubscribers(channel?.statistics?.subscriberCount, locale),
  };
}

/**
 * Resolves a list of YouTube channel URLs into display data (name + avatar +
 * subscriber count) through the YouTube Data API. Renders a handle-derived
 * fallback immediately, then upgrades to the real metadata once it loads.
 */
export function useYouTubeChannels(items: Channel[], locale = "en") {
  const fallbacks = useMemo<YouTubeChannel[]>(
    () =>
      items.map((item) => ({
        id: item.id,
        title: fallbackTitle(item.url),
        avatar: "",
        url: item.url,
      })),
    [items],
  );

  const [channels, setChannels] = useState<YouTubeChannel[]>(fallbacks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

    if (items.length === 0 || !apiKey) {
      setChannels(fallbacks);
      return undefined;
    }

    async function fetchAll(key: string) {
      try {
        setLoading(true);
        setError(null);
        const resolved = await Promise.all(items.map((item) => fetchChannel(item, key, locale)));
        if (isMounted) setChannels(resolved);
      } catch (err) {
        if (isMounted) {
          setChannels(fallbacks);
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAll(apiKey);

    return () => {
      isMounted = false;
    };
  }, [items, fallbacks, locale]);

  return { channels, loading, error };
}

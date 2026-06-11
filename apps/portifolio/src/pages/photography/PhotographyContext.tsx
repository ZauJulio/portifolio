import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import photographyJson from "@content/photography/en/photography.json";
import photographyPtBRJson from "@content/photography/pt-BR/photography.json";
import { useSort } from "@virtus/hyper-json/hooks";

import { useLocale } from "@/i18n";

import type { Album } from "@virtus/hyper-json";

const enAlbums = photographyJson.albums as Album[];
const ptBRAlbums = photographyPtBRJson.albums as Album[];

/** Albums for the active locale. */
function useAlbums(): Album[] {
  const { locale } = useLocale();
  const lang = locale || "en";

  return useMemo(() => (lang === "pt" ? ptBRAlbums : enAlbums), [lang]);
}

/** Distinct photo tags across `albums`, prefixed with "All" (empty when none). */
function useAllTags(albums: Album[]): string[] {
  return useMemo(() => {
    const allTags = Array.from(
      new Set(albums.flatMap((album) => album.photos.flatMap((photo) => photo.tags ?? []))),
    );
    return allTags.length > 0 ? ["All", ...allTags] : [];
  }, [albums]);
}

interface PhotographyContextValue {
  /** Albums for the active locale, sorted by date (newest first). */
  albums: Album[];
  selectedAlbum: Album | null;
  selectAlbum: (album: Album | null) => void;
  /** Filter chips for the modal: the global tag set, or the open album's tags. */
  modalTags: string[];
}

/**
 * Unifies the photography gallery's data and UI state: locale-aware albums,
 * date sorting, the open-album selection and the modal's tag set. Keeps
 * `+Page.tsx` purely presentational.
 */
export function PhotographyProvider({ children }: { children: ReactNode }) {
  const albums = useAlbums();
  const sortedAlbums = useSort(albums, { key: "date", dir: "desc" });
  const tags = useAllTags(albums);

  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  // Combine the global tag set with the open album's own tags so the modal
  // picker reflects exactly what's available for that album.
  const modalTags = useMemo(() => {
    if (!selectedAlbum) return tags;

    const set = new Set<string>(["All"]);

    for (const photo of selectedAlbum.photos) {
      for (const tag of photo.tags ?? []) set.add(tag);
    }

    return Array.from(set);
  }, [tags, selectedAlbum]);

  const value: PhotographyContextValue = {
    albums: sortedAlbums,
    selectedAlbum,
    selectAlbum: setSelectedAlbum,
    modalTags,
  };

  return <PhotographyContext.Provider value={value}>{children}</PhotographyContext.Provider>;
}

const PhotographyContext = createContext<PhotographyContextValue | null>(null);

/** Access the photography gallery state. Use within `<PhotographyProvider>`. */
export function usePhotography(): PhotographyContextValue {
  const ctx = useContext(PhotographyContext);
  if (!ctx) throw new Error("usePhotography must be used within <PhotographyProvider>");
  return ctx;
}

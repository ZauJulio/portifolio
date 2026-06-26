import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

import photographyJson from "@content/photography/en/photography.json";
import photographyPtBRJson from "@content/photography/pt-BR/photography.json";
import { useSort } from "@indago/hyper-json/hooks";

import { useLocale } from "@/i18n";

import type { Album } from "@indago/hyper-json";

const enAlbums = photographyJson.albums as Album[];
const ptBRAlbums = photographyPtBRJson.albums as Album[];

function useAlbums(): Album[] {
  const { locale } = useLocale();
  const lang = locale || "en";

  return useMemo(() => (lang === "pt" ? ptBRAlbums : enAlbums), [lang]);
}

interface PhotographyContextValue {
  albums: Album[];
}

export function PhotographyProvider({ children }: { children: ReactNode }) {
  const albums = useAlbums();
  const sortedAlbums = useSort(albums, { key: "date", dir: "desc" });

  return (
    <PhotographyContext.Provider value={{ albums: sortedAlbums }}>
      {children}
    </PhotographyContext.Provider>
  );
}

const PhotographyContext = createContext<PhotographyContextValue | null>(null);

export function usePhotography(): PhotographyContextValue {
  const ctx = useContext(PhotographyContext);
  if (!ctx) throw new Error("usePhotography must be used within <PhotographyProvider>");
  return ctx;
}

import { useTranslation } from "react-i18next";

import { UserIcon } from "lucide-react";

import { MediaCard } from "@/components/MediaCard";

import type { Book } from "@indago/hyper-json";

export function BookCard({ book }: { book: Book }) {
  const { t } = useTranslation();

  return (
    <MediaCard
      href={`${import.meta.env.BASE_URL}books/${book.id}`}
      cover={book.cover}
      title={book.title}
      statusLabel={t(($) => $.books.status[book.status])}
      statusClassName="bg-amber-500/10 text-amber-400 border-amber-500/20"
      metaIcon={<UserIcon className="size-3.5" />}
      metaText={
        <>
          {book.author}
          {book.genre && <span>&bull; {book.genre}</span>}
        </>
      }
      rating={book.rating}
      description={book.description}
    />
  );
}

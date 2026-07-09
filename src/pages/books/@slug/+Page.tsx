import { useTranslation } from "react-i18next";

import { StarIcon, UserIcon } from "lucide-react";
import { useData } from "vike-react/useData";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { ReviewSection } from "@/components/ReviewSection";
import { SubjectHeader } from "@/components/SubjectHeader";

// Code styling is only needed where MDX bodies render — importing it here
// (ReviewSection renders conditionally) keeps the stylesheet off every other page.
import "highlight.js/styles/github-dark.css";

import type { Data } from "./+data";

export default function BookPage() {
  const { t } = useTranslation();
  const book = useData<Data>();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageHeader backToUrl={`${import.meta.env.BASE_URL}books`} />

      <div className="max-w-4xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: t(($) => $.common.home), href: "/" },
            { label: t(($) => $.books.title), href: "/books" },
            { label: book.title },
          ]}
        />
      </div>

      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <SubjectHeader
            variant="book"
            cover={book.cover}
            title={book.title}
            description={book.description}
            slugHref={`/books/${book.id}`}
            links={book.links}
            meta={
              <>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {t(($) => $.books.status[book.status])}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <UserIcon className="size-4" />
                  {book.author}
                </span>

                {book.genre && <span>&bull; {book.genre}</span>}
                {typeof book.rating === "number" && (
                  <span className="inline-flex items-center gap-1 text-amber-400">
                    <StarIcon className="size-4 fill-amber-400" />
                    {book.rating.toFixed(1)}
                  </span>
                )}
              </>
            }
          />

          <ReviewSection review={book.review} />
        </div>
      </section>
    </div>
  );
}

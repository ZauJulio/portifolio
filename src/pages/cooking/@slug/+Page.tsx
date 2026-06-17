import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { MdxRender } from "@indago/hyper-down";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, CookingPotIcon, UsersIcon } from "lucide-react";
import { useData } from "vike-react/useData";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Link } from "@/components/Link";
import { PageHeader } from "@/components/PageHeader";
import { PageMinimap } from "@/components/PageMinimap";
import { RelatedContent } from "@/components/RelatedContent";
import { useLocale } from "@/i18n";

import { getRecipeContent } from "../data";

// Code/math styling is only needed where MDX bodies render — importing it here
// (not in +Layout) keeps both stylesheets off every other page's critical path.
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";

import type { Data } from "./+data";

export default function RecipePage() {
  const { displayLocale } = useLocale();
  const { t } = useTranslation();
  const recipeRef = useRef<HTMLElement>(null);

  const recipe = useData<Data>();

  if (!recipe) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <CookingPotIcon className="size-12 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t(($) => $.cooking.notFound)}</h1>
          <p className="text-gray-400 mb-6">{t(($) => $.cooking.notFoundDesc)}</p>
          <Link
            to="/cooking"
            className="inline-flex items-center gap-2 text-brand-300 hover:text-brand-500 transition-colors no-underline"
          >
            <ArrowLeftIcon className="size-4" />
            {t(($) => $.cooking.backTo)}
          </Link>
        </div>
      </div>
    );
  }

  const Content = getRecipeContent(recipe.slug, recipe.locale);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <PageHeader
        backToUrl="/cooking"
        backToLabel={t(($) => $.cooking.backTo)}
        rightElement={
          <>
            <CookingPotIcon className="size-5 text-brand-400" />
            <span className="font-semibold text-white">{t(($) => $.cooking.recipe)}</span>
          </>
        }
      />

      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: t(($) => $.common.home), href: "/" },
            { label: t(($) => $.cooking.title), href: "/cooking" },
            { label: recipe.title },
          ]}
        />
      </div>

      <PageMinimap contentRef={recipeRef} />

      {/* Cover Image — falls back to a branded placeholder when none is set. */}
      <div className="w-full max-h-100 overflow-hidden">
        <img
          src={recipe.cover || `${import.meta.env.BASE_URL}covers/recipe-fallback.svg`}
          alt={recipe.cover ? recipe.title : ""}
          aria-hidden={recipe.cover ? undefined : "true"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <article ref={recipeRef} className="max-w-4xl mx-auto px-6 py-12">
        {/* Meta Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {recipe.cuisine && (
              <Link
                to={`${import.meta.env.BASE_URL}cooking?cuisine=${encodeURIComponent(recipe.cuisine)}`}
                className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors no-underline"
              >
                {recipe.cuisine}
              </Link>
            )}
            {recipe.mealType && (
              <Link
                to={`${import.meta.env.BASE_URL}cooking?mealType=${encodeURIComponent(recipe.mealType)}`}
                className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors no-underline"
              >
                {recipe.mealType}
              </Link>
            )}
            {recipe.courseType && (
              <Link
                to={`${import.meta.env.BASE_URL}cooking?courseType=${encodeURIComponent(recipe.courseType)}`}
                className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors no-underline"
              >
                {recipe.courseType}
              </Link>
            )}
            {recipe.difficulty && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {recipe.difficulty}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{recipe.title}</h1>

          <p className="text-lg text-gray-400 leading-relaxed mb-6">{recipe.description}</p>

          {/* Recipe info bar */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-6 border-b border-gray-800">
            {recipe.date && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon className="size-4" />
                {new Date(recipe.date).toLocaleDateString(displayLocale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {recipe.prepTime && (
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="size-4" />
                {t(($) => $.cooking.prepTime)}: {recipe.prepTime}
              </span>
            )}
            {recipe.cookTime && (
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="size-4" />
                {t(($) => $.cooking.cookTime)}: {recipe.cookTime}
              </span>
            )}
            {recipe.servings && (
              <span className="inline-flex items-center gap-1.5">
                <UsersIcon className="size-4" />
                {recipe.servings} {t(($) => $.cooking.servings).toLowerCase()}
              </span>
            )}
          </div>
        </div>

        {/* MDX Body */}
        <div className="prose prose-invert max-w-none">
          <MdxRender
            content={Content}
            fallback={
              <div className="animate-pulse space-y-4 my-8">
                <div className="h-4 bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-800 rounded w-5/6" />
              </div>
            }
            empty={
              <div className="text-gray-400">
                {t(($) => $.cooking.contentNotFound) || "Content not available"}
              </div>
            }
          />
        </div>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`${import.meta.env.BASE_URL}cooking`}
                  className="text-xs px-3 py-1 rounded-full bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800 transition-colors no-underline"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Suggested content — outside <article> so the PageMinimap mirror
          (a clone of the article element) never duplicates it. */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <RelatedContent
          title={t(($) => $.cooking.relatedTitle)}
          basePath="cooking"
          items={recipe.related}
        />
      </div>
    </div>
  );
}

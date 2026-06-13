import { ClockIcon, UsersIcon } from "lucide-react";

import { Link } from "@/components/Link";

import { useCooking } from "../CookingContext";

import type { RecipeMeta } from "@indago/hyper-down";

export function RecipeCard({ recipe }: { recipe: RecipeMeta }) {
  const meta = recipe;
  const { setFilter } = useCooking();

  return (
    <div className="block rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden group hover:border-brand-500/50 transition-all duration-300 relative">
      <Link
        to={`${import.meta.env.BASE_URL}cooking/${meta.slug}`}
        className="absolute inset-0 z-0"
        aria-label={meta.title}
      />
      {meta.cover && (
        <div className="aspect-video overflow-hidden relative z-0 pointer-events-none">
          <img
            src={meta.cover}
            alt={meta.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5 relative z-10 pointer-events-none">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {meta.cuisine && (
            <Link
              to={`${import.meta.env.BASE_URL}cooking?cuisine=${encodeURIComponent(meta.cuisine)}`}
              // data-vike="false": opt out of Vike's scroll-to-top link interception;
              // setFilter (keepScrollPosition) handles the in-place refinement.
              data-vike="false"
              onClick={(e) => {
                e.preventDefault();
                if (meta.cuisine) setFilter("cuisine", meta.cuisine);
              }}
              className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors no-underline pointer-events-auto relative z-20"
            >
              {meta.cuisine}
            </Link>
          )}
          {meta.mealType && (
            <Link
              to={`${import.meta.env.BASE_URL}cooking?mealType=${encodeURIComponent(meta.mealType)}`}
              data-vike="false"
              onClick={(e) => {
                e.preventDefault();
                if (meta.mealType) setFilter("mealType", meta.mealType);
              }}
              className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors no-underline pointer-events-auto relative z-20"
            >
              {meta.mealType}
            </Link>
          )}
          {meta.courseType && (
            <Link
              to={`${import.meta.env.BASE_URL}cooking?courseType=${encodeURIComponent(meta.courseType)}`}
              data-vike="false"
              onClick={(e) => {
                e.preventDefault();
                if (meta.courseType) setFilter("courseType", meta.courseType);
              }}
              className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors no-underline pointer-events-auto relative z-20"
            >
              {meta.courseType}
            </Link>
          )}
          {meta.difficulty && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {meta.difficulty}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
          {meta.title}
        </h3>

        <p className="text-sm text-gray-400 leading-relaxed mb-3 line-clamp-2">
          {meta.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          {meta.prepTime && (
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="size-3" />
              {meta.prepTime}
            </span>
          )}
          {meta.servings && (
            <span className="inline-flex items-center gap-1">
              <UsersIcon className="size-3" />
              {meta.servings} servings
            </span>
          )}
        </div>

        {meta.tags && meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 border border-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

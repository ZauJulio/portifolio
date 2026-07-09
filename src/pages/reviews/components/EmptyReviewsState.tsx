import { useTranslation } from "react-i18next";

import { TagIcon } from "lucide-react";

export function EmptyReviewsState({ activeTag }: { activeTag: string | null }) {
  const { t } = useTranslation();

  return (
    <div className="text-center py-20">
      <div className="inline-flex p-4 rounded-2xl bg-gray-900/50 mb-4">
        <TagIcon className="size-8 text-gray-600" />
      </div>

      <p className="text-gray-500 text-lg mb-2">
        {activeTag
          ? t(($) => $.reviews.noReviewsTagged, { tag: activeTag })
          : t(($) => $.reviews.noReviews)}
      </p>
    </div>
  );
}

import { useTranslation } from "react-i18next";

import { Share2Icon } from "lucide-react";

import { useToast } from "./Toast";

interface ShareButtonProps {
  /** Share sheet title — defaults to document.title. */
  title?: string;
  /** Share sheet text/description. */
  description?: string;
}

export function ShareButton({ title, description }: ShareButtonProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const handleShare = async () => {
    const url = window.location.href;
    const shareTitle = title || document.title;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          ...(description && { text: description }),
          url,
        });
      } catch {
        // User cancelled or share failed — silent fallback.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast(
        t(($) => $.common.linkCopied),
        "success",
      );
    } catch {
      showToast(
        t(($) => $.common.linkCopied),
        "error",
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="p-2 text-gray-400 hover:text-brand-300 hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
      aria-label={t(($) => $.common.share)}
    >
      <Share2Icon className="size-5" />
    </button>
  );
}

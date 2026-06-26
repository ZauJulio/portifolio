import { useTranslation } from "react-i18next";

import { Share2Icon } from "lucide-react";

import { useToast } from "./Toast";

export function ShareButton() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const handleShare = async () => {
    const url = window.location.href;
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

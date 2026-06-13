import { useMemo } from "react";

import profileJson from "@content/profile/en/profile.json";
import profilePtBRJson from "@content/profile/pt-BR/profile.json";

import { useLocale } from "@/i18n";

import type { ExperienceItem, ProfileContentSchema } from "@indago/hyper-json";

export function useExperience() {
  const { locale } = useLocale();
  const lang = locale || "en";

  return useMemo(() => {
    const data = lang === "pt" ? profilePtBRJson : profileJson;
    return (data as ProfileContentSchema).experience as ExperienceItem[];
  }, [lang]);
}

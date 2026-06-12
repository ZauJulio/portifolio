import { useMemo } from "react";

import educationJson from "@content/education/en/education.json";
import educationPtBRJson from "@content/education/pt-BR/education.json";

import { useLocale } from "@/i18n";

import type { EducationContentSchema } from "@muttum/hyper-json";

const enEducation = educationJson as EducationContentSchema;
const ptBREducation = educationPtBRJson as EducationContentSchema;

export function useEducation() {
  const { locale } = useLocale();
  const lang = locale || "en";

  return useMemo(() => {
    return lang === "pt" ? ptBREducation : enEducation;
  }, [lang]);
}

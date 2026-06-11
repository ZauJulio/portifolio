import projectsJson from "@content/projects/en/projects.json";
import skillsJson from "@content/skills/skills.json";
import { useComposed } from "@virtus/hyper-json/hooks";

import type { SkillCluster } from "@virtus/hyper-json";

export const SKILL_CLUSTERS: SkillCluster[] = skillsJson.clusters ?? [];

export function useFilteredProjects(searchQuery: string, language: string) {
  return useComposed(projectsJson.projects, {
    filters: language !== "All" ? [{ key: "language" as const, value: language }] : [],
    searchQuery,
    searchFields: ["name", "description"],
  });
}

const langs = Array.from(new Set(projectsJson.projects.map((p) => p.language)));
export const allLanguages = ["All", ...langs];

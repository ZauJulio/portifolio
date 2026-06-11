import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ExternalLinkIcon, SearchIcon } from "lucide-react";

import { ProjectCard } from "./components/ProjectCard";
import { SkillsSection } from "./components/SkillsSection";
import { SoftSkillsSection } from "./components/SoftSkillsSection";
import { allLanguages, useFilteredProjects } from "./data";

export function ProjectsSection() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    paginated: { items: filteredProjects },
  } = useFilteredProjects(searchQuery, language);

  return (
    <section
      id="projects"
      className="py-20 px-4 relative overflow-hidden"
      style={{
        background: "#0a0a0a",
        backgroundImage:
          "radial-gradient(ellipse at 50% 20%, rgba(199,44,65,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(45,19,44,0.06) 0%, transparent 40%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
          {t(($) => $.projects.title)}
        </h2>
        <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
          {t(($) => $.projects.description)}
        </p>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
            <input
              type="text"
              placeholder={t(($) => $.common.search)}
              aria-label={t(($) => $.common.search)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 bg-gray-900/50 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-500/50 transition-colors"
            />
          </div>

          {allLanguages.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              {allLanguages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 border cursor-pointer ${
                    lang === language
                      ? "bg-brand-500 text-white border-brand-500 font-medium"
                      : "bg-gray-900/50 text-gray-400 border-gray-800 hover:border-brand-500/50 hover:text-white"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">{t(($) => $.projects.noResults)}</p>
          </div>
        )}

        <div className="text-center mt-10 mb-16">
          <a
            href="https://github.com/zaujulio?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 transition-colors text-sm font-medium"
          >
            View all repositories on GitHub
            <ExternalLinkIcon className="size-4" />
          </a>
        </div>

        <SkillsSection />
        <SoftSkillsSection />
      </div>
    </section>
  );
}

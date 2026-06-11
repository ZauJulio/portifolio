import { useTranslation } from "react-i18next";

import { ArrowRightIcon, CameraIcon, CookingPotIcon, Music2Icon } from "lucide-react";

import { Link } from "@/components/Link";
import type en from "@/i18n/locales/en.json";

/** A type-safe i18next selector into the translation tree (see {@link useTranslation}). */
type TextSelector = ($: typeof en) => string;

interface HobbyCard {
  key: string;
  title: TextSelector;
  description: TextSelector;
  icon: React.ElementType;
  to: string;
  gradient: string;
  iconColor: string;
}

const hobbies: HobbyCard[] = [
  {
    key: "photography",
    title: ($) => $.hobbies.photography.title,
    description: ($) => $.hobbies.photography.description,
    icon: CameraIcon,
    to: "/photography",
    gradient: "from-brand-400/15 to-brand-300/5",
    iconColor: "text-brand-300",
  },
  {
    key: "cooking",
    title: ($) => $.hobbies.cooking.title,
    description: ($) => $.hobbies.cooking.description,
    icon: CookingPotIcon,
    to: "/cooking",
    gradient: "from-brand-500/15 to-brand-400/5",
    iconColor: "text-brand-400",
  },
  {
    key: "music",
    title: ($) => $.hobbies.music.title,
    description: ($) => $.hobbies.music.description,
    icon: Music2Icon,
    to: "/music",
    gradient: "from-brand-700/20 to-brand-500/5",
    iconColor: "text-brand-300",
  },
];

function HobbyCardComponent({ hobby }: { hobby: HobbyCard }) {
  const { t } = useTranslation();
  const Icon = hobby.icon;

  return (
    <Link
      to={hobby.to}
      className="group block rounded-xl border border-gray-800 bg-gray-950/10 p-6 transition-all duration-300 hover:border-brand-500/50 hover:bg-gray-800/535 hover:shadow-lg hover:shadow-brand-500/5 no-underline"
    >
      <div className={`inline-flex p-3 rounded-lg bg-linear-to-br ${hobby.gradient} mb-4`}>
        <Icon className={`size-6 ${hobby.iconColor}`} />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
        {t(hobby.title)}
      </h3>

      <p className="text-sm text-gray-400 leading-relaxed mb-4">{t(hobby.description)}</p>

      <span className="inline-flex items-center gap-1.5 text-sm text-brand-400 group-hover:text-brand-300 transition-colors">
        {t(($) => $.articles.readMore)}
        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function HobbiesSection() {
  const { t } = useTranslation();

  return (
    <section id="hobbies" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
          {t(($) => $.hobbies.title)}
        </h2>
        <div className="text-center mb-12 max-w-3xl mx-auto space-y-4">
          <p className="text-gray-300 text-lg leading-relaxed">{t(($) => $.hobbies.subtitle)}</p>
          <p className="text-gray-400 leading-relaxed">{t(($) => $.hobbies.description)}</p>
          <p className="text-gray-500 text-sm italic">{t(($) => $.hobbies.quote)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hobbies.map((hobby) => (
            <HobbyCardComponent key={hobby.key} hobby={hobby} />
          ))}
        </div>
      </div>
    </section>
  );
}

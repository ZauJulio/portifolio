import { ChevronRightIcon, HomeIcon } from "lucide-react";

import { Link } from "@/components/Link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm min-w-0">
        {items.map((item, index) => (
          <li key={item.href || item.label} className="flex items-center gap-2 min-w-0">
            {index > 0 && <ChevronRightIcon className="size-4 shrink-0 text-gray-600" />}
            {item.href ? (
              <Link
                to={item.href}
                className="text-gray-400 hover:text-brand-300 transition-colors flex items-center gap-1 min-w-0"
              >
                {index === 0 && <HomeIcon className="size-4 shrink-0" />}
                <span className="truncate max-w-[30vw] sm:max-w-[40vw]">{item.label}</span>
              </Link>
            ) : (
              <span className="text-brand-300 font-medium truncate max-w-[30vw] sm:max-w-[40vw]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

import { useTranslation } from "react-i18next";

import { usePageContext } from "vike-react/usePageContext";

import NotFound from "./NotFound";

// Vike error page (https://vike.dev/error-page): renders the ported NotFound for
// 404s and a generic message otherwise (the React Router `ErrorBoundary`).
export default function Page() {
  const pageContext = usePageContext();
  const { t } = useTranslation();

  if (pageContext.is404) return <NotFound />;

  return (
    <main className="min-h-screen bg-black text-white pt-16 p-4 container mx-auto">
      <h1 className="text-2xl font-bold mb-2">{t(($) => $.errors.oops)}</h1>
      <p className="text-gray-400">{t(($) => $.errors.unexpected)}</p>
    </main>
  );
}

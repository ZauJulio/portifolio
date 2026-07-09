import { usePageContext } from "vike-react/usePageContext";

import Generic from "./Generic";
import NotFound from "./NotFound";

// Vike error page (https://vike.dev/error-page): renders the ported NotFound for
// 404s and a generic message otherwise (the React Router `ErrorBoundary`).
export default function Page() {
  const pageContext = usePageContext();

  if (pageContext.is404) return <NotFound />;
  return <Generic />;
}

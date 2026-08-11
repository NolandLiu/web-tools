import { AppShell } from "./components/AppShell";
import { parseDiscoverPath } from "./discover-data.js";
import { BrowsePage } from "./pages/BrowsePage";
import { HomePage } from "./pages/HomePage";
import { InfoPage } from "./pages/InfoPage";
import { ResourceDetailPage } from "./pages/ResourceDetailPage";

function currentPathname() {
  if (typeof window === "undefined") return "/en/";
  return window.location.pathname;
}

export default function App() {
  const route = parseDiscoverPath(currentPathname());

  let page = <HomePage locale={route.locale} />;
  if (route.kind === "browse" || route.kind === "category" || route.kind === "tag") {
    page = <BrowsePage route={route} />;
  } else if (route.kind === "resource") {
    page = <ResourceDetailPage route={route} />;
  } else if (route.kind === "info") {
    page = <InfoPage route={route} />;
  } else if (route.kind === "not-found") {
    page = <BrowsePage route={{ ...route, resourceType: "tool" }} />;
  }

  return <AppShell locale={route.locale}>{page}</AppShell>;
}

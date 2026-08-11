import { findResourceByRoute, getRelatedResources, messages } from "../discover-data.js";
import { ResourceGrid } from "../components/ResourceGrid";
import { Button } from "../components/ui/button";

type ResourceDetailPageProps = {
  route: {
    locale: string;
    resourceType?: string;
    slug?: string;
  };
};

export function ResourceDetailPage({ route }: ResourceDetailPageProps) {
  const t = messages[route.locale] ?? messages.en;
  const resource = findResourceByRoute(route);

  if (!resource) {
    return <section className="discover-page-section"><p className="discover-empty-state">{t.empty}</p></section>;
  }

  const related = getRelatedResources(resource, route.locale);

  return (
    <section className="discover-page-section" aria-labelledby="discover-resource-title">
      <article className="discover-detail-panel">
        <span className="discover-chip">{resource.type}</span>
        <h1 id="discover-resource-title">{resource.name}</h1>
        <p>{resource.summary}</p>
        <Button asChild>
          <a href={resource.primaryHref} rel={resource.primaryHref.startsWith("http") ? "noreferrer" : undefined}>
            {resource.type === "tool" ? t.openTool : t.details}
          </a>
        </Button>
      </article>
      <div className="discover-section-heading">
        <div>
          <h2>Related resources</h2>
          <p>{resource.categoryName}</p>
        </div>
      </div>
      <ResourceGrid resources={related} locale={route.locale} emptyLabel={t.empty} />
    </section>
  );
}

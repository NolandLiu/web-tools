import { ResourceCard } from "./ResourceCard";

type ResourceGridProps = {
  resources: Array<Parameters<typeof ResourceCard>[0]["resource"]>;
  locale: string;
  emptyLabel: string;
};

export function ResourceGrid({ resources, locale, emptyLabel }: ResourceGridProps) {
  if (!resources.length) {
    return <p className="discover-empty-state">{emptyLabel}</p>;
  }

  return (
    <div className="discover-card-grid">
      {resources.map(resource => <ResourceCard key={resource.id} resource={resource} locale={locale} />)}
    </div>
  );
}

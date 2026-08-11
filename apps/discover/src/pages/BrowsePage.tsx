import {
  listDiscoverCategories,
  listDiscoverResources,
  listDiscoverTags,
  messages,
} from "../discover-data.js";
import { ResourceCard } from "../components/ResourceCard";

type BrowsePageProps = {
  route: {
    locale: string;
    resourceType?: string;
    categorySlug?: string;
    tagSlug?: string;
  };
};

export function BrowsePage({ route }: BrowsePageProps) {
  const t = messages[route.locale] ?? messages.en;
  const category = route.categorySlug
    ? listDiscoverCategories(route.locale).find(item => item.slug === route.categorySlug)
    : undefined;
  const tag = route.tagSlug
    ? listDiscoverTags(route.locale).find(item => item.slug === route.tagSlug)
    : undefined;
  const resources = listDiscoverResources(route.locale, {
    type: route.resourceType,
    categorySlug: route.categorySlug,
    tagSlug: route.tagSlug,
  });
  const title = category?.name ?? tag?.name ?? route.resourceType ?? t.resources;
  const typeIntro = route.resourceType === "website"
    ? t.browseIntro.website
    : route.resourceType === "guide"
      ? t.browseIntro.guide
      : route.resourceType === "collection"
        ? t.browseIntro.collection
        : route.resourceType === "tool"
          ? t.browseIntro.tool
          : t.browseIntro.default;
  const countLabel = route.resourceType === "website"
    ? t.resourceCounts.website
    : route.resourceType === "guide"
      ? t.resourceCounts.guide
      : route.resourceType === "collection"
        ? t.resourceCounts.collection
        : route.resourceType === "tool"
          ? t.resourceCounts.tool
          : t.resourceCounts.default;

  return (
    <section className="discover-page-section" aria-labelledby="discover-browse-title">
      <div className="discover-browse-hero">
        <div>
          <h1 id="discover-browse-title">{title}</h1>
          <p>{category?.summary ?? tag?.name ?? typeIntro}</p>
        </div>
        <strong>{resources.length} {countLabel}</strong>
      </div>
      {resources.length ? (
        <div className="discover-resource-list">
          {resources.map(resource => <ResourceCard key={resource.id} resource={resource} locale={route.locale} />)}
        </div>
      ) : <p className="discover-empty-state">{t.empty}</p>}
    </section>
  );
}

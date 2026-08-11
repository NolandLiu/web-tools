import {
  listDiscoverCategories,
  listDiscoverResources,
  listDiscoverTags,
  messages,
} from "../discover-data.js";
import { ResourceGrid } from "../components/ResourceGrid";

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

  return (
    <section className="discover-page-section" aria-labelledby="discover-browse-title">
      <div className="discover-section-heading">
        <div>
          <h1 id="discover-browse-title">{title}</h1>
          <p>{category?.summary ?? t.featuredText}</p>
        </div>
      </div>
      <ResourceGrid resources={resources} locale={route.locale} emptyLabel={t.empty} />
    </section>
  );
}

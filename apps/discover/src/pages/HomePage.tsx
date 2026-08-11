import { buildDiscoverHome, localeSegment, messages } from "../discover-data.js";
import { ResourceGrid } from "../components/ResourceGrid";
import { SearchBox } from "../components/SearchBox";

type HomePageProps = {
  locale: string;
};

export function HomePage({ locale }: HomePageProps) {
  const t = messages[locale] ?? messages.en;
  const home = buildDiscoverHome(locale);
  const segment = localeSegment(locale);

  return (
    <>
      <section className="discover-hero" aria-labelledby="discover-home-title">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-discover-mint-strong">
          godeskhub.com
        </p>
        <h1 id="discover-home-title" className="discover-title">{t.heroTitle}</h1>
        <p className="discover-subtitle">{t.heroSubtitle}</p>
        <SearchBox locale={locale} />
      </section>

      <section className="discover-sections">
        <div className="discover-section-heading">
          <div>
            <h2>{t.featured}</h2>
            <p>{t.featuredText}</p>
          </div>
          <a href={`/${segment}/tools/`}>View all</a>
        </div>
        <ResourceGrid resources={home.featured} locale={locale} emptyLabel={t.empty} />

        <div className="discover-section-heading">
          <div>
            <h2>{t.browse}</h2>
            <p>{home.totalResources} {t.resources}</p>
          </div>
        </div>
        <div className="discover-category-grid">
          {home.categories.map(category => (
            <a key={category.id} className="discover-category-card" href={`/${segment}/categories/${category.slug}/`}>
              <span>{category.name}</span>
              <small>{category.summary}</small>
            </a>
          ))}
        </div>

        <div className="discover-section-heading">
          <div>
            <h2>{t.recently}</h2>
            <p>{t.source}</p>
          </div>
        </div>
        <div className="discover-recent-list">
          {home.recent.map(resource => (
            <a key={resource.id} href={resource.href}>
              <strong>{resource.name}</strong>
              <span>{resource.summary}</span>
              <small>{resource.categoryName}</small>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

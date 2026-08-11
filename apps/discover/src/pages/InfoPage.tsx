import { messages } from "../discover-data.js";

type InfoPageProps = {
  route: {
    locale: string;
    slug?: string;
  };
};

export function InfoPage({ route }: InfoPageProps) {
  const t = messages[route.locale] ?? messages.en;
  const label = route.slug && route.slug in t.footer ? t.footer[route.slug as keyof typeof t.footer] : "GoDeskHub";

  return (
    <section className="discover-page-section" aria-labelledby="discover-info-title">
      <article className="discover-detail-panel">
        <h1 id="discover-info-title">{label}</h1>
        <p>
          GoDeskHub Discover is a privacy-first resource directory. This page is part of
          the Discover app shell and will use the shared policy content in a later content pass.
        </p>
      </article>
    </section>
  );
}

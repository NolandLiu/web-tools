import { useMemo, useState } from "react";

import { listDiscoverResources, messages } from "../discover-data.js";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type SearchBoxProps = {
  locale: string;
};

export function SearchBox({ locale }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const t = messages[locale] ?? messages.en;
  const results = useMemo(() => listDiscoverResources(locale, { query }).slice(0, 5), [locale, query]);

  return (
    <div className="discover-search-wrap">
      <form className="discover-search-panel" role="search" onSubmit={event => event.preventDefault()}>
        <Input
          aria-label={t.searchPlaceholder}
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={event => setQuery(event.currentTarget.value)}
        />
        <kbd className="discover-search-kbd">⌘ K</kbd>
        <Button type="submit">{t.searchButton}</Button>
      </form>
      {query.trim() ? (
        <div className="discover-search-results" aria-label="Search results">
          {results.length ? results.map(resource => (
            <a key={resource.id} href={resource.href}>
              <span>{resource.name}</span>
              <small>{resource.categoryName}</small>
            </a>
          )) : <p>{t.empty}</p>}
        </div>
      ) : null}
    </div>
  );
}

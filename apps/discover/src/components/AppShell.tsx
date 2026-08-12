import { Button } from "./ui/button";
import type React from "react";

import { localeSegment, messages } from "../discover-data.js";
import { LocaleSwitcher } from "./LocaleSwitcher";

type AppShellProps = {
  locale: string;
  children: React.ReactNode;
};

export function AppShell({ locale, children }: AppShellProps) {
  const t = messages[locale] ?? messages.en;
  const segment = localeSegment(locale);

  const nav = [
    [t.nav.tools, `/${segment}/tools/`],
    [t.nav.websites, `/${segment}/websites/`],
    [t.nav.guides, `/${segment}/guides/`],
    [t.nav.aiSkills, `/${segment}/ai-skills/`],
  ];

  const footer = [
    [t.footer.about, `/${segment}/about/`],
    [t.footer.contact, `/${segment}/contact/`],
    [t.footer.privacy, `/${segment}/privacy/`],
    [t.footer.terms, `/${segment}/terms/`],
  ];

  return (
    <div className="discover-shell" lang={t.htmlLang}>
      <main className="discover-frame">
        <header className="discover-nav" aria-label="GoDeskHub Discover">
          <a className="discover-logo" href={`/${segment}/`}>
            <span className="discover-logo-mark" aria-hidden="true">GH</span>
            <span>GoDeskHub</span>
          </a>
          <nav className="discover-nav-links" aria-label="Primary">
            {nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          </nav>
          <div className="discover-nav-actions">
            <Button variant="secondary" size="sm" type="button">⌘ K Search</Button>
            <LocaleSwitcher locale={locale} />
            <details className="discover-mobile-menu">
              <summary aria-label="Open menu">Menu</summary>
              <div>
                {nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
              </div>
            </details>
          </div>
        </header>
        {children}
        <footer className="discover-footer">
          <div className="discover-footer-brand">
            <span className="discover-logo-mark" aria-hidden="true">GH</span>
            <p>Privacy-first resources. No tracking of tool input.</p>
          </div>
          <nav className="discover-footer-links" aria-label="Footer">
            {footer.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          </nav>
        </footer>
      </main>
    </div>
  );
}

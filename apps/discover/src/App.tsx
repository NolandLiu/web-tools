import catalogArtifact from "../../../catalog/artifacts/catalog.normalized.v1.mjs";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";

function publishedResourceCount() {
  return catalogArtifact.records.resources.filter(resource => resource.status === "published").length;
}

export default function App() {
  const resources = publishedResourceCount();

  return (
    <div className="discover-shell">
      <main className="discover-frame" aria-labelledby="discover-home-title">
        <header className="discover-nav" aria-label="GoDeskHub Discover">
          <div className="discover-logo">
            <span className="discover-logo-mark" aria-hidden="true">GH</span>
            <span>GoDeskHub</span>
          </div>
          <nav className="discover-nav-links" aria-label="Primary">
            <a href="#tools">Tools</a>
            <a href="#websites">Websites</a>
            <a href="#guides">Guides</a>
            <a href="#collections">Collections</a>
          </nav>
          <Button variant="secondary" size="sm" type="button">⌘ K Search</Button>
        </header>

        <section className="discover-hero">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-discover-mint-strong">
            godeskhub.com
          </p>
          <h1 id="discover-home-title" className="discover-title">
            Find the right tool without giving up your data
          </h1>
          <p className="discover-subtitle">
            Discover privacy-first tools, useful websites, and practical guides. Everything
            in one place.
          </p>
          <form className="discover-search-panel" role="search">
            <Input aria-label="Search tools, websites, and guides" placeholder="Search tools, websites, guides..." />
            <Button type="submit">Search</Button>
          </form>
        </section>

        <section className="discover-sections" aria-label="Discover UI system preview">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-[-0.04em] text-discover-forest">
                Featured picks
              </h2>
              <p className="mt-1 text-sm text-discover-muted">
                Token-driven cards for tools, websites, and guides.
              </p>
            </div>
            <Button variant="ghost" size="sm" type="button">View all</Button>
          </div>

          <div className="discover-card-grid">
            <Card>
              <CardHeader>
                <div className="discover-resource-icon" aria-hidden="true">⌁</div>
                <Badge variant="tool">Tool</Badge>
              </CardHeader>
              <CardContent>
                <CardTitle>JSON Formatter</CardTitle>
                <CardDescription className="mt-2">
                  Format, validate, and minify JSON data locally in your browser.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm" type="button">Open tool</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="discover-resource-icon" aria-hidden="true">◎</div>
                <Badge variant="website">Website</Badge>
              </CardHeader>
              <CardContent>
                <CardTitle>MDN Web Docs</CardTitle>
                <CardDescription className="mt-2">
                  Trusted documentation for modern web platform features.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm" type="button">Visit website</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="discover-resource-icon" aria-hidden="true">□</div>
                <Badge variant="guide">Guide</Badge>
              </CardHeader>
              <CardContent>
                <CardTitle>Privacy basics</CardTitle>
                <CardDescription className="mt-2">
                  Practical guidance for choosing tools that keep user content local.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm" type="button">Read guide</Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Catalog integration</CardTitle>
                <CardDescription className="mt-2">
                  This bootstrap consumes the Shared Catalog artifact without changing
                  the existing tools frontend.
                </CardDescription>
              </div>
              <Badge variant="neutral">Preview</Badge>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-discover-line bg-discover-surface-muted p-4">
                  <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-discover-muted">
                    Published resources
                  </dt>
                  <dd className="mt-2 text-3xl font-black tracking-[-0.05em] text-discover-forest">
                    {resources}
                  </dd>
                </div>
                <div className="rounded-2xl border border-discover-line bg-discover-surface-muted p-4">
                  <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-discover-muted">
                    Source
                  </dt>
                  <dd className="mt-2 text-2xl font-black tracking-[-0.04em] text-discover-forest">
                    Shared Catalog artifact
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </section>

        <footer className="discover-footer">
          <p>Privacy-first resources. No tracking of tool input.</p>
          <nav className="discover-footer-links" aria-label="Footer">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </nav>
        </footer>
      </main>
    </div>
  );
}

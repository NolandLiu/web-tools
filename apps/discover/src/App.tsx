import catalogArtifact from "../../../catalog/artifacts/catalog.normalized.v1.mjs";

function publishedResourceCount() {
  return catalogArtifact.records.resources.filter(resource => resource.status === "published").length;
}

export default function App() {
  return (
    <main className="discover-bootstrap">
      <p className="discover-eyebrow">godeskhub.com</p>
      <h1>GoDeskHub Discover</h1>
      <p>
        A Catalog-driven discovery frontend for published tools, websites, and guides.
      </p>
      <dl>
        <div>
          <dt>Published resources</dt>
          <dd>{publishedResourceCount()}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>Shared Catalog artifact</dd>
        </div>
      </dl>
    </main>
  );
}

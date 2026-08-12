import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { messages } from "../discover-data.js";
import { DiscoverIcon } from "./DiscoverIcon";

type ResourceCardProps = {
  resource: {
    id: string;
    status: string;
    type: "tool" | "website" | "guide" | "ai-skill" | "collection";
    canonicalSlug: string;
    name: string;
    summary: string;
    categoryName?: string;
    href: string;
    primaryHref: string;
  };
  locale: string;
};

export function ResourceCard({ resource, locale }: ResourceCardProps) {
  if (resource.status !== "published") return null;

  const t = messages[locale] ?? messages.en;
  const primaryLabel = resource.type === "tool" ? t.openTool : resource.type === "website" ? t.external : t.details;
  const isExternal = resource.primaryHref.startsWith("http");

  return (
    <Card className="discover-resource-card">
      <CardHeader>
        <div className="discover-resource-icon" aria-hidden="true">
          <DiscoverIcon type={resource.type} canonicalSlug={resource.canonicalSlug} />
        </div>
        <Badge variant={resource.type === "tool" ? "tool" : resource.type === "website" ? "website" : "guide"}>
          {resource.type}
        </Badge>
      </CardHeader>
      <CardContent>
        <CardTitle>{resource.name}</CardTitle>
        <CardDescription className="mt-2">{resource.summary}</CardDescription>
        {resource.categoryName ? <span className="discover-chip">{resource.categoryName}</span> : null}
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="sm" asChild>
          <a href={resource.primaryHref} rel={isExternal ? "noreferrer" : undefined}>
            {primaryLabel}
          </a>
        </Button>
        <a className="discover-details-link" href={resource.href}>{t.details}</a>
      </CardFooter>
    </Card>
  );
}

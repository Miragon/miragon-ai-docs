// The Starlight sidebar of the docs: only /docs pages, so prev/next never
// leaves /docs (routeData.ts also keeps it inside one tool). Slugs are
// content ids (src/content/docs/<slug>.md[x]); the "docs/" prefix comes from
// the folder src/content/docs/docs/. Starlight 0.42 rejects
// { label, autogenerate } groups.
import { PULSE_DOCS, TOOLS } from "./lifecycle"

export const DOCS_SIDEBAR = [
  { label: "Overview", slug: "docs" },
  ...TOOLS.map((tool) => ({
    label: tool.name,
    items: [
      { label: "Getting started", slug: `docs/${tool.slug}/getting-started` },
      ...(tool.slug === "pulse"
        ? PULSE_DOCS.map((p) => ({ label: p.label, slug: `docs/pulse/${p.slug}` }))
        : []),
    ],
  })),
]

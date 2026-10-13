// Starlight sidebars.
// - DOCS_SIDEBAR: the docs, only /docs pages, so prev/next never leaves
//   /docs (routeData.ts also keeps it inside one tool). Slugs are content ids
//   (src/content/docs/<slug>.md[x]); the "docs/" prefix comes from the folder
//   src/content/docs/docs/. Starlight 0.42 rejects { label, autogenerate }
//   groups.
// - PHASES_SIDEBAR: the phase pages (src/pages/[phase].astro), the sidebar
//   of the VitePress site: the lifecycle, then the tools. Prev/next follows
//   it (Analyse: Overview and Design).
import { PHASES, PULSE_DOCS, TOOLS } from "./lifecycle"

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

export const PHASES_SIDEBAR = [
  {
    label: "Lifecycle",
    items: [
      { label: "Overview", link: "/" },
      ...PHASES.map((phase) => ({ label: phase.name, link: phase.link })),
    ],
  },
  { label: "Tools", items: TOOLS.map((tool) => ({ label: tool.name, link: tool.link })) },
]

// The BPM lifecycle and the Miragon AI tools in it: the one list the
// lifecycle graphic (components/vue/LifecycleMap.vue), the website nav
// (data/nav.ts), the docs sidebar (data/docs-sidebar.ts) and the site footer
// (components/site/SiteFooter.astro) are built from. Source: the agreed value
// proposition.
//
// Every link is in its canonical form, with the trailing slash: pages are
// built as <path>/index.html (astro.config.mjs, build.format "directory").

export interface Tool {
  name: string
  /** The tool's folder under /tools/ and /docs/ (src/content/tools/<slug>.mdx). */
  slug: string
  link: string
  /** The tool's job in its phase, a few words. */
  job: string
}

export interface Phase {
  name: string
  link: string
  /** The job of the phase, a few words. */
  job: string
  /** Runs once, before the loop: the loop from Optimize returns to the first phase without it. */
  once?: boolean
  tools: Tool[]
}

export const PHASES: Phase[] = [
  {
    name: "Analyse",
    link: "/analyse/",
    job: "Which processes, how they connect",
    once: true,
    tools: [
      {
        name: "analyzr",
        slug: "analyzr",
        link: "/tools/analyzr/",
        job: "Map how your processes connect",
      },
    ],
  },
  {
    name: "Design",
    link: "/design/",
    job: "Model the to-be process together",
    tools: [
      {
        name: "designIQ",
        slug: "design-iq",
        link: "/tools/design-iq/",
        job: "Model together, release by PR",
      },
      {
        name: "bpmn-cli",
        slug: "bpmn-cli",
        link: "/tools/bpmn-cli/",
        job: "Agents edit BPMN by command",
      },
    ],
  },
  {
    name: "Implement",
    link: "/implement/",
    job: "Make the model run",
    tools: [
      { name: "Skills", slug: "skills", link: "/tools/skills/", job: "Make the model deployable" },
      {
        name: "Solution templates",
        slug: "solution-templates",
        link: "/tools/solution-templates/",
        job: "Connect your own systems",
      },
    ],
  },
  {
    name: "Execute",
    link: "/execute/",
    job: "Find what is stuck and why",
    tools: [
      { name: "Pulse", slug: "pulse", link: "/tools/pulse/", job: "Process operations in chat" },
      {
        name: "operate",
        slug: "operate",
        link: "/tools/operate/",
        job: "Engine state for shell, agent, CI",
      },
    ],
  },
  {
    name: "Optimize",
    link: "/optimize/",
    job: "Learn from what runs",
    tools: [],
  },
]

export const TOOLS: Tool[] = PHASES.flatMap((phase) => phase.tools)

/** Pulse's reference pages under /docs/pulse/, after its getting-started page. */
export const PULSE_DOCS = [
  { slug: "architecture", label: "Architecture" },
  { slug: "developer", label: "Developer" },
  { slug: "operations", label: "Operations" },
  { slug: "usage", label: "Usage" },
] as const

/** A tool's getting-started page in the docs. */
export const docsLink = (tool: Tool) => `/docs/${tool.slug}/getting-started/`

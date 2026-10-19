// The BPM lifecycle and the Miragon AI tools in it: the one list the
// lifecycle graphic (components/vue/LifecycleMap.vue), the website nav
// (data/nav.ts), the phase pages' tool cards (components/landing/PhaseTools.astro)
// and the site footer (components/site/SiteFooter.astro) are built from.
// Source: the agreed value proposition.
//
// Every link to a page of this site is in its canonical form, with the
// trailing slash: pages are built as <path>/index.html (astro.config.mjs,
// build.format "directory"). Docs and getting started live in each tool's
// repo, as a VitePress site on GitHub Pages; `start` links there.

export interface Tool {
  name: string
  /** The tool's folder under /tools/ (src/content/tools/<slug>.mdx). */
  slug: string
  link: string
  /** The tool's job in its phase, a few words. */
  job: string
  /** Where a reader starts: the getting-started page of the tool's docs
      (VitePress, built from the tool's repo and served on GitHub Pages), a
      public demo, the README of a template, or the Get started band of its
      page when there is more than one place to start. */
  start: string
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
        // The repo is private: the public demo is the start.
        start: "https://analyzr-demo.fly.dev/projects/nordwind-handel/review",
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
        start: "https://miragon.github.io/design-iq/getting-started",
      },
      {
        name: "bpmn-cli",
        slug: "bpmn-cli",
        link: "/tools/bpmn-cli/",
        job: "Agents edit BPMN by command",
        start: "https://miragon.github.io/bpmn-cli/getting-started",
      },
    ],
  },
  {
    name: "Implement",
    link: "/implement/",
    job: "Make the model run",
    tools: [
      {
        name: "Skills",
        slug: "skills",
        link: "/tools/skills/",
        job: "Make the model deployable",
        // Two plugins from two repos: the band links both.
        start: "/tools/skills/#get-started",
      },
      {
        name: "bpmn-to-code",
        slug: "bpmn-to-code",
        link: "/tools/bpmn-to-code/",
        job: "Typed constants from the model",
        start: "https://miragon.github.io/bpmn-to-code/getting-started/gradle",
      },
      {
        name: "Solution templates",
        slug: "solution-templates",
        link: "/tools/solution-templates/",
        job: "Connect your own systems",
        start: "https://github.com/Miragon/pulse-starter#quickstart",
      },
    ],
  },
  {
    name: "Execute",
    link: "/execute/",
    job: "Find what is stuck and why",
    tools: [
      {
        name: "Pulse",
        slug: "pulse",
        link: "/tools/pulse/",
        job: "Process operations in chat",
        start: "https://miragon.github.io/pulse/getting-started",
      },
      {
        name: "operate",
        slug: "operate",
        link: "/tools/operate/",
        job: "Engine state for shell, agent, CI",
        start: "https://miragon.github.io/operate/getting-started",
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

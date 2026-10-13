// The BPM lifecycle and the Miragon AI tools in it: the one list the
// lifecycle graphic (theme/LifecycleMap.vue), the nav and the sidebar
// (config.ts) are built from. Source: the agreed value proposition.

export interface Tool {
  name: string
  link: string
  /** The tool's job in its phase, a few words. */
  job: string
}

export interface Phase {
  name: string
  link: string
  /** The job of the phase, a few words. */
  job: string
  tools: Tool[]
}

export const PHASES: Phase[] = [
  {
    name: "Analyse",
    link: "/analyse",
    job: "See how your processes connect",
    tools: [{ name: "analyzr", link: "/tools/analyzr", job: "Link and review your as-is" }],
  },
  {
    name: "Design",
    link: "/design",
    job: "Model the to-be process together",
    tools: [
      { name: "designIQ", link: "/tools/design-iq", job: "Model together, release by PR" },
      { name: "bpmn-cli", link: "/tools/bpmn-cli", job: "Agents edit BPMN by command" },
    ],
  },
  {
    name: "Implement",
    link: "/implement",
    job: "Make the model run",
    tools: [
      { name: "Skills", link: "/tools/skills", job: "Make the model deployable" },
      {
        name: "Solution templates",
        link: "/tools/solution-templates",
        job: "Connect your own systems",
      },
    ],
  },
  {
    name: "Execute",
    link: "/execute",
    job: "Find what is stuck and why",
    tools: [
      { name: "miragon-ai", link: "/tools/miragon-ai/", job: "Process operations in chat" },
      { name: "operate", link: "/tools/operate", job: "Engine state for shell, agent, CI" },
    ],
  },
  {
    name: "Optimize",
    link: "/optimize",
    job: "Learn from what runs",
    tools: [],
  },
]

export const TOOLS: Tool[] = PHASES.flatMap((phase) => phase.tools)

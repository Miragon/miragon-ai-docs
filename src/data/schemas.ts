// Frontmatter schemas of the website pages (src/content.config.ts) and the
// prop types of the components that render them. Derived from the frontmatter
// of the VitePress pages, so every carried-over page passes unchanged.
// Strict objects: a misspelt key fails the build instead of rendering nothing.
import { z } from "astro/zod"
import { ICON_NAMES } from "../components/landing/icons"

/** Internal links are absolute; anchors and https URLs pass. */
const href = z.string().regex(/^(\/|#|https:\/\/)/, "absolute path, #anchor or https URL")
const icon = z.enum(ICON_NAMES)

export const PHASE_NAMES = ["Analyse", "Design", "Implement", "Execute", "Optimize"] as const

/** CardGrid item */
export const card = z.strictObject({
  icon: icon.optional(),
  eyebrow: z.string().optional(),
  title: z.string(),
  text: z.string().optional(),
  link: href.optional(),
  linkText: z.string().optional(),
})
/** FeatureList item */
export const feature = z.strictObject({
  icon: icon.optional(),
  title: z.string(),
  text: z.string().optional(),
})
/** StepList item */
export const step = z.strictObject({ title: z.string(), text: z.string().optional() })
/** One side of CompareCards */
export const compareSide = z.strictObject({
  title: z.string(),
  items: z.array(z.string()).min(1),
})

/** A hero button: `brand` is the white pill, `alt` the outline. */
export const heroAction = z.strictObject({
  theme: z.enum(["brand", "alt"]),
  text: z.string(),
  link: href,
})
/** The hero of the landing and of every tool page (VitePress home layout). */
export const hero = z.strictObject({
  name: z.string(),
  text: z.string(),
  tagline: z.string(),
  actions: z.array(heroAction).min(1).max(3),
})
/** "Miragon AI · <phase>" above a tool page's hero name. */
export const eyebrow = z.strictObject({ phase: z.enum(PHASE_NAMES), link: href })

/** TerminalWindow line: exactly one of cmd, cont, out, note; tone only on out. */
export const terminalLine = z.union([
  z.strictObject({ cmd: z.string() }),
  z.strictObject({ cont: z.string() }),
  z.strictObject({ note: z.string() }),
  z.strictObject({ out: z.string(), tone: z.enum(["ok", "warn", "err", "dim"]).optional() }),
])
/** The hero artefact (components/hero/HeroArtefact.astro). */
export const artefact = z.discriminatedUnion("type", [
  z.strictObject({ type: z.literal("chat") }),
  z.strictObject({
    type: z.literal("terminal"),
    title: z.string().optional(),
    lines: z.array(terminalLine).min(1),
  }),
  z.strictObject({
    type: z.literal("screenshot"),
    src: z.string().regex(/^\/screens\/[\w-]+\.jpg$/),
    alt: z.string(),
    url: z.string().optional(),
    caption: z.string().optional(),
  }),
  z.strictObject({ type: z.literal("orbit") }),
])

/** src/content/landing/index.mdx */
export const landingSchema = z.strictObject({
  title: z.string(),
  description: z.string(),
  hero,
  artefact: artefact.optional(),
  roles: z.array(card),
  phases: z.array(card),
  human: z.array(card),
  why: z.array(feature),
  proof: z.array(card),
  limits: z.array(feature),
})

/** A tool on a phase page (PhaseTools): the tool by its name in
    data/lifecycle.ts, what it does in this phase (one paragraph per string)
    and its status. Text may hold `code` and [links](/path/). */
export const phaseTool = z.strictObject({
  tool: z.string(),
  text: z.array(z.string()).min(1),
  status: z.string(),
})
/** One hand-over on a phase page (HandOver): what comes `in` (from the
    previous phase or at the start) or goes `out`, and in which formats.
    `label` names the direction ("From Analyse"), `link` the phase. */
export const handOver = z.strictObject({
  direction: z.enum(["in", "out"]),
  label: z.string(),
  link: href.optional(),
  text: z.string(),
  formats: z.array(z.string()).min(1),
})
/** src/content/phases/<phase>.mdx */
export const phaseSchema = z.strictObject({
  title: z.enum(PHASE_NAMES),
  description: z.string(),
  hero,
  compare: z.strictObject({ before: compareSide, after: compareSide }).optional(),
  tools: z.array(phaseTool).optional(), // Optimize has none
  human: z.array(card).length(2),
  handover: z.array(handOver).min(1),
  // Phase-specific lists
  sources: z.array(card).optional(), // analyse: CardGrid
  questions: z.array(card).optional(), // optimize: CardGrid
  raw: z.array(card).optional(), // optimize: CardGrid
})

/** src/content/tools/<tool>.mdx */
export const toolSchema = z.strictObject({
  title: z.string(),
  description: z.string(),
  eyebrow,
  hero,
  artefact,
  compare: z.strictObject({ before: compareSide, after: compareSide }),
  steps: z.array(step).min(2).max(4),
  status: z.array(feature),
  proof: z.array(card),
  fits: z.array(card),
  docs: z.array(card).optional(),
  // Tool-specific lists (key: component)
  sources: z.array(card).optional(), // analyzr: CardGrid
  landscape: z.array(card).optional(), // analyzr: CardGrid
  roles: z.array(card).optional(), // analyzr: FeatureList, skills: CardGrid (both card-shaped)
  result: z.array(feature).optional(), // bpmn-cli, bpmn-to-code: FeatureList
  agent: z.array(feature).optional(), // design-iq: FeatureList
  notations: z.array(card).optional(), // design-iq: CardGrid
  commands: z.array(card).optional(), // Pulse CLI: CardGrid
  guards: z.array(feature).optional(), // Pulse CLI: FeatureList
  toolsets: z.array(card).optional(), // pulse: CardGrid
  templates: z.array(card).optional(), // solution-templates: CardGrid
  skills: z.array(card).optional(), // solution-templates: CardGrid
})

export type Card = z.infer<typeof card>
export type Feature = z.infer<typeof feature>
export type Step = z.infer<typeof step>
export type CompareSide = z.infer<typeof compareSide>
export type HeroAction = z.infer<typeof heroAction>
export type Hero = z.infer<typeof hero>
export type Eyebrow = z.infer<typeof eyebrow>
export type TerminalLine = z.infer<typeof terminalLine>
export type Artefact = z.infer<typeof artefact>
export type LandingPage = z.infer<typeof landingSchema>
export type ToolPage = z.infer<typeof toolSchema>
export type PhaseTool = z.infer<typeof phaseTool>
export type HandOver = z.infer<typeof handOver>
export type PhasePage = z.infer<typeof phaseSchema>

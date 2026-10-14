// The website nav, shared by the website header (components/site/SiteHeader.astro),
// the docs header (the Starlight Header override renders the same component)
// and the docs phone menu (components/starlight/MobileMenuFooter.astro).
// Built from lifecycle.ts so a tool is added in one place.
import { PHASES, TOOLS } from "./lifecycle"

export interface NavLink {
  name: string
  url: string
}
export interface NavGroup {
  label: string
  items: NavLink[]
}
export type NavItem =
  | { name: string; url: string }
  | { name: string; children: NavLink[] }
  | { name: string; groups: NavGroup[] }

const tool = (name: string): NavLink => {
  const found = TOOLS.find((t) => t.name === name)
  if (!found) throw new Error(`nav.ts: no tool "${name}" in lifecycle.ts`)
  return { name: found.name, url: found.link }
}

export const NAV: NavItem[] = [
  { name: "Lifecycle", children: PHASES.map((p) => ({ name: p.name, url: p.link })) },
  tool("designIQ"),
  tool("Pulse"),
  {
    name: "More tools",
    groups: [
      {
        label: "For your coding agent",
        items: [tool("bpmn-cli"), tool("operate"), tool("Skills")],
      },
      { label: "Build your own", items: [tool("Solution templates")] },
      { label: "Early access", items: [tool("analyzr")] },
    ],
  },
]

export const CTA: NavLink = { name: "Talk to us", url: "/#contact" }
export const GITHUB = "https://github.com/Miragon"
/** The legal row of the site footer, in the order of the VitePress LegalFooter. */
export const LEGAL: NavLink[] = [
  { name: "Datenschutz", url: "https://www.miragon.io/datenschutz/" },
  { name: "Impressum", url: "https://www.miragon.io/impressum/" },
]

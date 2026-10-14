import { withMermaid } from "vitepress-plugin-mermaid"
import { PHASES, TOOLS } from "./lifecycle"

// Pulse (the MCP server from Miragon/miragon-ai) has its own section under its
// tool entry: a landing page and four doc pages.
const PULSE = "/tools/pulse/"

export default withMermaid({
  title: "Miragon AI",
  description:
    "Miragon AI gives your AI agents tools for four of the five phases of your BPM lifecycle on Camunda 7, CIB seven and Operaton, while your team makes the decisions.",
  cleanUrls: true,
  lastUpdated: true,
  // The site sits at the repo root: repo docs are not pages.
  srcExclude: ["README.md", "CLAUDE.md"],
  // The dev server pre-bundles only the dependencies it discovers, and it
  // does not discover mermaid (imported from inside vitepress-plugin-mermaid).
  // mermaid's CommonJS dependencies (fastdom since 11.17) then reach the
  // browser unconverted and `pnpm dev` renders a blank page ("does not
  // provide an export named 'default'"). Pre-bundling mermaid converts them
  // all. The build is unaffected.
  vite: {
    optimizeDeps: { include: ["mermaid"] },
  },
  // Shiki's VitePress default dark theme (github-dark) renders comments at
  // 3.9:1 on the dark code background; github-dark-default keeps every token
  // colour above WCAG AA. Light stays on the default github-light.
  markdown: {
    theme: { light: "github-light", dark: "github-dark-default" },
  },
  // Doc pages offer the normal light/dark toggle; the landing page alone
  // always carries the dark Miragon CI theme (scoped in theme/custom.css).
  head: [
    // consentmanager.net cookie consent with autoblocking, same setup as the
    // marketing site this one replaces (miragon-ai-website/index.html). It
    // blocks third-party scripts (e.g. the Calendly embed) until the visitor
    // consents.
    ["script", {}, 'window.cmp_setlang = "EN";'],
    [
      "script",
      {
        type: "text/javascript",
        "data-cmp-ab": "1",
        src: "https://cdn.consentmanager.net/delivery/autoblocking/47e2555f7ae3.js?cmplang=EN",
        "data-cmp-host": "c.delivery.consentmanager.net",
        "data-cmp-cdn": "cdn.consentmanager.net",
        "data-cmp-codesrc": "0",
      },
    ],
    // The CI app icon (green comet on blue), with a PNG fallback.
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo/miragon-komet-blau.svg" }],
    ["link", { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" }],
    // CI primary blue (--cd-blau), as on the CI site
    ["meta", { name: "theme-color", content: "#335DE5" }],
  ],
  // Preload the self-hosted Geist Variable (hashed filename, so a static
  // head link can't point at it, see vitepress.dev site-config#transformhead).
  transformHead({ assets }) {
    const geist = assets.find((file) => /geist-latin-wght-normal\.[\w-]+\.woff2/.test(file))
    if (geist) {
      return [
        ["link", { rel: "preload", href: geist, as: "font", type: "font/woff2", crossorigin: "" }],
      ]
    }
  },
  themeConfig: {
    // Official CI wordmarks: green (the standard) on light, white on dark.
    logo: {
      light: "/logo/miragon-logo-gruen.svg",
      dark: "/logo/miragon-logo-weiss.svg",
      alt: "Miragon",
    },
    // The wordmark already reads MIRAGON, so no text next to it.
    siteTitle: false,
    // Nav and sidebar come from the one list of phases and tools
    // (lifecycle.ts) that also draws the lifecycle graphic on the landing.
    nav: [
      {
        text: "Lifecycle",
        items: PHASES.map((phase) => ({ text: phase.name, link: phase.link })),
      },
      {
        text: "Tools",
        // Also active on the Pulse section's subpages.
        activeMatch: "^/tools/",
        items: TOOLS.map((tool) => ({ text: tool.name, link: tool.link })),
      },
      // The contact form (BrandContact) on the landing page
      { text: "Contact", link: "/#contact" },
    ],
    // One sidebar for every page: the lifecycle first, then the tools.
    sidebar: [
      {
        text: "Lifecycle",
        items: [
          { text: "Overview", link: "/" },
          ...PHASES.map((phase) => ({ text: phase.name, link: phase.link })),
        ],
      },
      {
        text: "Tools",
        items: TOOLS.map((tool) =>
          tool.link === PULSE
            ? {
                // Collapsed until one of its pages is open (VitePress then
                // expands the group with the active link).
                text: tool.name,
                collapsed: true,
                items: [
                  { text: "Overview", link: PULSE },
                  { text: "Architecture", link: `${PULSE}architecture` },
                  { text: "Developer", link: `${PULSE}developer` },
                  { text: "Operations", link: `${PULSE}operations` },
                  { text: "Usage", link: `${PULSE}usage` },
                ],
              }
            : { text: tool.name, link: tool.link },
        ),
      },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/Miragon",
      },
    ],
    search: {
      provider: "local",
    },
    outline: { level: [2, 3] },
    // No themeConfig.footer: the default theme hides it on sidebar pages,
    // which would leave the legally required Impressum/Datenschutz links off
    // most docs pages. They render on every page via the LegalFooter
    // component in the layout-bottom slot (theme/index.ts) instead.
  },
})

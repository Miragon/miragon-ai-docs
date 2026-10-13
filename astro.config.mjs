// @ts-check
import { existsSync } from "node:fs"
import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import vue from "@astrojs/vue"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import mermaid from "astro-mermaid"
import starlightLinksValidator from "starlight-links-validator"
import { DOCS_SIDEBAR } from "./src/data/docs-sidebar.ts"
import { PHASES, TOOLS } from "./src/data/lifecycle.ts"

const DESCRIPTION =
  "Miragon AI gives your AI agents tools for four of the five phases of your BPM lifecycle on Camunda 7, CIB seven and Operaton, while your team makes the decisions."

// Website pages content may link to; the validator cannot see them (picomatch globs).
const WEBSITE_PAGES = ["/", ...PHASES.map((p) => p.link), ...TOOLS.map((t) => t.link)]
  .map((path) => path.replace(/\/$/, ""))
  .flatMap((path) => [path || "/", `${path}/`, `${path}#*`, `${path}/#*`])

// MIGRATION SCAFFOLD, remove once every docs page exists (with the end of
// the VitePress-to-Astro move): Starlight fails the build on a sidebar slug
// without a page, and that check must come back. Until then the sidebar
// lists only the pages that exist.
/** @param {string} slug */
const hasPage = (slug) =>
  ["", "/index"].some((end) =>
    [".md", ".mdx"].some((ext) => existsSync(`./src/content/docs/${slug}${end}${ext}`)),
  )
/** @type {(items: any[]) => any[]} */
const existing = (items) =>
  items
    .map((item) => (item.items ? { ...item, items: existing(item.items) } : item))
    .filter((item) => (item.items ? item.items.length > 0 : hasPage(item.slug)))

export default defineConfig({
  site: "https://miragon.ai",
  // Every page is <path>/index.html, linked as /<path>/ (also what
  // Pagefind and Starlight's canonicals use). Netlify serves /<path> from
  // the same file.
  build: { format: "directory" },
  trailingSlash: "ignore",
  // No adapter: every page is prerendered, dist/ is a plain static site.
  // No `redirects` either: without an adapter Astro writes them as
  // meta-refresh pages, and a file at the old path would shadow Netlify's
  // 301 rule. Redirects live in netlify.toml.
  integrations: [
    // Must come before starlight: it adds its Markdown plugin before
    // Starlight's Expressive Code sees ```mermaid blocks.
    mermaid({ theme: "dark", autoTheme: false, enableLog: false }),
    starlight({
      title: "Miragon AI",
      description: DESCRIPTION,
      // Website pages own the 404 (src/pages/404.astro).
      disable404Route: true,
      favicon: "/logo/miragon-komet-blau.svg",
      lastUpdated: true,
      customCss: ["./src/styles/tokens.css", "./src/styles/starlight.css"],
      // The website's header and footer on every docs page; always dark.
      // No `logo`: the header override draws the wordmark.
      components: {
        Head: "./src/components/starlight/Head.astro",
        Header: "./src/components/starlight/Header.astro",
        MobileMenuFooter: "./src/components/starlight/MobileMenuFooter.astro",
        PageFrame: "./src/components/starlight/PageFrame.astro",
        ThemeProvider: "./src/components/starlight/ThemeProvider.astro",
        ThemeSelect: "./src/components/starlight/ThemeSelect.astro",
      },
      sidebar: existing(DOCS_SIDEBAR),
      routeMiddleware: "./src/routeData.ts",
      // Always dark: one code theme. `frames` too, or terminal frames keep
      // Expressive Code's own background.
      expressiveCode: {
        themes: ["github-dark-default"],
        styleOverrides: {
          codeBackground: "var(--site-bg-alt)",
          borderColor: "var(--site-divider)",
          frames: {
            terminalBackground: "var(--site-bg-alt)",
            terminalTitlebarBackground: "var(--site-bg-alt)",
            terminalTitlebarBorderBottomColor: "var(--site-divider)",
            editorTabBarBackground: "var(--site-bg-alt)",
            editorActiveTabBackground: "var(--site-bg-alt)",
            editorTabBarBorderBottomColor: "var(--site-divider)",
            editorActiveTabIndicatorTopColor: "var(--cd-gruen)",
          },
        },
      },
      // Validates the links in Markdown and MDX (pages and #hashes). Links
      // to website pages count as custom pages it cannot see into, so they
      // are excluded here and checked over dist by scripts/check-dist.mjs.
      plugins: [starlightLinksValidator({ exclude: WEBSITE_PAGES })],
    }),
    vue(),
    mdx(),
    sitemap(),
  ],
})

// @ts-check
import { defineConfig } from "astro/config"
import vue from "@astrojs/vue"
import mdx from "@astrojs/mdx"
import { satteri } from "@astrojs/markdown-satteri"
import sitemap from "@astrojs/sitemap"
import expressiveCode from "astro-expressive-code"

export default defineConfig({
  site: "https://miragon.ai",
  // Every page is <path>/index.html, linked as /<path>/ (also what the
  // canonicals use). Netlify serves /<path> from the same file.
  build: { format: "directory" },
  trailingSlash: "ignore",
  // Component styles are scoped with :where(), which adds no specificity:
  // the page text's element rules (.prose in styles/website.css) stay
  // beatable, and the components put :root in front of their rules to
  // reset them.
  scopedStyleStrategy: "where",
  // Astro's default Markdown processor, minus smart punctuation: straight
  // quotes stay straight in Markdown and MDX, as the page text was written.
  markdown: { processor: satteri({ features: { smartPunctuation: false } }) },
  // No adapter: every page is prerendered, dist/ is a plain static site.
  // No `redirects` either: without an adapter Astro writes them as
  // meta-refresh pages, and a file at the old path would shadow Netlify's
  // 301 rule. Redirects live in netlify.toml.
  integrations: [
    // The code blocks on the tool pages. Always dark: one code theme. `frames`
    // too, or terminal frames keep Expressive Code's own background. The
    // blocks look like the VitePress ones: rounded, no border or shadow,
    // 14px code with VitePress' spacing, and no terminal title bar on shell
    // code (`frame: "code"`). The language label in the corner is in
    // src/styles/code.css. The cascade layer ranks the blocks' styles above
    // the reset and below the page text (styles/website.css).
    // Must come before mdx().
    expressiveCode({
      themes: ["github-dark-default"],
      cascadeLayer: "expressive-code",
      defaultProps: { frame: "code" },
      styleOverrides: {
        borderRadius: "8px",
        borderWidth: "0px",
        codeFontFamily: "var(--site-font-mono)",
        codeFontSize: "14px",
        codeLineHeight: "1.7",
        codePaddingBlock: "20px",
        codePaddingInline: "24px",
        uiFontFamily: "var(--site-font)",
        codeBackground: "var(--site-bg-alt)",
        borderColor: "var(--site-divider)",
        frames: {
          frameBoxShadowCssValue: "none",
          terminalBackground: "var(--site-bg-alt)",
          terminalTitlebarBackground: "var(--site-bg-alt)",
          terminalTitlebarBorderBottomColor: "var(--site-divider)",
          editorTabBarBackground: "var(--site-bg-alt)",
          editorActiveTabBackground: "var(--site-bg-alt)",
          editorTabBarBorderBottomColor: "var(--site-divider)",
          editorActiveTabIndicatorTopColor: "var(--cd-gruen)",
        },
      },
    }),
    vue(),
    mdx(),
    sitemap(),
  ],
})

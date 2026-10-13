// Extends the default theme with the Miragon corporate design (see
// custom.css) and mounts the lifecycle graphic as the landing page's hero.
// theme-without-fonts drops VitePress' bundled Inter: the CI typeface is
// Geist / Geist Mono, self-hosted through @fontsource (italic included for
// emphasis and quotes).
import { h } from "vue"
import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme-without-fonts"
import LifecycleMap from "./LifecycleMap.vue"
import TryItOut from "./TryItOut.vue"
import BrandContact from "./BrandContact.vue"
import LegalFooter from "./LegalFooter.vue"
import "@fontsource-variable/geist"
import "@fontsource-variable/geist/wght-italic.css"
import "@fontsource-variable/geist-mono"
// CI tokens (--cd-*), vendored verbatim from Miragon/corporate-identity —
// loaded before custom.css, which maps the VitePress variables onto them.
import "./cd-tokens.generated.css"
import "./custom.css"

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // The hero's artefact: the BPM lifecycle with the tools of each phase.
      "home-hero-image": () => h(LifecycleMap),
      // Legal footer (Impressum + Datenschutz) on every page, incl. 404 —
      // the default theme hides its footer on sidebar pages.
      "layout-bottom": () => h(LegalFooter),
    })
  },
  enhanceApp({ app }) {
    // Sections used from the pages' Markdown
    app.component("LifecycleMap", LifecycleMap)
    app.component("TryItOut", TryItOut)
    app.component("BrandContact", BrandContact)
  },
} satisfies Theme

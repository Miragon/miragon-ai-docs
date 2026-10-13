// Extends the default theme with the Miragon corporate design (see
// custom.css) and mounts the hero artefact of every home-layout page: the
// lifecycle graphic on the landing, the tool's own artefact on its page.
// theme-without-fonts drops VitePress' bundled Inter: the CI typeface is
// Geist / Geist Mono, self-hosted through @fontsource (italic included for
// emphasis and quotes).
import { h } from "vue"
import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme-without-fonts"
import LifecycleMap from "./LifecycleMap.vue"
import HeroArtefact from "./HeroArtefact.vue"
import HeroEyebrow from "./HeroEyebrow.vue"
import TryItOut from "./TryItOut.vue"
import BrandContact from "./BrandContact.vue"
import LegalFooter from "./LegalFooter.vue"
import PageSection from "./landing/PageSection.vue"
import FeatureList from "./landing/FeatureList.vue"
import CardGrid from "./landing/CardGrid.vue"
import StepList from "./landing/StepList.vue"
import CompareCards from "./landing/CompareCards.vue"
import PillButton from "./landing/PillButton.vue"
import CtaBox from "./landing/CtaBox.vue"
import "@fontsource-variable/geist"
import "@fontsource-variable/geist/wght-italic.css"
import "@fontsource-variable/geist-mono"
// CI tokens (--cd-*), vendored verbatim from Miragon/corporate-identity —
// loaded before custom.css, which maps the VitePress variables onto them.
import "./cd-tokens.generated.css"
import "./custom.css"
import "./landing.css"

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // The hero's artefact: the BPM lifecycle on the landing, the tool's own
      // artefact (chat, terminal, screenshot) on a tool's landing page.
      "home-hero-image": () => h(HeroArtefact),
      // "Miragon AI · <phase>" above a tool landing page's name.
      "home-hero-info-before": () => h(HeroEyebrow),
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
    // Landing page building blocks (theme/landing/, styles in landing.css)
    app.component("PageSection", PageSection)
    app.component("FeatureList", FeatureList)
    app.component("CardGrid", CardGrid)
    app.component("StepList", StepList)
    app.component("CompareCards", CompareCards)
    app.component("PillButton", PillButton)
    app.component("CtaBox", CtaBox)
  },
} satisfies Theme

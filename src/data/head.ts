// Tags every page carries in <head>, website and docs alike. Rendered by
// components/site/HeadCommon.astro, which the website layout and the
// Starlight Head override both include.
export interface HeadTag {
  tag: "script" | "link" | "meta"
  attrs: Record<string, string | boolean>
  content?: string
}

export const HEAD: HeadTag[] = [
  // consentmanager.net cookie consent with autoblocking, same setup as the
  // marketing site this one replaces (miragon-ai-website/index.html). It
  // blocks third-party scripts (e.g. the Calendly embed) until the visitor
  // consents. Both stay classic, render-blocking scripts (a dynamic tag here,
  // never a bare <script> in .astro, which becomes a deferred module) so they
  // run before any script they have to block.
  { tag: "script", attrs: {}, content: 'window.cmp_setlang = "EN";' },
  {
    tag: "script",
    attrs: {
      type: "text/javascript",
      "data-cmp-ab": "1",
      src: "https://cdn.consentmanager.net/delivery/autoblocking/47e2555f7ae3.js?cmplang=EN",
      "data-cmp-host": "c.delivery.consentmanager.net",
      "data-cmp-cdn": "cdn.consentmanager.net",
      "data-cmp-codesrc": "0",
    },
  },
  // The CI app icon (green comet on blue), with a PNG fallback.
  {
    tag: "link",
    attrs: { rel: "icon", type: "image/svg+xml", href: "/logo/miragon-komet-blau.svg" },
  },
  { tag: "link", attrs: { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" } },
  // CI primary blue (--cd-blau), as on the CI site
  { tag: "meta", attrs: { name: "theme-color", content: "#335DE5" } },
  // Always dark: native controls and scrollbars follow.
  { tag: "meta", attrs: { name: "color-scheme", content: "dark" } },
]

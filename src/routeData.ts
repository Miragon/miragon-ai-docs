// Starlight route middleware, on every page in the Starlight layout (the
// docs):
// - Prev/next in the docs stay inside one tool's docs (/docs/pulse/... never
//   links on to /docs/design-iq/...).
// - The icons come from components/site/HeadCommon.astro on every page;
//   Starlight's own favicon link would declare the icon a second time.
import { defineRouteMiddleware } from "@astrojs/starlight/route-data"

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute
  route.head = route.head.filter(
    ({ tag, attrs }) => !(tag === "link" && attrs?.rel === "shortcut icon"),
  )
  const [section, tool] = route.id.split("/") // "docs/<tool>/..." -> "docs", "<tool>"
  if (section !== "docs") return
  const sameTool = <T extends { href: string } | undefined>(link: T) =>
    tool && link?.href.startsWith(`/docs/${tool}/`) ? link : undefined
  route.pagination.prev = sameTool(route.pagination.prev)
  route.pagination.next = sameTool(route.pagination.next)
})

// Starlight route middleware: prev/next stay inside one tool's docs
// (/docs/pulse/... never links on to /docs/design-iq/...).
import { defineRouteMiddleware } from "@astrojs/starlight/route-data"

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute
  const tool = route.id.split("/")[1] // "docs/<tool>/..." -> "<tool>"
  const sameTool = <T extends { href: string } | undefined>(link: T) =>
    tool && link?.href.startsWith(`/docs/${tool}/`) ? link : undefined
  route.pagination.prev = sameTool(route.pagination.prev)
  route.pagination.next = sameTool(route.pagination.next)
})

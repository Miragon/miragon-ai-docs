// The site's content collections. Website pages are MDX with a strict
// frontmatter schema (data/schemas.ts), rendered by the route templates in
// src/pages; the docs are Starlight's collection.
import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { docsLoader } from "@astrojs/starlight/loaders"
import { docsSchema } from "@astrojs/starlight/schema"
import { landingSchema, phaseSchema, toolSchema } from "./data/schemas"

export const collections = {
  // Starlight's collection. Doc files live in src/content/docs/docs/, so
  // their ids and URLs start with docs/: /docs/pulse/architecture/.
  // (The build warns that an "i18n" collection is missing; harmless, and
  // declaring an empty one only adds a second warning.)
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  // The landing (/): src/pages/index.astro
  landing: defineCollection({
    loader: glob({ pattern: "index.mdx", base: "./src/content/landing" }),
    schema: landingSchema,
  }),
  // The five phase pages (/<phase>/): src/pages/[phase].astro
  phases: defineCollection({
    loader: glob({ pattern: "*.mdx", base: "./src/content/phases" }),
    schema: phaseSchema,
  }),
  // One landing page per tool (/tools/<tool>/): src/pages/tools/[tool].astro
  tools: defineCollection({
    loader: glob({ pattern: "*.mdx", base: "./src/content/tools" }),
    schema: toolSchema,
  }),
}

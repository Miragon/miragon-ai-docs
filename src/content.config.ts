// The site's content collections: website pages in MDX with a strict
// frontmatter schema (data/schemas.ts), rendered by the route templates in
// src/pages.
import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { landingSchema, phaseSchema, toolSchema } from "./data/schemas"

export const collections = {
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

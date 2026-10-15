#!/usr/bin/env node
// miragon-ai references: the pages name only tools the miragon-ai server
// registers, and the Pulse section (Pulse's tool page) cites only repo paths
// that exist. The Pulse docs live in Miragon/miragon-ai, whose
// docs-refs.test.ts checks them. Run it against a checkout
// of Miragon/miragon-ai: MIRAGON_AI_DIR=../miragon-ai node scripts/check-miragon-ai-refs.mjs
// CI checks out the public repo for it, and runs it without `pnpm install`,
// so it uses no npm package. Without MIRAGON_AI_DIR it skips.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const ROOT = new URL("..", import.meta.url).pathname
// The Pulse section: a folder (trailing slash) or a single page.
const SECTION = ["src/content/tools/pulse.mdx"]
const inSection = (page) =>
  SECTION.some((entry) => (entry.endsWith("/") ? page.startsWith(entry) : page === entry))
const MIRAGON_AI = process.env.MIRAGON_AI_DIR

if (!MIRAGON_AI) {
  console.log("miragon-ai refs: skipped (set MIRAGON_AI_DIR to a checkout of Miragon/miragon-ai)")
  process.exit(0)
}

// The checked-in tool surface of every toolset (the E2E snapshots).
const EXPECTED_TOOLS = join(MIRAGON_AI, "apps/mcp-server-camunda7/test/expected-tools.ts")
const tools = new Set(
  readFileSync(EXPECTED_TOOLS, "utf8").match(/(?<=")[a-z0-9]+(?:_[a-z0-9]+)+(?=")/g),
)
// A short form (`show_process_list`, `bpmn_heatmap_data`) names the module's tool.
const known = (name) =>
  tools.has(name) || tools.has(`camunda7_${name}`) || tools.has(`analytics_${name}`)
const looksLikeTool = (token) =>
  /^[a-z0-9]+(?:_[a-z0-9]+)+$/.test(token) &&
  (/^(?:camunda7|analytics)_/.test(token) || /(?:^|_)show_/.test(token) || token.endsWith("_data"))
// Other pages also name tools of other servers (a template's example module,
// `notes_show_notes`); there only the miragon-ai modules' prefixes count.
const isMiragonAiTool = (ref) =>
  looksLikeTool(ref.token) && (inSection(ref.page) || /^(?:camunda7|analytics)_/.test(ref.token))

const ROOTS = /^(?:apps|packages|scripts|playground|engine-plugins|templates|\.claude|\.github)\//
// Written by a build or a test run, not checked in.
const GENERATED = /(?:^|\/)(?:dist|test-results|node_modules|generated-sources)(?:\/|$)/
const isPath = (token) =>
  ROOTS.test(token) && !/\.\.\.|[*<>{}\s|]/.test(token) && !GENERATED.test(token)
const pathOf = (token) => token.replace(/:\d+(?:-\d+)?$/, "").replace(/\/$/, "")

/** Every inline-code token with its line; fenced blocks are code and skipped. */
function backticked(page) {
  const refs = []
  let fenced = false
  readFileSync(join(ROOT, page), "utf8")
    .split("\n")
    .forEach((text, index) => {
      if (/^\s*```/.test(text)) fenced = !fenced
      if (fenced) return
      for (const [, token] of text.matchAll(/`([^`\n]+)`/g))
        refs.push({ page, line: index + 1, token })
    })
  return refs
}

function* pages(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "dist" || entry.startsWith(".")) continue
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) yield* pages(path)
    else if (/\.mdx?$/.test(entry)) yield relative(ROOT, path)
  }
}

const errors = []
for (const ref of [...pages(ROOT)].flatMap(backticked)) {
  const where = `${ref.page}:${ref.line} \`${ref.token}\``
  if (isMiragonAiTool(ref) && !known(ref.token)) errors.push(`${where}: no such miragon-ai tool`)
  if (inSection(ref.page) && isPath(ref.token) && !existsSync(join(MIRAGON_AI, pathOf(ref.token))))
    errors.push(`${where}: no such path in Miragon/miragon-ai`)
}

if (errors.length) {
  console.error(`miragon-ai refs: ${errors.length} stale reference(s)\n- ${errors.join("\n- ")}`)
  process.exit(1)
}
console.log(
  `miragon-ai refs: tool names and the paths in ${SECTION.join(", ")} match ${MIRAGON_AI}`,
)

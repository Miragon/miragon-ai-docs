#!/usr/bin/env node
// Page budgets: every page stays within the line budget the docs-style skill
// sets for it (.claude/skills/docs-style/SKILL.md, rows such as
// "| `tools/*.md` | ≤ 70 lines |"), and every page has a budget, so a new
// page cannot slip in without one. The first matching row wins, so list
// specific paths before the globs that also cover them.
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const ROOT = new URL("..", import.meta.url).pathname
const SKILL = ".claude/skills/docs-style/SKILL.md"
// Not pages: the repo's own docs (srcExclude in .vitepress/config.ts).
const NOT_PAGES = new Set(["README.md", "CLAUDE.md"])

const budgets = [
  ...readFileSync(join(ROOT, SKILL), "utf8").matchAll(
    /^\| `([\w./*-]+\.md)`\s*\| ≤ (\d+) lines\s*\|$/gm,
  ),
].map(([, pattern, lines]) => ({
  pattern,
  lines: Number(lines),
  // `*` matches within one path segment.
  test: new RegExp(`^${pattern.replace(/[.]/g, "\\.").replace(/\*/g, "[^/]*")}$`),
}))
if (!budgets.length) {
  console.error(`page budgets: no budget rows found in ${SKILL}`)
  process.exit(1)
}

function* pages(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) yield* pages(path)
    else if (entry.endsWith(".md")) yield relative(ROOT, path)
  }
}

const errors = []
let checked = 0
for (const page of pages(ROOT)) {
  if (NOT_PAGES.has(page)) continue
  const budget = budgets.find((b) => b.test.test(page))
  if (!budget) {
    errors.push(`${page}: no budget in ${SKILL}`)
    continue
  }
  const lines = readFileSync(join(ROOT, page), "utf8").replace(/\n$/, "").split("\n").length
  if (lines > budget.lines)
    errors.push(`${page}: ${lines} lines, budget ${budget.lines} (\`${budget.pattern}\`)`)
  checked++
}

if (errors.length) {
  console.error(`page budgets: ${errors.length} problem(s)\n- ${errors.join("\n- ")}`)
  process.exit(1)
}
console.log(`page budgets: ${checked} pages within budget`)

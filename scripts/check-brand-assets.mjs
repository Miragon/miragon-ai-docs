#!/usr/bin/env node
// Brand asset guard: the CI tokens and logos this site vendors from
// Miragon/corporate-identity stay byte-identical to one pinned CI release.
// It took over the docs half of miragon-ai's ui-stylesheet.test.ts when the
// site left that monorepo (Miragon/miragon-ai-docs#1).
//
// 1. Pin: every vendored file matches its SHA-256 from the pinned release.
// 2. No fork: no other stylesheet or component declares a --cd-* token.
// 3. Source: when a miragon-brand plugin of the pinned version is at hand,
//    every vendored file equals its CI source byte for byte. CI checks out
//    Miragon/corporate-identity and points MIRAGON_BRAND_DIR at it; locally
//    the Claude Code plugin cache is used. Without either, this step skips.
//
// Moving to a new CI release: copy the files from the miragon-brand skills,
// then update BRAND.version and the hashes below in the same commit.
import { createHash } from "node:crypto"
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { homedir } from "node:os"
import { join, relative } from "node:path"

const BRAND = {
  version: "1.8.0",
  files: [
    {
      path: ".vitepress/theme/cd-tokens.generated.css",
      source: "skills/modeler-tool-design/assets/cd-tokens.generated.css",
      sha256: "36d76f3a330a1250d332c6862be1dc4f7564d2461e7051d9a565ba723ef2c379",
    },
    {
      path: "public/logo/miragon-komet-blau.svg",
      source: "skills/corporate-design/assets/logo/miragon-komet-blau.svg",
      sha256: "c44c4a00f93f4255442bb70afeb8dbcb7eaae6af331ff04b6c685b6d20f587c9",
    },
    {
      path: "public/logo/miragon-logo-gruen.svg",
      source: "skills/corporate-design/assets/logo/miragon-logo-gruen.svg",
      sha256: "bc815e0698689546771e629139d86ac9dfbe29dc5618cd5e2910e6079629eae3",
    },
    {
      path: "public/logo/miragon-logo-weiss.svg",
      source: "skills/corporate-design/assets/logo/miragon-logo-weiss.svg",
      sha256: "a235870d9347600d83f4294b4a31799338ead399f1351dc8880809efcc8621fd",
    },
  ],
}

const ROOT = new URL("..", import.meta.url).pathname
// Dot directories hold tooling (.git, .context, a CI checkout in .ci-source),
// not site sources; .vitepress is the one that is.
const skip = (entry) =>
  entry === "node_modules" ||
  entry === "cache" ||
  entry === "dist" ||
  (entry.startsWith(".") && entry !== ".vitepress")
const TOKEN_DECLARATION = /--cd-[\w-]+\s*:/

const errors = []
const sha256 = (file) => createHash("sha256").update(readFileSync(file)).digest("hex")

// 1. Pin
for (const { path, sha256: pinned } of BRAND.files) {
  const file = join(ROOT, path)
  if (!existsSync(file)) errors.push(`${path}: missing`)
  else if (sha256(file) !== pinned)
    errors.push(
      `${path}: differs from miragon-brand ${BRAND.version} (hand-edited or re-vendored without updating the pin)`,
    )
}

// 2. No fork
function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (skip(entry)) continue
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) yield* walk(path)
    else if (/\.(css|vue)$/.test(entry)) yield path
  }
}
const vendored = new Set(BRAND.files.map((f) => join(ROOT, f.path)))
for (const file of walk(ROOT)) {
  if (vendored.has(file)) continue
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (TOKEN_DECLARATION.test(line))
        errors.push(
          `${relative(ROOT, file)}:${i + 1}: declares a --cd-* token; use the vendored tokens instead`,
        )
    })
}

// 3. Source
function brandDir() {
  if (process.env.MIRAGON_BRAND_DIR) return process.env.MIRAGON_BRAND_DIR
  for (const config of readdirSync(homedir()).filter((d) => d.startsWith(".claude"))) {
    const cache = join(homedir(), config, "plugins", "cache")
    if (!existsSync(cache)) continue
    for (const marketplace of readdirSync(cache)) {
      const dir = join(cache, marketplace, "miragon-brand", BRAND.version)
      if (existsSync(dir)) return dir
    }
  }
  return null
}
const source = brandDir()
if (!source) {
  console.log(
    `brand assets: source check skipped (no miragon-brand ${BRAND.version} found; set MIRAGON_BRAND_DIR)`,
  )
} else {
  for (const { path, source: sourcePath } of BRAND.files) {
    const original = join(source, sourcePath)
    if (!existsSync(original)) errors.push(`${path}: CI source ${original} not found`)
    else if (existsSync(join(ROOT, path)) && sha256(original) !== sha256(join(ROOT, path)))
      errors.push(`${path}: differs from its CI source ${original}`)
  }
}

if (errors.length) {
  console.error(`brand assets: ${errors.length} problem(s)\n- ${errors.join("\n- ")}`)
  process.exit(1)
}
console.log(
  `brand assets: ${BRAND.files.length} files match miragon-brand ${BRAND.version}${source ? ` (checked against ${source})` : ""}`,
)

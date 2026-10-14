#!/usr/bin/env node
// Dead-link and invariant gate over the whole build, run after `astro build`
// (`pnpm build`), or alone on an existing build: node scripts/check-dist.mjs
// [dist-dir]. It checks the built pages, so the links of the MDX pages and
// of the .astro components alike. Every check reads dist/ the way Netlify
// serves it: a file wins over every netlify.toml rule, /x is served from
// x/index.html or x.html.
//
// 1. Links: every internal link (<a>/<area> href, also absolute
//    https://miragon.ai/... and relative ones) lands on a page directly, in
//    its canonical form (a directory page with its trailing slash), not via
//    a redirect. A #fragment is an id (or <a name>) on the target page.
//    Assets (src, srcset, <link href>) exist, /_astro/ included (a stale
//    Expressive Code stylesheet link shows up here).
// 2. Redirects (netlify.toml, and no _redirects file): 301s, none forced; no
//    page sits at a source (it would shadow the rule), every target on this
//    site is a page in canonical form (no chains), and at least one
//    url-map.json entry exercises every rule.
// 3. URL map (scripts/url-map.json): every old URL lands on its new URL in at
//    most one hop, and the new URL is canonical. Netlify serving /x from
//    x/index.html, or answering it with a 301 to /x/, counts as the same page.
//    A #fragment cannot be redirected, so old and new carry the same one,
//    and it must exist on the page. A new URL on another site (a tool's docs
//    in its repo) must be the rule's target; its page is not checked.
// 4. Every page: both legal links (Datenschutz, Impressum); the consent
//    scripts first in <head>, as classic scripts: window.cmp_setlang, then
//    the consentmanager autoblocker, before any other script and stylesheet.
//    The landing holds the Netlify contact form in its HTML.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative, resolve as resolvePath } from "node:path"
import { parse } from "smol-toml"

const ROOT = new URL("..", import.meta.url).pathname
const DIST = resolvePath(process.argv[2] ?? join(ROOT, "dist"))
const SITE = "https://miragon.ai" // astro.config.mjs `site`

// The legal row of the site footer (src/data/nav.ts LEGAL). German DDG §5
// and GDPR Art. 13 want both reachable from every page.
const LEGAL = ["https://www.miragon.io/datenschutz/", "https://www.miragon.io/impressum/"]
const AUTOBLOCKER = /^https:\/\/cdn\.consentmanager\.net\/delivery\/autoblocking\/\w+\.js/

if (!existsSync(DIST)) {
  console.error(`dist: ${relative(process.cwd(), DIST) || DIST} not found, run astro build first`)
  process.exit(1)
}

// ---------------------------------------------------------------- HTML

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" }
const decode = (value) =>
  value.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (entity, name) =>
    name[0] === "#"
      ? String.fromCodePoint(
          name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : Number(name.slice(1)),
        )
      : (ENTITIES[name.toLowerCase()] ?? entity),
  )

/** The attributes of a start tag's inside, names lowercased, values decoded. */
function attributes(source) {
  const attrs = {}
  for (const [, name, dq, sq, bare] of source.matchAll(
    /([^\s"'=<>/`]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g,
  ))
    attrs[name.toLowerCase()] = decode(dq ?? sq ?? bare ?? "")
  return attrs
}

/** Start tags of the given names, in document order, with their offset. */
function tags(html, names) {
  const pattern = new RegExp(`<(${names.join("|")})\\b((?:"[^"]*"|'[^']*'|[^'">])*)>`, "gi")
  return [...html.matchAll(pattern)].map((m) => ({
    name: m[1].toLowerCase(),
    attrs: attributes(m[2]),
    index: m.index,
    end: m.index + m[0].length,
  }))
}

// Markup only: comments, and script and style bodies, cannot hold links.
const markup = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/(<(script|style)\b(?:"[^"]*"|'[^']*'|[^'">])*>)[\s\S]*?<\/\2\s*>/gi, "$1")

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) yield* htmlFiles(path)
    else if (entry.endsWith(".html")) yield path
  }
}

/** The URL a dist file is served at in canonical form. */
const urlOf = (file) => {
  const rel = relative(DIST, file).split("\\").join("/")
  if (rel === "index.html") return "/"
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"index.html".length)}`
  return `/${rel}`
}

// ---------------------------------------------------------------- serving

const safeDecode = (value, decoder = decodeURI) => {
  try {
    return decoder(value)
  } catch {
    return value
  }
}

/** The file Netlify serves for a path without any rule, or null. */
function fileFor(path) {
  const clean = safeDecode(path).replace(/\/+$/, "")
  for (const candidate of [
    join(DIST, clean, "index.html"),
    join(DIST, `${clean}.html`),
    join(DIST, clean),
  ])
    if (candidate.startsWith(DIST) && existsSync(candidate) && statSync(candidate).isFile())
      return candidate
  return null
}

/** A page's canonical path: directory pages end in a slash, never in index.html. */
function canonical(path, file) {
  if (!file.endsWith("/index.html")) return path
  const dir = urlOf(file)
  return path === dir ? path : dir
}

const toml = parse(readFileSync(join(ROOT, "netlify.toml"), "utf8"))
const redirects = (toml.redirects ?? []).map((rule, i) => ({
  ...rule,
  label: `netlify.toml redirect ${i + 1} (${rule.from})`,
  // Netlify matches with and without a trailing slash; :name is one
  // segment, a trailing /* the rest of the path.
  test: new RegExp(
    "^" +
      rule.from
        .replace(/\/$/, "")
        .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
        .replace(/:(\w+)/g, "(?<$1>[^/]+)")
        .replace(/\/\*$/, "(?:/(?<splat>.*))?") +
      "/?$",
  ),
  exercised: false,
}))

const ruleFor = (path) => redirects.find((rule) => rule.test.test(path))
const target = (rule, path) => {
  let to = rule.to
  for (const [name, value] of Object.entries(path.match(rule.test).groups ?? {}))
    to = to.replaceAll(name === "splat" ? ":splat" : `:${name}`, value ?? "")
  return to
}

/**
 * Follow a path like Netlify: a file shadows every rule, else the first
 * matching rule redirects. Returns the file it lands on (or null), the
 * number of redirects on the way, the final path (a full URL when a rule
 * leaves the site) and the rules it took.
 */
function serve(path) {
  const rules = []
  const seen = new Set()
  for (;;) {
    const file = fileFor(path)
    if (file) return { file, hops: rules.length, final: path, rules }
    const rule = ruleFor(path)
    // No rule: a 404. A path seen before: a redirect loop.
    if (!rule || seen.has(path)) return { file: null, hops: rules.length, final: path, rules }
    seen.add(path)
    rules.push(rule)
    const to = new URL(target(rule, path), SITE)
    if (to.origin !== SITE) return { file: null, hops: rules.length, final: to.href, rules }
    path = to.pathname
  }
}

const idCache = new Map()
/** Fragment targets of a page: every id, and <a name>. */
function anchorsOf(file) {
  if (!idCache.has(file)) {
    const html = markup(readFileSync(file, "utf8"))
    const ids = new Set()
    for (const { name, attrs } of tags(html, ["[a-z][\\w:-]*"])) {
      if (attrs.id) ids.add(attrs.id)
      if (name === "a" && attrs.name) ids.add(attrs.name)
    }
    idCache.set(file, ids)
  }
  return idCache.get(file)
}
const hasFragment = (file, hash) => {
  const id = safeDecode(hash, decodeURIComponent)
  // "#top" scrolls to the top of any page (HTML spec), "#" too.
  return !id || id.toLowerCase() === "top" || anchorsOf(file).has(id)
}

// ---------------------------------------------------------------- checks

const errors = []
const pages = [...htmlFiles(DIST)]
let links = 0

for (const page of pages) {
  const pageUrl = urlOf(page)
  const where = relative(DIST, page)
  const raw = readFileSync(page, "utf8")
  const html = markup(raw)

  // 1. Links and assets
  const refs = []
  for (const { name, attrs } of tags(html, [
    "a",
    "area",
    "link",
    "img",
    "script",
    "source",
    "video",
    "audio",
    "track",
    "iframe",
    "embed",
  ])) {
    if ((name === "a" || name === "area") && "href" in attrs)
      refs.push({ kind: "link", url: attrs.href })
    else if (name === "link" && attrs.href)
      refs.push({
        kind: "asset",
        url: attrs.href,
        canonical: /\bcanonical\b/i.test(attrs.rel ?? ""),
      })
    else {
      if (attrs.src) refs.push({ kind: "asset", url: attrs.src })
      if (name === "video" && attrs.poster) refs.push({ kind: "asset", url: attrs.poster })
      for (const candidate of (attrs.srcset ?? "").split(","))
        if (candidate.trim()) refs.push({ kind: "asset", url: candidate.trim().split(/\s+/)[0] })
    }
  }
  for (const ref of refs) {
    const at = `${where} -> ${ref.url}`
    let url
    try {
      url = new URL(ref.url, SITE + pageUrl)
    } catch {
      errors.push(`${at}: not a valid URL`)
      continue
    }
    if (url.origin !== SITE) continue // another site, mailto:, tel:, data:
    const path = url.pathname
    const hash = url.hash.slice(1)
    if (ref.kind === "asset") {
      const file = fileFor(path)
      if (!file)
        errors.push(`${at}: ${ref.canonical ? "canonical URL has no page" : "no such file"}`)
      else if (ref.canonical && canonical(path, file) !== path)
        errors.push(`${at}: canonical URL is not canonical, use ${canonical(path, file)}`)
      continue
    }
    links++
    const { file, hops, final } = serve(path)
    if (!file && hops > 0 && !final.startsWith("/"))
      errors.push(`${at}: an old URL (redirects to ${final}); link ${final}${url.hash} instead`)
    else if (!file)
      errors.push(
        `${at}: no page${final !== path ? ` (redirects to ${final}, which has none)` : ""}`,
      )
    else if (hops > 0)
      errors.push(`${at}: an old URL (redirects to ${final}); link ${final}${url.hash} instead`)
    else if (canonical(path, file) !== path)
      errors.push(`${at}: not the canonical URL; link ${canonical(path, file)}${url.hash} instead`)
    else if (!hasFragment(file, hash))
      errors.push(`${at}: no #${safeDecode(hash, decodeURIComponent)} on ${urlOf(file)}`)
  }

  // 4. Page invariants: legal links
  const hrefs = new Set(tags(html, ["a"]).map((a) => a.attrs.href))
  for (const legal of LEGAL)
    if (!hrefs.has(legal)) errors.push(`${where}: no legal link to ${legal}`)

  // 4. Page invariants: consent scripts first in <head>
  const head = raw.match(/<head\b[^>]*>([\s\S]*?)<\/head\s*>/i)?.[1]
  if (head === undefined) {
    errors.push(`${where}: no <head>`)
    continue
  }
  const headSource = head.replace(/<!--[\s\S]*?-->/g, "")
  const headTags = tags(headSource, ["script", "link"]).map((tag) => ({
    ...tag,
    body: tag.name === "script" ? headSource.slice(tag.end).split(/<\/script\s*>/i)[0] : "",
  }))
  const classic = (tag) =>
    !tag.attrs.type || /^(?:text|application)\/javascript$/i.test(tag.attrs.type)
  const setlang = headTags.findIndex(
    (t) => t.name === "script" && !t.attrs.src && /\bcmp_setlang\b/.test(t.body),
  )
  const blocker = headTags.findIndex(
    (t) => t.name === "script" && AUTOBLOCKER.test(t.attrs.src ?? ""),
  )
  if (setlang < 0) errors.push(`${where}: no window.cmp_setlang script in <head>`)
  if (blocker < 0) errors.push(`${where}: no consentmanager autoblocking script in <head>`)
  if (setlang >= 0 && blocker >= 0) {
    if (setlang > blocker)
      errors.push(`${where}: window.cmp_setlang comes after the autoblocking script`)
    if (!classic(headTags[setlang]))
      errors.push(`${where}: the cmp_setlang script is not a classic script`)
    const b = headTags[blocker].attrs
    if (!classic(headTags[blocker]) || "async" in b || "defer" in b)
      errors.push(
        `${where}: the autoblocking script is not a classic, blocking script (type, async or defer)`,
      )
    if (b["data-cmp-ab"] !== "1")
      errors.push(`${where}: the autoblocking script lacks data-cmp-ab="1"`)
    const first = headTags.findIndex(
      (t, i) =>
        i !== setlang &&
        i !== blocker &&
        (t.name === "script" || /\bstylesheet\b/i.test(t.attrs.rel ?? "")),
    )
    if (first >= 0 && first < Math.max(setlang, blocker)) {
      const t = headTags[first]
      errors.push(
        `${where}: <${t.name}${t.attrs.src ? ` src="${t.attrs.src}"` : t.attrs.href ? ` href="${t.attrs.href}"` : ""}> comes before the consent scripts`,
      )
    }
  }
}

// 4. The contact form, in the landing's HTML (Netlify Forms detects it at deploy).
const landing = join(DIST, "index.html")
if (!existsSync(landing)) errors.push("index.html: missing")
else {
  const html = markup(readFileSync(landing, "utf8"))
  const form = tags(html, ["form"]).find((f) => f.attrs.name === "contact")
  if (!form) errors.push('index.html: no <form name="contact">')
  else {
    const want = {
      method: "POST",
      action: "/",
      "data-netlify": "true",
      "data-netlify-honeypot": "bot-field",
    }
    for (const [name, value] of Object.entries(want))
      if ((name === "method" ? form.attrs[name]?.toUpperCase() : form.attrs[name]) !== value)
        errors.push(
          `index.html: the contact form needs ${name}="${value}" (has ${JSON.stringify(form.attrs[name] ?? null)})`,
        )
    const close = html.indexOf("</form", form.end)
    const body = html.slice(form.end, close < 0 ? undefined : close)
    const inputs = tags(body, ["input"]).map((i) => i.attrs)
    if (!inputs.some((i) => i.type === "hidden" && i.name === "form-name" && i.value === "contact"))
      errors.push(
        'index.html: the contact form lacks <input type="hidden" name="form-name" value="contact">',
      )
    if (!inputs.some((i) => i.name === "bot-field"))
      errors.push('index.html: the contact form lacks the honeypot <input name="bot-field">')
  }
}

// 2. Redirects. Netlify applies a _redirects file before netlify.toml, so
// one in the build (from public/) would override the rules checked here.
if (existsSync(join(DIST, "_redirects")))
  errors.push("_redirects: redirects belong in netlify.toml (a _redirects file takes precedence)")
for (const rule of redirects) {
  if (rule.status !== 301) errors.push(`${rule.label}: status ${rule.status}, expected 301`)
  if (rule.force) errors.push(`${rule.label}: forced; a forced rule would hide a page`)
  // A file at the source shadows the rule: Netlify serves the file.
  const shadows = new Set(
    pages.filter((page) => {
      const url = urlOf(page)
      return rule.test.test(url) || (url.endsWith(".html") && rule.test.test(url.slice(0, -5)))
    }),
  )
  const literal = !/[:*]/.test(rule.from)
  if (literal && fileFor(rule.from)) shadows.add(fileFor(rule.from))
  for (const file of shadows) errors.push(`${rule.label}: shadowed by ${relative(DIST, file)}`)
  if (literal) {
    const to = new URL(rule.to, SITE)
    if (to.origin !== SITE) continue
    const file = fileFor(to.pathname)
    if (!file)
      errors.push(
        `${rule.label}: target ${rule.to} is not a page${ruleFor(to.pathname) ? " (a chain)" : ""}`,
      )
    else if (canonical(to.pathname, file) !== to.pathname)
      errors.push(
        `${rule.label}: target ${rule.to} is not canonical, use ${canonical(to.pathname, file)}`,
      )
  }
}

// 3. URL map
const MAP = join(ROOT, "scripts", "url-map.json")
const map = JSON.parse(readFileSync(MAP, "utf8"))
for (const { old, new: next } of map) {
  const from = new URL(old, SITE)
  const to = new URL(next, SITE)
  const at = `url map: ${old}`
  const { file, hops, final, rules } = serve(from.pathname)
  for (const rule of rules) rule.exercised = true
  const want = to.origin === SITE ? fileFor(to.pathname) : null
  if (from.hash !== to.hash)
    errors.push(
      `${at}: a #fragment cannot be redirected, ${next} must carry ${from.hash || "none"}`,
    )
  else if (to.origin !== SITE) {
    to.hash = ""
    if (file) errors.push(`${at}: lands on ${urlOf(file)}, expected ${next}`)
    else if (final !== to.href)
      errors.push(`${at}: ${hops ? `redirects to ${final}` : "answers 404"}, expected ${next}`)
    else if (hops > 1) errors.push(`${at}: takes ${hops} hops to ${next}`)
  } else if (!want) errors.push(`${at}: the new URL ${next} has no page`)
  else if (canonical(to.pathname, want) !== to.pathname)
    errors.push(`${at}: the new URL ${next} is not canonical, use ${canonical(to.pathname, want)}`)
  else if (!file)
    errors.push(`${at}: answers 404${final !== from.pathname ? ` (redirects to ${final})` : ""}`)
  else if (file !== want) errors.push(`${at}: lands on ${final}, expected ${next}`)
  else if (hops > 1) errors.push(`${at}: takes ${hops} hops to ${next}`)
  else if (!hasFragment(file, to.hash.slice(1)))
    errors.push(`${at}: no ${to.hash} on ${to.pathname}`)
}
for (const rule of redirects)
  if (!rule.exercised) errors.push(`${rule.label}: no entry in scripts/url-map.json exercises it`)

if (errors.length) {
  console.error(`dist: ${errors.length} problem(s)\n- ${errors.join("\n- ")}`)
  process.exit(1)
}
console.log(`dist: ${links} links, ${map.length} old URLs, ${pages.length} pages`)

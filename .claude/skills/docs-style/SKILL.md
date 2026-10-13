---
name: docs-style
description: Always-on style guide for the Miragon AI site (VitePress at the repo root, served at https://miragon.ai). Use whenever editing, reviewing or planning any page (`index.md`, the five phase pages, anything under `tools/`), `.vitepress/config.ts` or `.vitepress/lifecycle.ts`, whenever a Miragon AI tool releases or changes its getting-started steps, and proactively whenever you suspect the site has drifted from the tools. Encodes the lifecycle structure and URL scheme, the per-page line budgets, the English voice and anti-slop rules, the decisions from Miragon/miragon-ai-docs#1, the VitePress + Mermaid stack and the rule against copying tool READMEs.
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# docs-style: keep the Miragon AI site honest and current

This repo is the one Miragon AI site, served at https://miragon.ai. It shows how Miragon's AI tools
support the BPM lifecycle: Analyse, Design, Implement, Execute, Optimize, and Optimize feeds back
into Analyse. Read this skill before you touch a page, and come back to it whenever a tool changes
in a way readers would notice.

## Goal

The value proposition comes first: what Miragon AI does for a team whose processes run on
Camunda 7, CIB seven or Operaton, phase by phase, and where a human decides. Every page distills its
sources. Reference material (commands beyond the first step, flags, configuration, APIs) stays in
each tool's own README, and the page links to it. A tool page that starts to read like its README
has outgrown its job; never copy a README.

## Information architecture and URLs

Value proposition first, then one page per phase, then one short page per tool.

| Page                                                    | URL                                                                                   | Holds                                                                                                                                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.md`                                              | `/`                                                                                   | The value proposition: lifecycle graphic, who it is for, what Miragon AI does per phase, human and AI, why Miragon, what we don't promise, contact form (`/#contact`) |
| `analyse.md`, `design.md`, `implement.md`, `execute.md` | `/analyse`, `/design`, `/implement`, `/execute`                                       | One page per phase: the problem today, how the tools help, human and AI, hand-over to the next phase                                                                  |
| `optimize.md`                                           | `/optimize`                                                                           | The phase without a tool: the problem, what the phase needs, what Execute already hands over                                                                          |
| `tools/<tool>.md`                                       | `/tools/<tool>` for analyzr, design-iq, bpmn-cli, skills, solution-templates, operate | One short page per tool: status, why, get started, proof you can open, where it fits, links to the reference                                                          |
| `tools/miragon-ai/index.md`                             | `/tools/miragon-ai/`                                                                  | Overview of miragon-ai, the MCP server                                                                                                                                |
| `tools/miragon-ai/architecture.md`                      | `/tools/miragon-ai/architecture`                                                      | One-page mental model of modules and external systems                                                                                                                 |
| `tools/miragon-ai/developer.md`                         | `/tools/miragon-ai/developer`                                                         | Clone, install, run, the common `pnpm` tasks                                                                                                                          |
| `tools/miragon-ai/operations.md`                        | `/tools/miragon-ai/operations`                                                        | Deployment, environment variables, observability                                                                                                                      |
| `tools/miragon-ai/usage.md`                             | `/tools/miragon-ai/usage`                                                             | Connecting an MCP host and what to ask                                                                                                                                |

- Link pages extensionless and absolute from the root, exactly as in the URL column. `pnpm build`
  fails on a dead internal link.
- GitHub links are full https URLs.
- Product names as displayed: analyzr, designIQ (repo Miragon/design-iq), bpmn-cli, Skills,
  Solution templates, miragon-ai (the MCP server), operate. The umbrella is Miragon AI.
- No new top-level page without the team. A new phase or tool page starts in
  `.vitepress/lifecycle.ts` and gets a row in the budget table below.
- The miragon-ai pages used to sit at the root. `netlify.toml` redirects `/architecture`,
  `/developer`, `/operations` and `/usage` (and their `.html` variants) with a 301. If you move a
  page, add a redirect there.

## One list of phases and tools

`.vitepress/lifecycle.ts` exports `PHASES` (name, link, job, tools) and `TOOLS`. The lifecycle
graphic (`theme/LifecycleMap.vue`), the nav and the sidebar (`config.ts`) are built from it. Add,
rename or move a tool there, never in `config.ts` alone. Page copy uses the same names and stays
consistent with the job labels. The graphic is the landing's hero; `<LifecycleMap />` also works
inside a page.

## Decisions

Taken on 2026-10-13 in Miragon/miragon-ai-docs#1. Follow them; changing one needs the team.

| Topic                  | Decision                                                                                                                                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language               | The site is English. Landing and phase copy adapt the agreed German value proposition in Notion (page "Value Proposition und Positionierung von Miragon.ai"). Adapt it into natural English; never translate word for word. |
| Optimize               | Honest: no tool yet. The Optimize page describes the problem and the outlook. miragon-ai stays in Execute, and its analytics module is never presented as the Optimize answer.                                              |
| The old marketing site | This site replaces miragon-ai-website. Value proposition, lifecycle story, docs and contact live here. Redirecting or archiving the old site is a separate step.                                                            |

## Voice

- English only. Talk to the reader ("you", "your team"). Active voice, present tense, plain and
  concrete. Docs pages are factual and precise; the landing may be bolder but never loud.
- Evidence before adjectives: versions, engines, commands, links. Date statements that age.
- No em dash or en dash as a connector anywhere in prose. Use a period, comma, colon or
  parentheses. brand-lint fails on it (rule A2).
- Anti-slop. brand-lint's S rules are tuned to German, so check these yourself: at most one "not X,
  but Y" per page; no list where every item starts with a bold keyword; no rhythmic triads; no
  colon punchlines ("The result: ..."); no rhetorical opening question; no empty intensifiers
  (really, truly, incredibly, seamlessly); no adjective pairs without evidence; no summary
  paragraph at the end.
- Avoid these words: `seamless`, `cutting-edge`, `game changer`, `next level`, `revolutionize`,
  `unlock`, `empower`, `leverage`, `robust`, `holistic`, `tailored`, `state of the art`,
  `future-proof`, `journey`.
- Spelling: Miragon AI in prose (never `Miragon.ai` or `Miragon-AI`; miragon.ai only as an
  address), CIB seven with a lowercase "seven", Camunda 7, Camunda 8, Operaton, AI (never `KI`). No
  emoji. British spelling (modelling, licence, analysed); the phase names stay as in the lifecycle
  graphic (Analyse, Optimize).
- Honesty: say what is alpha, pre-1.0 or pre-GA. No time or cost savings numbers, no unpublished
  eval numbers.
- Never link a private repo: Miragon/analyzr, Miragon/skills, Miragon/corporate-identity,
  Miragon/miragon-ai-website. analyzr's public proof is the demo at https://analyzr-demo.fly.dev.
  Skills install from the public plugin marketplaces in Miragon/bpmn-cli and Miragon/operate.
- Pages never mention internal sources (Notion pages, internal trainings, pitches, internal eval
  runs).

## Markdown conventions

- Frontmatter with `title` and `description` (one sentence; search and link previews use it).
- One `#` heading, then `##` sections. Tables for structured data. VitePress containers (`::: info`,
  `::: tip`, `::: warning`) sparingly, `::: code-group` when a step has variants.
- Commands in fenced code blocks with a language.
- A backticked snake_case token that looks like a miragon-ai tool (a `camunda7_` or `analytics_`
  prefix, `show_` in it or a `_data` ending) must be a tool miragon-ai registers, on any page. A
  backticked repo path in `tools/miragon-ai/` must exist in Miragon/miragon-ai. The refs check
  reads both.
- Mermaid diagrams only where they earn their place. Today there is one, on
  `tools/miragon-ai/architecture.md`.

## Stack

- VitePress 1.6.4 at the repo root, configured in `.vitepress/config.ts`. Every `*.md` outside the
  dot directories is a page except `README.md` and `CLAUDE.md` (`srcExclude`). `cleanUrls` and
  `lastUpdated` are on.
- Mermaid via `vitepress-plugin-mermaid`: the config is wrapped in `withMermaid(...)`. No competing
  diagram library.
- Local search (`themeConfig.search.provider: "local"`).
- Theme in `.vitepress/theme/`: the default theme without its bundled Inter font (Geist and Geist
  Mono come self-hosted via @fontsource) and `custom.css`, which maps the VitePress variables onto
  the CI tokens. The landing is always dark; doc pages keep the light/dark toggle. Components for
  Markdown: `LifecycleMap`, `TryItOut` (the miragon-ai playground card) and `BrandContact`. The
  layout mounts `LifecycleMap` as the landing's hero image (`home-hero-image`
  slot) and `LegalFooter` on every page.
- The CI tokens (`.vitepress/theme/cd-tokens.generated.css`) and the logos (`public/logo/`) are
  vendored verbatim from Miragon/corporate-identity and pinned by SHA-256 in
  `scripts/check-brand-assets.mjs` (miragon-brand 1.8.0). Never edit them, and never declare a
  `--cd-*` token anywhere else. A new CI release means copying the files from the miragon-brand
  skills, then updating `BRAND.version`, the hashes and the `ref` in `.github/workflows/ci.yml` in
  one commit.
- Dependencies are pinned exactly (`.npmrc` sets save-exact, CI checks it). Node 22, pnpm from
  `packageManager`.
- No other docs framework, theme or plugin without a real reason.

## Must-keep site features

| Feature                                   | Where                                    | Why                                                                                                                                                          |
| ----------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `LegalFooter` on every page, 404 included | `layout-bottom` slot in `theme/index.ts` | Impressum and Datenschutz must be reachable from every page; the default footer hides on sidebar pages.                                                      |
| consentmanager scripts                    | `head` in `config.ts`                    | Cookie consent with autoblocking; third-party scripts such as the Calendly embed wait for consent.                                                           |
| `BrandContact` with `id="contact"`        | landing page                             | Contact form on Netlify Forms plus Calendly; the nav's Contact entry links `/#contact`.                                                                      |
| Netlify settings                          | Netlify UI, documented in `netlify.toml` | Form detection on (the form needs it), Pretty URLs off (`cleanUrls` links extensionless URLs), Auto Minify off (it strips comments Vue needs for hydration). |

## Commands

```bash
pnpm install
pnpm dev       # dev server with hot reload
pnpm build     # static site in .vitepress/dist, fails on dead internal links
pnpm preview   # serve the build locally
pnpm format    # Prettier on the repo (CI runs pnpm format:check)
pnpm check     # brand assets + page budgets
```

## Checks

| Check                 | How                                                                   | Catches                                                                                                                                                                                     |
| --------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brand assets          | `pnpm check` runs `scripts/check-brand-assets.mjs`                    | Vendored tokens or logos changed, forked `--cd-*` tokens; with the miragon-brand plugin at hand (or `MIRAGON_BRAND_DIR`) also drift from the CI source.                                     |
| Page budgets          | `pnpm check` runs `scripts/check-page-budgets.mjs`                    | A page over its budget, a page without a budget row. It reads the table below.                                                                                                              |
| miragon-ai references | `MIRAGON_AI_DIR=../miragon-ai node scripts/check-miragon-ai-refs.mjs` | Tool names miragon-ai does not register (any page), repo paths in `tools/miragon-ai/` that do not exist. Skips without `MIRAGON_AI_DIR`; CI runs it on every pull request and every Monday. |
| brand-lint            | `.miragon/brand.json` enables it                                      | Em dashes, spellings, anti-slop patterns, off-palette colours. The miragon-brand hook lints each file you write; CI runs it on the repo. Zero hard findings.                                |
| Build                 | `pnpm build`                                                          | Dead internal links, broken Markdown or Vue.                                                                                                                                                |

To lint by hand, run `scripts/brand-lint.mjs` from the miragon-brand plugin in your Claude Code
plugin cache (`node <cache>/<marketplace>/miragon-brand/1.8.0/scripts/brand-lint.mjs <files>`). It
reads `.miragon/brand.json`, which switches the German-only rules off.

## Line budgets (hard ceiling)

| Page                               | Budget      |
| ---------------------------------- | ----------- |
| `index.md`                         | ≤ 110 lines |
| `tools/miragon-ai/index.md`        | ≤ 80 lines  |
| `tools/miragon-ai/architecture.md` | ≤ 150 lines |
| `tools/miragon-ai/developer.md`    | ≤ 80 lines  |
| `tools/miragon-ai/operations.md`   | ≤ 120 lines |
| `tools/miragon-ai/usage.md`        | ≤ 150 lines |
| `tools/*.md`                       | ≤ 70 lines  |
| `*.md`                             | ≤ 80 lines  |

Counted like `wc -l`. When a page approaches its budget, condense it.
`scripts/check-page-budgets.mjs` reads this table and the first matching row wins, so specific
paths stay above the globs that also cover them; `*` matches within one path segment. Every page
needs a row or a glob that covers it.

## When to refresh

| Change                                                                                        | Revisit                                                                                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| A tool releases (version, maturity, supported engines)                                        | Its tool page, its phase page, version and maturity statements on the landing                                 |
| Getting-started steps, install commands or URLs change (demo, playground, plugin marketplace) | The tool page and every phase page that links them                                                            |
| A phase gains, loses or renames a tool                                                        | `.vitepress/lifecycle.ts` first, then the phase page, the tool page, the landing and the table in `README.md` |
| A page moves                                                                                  | Budget row, a 301 in `netlify.toml`, every link to it                                                         |
| A repo turns public or private                                                                | Every link to it                                                                                              |
| The agreed value proposition changes                                                          | Landing and phase pages                                                                                       |
| miragon-ai: new or changed environment variable                                               | `tools/miragon-ai/operations.md`                                                                              |
| miragon-ai: new or removed tool, module or skill                                              | `tools/miragon-ai/usage.md`, `tools/miragon-ai/architecture.md`, then the refs check                          |
| miragon-ai: ports, prerequisites, Node, pnpm or Java version                                  | `tools/miragon-ai/developer.md`, `tools/miragon-ai/operations.md`                                             |
| miragon-ai: Docker, compose or deployment change                                              | `tools/miragon-ai/operations.md`                                                                              |

If one of these ships and the site stays as it was, the site is stale.

## Workflow when editing a page

1. Run `pnpm check` (or `wc -l` on the page) and know where you stand against the budget.
2. Find the page the change belongs on. A new page needs a `lifecycle.ts` entry, a budget and the
   team's agreement.
3. Distill from the source (the value proposition, the tool's README and releases) and link the
   README for detail.
4. Run `pnpm exec prettier --write <files>`, brand-lint on your files, `pnpm check` and
   `pnpm build`. For the miragon-ai section, also run the refs check.
5. Re-read the page against the voice rules; brand-lint misses the English anti-slop patterns.

## What stays out of the site

- Tool reference material: link the tool's README.
- German pages or translations.
- Savings numbers, unpublished eval numbers and internal sources.
- Links to private repos.
- Screenshots, unless they show what text cannot.
- Several pages for one tool, except the miragon-ai section.

If someone ships a tool change and has not mentioned the site, ask whether a page needs an update
before the change lands.

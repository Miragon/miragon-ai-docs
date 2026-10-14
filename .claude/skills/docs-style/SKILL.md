---
name: docs-style
description: Always-on style guide for the Miragon AI site (VitePress at the repo root, served at https://miragon.ai). Use whenever editing, reviewing or planning any page (`index.md`, the five phase pages, the tool landing pages and the Pulse docs under `tools/`), `.vitepress/config.ts`, `.vitepress/lifecycle.ts` or the theme components, whenever a Miragon AI tool releases or changes its getting-started steps, and proactively whenever you suspect the site has drifted from the tools. Encodes the lifecycle structure and URL scheme, the tool landing page pattern and its truth rule for hero artefacts, the Pulse naming rule, the per-page line budgets, the English voice and anti-slop rules, the decisions from Miragon/miragon-ai-docs#1, the VitePress + Mermaid stack and the rule against copying tool READMEs.
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# docs-style: keep the Miragon AI site honest and current

This repo is the one Miragon AI site, served at https://miragon.ai. It shows how Miragon's AI tools
support the BPM lifecycle: Analyse runs once at the start, then Design, Implement, Execute and
Optimize form the loop, and Optimize feeds back into Design. Read this skill before you touch a page,
and come back to it whenever a tool changes in a way readers would notice.

## Goal

The value proposition comes first: what Miragon AI does for a team whose processes run on
Camunda 7, CIB seven or Operaton, phase by phase, and where a human decides. Every page distills its
sources. Reference material (commands beyond the first step, flags, configuration, APIs) stays in
each tool's own README, and the page links to it. A tool page that starts to read like its README
has outgrown its job; never copy a README.

## Information architecture and URLs

Value proposition first, then one page per phase, then one landing page per tool.

| Page                                                    | URL                                                                                   | Holds                                                                                                                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `index.md`                                              | `/`                                                                                   | The value proposition: lifecycle graphic, who it is for, what Miragon AI does per phase, human and AI, why Miragon, what we don't promise, contact form (`/#contact`)                                  |
| `analyse.md`, `design.md`, `implement.md`, `execute.md` | `/analyse`, `/design`, `/implement`, `/execute`                                       | One page per phase: the problem today, how the tools help, human and AI, hand-over to the next phase                                                                                                   |
| `optimize.md`                                           | `/optimize`                                                                           | The phase without a tool: the problem, what the phase needs, what Execute already hands over                                                                                                           |
| `tools/<tool>.md`                                       | `/tools/<tool>` for analyzr, design-iq, bpmn-cli, skills, solution-templates, operate | The tool's landing page (see [Tool landing pages](#tool-landing-pages)): promise and real artefact in the hero, then the problem, how it works, get started, status, proof you can open, where it fits |
| `tools/pulse/index.md`                                  | `/tools/pulse/`                                                                       | Pulse's landing page: the chat window in the hero, the playground card, connecting your Claude (`#connect-your-claude`), links to the four doc pages                                                   |
| `tools/pulse/architecture.md`                           | `/tools/pulse/architecture`                                                           | One-page mental model of modules and external systems                                                                                                                                                  |
| `tools/pulse/developer.md`                              | `/tools/pulse/developer`                                                              | Clone, install, run, the common `pnpm` tasks                                                                                                                                                           |
| `tools/pulse/operations.md`                             | `/tools/pulse/operations`                                                             | Deployment, environment variables, observability                                                                                                                                                       |
| `tools/pulse/usage.md`                                  | `/tools/pulse/usage`                                                                  | Connecting an MCP host and what to ask                                                                                                                                                                 |

- Link pages extensionless and absolute from the root, exactly as in the URL column. `pnpm build`
  fails on a dead internal link.
- GitHub links are full https URLs.
- Product names as displayed: analyzr, designIQ (repo Miragon/design-iq), bpmn-cli, Skills,
  Solution templates, Pulse (the MCP server from the repo Miragon/miragon-ai), operate. The umbrella
  is Miragon AI.
- No new top-level page without the team. A new phase or tool page starts in
  `.vitepress/lifecycle.ts` and gets a row in the budget table below.
- The Pulse doc pages first sat at the root, then under `/tools/miragon-ai/`. `netlify.toml`
  redirects `/architecture`, `/developer`, `/operations` and `/usage` (and their `.html` variants)
  and everything under `/tools/miragon-ai/` to `/tools/pulse/` with a 301. If you move a page, add
  a redirect there.

## Pulse and miragon-ai

Pulse is the product name of the MCP server built in the repo Miragon/miragon-ai (the owner's
decision of 2026-10-13). Prose says Pulse. Where a reader needs the mapping, say it once per page:
"Pulse is the MCP server from the repo Miragon/miragon-ai" or "Pulse (the miragon-ai MCP server)".
Technical identifiers stay exact, because readers copy them:

| Identifier                     | Stays as                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| Repo and template              | `Miragon/miragon-ai`, `Miragon/miragon-ai-starter`                                    |
| Docker image                   | `miragon/miragon-ai-server`                                                           |
| npm packages                   | `@miragon-ai/*`                                                                       |
| MCP server name                | `claude mcp add --transport http miragon-ai …`, the `"miragon-ai"` key in host config |
| Playground host                | `miragon-ai-playground.fly.dev`                                                       |
| Environment variables, tools   | `MCP_OAUTH`, `CAMUNDA_BASE_URL` and the rest; `camunda7_*`, `analytics_*`             |
| The refs check and its env var | `scripts/check-miragon-ai-refs.mjs`, `MIRAGON_AI_DIR`                                 |

The four Pulse doc pages stay technical. Their opening line names Pulse once, for example "Pulse
(the miragon-ai MCP server) …", and after that they speak of the miragon-ai server, its modules and
its packages.

## One list of phases and tools

`.vitepress/lifecycle.ts` exports `PHASES` (name, link, job, tools, and `once` for Analyse, which
runs before the loop) and `TOOLS`. The lifecycle graphic (`theme/LifecycleMap.vue`), the nav and the
sidebar (`config.ts`) are built from it. Add, rename or move a tool there, never in `config.ts` alone.
Page copy uses the same names and stays consistent with the job labels, and a tool landing page's
`eyebrow` names the phase the tool sits in there. The graphic is the landing's hero;
`<LifecycleMap />` also works inside a page.

## Tool landing pages

Every tool page is a landing page of its own, in the spirit of `index.md` and not a doc view:
`tools/analyzr.md`, `tools/design-iq.md`, `tools/bpmn-cli.md`, `tools/skills.md`,
`tools/solution-templates.md`, `tools/operate.md` and `tools/pulse/index.md`. The four Pulse doc
pages stay docs. The frontmatter uses the VitePress home layout, so the page is always dark like the
landing:

```yaml
---
layout: home
title: <tool name>
description: <one sentence for search and link previews>
eyebrow: { phase: Execute, link: /execute } # renders "MIRAGON AI · EXECUTE" above the name
hero:
  name: <tool name> # the hero's one green word
  text: <the promise, a short sentence or two> # white headline
  tagline: <one or two sentences on what it is, for whom and on which engines>
  actions:
    - theme: brand
      text: Get started # or "Try the demo" / "Try the playground" with its URL
      link: "#get-started"
    - theme: alt
      text: GitHub # or npm, Docs: a public URL
      link: <public URL>
    - theme: alt
      text: Talk to us
      link: /#contact
artefact: <see the table below>
---
```

The hero artefact (`artefact`) renders right of the hero text, and below it on mobile.
`HeroArtefact.vue` picks the component by `type`. Start with the real artefact, never a decorative
icon or illustration (brand rule).

| `type`       | Renders           | Fields and limits                                                                                                                                                                                                                                                                               |
| ------------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chat`       | `PulseChat`       | No fields. Pulse only: a question, Pulse's answer with an incident widget, an input that opens the playground.                                                                                                                                                                                  |
| `terminal`   | `TerminalWindow`  | `title` and `lines`. A line is `{ cmd }` (a command after "$ "), `{ out, tone }` (output; `tone` is optional: `ok`, `warn`, `err` or `dim`), `{ note }` (a "# " comment) or `{ out: "" }` (a blank line). About 62 characters per line (longer lines scroll inside the window), about 14 lines. |
| `screenshot` | `ScreenshotFrame` | `src` (`/screens/<file>.jpg`, the file in `public/screens/`), `alt`, `url` (the address in the frame), `caption`. A JPEG of the real product, quality around 82, 1200 to 1400 px wide, well under 400 KB, cropped to what matters.                                                              |

Quote YAML strings that contain `:`, `#` or quotes or that start with a special character. Without
`artefact` the hero shows the lifecycle graphic, which is what the landing uses.

Truth rule for artefacts: every command is real, and every output is real. Produce it by running the
tool (against a local engine, the public analyzr demo or the tool's Docker image) or copy it
verbatim from the tool's README or docs. Shorten output only by dropping lines, never by rewording.
If you cannot verify an output, show only commands and notes. Never run anything that creates or
changes something outside your machine to get an artefact (no new repos, pushes or sign-ups, no
writes to the public playground or demo), and stop the containers you start. The numbers in
`PulseChat.vue` mirror the public playground, which reseeds every night.

The body is built from the landing building blocks (see [Landing building blocks](#landing-building-blocks)), the
way miragon.io builds its pages: full-width bands, each with a small accent eyebrow and a bold
title, holding cards, icon lists, steps or a comparison. The hero name is the page's `h1`. A tool
page follows this order; adapt it to the tool, and alternate `plain` and `tint` bands:

1. `The problem`: the pain in one line as the title, the problem paragraph as the intro, then
   `<CompareCards>` (today against with the tool) or a `<FeatureList>`.
2. `How it works`: three or four real steps in a centred `<StepList>`.
3. Optionally a band for what makes the tool distinct (Pulse: its toolsets as cards).
4. `Get started` with `id="get-started"` (the hero's primary action links here): Markdown with the
   prerequisites in a sentence and fenced commands, a `::: code-group` for variants.
5. `Status`: version and date in the intro, then a `<FeatureList>` of honest limits.
6. `Proof you can open`: a `<CardGrid>` of public links only.
7. `Where it fits`: a `<CardGrid>` with the phase page and the neighbouring tools.
8. A `<CtaBox>` with a tool-specific title and text; the button goes to `/#contact`.

Pulse's page also keeps the band `Connect your Claude in 30 seconds` with
`id="connect-your-claude"` (the developer page links the anchor), `<TryItOut />` and a `Docs` band
with a card for each doc page. Only the main landing carries the contact form (`<BrandContact />`)
in its last band; tool pages close with the `CtaBox`.

## Components

All live in `.vitepress/theme/`.

| Component         | Where it appears                                                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HeroArtefact`    | The layout mounts it in the `home-hero-image` slot of every home-layout page. It renders `PulseChat`, `TerminalWindow` or `ScreenshotFrame` from the frontmatter `artefact`, else `LifecycleMap`. |
| `HeroEyebrow`     | The layout mounts it in `home-hero-info-before`. It renders "Miragon AI · <phase>" from `eyebrow: { phase, link }`, and nothing without it; with it, `custom.css` turns the hero name green.      |
| `PulseChat`       | Pulse's hero (`type: chat`). Its input opens the playground in the MCP inspector.                                                                                                                 |
| `TerminalWindow`  | The hero of a CLI tool (`type: terminal`).                                                                                                                                                        |
| `ScreenshotFrame` | The hero of a tool with a UI (`type: screenshot`).                                                                                                                                                |
| `LifecycleMap`    | The landing's hero, and `<LifecycleMap />` inside any page.                                                                                                                                       |
| `TryItOut`        | `<TryItOut />`, the Pulse playground card, on Pulse's landing page only.                                                                                                                          |
| `BrandContact`    | `<BrandContact />`, the contact form with `id="contact"`, on the landing only.                                                                                                                    |
| `LegalFooter`     | The layout mounts it in `layout-bottom` on every page.                                                                                                                                            |
| `landing/*`       | The landing building blocks below, registered globally in `theme/index.ts`, coloured through the `--l-*` variables in `landing.css`.                                                              |

Markdown can use `LifecycleMap`, `TryItOut`, `BrandContact` and the landing building blocks. The
hero components come from the frontmatter only.

### Landing building blocks

They live in `.vitepress/theme/landing/` and follow miragon.io's components (section header, icon
card, steps, call to action), in the always-dark style of the landing pages. Structured content
goes into the page's frontmatter and reaches the component as `$frontmatter.<key>`.

| Component        | Use                                                                                                                                                                               | Props                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `<PageSection>`  | Every band below the hero. Markdown inside needs a blank line after the opening and before the closing tag.                                                                       | `id`, `eyebrow`, `title`, `intro`, `tone` (`plain`, `tint`, `dark`), `align`             |
| `<FeatureList>`  | An icon tile, a title and one or two sentences per item: problems, limits, reasons.                                                                                               | `items: [{ icon, title, text }]`, `columns` (1, 2, 3)                                    |
| `<CardGrid>`     | Cards with an optional icon tile or a small eyebrow label; a card with `link` is one link ("Learn more" or "Open" for external links). Proof, where it fits, docs, roles, phases. | `items: [{ icon, eyebrow, title, text, link, linkText }]`, `columns` (2, 3, 4), `center` |
| `<StepList>`     | Two to four numbered steps, centred.                                                                                                                                              | `items: [{ title, text }]`                                                               |
| `<CompareCards>` | Today against with the tool: short, paired lines.                                                                                                                                 | `before: { title, items }`, `after: { title, items }`                                    |
| `<CtaBox>`       | The closing box of a tool page: a blue surface, a white pill button.                                                                                                              | `title`, `text`, `label`, `href` (default `/#contact`), `note`                           |
| `<PillButton>`   | A miragon.io pill button inside a band.                                                                                                                                           | `href`, `label`, `variant` (`dark`, `light`, `outline`)                                  |

Icons are keys of `landing/Icon.vue`, a fixed set of Lucide icons (CI rule B9), drawn with the CI's
heavier stroke. Pick the icon of the concrete function, never AI symbolism (sparkles, robots,
brains), and only where it carries meaning. Add an icon to the set there when a page needs one.

Write frontmatter lists in block style, one key per line, and quote strings that contain `: ` or
start with `@`, `*`, `&`, `!`, `%` or a quote. Never put prose into a YAML flow map
(`{ title: …, text: … }`): a comma inside it silently cuts the text.

## Decisions

Taken on 2026-10-13 in Miragon/miragon-ai-docs#1; the last four rows came the same day with the
tool landing pages (Miragon/miragon-ai-docs#3). Follow them; changing one needs the team.

| Topic                  | Decision                                                                                                                                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language               | The site is English. Landing and phase copy adapt the agreed German value proposition in Notion (page "Value Proposition und Positionierung von Miragon.ai"). Adapt it into natural English; never translate word for word. |
| Optimize               | Honest: no tool yet. The Optimize page describes the problem and the outlook. Pulse stays in Execute, and its analytics module is never presented as the Optimize answer.                                                   |
| The old marketing site | This site replaces miragon-ai-website. Value proposition, lifecycle story, docs and contact live here. Redirecting or archiving the old site is a separate step.                                                            |
| Pulse                  | The site calls the MCP server from Miragon/miragon-ai Pulse; its technical identifiers keep their names (see [Pulse and miragon-ai](#pulse-and-miragon-ai)).                                                                |
| Tool pages             | Every tool page is a landing page of its own with the tool's real artefact in the hero. The Pulse doc pages stay docs.                                                                                                      |
| Website look           | The landing pages look like a website in miragon.io's visual language (bands, cards, icon lists, steps, a closing box) and stay always dark, the hero included (no blue gradient).                                          |
| Lifecycle loop         | Analyse runs once, at the start. Design, Implement, Execute and Optimize form the loop, and what you learn in Optimize goes back into Design.                                                                               |

## Voice

- English only. Talk to the reader ("you", "your team"). Active voice, present tense, plain and
  concrete. Docs pages are factual and precise; the landing and the tool landing pages may be bolder
  but never loud.
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

- Frontmatter with `title` and `description` (one sentence; search and link previews use it). Tool
  landing pages add the home-layout fields (see [Tool landing pages](#tool-landing-pages)).
- One `#` heading, then `##` sections. On a home-layout page the hero name is the heading and the
  body starts at `##`. Tables for structured data. VitePress containers (`::: info`, `::: tip`,
  `::: warning`) sparingly, `::: code-group` when a step has variants.
- Commands in fenced code blocks with a language.
- A backticked snake_case token that looks like a Pulse tool (a `camunda7_` or `analytics_` prefix,
  `show_` in it or a `_data` ending) must be a tool the miragon-ai server registers, on any page. A
  backticked repo path in `tools/pulse/` must exist in Miragon/miragon-ai. The refs check reads
  both.
- Mermaid diagrams only where they earn their place. Today there is one, on
  `tools/pulse/architecture.md`.

## Stack

- VitePress 1.6.4 at the repo root, configured in `.vitepress/config.ts`. Every `*.md` outside the
  dot directories is a page except `README.md` and `CLAUDE.md` (`srcExclude`). `cleanUrls` and
  `lastUpdated` are on.
- Mermaid via `vitepress-plugin-mermaid`: the config is wrapped in `withMermaid(...)`. No competing
  diagram library.
- Local search (`themeConfig.search.provider: "local"`).
- Theme in `.vitepress/theme/`: the default theme without its bundled Inter font (Geist and Geist
  Mono come self-hosted via @fontsource) and `custom.css`, which maps the VitePress variables onto
  the CI tokens. Every home-layout page (the landing and the tool landing pages) is always dark; doc
  pages keep the light/dark toggle. The layout mounts `HeroArtefact` (`home-hero-image`),
  `HeroEyebrow` (`home-hero-info-before`) and `LegalFooter` (`layout-bottom`); see
  [Components](#components).
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
| `BrandContact` with `id="contact"`        | landing page                             | Contact form on Netlify Forms plus Calendly; the nav's Contact entry and every "Talk to us" link point to `/#contact`.                                       |
| `#connect-your-claude`                    | `tools/pulse/index.md`                   | The Pulse developer page links this anchor.                                                                                                                  |
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

| Check            | How                                                                   | Catches                                                                                                                                                                                           |
| ---------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brand assets     | `pnpm check` runs `scripts/check-brand-assets.mjs`                    | Vendored tokens or logos changed, forked `--cd-*` tokens; with the miragon-brand plugin at hand (or `MIRAGON_BRAND_DIR`) also drift from the CI source.                                           |
| Page budgets     | `pnpm check` runs `scripts/check-page-budgets.mjs`                    | A page over its budget, a page without a budget row. It reads the table below.                                                                                                                    |
| Pulse references | `MIRAGON_AI_DIR=../miragon-ai node scripts/check-miragon-ai-refs.mjs` | Tool names the miragon-ai server does not register (any page), repo paths in `tools/pulse/` that do not exist. Skips without `MIRAGON_AI_DIR`; CI runs it on every pull request and every Monday. |
| brand-lint       | `.miragon/brand.json` enables it                                      | Em dashes, spellings, anti-slop patterns, off-palette colours. The miragon-brand hook lints each file you write; CI runs it on the repo. Zero hard findings.                                      |
| Build            | `pnpm build`                                                          | Dead internal links, broken Markdown or Vue.                                                                                                                                                      |

To lint by hand, run `scripts/brand-lint.mjs` from the miragon-brand plugin in your Claude Code
plugin cache (`node <cache>/<marketplace>/miragon-brand/1.8.0/scripts/brand-lint.mjs <files>`). It
reads `.miragon/brand.json`, which switches the German-only rules off.

## Line budgets (hard ceiling)

| Page                          | Budget      |
| ----------------------------- | ----------- |
| `index.md`                    | ≤ 260 lines |
| `tools/pulse/index.md`        | ≤ 230 lines |
| `tools/pulse/architecture.md` | ≤ 150 lines |
| `tools/pulse/developer.md`    | ≤ 80 lines  |
| `tools/pulse/operations.md`   | ≤ 120 lines |
| `tools/pulse/usage.md`        | ≤ 150 lines |
| `tools/*.md`                  | ≤ 230 lines |
| `*.md`                        | ≤ 80 lines  |

Counted like `wc -l`, frontmatter included. When a page approaches its budget, condense it.
`scripts/check-page-budgets.mjs` reads this table and the first matching row wins, so specific
paths stay above the globs that also cover them; `*` matches within one path segment. Every page
needs a row or a glob that covers it.

## When to refresh

| Change                                                                                        | Revisit                                                                                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| A tool releases (version, maturity, supported engines)                                        | Its tool page (status and hero artefact), its phase page, version and maturity statements on the landing      |
| Getting-started steps, install commands or URLs change (demo, playground, plugin marketplace) | The tool page and every phase page that links them                                                            |
| A tool's commands, output or UI change                                                        | The hero artefact on its tool page (the frontmatter `artefact`, or the screenshot in `public/screens/`)       |
| The Pulse playground's seed data changes                                                      | The numbers in `theme/PulseChat.vue`                                                                          |
| A phase gains, loses or renames a tool                                                        | `.vitepress/lifecycle.ts` first, then the phase page, the tool page, the landing and the table in `README.md` |
| A page moves                                                                                  | Budget row, a 301 in `netlify.toml`, every link to it                                                         |
| A repo turns public or private                                                                | Every link to it                                                                                              |
| The agreed value proposition changes                                                          | Landing and phase pages                                                                                       |
| Pulse: new or changed environment variable                                                    | `tools/pulse/operations.md`                                                                                   |
| Pulse: new or removed tool, module or skill                                                   | `tools/pulse/usage.md`, `tools/pulse/architecture.md`, then the refs check                                    |
| Pulse: ports, prerequisites, Node, pnpm or Java version                                       | `tools/pulse/developer.md`, `tools/pulse/operations.md`                                                       |
| Pulse: Docker, compose or deployment change                                                   | `tools/pulse/operations.md`                                                                                   |

If one of these ships and the site stays as it was, the site is stale.

## Workflow when editing a page

1. Run `pnpm check` (or `wc -l` on the page) and know where you stand against the budget.
2. Find the page the change belongs on. A new page needs a `lifecycle.ts` entry, a budget and the
   team's agreement.
3. Distill from the source (the value proposition, the tool's README and releases) and link the
   README for detail. For a hero artefact, run the commands yourself or copy the output verbatim
   from the README (truth rule).
4. Run `pnpm exec prettier --write <files>`, brand-lint on your files, `pnpm check` and
   `pnpm build`. For the Pulse section, also run the refs check.
5. Look at a tool landing page in `pnpm dev` at desktop and phone width: the artefact stays inside
   the page, and the page never scrolls sideways.
6. Re-read the page against the voice rules; brand-lint misses the English anti-slop patterns.

## What stays out of the site

- Tool reference material: link the tool's README.
- German pages or translations.
- Savings numbers, unpublished eval numbers and internal sources.
- Links to private repos.
- Screenshots, except a tool landing page's hero artefact or where they show what text cannot.
- Decorative icons or illustrations in place of the real artefact, VitePress `features` cards (use
  the landing building blocks instead) and icon grids with filler text.
- Several pages for one tool, except the Pulse section.

If someone ships a tool change and has not mentioned the site, ask whether a page needs an update
before the change lands.

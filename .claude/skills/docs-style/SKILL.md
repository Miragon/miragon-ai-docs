---
name: docs-style
description: Always-on style guide for the Miragon AI site (Astro, served at https://miragon.ai, landing pages only). Use whenever editing, reviewing or planning any page (the landing, the five phase pages and the tool landing pages in `src/content/`), `src/data/lifecycle.ts`, `astro.config.mjs` or the components in `src/components/`, whenever a Miragon AI tool releases or moves its getting-started steps, and proactively whenever you suspect the site has drifted from the tools. Encodes the lifecycle structure and URL scheme, the tool landing page pattern and its truth rule for hero artefacts, where getting started and docs live (each tool's repo), the Pulse naming rule, the per-page line budgets, the English voice and anti-slop rules, the decisions from Miragon/miragon-ai-docs#1, the Astro stack and the rule against copying tool READMEs.
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

For now the site is landing pages only (the owner's decision of 2026-10-14). Docs and getting
started live in each tool's repo, Pulse's in `docs/` of Miragon/miragon-ai, and the tool pages link
there. The site held docs under `/docs/` (Starlight) from 2026-10-13 to 2026-10-14; bringing docs
back needs the team.

## Information architecture and URLs

Value proposition first, then one page per phase, then one landing page per tool. Every page except
the 404 lives in `src/content/`; the table gives the paths below it.

| Page                                            | URL                                                                                    | Holds                                                                                                                                                                                                                              |
| ----------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `landing/index.mdx`                             | `/`                                                                                    | The value proposition: lifecycle graphic, who it is for, what Miragon AI does per phase, human and AI, why Miragon, what we don't promise, contact form (`/#contact`)                                                              |
| `phases/{analyse,design,implement,execute}.mdx` | `/analyse/`, `/design/`, `/implement/`, `/execute/`                                    | One page per phase: the problem today, how the tools help, human and AI, hand-over to the next phase                                                                                                                               |
| `phases/optimize.mdx`                           | `/optimize/`                                                                           | The phase without a tool: the problem, what the phase needs, what Execute already hands over                                                                                                                                       |
| `tools/<tool>.mdx`                              | `/tools/<tool>/` for analyzr, design-iq, bpmn-cli, skills, solution-templates, operate | The tool's landing page (see [Tool landing pages](#tool-landing-pages)): promise and real artefact in the hero, then the problem, how it works, get started (a link to the tool's repo), status, proof you can open, where it fits |
| `tools/pulse.mdx`                               | `/tools/pulse/`                                                                        | Pulse's landing page: the chat window in the hero, the playground card, connecting your Claude (`#connect-your-claude`), links to the docs in Miragon/miragon-ai                                                                   |

- Link pages absolute from the root and with the trailing slash, exactly as in the URL column
  (`/analyse/`, `/tools/pulse/#connect-your-claude`); `/` and `/#contact` stay as they are. Every
  page is built as `<path>/index.html`. `pnpm build` fails on a dead internal link, a missing
  `#anchor` and a page link without its trailing slash.
- GitHub links are full https URLs.
- Product names as displayed: analyzr, designIQ (repo Miragon/design-iq), bpmn-cli, Skills,
  Solution templates, Pulse (the MCP server from the repo Miragon/miragon-ai), operate. The umbrella
  is Miragon AI.
- No new top-level page without the team. A new phase or tool page starts in
  `src/data/lifecycle.ts` and gets a row in the budget table below. A new tool also needs its
  `start` there: the getting-started section in its own repo.
- The Pulse doc pages of the old site sat at the root. `netlify.toml` redirects `/architecture`,
  `/developer`, `/operations` and `/usage` (and their `.html` variants) with a 301 to their
  Markdown in Miragon/miragon-ai (`https://github.com/Miragon/miragon-ai/blob/main/docs/<page>.md`).
  `scripts/url-map.json` lists every old URL and its target, and the build checks that each lands
  there in one hop. If you move a page, add a redirect and a URL map entry.

## Pulse and miragon-ai

Pulse is the product name of the MCP server built in the repo Miragon/miragon-ai (the owner's
decision of 2026-10-13). Its docs are Markdown in `docs/` of that repo: `getting-started.md` (with
`#connect-your-claude-in-30-seconds` and `#run-it-on-your-own-engine`), `architecture.md`,
`developer.md`, `operations.md` and `usage.md`. Prose says Pulse. Where a reader needs the mapping,
say it once per page:
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

## One list of phases and tools

`src/data/lifecycle.ts` exports `PHASES` (name, link, job, tools, and `once` for Analyse, which runs
before the loop) and `TOOLS` (name, slug, link, job, start). `start` is where a reader starts with
the tool: the getting-started section in its repo, the public demo for analyzr (its repo is
private), and the page's own Get started band for Skills (two plugins, two repos). The lifecycle
graphic (`src/components/vue/LifecycleMap.vue`), the website nav (`src/data/nav.ts`), the tool cards
of the phase pages (`src/components/landing/PhaseTools.astro`) and the site footer
(`src/components/site/SiteFooter.astro`) are built from it. Add, rename or move a tool there, never in one of them alone. Page copy uses the same names
and stays consistent with the job labels, and a tool landing page's `eyebrow` names the phase the
tool sits in there. The graphic fills the landing's first band (`id="lifecycle"`) and the hero of
every phase page; `<LifecycleMap />` also works inside any website page.

## Phase pages

The five phase pages are website pages like the tool pages, not docs: `src/content/phases/` holds
`analyse.mdx`, `design.mdx`, `implement.mdx`, `execute.mdx` and `optimize.mdx`, rendered by
`src/pages/[phase].astro`. The hero carries "Miragon AI · Lifecycle" (linking to the landing's
lifecycle band), the phase name in green and the phase's promise, with the lifecycle graphic beside
it: the token runs from the start event to this phase and stays there, and the phase's row stays lit
(`<LifecycleMap current="Design" />`). The frontmatter (`phaseSchema` in `src/data/schemas.ts`):

```yaml
---
title: Design # the phase name, as in lifecycle.ts
description: <one sentence for search and link previews>
hero:
  name: Design # the phase name again, the hero's one green word
  text: <the phase's promise, one short sentence>
  tagline: <one or two sentences on what your team does in this phase>
  actions:
    - theme: brand
      text: See the tools
      link: "#tools"
    - theme: alt
      text: Talk to us
      link: /#contact
compare: { before: { title, items }, after: { title, items } } # in block style, see below
tools: # PhaseTools: one card per tool of the phase
  - tool: designIQ # the name in lifecycle.ts; job, link and start come from there
    text: [<one paragraph per string>]
    status: <version, maturity, date>
human: [<two cards: the agent (icon cog) and your team (icon users)>]
handover: # HandOver: what comes in and what goes out
  - direction: in # or out
    label: From Analyse # or "At the start", "To Implement"
    link: /analyse/
    text: <what is handed over>
    formats: [<.bpmn, REST (OpenAPI 3.1), ...>]
---
```

The body, in bands: `The problem today` (`<CompareCards>`), `How Miragon AI helps` with
`id="tools"` (`<PhaseTools>`, and a `<Note>` for what a tool does not do), `Human and AI`
(`<CardGrid columns={2}>`), `Hand-over` (`<HandOver>`), then a `<CtaBox>`. Analyse adds a `sources`
band (`<CardGrid>`, the status of each source as its eyebrow). Optimize has no tools: its bands are
the problem with a `No tool yet` note, `questions` (what the phase needs, one card per role), `raw`
(what Execute already hands over, with its limits) and the rest as above. The text of `tools` and
`handover` may hold `` `code` `` and `[links](/path/)` (`src/components/landing/inline.ts`); card
texts stay plain.

## Tool landing pages

Every tool page is a landing page of its own, in the spirit of the landing:
`src/content/tools/` holds `analyzr.mdx`, `design-iq.mdx`, `bpmn-cli.mdx`, `skills.mdx`,
`solution-templates.mdx`, `operate.mdx` and `pulse.mdx`. The route template
`src/pages/tools/[tool].astro` renders the hero from the frontmatter and the body below it, always
dark like the landing. There is no `layout` key. The frontmatter:

```yaml
---
title: <tool name>
description: <one sentence for search and link previews>
eyebrow: { phase: Execute, link: /execute/ } # renders "MIRAGON AI · EXECUTE" above the name
hero:
  name: <tool name> # the hero's one green word
  text: <the promise, a short sentence or two> # white headline
  tagline: <one or two sentences on what it is, for whom and on which engines>
  actions:
    - theme: brand
      text: Get started # or "Try the demo" / "Try the playground" with its URL
      link: <the tool's start in lifecycle.ts>
    - theme: alt
      text: GitHub # or npm, Docs: a public URL
      link: <public URL>
    - theme: alt
      text: Talk to us
      link: /#contact
artefact: <see the table below>
---
```

A strict schema checks the frontmatter (`toolSchema` in `src/data/schemas.ts`, the landing and the
phase pages have theirs too): a misspelt or unknown key, a missing field or an unknown icon fails
the build. A new list for a band needs its key there.

The hero artefact (`artefact`) renders right of the hero text, and below it on mobile.
`src/components/hero/HeroArtefact.astro` picks the component by `type`. Start with the real
artefact, never a decorative icon or illustration (brand rule).

| `type`       | Renders           | Fields and limits                                                                                                                                                                                                                                                                                                                                   |
| ------------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chat`       | `PulseChat`       | No fields. Pulse only: a question, Pulse's answer with an incident widget, an input that opens the playground.                                                                                                                                                                                                                                      |
| `terminal`   | `TerminalWindow`  | `title` and `lines`. A line is `{ cmd }` (a command after "$ "), `{ cont }` (the next line of a multi-line command), `{ out, tone }` (output; `tone` is optional: `ok`, `warn`, `err` or `dim`), `{ note }` (a "# " comment) or `{ out: "" }` (a blank line). About 62 characters per line (longer lines scroll inside the window), about 14 lines. |
| `screenshot` | `ScreenshotFrame` | `src` (`/screens/<file>.jpg`, the file in `public/screens/`), `alt`, `url` (the address in the frame), `caption`. A JPEG of the real product, quality around 82, 1200 to 1400 px wide, well under 400 KB, cropped to what matters.                                                                                                                  |
| `orbit`      | `HeroOrbit`       | No fields. The landing only: the orbit from the old landing's "From cockpit to conversation" section, a green sun with three dashed rings that turn (pure CSS, with a pause control).                                                                                                                                                               |

Quote YAML strings that contain `:`, `#` or quotes or that start with a special character. A tool
page needs an `artefact` (the schema requires it). Without one, the hero would show the lifecycle
graphic.

Truth rule for artefacts: every command is real, and every output is real. Produce it by running the
tool (against a local engine, the public analyzr demo or the tool's Docker image) or copy it
verbatim from the tool's README or docs. Shorten output only by dropping lines, never by rewording.
If you cannot verify an output, show only commands and notes. Never run anything that creates or
changes something outside your machine to get an artefact (no new repos, pushes or sign-ups, no
writes to the public playground or demo), and stop the containers you start. The numbers in
`PulseChat.astro` mirror the public playground, which reseeds every night.

The body is built from the landing building blocks (see [Landing building blocks](#landing-building-blocks)), the
way miragon.io builds its pages: full-width bands, each with a small accent eyebrow and a bold
title, holding cards, icon lists, steps or a comparison. The hero name is the page's `h1`. A tool
page follows this order; adapt it to the tool. Bands alternate `tint` and `plain`, starting with
`tint` right below the black hero, so the hero stands apart:

1. `The problem`: the pain in one line as the title, the problem paragraph as the intro, then
   `<CompareCards>` (today against with the tool) or a `<FeatureList>`.
2. `How it works`: three or four real steps in a centred `<StepList>`.
3. Optionally a band for what makes the tool distinct (Pulse: its toolsets as cards).
4. `Get started` with `id="get-started"`: the eyebrow, the title, an intro of one or two
   sentences (what you need, and whose README or docs the button opens), then
   `<PillButton label="Get started" href="<the tool's start>" />`. The commands live in the tool's
   repo, never on the page, and the hero's primary action links there too. Skills links both
   plugins. Old links to `#get-started` still land on the band.
5. `Status`: version and date in the intro, then a `<FeatureList>` of honest limits.
6. `Proof you can open`: a `<CardGrid>` of public links only.
7. `Where it fits`: a `<CardGrid>` with the phase page and the neighbouring tools.
8. A `<CtaBox>` with a tool-specific title and text; the button goes to `/#contact`.

Pulse's page also keeps the band `Connect your Claude in 30 seconds` with
`id="connect-your-claude"`, `<TryItOut />` and a pill to `getting-started.md#connect-your-claude-in-30-seconds`
in Miragon/miragon-ai, and a `Docs` band with a card for each of its reference pages there. Only the main landing carries the contact form (`<BrandContact />`) in its last band; tool
pages close with the `CtaBox`.

## Components

They live in `src/components/`: `hero/` (the hero and its artefacts), `landing/` (the building
blocks pages use), `site/` (the shared header, footer and head) and `vue/` (the islands).

| Component                  | Where it appears                                                                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Hero`                     | The route templates render it on the landing, every phase page and every tool page from the frontmatter `hero` (and `eyebrow`). It holds `HeroEyebrow` and the artefact.                                                 |
| `HeroArtefact`             | Right of the hero text. It renders `PulseChat`, `TerminalWindow`, `ScreenshotFrame` or `HeroOrbit` from the frontmatter `artefact`, else `LifecycleMap`.                                                                 |
| `HeroEyebrow`              | Above the hero name of a tool page ("Miragon AI · <phase>" from `eyebrow: { phase, link }`) and a phase page ("Miragon AI · Lifecycle"); with it, the hero name turns green.                                             |
| `PulseChat`                | Pulse's hero (`type: chat`). Its input opens the playground in the MCP inspector.                                                                                                                                        |
| `TerminalWindow`           | The hero of a CLI tool (`type: terminal`).                                                                                                                                                                               |
| `ScreenshotFrame`          | The hero of a tool with a UI (`type: screenshot`).                                                                                                                                                                       |
| `HeroOrbit`                | The landing's hero (`type: orbit`).                                                                                                                                                                                      |
| `LifecycleMap`             | The landing's first band as `<LifecycleMap />`, the hero of every phase page with `current` (the token stops in that phase), and inside any website page.                                                                |
| `TryItOut`                 | `<TryItOut />`, the Pulse playground card, on Pulse's landing page only.                                                                                                                                                 |
| `BrandContact`             | `<BrandContact />`, the contact form with `id="contact"`, on the landing only.                                                                                                                                           |
| `SiteHeader`, `SiteFooter` | Every page, from `src/layouts/Website.astro` (the header shows the wordmark with "AI" in green Geist beside it, as the CI has products write their name). The footer lists the phases and the tools, then the legal row. |
| `HeadCommon`               | The head of every page (the Website layout): fonts, the consentmanager scripts, icons, theme colour, the cascade layer order.                                                                                            |
| `landing/*`                | The landing building blocks below, coloured through the `--l-*` variables in `src/styles/tokens.css`.                                                                                                                    |

Website MDX (the landing, the phase pages and the tool pages) can use `LifecycleMap`, `TryItOut`,
`BrandContact`, `Note` and the landing building blocks without importing them: the route templates
pass them in (`WEBSITE_COMPONENTS` in `src/components/landing/index.ts`). Register a new one there.
The hero components come from the frontmatter only.

Two components hydrate in the browser as Vue islands (`client:visible`): `LifecycleMap` and
`BrandContact` in `src/components/vue/`. Everything else is an `.astro` component
that renders to HTML at build time. MDX in a collection cannot set `client:*` on a component it does not import, so an
island reaches MDX through an `.astro` wrapper that sets the directive
(`landing/LifecycleMapIsland.astro`, `landing/BrandContactIsland.astro`), mapped under the
component's name in `WEBSITE_COMPONENTS`. Never `client:only`: the contact form must be in the
built HTML for Netlify Forms, and the lifecycle graphic must render without JavaScript.

### Landing building blocks

They live in `src/components/landing/` and follow miragon.io's components (section header, icon
card, steps, call to action), in the always-dark style of the landing pages. Structured content
goes into the page's frontmatter and reaches the component as `frontmatter.<key>`:
`<CardGrid items={frontmatter.roles} columns={4} />`. Never `$frontmatter` or `:items="…"`; that
was VitePress.

| Component        | Use                                                                                                                                                                                                                       | Props                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `<PageSection>`  | Every band below the hero, alternating `tint` (the first) and `plain`. Markdown inside needs a blank line after the opening and before the closing tag.                                                                   | `id`, `eyebrow`, `title`, `intro`, `tone` (`plain`, `tint`, `dark`), `align`             |
| `<FeatureList>`  | An icon tile, a title and one or two sentences per item: problems, limits, reasons.                                                                                                                                       | `items: [{ icon, title, text }]`, `columns` (1, 2, 3)                                    |
| `<CardGrid>`     | Cards with an optional icon tile or a small eyebrow label; a card with `link` is one link ("Learn more" or "Open" for external links). Proof, where it fits, the docs in a tool's repo, roles, phases.                    | `items: [{ icon, eyebrow, title, text, link, linkText }]`, `columns` (2, 3, 4), `center` |
| `<StepList>`     | Two to four numbered steps, centred.                                                                                                                                                                                      | `items: [{ title, text }]`                                                               |
| `<CompareCards>` | Today against with the tool: short, paired lines.                                                                                                                                                                         | `before: { title, items }`, `after: { title, items }`                                    |
| `<CtaBox>`       | The closing box of a tool or phase page: a blue surface, a black pill button.                                                                                                                                             | `title`, `text`, `label`, `href` (default `/#contact`), `note`                           |
| `<PhaseTools>`   | The tools of a phase page, one card each with the tool's job, text, status and links to its page and its `start`.                                                                                                         | `items: [{ tool, text: [paragraphs], status }]`                                          |
| `<HandOver>`     | A phase page's hand-overs in two columns, comes in and goes out, with the formats as chips.                                                                                                                               | `items: [{ direction, label, link, text, formats }]`                                     |
| `<PillButton>`   | The site's button, as the header's "Talk to us": a pill with the label and an arrow. `blue` (default) for a band's primary action, `black` on blue surfaces (the CtaBox). Two side by side go into `<div class="pills">`. | `href`, `label`, `variant` (`blue`, `black`)                                             |
| `<Note>`         | A note box in the text of a website page, sparingly.                                                                                                                                                                      | `title`                                                                                  |

Icons are keys of `src/components/landing/icons.ts`, a fixed set of Lucide icons (CI rule B9) that
`Icon.astro` draws with `@lucide/astro` in the CI's heavier stroke. The schemas accept only these
keys. Pick the icon of the concrete function, never AI symbolism (sparkles, robots, brains), and
only where it carries meaning. Add an icon to the set there when a page needs one.

Write frontmatter lists in block style, one key per line, and quote strings that contain `: ` or
start with `@`, `*`, `&`, `!`, `%` or a quote. Never put prose into a YAML flow map
(`{ title: …, text: … }`): a comma inside it silently cuts the text.

## Decisions

Taken on 2026-10-13 in Miragon/miragon-ai-docs#1; the rows from Pulse to Lifecycle loop came the
same day with the tool landing pages (Miragon/miragon-ai-docs#3), the last row is the owner's
decision of 2026-10-14. Follow them; changing one needs the team.

| Topic                  | Decision                                                                                                                                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language               | The site is English. Landing and phase copy adapt the agreed German value proposition in Notion (page "Value Proposition und Positionierung von Miragon.ai"). Adapt it into natural English; never translate word for word. |
| Optimize               | Honest: no tool yet. The Optimize page describes the problem and the outlook. Pulse stays in Execute, and its analytics module is never presented as the Optimize answer.                                                   |
| The old marketing site | This site replaces miragon-ai-website. Value proposition, lifecycle story and contact live here. Redirecting or archiving the old site is a separate step.                                                                  |
| Pulse                  | The site calls the MCP server from Miragon/miragon-ai Pulse; its technical identifiers keep their names (see [Pulse and miragon-ai](#pulse-and-miragon-ai)).                                                                |
| Tool pages             | Every tool page is a landing page of its own with the tool's real artefact in the hero.                                                                                                                                     |
| Website look           | The landing pages look like a website in miragon.io's visual language (bands, cards, icon lists, steps, a closing box) and stay always dark, the hero included (no blue gradient).                                          |
| Lifecycle loop         | Analyse runs once, at the start. Design, Implement, Execute and Optimize form the loop, and what you learn in Optimize goes back into Design.                                                                               |
| Landing pages only     | For now the site has no docs. Docs and getting started live in each tool's repo, Pulse's in `docs/` of Miragon/miragon-ai; the tool pages link there.                                                                       |

## Voice

- English only. Talk to the reader ("you", "your team"). Active voice, present tense, plain and
  concrete. The landing and the tool landing pages may be bold but never loud.
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
  landing pages add the hero fields (see [Tool landing pages](#tool-landing-pages)).
- The hero name is the page's one heading, and the body is bands (`<PageSection>`).
- Notes sparingly: `<Note title="…">`. Neither Starlight asides nor VitePress containers
  (`::: info`, `::: code-group`) render here.
- MDX is not plain Markdown: in prose a `{` opens an expression and a `<` before a letter opens a
  tag, so put them in backticks or escape them (`\{`, `\<`). Comments are `{/* … */}`; an HTML
  comment fails the build. Prettier keeps every JSX tag in an `.mdx` file on one line
  (`.prettierrc.json`).
- Commands in fenced code blocks with a language.
- A backticked snake_case token that looks like a Pulse tool (a `camunda7_` or `analytics_` prefix,
  `show_` in it or a `_data` ending) must be a tool the miragon-ai server registers, on any page. A
  backticked repo path on Pulse's tool page (`src/content/tools/pulse.mdx`) must exist in
  Miragon/miragon-ai. The refs check reads both.

## Stack

- Astro 7.3.8, configured in `astro.config.mjs`. Static output without an adapter,
  `build.format: "directory"`: every page is `<path>/index.html` and is linked as `/<path>/`. Pages
  live in `src/content/` (see [Information architecture and URLs](#information-architecture-and-urls)).
- Every page (the landing, the phase pages, the tool pages and the 404) is rendered by the route
  templates in `src/pages/` in `src/layouts/Website.astro`. No site search.
- Component styles are scoped with `:where()` (`scopedStyleStrategy: "where"`), so they add no
  specificity; the landing building blocks put `:root` in front of their rules to beat the `.prose`
  element rules.
- Code blocks: Expressive Code (astro-expressive-code) with one dark theme (`github-dark-default`),
  styled like the VitePress blocks (no terminal title bar, the language in the corner,
  `src/styles/code.css`), in the cascade layer `expressive-code` between the reset and the page
  text.
- Vue only for the islands (`@astrojs/vue`); every other component is `.astro`. Components carry
  their CSS in a scoped `<style>`. No Tailwind.
- Always dark: `<html data-theme="dark">`, no theme toggle. Geist and Geist Mono come self-hosted
  via @fontsource. The header and the footer are shared (see [Components](#components)).
- Styles in `src/styles/`: `tokens.css` maps the CI tokens onto the site roles (`--site-*`) and the
  landing colours (`--l-*`); `website.css` holds the reset, the base and the `.prose` text styles;
  `code.css` the code blocks' language label.
- The CI tokens (`src/styles/cd-tokens.generated.css`) and the logos (`public/logo/`) are vendored
  verbatim from Miragon/corporate-identity and pinned by SHA-256 in
  `scripts/check-brand-assets.mjs` (miragon-brand 1.8.0). Never edit them, and never declare a
  `--cd-*` token anywhere else. A new CI release means copying the files from the miragon-brand
  skills, then updating `BRAND.version`, the hashes and the `ref` in `.github/workflows/ci.yml` in
  one commit.
- Redirects live in `netlify.toml` only. Astro's `redirects` stay unused: without an adapter they
  become meta-refresh pages that would shadow Netlify's 301s.
- Dependencies are pinned exactly (`.npmrc` sets save-exact, CI checks it). Node 22 (Astro needs
  22.12 or later), pnpm from `packageManager`.
- No docs framework, theme or plugin without the team.

## Must-keep site features

| Feature                               | Where                                                                  | Why                                                                                                                                                                                                        |
| ------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Legal row on every page, 404 included | `src/components/site/SiteFooter.astro`, in the Website layout          | Impressum and Datenschutz must be reachable from every page. The build fails on a page without both links.                                                                                                 |
| consentmanager scripts                | `src/data/head.ts`, rendered by `src/components/site/HeadCommon.astro` | Cookie consent with autoblocking; third-party scripts such as the Calendly embed wait for consent. They stay classic scripts ahead of every stylesheet and module script, and the build checks that order. |
| `BrandContact` with `id="contact"`    | landing page, an island whose form is in the built HTML                | Contact form on Netlify Forms plus Calendly; the header's "Talk to us" and every other "Talk to us" link point to `/#contact`. The build checks the form in `dist/index.html`.                             |
| `#connect-your-claude`                | the band on `src/content/tools/pulse.mdx`                              | Older links land on the band, which links on to Pulse's getting started in Miragon/miragon-ai.                                                                                                             |
| `#get-started`                        | the band on every tool page                                            | Older links to the band still land on the tool page, which links on to the tool's repo.                                                                                                                    |
| Netlify settings                      | Netlify UI, documented in `README.md`                                  | Form detection on (the form needs it); Pretty URLs and Auto Minify off, so Netlify serves the HTML the build checked (Auto Minify would also strip the comments the Vue islands need for hydration).       |

## Commands

```bash
pnpm install
pnpm dev       # dev server with hot reload, http://localhost:4321
pnpm build     # static site in dist/, fails on dead links (see Checks)
pnpm preview   # serve the build locally
pnpm format    # Prettier on the repo (CI runs pnpm format:check)
pnpm check     # brand assets + page budgets
```

Run by an agent (`CLAUDECODE=1`), `pnpm dev` and `pnpm preview` start in the background and return;
stop them with `pnpm astro dev stop` and `pnpm astro preview stop`.

## Checks

| Check            | How                                                                                                       | Catches                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brand assets     | `pnpm check` runs `scripts/check-brand-assets.mjs`                                                        | Vendored tokens or logos changed, forked `--cd-*` tokens; with the miragon-brand plugin at hand (or `MIRAGON_BRAND_DIR`) also drift from the CI source.                                                                                                                                                                                                                                                                               |
| Page budgets     | `pnpm check` runs `scripts/check-page-budgets.mjs`                                                        | A page over its budget, a page without a budget row. It reads the table below.                                                                                                                                                                                                                                                                                                                                                        |
| Pulse references | `MIRAGON_AI_DIR=../miragon-ai node scripts/check-miragon-ai-refs.mjs`                                     | Tool names the miragon-ai server does not register (any page), repo paths on Pulse's tool page that do not exist. Skips without `MIRAGON_AI_DIR`; CI runs it on every pull request and every Monday. The Pulse docs are checked in Miragon/miragon-ai (`docs-refs.test.ts`).                                                                                                                                                          |
| brand-lint       | `.miragon/brand.json` enables it                                                                          | Em dashes, spellings, anti-slop patterns, off-palette colours. The miragon-brand hook lints each file you write; CI runs it on the repo. Zero hard findings.                                                                                                                                                                                                                                                                          |
| Built site       | `pnpm build` runs `scripts/check-dist.mjs` after `astro build`; it also runs alone on an existing `dist/` | Over all of `dist/`: a dead internal link or `#anchor` (MDX and components alike), a page link without its trailing slash, a redirect in `netlify.toml` that a file shadows or that leads nowhere, an old URL in `scripts/url-map.json` that does not land on its target in one hop (on this site or in a tool's repo), a page without both legal links or with the consent scripts out of order, a landing without the contact form. |
| Build            | `pnpm build`                                                                                              | Broken Markdown, MDX or components, frontmatter the schemas reject.                                                                                                                                                                                                                                                                                                                                                                   |

To lint by hand, run `scripts/brand-lint.mjs` from the miragon-brand plugin in your Claude Code
plugin cache (`node <cache>/<marketplace>/miragon-brand/1.8.0/scripts/brand-lint.mjs <files>`). It
reads `.miragon/brand.json`, which switches the German-only rules off.

## Line budgets (hard ceiling)

| Page                            | Budget      |
| ------------------------------- | ----------- |
| `src/content/landing/index.mdx` | ≤ 260 lines |
| `src/content/tools/pulse.mdx`   | ≤ 230 lines |
| `src/content/tools/*.mdx`       | ≤ 230 lines |
| `src/content/phases/*.mdx`      | ≤ 160 lines |

Counted like `wc -l`, frontmatter included. When a page approaches its budget, condense it.
`scripts/check-page-budgets.mjs` reads this table and checks every `.md` and `.mdx` file outside
`dist/`, `public/`, `node_modules/` and the dot directories, except `README.md` and `CLAUDE.md`. The
first matching row wins, so specific paths stay above the globs that also cover them; `*` matches
within one path segment. Every page needs a row or a glob that covers it.

## When to refresh

| Change                                                                                        | Revisit                                                                                                                                  |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| A tool releases (version, maturity, supported engines)                                        | Its tool page (status and hero artefact), its phase page, version and maturity statements on the landing                                 |
| Getting-started steps, install commands or URLs change (demo, playground, plugin marketplace) | The tool's `start` in `src/data/lifecycle.ts`, the hero action and the Get started band of its tool page                                 |
| A tool's commands, output or UI change                                                        | The hero artefact on its tool page (the frontmatter `artefact`, or the screenshot in `public/screens/`)                                  |
| The Pulse playground's seed data changes                                                      | The numbers in `src/components/hero/PulseChat.astro`                                                                                     |
| A phase gains, loses or renames a tool                                                        | `src/data/lifecycle.ts` first, then the phase page, the tool page, the landing and the table in `README.md`                              |
| A page moves                                                                                  | Budget row, a 301 in `netlify.toml`, an entry in `scripts/url-map.json`, every link to it                                                |
| A repo turns public or private                                                                | Every link to it                                                                                                                         |
| The agreed value proposition changes                                                          | Landing and phase pages                                                                                                                  |
| Pulse: new or removed tool, module or skill                                                   | Pulse's tool page, then the refs check                                                                                                   |
| Pulse: docs pages added, renamed or anchors changed in `docs/` of Miragon/miragon-ai          | The `docs` cards and the two Get started pills on Pulse's tool page, `start` in `src/data/lifecycle.ts`, the redirects in `netlify.toml` |

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
5. Look at the page in `pnpm dev` at desktop and phone width: the artefact stays inside the page, and the page never scrolls sideways. Stop the dev
   server when you are done.
6. Re-read the page against the voice rules; brand-lint misses the English anti-slop patterns.

## What stays out of the site

- Tool reference material: link the tool's README.
- German pages or translations.
- Savings numbers, unpublished eval numbers and internal sources.
- Links to private repos.
- Screenshots, except a tool landing page's hero artefact or where they show what text cannot.
- Decorative icons or illustrations in place of the real artefact, generic feature cards on website
  pages (use the landing building blocks instead) and icon grids with filler text.
- Docs and getting-started pages: they live in each tool's repo, and the tool page links there.

If someone ships a tool change and has not mentioned the site, ask whether a page needs an update
before the change lands.

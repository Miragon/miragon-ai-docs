---
name: docs-style
description: Always-on style guide for the Miragon AI site (Astro with Starlight, served at https://miragon.ai). Use whenever editing, reviewing or planning any page (the landing, the five phase pages and the tool landing pages in `src/content/`, and the docs under `src/content/docs/docs/`, with a getting-started page per tool and the Pulse reference), `src/data/lifecycle.ts`, `astro.config.mjs` or the components in `src/components/`, whenever a Miragon AI tool releases or changes its getting-started steps, and proactively whenever you suspect the site has drifted from the tools. Encodes the lifecycle structure and URL scheme, the tool landing page pattern and its truth rule for hero artefacts, the Pulse naming rule, the per-page line budgets, the English voice and anti-slop rules, the decisions from Miragon/miragon-ai-docs#1, the Astro + Starlight + Mermaid stack and the rule against copying tool READMEs.
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

Value proposition first, then one page per phase, then one landing page per tool, and the docs
under `/docs/`. Every page except the 404 lives in `src/content/`; the table gives the paths below
it.

| Page                                            | URL                                                                                    | Holds                                                                                                                                                                                                                       |
| ----------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `landing/index.mdx`                             | `/`                                                                                    | The value proposition: lifecycle graphic, who it is for, what Miragon AI does per phase, human and AI, why Miragon, what we don't promise, contact form (`/#contact`)                                                       |
| `phases/{analyse,design,implement,execute}.mdx` | `/analyse/`, `/design/`, `/implement/`, `/execute/`                                    | One page per phase: the problem today, how the tools help, human and AI, hand-over to the next phase                                                                                                                        |
| `phases/optimize.mdx`                           | `/optimize/`                                                                           | The phase without a tool: the problem, what the phase needs, what Execute already hands over                                                                                                                                |
| `tools/<tool>.mdx`                              | `/tools/<tool>/` for analyzr, design-iq, bpmn-cli, skills, solution-templates, operate | The tool's landing page (see [Tool landing pages](#tool-landing-pages)): promise and real artefact in the hero, then the problem, how it works, get started (a link to the docs), status, proof you can open, where it fits |
| `tools/pulse.mdx`                               | `/tools/pulse/`                                                                        | Pulse's landing page: the chat window in the hero, the playground card, connecting your Claude (`#connect-your-claude`), links to the docs                                                                                  |
| `docs/docs/index.mdx`                           | `/docs/`                                                                               | The docs overview: a card for each tool's getting-started page                                                                                                                                                              |
| `docs/docs/<tool>/getting-started.mdx`          | `/docs/<tool>/getting-started/` for every tool                                         | The prerequisites and the first commands, variants as tabs (see [Docs pages](#docs-pages))                                                                                                                                  |
| `docs/docs/pulse/architecture.md`               | `/docs/pulse/architecture/`                                                            | One-page mental model of modules and external systems                                                                                                                                                                       |
| `docs/docs/pulse/developer.md`                  | `/docs/pulse/developer/`                                                               | Clone, install, run, the common `pnpm` tasks                                                                                                                                                                                |
| `docs/docs/pulse/operations.md`                 | `/docs/pulse/operations/`                                                              | Deployment, environment variables, observability                                                                                                                                                                            |
| `docs/docs/pulse/usage.md`                      | `/docs/pulse/usage/`                                                                   | Connecting an MCP host and what to ask                                                                                                                                                                                      |

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
  getting-started page, because the docs sidebar and the site footer link it, and a
  `/docs/<tool>` redirect in `netlify.toml` with its `scripts/url-map.json` entry.
- The Pulse doc pages first sat at the root, then under `/tools/miragon-ai/` and `/tools/pulse/`;
  now they are docs under `/docs/pulse/`. `netlify.toml` redirects `/architecture`, `/developer`,
  `/operations` and `/usage` (and their `.html` variants), `/tools/pulse/<page>` and
  `/tools/miragon-ai/<page>` to `/docs/pulse/<page>/`, the rest of `/tools/miragon-ai/` to
  `/tools/pulse/`, and `/docs/<tool>` to `/docs/<tool>/getting-started/`, all with a 301.
  `scripts/url-map.json` lists every old URL and its target, and the build checks that each lands
  there in one hop. If you move a page, add a redirect and a URL map entry.

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

`src/data/lifecycle.ts` exports `PHASES` (name, link, job, tools, and `once` for Analyse, which runs
before the loop), `TOOLS` (name, slug, link, job), `PULSE_DOCS` (Pulse's reference pages) and
`docsLink(tool)` (a tool's getting-started page). The lifecycle graphic
(`src/components/vue/LifecycleMap.vue`), the website nav (`src/data/nav.ts`), the docs sidebar
(`src/data/docs-sidebar.ts`) and the site footer (`src/components/site/SiteFooter.astro`) are built
from it. Add, rename or move a tool there, never in one of them alone. Page copy uses the same names
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
  - tool: designIQ # the name in lifecycle.ts; job, link and docs link come from there
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

Every tool page is a landing page of its own, in the spirit of the landing and not a doc view:
`src/content/tools/` holds `analyzr.mdx`, `design-iq.mdx`, `bpmn-cli.mdx`, `skills.mdx`,
`solution-templates.mdx`, `operate.mdx` and `pulse.mdx`. The docs stay docs. The route template
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
      link: /docs/<tool>/getting-started/
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
4. `Get started` with `id="get-started"`: the eyebrow and the title, then
   `<PillButton label="Get started" href="/docs/<tool>/getting-started/" />`. The prerequisites
   and the commands live on the tool's getting-started page (see [Docs pages](#docs-pages)), and
   the hero's primary action links there too. Old links to `#get-started` still land on the band.
5. `Status`: version and date in the intro, then a `<FeatureList>` of honest limits.
6. `Proof you can open`: a `<CardGrid>` of public links only.
7. `Where it fits`: a `<CardGrid>` with the phase page and the neighbouring tools.
8. A `<CtaBox>` with a tool-specific title and text; the button goes to `/#contact`.

Pulse's page also keeps the band `Connect your Claude in 30 seconds` with
`id="connect-your-claude"`, `<TryItOut />` and a pill to
`/docs/pulse/getting-started/#connect-your-claude`, and a `Docs` band with a card for each doc
page. Only the main landing carries the contact form (`<BrandContact />`) in its last band; tool
pages close with the `CtaBox`.

## Docs pages

Starlight renders the docs from `src/content/docs/docs/`, so they are served under `/docs/`, with
the docs sidebar (`src/data/docs-sidebar.ts`: an overview, then each tool with its getting-started
page and, for Pulse, the four reference pages). Previous and next links stay inside one tool
(`src/routeData.ts`).

- Every tool has `src/content/docs/docs/<tool>/getting-started.mdx` with
  `title: Get started with <tool>` and the band title as `description`. It holds what the tool
  page's Get started band held: the prerequisites in a sentence, then the commands. Pulse's page
  has two sections, `## Connect your Claude in 30 seconds` (the developer page links
  `#connect-your-claude`) and `## Run it on your own engine`.
- Variants of a step go into code tabs, imported from `@astrojs/starlight/components`:
  `<Tabs syncKey="<tool>">` with a `<TabItem label="…">` per variant. A link out, such as the
  playground, is a `<LinkCard>`; a button is a `<LinkButton>`.
- The docs overview (`index.mdx`) is a `<CardGrid>` of `<LinkCard>`s, one per tool.
- Docs pages are factual and precise. The Pulse reference pages follow
  [Pulse and miragon-ai](#pulse-and-miragon-ai).

## Components

They live in `src/components/`: `hero/` (the hero and its artefacts), `landing/` (the building
blocks pages use), `site/` (the shared header, footer and head), `starlight/` (the Starlight
overrides) and `vue/` (the islands).

| Component                  | Where it appears                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Hero`                     | The route templates render it on the landing, every phase page and every tool page from the frontmatter `hero` (and `eyebrow`). It holds `HeroEyebrow` and the artefact.                                                                                                                                                                                                                                       |
| `HeroArtefact`             | Right of the hero text. It renders `PulseChat`, `TerminalWindow`, `ScreenshotFrame` or `HeroOrbit` from the frontmatter `artefact`, else `LifecycleMap`.                                                                                                                                                                                                                                                       |
| `HeroEyebrow`              | Above the hero name of a tool page ("Miragon AI · <phase>" from `eyebrow: { phase, link }`) and a phase page ("Miragon AI · Lifecycle"); with it, the hero name turns green.                                                                                                                                                                                                                                   |
| `PulseChat`                | Pulse's hero (`type: chat`). Its input opens the playground in the MCP inspector.                                                                                                                                                                                                                                                                                                                              |
| `TerminalWindow`           | The hero of a CLI tool (`type: terminal`).                                                                                                                                                                                                                                                                                                                                                                     |
| `ScreenshotFrame`          | The hero of a tool with a UI (`type: screenshot`).                                                                                                                                                                                                                                                                                                                                                             |
| `HeroOrbit`                | The landing's hero (`type: orbit`).                                                                                                                                                                                                                                                                                                                                                                            |
| `LifecycleMap`             | The landing's first band as `<LifecycleMap />`, the hero of every phase page with `current` (the token stops in that phase), and inside any website page.                                                                                                                                                                                                                                                      |
| `TryItOut`                 | `<TryItOut />`, the Pulse playground card, on Pulse's landing page only.                                                                                                                                                                                                                                                                                                                                       |
| `BrandContact`             | `<BrandContact />`, the contact form with `id="contact"`, on the landing only.                                                                                                                                                                                                                                                                                                                                 |
| `SiteHeader`, `SiteFooter` | Every page (the header shows the wordmark with "AI" in green Geist beside it, as the CI has products write their name): website pages get them from `src/layouts/Website.astro`, docs pages from the Starlight overrides `Header` and `PageFrame`. On a phone, those show the website nav in Starlight's menu (`MobileMenuFooter`). The footer lists the phases, the tools and their docs, then the legal row. |
| `HeadCommon`               | The head of every page (the Website layout and the Starlight `Head` override): fonts, the consentmanager scripts, icons, theme colour.                                                                                                                                                                                                                                                                         |
| `landing/*`                | The landing building blocks below, coloured through the `--l-*` variables in `src/styles/tokens.css`.                                                                                                                                                                                                                                                                                                          |

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

| Component        | Use                                                                                                                                                                               | Props                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `<PageSection>`  | Every band below the hero, alternating `tint` (the first) and `plain`. Markdown inside needs a blank line after the opening and before the closing tag.                           | `id`, `eyebrow`, `title`, `intro`, `tone` (`plain`, `tint`, `dark`), `align`             |
| `<FeatureList>`  | An icon tile, a title and one or two sentences per item: problems, limits, reasons.                                                                                               | `items: [{ icon, title, text }]`, `columns` (1, 2, 3)                                    |
| `<CardGrid>`     | Cards with an optional icon tile or a small eyebrow label; a card with `link` is one link ("Learn more" or "Open" for external links). Proof, where it fits, docs, roles, phases. | `items: [{ icon, eyebrow, title, text, link, linkText }]`, `columns` (2, 3, 4), `center` |
| `<StepList>`     | Two to four numbered steps, centred.                                                                                                                                              | `items: [{ title, text }]`                                                               |
| `<CompareCards>` | Today against with the tool: short, paired lines.                                                                                                                                 | `before: { title, items }`, `after: { title, items }`                                    |
| `<CtaBox>`       | The closing box of a tool or phase page: a blue surface, a white pill button.                                                                                                     | `title`, `text`, `label`, `href` (default `/#contact`), `note`                           |
| `<PhaseTools>`   | The tools of a phase page, one card each with the tool's job, text, status and links to its page and getting-started page.                                                        | `items: [{ tool, text: [paragraphs], status }]`                                          |
| `<HandOver>`     | A phase page's hand-overs in two columns, comes in and goes out, with the formats as chips.                                                                                       | `items: [{ direction, label, link, text, formats }]`                                     |
| `<PillButton>`   | A miragon.io pill button inside a band.                                                                                                                                           | `href`, `label`, `variant` (`dark`, `light`, `outline`)                                  |
| `<Note>`         | A note box in the text of a website page, sparingly.                                                                                                                              | `title`                                                                                  |

Icons are keys of `src/components/landing/icons.ts`, a fixed set of Lucide icons (CI rule B9) that
`Icon.astro` draws with `@lucide/astro` in the CI's heavier stroke. The schemas accept only these
keys. Pick the icon of the concrete function, never AI symbolism (sparkles, robots, brains), and
only where it carries meaning. Add an icon to the set there when a page needs one.

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
  landing pages add the hero fields (see [Tool landing pages](#tool-landing-pages)).
- One `#` heading, then `##` sections. On the landing, the phase pages and the tool pages the hero
  name is the heading and the body is bands (`<PageSection>`). On the docs pages Starlight renders
  the frontmatter `title` as the heading, so the body has no `#` and starts at `##`. Tables for
  structured data in docs.
- Notes sparingly: `<Note title="…">` on website pages, Starlight asides (`:::note`, `:::tip`,
  `:::caution`) in docs. Asides only work in docs, and VitePress containers (`::: info`,
  `::: code-group`) no longer render anywhere. Code tabs only in docs (see [Docs pages](#docs-pages)).
- MDX is not plain Markdown: in prose a `{` opens an expression and a `<` before a letter opens a
  tag, so put them in backticks or escape them (`\{`, `\<`). Comments are `{/* … */}`; an HTML
  comment fails the build. Prettier keeps every JSX tag in an `.mdx` file on one line
  (`.prettierrc.json`).
- Commands in fenced code blocks with a language.
- A backticked snake_case token that looks like a Pulse tool (a `camunda7_` or `analytics_` prefix,
  `show_` in it or a `_data` ending) must be a tool the miragon-ai server registers, on any page. A
  backticked repo path in the Pulse docs (`src/content/docs/docs/pulse/`) or on Pulse's tool page
  (`src/content/tools/pulse.mdx`) must exist in Miragon/miragon-ai. The refs check reads both.
- Mermaid diagrams only where they earn their place. Today there is one, on
  `src/content/docs/docs/pulse/architecture.md`. A page with a diagram stays `.md`: in an `.mdx`
  file a `mermaid` code block fails the build.

## Stack

- Astro 7.3.8 with Starlight 0.42.6, configured in `astro.config.mjs`. Static output without an
  adapter, `build.format: "directory"`: every page is `<path>/index.html` and is linked as
  `/<path>/`. Pages live in `src/content/` (see
  [Information architecture and URLs](#information-architecture-and-urls)).
- Website pages (the landing, the phase pages, the tool pages and the 404) are rendered by the route
  templates in `src/pages/` in `src/layouts/Website.astro`. The docs are Starlight's, with
  `lastUpdated` on (the date of each page's last commit).
- Search: Starlight's Pagefind index covers the docs and the website pages (their `<main>` carries
  `data-pagefind-body`, and `data-pagefind-meta` names the result after the page title); the 404
  stays out.
- Mermaid via astro-mermaid, listed before Starlight in `astro.config.mjs`. It renders in the browser
  and loads only on a page with a diagram. No competing diagram library.
- Code blocks: Starlight's Expressive Code with one dark theme (`github-dark-default`), styled like
  the VitePress blocks (no terminal title bar, the language in the corner, `src/styles/code.css`).
- Vue only for the three islands (`@astrojs/vue`); every other component is `.astro`. Components
  carry their CSS in a scoped `<style>`. No Tailwind.
- Always dark, the docs included: `<html data-theme="dark">`, and the Starlight overrides
  `ThemeProvider` and `ThemeSelect` are empty, so there is no theme toggle. Geist and Geist Mono come
  self-hosted via @fontsource. The header and the footer are shared (see [Components](#components)).
- Styles in `src/styles/`: `tokens.css` maps the CI tokens onto the site roles (`--site-*`), the
  landing colours (`--l-*`) and Starlight's `--sl-*` variables; `website.css` holds the website base
  and the `.prose` text styles; `starlight.css` the text styles of the docs (as on the VitePress
  docs) and the Mermaid colours; `code.css` the code blocks' language label.
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
- No other docs framework, theme or plugin without a real reason.

## Must-keep site features

| Feature                               | Where                                                                                                | Why                                                                                                                                                                                                        |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Legal row on every page, 404 included | `src/components/site/SiteFooter.astro`, in the Website layout and the Starlight `PageFrame` override | Impressum and Datenschutz must be reachable from every page. The build fails on a page without both links.                                                                                                 |
| consentmanager scripts                | `src/data/head.ts`, rendered by `src/components/site/HeadCommon.astro`                               | Cookie consent with autoblocking; third-party scripts such as the Calendly embed wait for consent. They stay classic scripts ahead of every stylesheet and module script, and the build checks that order. |
| `BrandContact` with `id="contact"`    | landing page, an island whose form is in the built HTML                                              | Contact form on Netlify Forms plus Calendly; the header's "Talk to us" and every other "Talk to us" link point to `/#contact`. The build checks the form in `dist/index.html`.                             |
| `#connect-your-claude`                | `src/content/docs/docs/pulse/getting-started.mdx` and the band on `src/content/tools/pulse.mdx`      | The Pulse developer page links the docs anchor; older links land on the band.                                                                                                                              |
| `#get-started`                        | the band on every tool page                                                                          | Older links to the band still land on the tool page, which links on to the docs.                                                                                                                           |
| `#ci-cd`                              | `<span id="ci-cd"></span>` before `## CI/CD` in `src/content/docs/docs/pulse/operations.md`          | Starlight slugs the heading `#cicd`; the span keeps old `/operations#ci-cd` links working.                                                                                                                 |
| Netlify settings                      | Netlify UI, documented in `README.md`                                                                | Form detection on (the form needs it); Pretty URLs and Auto Minify off, so Netlify serves the HTML the build checked (Auto Minify would also strip the comments the Vue islands need for hydration).       |

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

| Check            | How                                                                                                       | Catches                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brand assets     | `pnpm check` runs `scripts/check-brand-assets.mjs`                                                        | Vendored tokens or logos changed, forked `--cd-*` tokens; with the miragon-brand plugin at hand (or `MIRAGON_BRAND_DIR`) also drift from the CI source.                                                                                                                                                                                                                                                         |
| Page budgets     | `pnpm check` runs `scripts/check-page-budgets.mjs`                                                        | A page over its budget, a page without a budget row. It reads the table below.                                                                                                                                                                                                                                                                                                                                  |
| Pulse references | `MIRAGON_AI_DIR=../miragon-ai node scripts/check-miragon-ai-refs.mjs`                                     | Tool names the miragon-ai server does not register (any page), repo paths in the Pulse docs or on Pulse's tool page that do not exist. Skips without `MIRAGON_AI_DIR`; CI runs it on every pull request and every Monday.                                                                                                                                                                                       |
| brand-lint       | `.miragon/brand.json` enables it                                                                          | Em dashes, spellings, anti-slop patterns, off-palette colours. The miragon-brand hook lints each file you write; CI runs it on the repo. Zero hard findings.                                                                                                                                                                                                                                                    |
| Docs links       | `pnpm build` (starlight-links-validator)                                                                  | A dead link or `#anchor` in a docs page.                                                                                                                                                                                                                                                                                                                                                                        |
| Built site       | `pnpm build` runs `scripts/check-dist.mjs` after `astro build`; it also runs alone on an existing `dist/` | Over all of `dist/`: a dead internal link or `#anchor` (website pages and components included), a page link without its trailing slash, a redirect in `netlify.toml` that a file shadows or that leads nowhere, an old URL in `scripts/url-map.json` that does not land on its target in one hop, a page without both legal links or with the consent scripts out of order, a landing without the contact form. |
| Build            | `pnpm build`                                                                                              | Broken Markdown, MDX or components, frontmatter the schemas reject.                                                                                                                                                                                                                                                                                                                                             |

To lint by hand, run `scripts/brand-lint.mjs` from the miragon-brand plugin in your Claude Code
plugin cache (`node <cache>/<marketplace>/miragon-brand/1.8.0/scripts/brand-lint.mjs <files>`). It
reads `.miragon/brand.json`, which switches the German-only rules off.

## Line budgets (hard ceiling)

| Page                                          | Budget      |
| --------------------------------------------- | ----------- |
| `src/content/landing/index.mdx`               | ≤ 260 lines |
| `src/content/tools/pulse.mdx`                 | ≤ 230 lines |
| `src/content/tools/*.mdx`                     | ≤ 230 lines |
| `src/content/phases/*.mdx`                    | ≤ 160 lines |
| `src/content/docs/docs/index.mdx`             | ≤ 40 lines  |
| `src/content/docs/docs/pulse/architecture.md` | ≤ 150 lines |
| `src/content/docs/docs/pulse/developer.md`    | ≤ 80 lines  |
| `src/content/docs/docs/pulse/operations.md`   | ≤ 120 lines |
| `src/content/docs/docs/pulse/usage.md`        | ≤ 150 lines |
| `src/content/docs/docs/*/getting-started.mdx` | ≤ 60 lines  |

Counted like `wc -l`, frontmatter included. When a page approaches its budget, condense it.
`scripts/check-page-budgets.mjs` reads this table and checks every `.md` and `.mdx` file outside
`dist/`, `public/`, `node_modules/` and the dot directories, except `README.md` and `CLAUDE.md`. The
first matching row wins, so specific paths stay above the globs that also cover them; `*` matches
within one path segment. Every page needs a row or a glob that covers it.

## When to refresh

| Change                                                                                        | Revisit                                                                                                                                    |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| A tool releases (version, maturity, supported engines)                                        | Its tool page (status and hero artefact), its getting-started page, its phase page, version and maturity statements on the landing         |
| Getting-started steps, install commands or URLs change (demo, playground, plugin marketplace) | The tool's getting-started page, the tool page and every phase page that links them                                                        |
| A tool's commands, output or UI change                                                        | The hero artefact on its tool page (the frontmatter `artefact`, or the screenshot in `public/screens/`)                                    |
| The Pulse playground's seed data changes                                                      | The numbers in `src/components/hero/PulseChat.astro`                                                                                       |
| A phase gains, loses or renames a tool                                                        | `src/data/lifecycle.ts` first, then the phase page, the tool page and its getting-started page, the landing and the table in `README.md`   |
| A page moves                                                                                  | Budget row, a 301 in `netlify.toml`, an entry in `scripts/url-map.json`, every link to it                                                  |
| A repo turns public or private                                                                | Every link to it                                                                                                                           |
| The agreed value proposition changes                                                          | Landing and phase pages                                                                                                                    |
| Pulse: new or changed environment variable                                                    | `src/content/docs/docs/pulse/operations.md`                                                                                                |
| Pulse: new or removed tool, module or skill                                                   | `src/content/docs/docs/pulse/usage.md`, `src/content/docs/docs/pulse/architecture.md`, then the refs check                                 |
| Pulse: ports, prerequisites, Node, pnpm or Java version                                       | `src/content/docs/docs/pulse/developer.md`, `src/content/docs/docs/pulse/operations.md`, `src/content/docs/docs/pulse/getting-started.mdx` |
| Pulse: Docker, compose or deployment change                                                   | `src/content/docs/docs/pulse/operations.md`, `src/content/docs/docs/pulse/getting-started.mdx`                                             |

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
5. Look at a tool landing page and its getting-started page in `pnpm dev` at desktop and phone
   width: the artefact stays inside the page, and the page never scrolls sideways. Stop the dev
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
- More than a landing page and a getting-started page for one tool, except Pulse's reference pages.

If someone ships a tool change and has not mentioned the site, ask whether a page needs an update
before the change lands.

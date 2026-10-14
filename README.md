# miragon-ai-docs

The Miragon AI site, served at https://miragon.ai. It shows how Miragon's AI tools support the BPM
lifecycle on Camunda 7, CIB seven and Operaton: the value proposition first, then one page per
phase, then one short page per tool. Reference material stays in each tool's own README; the site
links to it.

The site is built with [Astro](https://astro.build) and its docs theme
[Starlight](https://starlight.astro.build). The pages live in `src/content/`: the landing, the phase
pages and the tool pages are MDX files with a frontmatter schema each, and the docs under `/docs/`
are Starlight's collection.

## Lifecycle and tools

Analyse runs once, at the start. Then Design, Implement, Execute and Optimize form a loop, and
Optimize feeds back into Design.

| Phase                                         | Tool               | Page                                                                     | Getting started                                                                                             |
| --------------------------------------------- | ------------------ | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| [Analyse](src/content/phases/analyse.mdx)     | analyzr            | [`/tools/analyzr/`](src/content/tools/analyzr.mdx)                       | [`/docs/analyzr/getting-started/`](src/content/docs/docs/analyzr/getting-started.mdx)                       |
| [Design](src/content/phases/design.mdx)       | designIQ           | [`/tools/design-iq/`](src/content/tools/design-iq.mdx)                   | [`/docs/design-iq/getting-started/`](src/content/docs/docs/design-iq/getting-started.mdx)                   |
| [Design](src/content/phases/design.mdx)       | bpmn-cli           | [`/tools/bpmn-cli/`](src/content/tools/bpmn-cli.mdx)                     | [`/docs/bpmn-cli/getting-started/`](src/content/docs/docs/bpmn-cli/getting-started.mdx)                     |
| [Implement](src/content/phases/implement.mdx) | Skills             | [`/tools/skills/`](src/content/tools/skills.mdx)                         | [`/docs/skills/getting-started/`](src/content/docs/docs/skills/getting-started.mdx)                         |
| [Implement](src/content/phases/implement.mdx) | Solution templates | [`/tools/solution-templates/`](src/content/tools/solution-templates.mdx) | [`/docs/solution-templates/getting-started/`](src/content/docs/docs/solution-templates/getting-started.mdx) |
| [Execute](src/content/phases/execute.mdx)     | Pulse              | [`/tools/pulse/`](src/content/tools/pulse.mdx)                           | [`/docs/pulse/getting-started/`](src/content/docs/docs/pulse/getting-started.mdx)                           |
| [Execute](src/content/phases/execute.mdx)     | operate            | [`/tools/operate/`](src/content/tools/operate.mdx)                       | [`/docs/operate/getting-started/`](src/content/docs/docs/operate/getting-started.mdx)                       |
| [Optimize](src/content/phases/optimize.mdx)   | no tool yet        | [`/optimize/`](src/content/phases/optimize.mdx)                          |                                                                                                             |

Pulse is the MCP server from the repo [Miragon/miragon-ai](https://github.com/Miragon/miragon-ai).
Its docs add four reference pages to its getting-started page: architecture, developers,
operations and usage (`/docs/pulse/<page>/`, in `src/content/docs/docs/pulse/`). `/docs/` lists
every tool's getting-started page. The phases and tools above live in one list,
`src/data/lifecycle.ts`, which draws the lifecycle graphic on the landing page and builds the nav,
the docs sidebar and the site footer.

Every tool page is a landing page of its own, like the landing: a hero with the tool's real
artefact (Pulse's chat, a terminal session or a screenshot, picked in the frontmatter and rendered
by `src/components/hero/HeroArtefact.astro`), then the problem, how it works, how to get started,
its status, proof you can open and where it fits. Its Get started band links to the tool's
getting-started page in the docs, which holds the commands, with variants in tabs.

## Local development

You need Node 22 (`.nvmrc`; Astro needs 22.12 or later) and pnpm, pinned through `packageManager`
in `package.json` (`corepack enable` picks it up).

```bash
pnpm install
pnpm dev       # dev server with hot reload, http://localhost:4321
pnpm build     # static site in dist/, fails on dead links (see Checks and CI)
pnpm preview   # serve the build locally
pnpm check     # brand assets and page budgets
pnpm format    # Prettier on the whole repo
```

Started by an agent such as Claude Code (`CLAUDECODE=1` is set), `pnpm dev` and `pnpm preview` run
in the background and return at once; `pnpm astro dev stop` and `pnpm astro preview stop` end them.

## Repo layout

```text
.
├── src/
│   ├── content/
│   │   ├── landing/index.mdx    landing: value proposition, lifecycle, contact form
│   │   ├── phases/              one page per phase
│   │   ├── tools/               one landing page per tool
│   │   └── docs/docs/           the docs under /docs/: getting started per tool, Pulse's reference
│   ├── content.config.ts        the collections and their frontmatter schemas
│   ├── data/                    lifecycle.ts (phases and tools), nav, head, docs sidebar, schemas
│   ├── pages/                   route templates: landing, phases, tools, 404
│   ├── layouts/Website.astro    layout of the landing, the tool pages and the 404
│   ├── components/              hero, landing building blocks, site header and footer, Starlight
│   │                            overrides, the Vue islands
│   └── styles/                  vendored CI tokens, site roles, website and Starlight CSS
├── public/                      favicon, the vendored CI logos, hero screenshots
├── astro.config.mjs             Astro and Starlight config: sidebar, code theme, link validator
├── scripts/                     checks: brand assets, page budgets, Pulse (miragon-ai) references,
│                                the built site; url-map.json lists the old URLs
├── .claude/skills/docs-style/   style guide and page budgets for agents editing pages
├── .miragon/brand.json          brand-lint configuration
└── netlify.toml                 Netlify build, headers and redirects
```

## Checks and CI

`.github/workflows/ci.yml` runs on pull requests to `main`, on pushes to `main`, every Monday at
06:00 UTC and on demand.

| Job                   | What it does                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Build + checks        | Frozen install, `pnpm format:check`, `pnpm check` (vendored CI tokens and logos match their pinned hashes, no forked `--cd-*` tokens, every page within its line budget), `pnpm build` and a check that every dependency is pinned exactly. The build fails on a dead link in the docs (starlight-links-validator), then `scripts/check-dist.mjs` checks all of `dist/`: every internal link and `#anchor`, the trailing slash on page links, the redirects in `netlify.toml`, the old URLs in `scripts/url-map.json`, the legal links and the consent scripts on every page, and the contact form on the landing. |
| miragon-ai references | Checks out [Miragon/miragon-ai](https://github.com/Miragon/miragon-ai) and runs `scripts/check-miragon-ai-refs.mjs`: every backticked name on a page that looks like a Pulse tool is one the server registers, and every repo path in the Pulse docs (`src/content/docs/docs/pulse/`) and on Pulse's tool page (`src/content/tools/pulse.mdx`) exists. The weekly run catches drift from changes in miragon-ai.                                                                                                                                                                                                    |
| Brand                 | Needs the repository secret `CORPORATE_IDENTITY_READ_TOKEN`, a token with read access to the private Miragon/corporate-identity. It compares the vendored tokens and logos with the pinned CI release and runs brand-lint with the rules in `.miragon/brand.json`. Without the secret it leaves a notice and skips.                                                                                                                                                                                                                                                                                                |

Pull request titles follow Conventional Commits (`.github/workflows/pr-title.yml`). Dependabot
groups patch and minor updates weekly.

To run the references check locally, point it at a checkout of Miragon/miragon-ai:

```bash
MIRAGON_AI_DIR=../miragon-ai node scripts/check-miragon-ai-refs.mjs
```

## Deployment

Netlify builds the site with `netlify.toml` (`pnpm build`, publish `dist`, Node 22) and serves it at
https://miragon.ai. It is a static site: no adapter, no functions. Every page is built as
`<path>/index.html` and linked as `/<path>/`. Before `pnpm build`, the build command fetches the
full git history (the "Last updated" date on doc pages reads each page's last commit) and clears
Astro's cache in `node_modules/.astro`. Files under `/_astro/` carry a hash in their name and are
served with an immutable cache header.

`netlify.toml` also holds every redirect, all with a 301: the Pulse doc pages of the old site
(`/architecture`, `/developer`, `/operations`, `/usage` and their `.html` variants) and their later
paths under `/tools/pulse/` and `/tools/miragon-ai/` go to `/docs/pulse/<page>/`, the rest of
`/tools/miragon-ai/` to `/tools/pulse/`, and `/docs/<tool>` to the tool's getting-started page.
Astro's own `redirects` stay unused: without an adapter they become pages that would shadow these
rules. `scripts/url-map.json` lists every old URL and where it lands, and the build checks it.

Keep these settings in the Netlify UI:

| Setting                      | Value | Why                                                                                                                                  |
| ---------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Forms, form detection        | On    | The contact form on the landing page posts to Netlify Forms.                                                                         |
| Post processing, Pretty URLs | Off   | The build already links every page as `/<path>/`; a rewrite after the build would change links `scripts/check-dist.mjs` has checked. |
| Post processing, Auto Minify | Off   | HTML minification strips the comments the Vue islands need for hydration.                                                            |

## Decisions

Taken on 2026-10-13 in [Miragon/miragon-ai-docs#1](https://github.com/Miragon/miragon-ai-docs/issues/1):

- The site is English. Landing and phase copy adapt the team's agreed value proposition, which is
  written in German.
- Optimize has no tool yet, and the site says so. Pulse stays in Execute, and its analytics module
  is not presented as the answer for Optimize.
- This site replaces the old Miragon AI marketing site. Value proposition, lifecycle story, docs
  and contact live here; the old site gets redirected or archived in a separate step.

## Writing for the site

Pages are English and talk to the reader as "you". No em dashes or en dashes as connectors, no
marketing filler, versions and links instead of adjectives, and an honest word on what is alpha or
pre-1.0. Pages never link to private repos. The full rules and the line budget per page are in
[`.claude/skills/docs-style/SKILL.md`](.claude/skills/docs-style/SKILL.md).

## History

The site started as `docs/` in [Miragon/miragon-ai](https://github.com/Miragon/miragon-ai). It
moved here with `git filter-repo`, which kept the history of `docs/`. Pull request references in
the imported commit messages were rewritten to `Miragon/miragon-ai#NNN`, so they still point at the
pull requests in miragon-ai.

## License

[MIT](LICENSE)

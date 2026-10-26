# miragon-ai-docs

The Miragon AI site, served at https://miragon.ai. It shows how Miragon's AI tools support the BPM
lifecycle on Camunda 7, CIB seven and Operaton: the value proposition first, then one page per
phase, then one landing page per tool. Docs and getting started live in each tool's own repo; the
site links to them.

The site is built with [Astro](https://astro.build). The pages live in `src/content/`: the landing,
the phase pages and the tool pages are MDX files with a frontmatter schema each.

## Lifecycle and tools

Analyse runs once, at the start. Then Design, Implement, Execute and Optimize form a loop, and
Optimize feeds back into Design.

| Phase                                         | Tool               | Page                                                                     | Getting started                                                                                                                                             |
| --------------------------------------------- | ------------------ | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Analyse](src/content/phases/analyse.mdx)     | analyzr            | [`/tools/analyzr/`](src/content/tools/analyzr.mdx)                       | [the public demo](https://analyzr-demo.fly.dev/projects/nordwind-handel/review)                                                                             |
| [Design](src/content/phases/design.mdx)       | designIQ           | [`/tools/design-iq/`](src/content/tools/design-iq.mdx)                   | [designIQ docs](https://miragon.github.io/design-iq/getting-started)                                                                                        |
| [Design](src/content/phases/design.mdx)       | bpmn-cli           | [`/tools/bpmn-cli/`](src/content/tools/bpmn-cli.mdx)                     | [bpmn-cli docs](https://miragon.github.io/bpmn-cli/getting-started)                                                                                         |
| [Implement](src/content/phases/implement.mdx) | Skills             | [`/tools/skills/`](src/content/tools/skills.mdx)                         | [bpmn-cli plugin](https://miragon.github.io/bpmn-cli/claude-code-plugin), [pulse-cli plugin](https://miragon.github.io/pulse/cli/agents#claude-code-plugin) |
| [Implement](src/content/phases/implement.mdx) | bpmn-to-code       | [`/tools/bpmn-to-code/`](src/content/tools/bpmn-to-code.mdx)             | [bpmn-to-code docs](https://miragon.github.io/bpmn-to-code/getting-started/gradle)                                                                          |
| [Implement](src/content/phases/implement.mdx) | Solution templates | [`/tools/solution-templates/`](src/content/tools/solution-templates.mdx) | [README of Miragon/pulse-starter](https://github.com/Miragon/pulse-starter#quickstart)                                                                      |
| [Execute](src/content/phases/execute.mdx)     | Pulse              | [`/tools/pulse/`](src/content/tools/pulse.mdx)                           | [Pulse docs](https://miragon.github.io/pulse/getting-started)                                                                                               |
| [Execute](src/content/phases/execute.mdx)     | Pulse CLI          | [`/tools/pulse-cli/`](src/content/tools/pulse-cli.mdx)                   | [Pulse CLI docs](https://miragon.github.io/pulse/cli/getting-started)                                                                                       |
| [Optimize](src/content/phases/optimize.mdx)   | no tool yet        | [`/optimize/`](src/content/phases/optimize.mdx)                          |                                                                                                                                                             |

Pulse is the MCP server from the repo [Miragon/pulse](https://github.com/Miragon/pulse), called
Miragon/miragon-ai until 2026-10-16. Miragon AI stays the name of the tool family and of this site.
Pulse's docs, getting started and four reference pages (architecture, developer, operations, usage),
are a VitePress site built from that repo's `docs/` (https://miragon.github.io/pulse/). Pulse CLI,
operate until 0.10.0 (Miragon/operate, archived), ships from the same repo since Pulse 0.22.0; its
docs are under https://miragon.github.io/pulse/cli/. The phases and tools above live in one list, `src/data/lifecycle.ts`,
which draws the lifecycle graphic on the landing page and builds the nav, the tool cards of the
phase pages and the site footer. Its `start` field holds each tool's getting-started link.

Every tool page is a landing page of its own, like the landing: a hero with the tool's real
artefact (Pulse's chat, a terminal session or a screenshot, picked in the frontmatter and rendered
by `src/components/hero/HeroArtefact.astro`), then the problem, how it works, how to get started,
its status, proof you can open and where it fits. Its Get started band links to the place in the
tool's docs that holds the commands.

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
│   │   └── tools/               one landing page per tool
│   ├── content.config.ts        the collections and their frontmatter schemas
│   ├── data/                    lifecycle.ts (phases and tools), nav, head, schemas
│   ├── pages/                   route templates: landing, phases, tools, 404
│   ├── layouts/Website.astro    layout of the landing, the tool pages and the 404
│   ├── components/              hero, landing building blocks, site header and footer, the Vue
│   │                            islands
│   └── styles/                  vendored CI tokens, the site's colours on the CI roles, website
│                                and code block CSS
├── public/                      favicon, the vendored CI logos, hero screenshots
├── astro.config.mjs             Astro config: integrations, code block theme
├── scripts/                     checks: brand assets, page budgets, Pulse references,
│                                the built site; url-map.json lists the old URLs
├── .claude/skills/docs-style/   style guide and page budgets for agents editing pages
├── .miragon/brand.json          brand-lint configuration
└── netlify.toml                 Netlify build, headers and redirects
```

## Checks and CI

`.github/workflows/ci.yml` runs on pull requests to `main`, on pushes to `main`, every Monday at
06:00 UTC and on demand.

| Job                   | What it does                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Build + checks        | Frozen install, `pnpm format:check`, `pnpm check` (vendored CI tokens and logos match their pinned hashes, no forked `--cd-*` tokens, every page within its line budget), `pnpm build` and a check that every dependency is pinned exactly. After the build, `scripts/check-dist.mjs` checks all of `dist/`: every internal link and `#anchor`, the trailing slash on page links, the redirects in `netlify.toml`, the old URLs in `scripts/url-map.json`, the legal links and the consent scripts on every page, and the contact form on the landing. |
| miragon-ai references | Checks out [Miragon/pulse](https://github.com/Miragon/pulse) and runs `scripts/check-miragon-ai-refs.mjs`: every backticked name on a page that looks like a Pulse tool is one the server registers, and every repo path on Pulse's tool page (`src/content/tools/pulse.mdx`) exists. The weekly run catches drift from changes in Pulse. The job, the script and `MIRAGON_AI_DIR` keep their names from before the rename (the job is a required check).                                                                                              |
| Brand                 | Needs the repository secret `CORPORATE_IDENTITY_READ_TOKEN`, a token with read access to the private Miragon/corporate-identity. It checks out the pinned CI release (the tag `v1.9.0` of miragon-brand 1.9.0), compares the vendored tokens and logos with it and runs brand-lint with the rules in `.miragon/brand.json`. Without the secret it leaves a notice and skips.                                                                                                                                                                           |

Pull request titles follow Conventional Commits (`.github/workflows/pr-title.yml`). Dependabot
groups patch and minor updates weekly.

To run the references check locally, point it at a checkout of Miragon/pulse:

```bash
MIRAGON_AI_DIR=../pulse node scripts/check-miragon-ai-refs.mjs
```

## Deployment

Netlify builds the site with `netlify.toml` (`pnpm build`, publish `dist`, Node 22) and serves it at
https://miragon.ai. It is a static site: no adapter, no functions. Every page is built as
`<path>/index.html` and linked as `/<path>/`. Before `pnpm build`, the build command clears Astro's
cache in `node_modules/.astro`. Files under `/_astro/` carry a hash in their name and are
served with an immutable cache header.

`netlify.toml` also holds every redirect, all with a 301: the Pulse doc pages of the old site
(`/architecture`, `/developer`, `/operations`, `/usage` and their `.html` variants) go to their
pages in Pulse's docs site (https://miragon.github.io/pulse/). They pointed at
`/miragon-ai/` until the repo's rename; GitHub Pages does not redirect that old path.
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
- This site replaces the old Miragon AI marketing site. Value proposition, lifecycle story and
  contact live here; the old site gets redirected or archived in a separate step.

Taken on 2026-10-14 by the owner: for now the site is landing pages only. Docs and getting started
live in each tool's repo, as a VitePress site in `docs/` with the theme of Miragon/mcp-toolkit, served
on GitHub Pages at `https://miragon.github.io/<repo>/`. The tool pages link there.

## Writing for the site

Pages are English and talk to the reader as "you". No em dashes or en dashes as connectors, no
marketing filler, versions and links instead of adjectives, and an honest word on what is alpha or
pre-1.0. Pages never link to private repos. The full rules and the line budget per page are in
[`.claude/skills/docs-style/SKILL.md`](.claude/skills/docs-style/SKILL.md).

## History

The site started as `docs/` in the repo then called Miragon/miragon-ai, now
[Miragon/pulse](https://github.com/Miragon/pulse). It
moved here with `git filter-repo`, which kept the history of `docs/`. From 2026-10-13 to 2026-10-14
it also held the docs under `/docs/`, built with Starlight; they went back to the tools' repos. Pull request references in
the imported commit messages were rewritten to `Miragon/miragon-ai#NNN`, so they still point at the
pull requests in that repo; GitHub redirects them to Miragon/pulse.

## License

[MIT](LICENSE)

# miragon-ai-docs

The Miragon AI site, served at https://miragon.ai. It shows how Miragon's AI tools support the BPM
lifecycle on Camunda 7, CIB seven and Operaton: the value proposition first, then one page per
phase, then one short page per tool. Reference material stays in each tool's own README; the site
links to it.

The site is built with [VitePress](https://vitepress.dev) and sits at the repo root. Every Markdown
file outside the dot directories is a page, except this README and `CLAUDE.md`.

## Lifecycle and tools

Analyse, Design, Implement, Execute, Optimize. Optimize feeds back into Analyse.

| Phase                     | Tool               | Page                                                       |
| ------------------------- | ------------------ | ---------------------------------------------------------- |
| [Analyse](analyse.md)     | analyzr            | [`/tools/analyzr`](tools/analyzr.md)                       |
| [Design](design.md)       | designIQ           | [`/tools/design-iq`](tools/design-iq.md)                   |
| [Design](design.md)       | bpmn-cli           | [`/tools/bpmn-cli`](tools/bpmn-cli.md)                     |
| [Implement](implement.md) | Skills             | [`/tools/skills`](tools/skills.md)                         |
| [Implement](implement.md) | Solution templates | [`/tools/solution-templates`](tools/solution-templates.md) |
| [Execute](execute.md)     | miragon-ai         | [`/tools/miragon-ai/`](tools/miragon-ai/index.md)          |
| [Execute](execute.md)     | operate            | [`/tools/operate`](tools/operate.md)                       |
| [Optimize](optimize.md)   | no tool yet        | [`/optimize`](optimize.md)                                 |

miragon-ai, the MCP server, has its own section with four more pages: architecture, developers,
operations and usage. The phases and tools above live in one list, `.vitepress/lifecycle.ts`, which
draws the lifecycle graphic on the landing page and builds the nav and the sidebar.

## Local development

You need Node 22 (`.nvmrc`) and pnpm, pinned through `packageManager` in `package.json`
(`corepack enable` picks it up).

```bash
pnpm install
pnpm dev       # dev server with hot reload
pnpm build     # static site in .vitepress/dist, fails on dead internal links
pnpm preview   # serve the build locally
pnpm check     # brand assets and page budgets
pnpm format    # Prettier on the whole repo
```

## Repo layout

```text
.
├── index.md                     landing: value proposition, lifecycle, contact form
├── analyse.md ... optimize.md   one page per phase
├── tools/                       one page per tool
│   └── miragon-ai/              the MCP server's section
├── public/                      favicon and the vendored CI logos
├── .vitepress/
│   ├── config.ts                site config: head, nav, sidebar, search
│   ├── lifecycle.ts             phases and tools for the graphic, the nav and the sidebar
│   └── theme/                   Miragon CI theme and the landing components
├── scripts/                     checks: brand assets, page budgets, miragon-ai references
├── .claude/skills/docs-style/   style guide and page budgets for agents editing pages
├── .miragon/brand.json          brand-lint configuration
└── netlify.toml                 Netlify build and redirects
```

## Checks and CI

`.github/workflows/ci.yml` runs on pull requests to `main`, on pushes to `main`, every Monday at
06:00 UTC and on demand.

| Job                   | What it does                                                                                                                                                                                                                                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build + checks        | Frozen install, `pnpm format:check`, `pnpm check` (vendored CI tokens and logos match their pinned hashes, no forked `--cd-*` tokens, every page within its line budget), `pnpm build` (dead internal links fail it) and a check that every dependency is pinned exactly.                                                          |
| miragon-ai references | Checks out [Miragon/miragon-ai](https://github.com/Miragon/miragon-ai) and runs `scripts/check-miragon-ai-refs.mjs`: every backticked name on a page that looks like a miragon-ai tool is one the server registers, and every repo path in the miragon-ai section exists. The weekly run catches drift from changes in miragon-ai. |
| Brand                 | Needs the repository secret `CORPORATE_IDENTITY_READ_TOKEN`, a token with read access to the private Miragon/corporate-identity. It compares the vendored tokens and logos with the pinned CI release and runs brand-lint with the rules in `.miragon/brand.json`. Without the secret it leaves a notice and skips.                |

Pull request titles follow Conventional Commits (`.github/workflows/pr-title.yml`). Dependabot
groups patch and minor updates weekly.

To run the miragon-ai check locally, point it at a checkout of Miragon/miragon-ai:

```bash
MIRAGON_AI_DIR=../miragon-ai node scripts/check-miragon-ai-refs.mjs
```

## Deployment

Netlify builds the site with `netlify.toml` (`pnpm build`, publish `.vitepress/dist`, Node 22) and
serves it at https://miragon.ai. `netlify.toml` also redirects the old miragon-ai URLs
(`/architecture`, `/developer`, `/operations`, `/usage`) to `/tools/miragon-ai/` with a 301.

Keep these settings in the Netlify UI:

| Setting                      | Value | Why                                                                            |
| ---------------------------- | ----- | ------------------------------------------------------------------------------ |
| Forms, form detection        | On    | The contact form on the landing page posts to Netlify Forms.                   |
| Post processing, Pretty URLs | Off   | VitePress links extensionless URLs, and Netlify serves `/foo` from `foo.html`. |
| Post processing, Auto Minify | Off   | HTML minification strips comments Vue needs for hydration.                     |

## Decisions

Taken on 2026-10-13 in [Miragon/miragon-ai-docs#1](https://github.com/Miragon/miragon-ai-docs/issues/1):

- The site is English. Landing and phase copy adapt the team's agreed value proposition, which is
  written in German.
- Optimize has no tool yet, and the site says so. miragon-ai stays in Execute, and its analytics
  module is not presented as the answer for Optimize.
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

# CLAUDE.md

This repo is the Miragon AI site (Astro), served at https://miragon.ai. For now it is landing pages
only: docs and getting started live in each tool's repo, as a VitePress site in one shared style
(the theme of Miragon/mcp-toolkit) on GitHub Pages. `README.md` covers setup, CI and deployment.

- Load the `docs-style` skill (`.claude/skills/docs-style/SKILL.md`) before you edit, review or plan
  any page. It holds the URL scheme, the voice rules, the decisions and the line budget per page.
- Pages live in `src/content/`. The landing (`landing/index.mdx`), the phase pages
  (`phases/<phase>.mdx`) and the tool landing pages (`tools/<tool>.mdx`) are content collections
  with strict frontmatter schemas (`src/data/schemas.ts`), rendered by the route templates in
  `src/pages/`. There are no docs pages here; do not add `/docs/` back without the team.
- `src/data/lifecycle.ts` is the one list of phases and tools. The lifecycle graphic
  (`src/components/vue/LifecycleMap.vue`), the website nav (`src/data/nav.ts`), the tool cards of the
  phase pages (`src/components/landing/PhaseTools.astro`) and the site footer
  (`src/components/site/SiteFooter.astro`) are built from it, so add, rename or move a tool there
  and not in one of them. Each tool's `start` is its getting-started link.
- Pulse is the MCP server from the repo Miragon/pulse (Miragon/miragon-ai until 2026-10-16; Miragon
  AI stays the name of the tool family and of this site, and this repo keeps its name). Its landing page is
  `src/content/tools/pulse.mdx`, its docs are the VitePress site in `docs/` of Miragon/pulse
  (https://miragon.github.io/pulse/). Say "Pulse" in prose and keep the technical identifiers exact
  (repo, starter Miragon/pulse-starter, Docker image, npm packages, MCP client key `pulse`,
  playground host pulse-playground.miragon.ai, tool names). Name only what is published: since
  0.21.0 (2026-10-16) the image is `ghcr.io/miragon/pulse-server` and the packages are
  `@miragon/pulse-*`; the Docker Hub image `miragon/miragon-ai-server` and the deprecated
  `@miragon-ai/*` packages stay frozen at 0.20.0. The skill's identifier table has both names.
- Pulse CLI was operate until 0.10.0 (Miragon/operate, now archived). Since Pulse 0.22.0
  (2026-10-25) it ships from Miragon/pulse (`apps/cli`, docs https://miragon.github.io/pulse/cli/)
  as `@miragon/pulse-cli`, command `pulse-cli`, plugin `pulse-cli@pulse`. Its page is
  `src/content/tools/pulse-cli.mdx`; `/tools/operate/` redirects there. Say "Pulse CLI" in prose and
  `pulse-cli` for the command, never operate for anything current.
- Every tool page is a landing page (an entry of the `tools` collection, no `layout: home`: eyebrow,
  hero with the tool's real artefact, then a short body). Its Get started band links to the place
  in the tool's docs site that holds the commands. The skill describes the pattern and its truth rule
  for artefacts.
- Never edit `src/styles/cd-tokens.generated.css` or the logos in `public/logo/`. They are vendored
  from Miragon/corporate-identity (miragon-brand 1.9.0) and pinned in
  `scripts/check-brand-assets.mjs`. No other file declares a `--cd-*` token. The site is always
  dark through the CI's dark mode (`data-cd-theme="dark"` on `<html>`), and `src/styles/tokens.css`
  maps the site's colours onto the CI roles `--cd-ui-*`; use a role, not a `color-mix()` lift.
- `.miragon/brand.json` switches brand-lint on: the miragon-brand plugin lints each file you write,
  and CI lints the repo. Fix every hard finding (an em dash as a connector is one).
- Before you finish, run `pnpm format`, `pnpm check` and `pnpm build`. The build is the link gate:
  `scripts/check-dist.mjs` fails it on a dead link or `#anchor` anywhere in `dist/`, a broken
  redirect and a missing legal link, consent script or contact form. After changes to
  `src/content/tools/pulse.mdx` or Pulse tool names on any page, also run
  `MIRAGON_AI_DIR=../pulse node scripts/check-miragon-ai-refs.mjs` (a checkout of Miragon/pulse).
- Run by an agent, `pnpm dev` and `pnpm preview` start in the background; stop them with
  `pnpm astro dev stop` and `pnpm astro preview stop`.
- No links to private repos: Miragon/analyzr, Miragon/skills, Miragon/corporate-identity,
  Miragon/miragon-ai-website. The repo is public.
- Commit messages and pull request titles follow Conventional Commits.

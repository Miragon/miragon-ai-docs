# CLAUDE.md

This repo is the Miragon AI site (Astro), served at https://miragon.ai. For now it is landing pages
only: docs and getting started live in each tool's repo. `README.md` covers setup, CI and
deployment.

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
- Pulse is the MCP server from the repo Miragon/miragon-ai. Its landing page is
  `src/content/tools/pulse.mdx`, its docs are Markdown in `docs/` of Miragon/miragon-ai. Say
  "Pulse" in prose and keep the technical identifiers exact (repo, Docker image, `@miragon-ai/*`
  packages, MCP server name, playground host, tool names).
- Every tool page is a landing page (an entry of the `tools` collection, no `layout: home`: eyebrow,
  hero with the tool's real artefact, then a short body). Its Get started band links to the place
  in the tool's repo that holds the commands. The skill describes the pattern and its truth rule
  for artefacts.
- Never edit `src/styles/cd-tokens.generated.css` or the logos in `public/logo/`. They are vendored
  from Miragon/corporate-identity and pinned in `scripts/check-brand-assets.mjs`. No other file
  declares a `--cd-*` token.
- `.miragon/brand.json` switches brand-lint on: the miragon-brand plugin lints each file you write,
  and CI lints the repo. Fix every hard finding (an em dash as a connector is one).
- Before you finish, run `pnpm format`, `pnpm check` and `pnpm build`. The build is the link gate:
  `scripts/check-dist.mjs` fails it on a dead link or `#anchor` anywhere in `dist/`, a broken
  redirect and a missing legal link, consent script or contact form. After changes to
  `src/content/tools/pulse.mdx` or Pulse tool names on any page, also run
  `MIRAGON_AI_DIR=../miragon-ai node scripts/check-miragon-ai-refs.mjs`.
- Run by an agent, `pnpm dev` and `pnpm preview` start in the background; stop them with
  `pnpm astro dev stop` and `pnpm astro preview stop`.
- No links to private repos: Miragon/analyzr, Miragon/skills, Miragon/corporate-identity,
  Miragon/miragon-ai-website. The repo is public.
- Commit messages and pull request titles follow Conventional Commits.

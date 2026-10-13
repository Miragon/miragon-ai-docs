# CLAUDE.md

This repo is the Miragon AI site (VitePress), served at https://miragon.ai. `README.md` covers
setup, CI and deployment.

- Load the `docs-style` skill (`.claude/skills/docs-style/SKILL.md`) before you edit, review or plan
  any page. It holds the URL scheme, the voice rules, the decisions and the line budget per page.
- The site sits at the repo root. Every `*.md` outside the dot directories is a page, except
  `README.md` and `CLAUDE.md` (`srcExclude` in `.vitepress/config.ts`).
- `.vitepress/lifecycle.ts` is the one list of phases and tools. The lifecycle graphic
  (`theme/LifecycleMap.vue`), the nav and the sidebar are built from it, so add, rename or move a
  tool there and not in `config.ts`.
- Never edit `.vitepress/theme/cd-tokens.generated.css` or the logos in `public/logo/`. They are
  vendored from Miragon/corporate-identity and pinned in `scripts/check-brand-assets.mjs`. No other
  file declares a `--cd-*` token.
- `.miragon/brand.json` switches brand-lint on: the miragon-brand plugin lints each file you write,
  and CI lints the repo. Fix every hard finding (an em dash as a connector is one).
- Before you finish, run `pnpm format`, `pnpm check` and `pnpm build` (dead internal links fail the
  build). After changes to `tools/miragon-ai/` or to miragon-ai tool names on any page, also run
  `MIRAGON_AI_DIR=../miragon-ai node scripts/check-miragon-ai-refs.mjs`.
- No links to private repos: Miragon/analyzr, Miragon/skills, Miragon/corporate-identity,
  Miragon/miragon-ai-website. The repo is public.
- Commit messages and pull request titles follow Conventional Commits.

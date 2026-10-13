---
title: designIQ
description: designIQ is a self-hostable modelling workspace on your GitHub repo, where your team and AI assistants edit the same live models and every release is a pull request.
---

# designIQ

designIQ is a self-hostable modelling workspace on top of your GitHub repo, for teams who model processes and architecture together and want AI assistants to work on the same models.

::: info Status
As of 2026-10-13: v5.3.0, released 2026-10-13. Repo (MIT licence) and Docker image are public. The hosted service at design.miragon.ai is pre-GA, with the public launch planned around mid-November 2026. GitHub is the only supported Git provider for now (GitLab support is open as [issue #5](https://github.com/Miragon/design-iq/issues/5)).
:::

## Why

Process models usually live in a separate modelling tool, where one person edits at a time and approval happens outside the Git workflow your developers use. An AI assistant either cannot see the current model, or it rewrites the whole BPMN XML and moves shapes someone placed by hand.

designIQ keeps a live working copy of your content repo, which is any GitHub repo with a root `designiq.yml` that names its models folder. Your team edits in the browser, with visual modelers for BPMN, DMN, Wardley Maps, Team Topologies, Event Storming and Context Maps, and a text view for every file, which is how you edit Value Chains and Markdown. AI clients connect to the `/mcp` endpoint of the same server and work on the same live models, and their saves are validated. A release runs the validator, pushes a branch and opens a pull request.

Each model has one live version and stays a plain file in your repo. Nothing from designIQ reaches the default branch without a validated pull request, so CODEOWNERS and branch protection decide who approves. For a DMN change, the pull request lists every test case in `<decision>.tests.yaml` whose answer changed.

## Get started

You need Docker. This evaluation container runs without login and serves the example models from the designIQ repo, which it clones on the first request:

```sh
docker run --rm -p 8301:8080 -e LIVE_AUTH=none -e LIVE_PUBLIC_URL=http://localhost:8301 ghcr.io/miragon/designiq-live-host:latest
```

Open `http://localhost:8301`, then connect an AI client to the same models. Without a running host, your MCP client can start the read-only server itself, as a stdio process on any checkout.

::: code-group

```sh [Claude Code, live]
claude mcp add --transport http designiq http://localhost:8301/mcp
```

```sh [Any checkout, read-only]
npx @miragon/design-iq-mcp --root ./my-content-repo
```

:::

For your own models, create a repo from the template [process-documentation-starter](https://github.com/Miragon/process-documentation-starter) and pass it to the container with `-e GITHUB_REPO=<owner>/<repo> -v designiq-data:/data`. Without a GitHub App the repo has to be public. Login, private repos and release as pull request need an OIDC provider and your own GitHub App, described in the [self-hosting guide](https://github.com/Miragon/design-iq/blob/main/docs/on-prem/README.md).

## Proof you can open

- [Miragon/design-iq](https://github.com/Miragon/design-iq): the full platform, with changelog and ADRs.
- [Docker image](https://github.com/Miragon/design-iq/pkgs/container/designiq-live-host) `ghcr.io/miragon/designiq-live-host` for amd64 and arm64, pullable without login.
- [process-documentation-starter](https://github.com/Miragon/process-documentation-starter): a template content repo with BPMN processes, a DMN decision with tests, an Event Storming board and seven Claude skills for BPMN.
- [@miragon/design-iq-mcp](https://www.npmjs.com/package/@miragon/design-iq-mcp) and [@miragon/design-iq-validator](https://www.npmjs.com/package/@miragon/design-iq-validator) on npm, both at 5.3.0.

There is no public playground yet ([issue #43](https://github.com/Miragon/design-iq/issues/43)). The hosted service asks you to sign in and connect GitHub.

## Where it fits

designIQ serves [Design](/design). Your team models the to-be process and approves it by merge, and the AI drafts models and changes them on request.

Models come in as `.bpmn` files pushed to the content repo. Legacy documentation from Visio, draw.io, Word, Confluence or images becomes a draft with the `import-process` skill from the starter. The as-is value chain from [analyzr](/tools/analyzr) can sit in the same repo as a `.vc.json` file. There is no direct link between analyzr and designIQ yet, and the two value chain formats have not been checked against each other.

[bpmn-cli](/tools/bpmn-cli) is the engine behind opt-in semantic BPMN editing. Since v5.3.0, `LIVE_MCP_BPMN_EDIT=1` adds the MCP tools `get_process_outline`, `edit_process` and `layout_process`. With them, the agent changes elements by id and the hand-drawn layout is kept. The flag stays off by default until an A/B benchmark has run.

Models leave as merged `.bpmn` and `.dmn` design models. [Implement](/implement) makes them executable, for example with the `bpmn` skill from [Skills](/tools/skills). Coding agents in other repos read the released models with `npx @miragon/design-iq-mcp --root <checkout>`, and CI can gate on `npx @miragon/design-iq-validator --root .`.

The way back from [Execute](/execute) runs through the same repo: todos anchored to BPMN elements are GitHub issues, and the `process-feedback` skill collects corrections from the people who run the process.

## Reference

- [README](https://github.com/Miragon/design-iq#readme): run modes and the content repo contract.
- [MCP integration](https://github.com/Miragon/design-iq/blob/main/docs/mcp-integration.md): the full MCP tool reference and the inline modeler widgets.

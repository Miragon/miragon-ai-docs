---
layout: home
title: designIQ
description: designIQ is a self-hostable modelling workspace on your GitHub repo, where your team and AI assistants edit the same live models and every release is a pull request.
eyebrow: { phase: Design, link: /design }
hero:
  name: designIQ
  text: Model with your team and your AI. Release by pull request.
  tagline: A self-hostable workspace on your GitHub repo for teams who design processes together. AI assistants join over MCP, and every model stays a plain file in your repo.
  actions:
    - theme: brand
      text: Get started
      link: "#get-started"
    - theme: alt
      text: GitHub
      link: https://github.com/Miragon/design-iq
    - theme: alt
      text: Talk to us
      link: /#contact
artefact:
  type: screenshot
  src: /screens/designiq-editor.jpg
  alt: The designIQ BPMN editor in the browser with the example process order-to-cash in three lanes, the modelling palette on the left and the Live, Workshop, Diagram and XML controls above the canvas.
  url: localhost:8301/r/Miragon/design-iq/f/process-documentation/processes/order-to-cash.bpmn
  caption: designIQ v5.3.0 from the Docker one-liner under Get started, with the example model order-to-cash. Taken on 2026-10-13.
---

## The problem

Process models usually live in a separate modelling tool, away from the repo your developers work in. One person at a time works on a diagram there, and nobody signs it off in a pull request. An AI assistant either cannot see the current model, or it rewrites the whole BPMN XML when it changes one. In review, a DMN change arrives as an XML diff, where a `>=` that became `>` is easy to miss.

## How it works

1. Your models live in a GitHub repo with a root `designiq.yml` that names the models folder. Each model is a plain file there, such as `order-to-cash.bpmn`.
2. Your team edits in the browser and sees one live version of each model. BPMN, DMN, Wardley Maps, Team Topologies, Event Storming and Context Maps have visual modelers, and every file has a text view, which is how you edit Value Chains and Markdown.
3. AI clients connect to the `/mcp` endpoint of the same server and work on the same live models. Their saves are validated, and whoever has the model open sees the agent as a co-editor. Chat clients that support MCP Apps, such as claude.ai, Claude Desktop and ChatGPT, show the modeler inline.
4. A release runs the validator, pushes a branch and opens a pull request. CODEOWNERS and branch protection decide who approves. For a DMN change, the pull request lists every test case in `<decision>.tests.yaml` whose answer changed.

Your team models the to-be process and signs it off by merge. The AI drafts models and changes them on request.

## Get started {#get-started}

You need Docker. This evaluation container runs without login and serves the example models from the designIQ repo, which it clones on the first request. Anyone who reaches the port can edit every model, so keep it on your machine.

```sh
docker run --rm -p 8301:8080 \
  -e LIVE_AUTH=none \
  -e LIVE_PUBLIC_URL=http://localhost:8301 \
  ghcr.io/miragon/designiq-live-host:latest
```

Open `http://localhost:8301`, pick the repo Miragon/design-iq and open the BPMN model `order-to-cash`. Then connect an AI client to the same models. Without a running host, your MCP client can start the read-only server itself, as a stdio process on any checkout.

::: code-group

```sh [Claude Code, live]
claude mcp add --transport http designiq http://localhost:8301/mcp
```

```sh [Any checkout, read-only]
npx @miragon/design-iq-mcp --root ./my-content-repo
```

:::

For your own models, create a repo from the template [process-documentation-starter](https://github.com/Miragon/process-documentation-starter) and pass it to the container with `-e GITHUB_REPO=<owner>/<repo> -v designiq-data:/data`. Without a GitHub App the repo has to be public. Login, private repos and release as pull request need an OIDC provider and your own GitHub App, described in the [self-hosting guide](https://github.com/Miragon/design-iq/blob/main/docs/on-prem/README.md).

Run modes and the content repo contract are in the [README](https://github.com/Miragon/design-iq#readme). Every MCP tool and the inline modeler widgets are described in the [MCP integration guide](https://github.com/Miragon/design-iq/blob/main/docs/mcp-integration.md).

## Status

As of 2026-10-13.

| Part                  | State                                                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Self-hosted platform  | v5.3.0, released 2026-10-13. The repo (MIT licence) and the Docker image are public.                                             |
| Hosted service        | design.miragon.ai is pre-GA, with the public launch planned around mid-November 2026. It asks you to sign in and connect GitHub. |
| Git provider          | GitHub only. GitLab support is open as [issue #5](https://github.com/Miragon/design-iq/issues/5).                                |
| Semantic BPMN editing | Opt-in with `LIVE_MCP_BPMN_EDIT=1` since v5.3.0, off by default until an A/B benchmark has run.                                  |
| Playground            | None yet ([issue #43](https://github.com/Miragon/design-iq/issues/43)). The Docker one-liner above is the way to try it.         |
| Skills in the starter | BPMN only.                                                                                                                       |

## Proof you can open

- [Miragon/design-iq](https://github.com/Miragon/design-iq): the full platform, with changelog and ADRs.
- [Docker image](https://github.com/Miragon/design-iq/pkgs/container/designiq-live-host) `ghcr.io/miragon/designiq-live-host` for amd64 and arm64, pullable without login.
- [process-documentation-starter](https://github.com/Miragon/process-documentation-starter): a template content repo with BPMN processes, a DMN decision with tests, an Event Storming board and seven Claude skills for BPMN.
- [@miragon/design-iq-mcp](https://www.npmjs.com/package/@miragon/design-iq-mcp) and [@miragon/design-iq-validator](https://www.npmjs.com/package/@miragon/design-iq-validator) on npm, both at 5.3.0.

## Where it fits

designIQ serves [Design](/design). Models arrive as `.bpmn` files pushed to the content repo, or as drafts from Visio, draw.io, Word, Confluence or images through the starter's `import-process` skill. The as-is value chain from [analyzr](/tools/analyzr) can sit in the same repo as a `.vc.json` file. There is no direct link between analyzr and designIQ yet, and the two value chain formats have not been checked against each other.

[bpmn-cli](/tools/bpmn-cli) is the engine behind the opt-in semantic BPMN editing, where the agent changes elements by id and your hand-drawn layout stays. [Implement](/implement) makes the merged `.bpmn` and `.dmn` design models executable, for example with the `bpmn` skill from [Skills](/tools/skills), and CI can gate the content repo with `npx @miragon/design-iq-validator --root .`. Corrections from [Execute](/execute) come back to the same repo as todos on BPMN elements (GitHub issues) or through the `process-feedback` skill.

The whole lifecycle: [Miragon AI](/)

[Talk to us](/#contact) about running designIQ on your own repos.

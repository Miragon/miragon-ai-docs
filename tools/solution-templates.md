---
layout: home
title: Solution templates
description: Two GitHub templates that start your own MCP server, one connecting your AI to Camunda 7, CIB seven or Operaton and to your own systems, one without BPM.
eyebrow: { phase: Implement, link: /implement }
hero:
  name: Solution templates
  text: Your own MCP server, engine tools included.
  tagline: miragon-ai-starter, a GitHub template for developers, brings Pulse's modules for Camunda 7, CIB seven and Operaton, plus room for your own modules, such as your ERP. mcp-toolkit-starter is the base without BPM.
  actions:
    - theme: brand
      text: Get started
      link: "#get-started"
    - theme: alt
      text: GitHub
      link: https://github.com/Miragon/miragon-ai-starter
    - theme: alt
      text: Talk to us
      link: /#contact
artefact:
  type: terminal
  title: miragon-ai-starter
  lines:
    - cmd: 'gh repo create my-mcp-server \'
    - cont: '  --template Miragon/miragon-ai-starter \'
    - cont: "  --private --clone"
    - cmd: cd my-mcp-server
    - cmd: pnpm install
    - { out: "Done in 52.7s using pnpm v10.32.1", tone: dim }
    - cmd: cp .env.example .env
    - cmd: pnpm dev
    - { out: "[mcp-use] dev server ready", tone: ok }
    - out: "  ➜ MCP endpoint:  http://localhost:8400/mcp"
    - out: "  ➜ Inspector:     http://localhost:8400/mcp/inspector"
    - note: camunda7 and analytics are in
    - note: add yours, in a second terminal
    - cmd: cp -R modules/mcp-notes modules/mcp-erp
---

## The problem

[Pulse](/tools/pulse/) covers the engine. If the same assistant should also reach your ERP or CRM, you fork Pulse or build an MCP server from scratch. From scratch, you wire OAuth, health checks, metrics, a Docker image and a widget bundle yourself, and some wiring mistakes only show up as a widget that renders empty or hangs on "Loading…".

## What miragon-ai-starter changes

| From scratch                                                              | With miragon-ai-starter                                                                                      |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| You write tools against the REST API of Camunda 7, CIB seven or Operaton. | Pulse's published modules bring the `camunda7_*` and `analytics_*` tools with their widgets.                 |
| You work out how a tool, its widget and the widget's data fit together.   | You copy the example module `modules/mcp-notes` and register it next to the engine modules, on one endpoint. |
| Wiring mistakes show up as an empty or hanging widget.                    | The guard tests in `server/test/` fail when a wiring step is missing.                                        |
| Your coding agent starts without guidance.                                | `CLAUDE.md` and four Claude Code skills, `create-module` among them, walk it through the steps.              |
| You build login and permissions.                                          | OAuth with Keycloak or Auth0. Without OAuth the engine and analytics tools start read-only.                  |
| You write the Dockerfile, the probes and the metrics endpoint.            | A Docker image with a health check, `/health/live`, `/health/ready` and Prometheus `/metrics`.               |

mcp-toolkit-starter is a plain [mcp-use](https://mcp-use.com) project with one `tasks` module and a widget, for systems that have nothing to do with a process engine. Neither template contains process automation code such as job workers or a BPMN project. Your team decides which systems the server may reach and reviews the module code.

## Get started {#get-started}

You need Node.js 22.22.2 or later, pnpm (`corepack enable` picks the pinned version) and the GitHub CLI, or the "Use this template" button on GitHub. All packages come from the public npm registry, so you need no npm credentials.

::: code-group

```sh [miragon-ai-starter]
gh repo create my-mcp-server --template Miragon/miragon-ai-starter --private --clone
cd my-mcp-server
pnpm install
cp .env.example .env
pnpm dev
```

```sh [mcp-toolkit-starter]
gh repo create my-mcp-server --template Miragon/mcp-toolkit-starter --private --clone
cd my-mcp-server
pnpm install
pnpm dev
```

:::

Open the inspector (`http://localhost:8400/mcp/inspector` for miragon-ai-starter, the URL the terminal prints for mcp-toolkit-starter) and call `notes_show_notes` or `show_tasks_board`. The widget renders without any external system. The engine tools need a Camunda 7, CIB seven or Operaton REST API, and the analytics tools need Prometheus fed by the Miragon metrics plugin for CIB seven. The defaults in miragon-ai-starter's `.env.example` match the [playground stack](https://github.com/Miragon/miragon-ai/tree/main/playground) in Pulse's repo, which runs in Docker Compose.

In miragon-ai-starter, connect Claude Code to the server and start a module for your own system, here your ERP, as a copy of the example module:

```sh
claude mcp add --transport http my-mcp-server http://localhost:8400/mcp
cp -R modules/mcp-notes modules/mcp-erp
```

Or ask Claude Code in the repo and let the `create-module` skill walk through the wiring. Configuration, deployment and other assistants are in the [README](https://github.com/Miragon/miragon-ai-starter#readme).

## Status

As of 2026-10-13. Pulse is the MCP server from the repo Miragon/miragon-ai. miragon-ai-starter mirrors the template folder [`templates/composed-server`](https://github.com/Miragon/miragon-ai/tree/main/templates/composed-server) there, is public under the MIT licence and is synced on every Pulse release once install and tests pass against the public npm registry. It is at Pulse v0.20.0, released 2026-10-13, and pins the `@miragon-ai` packages at 0.20.0. These are pre-1.0, release about weekly and still bring breaking changes.

mcp-toolkit-starter is public but has no licence yet, so there are no stated terms for building on it. It pins the Miragon MCP Toolkit at 2.8.1, released 2026-10-13. Its own CI failed after the last two syncs, which ran minutes before the pinned version reached npm. Neither template repo has releases of its own.

## Proof you can open

- [Miragon/miragon-ai-starter](https://github.com/Miragon/miragon-ai-starter): the template, synced from Pulse v0.20.0.
- [Miragon/mcp-toolkit-starter](https://github.com/Miragon/mcp-toolkit-starter): the template without BPM, mirrored from [`templates/minimal-server`](https://github.com/Miragon/mcp-toolkit/tree/main/templates/minimal-server) in Miragon/mcp-toolkit.
- [Pulse playground](https://miragon-ai-playground.fly.dev/mcp): an MCP endpoint without login, running the stock Pulse server built from the same `@miragon-ai` modules, read-only.
- [Toolkit playground tour](https://miragon.github.io/mcp-toolkit/playground/tour): seven stops through the toolkit's tools and widgets on a hosted server.
- [@miragon-ai/camunda7-connector](https://www.npmjs.com/package/@miragon-ai/camunda7-connector) on npm: the engine module the starter composes.
- [MCP Toolkit docs](https://miragon.github.io/mcp-toolkit/): the guides behind mcp-toolkit-starter.

## Where it fits

Solution templates serve [Implement](/implement), next to [Skills](/tools/skills). Skills make the model deployable, and the templates connect your AI to the engine and your own systems. Models from [designIQ](/tools/design-iq) or [bpmn-cli](/tools/bpmn-cli) reach the server only through the engine, where tools such as `camunda7_get_process_definition_xml` read them. With the `camunda7:admin` toolset and `CAMUNDA_ALLOW_DEPLOYMENTS=true`, the assistant can deploy BPMN and DMN itself.

[Execute](/execute) receives a Docker image that serves MCP on `/mcp`, with the same `camunda7_*` and `analytics_*` tools as Pulse plus those of your own modules. You connect it to Claude Code, Claude Desktop, claude.ai or another MCP client and use it the way you use Pulse. [operate](/tools/operate) reaches the same engine REST API on its own, from the shell and CI.

The whole lifecycle: [Miragon AI](/)

[Talk to us](/#contact) about the systems your assistant should reach next to the engine.

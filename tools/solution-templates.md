---
title: Solution templates
description: Two GitHub template repos that start your own MCP server, one connecting your AI to Camunda 7, CIB seven or Operaton and your own systems, one without BPM.
---

# Solution templates

Solution templates are two GitHub template repos for developers who build their own MCP server: miragon-ai-starter connects your AI assistant to Camunda 7, CIB seven or Operaton and to your own systems, and mcp-toolkit-starter is the base without BPM.

::: info Status
As of 2026-10-13. [miragon-ai-starter](https://github.com/Miragon/miragon-ai-starter) is public under the MIT licence. It mirrors a template folder in [miragon-ai](/tools/miragon-ai/), is synced on every miragon-ai release (currently v0.20.0, released 2026-10-13) and pins the `@miragon-ai` packages at 0.20.0. These are pre-1.0, release about weekly and still bring breaking changes. [mcp-toolkit-starter](https://github.com/Miragon/mcp-toolkit-starter) is public but has no licence yet, so there are no stated terms for building on it. It pins the Miragon MCP Toolkit at 2.8.1, released 2026-10-13. Its own CI failed after the last two syncs, which ran minutes before the pinned version reached npm. Neither template repo has releases of its own.
:::

## Why

[miragon-ai](/tools/miragon-ai/) covers the engine. If the same assistant should also reach your ERP or CRM, you fork it. Starting from scratch, you wire OAuth, health checks, a Docker image and a widget bundle yourself, and some wiring mistakes only show up as a widget that renders empty or hangs on "Loading…".

miragon-ai-starter composes the published modules for Camunda 7, CIB seven and Operaton (engine operations and process analytics from Prometheus) with your own modules into one MCP endpoint. The example module `modules/mcp-notes` shows the whole pattern. Four Claude Code skills in the repo (`setup-server`, `create-module`, `add-widget`, `add-settings-section`) let your coding agent do the wiring. mcp-toolkit-starter is a plain [mcp-use](https://mcp-use.com) project with one `tasks` module and a widget, for systems that have nothing to do with a process engine. Neither template contains process automation code such as job workers or a BPMN project.

According to its README, miragon-ai-starter runs after three commands, and the example widget renders without an engine. Your own system starts as a copied module folder, and the guard tests in `server/test/` fail when a wiring step is missing. The same project builds a Docker image with OAuth (Keycloak or Auth0), health probes and Prometheus metrics. Without OAuth the engine and analytics tools start read-only.

## Get started

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

Open the inspector (`http://localhost:8400/mcp/inspector` for miragon-ai-starter, the URL the terminal prints for mcp-toolkit-starter) and call `notes_show_notes` or `show_tasks_board`, respectively. The widget renders without any external system. The engine tools need a Camunda 7, CIB seven or Operaton REST API, and the analytics tools need Prometheus fed by the Miragon metrics plugin for CIB seven. The defaults in miragon-ai-starter's `.env.example` match the [miragon-ai playground stack](https://github.com/Miragon/miragon-ai/tree/main/playground), which runs in Docker Compose.

For miragon-ai-starter, connect Claude Code with `claude mcp add --transport http my-mcp-server http://localhost:8400/mcp`. Your own system starts with `cp -R modules/mcp-notes modules/mcp-<name>`, or ask Claude Code in the repo and let the `create-module` skill walk through the wiring.

## Proof you can open

- [Miragon/miragon-ai-starter](https://github.com/Miragon/miragon-ai-starter): the template, synced from miragon-ai v0.20.0 once install and tests passed against the public npm registry.
- [Miragon/mcp-toolkit-starter](https://github.com/Miragon/mcp-toolkit-starter): the template without BPM, mirrored from [`templates/minimal-server`](https://github.com/Miragon/mcp-toolkit/tree/main/templates/minimal-server) in Miragon/mcp-toolkit.
- [miragon-ai playground](https://miragon-ai-playground.fly.dev/mcp): an MCP endpoint without login, running the stock server built from the same `@miragon-ai` modules, read-only.
- [Toolkit playground tour](https://miragon.github.io/mcp-toolkit/playground/tour): seven stops through the toolkit's tools and widgets on a hosted server.
- [@miragon-ai/camunda7-connector](https://www.npmjs.com/package/@miragon-ai/camunda7-connector) on npm: the engine module the starter composes.

## Where it fits

Solution templates serve [Implement](/implement), next to [Skills](/tools/skills). Skills make the model deployable, and the templates connect your AI to the engine and your own systems. Nothing passes between them as a file. Your team decides which systems the server may reach and reviews the module code.

Models from [Design](/design), drawn in [designIQ](/tools/design-iq) or with [bpmn-cli](/tools/bpmn-cli), reach the server only through the engine. Once a model is deployed to Camunda 7, CIB seven or Operaton, the assistant reads it with tools such as `camunda7_get_process_definition_xml`. With the `camunda7:admin` toolset and `CAMUNDA_ALLOW_DEPLOYMENTS=true`, it can deploy BPMN and DMN itself.

From miragon-ai-starter, [Execute](/execute) receives a Docker image that serves MCP on `/mcp`, with the same `camunda7_*` and `analytics_*` tools as [miragon-ai](/tools/miragon-ai/) plus the tools of your own modules. You connect it to Claude Code, Claude Desktop, claude.ai or another MCP client and use it the way you use miragon-ai. [operate](/tools/operate) reaches the same engine REST API on its own, from the shell and CI.

## Reference

- [miragon-ai-starter README](https://github.com/Miragon/miragon-ai-starter#readme): configuration, deployment, connecting assistants and adding modules.
- [MCP Toolkit docs](https://miragon.github.io/mcp-toolkit/): the guides and API reference behind mcp-toolkit-starter.

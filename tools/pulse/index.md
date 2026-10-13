---
layout: home
title: Pulse
description: Pulse is a self-hosted MCP server that lets Claude, ChatGPT or any other MCP client read and operate your Camunda 7, CIB seven and Operaton engines, with answers as widgets in Claude and ChatGPT.
eyebrow: { phase: Execute, link: /execute }
hero:
  name: Pulse
  text: Ask your engines what is stuck and why.
  tagline: Pulse is a self-hosted MCP server for Camunda 7, CIB seven and Operaton that starts read-only. Ask in Claude or ChatGPT, and the answer comes back as a widget in the chat.
  actions:
    - theme: brand
      text: Try the playground
      link: https://inspector.manufact.com/inspector?server=https%3A%2F%2Fmiragon-ai-playground.fly.dev%2Fmcp&tab=chat
    - theme: alt
      text: GitHub
      link: https://github.com/Miragon/miragon-ai
    - theme: alt
      text: Talk to us
      link: /#contact
artefact: { type: chat }
---

## The problem

When a process gets stuck, the people who hear about it first, such as operations staff, support or a product owner, usually cannot see why. They ask a developer, so every question about the running processes waits for the few people who know each engine's Cockpit and PromQL.

## How it works

Pulse reads your engines over their REST API, never the engine database, and needs no migration. Your assistant calls Pulse's tools, and the cockpit view, incident clusters, BPMN diagrams and dashboards come back as widgets in the chat.

| Today                        | With Pulse                                                          |
| ---------------------------- | ------------------------------------------------------------------- |
| One Cockpit per engine       | One question covers one or several engines                          |
| Stack traces, job by job     | Incidents grouped by failing activity and type, down to the trace   |
| PromQL for runtime questions | Activities ranked by execution time and incident rate, BPMN heatmap |
| Tickets by copy and paste    | A ticket draft with title, body and labels                          |

The runtime figures need CIB seven with the metrics plugin. `camunda7_format_incident_issue` writes the ticket draft, and you decide where the ticket goes.

## Connect your Claude in 30 seconds {#connect-your-claude}

The hosted [playground](https://miragon-ai-playground.fly.dev/mcp) runs a seeded CIB seven engine with live demo traffic and the full analytics stack. It is read-only and needs no login. Every night at 22:00 UTC the engine reseeds and the metrics are wiped, so analytics windows there hold less than a day of data. Pulse is the MCP server from the repo Miragon/miragon-ai, so commands and configs call it `miragon-ai`:

::: code-group

```sh [Claude Code]
claude mcp add --transport http miragon-ai https://miragon-ai-playground.fly.dev/mcp
```

```txt [claude.ai]
Settings → Connectors → Add custom connector
URL: https://miragon-ai-playground.fly.dev/mcp
```

:::

Then ask _"Which processes have open incidents right now?"_ and drill into the widgets that claude.ai renders. Claude Desktop needs a bridge, described in [Usage](/tools/pulse/usage#connect-your-assistant).

<TryItOut />

## Read-only until your team decides otherwise

The AI collects the state of your engines and proposes the next step. Whether it may change anything on an engine depends on the toolset the server runs with, and widgets hide the buttons for actions the toolset does not allow.

- `read-only` is the default without OAuth and on the playground, and allows queries, widgets and ticket drafts.
- `operations` is the default behind OAuth and adds starting instances, completing tasks, retries and resolving incidents.
- `admin` is active only when an operator names it and adds deletions, modifications, suspensions, migrations and signals.

Deployments need `admin` plus `CAMUNDA_ALLOW_DEPLOYMENTS=true`. Because the default cannot change an engine, you can hand Pulse to a wider group, such as support or product owners.

## Run it on your own engine {#get-started}

You need Docker and the REST API of a Camunda 7, CIB seven or Operaton engine. The server boots read-only, and `MCP_ACTIVE_MODULES=camunda7` leaves out analytics until you run Prometheus:

```sh
docker run --rm -p 127.0.0.1:8400:8400 \
  -e CAMUNDA_BASE_URL=http://host.docker.internal:8080/engine-rest \
  -e MCP_ACTIVE_MODULES=camunda7 \
  docker.io/miragon/miragon-ai-server:0.20.0
claude mcp add --transport http miragon-ai http://localhost:8400/mcp
```

If the REST API needs a login, add `CAMUNDA_AUTH_TYPE=basic` with `CAMUNDA_USERNAME` and `CAMUNDA_PASSWORD`. [Operations](/tools/pulse/operations) covers several engines, OAuth and the toolsets that allow writes. For analytics, your engine project adds the plugin `io.miragon.mcp:cibseven-history-metrics` and exports its metrics to Prometheus, as [Architecture](/tools/pulse/architecture) shows.

## Status

As of 2026-10-13, Pulse is at v0.20.0 (released that day) and pre-1.0. The last three minor releases (0.18.0 to 0.20.0) each list breaking changes, such as renamed tools and result fields, so pin the image tag you run. The public playground runs the same version, and the repository is public under the MIT licence.

- Pulse drafts tickets and never files one.
- Runtime figures need a CIB seven engine with the metrics plugin, and they cover only traffic recorded after the plugin was installed, at most 30 days back.
- The analytics module knows neither waiting times nor variants, so we do not count it as process mining or as a tool for [Optimize](/optimize).
- Pulse speaks the REST API of Camunda 7, CIB seven and Operaton. Camunda 8 is out of scope.
- We have not published numbers on time saved.

## Proof you can open

- [Playground](https://miragon-ai-playground.fly.dev/mcp): the public MCP endpoint above, pinned to `camunda7:read-only,analytics:read-only`. The [browser demo](https://inspector.manufact.com/inspector?server=https%3A%2F%2Fmiragon-ai-playground.fly.dev%2Fmcp&tab=chat) opens it in a third-party MCP inspector with nothing to install.
- [Miragon/miragon-ai](https://github.com/Miragon/miragon-ai): the source under the MIT licence, with changelog and CI.
- [Docker image](https://hub.docker.com/r/miragon/miragon-ai-server) `miragon/miragon-ai-server` for amd64 and arm64, tag 0.20.0.
- [Metrics plugin](https://repo1.maven.org/maven2/io/miragon/mcp/cibseven-history-metrics/) `io.miragon.mcp:cibseven-history-metrics` 0.20.0 on Maven Central.
- [@miragon-ai/camunda7-connector](https://www.npmjs.com/package/@miragon-ai/camunda7-connector) and [@miragon-ai/analytics-connector](https://www.npmjs.com/package/@miragon-ai/analytics-connector) on npm, both at 0.20.0.

## Where it fits

Pulse serves [Execute](/execute). It reads the BPMN and DMN models that already run on the engine, deployed from [Implement](/implement), and sends ticket drafts back there as a title, a Markdown body and labels, plus a prefilled GitHub issue URL when `CAMUNDA_INCIDENT_ISSUE_REPO` is set.

[operate](/tools/operate) covers the same engines as a CLI without a server, for developers, coding agents and CI. Pulse is a server your team runs, so operations staff and product owners can ask in the chat. To reach your own systems from the same chat, start from [Solution templates](/tools/solution-templates): the template miragon-ai-starter mounts Pulse's modules next to your own.

The whole lifecycle: [Miragon AI](/)

## Docs

- [Architecture](/tools/pulse/architecture): the server, its two modules and the systems they talk to.
- [Developer](/tools/pulse/developer): run the stack from source and build your own server on the modules.
- [Operations](/tools/pulse/operations): the Docker image, security, environment variables, toolsets and health routes.
- [Usage](/tools/pulse/usage): connect an assistant, what to ask and your own settings.
- [README](https://github.com/Miragon/miragon-ai#readme): the full reference for every tool, toolset and environment variable.

[Talk to us](/#contact) about running Pulse on your own engines.

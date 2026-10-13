---
title: miragon-ai
description: miragon-ai is a self-hosted MCP server that lets Claude, ChatGPT or any other MCP client read and operate your Camunda 7, CIB seven and Operaton engines, with answers as widgets in the chat.
---

# miragon-ai

miragon-ai is a self-hosted MCP server for teams whose processes run on Camunda 7, CIB seven or Operaton. Your team asks Claude, ChatGPT or any other MCP client what is stuck, and the answer comes back as an interactive widget in the chat.

::: info Status
As of 2026-10-13: v0.20.0, released 2026-10-13, pre-1.0. The last three minor releases (0.18.0 to 0.20.0) each list breaking changes, such as renamed tools and result fields, so pin the image tag you run. The public playground runs the same version. The analytics module needs a CIB seven engine with the metrics plugin and looks back at most 30 days. The repository is public under the MIT licence.
:::

## Why

To find out what is stuck, your team clicks through one Cockpit per engine and reads stack traces job by job. A question like "where do instances spend their time?" needs someone who writes PromQL against Prometheus. A ticket for the developers starts with copying ids, messages and stack traces by hand.

miragon-ai reads your engines over their REST API, never the engine database, and needs no migration. One question in the chat shows what is stuck on one or several engines, with incidents grouped by failing activity and incident type and a drill-down to the stack trace. The cockpit, the incident clusters, BPMN diagrams and analytics dashboards render as widgets in the chat. `camunda7_format_incident_issue` turns an incident into a ticket draft. Where the ticket goes is your decision, and the server never files one.

Without OAuth the server starts read-only, so you can hand it to a wider group. Starting instances, completing tasks, retries and resolving incidents need the `operations` toolset, the default behind OAuth. Deletions, modifications, suspensions, migrations and signals need `admin`, which an operator has to name explicitly. We have not published numbers on time saved.

## Connect your Claude in 30 seconds {#connect-your-claude}

The hosted [playground](https://miragon-ai-playground.fly.dev/mcp) runs a seeded CIB seven engine with live demo traffic and the full analytics stack. It is read-only and needs no login. Every night at 22:00 UTC the engine reseeds and the metrics are wiped, so analytics windows there hold less than a day of data. Point any MCP client at `https://miragon-ai-playground.fly.dev/mcp`:

::: code-group

```sh [Claude Code]
claude mcp add --transport http miragon-ai https://miragon-ai-playground.fly.dev/mcp
```

```txt [claude.ai]
Settings → Connectors → Add custom connector
URL: https://miragon-ai-playground.fly.dev/mcp
```

:::

Then ask _"Which processes have open incidents right now?"_ and drill into the widgets. Claude Desktop needs a bridge, described in [Usage](/tools/miragon-ai/usage#connect-your-assistant).

<TryItOut />

## Get started

On your own engine you need Docker and the REST API of a Camunda 7, CIB seven or Operaton engine. The server boots read-only, and `MCP_ACTIVE_MODULES=camunda7` leaves out analytics until you run Prometheus:

```sh
docker run --rm -p 127.0.0.1:8400:8400 \
  -e CAMUNDA_BASE_URL=http://host.docker.internal:8080/engine-rest \
  -e MCP_ACTIVE_MODULES=camunda7 \
  docker.io/miragon/miragon-ai-server:0.20.0
claude mcp add --transport http miragon-ai http://localhost:8400/mcp
```

If the REST API needs a login, add `CAMUNDA_AUTH_TYPE=basic` with `CAMUNDA_USERNAME` and `CAMUNDA_PASSWORD`. [Operations](/tools/miragon-ai/operations) covers several engines, OAuth and the toolsets that allow writes. For analytics, your engine project adds the plugin `io.miragon.mcp:cibseven-history-metrics` and exports its metrics to Prometheus, as [Architecture](/tools/miragon-ai/architecture) shows. [Developer](/tools/miragon-ai/developer) shows how to run the whole stack from source.

## Proof you can open

- [Playground](https://miragon-ai-playground.fly.dev/mcp): the public MCP endpoint above, pinned to `camunda7:read-only,analytics:read-only`. The [browser demo](https://inspector.manufact.com/inspector?server=https%3A%2F%2Fmiragon-ai-playground.fly.dev%2Fmcp&tab=chat) opens it in a third-party MCP inspector with nothing to install. Try _"Show me the Cockpit"_.
- [Miragon/miragon-ai](https://github.com/Miragon/miragon-ai): the source under the MIT licence, with changelog and CI.
- [Docker image](https://hub.docker.com/r/miragon/miragon-ai-server) `miragon/miragon-ai-server` for amd64 and arm64, tag 0.20.0.
- [Metrics plugin](https://repo1.maven.org/maven2/io/miragon/mcp/cibseven-history-metrics/) `io.miragon.mcp:cibseven-history-metrics` 0.20.0 on Maven Central.
- [@miragon-ai/camunda7-connector](https://www.npmjs.com/package/@miragon-ai/camunda7-connector) and [@miragon-ai/analytics-connector](https://www.npmjs.com/package/@miragon-ai/analytics-connector) on npm, both at 0.20.0.

## Where it fits

miragon-ai serves [Execute](/execute). The AI collects the state of your engines and proposes the next step, and your team decides through the toolset whether it may change anything on the engine. It reads the BPMN and DMN models that already run on the engine, deployed from [Implement](/implement). For metrics, the engine project also carries the plugin and a Micrometer export to Prometheus. Ticket drafts go back to Implement as a title, a Markdown body and labels, plus a prefilled GitHub issue URL when `CAMUNDA_INCIDENT_ISSUE_REPO` is set.

[operate](/tools/operate) covers the same engines as a CLI without a server, for developers, coding agents and CI. miragon-ai is a server your team runs, so operations staff and product owners can ask in the chat.

The analytics module stays in Execute. It looks back at most 30 days and knows neither waiting times nor variants, so we do not count it as a tool for [Optimize](/optimize). To reach your own systems from the same chat, start from [Solution templates](/tools/solution-templates): the template miragon-ai-starter mounts these modules next to your own.

## In this section

- [Architecture](/tools/miragon-ai/architecture): the server, its two modules and the systems they talk to.
- [Developer](/tools/miragon-ai/developer): run the stack from source and build your own server on the modules.
- [Operations](/tools/miragon-ai/operations): the Docker image, security, environment variables, toolsets and health routes.
- [Usage](/tools/miragon-ai/usage): connect an assistant, what to ask and your own settings.
- [README](https://github.com/Miragon/miragon-ai#readme): the full reference for every tool, toolset and environment variable.

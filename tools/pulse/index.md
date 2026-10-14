---
layout: home
title: Pulse
description: Pulse is a self-hosted MCP server that lets Claude, ChatGPT or any other MCP client read and operate your Camunda 7, CIB seven and Operaton engines, with answers as widgets in the chat.
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
compare:
  before:
    title: Today
    items:
      - One Cockpit per engine
      - Stack traces, job by job
      - PromQL for runtime questions
      - Tickets by copy and paste
  after:
    title: With Pulse
    items:
      - One question covers one or several engines
      - Incidents grouped by failing activity and type, down to the trace
      - Activities ranked by execution time and incident rate, BPMN heatmap
      - A ticket draft with title, body and labels
steps:
  - title: Connect
    text: Pulse reads your engines over their REST API, never the engine database, and needs no migration.
  - title: Ask
    text: You ask in Claude, ChatGPT or another MCP client, and the assistant calls Pulse's tools.
  - title: See
    text: The cockpit view, incident clusters, BPMN diagrams and dashboards come back as widgets in the chat.
  - title: Decide
    text: Pulse drafts the ticket with title, body and labels. Where it goes is your decision.
toolsets:
  - icon: eye
    title: read-only
    text: The default without OAuth and on the playground. Queries, widgets and ticket drafts.
  - icon: play
    title: operations
    text: The default behind OAuth. Adds starting instances, completing tasks, retries and resolving incidents.
  - icon: key
    title: admin
    text: Only when an operator names it. Adds deletions, modifications, suspensions, migrations and signals.
status:
  - icon: ticket
    title: Drafts, never files
    text: Pulse drafts tickets and never files one.
  - icon: chart
    title: Runtime figures on CIB seven
    text: They need the metrics plugin and cover only traffic recorded after it was installed, at most 30 days back.
  - icon: ban
    title: No process mining
    text: The analytics module knows neither waiting times nor variants, so it is no tool for Optimize.
  - icon: server
    title: Camunda 7, CIB seven, Operaton
    text: Pulse speaks their REST API. Camunda 8 is out of scope.
proof:
  - icon: play
    title: Playground
    text: "The public MCP endpoint, pinned to camunda7:read-only,analytics:read-only."
    link: https://miragon-ai-playground.fly.dev/mcp
  - icon: monitor
    title: Browser demo
    text: The playground in a third-party MCP inspector, with nothing to install.
    link: https://inspector.manufact.com/inspector?server=https%3A%2F%2Fmiragon-ai-playground.fly.dev%2Fmcp&tab=chat
  - icon: github
    title: Miragon/miragon-ai
    text: The source under the MIT licence, with changelog and CI.
    link: https://github.com/Miragon/miragon-ai
  - icon: container
    title: Docker image
    text: miragon/miragon-ai-server for amd64 and arm64, tag 0.20.0.
    link: https://hub.docker.com/r/miragon/miragon-ai-server
  - icon: package
    title: Metrics plugin
    text: "io.miragon.mcp:cibseven-history-metrics 0.20.0 on Maven Central."
    link: https://repo1.maven.org/maven2/io/miragon/mcp/cibseven-history-metrics/
  - icon: boxes
    title: npm packages
    text: "@miragon-ai/camunda7-connector and @miragon-ai/analytics-connector, both at 0.20.0."
    link: https://www.npmjs.com/package/@miragon-ai/camunda7-connector
fits:
  - eyebrow: Phase
    title: Execute
    text: Pulse reads the models that already run on the engine and sends ticket drafts back to Implement.
    link: /execute
  - eyebrow: Same engines
    title: operate
    text: The CLI without a server, for developers, coding agents and CI.
    link: /tools/operate
  - eyebrow: Your own systems
    title: Solution templates
    text: The template miragon-ai-starter mounts Pulse's modules next to your own.
    link: /tools/solution-templates
docs:
  - icon: layers
    title: Architecture
    text: The server, its two modules and the systems they talk to.
    link: /tools/pulse/architecture
  - icon: code
    title: Developer
    text: Run the stack from source and build your own server on the modules.
    link: /tools/pulse/developer
  - icon: server
    title: Operations
    text: The Docker image, security, environment variables, toolsets and health routes.
    link: /tools/pulse/operations
  - icon: chat
    title: Usage
    text: Connect an assistant, what to ask and your own settings.
    link: /tools/pulse/usage
---

<PageSection eyebrow="The problem" title="Every question about a running process waits for a developer" intro="When a process gets stuck, the people who hear about it first, such as operations staff, support or a product owner, usually cannot see why. They ask a developer, so every question waits for the few people who know each engine's Cockpit and PromQL.">
  <CompareCards :before="$frontmatter.compare.before" :after="$frontmatter.compare.after" />
</PageSection>

<PageSection tone="tint" align="center" eyebrow="How it works" title="Ask in the chat, get the engine's answer as a widget" intro="The runtime figures need CIB seven with the metrics plugin. Everything else works on Camunda 7, CIB seven and Operaton.">
  <StepList :items="$frontmatter.steps" />
</PageSection>

<PageSection id="connect-your-claude" eyebrow="Try it" title="Connect your Claude in 30 seconds">

The hosted [playground](https://miragon-ai-playground.fly.dev/mcp) runs a seeded CIB seven engine with live demo traffic and the full analytics stack. It is read-only and needs no login. Every night at 22:00 UTC the engine reseeds and the metrics are wiped. Pulse is the MCP server from the repo Miragon/miragon-ai, so commands and configs call it `miragon-ai`:

::: code-group

```sh [Claude Code]
claude mcp add --transport http miragon-ai https://miragon-ai-playground.fly.dev/mcp
```

```txt [claude.ai]
Settings → Connectors → Add custom connector
URL: https://miragon-ai-playground.fly.dev/mcp
```

:::

Then ask _"Which processes have open incidents right now?"_ and drill into the widgets. Claude Desktop needs a bridge, described in [Usage](/tools/pulse/usage#connect-your-assistant).

<TryItOut />

</PageSection>

<PageSection tone="tint" eyebrow="Safety" title="Read-only until your team decides otherwise" intro="The AI collects the state of your engines and proposes the next step. Whether it may change anything depends on the toolset the server runs with, and widgets hide the buttons for actions the toolset does not allow.">
  <CardGrid :items="$frontmatter.toolsets" />

Deployments need `admin` plus `CAMUNDA_ALLOW_DEPLOYMENTS=true`. Because the default cannot change an engine, you can hand Pulse to a wider group, such as support or product owners.

</PageSection>

<PageSection id="get-started" eyebrow="Get started" title="Run it on your own engine">

You need Docker and the REST API of a Camunda 7, CIB seven or Operaton engine. The server boots read-only, and `MCP_ACTIVE_MODULES=camunda7` leaves out analytics until you run Prometheus:

```sh
docker run --rm -p 127.0.0.1:8400:8400 \
  -e CAMUNDA_BASE_URL=http://host.docker.internal:8080/engine-rest \
  -e MCP_ACTIVE_MODULES=camunda7 \
  docker.io/miragon/miragon-ai-server:0.20.0
claude mcp add --transport http miragon-ai http://localhost:8400/mcp
```

If the REST API needs a login, add `CAMUNDA_AUTH_TYPE=basic` with `CAMUNDA_USERNAME` and `CAMUNDA_PASSWORD`. [Operations](/tools/pulse/operations) covers several engines, OAuth and the toolsets that allow writes. For analytics, your engine project adds the plugin `io.miragon.mcp:cibseven-history-metrics` and exports its metrics to Prometheus, as [Architecture](/tools/pulse/architecture) shows.

</PageSection>

<PageSection tone="tint" eyebrow="Status" title="Where Pulse stands on 13 October 2026" intro="Pulse is at v0.20.0 and pre-1.0. The last three minor releases each list breaking changes, such as renamed tools and result fields, so pin the image tag you run. The public playground runs the same version.">
  <FeatureList :items="$frontmatter.status" />
</PageSection>

<PageSection eyebrow="Proof you can open" title="Everything here is public">
  <CardGrid :items="$frontmatter.proof" />
</PageSection>

<PageSection tone="tint" eyebrow="Where it fits" title="Pulse in the lifecycle">
  <CardGrid :items="$frontmatter.fits" />
</PageSection>

<PageSection eyebrow="Docs" title="Go deeper">
  <CardGrid :items="$frontmatter.docs" :columns="4" />

The [README](https://github.com/Miragon/miragon-ai#readme) is the full reference for every tool, toolset and environment variable.

</PageSection>

<CtaBox title="Run Pulse on your own engines." text="Tell us which engines you run and who asks about them today. You get an honest assessment of whether Pulse helps first." note="A 30-minute first call." />

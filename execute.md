---
title: Execute
description: Find what is stuck on your Camunda 7, CIB seven and Operaton engines and why, with Pulse in chat and operate in the shell, coding agent or CI.
---

# Execute

Execute is where your team finds out what is stuck on the running engines and why, and takes the next safe step. Both tools in this phase work with Camunda 7, CIB seven and Operaton.

## The problem today

To see what hangs, someone clicks through the Cockpit tabs of each engine and reads stack traces job by job. Runtime questions such as how long instances take usually need PromQL against Prometheus, and incident tickets start as copy and paste into the tracker. A coding agent takes the same path through the raw REST API, one request at a time.

## How Miragon AI helps

Both tools read the same engines through their REST API. Pulse is a self-hosted MCP server (the repo Miragon/miragon-ai) that your team runs and asks in chat. operate is a CLI without a server for developers, coding agents and CI.

### Pulse

Your team hosts Pulse once, and operations, support and product owners ask it about running processes in Claude, ChatGPT or another MCP client. It reads one or several engines without a migration or access to the engine database, and answers with widgets in the chat, such as incident clusters by failing activity and incident type, down to the stack trace. Without OAuth it starts read-only. For an incident it drafts a ticket, and you decide where it goes.

Status: v0.20.0 (released 2026-10-13), pre-1.0, and each of the last three minor releases brought breaking changes. Runtime figures such as durations and incident rates need no PromQL, but they work only on CIB seven with the metrics plugin and reach back 30 days at most.

Details and first steps, including the public playground: [Pulse](/tools/pulse/)

### operate

operate turns the 396 operations of the engine REST API into commands for your shell, a coding agent such as Claude Code, or a CI job. `operate status` triages the whole engine in one read-only call and names the next command for each finding, and `operate inspect --business-key ORD-1001` shows where one instance waits and why. With `--fail-on warning`, any finding (an open incident included) fails the CI job.

Status: 0.5.0 on npm (released 2026-10-11), pre-1.0. Standalone binaries and a container image are planned for 0.6.0.

Details and first steps: [operate](/tools/operate)

::: info Not Camunda 8 Operate
operate has nothing to do with Operate, the Camunda 8 web app, and it does not support Camunda 8.
:::

## Human and AI

The agent reads the engine state and drafts the ticket. Your team decides whether it may change anything on the engine (the `operations` toolset in Pulse, a profile without `--read-only` in operate) and files the ticket itself.

## Hand-over

| Direction                    | What is handed over                                                                                                                                                                                                                                                                                                                                      | Format                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| From [Implement](/implement) | Models that already run on the engine or that `operate deploy` uploads, plus the engine's REST URL and credentials. Your own MCP server from the [Solution templates](/tools/solution-templates) runs the way Pulse does. Runtime figures in Pulse also need CIB seven with the metrics plugin `io.miragon.mcp:cibseven-history-metrics` and Prometheus. | `.bpmn`, `.dmn`, `.form`, `/engine-rest` URL, Docker image |
| To [Implement](/implement)   | Ticket drafts from Pulse with title, body, labels and an optional prefilled GitHub issue URL. From operate, the root-cause line for the next fix and exit codes for your CI pipeline.                                                                                                                                                                    | Markdown with labels, JSON, exit codes                     |
| To [Optimize](/optimize)     | Raw material only, since Optimize has no tool yet: Pulse's runtime figures (CIB seven with the metrics plugin, 30 days at most) and operate's raw history queries.                                                                                                                                                                                       | JSON and chat widgets (Pulse), JSON (operate)              |

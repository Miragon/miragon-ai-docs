---
layout: home
title: Miragon AI
description: Miragon AI gives your AI agents tools for four of the five phases of your BPM lifecycle on Camunda 7, CIB seven and Operaton, while your team makes the decisions.

hero:
  name: The agent does the legwork.
  text: Your team makes the call.
  tagline: Miragon AI gives your AI agents tools for four of the five phases of your BPM lifecycle, on Camunda 7, CIB seven and Operaton. You sign off by review or pull request, and the knowledge stays in your team.
  actions:
    - theme: brand
      text: Explore the lifecycle
      link: /analyse
    - theme: alt
      text: Talk to us
      link: /#contact
    - theme: alt
      text: GitHub
      link: https://github.com/Miragon
---

## Who it is for

Miragon AI is for teams that have their own developers and run their processes on Camunda 7, CIB seven or Operaton, where they stay for now. The tools for Analyse and Design also read Camunda 8 models.

| Role            | Your situation                                                                             | Start with                                                               |
| --------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Architect       | Before the migration or AI decision, you have no checked map of which process calls which. | [analyzr](/tools/analyzr)                                                |
| Product owner   | Sign-off happens outside Git, and you review DMN changes as an XML diff.                   | [designIQ](/tools/design-iq)                                             |
| Automation lead | The backlog of processes to automate grows, and every project wires up the engine again.   | [Skills](/tools/skills), [Solution templates](/tools/solution-templates) |
| Lead developer  | Your coding agent writes BPMN XML by hand.                                                 | [bpmn-cli](/tools/bpmn-cli), [Skills](/tools/skills)                     |
| Platform lead   | Every engine has its own Cockpit, and runtime questions need PromQL.                       | [Pulse](/tools/pulse/), [operate](/tools/operate)                        |
| Head of IT      | You have a mandate to bring in AI, but no agent may reach production unchecked.            | [Pulse](/tools/pulse/) in read-only mode                                 |

## What Miragon AI does

### [Analyse](/analyse)

Your BPMN files sit in department folders, and nobody has checked which process calls which. [analyzr](/tools/analyzr) reads them as one landscape. A rule links unambiguous call activities, and agents propose further links and the place of each process in your value chain.

### [Design](/design)

An AI agent that edits a model tends to rewrite the whole XML, coordinates included, and moves your hand-drawn layout. In [designIQ](/tools/design-iq) your team models live in the browser while AI assistants work on the same models over MCP, and every release is a pull request in your GitHub repo. [bpmn-cli](/tools/bpmn-cli) changes BPMN by command and keeps the layout.

### [Implement](/implement)

A missing `historyTimeToLive` shows up only when the engine rejects the deployment. With the [Skills](/tools/skills) for bpmn-cli and operate, your agent in Claude Code sets the engine details and tests on a dev engine. The [Solution templates](/tools/solution-templates) miragon-ai-starter and mcp-toolkit-starter start your own MCP server.

### [Execute](/execute)

Your team pieces the state together from Cockpit tabs and stack traces, one engine at a time. [Pulse](/tools/pulse/) shows the incidents across your engines in chat, grouped by failing activity and incident type, and drafts the ticket. [operate](/tools/operate) runs the triage in one command, in your shell and in CI.

### [Optimize](/optimize)

When someone in operations notices that a model no longer fits, there is no set way back into Analyse. We have no tool for this phase yet. Your team carries the finding back itself, as a todo on the BPMN element in designIQ or as a new revision of the model in analyzr.

## Human and AI

The business flow of a process stays with people. In every phase the agent prepares the work and someone on your team decides.

| Phase     | The agent                                          | Your team                                                             |
| --------- | -------------------------------------------------- | --------------------------------------------------------------------- |
| Analyse   | proposes links with confidence and a rationale     | decides on each proposal, in review or by an auto-accept rule it sets |
| Design    | turns described changes into valid BPMN            | models the business flow and signs off by merge                       |
| Implement | sets engine attributes and tests on the dev engine | writes the worker code and reviews                                    |
| Execute   | reads the state and drafts tickets                 | decides whether the agent gets write access, and files the ticket     |
| Optimize  | nothing yet                                        | decides what goes back into Analyse                                   |

## Why Miragon

- [designIQ](https://github.com/Miragon/design-iq) v5.3.0, [bpmn-cli](https://github.com/Miragon/bpmn-cli) 0.6.0, [operate](https://github.com/Miragon/operate) 0.5.0, [Pulse](https://github.com/Miragon/miragon-ai) v0.20.0 (repo Miragon/miragon-ai) and the [miragon-ai-starter](https://github.com/Miragon/miragon-ai-starter) template are public on GitHub under the MIT licence (as of 2026-10-13). For now we show analyzr as a [read-only demo](https://analyzr-demo.fly.dev).
- On every change, [operate's CI](https://github.com/Miragon/operate/actions/workflows/ci.yml) runs its integration tests against Operaton 2.1.5, CIB seven 2.2.0 and Camunda 7.24.0.
- You can add the Pulse playground as an MCP server without a login, at `https://miragon-ai-playground.fly.dev/mcp`. It is read-only and runs against a CIB seven engine with live demo traffic.
- You run Pulse on your own infrastructure. Without OAuth it starts read-only, and it needs neither a migration nor access to the engine database.
- Miragon has been a consultancy for process automation since 2019 and is a Camunda partner. We introduce the tools together with your team until you run them on your own.

## What we don't promise

- No process mining. analyzr reads the BPMN files you already have and does not evaluate logs.
- No autonomous remediation. Agents carry out what your team approves.
- No tool for Optimize. The analytics module of Pulse belongs to Execute, looks back 30 days at most and knows neither waiting times nor variants.
- No runtime support for Camunda 8, and no generated worker code.
- Not everything is mature yet. analyzr is early alpha (0.1.0-alpha.0, private repository, interface in German only). bpmn-cli, operate and Pulse are pre-1.0 and still change their interfaces. The mcp-toolkit-starter template has no licence yet. The hosted designIQ service is pre-GA, with the public launch planned around mid-November 2026.
- No numbers on time or cost savings until we have published them.

<BrandContact />

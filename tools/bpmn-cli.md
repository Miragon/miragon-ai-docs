---
layout: home
title: bpmn-cli
description: bpmn-cli is a command line tool and Claude Code plugin that lets an AI agent create and change BPMN 2.0 models by naming elements, while the tool writes the XML, keeps your diagram and checks the deploy rules of your engine.
eyebrow: { phase: Design, link: /design }
hero:
  name: bpmn-cli
  text: Your agent edits the model, not the XML.
  tagline: A command line tool and Claude Code plugin for BPMN 2.0. It keeps your hand-drawn layout and checks the deploy rules of Camunda 7, CIB seven, Operaton or Camunda 8 before the engine does.
  actions:
    - theme: brand
      text: Get started
      link: "#get-started"
    - theme: alt
      text: GitHub
      link: https://github.com/Miragon/bpmn-cli
    - theme: alt
      text: Talk to us
      link: /#contact
artefact:
  type: terminal
  title: bpmn-cli 0.6.0
  lines:
    - { cmd: 'bpmn new order.bpmn --name "Order handling" --target camunda7' }
    - { out: 'created process Process_OrderHandling "Order handling"' }
    - { cmd: 'bpmn add order.bpmn start "Order received"' }
    - { cmd: 'bpmn add order.bpmn service "Reserve stock" \' }
    - { cont: "    --after Event_OrderReceived" }
    - { cmd: 'bpmn add order.bpmn end "Done" --after Activity_ReserveStock' }
    - { out: "written: order.bpmn", tone: dim }
    - { cmd: "bpmn validate order.bpmn --strict" }
    - { out: "W_C7_DEPLOY_IMPLEMENTATION Activity_ReserveStock:", tone: warn }
    - { out: "serviceTask Activity_ReserveStock has no implementation", tone: warn }
    - { out: "(camunda:class, delegateExpression, expression,", tone: warn }
    - { out: "type=external or a connector); the engines refuse the file", tone: warn }
    - { out: "(Give it one: `bpmn set <file> Activity_ReserveStock" }
    - { out: "camunda:type=external camunda:topic=<topic>` (or" }
    - { out: "camunda:delegateExpression=${...}, camunda:class=...," }
    - { out: "camunda:expression=${...}).)" }
---

## The problem

When an agent models or changes a process today, it writes the BPMN XML itself, and most of that XML is diagram coordinates. Every coordinate costs tokens and is a chance to break the file, and shapes your team placed by hand in Camunda Modeler get moved. Read as raw XML, a large model no longer fits into the agent's context.

## How it works

The agent works in four steps and addresses every element by its id.

1. It reads the model with `bpmn show order.bpmn`, or `--around <id>` for one part, as compact text without coordinates.
2. It changes the model with `bpmn add`, `set` or `connect`, or sends several changes as one `bpmn apply` batch. bpmn-cli validates before it writes and refuses a change that would add a structural error. A hand-drawn diagram is kept, and new elements go next to their neighbours.
3. It looks at its work with `bpmn render order.bpmn --problems -o order.png`: a PNG drawn without a browser, with the layout problems numbered in the image.
4. It checks the file with `bpmn validate order.bpmn --strict` against the deploy rules of Camunda 7, CIB seven, Operaton or Camunda 8. On any warning the command exits with code 5, so a pipeline stops.

Each finding names the command that fixes it. For the session above, one `bpmn set` gives the service task an external topic, and the next check passes:

```sh
bpmn set order.bpmn Activity_ReserveStock camunda:type=external camunda:topic=reserve-stock
bpmn validate order.bpmn --strict   # valid, 0 warning(s)
```

You get an ordinary `.bpmn` file with a laid-out diagram and descriptive ids such as `Activity_ReserveStock`. It opens in Camunda Modeler and bpmn-js. Elements a change did not touch keep their exact text, so Git diffs stay small.

## Get started {#get-started}

You need Node.js 20 or later. To let Claude do the modelling, add the plugin in Claude Code. Its skill `bpmn` makes Claude use the CLI for every request that touches a `.bpmn` file. It runs `bpmn` from your PATH, or else `npx` pinned to the plugin's version. To work at the shell yourself, install the CLI and build a first model.

::: code-group

```txt [Claude Code]
/plugin marketplace add Miragon/bpmn-cli
/plugin install bpmn-cli@miragon-bpmn
```

```sh [Shell]
npm install -g @miragon/bpmn-cli   # puts `bpmn` on your PATH
bpmn new order.bpmn --name "Order handling"
bpmn add order.bpmn start "Order received"
bpmn add order.bpmn userTask "Check invoice" --after Event_OrderReceived
bpmn add order.bpmn end "Done" --after Activity_CheckInvoice
bpmn show order.bpmn
bpmn validate order.bpmn
bpmn render order.bpmn -o order.png
```

:::

In Claude Code, then ask in plain words, in English or German, for example _"Model the order process with lanes for sales, warehouse and accounting."_ The agent can also keep the requirement text on a step (`bpmn set <file> <id> doc="..."`). At the shell, `npx -y @miragon/bpmn-cli@0.6.0` works in place of `bpmn` without installing. For an executable model, add `--target camunda7` (also for CIB seven and Operaton) or `--target camunda8` to `bpmn new`. Every command and option is in the [command reference](https://github.com/Miragon/bpmn-cli/blob/main/docs/commands.md).

## Status

As of 2026-10-13, bpmn-cli is at version 0.6.0, released on 2026-10-12 to npm as `@miragon/bpmn-cli`. It is pre-1.0, and minor versions still bring breaking changes (0.3.0, 0.4.0 and 0.5.0 did). The repository is public under the MIT licence.

There is no hosted playground: the CLI runs locally through npm or npx. bpmn-cli has no MCP server of its own, so an agent calls the CLI, and designIQ uses it as a library. The tool captures a described process as a valid model. It does not elicit or prioritise requirements.

## Proof you can open

- [@miragon/bpmn-cli on npm](https://www.npmjs.com/package/@miragon/bpmn-cli), version 0.6.0
- [Demo GIF](https://github.com/Miragon/bpmn-cli/blob/main/docs/assets/demo.gif): one `bpmn add` inserts a task into a small order process
- [Walkthrough](https://github.com/Miragon/bpmn-cli/blob/main/docs/walkthrough.md): one session from an empty file to a validated Camunda 8 model with two pools, with real CLI output
- [Claude Code plugin](https://github.com/Miragon/bpmn-cli/tree/main/plugins/bpmn-cli) with its skill and seven eval cases (results not published yet)
- [designIQ ADR 0009](https://github.com/Miragon/design-iq/blob/main/docs/adr/0009-bpmn-editing-through-bpmn-cli.md): why designIQ edits BPMN through bpmn-cli
- [Repository on GitHub](https://github.com/Miragon/bpmn-cli) with the [README](https://github.com/Miragon/bpmn-cli#readme)

## Where it fits

bpmn-cli serves [Design](/design), and its deploy checks reach into Implement.

- It takes a description from the conversation, or an existing `.bpmn` file from Camunda Modeler, bpmn-js or a [designIQ](/tools/design-iq) content repository. There is no direct connection from [analyzr](/tools/analyzr) in Analyse yet, so an as-is model arrives as a file.
- [designIQ](/tools/design-iq) uses bpmn-cli as the engine of its semantic BPMN editing, opt-in since designIQ v5.3.0 and off by default for now.
- In [Implement](/implement) the same plugin sets Camunda 7 or Camunda 8 details such as job types, external tasks and mappings by id. [Skills](/tools/skills) shows how the agent combines this with [operate](/tools/operate), which deploys the model to Camunda 7, CIB seven or Operaton and runs a test instance.

The whole lifecycle: [Miragon AI](/)

[Talk to us](/#contact) about letting your agents model BPMN in your team's repository.

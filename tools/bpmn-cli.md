---
title: bpmn-cli
description: bpmn-cli is a command line tool and Claude Code plugin that lets an AI agent create and change BPMN 2.0 models by naming elements, while the tool writes the XML and keeps your diagram.
---

# bpmn-cli

bpmn-cli lets an AI agent, or you at a shell, create and change BPMN 2.0 models by naming elements and operations, while the tool writes the XML and keeps the drawing.

::: info Status
As of 2026-10-13: version 0.6.0, released on 2026-10-12 to npm as `@miragon/bpmn-cli`. The tool is pre-1.0, and minor versions still bring breaking changes (0.3.0, 0.4.0 and 0.5.0 did). The repository is public under the MIT licence. There is no hosted playground: the CLI runs locally through npm or npx.
:::

## Why

When an agent models or changes a process today, it writes the BPMN XML itself, and most of that XML is diagram coordinates. Time and cost grow with every token it writes. Each coordinate is a chance to break the file, and shapes your team placed by hand in Camunda Modeler get moved. Read as raw XML, a large model no longer fits into the agent's context.

With bpmn-cli the agent names the element and the change, for example `bpmn add order.bpmn userTask "Check invoice" --after Event_OrderReceived`, or sends several changes as one JSON batch with `bpmn apply`. It reads the model as a compact text view without coordinates (`bpmn show <file>`, or `bpmn show <file> --around <id>` for the part around one element). Every change is validated before the file is written, and a change that would add a structural error is refused and leaves the file untouched. A hand-drawn diagram is kept, and new elements go next to their neighbours. `bpmn render` draws the result as PNG or SVG without a browser, and with `--problems` it numbers the layout problems in the image, so the agent can look at its own work.

You get an ordinary `.bpmn` file with a laid-out diagram and descriptive ids such as `Activity_CheckInvoice`. It opens in Camunda Modeler and bpmn-js. Elements a change did not touch keep their exact text, so git diffs stay small. `bpmn validate` checks the deploy rules of Camunda 7, CIB seven, Operaton or Camunda 8, and `--strict` stops a pipeline when a rule fails.

## Get started

You need Node.js 20 or later. To let Claude do the modelling, add the plugin in Claude Code. Its skill `bpmn` makes Claude use the CLI for every request that touches a `.bpmn` file instead of writing XML. It runs `bpmn` from your PATH, or else `npx` pinned to the plugin's version. To work at the shell yourself, install the CLI and build a first model.

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

In Claude Code, then ask in plain words, for example _"Model the order process with lanes for sales, warehouse and accounting."_ At the shell, `npx -y @miragon/bpmn-cli@0.6.0` works in place of `bpmn` without installing. For an executable model, add `--target camunda7` (also for CIB seven and Operaton) or `--target camunda8` to `bpmn new`, then open the file in Camunda Modeler.

## Proof you can open

- [@miragon/bpmn-cli on npm](https://www.npmjs.com/package/@miragon/bpmn-cli), version 0.6.0
- [Demo GIF](https://github.com/Miragon/bpmn-cli/blob/main/docs/assets/demo.gif): one `bpmn add` inserts a task into a small order process
- [Walkthrough](https://github.com/Miragon/bpmn-cli/blob/main/docs/walkthrough.md): one session from an empty file to a validated Camunda 8 model with two pools, with real CLI output
- [Claude Code plugin](https://github.com/Miragon/bpmn-cli/tree/main/plugins/bpmn-cli) with its skill and seven eval cases
- [designIQ ADR 0009](https://github.com/Miragon/design-iq/blob/main/docs/adr/0009-bpmn-editing-through-bpmn-cli.md): why designIQ edits BPMN through bpmn-cli
- [Repository on GitHub](https://github.com/Miragon/bpmn-cli)

## Where it fits

bpmn-cli serves [Design](/design). Your team models the to-be process and decides by pull request what is released, and the agent drafts models and changes them on request. Someone describes a process in English or German, and the agent captures it with lanes for roles and the requirement text on a step (`bpmn set <file> <id> doc="..."`). The tool does not elicit or prioritise requirements.

- It takes a description from the conversation, or an existing `.bpmn` file from Camunda Modeler, bpmn-js or a [designIQ](/tools/design-iq) content repository. There is no direct link from [analyzr](/tools/analyzr) in Analyse yet, so an as-is model arrives as a file.
- [designIQ](/tools/design-iq) uses bpmn-cli as the engine of its opt-in semantic BPMN editing. Since designIQ v5.3.0, `LIVE_MCP_BPMN_EDIT=1` turns it on, and the flag stays off by default until an A/B benchmark has run.
- In [Implement](/implement) the same plugin sets Camunda 7 or Camunda 8 details such as job types, external tasks and mappings by id, and `bpmn validate --strict` reports deploy blockers before the engine does. [Skills](/tools/skills) shows how the agent combines this with [operate](/tools/operate), which deploys the model to Camunda 7, CIB seven or Operaton and runs a test instance.

## Reference

- [README](https://github.com/Miragon/bpmn-cli#readme): install, quick start, the command overview and the plugin
- [Command reference](https://github.com/Miragon/bpmn-cli/blob/main/docs/commands.md): every command with its options

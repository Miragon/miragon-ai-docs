---
title: Analyse
description: How analyzr and your team turn the BPMN files you already have into a reviewed map of how your processes connect and where each one sits in your value chain.
---

# Analyse

In Analyse, your team maps how your existing processes connect and where each process sits in your value chain. You start from the BPMN models you already have.

## The problem today

Your as-is landscape usually lives as BPMN files in department folders, with Camunda 7 and Camunda 8 models mixed. The links between processes sit inside those files: call activities, message and signal names, end events that start the next process. Nobody has reviewed who calls whom, or which process belongs to which step of the value chain. The folders follow your departments while the value stream cuts across them, so you cannot read the map from the folder tree.

## How Miragon AI helps

### analyzr

analyzr reads your BPMN files into one landscape. Code without an LLM extracts the facts, and agents in an MCP client you choose, such as Claude Code, propose how the processes connect and which value chain step each one belongs to. You get a reviewed as-is landscape in which every link and placement records where it came from and who decided it.

Status: early alpha (0.1.0-alpha.0) in a private repository, with no public release yet, local mode only, web UI and agent rationales in German. The [read-only demo](https://analyzr-demo.fly.dev/projects/nordwind-handel/review) shows two synthetic landscapes, worked by a simulation agent without an LLM.

Details and first steps: [analyzr](/tools/analyzr)

::: info What analyzr does not do
analyzr reads BPMN models that already exist. It does not mine logs, read runtime data or generate BPMN.
:::

## Human and AI

Agents propose links and placements with confidence and a rationale but cannot accept them, and a rule without an LLM accepts unambiguous call activities. A person on your team decides every other proposal in review (accept, reject, hold or correct), unless an auto-accept rule that the project owner set covers it (there are none by default).

## Hand-over

| Direction                  | What is handed over                                                                                                                                                                                                                             | Format                                                                                                                                                                                                                |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| From [Optimize](/optimize) | Your existing models, and later the models your team changed after running them. A re-upload becomes a new revision, only models whose facts changed are analysed again, and earlier decisions stay valid unless an endpoint's meaning changed. | BPMN 2.0 XML for Camunda 7 and Camunda 8 (`.bpmn`, `.bpmn2`, `.bpmn20.xml`), optionally a value chain as `.vc.json` in the format of the public [value-chain-modeler](https://github.com/Miragon/value-chain-modeler) |
| To [Design](/design)       | The reviewed as-is landscape: relations between processes, placements on the value chain, findings such as unresolved calls or processes without a step, and the model revisions.                                                               | REST (OpenAPI 3.1) and MCP read tools; the value chain also as `.vc.json` via `analyzr value-chain pull`                                                                                                              |

analyzr has no direct connection to designIQ or bpmn-cli yet, and findings from operations reach Analyse without a fixed format.

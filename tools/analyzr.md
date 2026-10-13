---
title: analyzr
description: analyzr reads your existing BPMN files as one process landscape in which AI agents propose how the processes connect and your team decides.
---

# analyzr

analyzr turns the BPMN files you already have into one reviewed map of how your processes connect, for architects and BPM analysts who need that map before they change a process.

::: info Status
As of 2026-10-13: early alpha, version 0.1.0-alpha.0. The source (MIT licence) sits in a private repository for now, and no release, image or package is published. analyzr runs in local mode only, with one owner on 127.0.0.1. The web UI is German only for now, and the agent procedure asks for rationales in German.
:::

## Why

Your as-is landscape is usually a pile of BPMN files in department folders, Camunda 7 and Camunda 8 mixed, and nobody has reviewed who calls whom or which value chain step a process belongs to. Matching on labels misses links that hide in event definitions or `calledElement`, and a map kept by hand goes stale with the next change.

analyzr imports the BPMN files you already have, through the web UI, a CLI or REST. Code without an LLM extracts the facts and accepts unambiguous call activities. Message and signal names that match exactly become proposals. AI agents in an MCP client you choose judge the remaining candidate pairs and submit proposals with confidence, rationale and evidence. They also propose a step of your value chain for each process. analyzr holds no LLM credentials, so the model comes with your agent. Agents cannot decide. In the review screen you see both models in bpmn-js and accept, reject, hold or correct each proposal.

analyzr reads existing BPMN files only. It does not discover processes from event logs, and it does not generate BPMN.

Your team ends up with a reviewed landscape. Every relation (call, message, signal, trigger) and every placement on the value chain records who proposed it (a rule, an agent with model and procedure version, or a person), with confidence and rationale, and who decided. Findings such as unresolved calls or processes without a value chain step show the gaps. When you upload a changed model, analyzr stores a new revision, sends only models whose facts changed back to the agents, and keeps your decisions unless the meaning of an endpoint changed.

## Get started

You need a browser. There is nothing to install and no login. Open the review inbox of the demo landscape:

```text
https://analyzr-demo.fly.dev/projects/nordwind-handel/review
```

nordwind-handel is a synthetic landscape with 31 models for Camunda 7 and Camunda 8. Open a proposal to see both models side by side with the agent's confidence, rationale and evidence, then switch to the value chain page (`/projects/nordwind-handel/value-chain`) to see where each process sits. The proposals come from a simulation agent without an LLM, so treat them as a walkthrough of the workflow. The demo is read-only, and the first request can take a few seconds while the idle machine starts.

For your own BPMN files, analyzr runs locally with Docker Compose (PostgreSQL included) and connects to your agent, for example Claude Code, over MCP with a project token. You bring the model through your agent's subscription or API key. While the repository is private, self-hosting is on request. [Get in touch](/#contact).

## Proof you can open

- [Read-only demo](https://analyzr-demo.fly.dev) with two synthetic landscapes and their value chains, no login.
- [Review inbox of nordwind-handel](https://analyzr-demo.fly.dev/projects/nordwind-handel/review) with proposals, open questions and "no link" verdicts.
- [Value chain of nordwind-handel](https://analyzr-demo.fly.dev/projects/nordwind-handel/value-chain) with placement proposals per step.
- [Miragon/value-chain-modeler](https://github.com/Miragon/value-chain-modeler), the public editor and packages for the `.vc.json` value chain format. analyzr pins the format packages at 0.3.0 while the editor is at 0.4.0. Whether files move between the two versions without loss is not verified yet.

There is no public repository, release, image or npm package yet.

## Where it fits

analyzr serves the [Analyse](/analyse) phase. It takes existing BPMN 2.0 files for Camunda 7 and Camunda 8 (`.bpmn`, `.bpmn2`, `.bpmn20.xml`) and, optionally, a value chain as `.vc.json`. It hands out the reviewed landscape (relations, placements, findings, revisions) over REST and MCP read tools, and the value chain as a `.vc.json` file.

There is no direct connection to the [Design](/design) tools yet. Your team takes the reviewed map into Design, so it knows which processes a change touches before it models the change in [designIQ](/tools/design-iq) or [bpmn-cli](/tools/bpmn-cli). From [Optimize](/optimize), the way back is a re-upload, which creates a new revision in analyzr. analyzr does not read runtime data from your engines, which is where [miragon-ai](/tools/miragon-ai/) and [operate](/tools/operate) work.

## Reference

The README and the docs sit in the private repository for now. Meanwhile, the demo serves the [REST API description](https://analyzr-demo.fly.dev/api/v1/openapi.json) (OpenAPI 3.1), and the [value-chain-modeler README](https://github.com/Miragon/value-chain-modeler#readme) covers the value chain notation and the packages behind `.vc.json`.

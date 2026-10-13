---
layout: home
title: analyzr
description: analyzr reads the BPMN files you already have into one process landscape, where AI agents propose how the processes connect and your team decides every proposal.
eyebrow: { phase: Analyse, link: /analyse }
hero:
  name: analyzr
  text: Know which process calls which before you change one.
  tagline: analyzr (early alpha) reads the BPMN files you already have, Camunda 7 and Camunda 8 mixed, into one landscape. AI agents propose the links a rule cannot settle, and your team decides each proposal in review.
  actions:
    - theme: brand
      text: Try the demo
      link: https://analyzr-demo.fly.dev/projects/nordwind-handel/review
    - theme: alt
      text: Talk to us
      link: /#contact
artefact:
  type: screenshot
  src: /screens/analyzr-review.jpg
  alt: "analyzr's review screen: on the left a Camunda 7 model with the message throw 'Rechnung versendet', on the right a Camunda 8 model with the message catch 'Invoice sent', and a side panel with the proposed message link at 73% confidence, its rationale, evidence and origin."
  url: analyzr-demo.fly.dev/projects/nordwind-handel/review/rel_01M4QR6HPTKSC1A8SZB96GM609
  caption: "The review screen of the read-only demo (the UI is in German). A message link from a Camunda 7 model to a Camunda 8 model, proposed at 73% confidence by the demo's simulation agent, which runs without an LLM."
---

## The problem

Before you change or migrate a process, you need to know which other processes it touches and which step of your value chain it serves. Those links hide inside your BPMN files. Matching on labels misses the ones in event definitions and `calledElement`, and it gives you neither a confidence nor a reason for a link. A map kept by hand goes stale with the next change.

## How it works

analyzr imports only BPMN files that already exist. It does not mine event logs, read runtime data from your engines or generate BPMN.

| Who                          | What happens                                                                                                                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| You                          | Upload BPMN 2.0 files (`.bpmn`, `.bpmn2`, `.bpmn20.xml`) or a whole folder in the web UI, or use the CLI or REST. The folder path becomes the model key. Optionally, draw your value chain in the browser or import it as `.vc.json`. |
| Code without an LLM          | Extracts calls, messages, signals, start and end events. It accepts call activities that point to exactly one process, proposes identical message and signal names and reports findings such as unresolved calls.                     |
| AI agents in your MCP client | Judge the remaining candidate pairs, each pair once, and submit a link or a "no link" verdict with confidence, rationale and evidence. They also propose a value chain step for each process.                                         |
| Your team                    | Sees both models side by side in bpmn-js and accepts, rejects, holds or corrects each proposal. Agents have no tool to decide.                                                                                                        |

analyzr holds no LLM credentials. The model comes with your agent, for example Claude Code on your own subscription or API key. Auto-accept rules are off by default, and only the project owner can set them, per kind, tier and minimum confidence.

## What your team gets

In the reviewed as-is landscape, every relation (call, message, signal, trigger) and every placement on the value chain records who proposed it (a rule, an agent with model and procedure version, or a person), with confidence and rationale, and who decided. Findings such as unresolved calls or processes without a value chain step show the gaps.

When you upload a changed model, analyzr stores a new revision and sends only the models whose facts changed back to the agents. Your decisions stay unless the meaning of an endpoint changed. The landscape goes out over REST (OpenAPI 3.1) and MCP read tools, and the value chain as a `.vc.json` file.

## Get started {#get-started}

You open the demo in your browser, with nothing to install and no login. Its project nordwind-handel is a synthetic landscape of 31 models for Camunda 7 and Camunda 8.

1. Open the [review inbox of nordwind-handel](https://analyzr-demo.fly.dev/projects/nordwind-handel/review). The demo stops when idle, so the first request can take a few seconds.
2. Open a proposal to see both models with the agent's confidence, rationale and evidence. The models sit side by side in a window at least 1280 pixels wide, and one at a time in a narrower one.
3. Switch to the tab "Kein Zusammenhang" for the pairs the agent judged as unrelated.
4. Open the [value chain](https://analyzr-demo.fly.dev/projects/nordwind-handel/value-chain) to see where each process sits and which placements wait for review.

For your own BPMN files, analyzr runs locally with Docker Compose (PostgreSQL included) and connects to your agent over MCP with a project token. While the repository is private, [ask us](/#contact) for self-hosting.

## Status

As of 2026-10-13, analyzr is in early alpha at version 0.1.0-alpha.0.

- The source (MIT licence) sits in a private repository for now. No release, image or package is published.
- It runs in local mode only, with one owner on 127.0.0.1.
- The web UI is German only, and the agent procedure asks for rationales in German.
- The demo's proposals come from a simulation agent without an LLM. They show the workflow, not the quality of a model, and we have not published numbers on proposal quality yet.
- There is no direct connection to the Design tools yet.

## Proof you can open

- [Read-only demo](https://analyzr-demo.fly.dev) with two synthetic landscapes and their value chains, no login.
- [REST API description](https://analyzr-demo.fly.dev/api/v1/openapi.json) (OpenAPI 3.1), served by the demo.
- [Miragon/value-chain-modeler](https://github.com/Miragon/value-chain-modeler), the public editor and packages for the `.vc.json` format. analyzr pins the format packages at 0.3.0 while the editor is at 0.4.0, and we have not verified that files move between the two without loss.

## Where it fits

analyzr serves [Analyse](/analyse). Your team takes the reviewed map into [Design](/design), so it knows which processes a change touches before it models the change in [designIQ](/tools/design-iq) or [bpmn-cli](/tools/bpmn-cli). The way back from [Optimize](/optimize) is a re-upload of the changed model. Runtime data from your engines is the job of [Pulse](/tools/pulse/) and [operate](/tools/operate) in Execute.

The whole lifecycle: [Miragon AI](/)

[Talk to us](/#contact) about mapping your own BPMN landscape with analyzr.

---
layout: home
title: operate
description: operate is a command line tool for Camunda 7, CIB seven and Operaton that shows what is stuck on your engine in one command and names the next one to run.
eyebrow: { phase: Execute, link: /execute }
hero:
  name: operate
  text: What is stuck on your engine, in one command.
  tagline: operate is a command line tool for Camunda 7, CIB seven and Operaton. It groups incidents by root cause and names the next command, whether you, your coding agent or a CI job runs it.
  actions:
    - theme: brand
      text: Get started
      link: "#get-started"
    - theme: alt
      text: GitHub
      link: https://github.com/Miragon/operate
    - theme: alt
      text: Talk to us
      link: /#contact
artefact:
  type: terminal
  title: operate 0.5.0 · local Operaton 2.1.5
  lines:
    - { note: "3 orders failed at the same service task" }
    - { cmd: "operate status" }
    - { out: "Engine  http://localhost:8080/engine-rest (version 2.1.5, 21ms)", tone: dim }
    - { out: "Status  warning", tone: warn }
    - { out: "" }
    - { out: "Findings:" }
    - {
        out: "  warning  3 failedJob incidents at order/charge: ClassNotFoundException: com.example.payment.ChargeCardDelegate",
        tone: warn,
      }
    - {
        out: "           next: operate retry --process-definition-key order --activity-id charge --dry-run",
      }
    - { out: "" }
    - { out: "Definitions:" }
    - { out: "KEY            VERSIONS  INSTANCES  INCIDENTS  FAILED JOBS", tone: dim }
    - { out: "order          1         3          3          3" }
    - { out: "invoice        2         6          0          0" }
---

## The problem

To find out why order ORD-1001 stopped moving, you work through the engine's REST API one request at a time. You look up the instance by business key, list its activity instances, read its incidents and jobs, then fetch the stack trace, and each answer shapes the next request. A coding agent on the same path reads every full response, copies ids by hand and guesses at endpoints it doesn't know. No single call tells a CI job whether the engine is healthy.

## What operate does

operate turns the 396 operations of the Camunda 7 REST API into commands such as `operate task list`, and adds six workflow commands that combine several requests into one answer.

| You want to know                    | operate answers with                                                                                                                                                                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What is stuck on the engine         | `operate status`: root incidents grouped by process definition, activity and message, each with a root-cause line from the stack trace, plus overdue jobs, external task topics with waiting tasks or expired locks, and failed batches |
| Where one instance waits and why    | `operate inspect --business-key ORD-1001`: its wait states across called sub-instances, its incidents and variables                                                                                                                     |
| What to run next                    | a ready command under every finding, such as the `operate retry … --dry-run` in the session above                                                                                                                                       |
| How a deployed model behaves on dev | `operate deploy`, `wait`, `advance` and `retry`, without passing a single id around                                                                                                                                                     |
| Whether a CI job should fail        | `operate status --fail-on warning`, which exits with code 9 on any finding                                                                                                                                                              |

An agent looks commands up in the CLI itself (`operate guide`, `operate commands --search`, `operate describe`), so it has no reason to guess endpoints. Output is JSON when piped and a table on a terminal. Errors are one JSON line with a hint and a stable exit code.

Your team decides what an agent may change. A profile created with `--read-only` refuses every command that writes, with exit code 2. `--dry-run` previews any write, and delete and bulk commands need `--yes`.

## Get started {#get-started}

You need Node.js 22.12 or later and a reachable Camunda 7 REST API. operate uses `http://localhost:8080/engine-rest` by default, so a local Operaton container needs no configuration. Give it a few seconds to start before the first command.

```sh
npm install -g @miragon/operate
docker run -d --name engine -p 8080:8080 operaton/operaton:2.1.5
operate ping
operate status
```

Then point operate at your own engine with a look-only profile, or hand it to Claude Code or your CI pipeline. A profile also holds the engine's Basic auth, OAuth or bearer token settings. The Claude Code plugin calls the CLI you installed. Other agents need one line in `AGENTS.md` or `CLAUDE.md`: "Run `operate guide` before using `operate`."

::: code-group

```sh [Your engine]
operate config set prod --url https://<host>/engine-rest --read-only
operate status --profile prod
```

```text [Claude Code]
/plugin marketplace add Miragon/operate
/plugin install operate@miragon
/operate:status
```

```sh [CI]
export OPERATE_URL=https://<host>/engine-rest
operate status --read-only --fail-on warning
```

:::

In CI, `--fail-on warning` fails on any finding, an open incident included. `--fail-on critical` fails only when executable jobs are overdue, and that finding asks whether the job executor is running. The [README](https://github.com/Miragon/operate#readme) maps everyday tasks to commands and links the rest of the docs.

## Status

As of 2026-10-13, operate is at version 0.5.0, released on 2026-10-11 to npm as `@miragon/operate`. It is pre-1.0, so commands and output can still change. The repository [Miragon/operate](https://github.com/Miragon/operate) is public under the MIT licence. Standalone binaries and a container image are planned for 0.6.0 and not released yet. There is no hosted playground, and there are no published measurements of token or time savings. operate does not support Camunda 8 and is unrelated to Operate, the Camunda 8 web app.

## Proof you can open

- The session at the top of this page: operate 0.5.0 against a local `operaton/operaton:2.1.5` container, with three orders whose delegate class the engine cannot load.
- [Demo GIF](https://github.com/Miragon/operate/blob/main/docs/assets/demo.gif): one `operate advance` completes the task an order process waits at.
- [Quick start](https://github.com/Miragon/operate/blob/main/docs/quick-start.md): from an empty Operaton container to a finished instance, with a sample `order.bpmn`.
- [Workflow commands](https://github.com/Miragon/operate/blob/main/docs/workflow-commands.md): `status`, `inspect`, `wait`, `advance`, `retry` and `deploy`, with a sample `inspect` view.
- [npm package](https://www.npmjs.com/package/@miragon/operate) and its [releases](https://github.com/Miragon/operate/releases) from 0.1.0 on.
- [CI runs](https://github.com/Miragon/operate/actions/workflows/ci.yml) against Operaton 2.1.5, CIB seven 2.2.0 and Camunda 7.24.0 on every change.

## Where it fits

operate serves [Execute](/execute): find what is stuck and why. [Pulse](/tools/pulse/), the MCP server from the repo Miragon/miragon-ai, reads the same engines for your operations team and product owners in a chat. operate needs no server and talks to one engine per call, and the two share no code.

In [Implement](/implement), the operate skill from [Skills](/tools/skills) lets your coding agent deploy and run a model on a dev engine, whether it comes from [bpmn-cli](/tools/bpmn-cli), [designIQ](/tools/design-iq) or your own modeler. Once a fix is deployed, `operate retry --now` runs the failed jobs again. For [Optimize](/optimize), which has no tool yet, operate offers only raw history queries as JSON, with no KPIs.

The whole lifecycle: [Miragon AI](/)

[Talk to us](/#contact) about running operate against your own engines and pipelines.

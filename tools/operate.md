---
title: operate
description: operate is a command line tool that gives developers, coding agents and CI pipelines the state of a Camunda 7, CIB seven or Operaton engine in one command.
---

# operate

operate is a command line tool for Camunda 7, CIB seven and Operaton that gives you, your coding agent or your CI job the engine's state in one command instead of a chain of REST requests.

::: info Status
As of 2026-10-13: version 0.5.0, released on 2026-10-11 to npm as `@miragon/operate`. Pre-1.0: commands and output can still change. The repository [Miragon/operate](https://github.com/Miragon/operate) is public under the MIT licence. Standalone binaries and a container image are planned for 0.6.0 and not released yet. operate does not support Camunda 8 and is unrelated to Operate, the Camunda 8 web app.
:::

## Why

To find out why order ORD-1001 stopped moving, you work through the engine's REST API one request at a time. You look up the instance by business key, list its activity instances, read its incidents and jobs, fetch the stack trace and read the variables, and each answer shapes the next request. A coding agent on the same path reads every full response, copies ids by hand and guesses at endpoints it doesn't know. No single call tells a CI job whether the engine is healthy.

operate turns the 396 operations of the REST API into commands such as `operate task list`. Six workflow commands combine several requests. `operate status` triages the whole engine in one read-only call: root incidents grouped by process definition, activity and message with a root-cause line from the stack trace, overdue jobs, external task topics with waiting tasks or expired locks, open tasks and failed batches. `operate inspect --business-key ORD-1001` shows where one instance waits and why, across called sub-instances, with its incidents and variables. Every finding names the next command to run. An agent looks commands up in the CLI itself (`operate guide`, `operate commands --search`, `operate describe`), so it has no reason to guess endpoints. Output is JSON when piped and a table on a terminal. Errors are one JSON line with a hint and a stable exit code.

Your agent writes one short command and reads only what its next step needs. There are no published measurements of token or time savings yet. Your team decides what an agent may change: a profile created with `--read-only` refuses every command that writes (exit code 2), `--dry-run` previews any write, and delete and bulk commands need `--yes`. `operate status --fail-on critical` exits with code 9 on a critical finding, so engine health can fail a CI job.

## Get started

You need Node.js 22.12 or later and a reachable Camunda 7 REST API. operate uses `http://localhost:8080/engine-rest` by default, so a local Operaton container needs no configuration. Give it a few seconds to start before the first command.

```sh
npm install -g @miragon/operate
docker run -d --name engine -p 8080:8080 operaton/operaton:2.1.5
operate status
```

Then point operate at your own engine with a look-only profile, or hand it to Claude Code or your CI pipeline. A profile also holds the engine's Basic auth, OAuth or bearer token settings. The plugin calls the CLI you installed. Other agents need one line in `AGENTS.md` or `CLAUDE.md`: "Run `operate guide` before using `operate`."

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
operate status --read-only --fail-on critical
```

:::

## Proof you can open

- [Demo GIF](https://github.com/Miragon/operate/blob/main/docs/assets/demo.gif): one `operate advance` completes the task an order process waits at.
- [npm package](https://www.npmjs.com/package/@miragon/operate) with version 0.5.0 and its [releases](https://github.com/Miragon/operate/releases) from 0.1.0 on.
- [Quick start](https://github.com/Miragon/operate/blob/main/docs/quick-start.md): from an empty Operaton container to a finished instance, with a sample `order.bpmn`. There is no hosted playground.
- [CI runs](https://github.com/Miragon/operate/actions/workflows/ci.yml) against Operaton 2.1.5, CIB seven 2.2.0 and Camunda 7.24.0 on every change.

## Where it fits

operate serves [Execute](/execute): find what is stuck and why. It reads the same engines as [miragon-ai](/tools/miragon-ai/), a self-hosted MCP server that your operations team and product owners use from a chat. operate is a CLI that needs no server and talks to one engine per call, chosen by URL or profile. The two share no code.

In [Implement](/implement), the operate skill from [Skills](/tools/skills) lets your coding agent run `operate deploy --start` on a dev engine. `operate deploy` skips unchanged `.bpmn`, `.dmn` and `.form` files, so they keep their version. The models can come from [bpmn-cli](/tools/bpmn-cli) or [designIQ](/tools/design-iq); operate has no direct integration with either. Fixes go back to Implement: the root-cause line points at the failing code or configuration, and `operate retry --now` runs the failed jobs again once the fix is deployed. For [Optimize](/optimize), operate offers raw history queries such as `operate historic-process-instance list` as JSON, with no KPIs. Optimize has no tool yet.

## Reference

- [README](https://github.com/Miragon/operate#readme): install, commands, engines and the index of all docs pages.
- [Workflow commands](https://github.com/Miragon/operate/blob/main/docs/workflow-commands.md): `status`, `inspect`, `wait`, `advance`, `retry` and `deploy`, with the development loop and a sample `inspect` view.

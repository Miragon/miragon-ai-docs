---
title: Skills
description: Claude Code plugins that teach your coding agent to make a BPMN model deployable and run it once on a Camunda 7, CIB seven or Operaton dev engine.
---

# Skills

Skills are Claude Code plugins that give your coding agent BPMN and engine know-how, for the developers who turn a process model into a file the engine runs.

::: info Status
As of 2026-10-13. Two public plugins under the MIT licence: `bpmn-cli` 0.6.0 (released 2026-10-12) and `operate` 0.5.0 (released 2026-10-11). Each plugin carries the version of its CLI on npm. Both are pre-1.0, and bpmn-cli has shipped breaking changes in minor releases. The plugins install through Claude Code plugin marketplaces. Other coding agents can use both CLIs without a skill, through the guides the CLIs print (`bpmn guide`, `operate guide`).
:::

## Why

A coding agent without guidance adds the engine details by editing the BPMN XML by hand (topics or delegates, mappings, error codes and a `historyTimeToLive` on Camunda 7, CIB seven or Operaton, job types and FEEL conditions on Camunda 8) and can break the hand-made drawing. A missing detail shows up only when the engine rejects the deployment, and a test run means chaining REST calls and copying ids from one response into the next.

The `bpmn` skill has the agent change the model through `@miragon/bpmn-cli`, addressing elements by id, so the agent writes no XML and your layout stays. It sets the Camunda 7 or Camunda 8 attributes and runs `bpmn validate --strict`, which flags what would make the engine refuse the file (`W_C7_DEPLOY_*`, `W_C8_DEPLOY_*`) and names the command that fixes each finding. The `operate` skill deploys the file to a Camunda 7, CIB seven or Operaton engine and drives a test instance to its end, without ids passing through the agent.

Deploy blockers show up before the engine sees the file. If the test instance runs into an incident, `operate wait` fails with exit code 9 and still shows where the instance stopped. We have not published eval results with and without the plugins yet.

No skill writes the worker or delegate code that the topics and job types point to, so your team still writes it. Camunda 8 gets modelling and validation only, with no skill that deploys to or runs on it, and there is no DMN skill.

## Get started

You need Claude Code. The `bpmn` skill needs Node.js 20 or later, `operate` needs Node.js 22.12 or later and a Camunda 7, CIB seven or Operaton engine. Add each marketplace and install its plugin in a Claude Code session. To give the whole team the plugins, list both marketplaces under `extraKnownMarketplaces` and both plugins under `enabledPlugins` in your repo's `.claude/settings.json`. Claude Code does not update these plugins on its own. After a release, refresh the marketplace (`miragon-bpmn` or `miragon`) and update the plugin, or turn on auto-update for both marketplaces under `/plugin` > Marketplaces.

::: code-group

```text [bpmn-cli]
/plugin marketplace add Miragon/bpmn-cli
/plugin install bpmn-cli@miragon-bpmn
```

```text [operate]
/plugin marketplace add Miragon/operate
/plugin install operate@miragon
```

:::

The skills fall back to `npx` when a CLI is not on your PATH, and installing both CLIs lets you run them yourself too. The other two lines start a local Operaton dev engine and check that operate reaches it at its default `http://localhost:8080/engine-rest`:

```sh
npm install -g @miragon/bpmn-cli @miragon/operate
docker run -d --name engine -p 8080:8080 operaton/operaton:2.1.5
operate ping
```

Then ask the agent in plain words, for example "make order-to-cash.bpmn deployable on Camunda 7, the payment step is an external task". Once `bpmn validate --strict` passes, ask for one test run. With the operate skill the agent runs `operate deploy order-to-cash.bpmn --start --business-key B-1`, completes waiting tasks with `operate advance --business-key B-1` and checks that the instance ends with `operate wait --business-key B-1 --until ended`. `/operate:status` gives you a read-only triage of the engine at any point.

## Proof you can open

- [Recipes of the bpmn skill](https://github.com/Miragon/bpmn-cli/blob/main/plugins/bpmn-cli/skills/bpmn/reference/recipes.md), complete sessions including a Camunda 7 external task and a Camunda 8 job worker. A test in the repo runs every recipe against the CLI.
- [Eval suite](https://github.com/Miragon/bpmn-cli/blob/main/plugins/bpmn-cli/evals/README.md) with seven cases, each run with and without the plugin. Results are not published.
- [The operate skill](https://github.com/Miragon/operate/blob/main/skills/operate/SKILL.md) with its setup, workflow commands and safety rules.
- [@miragon/bpmn-cli](https://www.npmjs.com/package/@miragon/bpmn-cli) and [@miragon/operate](https://www.npmjs.com/package/@miragon/operate) on npm.

A recorded demo of both skills on a real process application does not exist yet.

## Where it fits

Skills serve [Implement](/implement), where your team makes the model run. The `.bpmn` file comes from [Design](/design), drawn in [designIQ](/tools/design-iq), in Camunda Modeler or with [bpmn-cli](/tools/bpmn-cli), and the skill keeps that drawing. What goes on to [Execute](/execute) is a file that passes `bpmn validate --strict` and has run once on a Camunda 7, CIB seven or Operaton dev engine. There, [operate](/tools/operate) and [miragon-ai](/tools/miragon-ai/) show what runs and what is stuck. If your agent also needs your own systems next to the engine, start from the [Solution templates](/tools/solution-templates).

## Reference

- [bpmn-cli plugin README](https://github.com/Miragon/bpmn-cli/tree/main/plugins/bpmn-cli): install, what the skill does, how its version follows the CLI.
- [Using operate from AI agents](https://github.com/Miragon/operate/blob/main/docs/agents.md): the plugin, `/operate:status` and a manual `SKILL.md` install.

---
layout: home
title: Skills
description: Two Claude Code plugins that let your coding agent make a BPMN model deployable and run it once on a Camunda 7, CIB seven or Operaton dev engine.
eyebrow: { phase: Implement, link: /implement }
hero:
  name: Skills
  text: Your coding agent makes the model deployable.
  tagline: Two Claude Code plugins for the developers who make a model run. The agent sets the engine details by command and keeps your drawing, then runs one test instance on Camunda 7, CIB seven or Operaton.
  actions:
    - theme: brand
      text: Get started
      link: "#get-started"
    - theme: alt
      text: Recipes on GitHub
      link: https://github.com/Miragon/bpmn-cli/blob/main/plugins/bpmn-cli/skills/bpmn/reference/recipes.md
    - theme: alt
      text: Talk to us
      link: /#contact
artefact:
  type: terminal
  title: bpmn-cli 0.6.0 · operate 0.5.0
  lines:
    - { note: "asked to make payment.bpmn deployable, the bpmn skill runs" }
    - { cmd: "bpmn validate payment.bpmn --strict" }
    - { out: "W_C7_DEPLOY_EXTERNAL_TOPIC Activity_ChargeCard:", tone: warn }
    - { out: "serviceTask Activity_ChargeCard is an external task without", tone: warn }
    - { out: "camunda:topic; the engines refuse the file", tone: warn }
    - { out: "(`bpmn set <file> Activity_ChargeCard camunda:topic=<topic>`.)", tone: warn }
    - { cmd: "bpmn set payment.bpmn Activity_ChargeCard camunda:topic=charge" }
    - { cmd: "bpmn validate payment.bpmn --strict" }
    - { out: "valid, 0 warning(s)", tone: ok }
    - { note: "asked for one run on Operaton 2.1.5, the operate skill runs" }
    - { cmd: "operate deploy payment.bpmn --start --business-key B-1" }
    - { out: "payment.bpmn  deployed  process  Process_Payment  1" }
    - { cmd: "operate advance --business-key B-1" }
    - { cmd: "operate wait --business-key B-1 --until ended" }
    - { out: "State             COMPLETED", tone: ok }
---

## The problem

A model from Design is not yet a file the engine accepts, and a coding agent without guidance does not know which details the engine checks. An external task without a topic shows up only when the engine rejects the deployment. The agent adds such details in XML that also holds your team's drawing, and a test run means chaining REST calls and copying ids from one response into the next.

## How it works

1. You ask your agent in Claude Code in plain words, for example "make payment.bpmn deployable on Camunda 7, charging the card is an external task".
2. The `bpmn` skill changes the model through `@miragon/bpmn-cli` and addresses elements by id. The agent writes no XML, and your layout stays.
3. `bpmn validate --strict` flags what the engine would refuse (`W_C7_DEPLOY_*` for Camunda 7, CIB seven and Operaton, `W_C8_DEPLOY_*` for Camunda 8) and names the command that fixes each finding.
4. The `operate` skill deploys the file to Camunda 7, CIB seven or Operaton, starts one instance, completes what it waits for and checks that it ends. It finds the instance by business key, so the agent copies no ids from one call to the next.
5. If the instance runs into an incident, `operate wait` fails with exit code 9 and still shows where the instance stopped.

| The agent                                                      | Your team                                                         |
| -------------------------------------------------------------- | ----------------------------------------------------------------- |
| Sets the engine attributes by element id and keeps the drawing | Decides the interfaces: topics, job types, error codes            |
| Runs `bpmn validate --strict` until the file passes            | Writes the worker or delegate code that topics and job types call |
| Deploys to your dev engine and runs one instance to the end    | Reviews the change before the model goes on to Execute            |

## Get started {#get-started}

You need Claude Code. The `bpmn` skill needs Node.js 20 or later, `operate` needs Node.js 22.12 or later and a Camunda 7, CIB seven or Operaton engine. Add each marketplace and install its plugin in a Claude Code session:

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

The skills fall back to `npx` when a CLI is not on your PATH. Install both CLIs to run them yourself too. The other two lines start a local Operaton dev engine and check that operate reaches it at its default `http://localhost:8080/engine-rest`:

```sh
npm install -g @miragon/bpmn-cli @miragon/operate
docker run -d --name engine -p 8080:8080 operaton/operaton:2.1.5
operate ping
```

Then ask the agent for the change, and once `bpmn validate --strict` passes, for one test run. `/operate:status` gives you a read-only triage of the engine at any point.

To give your whole team the plugins, commit both marketplaces and plugins to your repo's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "miragon-bpmn": { "source": { "source": "github", "repo": "Miragon/bpmn-cli" } },
    "miragon": { "source": { "source": "github", "repo": "Miragon/operate" } }
  },
  "enabledPlugins": {
    "bpmn-cli@miragon-bpmn": true,
    "operate@miragon": true
  }
}
```

Claude Code does not update these plugins on its own. After a release, refresh the marketplace (`miragon-bpmn` or `miragon`) and update the plugin, or turn on auto-update for both marketplaces under `/plugin` > Marketplaces. The details are in the [bpmn-cli plugin README](https://github.com/Miragon/bpmn-cli/tree/main/plugins/bpmn-cli) and in [Using operate from AI agents](https://github.com/Miragon/operate/blob/main/docs/agents.md).

## Status

As of 2026-10-13: `bpmn-cli` 0.6.0 (released 2026-10-12) and `operate` 0.5.0 (released 2026-10-11), both public under the MIT licence. Each plugin carries the version of its CLI on npm. Both are pre-1.0, and bpmn-cli has shipped breaking changes in minor releases.

No skill writes the worker or delegate code that the topics and job types point to. Camunda 8 gets modelling and validation only, with no skill that deploys to or runs on it, and there is no DMN skill. We have not published eval results for either plugin yet. Other coding agents can use both CLIs without a skill, through the guides the CLIs print (`bpmn guide`, `operate guide`).

## Proof you can open

- [Recipes of the bpmn skill](https://github.com/Miragon/bpmn-cli/blob/main/plugins/bpmn-cli/skills/bpmn/reference/recipes.md), complete sessions including a Camunda 7 external task and a Camunda 8 job worker. A test in the repo runs every recipe against the CLI.
- [Eval suite](https://github.com/Miragon/bpmn-cli/blob/main/plugins/bpmn-cli/evals/README.md) with seven cases, each run with and without the plugin. Results are not published.
- [The operate skill](https://github.com/Miragon/operate/blob/main/skills/operate/SKILL.md) with its setup, workflow commands and safety rules.
- [@miragon/bpmn-cli](https://www.npmjs.com/package/@miragon/bpmn-cli) and [@miragon/operate](https://www.npmjs.com/package/@miragon/operate) on npm.

A recorded demo of both skills on a real process application does not exist yet.

## Where it fits

Skills serve [Implement](/implement), where your team makes the model run. The `.bpmn` file comes from [Design](/design), drawn in [designIQ](/tools/design-iq), in Camunda Modeler or with [bpmn-cli](/tools/bpmn-cli), and the skill keeps that drawing. What goes on to [Execute](/execute) is a file that passes `bpmn validate --strict` and has run once on a Camunda 7, CIB seven or Operaton dev engine. There, [operate](/tools/operate) and [Pulse](/tools/pulse/) show what runs and what is stuck. If your agent also needs your own systems next to the engine, start from the [Solution templates](/tools/solution-templates).

The whole lifecycle: [Miragon AI](/)

[Talk to us](/#contact) about setting up the skills for your team and your engines.

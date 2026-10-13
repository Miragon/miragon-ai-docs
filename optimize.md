---
title: Optimize
description: What the Optimize phase needs from your running processes and what Execute already hands over, since Miragon has no tool for Optimize yet.
---

# Optimize

In Optimize your team learns from the processes in production what to change in them, and takes those findings back into [Analyse](/analyse).

## The problem today

Cockpit shows you, one engine at a time, what is running and what is failing. Questions such as "Where do instances spend their time?" or "Did the last deployment make things worse?" usually need someone who writes PromQL against Prometheus or queries the engine's history API. When a number stands out, someone carries it by hand to the team that changes the model. There is no fixed way back from operations to the model.

## No tool yet

Miragon has no tool for Optimize today, and we say so on purpose. The lifecycle map on the [landing page](/) leaves this slot open. The analytics module in [Pulse](/tools/pulse/) stays in [Execute](/execute), because calling it the Optimize answer would promise more than it delivers.

## What this phase needs

Each role brings its own question to operations. These are the questions an Optimize tool would have to answer.

| Role            | Question                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------- |
| Product owner   | Does the new version run faster, or was it the time window?                               |
| Automation lead | Where does a case lose time, in the work itself or while waiting in front of a user task? |
| Architect       | Which paths and variants does the process take in production?                             |
| Lead developer  | What effect did the changed DMN rule have?                                                |
| Platform lead   | Which metrics do we keep, and for how long, so that comparisons span months?              |
| Head of IT      | Which change pays off first, and how do we see that it worked?                            |

## What Execute already hands over

Execute gives you raw material for some of these questions. The analytics module of Pulse ranks activities by execution time and incident rate, draws a heatmap on the BPMN diagram, and compares versions, time windows and engines, or the figures before and after a deployment. [operate](/tools/operate) runs history queries such as `operate historic-process-instance list` and returns the raw results as JSON, without KPIs.

The analytics module needs a CIB seven engine with the metrics plugin `io.miragon.mcp:cibseven-history-metrics`, which exports through Micrometer to Prometheus. The plugin exists for CIB seven only. The module looks back 30 days at most, and data from before you installed the plugin is missing. It shows no waiting times, paths or variants, no business data such as product or channel, and no run times per activity and version. Both Execute tools are pre-1.0 (Pulse v0.20.0, operate 0.5.0).

## Talk to us

We decide from real cases what to build for Optimize, if anything. If your team faces one of these questions right now, [get in touch](/#contact). We look at your process and your data with you and work out which question needs an answer first.

## Human and AI

Your team weighs the findings and decides what goes back into Analyse. An agent could turn your questions into queries and lay the numbers side by side without remodelling anything itself, but no tool for that exists yet.

## Hand-over

| Direction                | What is handed over                                                                                                                                                                                                                                                                                                                            | Format                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| From [Execute](/execute) | The raw material described above: Pulse's activity ranking, BPMN heatmap and KPI deltas, and the raw results of operate's history queries.                                                                                                                                                                                                     | JSON and chat widgets (Pulse), JSON (operate) |
| To [Analyse](/analyse)   | Findings and change requests for the model, with no fixed format yet. Your team can pin one as a todo to a BPMN element in [designIQ](/tools/design-iq). Re-uploading a changed model to [analyzr](/tools/analyzr) (alpha) creates a new revision, and only models whose facts changed are analysed again. analyzr does not read runtime data. | GitHub issues, `.bpmn` files                  |

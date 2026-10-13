<!--
  The BPM lifecycle as the site's key artefact: five phases top to bottom,
  the Miragon AI tools of each phase beside it, and the loop from Optimize
  back to Analyse. Same reading as the lifecycle diagram of the value
  proposition. Plain links, so it doubles as navigation; the data comes from
  .vitepress/lifecycle.ts. Blue carries the phases, green is the one accent
  on dark grounds: the loop and the open Optimize slot.
-->
<script setup lang="ts">
import { withBase } from "vitepress"
import { PHASES } from "../lifecycle"
</script>

<template>
  <nav class="lifecycle" aria-label="The BPM lifecycle and its tools">
    <ol>
      <li v-for="phase in PHASES" :key="phase.name" class="row">
        <a class="phase" :href="withBase(phase.link)">
          <span class="phase-name">{{ phase.name }}</span>
          <span class="phase-job">{{ phase.job }}</span>
        </a>
        <ul v-if="phase.tools.length" class="tools">
          <li v-for="tool in phase.tools" :key="tool.name">
            <a class="tool" :href="withBase(tool.link)">
              <span class="tool-name">{{ tool.name }}</span>
              <span class="tool-job">{{ tool.job }}</span>
            </a>
          </li>
        </ul>
        <a v-else class="open" :href="withBase(phase.link)">
          <span class="tool-name">No tool yet</span>
          <span class="tool-job">Bring us your case</span>
        </a>
      </li>
    </ol>
    <p class="loop-label">What you learn in Optimize feeds the next Analyse.</p>
  </nav>
</template>

<style scoped>
/* Resets and colours are scoped under .lifecycle so they also hold inside
   a Markdown page, where VitePress' .vp-doc list and link rules apply. */
.lifecycle {
  --row: 60px;
  --gap: 18px;
  --loop: var(--cd-gruen);
  padding-left: 30px;
  max-width: 520px;
  font-family: var(--vp-font-family-base);
  /* The hero centres its text on small screens; the diagram reads left. */
  text-align: left;
}
/* Green is too light on white (1.67:1): on light grounds the loop and the
   open slot are blue. The landing is always dark. */
:root:not(.dark):not(:has(.VPHome)) .lifecycle {
  --loop: var(--cd-blau);
}

.lifecycle :is(ol, ul) {
  list-style: none;
  margin: 0;
  padding: 0;
}
.lifecycle li {
  margin: 0;
}
.lifecycle a {
  font-weight: inherit;
  text-decoration: none;
  color: inherit;
}

.lifecycle ol {
  display: grid;
  gap: var(--gap);
}

.row {
  position: relative;
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 12px;
  align-items: stretch;
}

/* Phases: CI blue surfaces with a white label (5.47:1). */
.lifecycle .phase {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: var(--row);
  padding: 6px 12px;
  border-radius: var(--cd-radius-sm);
  background: var(--cd-blau);
  color: var(--cd-weiss);
  transition: background-color var(--cd-motion-fast) var(--cd-ease);
}
.lifecycle .phase:hover,
.lifecycle .phase:focus-visible {
  background: var(--cd-blau-link);
  color: var(--cd-weiss);
}
.phase-name {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
}
.phase-job {
  font-size: 12px;
  line-height: 1.35;
  opacity: 0.9;
}
/* Sequence flow to the next phase: a line with an arrowhead in the gap. */
.row:not(:last-child) .phase::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 100%;
  width: 2px;
  height: calc(var(--gap) - 5px);
  background: var(--vp-c-text-3);
  transform: translateX(-50%);
}
.row:not(:last-child) .phase::before {
  content: "";
  position: absolute;
  left: 50%;
  top: calc(100% + var(--gap) - 6px);
  border: 5px solid transparent;
  border-top: 6px solid var(--vp-c-text-3);
  border-bottom: 0;
  transform: translateX(-50%);
}

.tools {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tools li {
  display: flex;
  flex: 1 1 140px;
  min-width: 0;
}
.tools .tool {
  flex: 1;
}
.tool,
.open {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: var(--row);
  padding: 8px 12px;
  border-radius: var(--cd-radius-sm);
}
/* --cd-kontur is the CI's outline role (at least 3:1 on both grounds). */
.tool {
  border: 1px solid var(--cd-kontur);
  background: var(--vp-c-bg-soft);
  transition: border-color var(--cd-motion-fast) var(--cd-ease);
}
.tool:hover,
.tool:focus-visible,
.open:hover,
.open:focus-visible {
  border-color: var(--vp-c-brand-1);
}
/* The open Optimize slot: a dashed outline, nothing inside. */
.open {
  border: 2px dashed var(--loop);
}
.tool-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}
.tool-job {
  font-size: 12px;
  line-height: 1.35;
  color: var(--vp-c-text-2);
}

/* The loop from the middle of Optimize back into the middle of Analyse,
   drawn in the 30px gutter. Each row draws its own stretch of the line (and
   the gap above it), so the ends sit on the rows' middles at any row
   height: Analyse turns in with the arrowhead, Optimize turns out. */
.row::before {
  content: "";
  position: absolute;
  left: -22px;
  width: 22px;
  top: calc(var(--gap) * -1);
  bottom: 0;
  border-left: 2px solid var(--loop);
}
.row:first-child::before {
  top: calc(50% - 1px);
  border-top: 2px solid var(--loop);
  border-top-left-radius: var(--cd-radius-sm);
}
.row:last-child::before {
  bottom: calc(50% - 1px);
  border-bottom: 2px solid var(--loop);
  border-bottom-left-radius: var(--cd-radius-sm);
}
.row:first-child::after {
  content: "";
  position: absolute;
  left: -6px;
  top: calc(50% - 5px);
  border: 5px solid transparent;
  border-left: 6px solid var(--loop);
  border-right: 0;
}
.loop-label {
  margin: 12px 0 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--vp-c-text-2);
}

.lifecycle a:focus-visible {
  outline: 2px solid var(--cd-blau-hell);
  outline-offset: 2px;
}

@media (max-width: 420px) {
  .row {
    grid-template-columns: 104px minmax(0, 1fr);
  }
  .phase-job {
    display: none;
  }
}
</style>

<!--
  A terminal session as a tool page's hero artefact: the real commands and
  the real shape of their output, so the page starts with the tool itself.
  Lines come from the page's frontmatter (artefact.lines), each either a
  command (`cmd`, shown after a prompt), the continuation of a multi-line
  command (`cont`), output (`out`) or a comment (`note`). `tone` colours
  output: ok, warn, err or dim. Long lines wrap like in a real terminal, so
  real output never needs rewording to fit.
-->
<script setup lang="ts">
import { onMounted, ref } from "vue"

export interface TerminalLine {
  cmd?: string
  cont?: string
  out?: string
  note?: string
  tone?: "ok" | "warn" | "err" | "dim"
}

defineProps<{ title?: string; lines: TerminalLine[] }>()

const shown = ref(false)
onMounted(() => requestAnimationFrame(() => (shown.value = true)))
</script>

<template>
  <figure class="term" :class="{ shown }">
    <div class="bar">
      <span class="dots" aria-hidden="true"><i /><i /><i /></span>
      <span class="title">{{ title ?? "terminal" }}</span>
    </div>
    <div class="body" tabindex="0" role="group" :aria-label="`${title ?? 'terminal'} session`">
      <code
        v-for="(line, i) in lines"
        :key="i"
        class="line"
        :class="[
          line.tone,
          {
            cmd: line.cmd !== undefined || line.cont !== undefined,
            note: line.note !== undefined,
          },
        ]"
        :style="{ '--i': i }"
        ><template v-if="line.cmd !== undefined"
          ><span class="prompt" aria-hidden="true">$ </span>{{ line.cmd }}</template
        ><template v-else-if="line.cont !== undefined">{{ line.cont }}</template
        ><template v-else-if="line.note !== undefined"># {{ line.note }}</template
        ><template v-else>{{ line.out || " " }}</template></code
      >
    </div>
  </figure>
</template>

<style scoped>
.term {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  border: 1px solid var(--cd-kontur);
  border-radius: var(--cd-radius-md);
  background: var(--vp-c-bg-alt);
  overflow: hidden;
  text-align: left;
  box-shadow: var(--cd-shadow-3);
}

.bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.dots {
  display: inline-flex;
  gap: 6px;
}
.dots i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--vp-c-gray-1);
}
.title {
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  color: var(--vp-c-text-2);
}

.body {
  margin: 0;
  padding: 16px 18px 18px;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  background: transparent;
}
.body:focus-visible {
  outline: 2px solid var(--cd-blau-hell);
  outline-offset: -2px;
}
.line {
  display: block;
  min-height: 1.65em;
  /* Wrap long lines like a terminal does; the hanging indent keeps a wrapped
     line visibly one line. */
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  padding-left: 2ch;
  text-indent: -2ch;
  font: inherit;
  background: none;
  opacity: 0;
  transition: opacity 0.35s ease;
  transition-delay: calc(var(--i) * 0.12s + 0.1s);
}
.shown .line {
  opacity: 1;
}
.line.cmd {
  color: var(--vp-c-text-1);
}
.prompt {
  color: var(--vp-c-brand-1);
}
.line.note,
.line.dim {
  color: var(--vp-c-text-3);
}
/* Status colours on dark grounds (the CI's light variants for black). */
.line.ok {
  color: var(--cd-success-hell);
}
.line.warn {
  color: var(--cd-warning-hell);
}
.line.err {
  color: var(--cd-danger-hell);
}

@media (prefers-reduced-motion: reduce) {
  .line {
    transition: none;
  }
}
</style>

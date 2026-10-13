<!--
  A small line above a tool landing page's hero name that places the tool:
  "Miragon AI · Execute", the phase linking to its page. Set by the page's
  frontmatter `eyebrow: { phase, link }`; pages without it show nothing.
-->
<script setup lang="ts">
import { computed } from "vue"
import { useData, withBase } from "vitepress"

const { frontmatter } = useData()
const eyebrow = computed(
  () => frontmatter.value.eyebrow as { phase: string; link: string } | undefined,
)
</script>

<template>
  <p v-if="eyebrow" class="eyebrow">
    <span>Miragon AI</span>
    <span class="sep" aria-hidden="true">·</span>
    <a :href="withBase(eyebrow.link)">{{ eyebrow.phase }}</a>
  </p>
</template>

<style scoped>
.eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 18px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}
/* Below 960px VitePress centres the hero text (text-align), which a flex row
   does not follow: centre it with the name and headline. */
@media (max-width: 959px) {
  .eyebrow {
    justify-content: center;
  }
}
.sep {
  color: var(--vp-c-text-3);
}
.eyebrow a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.eyebrow a:hover {
  text-decoration: underline;
}
</style>

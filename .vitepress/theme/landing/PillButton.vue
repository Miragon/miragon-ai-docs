<!--
  The miragon.io button: a pill with the label and a green circle carrying
  an arrow. `dark` on light grounds, `light` on dark or blue grounds,
  `outline` as the quieter second action.
-->
<script setup lang="ts">
import { withBase } from "vitepress"
import Icon from "./Icon.vue"

const props = withDefaults(
  defineProps<{ href: string; label: string; variant?: "dark" | "light" | "outline" }>(),
  { variant: "dark" },
)
const external = /^https?:\/\//.test(props.href)
</script>

<template>
  <a
    class="pill"
    :class="variant"
    :href="external ? href : withBase(href)"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener' : undefined"
  >
    <span class="label">{{ label }}</span>
    <span class="circle"><Icon name="arrow" :size="18" /></span>
  </a>
</template>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 5px 5px 5px 24px;
  border: 1px solid transparent;
  border-radius: var(--cd-radius-pill);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color var(--cd-motion-base) var(--cd-ease),
    border-color var(--cd-motion-base) var(--cd-ease),
    color var(--cd-motion-base) var(--cd-ease);
}
.circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--cd-gruen);
  color: var(--cd-schwarz);
  transition: transform var(--cd-motion-base) var(--cd-ease);
}
.pill:hover .circle {
  transform: translateX(3px);
}
.pill:focus-visible {
  outline: 2px solid var(--cd-blau-hell);
  outline-offset: 3px;
}
.dark {
  background: var(--cd-schwarz);
  color: var(--cd-weiss);
}
.dark:hover {
  background: var(--cd-blau);
}
.light {
  background: var(--cd-weiss);
  color: var(--cd-schwarz);
}
.light:hover {
  background: var(--cd-gruen);
}
.light:hover .circle {
  background: var(--cd-schwarz);
  color: var(--cd-weiss);
}
.outline {
  border-color: var(--l-card-border);
  background: transparent;
  color: var(--l-text);
}
.outline .circle {
  background: var(--l-tile-muted-bg);
  color: var(--l-text);
}
.outline:hover {
  border-color: var(--cd-gruen);
  background: var(--cd-gruen);
  color: var(--cd-schwarz);
}
</style>

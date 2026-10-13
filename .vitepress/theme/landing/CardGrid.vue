<!--
  Cards as on miragon.io: rounded, a light ground that lifts on hover, an
  optional icon tile, a title, a sentence or two and an optional link. A
  card with `link` is one link as a whole. Items:
  { icon?, eyebrow?, title, text?, link?, linkText? }; `icon` is a key of
  landing/Icon.vue, `eyebrow` a small label above the title (a phase, a
  version). External links open in a new tab.
-->
<script setup lang="ts">
import { withBase } from "vitepress"
import Icon from "./Icon.vue"

withDefaults(
  defineProps<{
    items: {
      icon?: string
      eyebrow?: string
      title: string
      text?: string
      link?: string
      linkText?: string
    }[]
    columns?: 2 | 3 | 4
    center?: boolean
  }>(),
  { columns: 3, center: false },
)

const isExternal = (link: string) => /^https?:\/\//.test(link)
const href = (link: string) => (isExternal(link) ? link : withBase(link))
</script>

<template>
  <ul class="cards" :class="[`cols-${columns}`, { center }]">
    <li v-for="item in items" :key="item.title">
      <component
        :is="item.link ? 'a' : 'div'"
        class="card"
        :class="{ linked: item.link }"
        :href="item.link ? href(item.link) : undefined"
        :target="item.link && isExternal(item.link) ? '_blank' : undefined"
        :rel="item.link && isExternal(item.link) ? 'noopener' : undefined"
      >
        <span v-if="item.icon" class="tile"><Icon :name="item.icon" /></span>
        <span v-if="item.eyebrow" class="eyebrow">{{ item.eyebrow }}</span>
        <span class="title">{{ item.title }}</span>
        <span v-if="item.text" class="text">{{ item.text }}</span>
        <span v-if="item.link" class="more">
          {{ item.linkText ?? (isExternal(item.link) ? "Open" : "Learn more") }}
          <Icon :name="isExternal(item.link) ? 'external' : 'arrow'" :size="15" />
        </span>
      </component>
    </li>
  </ul>
</template>

<style scoped>
.cards {
  display: grid;
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}
@media (min-width: 768px) {
  .cols-2,
  .cols-3,
  .cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
.cards li {
  display: flex;
  margin: 0;
}
.card {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 28px;
  border: 1px solid var(--l-card-border);
  border-radius: 24px;
  background: var(--l-card-bg);
  color: var(--l-text);
  /* A linked card is an <a> inside .vp-doc: reset its link weight. */
  font-weight: 400;
  text-decoration: none;
  transition:
    transform var(--cd-motion-base) var(--cd-ease),
    box-shadow var(--cd-motion-base) var(--cd-ease),
    border-color var(--cd-motion-base) var(--cd-ease);
}
.card.linked:hover {
  transform: translateY(-4px);
  border-color: var(--l-border-strong);
  box-shadow: var(--cd-shadow-3);
}
.card.linked:focus-visible {
  outline: 2px solid var(--cd-blau-hell);
  outline-offset: 2px;
}
.center .card {
  align-items: center;
  text-align: center;
}
.tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  border-radius: 10px;
  background: var(--l-tile-bg);
  color: var(--l-tile-fg);
}
.eyebrow {
  margin-bottom: 6px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--l-text-muted);
}
.title {
  font-size: 19px;
  font-weight: 600;
  line-height: 1.35;
}
.text {
  margin-top: 8px;
  font-size: 15.5px;
  line-height: 1.6;
  color: var(--l-text-muted);
}
.more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 20px;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--l-link);
}
</style>

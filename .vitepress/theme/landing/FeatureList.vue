<!--
  An icon list as on miragon.io ("Das Problem"): each item an icon tile, a
  short title and one or two sentences. One column next to other content,
  two or three columns on its own. Items: { icon, title, text }; `icon` is a
  key of landing/Icon.vue.
-->
<script setup lang="ts">
import Icon from "./Icon.vue"

withDefaults(
  defineProps<{
    items: { icon?: string; title: string; text?: string }[]
    columns?: 1 | 2 | 3
  }>(),
  { columns: 2 },
)
</script>

<template>
  <ul class="features" :class="`cols-${columns}`">
    <li v-for="item in items" :key="item.title" class="item">
      <span v-if="item.icon" class="tile"><Icon :name="item.icon" /></span>
      <div>
        <h3 class="title">{{ item.title }}</h3>
        <p v-if="item.text" class="text">{{ item.text }}</p>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.features {
  display: grid;
  gap: 28px 40px;
  margin: 0;
  padding: 0;
  list-style: none;
}
@media (min-width: 768px) {
  .cols-2,
  .cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.features .item {
  display: flex;
  gap: 16px;
  margin: 0;
}
.tile {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: var(--l-tile-bg);
  color: var(--l-tile-fg);
}
.features .title {
  margin: 2px 0 4px;
  padding: 0;
  border: 0;
  font-size: 19px;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: normal;
  color: var(--l-text);
}
.features .text {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.6;
  color: var(--l-text-muted);
}
</style>

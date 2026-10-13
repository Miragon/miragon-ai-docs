<!--
  Numbered steps as on miragon.io ("So arbeiten wir"): a blue circle with
  the number, a short title and one or two sentences, side by side on wide
  screens. Two to four steps. Items: { title, text }.
-->
<script setup lang="ts">
defineProps<{ items: { title: string; text?: string }[] }>()
</script>

<template>
  <ol class="steps" :style="{ '--n': items.length }">
    <li v-for="(item, i) in items" :key="item.title" class="step">
      <span class="num" aria-hidden="true">{{ i + 1 }}</span>
      <h3 class="title">{{ item.title }}</h3>
      <p v-if="item.text" class="text">{{ item.text }}</p>
    </li>
  </ol>
</template>

<style scoped>
.steps {
  display: grid;
  gap: 36px 28px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: none;
}
@media (min-width: 768px) {
  .steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .steps {
    grid-template-columns: repeat(var(--n), minmax(0, 1fr));
  }
}
.steps .step {
  margin: 0;
  text-align: center;
}
.num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
  border-radius: 50%;
  background: var(--cd-blau);
  color: var(--cd-weiss);
  font-size: 20px;
  font-weight: 700;
}
.steps .title {
  margin: 0 0 8px;
  padding: 0;
  border: 0;
  font-size: 19px;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: normal;
  color: var(--l-text);
}
.steps .text {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.6;
  color: var(--l-text-muted);
}
</style>

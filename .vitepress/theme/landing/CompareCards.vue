<!--
  Today against with the tool, as two cards side by side: the left card
  muted with a cross per line, the right one in the accent with a check.
  Lines stay short and concrete; each pair should be about the same thing.
  Props: before { title, items: string[] }, after { title, items: string[] }.
-->
<script setup lang="ts">
import Icon from "./Icon.vue"

defineProps<{
  before: { title: string; items: string[] }
  after: { title: string; items: string[] }
}>()
</script>

<template>
  <div class="compare">
    <div class="side before">
      <p class="label">{{ before.title }}</p>
      <ul>
        <li v-for="line in before.items" :key="line">
          <span class="mark"><Icon name="x" :size="16" :stroke="2.5" /></span>{{ line }}
        </li>
      </ul>
    </div>
    <div class="side after">
      <p class="label">{{ after.title }}</p>
      <ul>
        <li v-for="line in after.items" :key="line">
          <span class="mark"><Icon name="check" :size="16" :stroke="2.5" /></span>{{ line }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.compare {
  display: grid;
  gap: 20px;
}
@media (min-width: 768px) {
  .compare {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.side {
  padding: 28px;
  border: 1px solid var(--l-card-border);
  border-radius: 24px;
  background: var(--l-card-bg);
}
.after {
  border-color: var(--cd-blau);
  box-shadow: inset 0 0 0 1px var(--cd-blau);
}
.label {
  margin: 0 0 16px;
  font-size: 15px;
  font-weight: 700;
  color: var(--l-text-muted);
}
.after .label {
  color: var(--l-accent);
}
.compare ul {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.compare li {
  display: flex;
  gap: 12px;
  margin: 0;
  font-size: 15.5px;
  line-height: 1.55;
  color: var(--l-text);
}
.mark {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-top: 1px;
  border-radius: 50%;
}
.before .mark {
  background: var(--l-tile-muted-bg);
  color: var(--l-text-muted);
}
.after .mark {
  background: var(--cd-gruen);
  color: var(--cd-schwarz);
}
</style>

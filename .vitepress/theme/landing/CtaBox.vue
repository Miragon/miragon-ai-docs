<!--
  The closing call to action of a landing page, as on miragon.io: a dark,
  strongly rounded box with a headline, one sentence, a pill button and a
  quiet note below it. Props: title, text, label, href, note.
-->
<script setup lang="ts">
import PillButton from "./PillButton.vue"

withDefaults(
  defineProps<{ title: string; text?: string; label?: string; href?: string; note?: string }>(),
  { label: "Talk to us", href: "/#contact" },
)
</script>

<template>
  <div class="cta-wrap">
    <div class="cta">
      <h2 class="title">{{ title }}</h2>
      <p v-if="text" class="text">{{ text }}</p>
      <PillButton :href="href" :label="label" variant="light" />
      <p v-if="note" class="note">{{ note }}</p>
    </div>
  </div>
</template>

<style scoped>
.cta-wrap {
  margin-left: var(--vp-offset, calc(50% - 50vw));
  margin-right: var(--vp-offset, calc(50% - 50vw));
  padding: 56px 24px;
  background: var(--l-band-plain);
}
@media (min-width: 768px) {
  .cta-wrap {
    padding: 80px 48px;
  }
}
.cta {
  max-width: 1152px;
  margin: 0 auto;
  padding: 56px 28px;
  border-radius: 40px;
  background: var(--l-cta-bg);
  text-align: center;
}
@media (min-width: 768px) {
  .cta {
    padding: 72px 64px;
  }
}
.cta .title {
  max-width: 720px;
  margin: 0 auto;
  padding: 0;
  border: 0;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.015em;
  text-wrap: balance;
  color: var(--cd-weiss);
}
.cta .text {
  max-width: 640px;
  margin: 16px auto 28px;
  font-size: 17px;
  line-height: 1.6;
  color: color-mix(in srgb, var(--cd-weiss) 92%, transparent);
}
.cta .note {
  margin: 16px 0 0;
  font-size: 13px;
  color: color-mix(in srgb, var(--cd-weiss) 86%, transparent);
}
</style>

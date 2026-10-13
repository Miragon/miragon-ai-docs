<!--
  A full-width band of a landing page, as on miragon.io: an optional eyebrow
  (small, bold, accent colour), a title, an intro and the content (Markdown
  or components in the slot). Bands alternate `plain` and `tint`; `dark` is
  for one emphasised band. `align="center"` centres the header, as for step
  and card sections; content stays in a 1152px container.
-->
<script setup lang="ts">
withDefaults(
  defineProps<{
    id?: string
    eyebrow?: string
    title?: string
    intro?: string
    tone?: "plain" | "tint" | "dark"
    align?: "left" | "center"
  }>(),
  { tone: "plain", align: "left" },
)
</script>

<template>
  <section :id="id" class="page-section" :class="[`tone-${tone}`, `align-${align}`]">
    <div class="inner">
      <header v-if="eyebrow || title || intro" class="head">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 v-if="title" class="title">{{ title }}</h2>
        <p v-if="intro" class="intro">{{ intro }}</p>
      </header>
      <div class="content">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Full width inside VitePress' home content container (--vp-offset is the
   distance to the viewport edge, set by VPHomeContent). */
.page-section {
  margin-left: var(--vp-offset, calc(50% - 50vw));
  margin-right: var(--vp-offset, calc(50% - 50vw));
  padding: 56px 24px;
  background: var(--l-band-plain);
  color: var(--l-text);
  scroll-margin-top: var(--vp-nav-height);
}
@media (min-width: 768px) {
  .page-section {
    padding: 80px 48px;
  }
}
.tone-tint {
  background: var(--l-band-tint);
}
.tone-dark {
  background: var(--l-band-dark);
  --l-text: var(--cd-weiss);
  --l-text-muted: color-mix(in srgb, var(--cd-weiss) 75%, transparent);
  --l-accent: var(--cd-gruen);
}

.inner {
  max-width: 1152px;
  margin: 0 auto;
}

.head {
  max-width: 760px;
  margin-bottom: 40px;
}
.align-center .head {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
.head:last-child {
  margin-bottom: 0;
}

/* Reset the .vp-doc heading rules (border, margins) for the band header. */
.page-section .eyebrow {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--l-accent);
}
.page-section .title {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.015em;
  text-wrap: balance;
  color: var(--l-text);
}
@media (min-width: 768px) {
  .page-section .title {
    font-size: 32px;
  }
}
.page-section .intro {
  margin: 20px 0 0;
  font-size: 17px;
  line-height: 1.6;
  color: var(--l-text-muted);
}

/* Markdown in the slot keeps the doc styles, at a readable measure.
   Markdown output has no class; the components' own lists keep the full
   width. */
.content > :deep(:is(p, ul, ol, blockquote, h3, h4):not([class])) {
  max-width: 760px;
}
.align-center .content > :deep(:is(p, h3, h4):not([class])) {
  margin-left: auto;
  margin-right: auto;
}
.content > :deep(:first-child) {
  margin-top: 0;
}
.content > :deep(:last-child) {
  margin-bottom: 0;
}
.content :deep(h3) {
  border: 0;
  padding: 0;
}
</style>

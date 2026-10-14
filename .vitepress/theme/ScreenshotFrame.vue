<!--
  A screenshot of the real product as a tool page's hero artefact, in a
  plain browser frame with the address it was taken from. Data comes from
  the page's frontmatter (artefact.src, alt, url, caption). Images live in
  public/screens/. The hero column is narrow, so the image links to its full
  size.
-->
<script setup lang="ts">
import { withBase } from "vitepress"

defineProps<{ src: string; alt: string; url?: string; caption?: string }>()
</script>

<template>
  <figure class="shot">
    <div class="frame">
      <div class="bar">
        <span class="dots" aria-hidden="true"><i /><i /><i /></span>
        <span v-if="url" class="url">{{ url }}</span>
      </div>
      <a class="zoom" :href="withBase(src)" target="_blank" rel="noopener">
        <img :src="withBase(src)" :alt="alt" loading="eager" decoding="async" />
        <span class="hint">Open full size ↗</span>
      </a>
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.shot {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  text-align: left;
}
.frame {
  border: 1px solid var(--cd-kontur);
  border-radius: var(--cd-radius-md);
  background: var(--vp-c-bg-alt);
  overflow: hidden;
  box-shadow: var(--cd-shadow-3);
}
.bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 14px;
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
.url {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  color: var(--vp-c-text-2);
}
.zoom {
  position: relative;
  display: block;
}
img {
  display: block;
  width: 100%;
  height: auto;
}
.hint {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 4px 10px;
  border-radius: var(--cd-radius-pill);
  background: var(--cd-schwarz);
  color: var(--cd-weiss);
  font-size: 12px;
  opacity: 0;
  transition: opacity var(--cd-motion-fast) var(--cd-ease);
}
.zoom:hover .hint,
.zoom:focus-visible .hint {
  opacity: 1;
}
.zoom:focus-visible {
  outline: 2px solid var(--cd-blau-hell);
  outline-offset: -2px;
}
figcaption {
  margin-top: 10px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
</style>

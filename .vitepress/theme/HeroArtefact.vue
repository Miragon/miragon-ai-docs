<!--
  The hero image of every page with the home layout: the landing shows the
  lifecycle; a tool's landing page shows its own artefact, picked by the
  page's frontmatter:
    artefact: { type: chat }                                   Pulse's chat
    artefact: { type: terminal, title, lines: [...] }          TerminalWindow
    artefact: { type: screenshot, src, alt, url, caption }     ScreenshotFrame
  Without `artefact` the lifecycle graphic renders.
-->
<script setup lang="ts">
import { computed } from "vue"
import { useData } from "vitepress"
import LifecycleMap from "./LifecycleMap.vue"
import PulseChat from "./PulseChat.vue"
import TerminalWindow from "./TerminalWindow.vue"
import ScreenshotFrame from "./ScreenshotFrame.vue"

const { frontmatter } = useData()
const artefact = computed(() => frontmatter.value.artefact ?? { type: "lifecycle" })
</script>

<template>
  <PulseChat v-if="artefact.type === 'chat'" />
  <TerminalWindow
    v-else-if="artefact.type === 'terminal'"
    :title="artefact.title"
    :lines="artefact.lines ?? []"
  />
  <ScreenshotFrame
    v-else-if="artefact.type === 'screenshot'"
    :src="artefact.src"
    :alt="artefact.alt"
    :url="artefact.url"
    :caption="artefact.caption"
  />
  <LifecycleMap v-else />
</template>

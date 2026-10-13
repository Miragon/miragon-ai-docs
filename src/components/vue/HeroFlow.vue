<!-- The landing's hero artefact: a tiny BPMN process (start, service task
     "Agent", user task "Your team", end) with a token cycling through the
     examples. Scaffold: an empty box. -->
<script setup lang="ts">
export interface FlowExample {
  tool: string
  phase: string
  link: string
  agent: string
  detail: string
  team: string
}

defineProps<{ examples: FlowExample[] }>()
</script>

<template>
  <div class="hero-flow"></div>
</template>

<!--
  The landing hero's artefact: the headline as a tiny BPMN process. A start
  event, a service task the agent works ("Agent"), a user task your team
  decides ("Your team") and an end event. A token runs through it, the way
  a BPMN token simulation shows one, and each run carries another real
  example from the tools (frontmatter `artefact.examples`). The dots below
  pick an example. With prefers-reduced-motion the process stands still on
  the first example; off screen or in a hidden tab it pauses.

  An island (client:visible in hero/HeroArtefact.astro): Astro renders the
  first example with all its text, the browser hydrates it and starts the
  token. The task markers are Lucide's cog, user and check icons, inlined.
-->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"

export interface FlowExample {
  tool: string
  phase: string
  link: string
  agent: string
  detail: string
  team: string
}

const props = defineProps<{ examples: FlowExample[] }>()

/** The token's stops: start, flow, agent, flow, team, flow, end (ms each). */
const STOPS = [
  { at: "start", ms: 700 },
  { at: "flow-1", ms: 450 },
  { at: "agent", ms: 2600 },
  { at: "flow-2", ms: 450 },
  { at: "team", ms: 2200 },
  { at: "flow-3", ms: 450 },
  { at: "end", ms: 1100 },
] as const
type Stop = (typeof STOPS)[number]["at"]

const index = ref(0)
const stop = ref<number>(STOPS.length - 1)
const animated = ref(false)
const example = computed(() => props.examples[index.value] ?? props.examples[0])
const at = computed<Stop>(() => STOPS[stop.value].at)
/** Before the token reaches a task its text is hidden; static mode shows all. */
const reached = (s: Stop) => !animated.value || stop.value >= STOPS.findIndex((x) => x.at === s)

const root = ref<HTMLElement>()
let timer: ReturnType<typeof setTimeout> | undefined
let visible = false

function schedule() {
  clearTimeout(timer)
  if (!animated.value || !visible || document.hidden) return
  timer = setTimeout(advance, STOPS[stop.value].ms)
}
function advance() {
  if (stop.value < STOPS.length - 1) {
    stop.value++
  } else {
    index.value = (index.value + 1) % props.examples.length
    stop.value = 0
  }
  schedule()
}
function pick(i: number) {
  index.value = i
  stop.value = animated.value ? 0 : STOPS.length - 1
  schedule()
}

let observer: IntersectionObserver | undefined
const onVisibility = () => schedule()

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  animated.value = true
  stop.value = 0
  observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    schedule()
  })
  if (root.value) observer.observe(root.value)
  document.addEventListener("visibilitychange", onVisibility)
})
onBeforeUnmount(() => {
  clearTimeout(timer)
  observer?.disconnect()
  document.removeEventListener("visibilitychange", onVisibility)
})
</script>

<template>
  <figure ref="root" class="flow" :class="{ animated }">
    <div
      class="process"
      role="img"
      :aria-label="`${example.tool}: the agent ${example.agent}, ${example.detail}. Your team: ${example.team}.`"
    >
      <span class="event start" :class="{ on: at === 'start' }"><i class="token" /></span>
      <span class="seq" :class="{ on: at === 'flow-1' }" />
      <div class="task" :class="{ on: at === 'agent' }">
        <span class="marker" aria-hidden="true" title="Service task">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M11 10.27 7 3.34" />
            <path d="m11 13.73-4 6.93" />
            <path d="M12 22v-2" />
            <path d="M12 2v2" />
            <path d="M14 12h8" />
            <path d="m17 20.66-1-1.73" />
            <path d="m17 3.34-1 1.73" />
            <path d="M2 12h2" />
            <path d="m20.66 17-1.73-1" />
            <path d="m20.66 7-1.73 1" />
            <path d="m3.34 17 1.73-1" />
            <path d="m3.34 7 1.73 1" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="12" r="8" />
          </svg>
        </span>
        <span class="who">Agent</span>
        <Transition name="swap" mode="out-in">
          <span :key="`a${index}`" class="text" :class="{ shown: reached('agent') }">
            <span class="act">{{ example.agent }}</span>
            <span class="detail">{{ example.detail }}</span>
          </span>
        </Transition>
        <i class="token" />
      </div>
      <span class="seq" :class="{ on: at === 'flow-2' }" />
      <div class="task" :class="{ on: at === 'team' }">
        <span class="marker" aria-hidden="true" title="User task">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <span class="who">Your team</span>
        <Transition name="swap" mode="out-in">
          <span :key="`t${index}`" class="decision" :class="{ shown: reached('team') }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {{ example.team }}
          </span>
        </Transition>
        <i class="token" />
      </div>
      <span class="seq" :class="{ on: at === 'flow-3' }" />
      <span class="event end" :class="{ on: at === 'end' }"><i class="token" /></span>
    </div>
    <figcaption class="caption">
      <a class="tool" :href="example.link">{{ example.tool }}</a>
      <span class="phase">· {{ example.phase }}</span>
      <span class="dots">
        <button
          v-for="(e, i) in examples"
          :key="e.tool"
          type="button"
          :class="{ active: i === index }"
          :aria-label="`Show the ${e.tool} example`"
          :aria-pressed="i === index"
          @click="pick(i)"
        />
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.flow {
  --flow-line: color-mix(in srgb, var(--cd-weiss) 38%, transparent);
  --flow-on: var(--cd-gruen);
  width: 100%;
  max-width: 580px;
  margin: 0 auto;
  font-family: var(--site-font);
  text-align: left;
}

.process {
  display: flex;
  align-items: stretch;
}
.process > .event,
.process > .seq {
  align-self: center;
}

/* Events: start thin, end thick, as in BPMN. */
.event {
  position: relative;
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid var(--flow-line);
  transition: border-color var(--cd-motion-base) var(--cd-ease);
}
.event.end {
  border-width: 4px;
}
.event.on {
  border-color: var(--flow-on);
}

/* Sequence flows with an arrowhead; the active one carries moving dashes. */
.seq {
  position: relative;
  flex: 1 1 14px;
  min-width: 14px;
  max-width: 34px;
  height: 2px;
  margin-right: 6px;
  background: var(--flow-line);
}
.seq::after {
  content: "";
  position: absolute;
  right: -6px;
  top: -4px;
  border: 5px solid transparent;
  border-left: 6px solid var(--flow-line);
  border-right: 0;
}
.seq.on {
  background: repeating-linear-gradient(90deg, var(--flow-on) 0 6px, transparent 6px 10px);
  background-size: 20px 2px;
  animation: flow-dash 0.45s linear infinite;
}
.seq.on::after {
  border-left-color: var(--flow-on);
}
@keyframes flow-dash {
  to {
    background-position: 20px 0;
  }
}

/* Tasks: rounded rectangles with the BPMN type marker top left. */
.task {
  position: relative;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-width: 0;
  min-height: 132px;
  padding: 34px 16px 16px;
  border: 1.5px solid var(--flow-line);
  border-radius: var(--cd-radius-md);
  background: color-mix(in srgb, var(--cd-weiss) 4%, transparent);
  transition: border-color var(--cd-motion-base) var(--cd-ease);
}
.task.on {
  border-color: var(--flow-on);
}
.marker {
  position: absolute;
  top: 9px;
  left: 10px;
  width: 15px;
  height: 15px;
  color: var(--site-text-2);
}
/* A block, so the icon fills its 15px box instead of sitting on a text
   baseline. */
.marker svg {
  display: block;
}
.who {
  position: absolute;
  top: 8px;
  left: 31px;
  font-family: var(--site-font-mono);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--site-text-2);
}
.text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.act {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--site-text-1);
}
.detail {
  font-size: 13px;
  line-height: 1.4;
  color: var(--site-text-2);
}
.decision {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  padding: 5px 11px 5px 8px;
  border-radius: var(--cd-radius-pill);
  background: var(--cd-gruen);
  color: var(--cd-schwarz);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
}

/* Text appears when the token arrives. */
.animated .text,
.animated .decision {
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 0.35s var(--cd-ease),
    transform 0.35s var(--cd-ease);
}
.animated .text.shown,
.animated .decision.shown {
  opacity: 1;
  transform: none;
}
.swap-enter-from,
.swap-leave-to {
  opacity: 0;
}
.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.25s var(--cd-ease);
}

/* The token: a green dot on the element it is in. */
.token {
  display: none;
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--flow-on);
}
.animated .on > .token {
  display: block;
}
.event > .token {
  top: 6px;
  left: 6px;
}
.event.end > .token {
  top: 4px;
  left: 4px;
}
.task > .token {
  top: -6px;
  right: 14px;
}

.caption {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 18px;
  font-size: 13px;
  color: var(--site-text-2);
}
.caption .tool {
  font-weight: 600;
  color: var(--site-text-1);
  text-decoration: none;
}
.caption .tool:hover {
  color: var(--site-accent);
}
.dots {
  display: inline-flex;
  gap: 8px;
  margin-left: auto;
}
.dots button {
  width: 8px;
  height: 8px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--flow-line);
  cursor: pointer;
}
.dots button.active {
  background: var(--flow-on);
}
.dots button:focus-visible,
.caption .tool:focus-visible {
  outline: 2px solid var(--cd-blau-hell);
  outline-offset: 3px;
}

/* Phones: the process runs top to bottom. */
@media (max-width: 560px) {
  .process {
    flex-direction: column;
    align-items: stretch;
  }
  .event {
    align-self: center;
  }
  .seq {
    align-self: center;
    flex: none;
    width: 2px;
    min-width: 0;
    height: 16px;
    margin: 0 0 6px;
  }
  .seq::after {
    right: -4px;
    top: auto;
    bottom: -6px;
    border: 5px solid transparent;
    border-top: 6px solid var(--flow-line);
    border-bottom: 0;
  }
  .seq.on::after {
    border-top-color: var(--flow-on);
  }
  .seq.on {
    background: repeating-linear-gradient(180deg, var(--flow-on) 0 6px, transparent 6px 10px);
    background-size: 2px 20px;
    animation-name: flow-dash-down;
  }
  /* In a column, flex-basis 0 would collapse the tasks to nothing. */
  .task {
    flex: none;
    min-height: 0;
  }
}
@keyframes flow-dash-down {
  to {
    background-position: 0 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .seq.on {
    animation: none;
  }
}
</style>

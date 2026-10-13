<!--
  The BPM lifecycle as the site's key artefact: five phases top to bottom,
  the Miragon AI tools of each phase beside it, and the loop from Optimize
  back to Design. Analyse runs once, at the start (`once` in
  data/lifecycle.ts), so a BPMN start event leads into it and the loop
  returns to the first phase after it. Plain links, so it doubles as
  navigation. Blue carries the phases, green is the one accent on dark
  grounds: the loop, the open Optimize slot and the token.

  Motion, in the spirit of a BPMN token simulation: the rows come in one by
  one and the loop draws itself from Optimize up into Design (CSS only, so
  the server-rendered graphic needs no script). Then a token leaves the
  start event and runs the lifecycle: it rests in a phase while that phase
  and its tools light up, drops through the arrow to the next phase and
  takes the loop from Optimize back into Design, round after round; it
  passes Analyse only on its first run. Hovering or focusing a row holds the
  token and lights that row; the button pauses it for good. With
  prefers-reduced-motion the graphic stays still, and it only runs while it
  is on screen.

  An island: Astro renders the graphic on the server and the browser
  hydrates it once it scrolls into view (client:visible in
  hero/HeroArtefact.astro and landing/LifecycleMapIsland.astro).

  Colours: a surrounding element may set these to fit another ground (the
  defaults suit the site's dark ground). --lc-phase-bg,
  --lc-phase-bg-hover, --lc-phase-text; --lc-tool-bg, --lc-tool-bg-active,
  --lc-tool-border, --lc-tool-name, --lc-tool-job; --lc-accent (tool hover,
  lit tool names); --lc-arrow; --lc-loop (loop, open slot, lit row);
  --lc-token, --lc-token-ring (transparent on a gradient); --lc-label,
  --lc-label-active.
-->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { PHASES } from "../../data/lifecycle"

const LAST = PHASES.length - 1
/** The first phase in the loop: the loop from the last phase returns here. */
const LOOP_START = Math.max(
  0,
  PHASES.findIndex((phase) => !phase.once),
)
const CAPTION =
  (LOOP_START > 0 ? `${PHASES[0].name} runs once, at the start. ` : "") +
  `What you learn in ${PHASES[LAST].name} goes back into ${PHASES[LOOP_START].name}.`

/** How long the token leaves the start event, rests in a phase, drops to the next and runs the loop (ms). */
const START = 650
const DWELL = 1700
const HOP = 520
const LOOP = 1500

type Move = "start" | "hop" | "loop"
interface Step {
  row: number
  move?: Move
  duration: number
}
/** The token's timeline: out of the start event into the first phase, then
    rest in phase i and move out of it (to i + 1, or round the loop). */
const STEPS: Step[] = [
  ...(LOOP_START > 0 ? [{ row: 0, move: "start" as const, duration: START }] : []),
  ...PHASES.flatMap((_, row): Step[] => [
    { row, duration: DWELL },
    { row, move: row < LAST ? "hop" : "loop", duration: row < LAST ? HOP : LOOP },
  ]),
]
/** The first run passes the phases before the loop once; the rest repeats. */
const LOOP_STEP = STEPS.findIndex((step) => !step.move && step.row === LOOP_START)
const total = (steps: Step[]) => steps.reduce((sum, step) => sum + step.duration, 0)
const INTRO = total(STEPS.slice(0, LOOP_STEP))
const CYCLE = total(STEPS.slice(LOOP_STEP))

type Point = [number, number]

const root = ref<HTMLElement>()
const token = ref<HTMLElement>()
/** The rows in phase order (a function ref keeps the order). */
const rows: HTMLElement[] = []
const live = ref(false)
const paused = ref(false)
const held = ref<number | null>(null)
const stepIndex = ref(0)

const step = computed(() => STEPS[stepIndex.value])
/** The lit row: the one under the pointer or focus, else the token's phase. */
const activeRow = computed(
  () => held.value ?? (live.value && !step.value.move ? step.value.row : null),
)
/** The token's move right now, if it is moving and not held. */
const moving = computed(() => (live.value && held.value === null ? step.value.move : undefined))
const flowingRow = computed(() => (moving.value === "hop" ? step.value.row : null))

// The token's paths, measured from the rendered rows: from the start event
// into the first phase, the drop from each phase into the next, and the
// loop from Optimize along the gutter line back into Design. Offsets ignore
// transforms, so the entrance animation does not skew them.
let paths: { start: Point[]; hops: Point[][]; loop: Point[] } | undefined

function measure() {
  const boxes = rows.map((row) => ({
    left: row.offsetLeft,
    top: row.offsetTop,
    bottom: row.offsetTop + row.offsetHeight,
    middle: row.offsetTop + row.offsetHeight / 2,
    centre: row.offsetLeft + (row.querySelector(".phase") as HTMLElement).offsetWidth / 2,
  }))
  // The gutter line is 2px wide, 22px left of the rows (see
  // .row.in-loop::before), and the start event sits on it.
  const [first, end, back] = [boxes[0], boxes[LAST], boxes[LOOP_START]]
  const gutter = first.left - 21
  paths = {
    start: [
      [gutter, first.middle],
      [first.left, first.middle],
    ],
    hops: boxes.slice(1).map((next, i) => [
      [boxes[i].centre, boxes[i].bottom],
      [next.centre, next.top],
    ]),
    loop: [
      [end.left, end.middle],
      [gutter, end.middle],
      [gutter, back.middle],
      [back.left, back.middle],
    ],
  }
}

function pointAt(path: Point[], share: number): Point {
  const lengths = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]))
  let rest = share * lengths.reduce((sum, length) => sum + length, 0)
  for (let i = 0; i < lengths.length; i++) {
    if (rest <= lengths[i] || i === lengths.length - 1) {
      const t = lengths[i] ? Math.min(rest / lengths[i], 1) : 0
      const [a, b] = [path[i], path[i + 1]]
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    }
    rest -= lengths[i]
  }
  return path[0]
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

let clock = 0
let last = 0
let frame = 0
let visible = false

function render() {
  let [i, t] = clock < INTRO ? [0, clock] : [LOOP_STEP, (clock - INTRO) % CYCLE]
  while (t >= STEPS[i].duration) t -= STEPS[i++].duration
  if (i !== stepIndex.value) stepIndex.value = i
  const el = token.value
  const { row, move, duration } = STEPS[i]
  if (!el || !paths) return
  if (!move) {
    el.style.opacity = "0"
    return
  }
  const path = move === "start" ? paths.start : move === "loop" ? paths.loop : paths.hops[row]
  const share = t / duration
  const [x, y] = pointAt(path, easeInOut(share))
  // The token grows out of one box edge (or the start event) and shrinks
  // into the next box.
  const grow = move === "start" ? 0.35 : 0.18
  const scale = Math.max(0, Math.min(1, share / grow, (1 - share) / 0.18))
  el.style.opacity = "1"
  el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
}

function tick(now: number) {
  clock += Math.min(now - (last || now), 64)
  last = now
  render()
  frame = requestAnimationFrame(tick)
}

function sync() {
  const run = live.value && visible && !paused.value && held.value === null
  if (run && !frame) frame = requestAnimationFrame(tick)
  if (!run && frame) {
    cancelAnimationFrame(frame)
    frame = 0
    last = 0
  }
}

function hold(row: number | null) {
  held.value = row
  sync()
}

function togglePause() {
  paused.value = !paused.value
  sync()
}

/** Time left on the CSS entrance (row fade-in, loop drawing) in ms. */
function entranceLeft(el: HTMLElement) {
  if (!el.getAnimations) return 0
  const left = el.getAnimations({ subtree: true }).map((animation) => {
    const end = Number(animation.effect?.getComputedTiming().endTime)
    const now = Number(animation.currentTime)
    return Number.isFinite(end) && Number.isFinite(now) ? end - now : 0
  })
  return Math.max(0, ...left)
}

let resize: ResizeObserver | undefined
let intersect: IntersectionObserver | undefined
let start: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  const el = root.value
  if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return
  resize = new ResizeObserver(measure)
  resize.observe(el)
  rows.forEach((row) => resize?.observe(row))
  intersect = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    sync()
  })
  start = setTimeout(
    () => {
      measure()
      live.value = true
      intersect?.observe(el)
    },
    entranceLeft(el) + 250,
  )
})

onBeforeUnmount(() => {
  clearTimeout(start)
  resize?.disconnect()
  intersect?.disconnect()
  cancelAnimationFrame(frame)
})
</script>

<template>
  <nav
    ref="root"
    class="lifecycle"
    :class="{ 'is-live': live, 'is-starting': moving === 'start', 'is-looping': moving === 'loop' }"
    :style="{ '--loop-rows': LAST - LOOP_START + 1 }"
    aria-label="The BPM lifecycle and its tools"
  >
    <ol>
      <li
        v-for="(phase, i) in PHASES"
        :key="phase.name"
        :ref="(el) => (rows[i] = el as HTMLElement)"
        class="row"
        :class="{
          'in-loop': i >= LOOP_START,
          'loop-start': i === LOOP_START,
          'is-active': activeRow === i,
          'is-flowing': flowingRow === i,
        }"
        :style="{ '--i': i, '--up': LAST - i }"
        @mouseenter="hold(i)"
        @mouseleave="hold(null)"
        @focusin="hold(i)"
        @focusout="hold(null)"
      >
        <span v-if="i === 0 && LOOP_START > 0" class="start-event" aria-hidden="true" />
        <a class="phase" :href="phase.link">
          <span class="phase-name">{{ phase.name }}</span>
          <span class="phase-job">{{ phase.job }}</span>
        </a>
        <ul v-if="phase.tools.length" class="tools">
          <li v-for="(tool, j) in phase.tools" :key="tool.name" :style="{ '--j': j }">
            <a class="tool" :href="tool.link">
              <span class="tool-name">{{ tool.name }}</span>
              <span class="tool-job">{{ tool.job }}</span>
            </a>
          </li>
        </ul>
        <a v-else class="open" :href="phase.link">
          <span class="tool-name">No tool yet</span>
          <span class="tool-job">Bring us your case</span>
        </a>
      </li>
    </ol>
    <div class="foot">
      <p class="loop-label">{{ CAPTION }}</p>
      <button
        v-if="live"
        type="button"
        class="pause"
        :aria-label="paused ? 'Play the animation' : 'Pause the animation'"
        :title="paused ? 'Play' : 'Pause'"
        @click="togglePause"
      >
        <!-- Lucide play / pause -->
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <polygon v-if="paused" points="6 3 20 12 6 21 6 3" />
          <template v-else>
            <rect x="14" y="4" width="4" height="16" rx="1" />
            <rect x="6" y="4" width="4" height="16" rx="1" />
          </template>
        </svg>
      </button>
    </div>
    <span ref="token" class="token" aria-hidden="true" />
  </nav>
</template>

<style scoped>
/* Resets and colours are scoped under .lifecycle so they also hold inside
   a page's text, where the website's .prose list and link rules apply. */
.lifecycle {
  --row: 60px;
  --gap: 20px;
  --loop: var(--lc-loop, var(--cd-gruen));
  /* One stretch of the loop per row while it draws itself. */
  --draw: 170ms;
  position: relative;
  padding-left: 30px;
  max-width: 520px;
  font-family: var(--site-font);
  /* The hero centres its text on small screens; the diagram reads left. */
  text-align: left;
}

.lifecycle :is(ol, ul) {
  list-style: none;
  margin: 0;
  padding: 0;
}
.lifecycle li {
  margin: 0;
}
.lifecycle a {
  font-weight: inherit;
  text-decoration: none;
  color: inherit;
}

.lifecycle ol {
  display: grid;
  gap: var(--gap);
}

.row {
  position: relative;
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 12px;
  align-items: stretch;
}

/* Phases: CI blue surfaces with a white label (5.47:1). */
.lifecycle .phase {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: var(--row);
  padding: 6px 12px;
  border-radius: var(--cd-radius-sm);
  background: var(--lc-phase-bg, var(--cd-blau));
  color: var(--lc-phase-text, var(--cd-weiss));
  outline: 2px solid transparent;
  outline-offset: 3px;
  transition:
    background-color var(--cd-motion-fast) var(--cd-ease),
    outline-color var(--cd-motion-base) var(--cd-ease);
}
.lifecycle .phase:hover,
.lifecycle .phase:focus-visible {
  background: var(--lc-phase-bg-hover, var(--cd-blau-link));
  color: var(--lc-phase-text, var(--cd-weiss));
}
.phase-name {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
}
.phase-job {
  font-size: 12px;
  line-height: 1.35;
  opacity: 0.9;
}
/* Sequence flow to the next phase: a line with an arrowhead in the gap. */
.row:not(:last-child) .phase::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 100%;
  width: 2px;
  height: calc(var(--gap) - 5px);
  background: var(--lc-arrow, var(--site-text-3));
  transform: translateX(-50%);
  transition: background-color var(--cd-motion-base) var(--cd-ease);
}
.row:not(:last-child) .phase::before {
  content: "";
  position: absolute;
  left: 50%;
  top: calc(100% + var(--gap) - 6px);
  border: 5px solid transparent;
  border-top: 6px solid var(--lc-arrow, var(--site-text-3));
  border-bottom: 0;
  transform: translateX(-50%);
  transition: border-top-color var(--cd-motion-base) var(--cd-ease);
}

.tools {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tools li {
  display: flex;
  flex: 1 1 140px;
  min-width: 0;
}
.tools .tool {
  flex: 1;
}
.tool,
.open {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: var(--row);
  padding: 8px 12px;
  border-radius: var(--cd-radius-sm);
  transition:
    border-color var(--cd-motion-base) var(--cd-ease),
    background-color var(--cd-motion-base) var(--cd-ease);
}
/* --cd-kontur is the CI's outline role (at least 3:1 on both grounds). */
.tool {
  border: 1px solid var(--lc-tool-border, var(--cd-kontur));
  background: var(--lc-tool-bg, var(--site-bg-soft));
}
.tool:hover,
.tool:focus-visible,
.open:hover,
.open:focus-visible {
  border-color: var(--lc-accent, var(--site-accent));
}
/* The open Optimize slot: a dashed outline, nothing inside. */
.open {
  border: 2px dashed var(--loop);
}
.tool-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--lc-tool-name, var(--site-text-1));
  transition: color var(--cd-motion-base) var(--cd-ease);
}
.tool-job {
  font-size: 12px;
  line-height: 1.35;
  color: var(--lc-tool-job, var(--site-text-2));
}

/* The lit row: a ring around the phase (an outline, so the gap shows the
   ground), its tools outlined in the accent and their names in the brand
   text colour (green on dark, 10.1:1). */
.row.is-active .phase {
  outline-color: var(--loop);
}
.row.is-active :is(.tool, .open) {
  border-color: var(--loop);
  background: var(--lc-tool-bg-active, var(--site-bg-elv));
}
.row.is-active .tool-name {
  color: var(--lc-accent, var(--site-accent));
}
/* The arrow the token drops through. */
.row.is-flowing .phase::after {
  background: var(--loop);
}
.row.is-flowing .phase::before {
  border-top-color: var(--loop);
}

/* The loop from the middle of Optimize back into the middle of Design,
   drawn in the 30px gutter. Each row in the loop draws its own stretch of
   the line (and the gap above it), so the ends sit on the rows' middles at
   any row height: Design turns in with the arrowhead, Optimize turns out. */
.row.in-loop::before {
  content: "";
  position: absolute;
  left: -22px;
  width: 22px;
  top: calc(var(--gap) * -1);
  bottom: 0;
  border-left: 2px solid var(--loop);
}
.row.loop-start::before {
  top: calc(50% - 1px);
  border-top: 2px solid var(--loop);
  border-top-left-radius: var(--cd-radius-sm);
}
.row.in-loop:last-child::before {
  bottom: calc(50% - 1px);
  border-bottom: 2px solid var(--loop);
  border-bottom-left-radius: var(--cd-radius-sm);
}
.row.loop-start::after {
  content: "";
  position: absolute;
  left: -6px;
  top: calc(50% - 5px);
  border: 5px solid transparent;
  border-left: 6px solid var(--loop);
  border-right: 0;
}

/* Analyse runs once: a BPMN start event (a thin circle) on the gutter line
   with a sequence flow into the first phase, in the arrows' colour. */
.start-event {
  position: absolute;
  left: -28px;
  top: calc(50% - 7px);
  width: 14px;
  height: 14px;
  border: 2px solid var(--lc-arrow, var(--site-text-3));
  border-radius: 50%;
  transition: border-color var(--cd-motion-base) var(--cd-ease);
}
.start-event::before {
  content: "";
  position: absolute;
  left: 100%;
  top: 50%;
  width: 9px;
  height: 2px;
  margin-top: -1px;
  background: var(--lc-arrow, var(--site-text-3));
  transition: background-color var(--cd-motion-base) var(--cd-ease);
}
.start-event::after {
  content: "";
  position: absolute;
  left: calc(100% + 8px);
  top: 50%;
  margin-top: -5px;
  border: 5px solid transparent;
  border-left: 6px solid var(--lc-arrow, var(--site-text-3));
  border-right: 0;
  transition: border-left-color var(--cd-motion-base) var(--cd-ease);
}
.lifecycle.is-starting .start-event {
  border-color: var(--loop);
}
.lifecycle.is-starting .start-event::before {
  background: var(--loop);
}
.lifecycle.is-starting .start-event::after {
  border-left-color: var(--loop);
}

/* The token: an accent dot with a ring in the ground colour, so it stays
   visible on the loop line of the same colour. Script places it. */
.token {
  position: absolute;
  top: 0;
  left: 0;
  width: 11px;
  height: 11px;
  margin: -5.5px 0 0 -5.5px;
  border-radius: 50%;
  background: var(--lc-token, var(--loop));
  box-shadow: 0 0 0 3px var(--lc-token-ring, var(--site-bg));
  opacity: 0;
  pointer-events: none;
  will-change: transform;
}

.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}
.loop-label {
  margin: 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--lc-label, var(--site-text-2));
  transition: color var(--cd-motion-base) var(--cd-ease);
}
.lifecycle.is-looping .loop-label {
  color: var(--lc-label-active, var(--site-text-1));
}
.pause {
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  /* A bare icon button, without the browser's button chrome. */
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  border-radius: var(--cd-radius-pill);
  color: var(--lc-label, var(--site-text-2));
  transition: color var(--cd-motion-fast) var(--cd-ease);
}
.pause:hover {
  color: var(--lc-label-active, var(--site-text-1));
}
.pause svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.lifecycle .row a:focus-visible,
.lifecycle .pause:focus-visible {
  outline: 2px solid var(--cd-blau-hell);
  outline-offset: 2px;
}

/* Entrance: the phases come in top to bottom with their tools, then the
   loop draws itself from Optimize up into Design and the arrowhead lands.
   Only for readers who allow motion; the script starts the token after. */
@keyframes lc-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
}
@keyframes lc-draw {
  from {
    clip-path: inset(100% 0 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
@keyframes lc-land {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
}
@media (prefers-reduced-motion: no-preference) {
  .lifecycle .phase,
  .start-event {
    animation: lc-in var(--cd-motion-slow) var(--cd-ease-out) both;
    animation-delay: calc(450ms + var(--i) * 90ms);
  }
  .tools li,
  .open {
    animation: lc-in var(--cd-motion-slow) var(--cd-ease-out) both;
    animation-delay: calc(560ms + var(--i) * 90ms + var(--j, 0) * 70ms);
  }
  .row.in-loop::before {
    animation: lc-draw var(--draw) linear both;
    animation-delay: calc(1050ms + var(--up) * var(--draw));
  }
  .row.loop-start::after {
    animation: lc-land var(--cd-motion-base) var(--cd-ease-out) both;
    animation-delay: calc(1050ms + var(--loop-rows) * var(--draw));
  }
  .loop-label {
    animation: lc-in var(--cd-motion-slow) var(--cd-ease-out) both;
    animation-delay: calc(1050ms + var(--loop-rows) * var(--draw));
  }
  .pause {
    animation: lc-in var(--cd-motion-base) var(--cd-ease-out) both;
  }
}

@media (max-width: 420px) {
  .row {
    grid-template-columns: 104px minmax(0, 1fr);
  }
  .phase-job {
    display: none;
  }
}
</style>

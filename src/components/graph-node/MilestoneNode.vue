<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { MilestoneStatus } from './types'
import { computed } from 'vue'
import { cn } from '#/lib/utils'
import { PADLOCK, PADLOCK_OPEN, STATUS_GLYPH, statusPlanes } from '../status-chip/glyphs'
import NodeLabel from './NodeLabel.vue'
import { STATUS_NAME, NODE_TEXT } from './types'

// Milestone node (§8.5–8.6): a cut gem inside a 24-segment ring, 200px. The
// ring drains toward the deadline — remaining segments Ink, elapsed Well-deep,
// Spark when ≤ 7 days are left — and closes in the status colour once the
// milestone ends. It starts LOCKED (grey planes, Ash edge, padlock, pips
// counting the requirements done) and becomes READY when they are all done
// (Pulse-deep 4px edge, open padlock, READY TO UNLOCK).
const props = withDefaults(defineProps<{
  status?: MilestoneStatus
  label: string
  /** The due line, e.g. `DUE NOV 14`. */
  due?: string
  daysLeft?: number
  totalDays?: number
  /** Required predecessor goals done / total — drives the lock pips. */
  reqDone?: number
  reqTotal?: number
  /** The countdown ring is optional (§8.54). */
  ring?: boolean
  class?: HTMLAttributes['class']
}>(), { status: 'locked', daysLeft: 0, totalDays: 30, reqDone: 0, reqTotal: 0, ring: true })

const pre = computed(() => props.status === 'locked' || props.status === 'ready')
const c = computed(() => statusPlanes(pre.value ? 'locked' : props.status as Exclude<MilestoneStatus, 'locked' | 'ready'>))
const glyph = computed(() => {
  if (props.status === 'locked') return { d: PADLOCK, fill: false }
  if (props.status === 'ready') return { d: PADLOCK_OPEN, fill: false }
  return STATUS_GLYPH[props.status]
})
const total = computed(() => Math.max(1, props.totalDays))
const left = computed(() => Math.max(0, props.daysLeft))
const reqTotal = computed(() => Math.max(0, props.reqTotal))
const reqDone = computed(() => Math.min(reqTotal.value, Math.max(0, props.reqDone)))
const final = computed(() => props.status === 'completed' || props.status === 'halted')
const urgent = computed(() => !final.value && left.value <= 7)
const segments = computed(() => {
  const rem = Math.max(0, Math.min(24, Math.round((24 * left.value) / total.value)))
  return Array.from({ length: 24 }, (_, i) => ({
    rotate: `${i * 15}deg`,
    bg: final.value ? c.value.b : i < rem ? (urgent.value ? 'var(--spark)' : 'var(--node-edge)') : 'var(--cell-empty)',
  }))
})
const dark = computed(() => props.status === 'halted')
const edge = computed(() => props.status === 'locked' ? 'var(--ash)' : props.status === 'ready' ? 'var(--pulse-deep)' : 'var(--node-edge)')
const edgeW = computed(() => props.status === 'ready' ? 4 : 2)
const badgeBg = computed(() => dark.value ? 'var(--ink)' : props.status === 'ready' ? 'var(--pulse)' : 'var(--paper)')
const glyphInk = computed(() => dark.value ? 'var(--paper)' : props.status === 'locked' ? 'var(--slate)' : 'var(--ink)')

// The chip under the label — a FRAMED square chip (1.5px edge).
const chip = computed(() => {
  const s = props.status
  if (s === 'locked') return { text: NODE_TEXT.locked(reqDone.value, reqTotal.value), bg: 'var(--paper)', fg: 'var(--slate)', border: 'var(--ash)' }
  if (s === 'ready') return { text: NODE_TEXT.ready, bg: 'var(--pulse)', fg: 'var(--ink)', border: 'var(--ink)' }
  if (s === 'completed') return { text: NODE_TEXT.delivered, bg: 'var(--status-completed-base)', fg: 'var(--ink)', border: 'var(--ink)' }
  if (s === 'halted') return { text: NODE_TEXT.halted, bg: 'var(--ink)', fg: 'var(--paper)', border: 'var(--ink)' }
  return { text: NODE_TEXT.daysLeft(left.value), bg: urgent.value ? 'var(--spark)' : 'var(--paper)', fg: 'var(--ink)', border: 'var(--ink)' }
})
const pips = computed(() => Array.from({ length: reqTotal.value }, (_, i) => i < reqDone.value))
const showPips = computed(() => pre.value && reqTotal.value > 0)
const name = computed(() => STATUS_NAME[props.status === 'not-started' ? 'not-started' : props.status])
</script>

<template>
  <div
    data-slot="graph-node"
    data-kind="milestone"
    :data-status="status"
    :class="cn('inline-flex w-55 flex-col items-center gap-2.5 pt-1 text-foreground', props.class)"
  >
    <div class="relative size-50 shrink-0">
      <template v-if="ring">
        <span
          v-for="(sg, i) in segments"
          :key="i"
          class="milestone-seg absolute"
          :style="{ rotate: sg.rotate, backgroundColor: sg.bg }"
          aria-hidden="true"
        />
      </template>
      <svg
        viewBox="0 0 200 200"
        width="200"
        height="200"
        class="absolute inset-0"
        role="img"
        :aria-label="`Milestone, ${name}, ${left} days left`"
      >
        <g stroke="var(--ink)" stroke-opacity="0.18" stroke-width="1" stroke-linejoin="miter">
          <polygon points="44,84 76,58 72,84" :fill="c.l" />
          <polygon points="76,58 100,84 72,84" :fill="c.b" />
          <polygon points="76,58 124,58 100,84" :fill="c.l" />
          <polygon points="124,58 128,84 100,84" :fill="c.b" />
          <polygon points="124,58 156,84 128,84" :fill="c.d" />
          <polygon points="44,84 72,84 100,150" :fill="c.b" />
          <polygon points="72,84 128,84 100,150" :fill="c.l" />
          <polygon points="128,84 156,84 100,150" :fill="c.d" />
        </g>
        <polygon points="76,58 124,58 156,84 100,150 44,84" fill="none" :stroke="edge" :stroke-width="edgeW" stroke-linejoin="miter" />
        <line x1="44" y1="84" x2="156" y2="84" :stroke="edge" stroke-width="1.5" />
      </svg>
      <span
        v-if="glyph.d"
        class="absolute top-[81px] left-[85px] flex size-7.5 items-center justify-center border-(length:--stroke) border-[color:var(--ink)]"
        :style="{ backgroundColor: badgeBg }"
      >
        <svg viewBox="0 0 24 24" class="size-4.5" aria-hidden="true">
          <path :d="glyph.d" :fill="glyph.fill ? glyphInk : 'none'" :stroke="glyphInk" stroke-width="2.4" stroke-linejoin="miter" stroke-linecap="square" />
        </svg>
      </span>
    </div>
    <div class="flex max-w-full flex-col items-center gap-1.5">
      <NodeLabel :title="label" :meta="due" weight="milestone" />
      <span
        data-slot="graph-node-chip"
        class="inline-flex h-6 items-center border-(length:--stroke) px-2 font-mono text-[0.625rem] font-medium tracking-[0.08em]"
        :style="{ backgroundColor: chip.bg, color: chip.fg, borderColor: chip.border }"
      >{{ chip.text }}</span>
      <span
        v-if="showPips"
        class="flex gap-1 pt-0.5"
        role="img"
        :aria-label="`${reqDone} of ${reqTotal} required goals completed`"
      >
        <span
          v-for="(on, i) in pips"
          :key="i"
          class="milestone-pip size-3 border-(length:--stroke) border-[color:var(--node-edge)]"
          :style="{ backgroundColor: on ? 'var(--node-edge)' : 'transparent' }"
        />
      </span>
    </div>
  </div>
</template>

<style scoped>
/* One of the 24 ring segments: a trapezoid pinned at 12 o'clock and rotated
   about the ring centre (100, 100). Geometry only. */
.milestone-seg {
  left: 89px;
  top: 2px;
  width: 22px;
  height: 14px;
  transform-origin: 11px 98px;
  clip-path: polygon(0 0, 100% 0, 82% 100%, 18% 100%);
}
.milestone-pip {
  clip-path: polygon(50% 0, 100% 38%, 81% 100%, 19% 100%, 0 38%);
}
</style>

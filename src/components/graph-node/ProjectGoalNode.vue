<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { GraphNodeVariant, ProjectGoalStatus } from './types'
import { computed } from 'vue'
import { cn } from '#/lib/utils'
import { chaliceLiquid, PROJECT_GOAL_BOWL_FILLS, PROJECT_GOAL_STAND_TONES } from './facets'
import { PROJECT_GOAL_GEOMETRY } from './geometry'
import { STATUS_GLYPH, statusPlanes } from '../status-chip/glyphs'
import NodeLabel from './NodeLabel.vue'
import { NODE_TEXT, STATUS_NAME } from './types'

// Project goal node (§8.7): a faceted chalice, the one thing the whole project
// is for. It fills with liquid in its status colour; the level is the share of
// its goals that are complete, and the surface is an Ink line. Exactly one per
// project. `variant="sheet"` is the chalice at 104px with the label on the left and no chip; the host writes `meta`.
const props = withDefaults(defineProps<{
  status?: ProjectGoalStatus
  label: string
  done?: number
  total?: number
  variant?: GraphNodeVariant
  /** The meta line of the sheet form (default: `done/total GOALS · n%`). */
  meta?: string
  class?: HTMLAttributes['class']
}>(), { status: 'ongoing', done: 0, total: 1, variant: 'default' })

const sheet = computed(() => props.variant === 'sheet')
// Sheet form: the 220 × 248 drawing scaled to 104px tall (92px wide).
const SHEET_SCALE = { position: 'absolute', left: '0', top: '0', scale: '0.4194', transformOrigin: 'top left' } as const

const c = computed(() => statusPlanes(props.status))
const glyph = computed(() => STATUS_GLYPH[props.status])
const total = computed(() => Math.max(1, props.total))
const done = computed(() => {
  if (props.status === 'completed') return total.value
  if (props.status === 'not-started') return 0
  return Math.min(total.value, Math.max(0, props.done))
})
const p = computed(() => done.value / total.value)

const liquid = computed(() => chaliceLiquid(p.value))
const dark = computed(() => props.status === 'halted')
const ink = computed(() => (dark.value ? 'var(--paper)' : 'var(--ink)'))
const chip = computed(() => ({
  text: props.status === 'completed' ? NODE_TEXT.goalMet : STATUS_NAME[props.status].toUpperCase(),
  bg: props.status === 'not-started' ? 'var(--paper)' : c.value.b,
  fg: dark.value ? 'var(--paper)' : 'var(--ink)',
}))
</script>

<template>
  <div
    data-slot="graph-node"
    data-kind="project-goal"
    :data-status="status"
    :data-variant="variant"
    :class="cn('inline-flex items-center text-foreground', sheet ? 'flex-row gap-3' : 'w-55 flex-col gap-2.5 pt-1', props.class)"
  >
    <NodeLabel v-if="sheet" side="left" :title="label" :meta="meta ?? `${done}/${total} GOALS · ${Math.round(p * 100)}%`" weight="project"><slot /></NodeLabel>
    <div :class="sheet ? 'relative h-26 w-23 shrink-0 overflow-hidden' : 'contents'">
    <div class="relative h-62 w-55 shrink-0" :style="sheet ? SHEET_SCALE : undefined">
      <svg
        viewBox="0 0 240 270"
        width="220"
        height="248"
        role="img"
        :aria-label="`Project goal, ${STATUS_NAME[status]}, ${done} of ${total} goals`"
      >
        <g stroke="var(--ink)" stroke-opacity="0.18" stroke-width="1" stroke-linejoin="miter">
          <polygon v-for="(points, i) in PROJECT_GOAL_GEOMETRY.facets" :key="i" :points="points" :fill="PROJECT_GOAL_BOWL_FILLS[i]" />
        </g>
        <template v-if="p > 0">
          <g stroke="var(--ink)" stroke-opacity="0.18" stroke-width="1" stroke-linejoin="miter">
            <polygon :points="liquid.body" :fill="c.b" />
            <polygon :points="liquid.facetL" :fill="c.l" />
            <polygon :points="liquid.facetR" :fill="c.d" />
          </g>
          <line :x1="liquid.xl" :y1="liquid.yl" :x2="liquid.xr" :y2="liquid.yl" stroke="var(--ink)" stroke-width="1.5" />
        </template>
        <polygon :points="PROJECT_GOAL_GEOMETRY.outline" fill="none" stroke="var(--node-edge)" stroke-width="2.5" stroke-linejoin="miter" />
        <g stroke="var(--node-edge)" stroke-width="1.5" stroke-linejoin="miter">
          <polygon v-for="(points, i) in PROJECT_GOAL_GEOMETRY.stand" :key="i" :points="points" :fill="c[PROJECT_GOAL_STAND_TONES[i]!]" />
        </g>
      </svg>
      <span
        v-if="glyph.d"
        class="absolute top-[190px] left-[97px] flex size-6.5 items-center justify-center border-(length:--stroke) border-[color:var(--ink)]"
        :style="{ backgroundColor: dark ? 'var(--ink)' : 'var(--paper)' }"
      >
        <svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
          <path :d="glyph.d" :fill="glyph.fill ? ink : 'none'" :stroke="ink" stroke-width="2.6" stroke-linejoin="miter" stroke-linecap="square" />
        </svg>
      </span>
    </div>
    </div>
    <div v-if="!sheet" class="flex max-w-full flex-col items-center gap-1.5">
      <NodeLabel :title="label" :meta="`${done}/${total} GOALS · ${Math.round(p * 100)}%`" weight="project"><slot /></NodeLabel>
      <span
        data-slot="graph-node-chip"
        class="inline-flex h-6 items-center border-(length:--stroke) border-[color:var(--ink)] px-2 font-mono text-[0.625rem] font-medium tracking-[0.08em]"
        :style="{ backgroundColor: chip.bg, color: chip.fg }"
      >{{ chip.text }}</span>
    </div>
  </div>
</template>

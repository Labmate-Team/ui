<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { GraphNodeVariant, WorkStatus } from './types'
import { computed } from 'vue'
import { cn } from '#/lib/utils'
import { GOAL_GEOMETRY } from './geometry'
import { STATUS_GLYPH, statusPlanes } from '../status-chip/glyphs'
import InsideBadge from './InsideBadge.vue'
import NodeLabel from './NodeLabel.vue'
import { STATUS_NAME } from './types'

// Goal node (§8.4): a pentagon of five facets around an inner core that holds
// the glyph, 104px. The facets light up clockwise from the top as sub-items
// complete — the shape is its progress bar. A goal with sub-items rolls its
// status up (§9.1); pass the rolled-up status here. `variant="sheet"` is the 60px form with the label on the left;
// `inside` marks a goal that holds other nodes.
const props = withDefaults(defineProps<{
  status?: WorkStatus
  label: string
  done?: number
  total?: number
  /** Overrides the default `done/total TASKS · STATUS` meta line. */
  meta?: string
  variant?: GraphNodeVariant
  /** Holds other nodes: draws the stacked-layers badge. */
  inside?: boolean
  showLabel?: boolean
  class?: HTMLAttributes['class']
}>(), { status: 'ongoing', done: 0, total: 1, showLabel: true, variant: 'default' })

const c = computed(() => statusPlanes(props.status))
const glyph = computed(() => STATUS_GLYPH[props.status])
const total = computed(() => Math.max(1, props.total))
const done = computed(() => Math.min(total.value, Math.max(0, props.done)))
const facets = computed(() => {
  let lit = Math.round((done.value / total.value) * 5)
  if (props.status === 'completed') lit = 5
  if (props.status === 'not-started') lit = 0
  const on = [c.value.b, c.value.d, c.value.d, c.value.b, c.value.l]
  const off = ['var(--well)', 'var(--well-deep)', 'var(--well-deep)', 'var(--well)', 'var(--paper)']
  return [0, 1, 2, 3, 4].map(i => (i < lit ? on[i] : off[i]))
})
const dark = computed(() => props.status === 'halted')
const ink = computed(() => (dark.value ? 'var(--paper)' : 'var(--ink)'))
const sheet = computed(() => props.variant === 'sheet')
const px = computed(() => sheet.value ? 60 : 104)
const metaLine = computed(() => props.meta ?? `${done.value}/${total.value} TASKS · ${STATUS_NAME[props.status].toUpperCase()}`)
</script>

<template>
  <div
    data-slot="graph-node"
    data-kind="goal"
    :data-status="status"
    :data-variant="variant"
    :class="cn('inline-flex items-center text-foreground', sheet ? 'flex-row gap-3' : 'w-45 flex-col gap-2.5 pt-1', props.class)"
  >
    <NodeLabel v-if="sheet && showLabel" side="left" :title="label" :meta="metaLine" weight="goal"><slot /></NodeLabel>
    <span class="relative inline-flex shrink-0">
    <svg
      viewBox="0 0 104 104"
      :width="px"
      :height="px"
      class="shrink-0"
      role="img"
      :aria-label="`Goal, ${STATUS_NAME[status]}, ${done} of ${total} tasks`"
    >
      <g stroke="var(--ink)" stroke-opacity="0.18" stroke-width="1" stroke-linejoin="miter">
        <polygon :points="GOAL_GEOMETRY.facets[0]" :fill="facets[0]" />
        <polygon :points="GOAL_GEOMETRY.facets[1]" :fill="facets[1]" />
        <polygon :points="GOAL_GEOMETRY.facets[2]" :fill="facets[2]" />
        <polygon :points="GOAL_GEOMETRY.facets[3]" :fill="facets[3]" />
        <polygon :points="GOAL_GEOMETRY.facets[4]" :fill="facets[4]" />
      </g>
      <polygon :points="GOAL_GEOMETRY.outline" fill="none" stroke="var(--node-edge)" stroke-width="2" stroke-linejoin="miter" />
      <polygon
        :points="GOAL_GEOMETRY.inner"
        :fill="dark ? 'var(--ink)' : 'var(--paper)'"
        stroke="var(--ink)"
        stroke-width="1.5"
        stroke-linejoin="miter"
      />
      <g v-if="glyph.d" transform="translate(43 46) scale(0.75)">
        <path :d="glyph.d" :fill="glyph.fill ? ink : 'none'" :stroke="ink" stroke-width="2.6" stroke-linejoin="miter" stroke-linecap="square" />
      </g>
    </svg>
      <InsideBadge v-if="inside" :size="px" />
    </span>
    <NodeLabel v-if="!sheet && showLabel" :title="label" :meta="metaLine" weight="goal"><slot /></NodeLabel>
  </div>
</template>

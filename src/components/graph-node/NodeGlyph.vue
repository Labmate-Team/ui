<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { NodeStatus } from '../status-chip/types'
import type { GraphNodeKind } from './types'
import { computed } from 'vue'
import { cn } from '#/lib/utils'
import { nodeStatusMark } from '../status-chip/glyphs'
import {
  chaliceLiquid,
  goalFacetFills,
  MILESTONE_FACET_TONES,
  PROJECT_GOAL_BOWL_FILLS,
  PROJECT_GOAL_STAND_TONES,
  START_FACET_FILLS,
  TASK_FACET_TONES,
} from './facets'
import { GOAL_GEOMETRY, MILESTONE_GEOMETRY, PROJECT_GOAL_GEOMETRY, START_GEOMETRY, TASK_GEOMETRY } from './geometry'

// A node drawn small (24 or 32px) for a row of text — a list of nodes, not the graph: the node's own shape and facets
// (geometry.ts, facets.ts — the same source as the node components) in its status planes, with the status glyph where
// the full node holds it (§3.3: colour never travels alone). No label, chip, ring, pips or light. Outlines and seams
// keep a fixed screen weight (1.5px / 0.75px) whatever the shape's own grid. Decorative unless `label` is given (the
// row's text usually names the node; pass the localized kind and status when it does not).
const props = withDefaults(defineProps<{
  kind: GraphNodeKind
  /** The node's status (ignored for Start, which has none). */
  status?: NodeStatus
  size?: 24 | 32
  /** A goal's progress (§8.4): `done` of `total` facets lit. Without them a goal shows all five lit in its status. */
  done?: number
  total?: number
  /** Accessible name (kind and status); omit when the row says it. */
  label?: string
  class?: HTMLAttributes['class']
}>(), { status: 'not-started', size: 24 })

// Each shape's crop of its own grid: a square around the shape with room for the outline.
const VIEWBOX: Record<GraphNodeKind, string> = {
  'start': '3 0 72 72',
  'task': '0 0 56 56',
  'goal': '2 -0.75 100 100',
  'milestone': '42 46 116 116',
  'project-goal': '0 18 240 240',
}
// Where the status glyph sits, in the shape's grid (the full node's glyph box). The project goal's badge is enlarged
// about its centre (at the full node's proportion it would be 4px here), as is the milestone's glyph within its badge.
const GLYPH_BOX: Record<Exclude<GraphNodeKind, 'start'>, { x: number, y: number, s: number }> = {
  'task': { x: 19, y: 19, s: 18 },
  'goal': { x: 43, y: 46, s: 18 },
  'milestone': { x: 88.5, y: 84.5, s: 23 },
  'project-goal': { x: 92, y: 193, s: 56 },
}
// A goal's core and glyph, drawn 1.5× about the glyph's centre (52, 55): at the full node's proportion the glyph would
// be 3–4px here and stop reading.
const GOAL_CORE_TRANSFORM = 'translate(52 55) scale(1.5) translate(-52 -55)'
// Milestone badge (MilestoneNode: 30px square, left 85, top 81) and the project goal's, enlarged as above.
const BADGE: Partial<Record<GraphNodeKind, { x: number, y: number, s: number }>> = {
  'milestone': { x: 85, y: 81, s: 30 },
  'project-goal': { x: 84, y: 185, s: 72 },
}

const mark = computed(() => nodeStatusMark(props.status))
const c = computed(() => mark.value.planes)
const glyph = computed(() => props.kind === 'start' ? { d: '', fill: false } : mark.value.glyph)
const dark = computed(() => props.status === 'halted')
const goalFacets = computed(() => {
  const total = Math.max(1, props.total ?? 1)
  const done = props.done === undefined ? total : Math.min(total, Math.max(0, props.done))
  return goalFacetFills(c.value, props.status, done, total)
})
const liquid = computed(() => chaliceLiquid(props.status === 'not-started' ? 0 : 1))
const milestoneEdge = computed(() => props.status === 'locked' ? 'var(--ash)' : props.status === 'ready' ? 'var(--pulse-deep)' : 'var(--node-edge)')
// Glyph ink: the status glyph colour on the status planes (task), Ink or Paper on a core or badge (goal, milestone, project goal).
const glyphInk = computed(() => {
  if (props.kind === 'task') return c.value.g
  if (dark.value) return 'var(--paper)'
  return props.kind === 'milestone' && props.status === 'locked' ? 'var(--slate)' : 'var(--ink)'
})
const badgeFill = computed(() => dark.value ? 'var(--ink)' : props.kind === 'milestone' && props.status === 'ready' ? 'var(--pulse)' : 'var(--paper)')
const glyphBox = computed(() => props.kind === 'start' ? undefined : GLYPH_BOX[props.kind])
const badge = computed(() => BADGE[props.kind])
</script>

<template>
  <svg
    data-slot="node-glyph"
    :data-kind="kind"
    :data-status="kind === 'start' ? undefined : status"
    :viewBox="VIEWBOX[kind]"
    :width="size"
    :height="size"
    :style="{ width: `${size / 16}rem`, height: `${size / 16}rem` }"
    :class="cn('shrink-0', props.class)"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  >
    <g stroke-linejoin="miter">
      <template v-if="kind === 'start'">
        <g stroke="var(--ink)" stroke-opacity="0.25" stroke-width="0.75">
          <polygon v-for="(points, i) in START_GEOMETRY.facets" :key="i" :points="points" :fill="START_FACET_FILLS[i]" vector-effect="non-scaling-stroke" />
        </g>
        <polygon :points="START_GEOMETRY.outline" fill="none" stroke="var(--node-edge)" stroke-width="1.5" vector-effect="non-scaling-stroke" />
      </template>
      <template v-else-if="kind === 'task'">
        <g :stroke="c.d" stroke-width="0.75">
          <polygon v-for="(points, i) in TASK_GEOMETRY.facets" :key="i" :points="points" :fill="c[TASK_FACET_TONES[i]!]" vector-effect="non-scaling-stroke" />
        </g>
        <polygon :points="TASK_GEOMETRY.outline" fill="none" stroke="var(--node-edge)" stroke-width="1.5" vector-effect="non-scaling-stroke" />
      </template>
      <template v-else-if="kind === 'goal'">
        <g stroke="var(--ink)" stroke-opacity="0.18" stroke-width="0.75">
          <polygon v-for="(points, i) in GOAL_GEOMETRY.facets" :key="i" :points="points" :fill="goalFacets[i]" vector-effect="non-scaling-stroke" />
        </g>
        <polygon :points="GOAL_GEOMETRY.outline" fill="none" stroke="var(--node-edge)" stroke-width="1.5" vector-effect="non-scaling-stroke" />
      </template>
      <template v-else-if="kind === 'milestone'">
        <g stroke="var(--ink)" stroke-opacity="0.18" stroke-width="0.75">
          <polygon v-for="(points, i) in MILESTONE_GEOMETRY.facets" :key="i" :points="points" :fill="c[MILESTONE_FACET_TONES[i]!]" vector-effect="non-scaling-stroke" />
        </g>
        <polygon :points="MILESTONE_GEOMETRY.outline" fill="none" :stroke="milestoneEdge" :stroke-width="status === 'ready' ? 2 : 1.5" vector-effect="non-scaling-stroke" />
      </template>
      <template v-else>
        <g stroke="var(--ink)" stroke-opacity="0.18" stroke-width="0.75">
          <polygon v-for="(points, i) in PROJECT_GOAL_GEOMETRY.facets" :key="i" :points="points" :fill="PROJECT_GOAL_BOWL_FILLS[i]" vector-effect="non-scaling-stroke" />
          <template v-if="status !== 'not-started'">
            <polygon :points="liquid.body" :fill="c.b" vector-effect="non-scaling-stroke" />
            <polygon :points="liquid.facetL" :fill="c.l" vector-effect="non-scaling-stroke" />
            <polygon :points="liquid.facetR" :fill="c.d" vector-effect="non-scaling-stroke" />
          </template>
        </g>
        <polygon :points="PROJECT_GOAL_GEOMETRY.outline" fill="none" stroke="var(--node-edge)" stroke-width="1.5" vector-effect="non-scaling-stroke" />
        <g stroke="var(--node-edge)" stroke-width="1">
          <polygon v-for="(points, i) in PROJECT_GOAL_GEOMETRY.stand" :key="i" :points="points" :fill="c[PROJECT_GOAL_STAND_TONES[i]!]" vector-effect="non-scaling-stroke" />
        </g>
      </template>
      <rect
        v-if="badge && glyph.d"
        :x="badge.x"
        :y="badge.y"
        :width="badge.s"
        :height="badge.s"
        :fill="badgeFill"
        stroke="var(--ink)"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
      />
      <g :transform="kind === 'goal' ? GOAL_CORE_TRANSFORM : undefined">
        <polygon v-if="kind === 'goal'" :points="GOAL_GEOMETRY.inner" :fill="dark ? 'var(--ink)' : 'var(--paper)'" stroke="var(--ink)" stroke-width="1" vector-effect="non-scaling-stroke" />
        <svg v-if="glyphBox && glyph.d" :x="glyphBox.x" :y="glyphBox.y" :width="glyphBox.s" :height="glyphBox.s" viewBox="0 0 24 24" overflow="visible">
          <path
            :d="glyph.d"
            :fill="glyph.fill ? glyphInk : 'none'"
            :stroke="glyphInk"
            stroke-width="1.5"
            stroke-linecap="square"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </g>
    </g>
  </svg>
</template>

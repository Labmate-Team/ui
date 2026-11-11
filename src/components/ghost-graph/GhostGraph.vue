<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, useId } from 'vue'
import { cn } from '#/lib/utils'
import { GOAL_GEOMETRY, MILESTONE_GEOMETRY, NODE_VIEWBOX, PROJECT_GOAL_GEOMETRY, START_GEOMETRY, TASK_GEOMETRY } from '../graph-node/geometry'
import { GHOST_GRAPH_NODES, GHOST_GRAPH_SIZE, GHOST_GRAPH_VERTICAL_NODES, GHOST_GRAPH_VERTICAL_SIZE, type GhostGraphNodeKind, type GhostGraphOrientation } from './nodes'

// Ghost graph (labmate panel loading, design 2026-11-05 §4.2): Start → task → goal → milestone → project goal in their
// NOT-STARTED planes (Paper / Well / Well-deep, Fog edge; Start keeps its Ink and Pulse planes) on one Ash rail, the same
// geometry as the real nodes. `animated` runs the tracing light (§10.53): a 56px Pulse bead with an 18px bloom travels the
// rail in ~2.5s of a 3.4s cycle, and each node lights up as the bead passes its centre (150ms up, 390ms back). The
// keyframes live in style.css under [data-slot="ghost-graph"]; reduced motion freezes it to the still graph. `animated:
// false` is the same drawing without the light (the panel's Graph skeleton). The caller gives the status text.
// `orientation="vertical"` stands the same five nodes on a vertical rail, Start at the bottom and the project goal at the
// top, at their sheet sizes — the shape of the panel's level sheets, whose labels sit on the left.
const props = withDefaults(defineProps<{
  animated?: boolean
  orientation?: GhostGraphOrientation
  class?: HTMLAttributes['class']
}>(), { animated: true, orientation: 'horizontal' })

const vertical = computed(() => props.orientation === 'vertical')

const bloomId = `ghost-graph-bloom-${useId()}`
const size = computed(() => (vertical.value ? GHOST_GRAPH_VERTICAL_SIZE : GHOST_GRAPH_SIZE))
const rail = computed(() => vertical.value
  ? `M${GHOST_GRAPH_VERTICAL_SIZE.rail} ${GHOST_GRAPH_VERTICAL_NODES[0]!.y}V${GHOST_GRAPH_VERTICAL_NODES[GHOST_GRAPH_VERTICAL_NODES.length - 1]!.y}`
  : `M${GHOST_GRAPH_NODES[0]!.x} ${GHOST_GRAPH_SIZE.rail}H${GHOST_GRAPH_NODES[GHOST_GRAPH_NODES.length - 1]!.x}`)
/** The bloom's filter region (user space) around the rail. */
const bloom = computed(() => vertical.value
  ? { x: GHOST_GRAPH_VERTICAL_SIZE.rail - 40, y: 70, width: 80, height: 590 }
  : { x: 40, y: 90, width: 720, height: 80 })

type Role = 'l' | 'b' | 'd'
/** Not-started planes by role (light / base / deep) and what they turn into under the light. */
const TONE: Record<Role, { base: string, lit: string }> = {
  l: { base: 'var(--paper)', lit: 'var(--pulse-light)' },
  b: { base: 'var(--well)', lit: 'var(--pulse)' },
  d: { base: 'var(--well-deep)', lit: 'var(--pulse-shade)' },
}
const byRole = (points: readonly string[], roles: readonly Role[]) => points.map((p, i) => ({ points: p, ...TONE[roles[i]!] }))

/** The project goal's bowl keeps its own neutral facets (ProjectGoalNode); the light tints each by its lightness. */
const BOWL = [
  ['var(--paper)', 'l'], ['var(--facet-paper)', 'l'], ['var(--facet-shade)', 'd'], ['var(--well)', 'b'],
  ['var(--well-deep)', 'd'], ['var(--facet-paper)', 'l'], ['var(--fog)', 'd'], ['var(--facet-mid)', 'b'],
] as const
/** The stand (stem, knop, foot) lights with the bowl: the whole node glows as the light passes, like every other node. */
const stand = byRole(PROJECT_GOAL_GEOMETRY.stand, ['l', 'd', 'l', 'd', 'l', 'b', 'd'])

/** Place a node's viewBox box (w × h at scale s) centred on (x, y). */
const place = (x: number, y: number, w: number, h: number, s: number) => `translate(${x - (w * s) / 2} ${y - (h * s) / 2}) scale(${s})`

interface GhostNode {
  kind: GhostGraphNodeKind
  delay: number
  transform: string
  /** The viewBox box and the scale it is drawn at on the horizontal rail. */
  box: { w: number, h: number, s: number }
  seam: { stroke: string, opacity: number, width: number }
  facets: { points: string, base: string, lit: string }[]
  outline: string
  edge: { base: string, width: number }
}

const SHAPE: Record<GhostGraphNodeKind, Omit<GhostNode, 'kind' | 'delay' | 'transform'>> = {
  'start': {
    box: { w: NODE_VIEWBOX.start, h: NODE_VIEWBOX.start, s: 1 },
    seam: { stroke: 'var(--ink)', opacity: 0.25, width: 1 },
    // Start is not a status node: Graphite / Ink / Slate stay put, only its Pulse plane brightens as the light leaves.
    facets: [
      { points: START_GEOMETRY.facets[0], base: 'var(--graphite)', lit: 'var(--graphite)' },
      { points: START_GEOMETRY.facets[1], base: 'var(--ink)', lit: 'var(--ink)' },
      { points: START_GEOMETRY.facets[2], base: 'var(--pulse)', lit: 'var(--pulse-light)' },
      { points: START_GEOMETRY.facets[3], base: 'var(--slate)', lit: 'var(--slate)' },
    ],
    outline: START_GEOMETRY.outline,
    edge: { base: 'var(--ink)', width: 2 },
  },
  'task': {
    box: { w: NODE_VIEWBOX.task, h: NODE_VIEWBOX.task, s: 1 },
    seam: { stroke: 'var(--well-deep)', opacity: 1, width: 0.75 },
    facets: byRole(TASK_GEOMETRY.facets, ['l', 'b', 'd', 'b']),
    outline: TASK_GEOMETRY.outline,
    edge: { base: 'var(--fog)', width: 1.5 },
  },
  'goal': {
    box: { w: NODE_VIEWBOX.goal, h: NODE_VIEWBOX.goal, s: 0.692 },
    seam: { stroke: 'var(--ink)', opacity: 0.18, width: 1 },
    facets: byRole(GOAL_GEOMETRY.facets, ['b', 'd', 'd', 'b', 'l']),
    outline: GOAL_GEOMETRY.outline,
    edge: { base: 'var(--fog)', width: 2 },
  },
  'milestone': {
    box: { w: NODE_VIEWBOX.milestone, h: NODE_VIEWBOX.milestone, s: 0.7 },
    seam: { stroke: 'var(--ink)', opacity: 0.18, width: 1 },
    facets: byRole(MILESTONE_GEOMETRY.facets, ['l', 'b', 'l', 'b', 'd', 'b', 'l', 'd']),
    outline: MILESTONE_GEOMETRY.outline,
    edge: { base: 'var(--fog)', width: 2 },
  },
  'project-goal': {
    box: { w: NODE_VIEWBOX.projectGoal.w, h: NODE_VIEWBOX.projectGoal.h, s: 0.5 },
    seam: { stroke: 'var(--ink)', opacity: 0.18, width: 1 },
    facets: PROJECT_GOAL_GEOMETRY.facets.map((p, i) => ({ points: p, base: BOWL[i]![0], lit: TONE[BOWL[i]![1]].lit })),
    outline: PROJECT_GOAL_GEOMETRY.outline,
    edge: { base: 'var(--fog)', width: 2.5 },
  },
}

const nodes = computed<GhostNode[]>(() => (vertical.value
  ? GHOST_GRAPH_VERTICAL_NODES.map(n => ({ at: [GHOST_GRAPH_VERTICAL_SIZE.rail, n.y, n.scale] as const, n }))
  : GHOST_GRAPH_NODES.map(n => ({ at: [n.x, GHOST_GRAPH_SIZE.rail, SHAPE[n.kind].box.s] as const, n }))
).map(({ at, n }) => {
  const shape = SHAPE[n.kind]
  return { kind: n.kind, delay: n.delay, ...shape, transform: place(at[0], at[1], shape.box.w, shape.box.h, at[2]) }
}))
</script>

<template>
  <svg
    data-slot="ghost-graph"
    :data-animated="props.animated ? '' : undefined"
    :data-orientation="props.orientation"
    :viewBox="`0 0 ${size.width} ${size.height}`"
    :class="cn('block w-full', vertical ? 'max-w-100' : 'max-w-200', props.class)"
    aria-hidden="true"
  >
    <!-- The bloom's filter region must be user-space: a straight rail has a zero-height (or zero-width) bounding box,
         so a percentage region would clip the blur away entirely. -->
    <defs v-if="props.animated">
      <filter :id="bloomId" filterUnits="userSpaceOnUse" :x="bloom.x" :y="bloom.y" :width="bloom.width" :height="bloom.height">
        <feGaussianBlur stdDeviation="5" />
      </filter>
    </defs>
    <path :d="rail" fill="none" stroke="var(--ash)" stroke-width="1.5" />
    <template v-if="props.animated">
      <path data-ghost="light" :d="rail" fill="none" stroke="var(--pulse)" stroke-width="18" stroke-opacity="0.45" :filter="`url(#${bloomId})`" />
      <path data-ghost="light" :d="rail" fill="none" stroke="var(--pulse)" stroke-width="3" stroke-opacity="0.75" />
    </template>
    <g v-for="n in nodes" :key="n.kind" :data-kind="n.kind" :transform="n.transform" :style="{ '--d': `${n.delay}s` }">
      <g :stroke="n.seam.stroke" :stroke-opacity="n.seam.opacity" :stroke-width="n.seam.width" stroke-linejoin="miter">
        <polygon v-for="(f, i) in n.facets" :key="i" data-ghost="facet" :points="f.points" :style="{ '--base': f.base, '--lit': f.lit }" />
      </g>
      <polygon
        data-ghost="edge"
        :points="n.outline"
        fill="none"
        :stroke-width="n.edge.width"
        stroke-linejoin="miter"
        :style="{ '--base': n.edge.base, '--lit': 'var(--pulse-deep)' }"
      />
      <polygon v-if="n.kind === 'goal'" :points="GOAL_GEOMETRY.inner" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="miter" />
      <line
        v-if="n.kind === 'milestone'"
        data-ghost="edge"
        :x1="MILESTONE_GEOMETRY.line.x1"
        :y1="MILESTONE_GEOMETRY.line.y1"
        :x2="MILESTONE_GEOMETRY.line.x2"
        :y2="MILESTONE_GEOMETRY.line.y2"
        stroke-width="1.5"
        :style="{ '--base': 'var(--fog)', '--lit': 'var(--pulse-deep)' }"
      />
      <g v-if="n.kind === 'project-goal'" data-ghost="edge" stroke-width="1.5" stroke-linejoin="miter" :style="{ '--base': 'var(--fog)', '--lit': 'var(--pulse-deep)' }">
        <polygon v-for="(s, i) in stand" :key="i" data-ghost="facet" :points="s.points" :style="{ '--base': s.base, '--lit': s.lit }" />
      </g>
    </g>
  </svg>
</template>

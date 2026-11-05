<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { TaskPriority, WorkStatus } from './types'
import { computed } from 'vue'
import { cn } from '#/lib/utils'
import { TASK_GEOMETRY } from './geometry'
import { STATUS_GLYPH, statusPlanes } from '../status-chip/glyphs'
import NodeLabel from './NodeLabel.vue'
import PriorityLight from './PriorityLight.vue'
import { STATUS_NAME } from './types'

// Task node (§8): a diamond of four facets in its status planes, 56px; the
// status glyph sits in the middle. Priority lights the task only while it is
// ongoing (§10.4). A sub-task (§8.8) is drawn at 60% with the compact label.
const props = withDefaults(defineProps<{
  status?: WorkStatus
  label: string
  /** Task ID, written LAB-nnn (§4.1). */
  code?: string
  priority?: TaskPriority
  sub?: boolean
  /** Traced (§10.5) — lit regardless of priority. */
  lit?: boolean
  showLabel?: boolean
  class?: HTMLAttributes['class']
}>(), { status: 'ongoing', showLabel: true })

const c = computed(() => statusPlanes(props.status))
const glyph = computed(() => STATUS_GLYPH[props.status])
const px = computed(() => props.sub ? 34 : 56)
const lightOn = computed(() => props.lit || props.status === 'ongoing')
</script>

<template>
  <div
    data-slot="graph-node"
    data-kind="task"
    :data-status="status"
    :class="cn('inline-flex flex-col items-center gap-2 pt-1 text-foreground', sub ? 'w-[9.375rem]' : 'w-35', props.class)"
  >
    <span class="relative inline-flex">
      <PriorityLight v-if="lightOn" :radius="sub ? 30 : 50" :priority="priority" :lit="lit" />
      <svg
        viewBox="0 0 56 56"
        :width="px"
        :height="px"
        class="relative shrink-0"
        role="img"
        :aria-label="`Task, ${STATUS_NAME[status]}${priority && status === 'ongoing' ? `, ${priority.toUpperCase()}` : ''}`"
      >
        <g :stroke="c.d" stroke-width="0.75" stroke-linejoin="miter">
          <polygon :points="TASK_GEOMETRY.facets[0]" :fill="c.l" />
          <polygon :points="TASK_GEOMETRY.facets[1]" :fill="c.b" />
          <polygon :points="TASK_GEOMETRY.facets[2]" :fill="c.d" />
          <polygon :points="TASK_GEOMETRY.facets[3]" :fill="c.b" />
        </g>
        <polygon :points="TASK_GEOMETRY.outline" fill="none" stroke="var(--node-edge)" stroke-width="1.5" stroke-linejoin="miter" />
        <g v-if="glyph.d" transform="translate(19 19) scale(0.75)">
          <path :d="glyph.d" :fill="glyph.fill ? c.g : 'none'" :stroke="c.g" stroke-width="2.6" stroke-linejoin="miter" stroke-linecap="square" />
        </g>
      </svg>
    </span>
    <NodeLabel v-if="showLabel" :title="label" :meta="code" :sub="sub" weight="task" />
  </div>
</template>

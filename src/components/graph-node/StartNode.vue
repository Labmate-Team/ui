<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { GraphNodeVariant } from './types'
import { computed } from 'vue'
import { cn } from '#/lib/utils'
import { START_GEOMETRY } from './geometry'
import NodeLabel from './NodeLabel.vue'

// Start node (§8.3): a right-pointing triangle of Ink planes with one Pulse
// plane, 72px. Exactly one per project; no status, no priority, no sub-items. `variant="sheet"` is the 40px form with
// the label on the left; with `level` it is the 30px mark at the bottom of an inner sheet (where that level starts).
const props = withDefaults(defineProps<{
  label?: string
  meta?: string
  showLabel?: boolean
  variant?: GraphNodeVariant
  /** The start of a level, not of the project (sheet form only): drawn smaller. */
  level?: boolean
  class?: HTMLAttributes['class']
}>(), { label: 'Start', meta: 'KICKOFF', showLabel: true, variant: 'default' })

const sheet = computed(() => props.variant === 'sheet')
const px = computed(() => sheet.value ? (props.level ? 30 : 40) : 72)
</script>

<template>
  <div
    data-slot="graph-node"
    data-kind="start"
    :data-variant="variant"
    :class="cn('inline-flex items-center text-foreground', sheet ? 'flex-row gap-3' : 'w-35 flex-col gap-2 pt-1', props.class)"
  >
    <NodeLabel v-if="sheet && showLabel" side="left" :title="label" :meta="meta" weight="goal"><slot /></NodeLabel>
    <svg viewBox="0 0 72 72" :width="px" :height="px" class="shrink-0" role="img" :aria-label="level ? 'Start of this level' : 'Start of the project'">
      <g stroke="var(--ink)" stroke-opacity="0.25" stroke-width="1" stroke-linejoin="miter">
        <polygon :points="START_GEOMETRY.facets[0]" fill="var(--graphite)" />
        <polygon :points="START_GEOMETRY.facets[1]" fill="var(--ink)" />
        <polygon :points="START_GEOMETRY.facets[2]" fill="var(--pulse)" />
        <polygon :points="START_GEOMETRY.facets[3]" fill="var(--slate)" />
      </g>
      <polygon :points="START_GEOMETRY.outline" fill="none" stroke="var(--node-edge)" stroke-width="2" stroke-linejoin="miter" />
    </svg>
    <NodeLabel v-if="!sheet && showLabel" :title="label" :meta="meta" weight="goal"><slot /></NodeLabel>
  </div>
</template>

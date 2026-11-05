<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '#/lib/utils'
import { START_GEOMETRY } from './geometry'
import NodeLabel from './NodeLabel.vue'

// Start node (§8.3): a right-pointing triangle of Ink planes with one Pulse
// plane, 72px. Exactly one per project; no status, no priority, no sub-items.
const props = withDefaults(defineProps<{
  label?: string
  meta?: string
  showLabel?: boolean
  class?: HTMLAttributes['class']
}>(), { label: 'Start', meta: 'KICKOFF', showLabel: true })
</script>

<template>
  <div data-slot="graph-node" data-kind="start" :class="cn('inline-flex w-35 flex-col items-center gap-2 pt-1 text-foreground', props.class)">
    <svg viewBox="0 0 72 72" class="size-18 shrink-0" role="img" aria-label="Start of the project">
      <g stroke="var(--ink)" stroke-opacity="0.25" stroke-width="1" stroke-linejoin="miter">
        <polygon :points="START_GEOMETRY.facets[0]" fill="var(--graphite)" />
        <polygon :points="START_GEOMETRY.facets[1]" fill="var(--ink)" />
        <polygon :points="START_GEOMETRY.facets[2]" fill="var(--pulse)" />
        <polygon :points="START_GEOMETRY.facets[3]" fill="var(--slate)" />
      </g>
      <polygon :points="START_GEOMETRY.outline" fill="none" stroke="var(--node-edge)" stroke-width="2" stroke-linejoin="miter" />
    </svg>
    <NodeLabel v-if="showLabel" :title="label" :meta="meta" weight="goal" />
  </div>
</template>

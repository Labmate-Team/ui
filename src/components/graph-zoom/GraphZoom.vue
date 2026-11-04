<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '#/lib/utils'
import { Button } from '../button'
import { LabIcon } from '../lab-icon'

// The graph's zoom control (labmate panel): one compact Ink-edged strip — zoom out · the scale · zoom in | fit. 36px
// cells (the icon-sm rung) on hairline dividers, 39px tall with the edge; clicking the scale goes back to 100%. The host
// owns the zoom state and places the strip (the panel docks it in the page's bottom-right corner).
const props = withDefaults(defineProps<{
  /** The current scale, as a whole percentage. */
  percent: number
  /** Accessible names (and the scale's title); override with localized strings. */
  labels?: { zoomIn: string, zoomOut: string, reset: string, fit: string }
  class?: HTMLAttributes['class']
}>(), {
  labels: () => ({ zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Back to 100%', fit: 'Fit' }),
})

const emit = defineEmits<{ zoomIn: [], zoomOut: [], reset: [], fit: [] }>()
</script>

<template>
  <div
    data-slot="graph-zoom"
    role="group"
    :class="cn('inline-flex items-stretch bg-background border-(length:--stroke) border-foreground rounded-md', props.class)"
  >
    <Button variant="ghost" size="icon-sm" :aria-label="labels.zoomOut" :title="labels.zoomOut" @click="emit('zoomOut')">
      <LabIcon name="minus" :size="16" />
    </Button>
    <span aria-hidden="true" class="w-px bg-border" />
    <Button variant="ghost" size="sm" class="min-w-13" :aria-label="labels.reset" :title="labels.reset" @click="emit('reset')">
      <span class="text-data">{{ percent }}%</span>
    </Button>
    <span aria-hidden="true" class="w-px bg-border" />
    <Button variant="ghost" size="icon-sm" :aria-label="labels.zoomIn" :title="labels.zoomIn" @click="emit('zoomIn')">
      <LabIcon name="add" :size="16" />
    </Button>
    <span aria-hidden="true" class="w-px bg-border" />
    <Button variant="ghost" size="icon-sm" :aria-label="labels.fit" :title="labels.fit" @click="emit('fit')">
      <LabIcon name="fit" :size="16" />
    </Button>
  </div>
</template>

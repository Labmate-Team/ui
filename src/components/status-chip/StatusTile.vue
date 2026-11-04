<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { NodeStatus } from './types'
import { computed } from 'vue'
import { cn } from '#/lib/utils'
import { nodeStatusMark } from './glyphs'
import { NODE_STATUS_LABEL } from './types'

// The status tile: a StatusChip reduced to its square — the status base plane, its edge and its glyph, no text — for
// rows too narrow for a chip (a menu row, a select trigger). Colour and glyph travel together (§14.2); not-started has
// no glyph (§3.3), so its tile is the well plate alone. Takes any node status, a milestone's locked / ready included.
const props = defineProps<{
  status: NodeStatus
  /** Accessible name; overrides the English default (pass the localized status). */
  label?: string
  class?: HTMLAttributes['class']
}>()

const mark = computed(() => nodeStatusMark(props.status))
</script>

<template>
  <span
    data-slot="status-tile"
    :data-status="status"
    role="img"
    :aria-label="label ?? NODE_STATUS_LABEL[status]"
    :class="cn('inline-flex size-3.5 shrink-0 items-center justify-center border', props.class)"
    :style="{ backgroundColor: mark.planes.b, borderColor: mark.edge, color: mark.planes.g }"
  >
    <svg v-if="mark.glyph.d" viewBox="0 0 24 24" class="size-2.5" aria-hidden="true">
      <path
        :d="mark.glyph.d"
        :fill="mark.glyph.fill ? 'currentColor' : 'none'"
        :stroke="mark.glyph.fill ? 'none' : 'currentColor'"
        stroke-width="2.6"
        stroke-linejoin="miter"
        stroke-linecap="square"
      />
    </svg>
  </span>
</template>

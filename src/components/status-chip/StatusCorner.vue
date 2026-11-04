<script setup lang="ts">
import type { NodeStatus } from './types'
import { computed } from 'vue'
import { nodeStatusMark } from './glyphs'

// The status corner: a small triangle in the host's top-left corner, filled with the status base plane and edged with
// its deep plane — a row's status at a glance (labmate panel: the graph's focus picker). Colour never travels alone
// (§14.2): pair it with StatusTile, as Select does from its one `status` prop. The host must be `relative`.
// `bevel` is for a host whose top-left corner is cut (a chamfered control, 8px at the 1.5px field edge): there is no
// corner left for a triangle, so the mark becomes a band along the cut, inside the edge.
// The root is a <span>, not the <svg>: a menu row whose first child is an <svg> is laid out as a leading-icon row
// (menu leading icons, style.css), which would squeeze the row's text into a narrow column.
const props = defineProps<{ status: NodeStatus, bevel?: boolean }>()

const mark = computed(() => nodeStatusMark(props.status))
</script>

<template>
  <span
    data-slot="status-corner"
    :data-status="status"
    aria-hidden="true"
    class="pointer-events-none absolute top-0 left-0 flex"
    :class="bevel ? 'size-[1.125rem]' : 'size-2.5'"
  >
    <svg class="size-full" :viewBox="bevel ? '0 0 18 18' : '0 0 10 10'">
      <polygon v-if="bevel" points="1.5,10.1 10.1,1.5 17,1.5 1.5,17" :fill="mark.planes.b" :stroke="mark.edge" stroke-width="1" />
      <polygon v-else points="0.5,0.5 9.5,0.5 0.5,9.5" :fill="mark.planes.b" :stroke="mark.edge" stroke-width="1" />
    </svg>
  </span>
</template>

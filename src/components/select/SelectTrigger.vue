<script setup lang="ts">
import type { SelectTriggerProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { NodeStatus } from '../status-chip'
import { reactiveOmit } from '@vueuse/core'
import { ChevronDown } from 'lucide-vue-next'
import { SelectIcon, SelectTrigger, useForwardProps } from 'reka-ui'
import { cn } from '#/lib/utils'
import { selectTriggerClass } from '#/lib/trigger'
import { StatusCorner, StatusTile } from '../status-chip'

const props = withDefaults(
  // `status`: the chosen value's node status, shown as on its menu row (SelectItem `status`) — a band along the trigger's
  // cut top-left corner (StatusCorner `bevel`) and a StatusTile before the chevron. `statusLabel`: the tile's localized name.
  defineProps<SelectTriggerProps & { class?: HTMLAttributes['class'], size?: 'sm' | 'default' | 'lg', status?: NodeStatus, statusLabel?: string }>(),
  { size: 'default' },
)

const delegatedProps = reactiveOmit(props, 'class', 'size', 'status', 'statusLabel')
const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectTrigger
    data-slot="select-trigger"
    :data-size="size"
    v-bind="forwardedProps"
    :class="cn(selectTriggerClass, 'w-fit', status && 'relative', props.class)"
  >
    <StatusCorner v-if="status" :status="status" bevel />
    <slot />
    <StatusTile v-if="status" :status="status" :label="statusLabel" class="ml-auto" />
    <SelectIcon as-child>
      <ChevronDown class="size-4 opacity-50" />
    </SelectIcon>
  </SelectTrigger>
</template>

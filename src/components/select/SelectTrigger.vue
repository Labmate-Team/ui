<script setup lang="ts">
import type { SelectTriggerProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { NodeStatus } from '../status-chip'
import { reactiveOmit } from '@vueuse/core'
import { ChevronDown } from 'lucide-vue-next'
import { SelectIcon, SelectTrigger, useForwardProps } from 'reka-ui'
import { cn } from '#/lib/utils'
import { selectTriggerClass } from '#/lib/trigger'
import { StatusTile } from '../status-chip'

const props = withDefaults(
  // `status`: the chosen value's node status, shown as on its menu row (SelectItem `status`): a StatusTile before the value.
  // The trigger then packs from the start and the chevron takes the free space (ml-auto). `statusLabel`: the tile's localized name.
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
    :class="cn(selectTriggerClass, 'w-fit', status && 'justify-start', props.class)"
  >
    <StatusTile v-if="status" :status="status" :label="statusLabel" />
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="size-4 opacity-50" :class="status && 'ml-auto'" />
    </SelectIcon>
  </SelectTrigger>
</template>

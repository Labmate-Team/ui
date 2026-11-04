<script setup lang="ts">
import type { SelectItemProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { NodeStatus } from '../status-chip'
import { reactiveOmit } from '@vueuse/core'
import { Check } from 'lucide-vue-next'
import {
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  useForwardProps,
} from 'reka-ui'
import { menuItemClass } from '#/lib/menu'
import { cn } from '#/lib/utils'
import { StatusTile } from '../status-chip'

// `status` leads the row with a node status (labmate panel: the graph's focus picker): a StatusTile before the text,
// colour and glyph together (§14.2). The tile is a <span>, so the row stays a plain flex row (gap-2), not the menu's
// leading-icon grid, and it sits outside SelectItemText, so the trigger's SelectValue shows the text alone.
// `statusLabel` is the tile's localized accessible name.
const props = defineProps<SelectItemProps & { class?: HTMLAttributes['class'], status?: NodeStatus, statusLabel?: string }>()

const delegatedProps = reactiveOmit(props, 'class', 'status', 'statusLabel')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectItem
    data-slot="select-item"
    v-bind="forwardedProps"
    :class="
      cn(
        menuItemClass,
        'pr-9',
        '*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
        props.class,
      )
    "
  >
    <StatusTile v-if="status" :status="status" :label="statusLabel" />
    <span class="absolute right-3 flex size-3.5 items-center justify-center">
      <SelectItemIndicator>
        <slot name="indicator-icon">
          <Check class="size-4" />
        </slot>
      </SelectItemIndicator>
    </span>

    <SelectItemText data-slot="select-item-text">
      <slot />
    </SelectItemText>
  </SelectItem>
</template>

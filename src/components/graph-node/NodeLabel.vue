<script setup lang="ts">
// The label of every node (§8.2): a title, then a mono meta line. Under the shape by default; `side="left"` is the
// sheet form — a fixed 172px box to the LEFT of the shape, right-aligned, the title clamped to two lines. A sub-item
// (§8.8) uses the compact pair — 12px title, 10px meta. The default slot sits under the meta line (host marks).
// The host may fade labels as a group by setting `--graph-label-opacity` on an ancestor (the panel's stacked view),
// and enlarge a label against a shrunken node with `--graph-label-scale` (it grows away from the shape).
withDefaults(defineProps<{
  title: string
  meta?: string
  sub?: boolean
  side?: 'bottom' | 'left'
  /** Title rung for main nodes; larger kinds carry a heavier title. */
  weight?: 'task' | 'goal' | 'milestone' | 'project'
}>(), { weight: 'task', side: 'bottom' })

const titleClass = {
  task: 'text-[0.8125rem] font-semibold leading-tight',
  goal: 'text-[0.9375rem] font-semibold leading-tight',
  milestone: 'text-[1.0625rem] font-bold leading-tight tracking-[-0.01em]',
  project: 'text-[1.125rem] font-bold leading-tight tracking-[-0.01em]',
}
</script>

<template>
  <span
    data-slot="graph-node-label"
    class="flex flex-col gap-0.5 scale-[var(--graph-label-scale,1)] opacity-[var(--graph-label-opacity,1)]"
    :class="side === 'left' ? 'w-43 shrink-0 origin-right items-end text-right' : 'max-w-full origin-top items-center text-center'"
  >
    <span
      v-if="side === 'left'"
      class="line-clamp-2 max-w-full text-[0.8125rem] leading-tight wrap-anywhere"
      :class="weight === 'task' ? 'font-medium' : 'font-semibold'"
    >{{ title }}</span>
    <span v-else :class="sub ? 'text-caption font-semibold leading-tight' : titleClass[weight]">{{ title }}</span>
    <span
      v-if="meta"
      class="font-mono tracking-[0.06em] text-subtle-foreground"
      :class="side === 'left' ? 'line-clamp-2 max-w-full text-[0.625rem] wrap-anywhere' : sub ? 'text-[0.625rem]' : 'text-[0.6875rem]'"
    >{{ meta }}</span>
    <slot />
  </span>
</template>

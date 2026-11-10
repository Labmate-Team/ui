<script setup lang="ts">
// "Has an inside": two stacked sheets at the lower right of a node that holds other nodes (labmate graph recursion).
// `size` is the drawn size of the shape it sits on; the badge is placed from the shape's centre.
const props = defineProps<{ size: number }>()
const r = () => props.size / 2
</script>

<template>
  <svg
    data-slot="graph-node-inside"
    viewBox="-9 -3 18 12"
    width="18"
    height="12"
    class="pointer-events-none absolute"
    :style="{ left: `${r() + r() * 0.95 - 9}px`, top: `${r() + r() * 0.78 - 6}px` }"
    aria-hidden="true"
  >
    <g fill="var(--paper)" stroke="var(--ink)" stroke-width="1.2" stroke-linejoin="miter">
      <path d="M-8,5 0,8 8,5 0,2Z" />
      <path d="M-8,1 0,4 8,1 0,-2Z" />
    </g>
  </svg>
</template>

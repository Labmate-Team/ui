<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { TextareaCounter } from '.'
import { useVModel } from '@vueuse/core'
import { computed, ref, useAttrs, useId, watch } from 'vue'
import { cn } from '#/lib/utils'

// Attributes (placeholder, rows, aria-*, listeners) always land on the <textarea>, also when the counter wraps it.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  defaultValue?: string | number
  modelValue?: string | number
  size?: 'sm' | 'default' | 'lg'
  /**
   * The character count in the lower right of the box, on its own line under the text (the box is the field: text that
   * scrolls under a height cap never runs under the count). It appears once the length reaches `from` and then stays for
   * the life of the component, also when the text is cut back below `from`. Past `max` the edge turns Spark and the
   * field is `aria-invalid`; input is never cut. `length` is the host's count (e.g. code points); without it the
   * component counts the code points of the value. With a counter, `class` sizes the outer box.
   */
  counter?: TextareaCounter
}>(), {
  size: 'default',
})

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const attrs = useAttrs()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const sizeClass = computed(() => ({
  sm: 'min-h-14 px-2.5 py-1.5 text-body',
  default: 'min-h-16 px-3 py-2 text-label',
  lg: 'min-h-20 px-3.5 py-2.5 text-control',
}[props.size]))

const length = computed(() => props.counter?.length ?? [...String(modelValue.value ?? '')].length)
const over = computed(() => props.counter !== undefined && length.value > props.counter.max)
// Once shown, the count stays until the component unmounts (it never flickers away while the user trims the text).
const counterShown = ref(false)
watch(() => props.counter !== undefined && length.value >= props.counter.from, (reached) => {
  if (reached)
    counterShown.value = true
}, { immediate: true })

const numberFormat = new Intl.NumberFormat('en-US')
const counterText = computed(() => props.counter ? `${numberFormat.format(length.value)} / ${numberFormat.format(props.counter.max)}` : '')
const counterId = useId()
// Over the limit the field is invalid (the Spark edge); otherwise the host's own aria-invalid stands. The counter
// describes the field once shown.
const ariaInvalid = computed(() => over.value ? true : attrs['aria-invalid'] as boolean | 'true' | 'false' | undefined)
const ariaDescribedby = computed(() => {
  const host = attrs['aria-describedby'] as string | undefined
  return counterShown.value ? [host, counterId].filter(Boolean).join(' ') : host
})

const fieldClass = 'flex field-sizing-content w-full rounded-md tracking-[0.01em] text-foreground'
const fieldStateClass = ['outline-none resize-none', 'disabled:cursor-not-allowed disabled:opacity-40']
</script>

<template>
  <textarea
    v-if="!counter"
    v-bind="attrs"
    v-model="modelValue"
    data-slot="textarea"
    :data-size="props.size"
    :class="cn(
      fieldClass,
      sizeClass,
      fieldStateClass,
      props.class
    )"
  />
  <div
    v-else
    data-slot="textarea-counter-box"
    :class="cn('flex w-full flex-col rounded-md', props.class)"
  >
    <textarea
      v-bind="attrs"
      v-model="modelValue"
      data-slot="textarea"
      :data-size="props.size"
      :aria-invalid="ariaInvalid"
      :aria-describedby="ariaDescribedby"
      :class="cn(
        fieldClass,
        sizeClass,
        fieldStateClass,
        'flex-1 min-h-0',
      )"
    />
    <span
      v-if="counterShown"
      :id="counterId"
      data-slot="textarea-counter"
      :data-over="over ? 'true' : undefined"
      :class="cn(
        'pointer-events-none self-end px-3 pb-2 text-data',
        over ? 'font-medium text-foreground' : 'text-muted-foreground',
      )"
    >{{ counterText }}</span>
  </div>
</template>

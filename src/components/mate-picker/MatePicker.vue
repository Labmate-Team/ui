<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { MatePickerCandidate, MatePickerRole, MatePickerRow } from './types'
import { useId } from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { Command, CommandGroup, CommandItem, CommandKeyBridge, CommandList } from '#/components/command'
import { InputGroup, InputGroupAddon, InputGroupInput } from '#/components/input-group'
import { LabIcon } from '#/components/lab-icon'
import { MateAvatar } from '#/components/mate-avatar'
import { Popover, PopoverAnchor, PopoverContent } from '#/components/popover'
import { Select, SelectContent, SelectItem, SelectItemText, SelectTrigger, SelectValue } from '#/components/select'
import { TagChip } from '#/components/tag-chip'
import { TextButton } from '#/components/text-button'
import { menuLabelClass } from '#/lib/menu'
import { cn } from '#/lib/utils'

// Mate picker — add people by searching. The host owns the data: it fetches `candidates` for the `query` (v-model) and
// turns add / remove / role events into its own list; the picker only composes.
// - Chosen people, one row each: avatar, name (+ note chip), a role Select, a remove TextButton. The avatar is the
//   Select's height (md = 36px = the sm trigger), so the row's boxes share one top and bottom edge.
// - Below them a search field (search glyph + input). While it has text and focus, a floating Command list anchored to it
//   shows the candidates not chosen yet (avatar, name, note chip, hint on the right). Avatars are plain human octagons: a
//   label may carry an id tail, so initials derived from it would mislead. Focus stays in the Input (CommandKeyBridge): ↑/↓ move the
//   highlight, Enter adds the highlighted row (each result set opens with its first row highlighted), Esc closes the list
//   until the text changes or the field is focused again. While there is text, Enter never submits a surrounding form;
//   keys during IME composition are left alone.
// - Adding clears the query and keeps focus in the Input, ready for the next person.
// Status lines (loading, no matches, footer) take the quiet menu label rung. Strings default to English; hosts localize
// through the *Text / *Label props.
const props = withDefaults(defineProps<{
  selected: readonly MatePickerRow[]
  roles: readonly MatePickerRole[]
  candidates: readonly MatePickerCandidate[]
  placeholder?: string
  /** One quiet line under the candidates (e.g. "showing the first 8"). */
  footer?: string
  loading?: boolean
  loadingText?: string
  emptyText?: string
  removeLabel?: string
  /** Accessible name of a row's role Select. */
  roleLabel?: (row: MatePickerRow) => string
  class?: HTMLAttributes['class']
}>(), {
  placeholder: 'Search people',
  footer: undefined,
  loading: false,
  loadingText: 'Searching…',
  emptyText: 'No matches',
  removeLabel: 'Remove',
  roleLabel: (row: MatePickerRow) => `Role of ${row.label}`,
  class: undefined,
})
const query = defineModel<string>('query', { default: '' })
const emit = defineEmits<{
  'add': [candidate: MatePickerCandidate]
  'remove': [id: string]
  'update:role': [id: string, role: string]
}>()

const listId = useId()
const anchor = ref<HTMLElement | null>(null)
const bridge = ref<InstanceType<typeof CommandKeyBridge> | null>(null)
const focused = ref(false)
const dismissed = ref(false)
watch(query, () => { dismissed.value = false })

const visible = computed(() => props.candidates.filter(c => !props.selected.some(s => s.id === c.id)))
// A new result set mounts a fresh list, so its first row is the highlighted one (never a row that just left).
const listKey = computed(() => visible.value.map(c => c.id).join('\n'))
const open = computed(() => focused.value && !dismissed.value && query.value.trim() !== '')

function add(c: MatePickerCandidate): void {
  emit('add', c)
  query.value = ''
}

function onFocus(): void {
  focused.value = true
  dismissed.value = false
}

function onKeydown(e: KeyboardEvent): void {
  if (e.isComposing)
    return
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    if (!open.value || !bridge.value)
      return
    e.preventDefault()
    bridge.value.navigate(e)
  }
  else if (e.key === 'Enter') {
    if (query.value.trim() === '')
      return
    e.preventDefault()
    if (!open.value)
      return
    if (bridge.value?.hasHighlight)
      bridge.value.select(e)
    else if (visible.value[0])
      add(visible.value[0])
  }
}

// Pressing on the field itself is not "outside" the list.
function onInteractOutside(e: Event): void {
  if (anchor.value && e.target instanceof Node && anchor.value.contains(e.target))
    e.preventDefault()
}
</script>

<template>
  <div data-slot="mate-picker" :class="cn('flex flex-col gap-3', props.class)">
    <div v-for="row in selected" :key="row.id" data-slot="mate-picker-row" class="flex items-center gap-3">
      <MateAvatar kind="human" :name="row.label" initials="" size="md" />
      <span class="min-w-0 flex-1 truncate text-control" :title="row.label">{{ row.label }}</span>
      <TagChip v-if="row.note">
        {{ row.note }}
      </TagChip>
      <Select :model-value="row.role" @update:model-value="(v) => emit('update:role', row.id, String(v))">
        <SelectTrigger size="sm" class="w-30" :aria-label="roleLabel(row)">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="r in roles" :key="r.value" :value="r.value">
            <SelectItemText>{{ r.label }}</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>
      <TextButton type="button" @click="emit('remove', row.id)">
        {{ removeLabel }}
      </TextButton>
    </div>
    <Popover :open="open" @update:open="(v: boolean) => { if (!v) dismissed = true }">
      <PopoverAnchor as-child>
        <div ref="anchor">
          <InputGroup size="sm">
            <InputGroupAddon align="inline-start">
              <LabIcon name="search" :size="16" />
            </InputGroupAddon>
            <InputGroupInput
              v-model="query"
              role="combobox"
              aria-autocomplete="list"
              autocomplete="off"
              :aria-expanded="open"
              :aria-controls="open ? listId : undefined"
              :aria-label="placeholder"
              :placeholder="placeholder"
              @focus="onFocus"
              @blur="focused = false"
              @keydown="onKeydown"
            />
          </InputGroup>
        </div>
      </PopoverAnchor>
      <!-- mousedown.prevent: pressing a row must not blur the field (the list closes on blur) -->
      <PopoverContent
        menu
        align="start"
        class="w-(--reka-popover-trigger-width)"
        @open-auto-focus.prevent
        @close-auto-focus.prevent
        @interact-outside="onInteractOutside"
        @mousedown.prevent
      >
        <Command :key="listKey" model-value="" highlight-first-on-open>
          <CommandKeyBridge ref="bridge">
            <CommandList :id="listId">
              <CommandGroup>
                <CommandItem v-for="c in visible" :key="c.id" :value="c.id" @select="add(c)">
                  <MateAvatar kind="human" :name="c.label" initials="" size="sm" />
                  <span class="min-w-0 truncate">{{ c.label }}</span>
                  <TagChip v-if="c.note">
                    {{ c.note }}
                  </TagChip>
                  <span v-if="c.hint" class="ml-auto shrink-0 text-muted-foreground">{{ c.hint }}</span>
                </CommandItem>
                <div v-if="visible.length === 0" :class="menuLabelClass">
                  {{ loading ? loadingText : emptyText }}
                </div>
                <div v-if="footer" :class="menuLabelClass">
                  {{ footer }}
                </div>
              </CommandGroup>
            </CommandList>
          </CommandKeyBridge>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>

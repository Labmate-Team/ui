import type { LabIconName } from '../lab-icon'

export { default as SegmentedControl } from './SegmentedControl.vue'

export interface SegmentedItem<V extends string | number = string> {
  value: V
  label?: string
  disabled?: boolean
  /** Draw only this icon; `label` then names the segment (its `aria-label` and tooltip). */
  icon?: LabIconName
}

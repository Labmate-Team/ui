export { default as Textarea } from './Textarea.vue'

/** The Textarea's character count: shown from `from` on (and then for good), `max` the limit; `length` the host's count. */
export interface TextareaCounter {
  max: number
  from: number
  length?: number
}

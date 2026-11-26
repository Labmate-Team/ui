import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { Textarea } from '#/components/textarea'

const SIZES = ['default', 'sm', 'lg'] as const

export const textareaSpec: ComponentSpec = {
  id: 'textarea',
  name: 'Textarea',
  description:
    'Multi-line text field sharing the Input field-edge contract: one inset hairline, swapped in place on focus.',
  descriptionZh:
    '多行文本输入，与 Input 共享 field-edge 契约：一条内嵌发丝线，聚焦时原位换色。',
  controls: [
    { kind: 'enum', key: 'size', label: 'Size', options: SIZES, default: 'default' },
    { kind: 'string', key: 'placeholder', label: 'Placeholder', default: 'Tell the bot what to do…' },
    { kind: 'number', key: 'rows', label: 'Rows', default: 3, min: 2, max: 10 },
    { kind: 'boolean', key: 'disabled', label: 'Disabled', default: false },
  ],
  examples: [
    {
      name: 'Character count',
      nameZh: '字数',
      note: '`counter` shows "n / max" once the length reaches `from`, and keeps it shown after the text is cut back. Past `max` the edge turns Spark. `length` is the host\'s own count (code points here).',
      noteZh: '`counter` 在长度到 `from` 时显示「n / max」, 删回去也不收起。超过 `max` 时边框变 Spark。`length` 是宿主自己数的长度 (这里按码点)。',
      render: () => [
        h(Textarea, { modelValue: 'Below the threshold: no count yet.', counter: { max: 2000, from: 1800, length: 1240 }, class: 'w-80' }),
        h(Textarea, { modelValue: 'Past the threshold: the count shows.', counter: { max: 2000, from: 1800, length: 1812 }, class: 'w-80' }),
        h(Textarea, { modelValue: 'Over the limit: Spark edge.', counter: { max: 2000, from: 1800, length: 2034 }, class: 'w-80' }),
      ],
    },
    {
      name: 'Count at a height cap',
      nameZh: '到了高度上限',
      note: 'With a height cap on the text (here `[&>textarea]:max-h-32`) the text scrolls inside the box; the count has its own line under it and is never covered.',
      noteZh: '给文字设了高度上限 (这里是 `[&>textarea]:max-h-32`) 时文字在框里滚动; 字数在它下面单独一行, 不会被文字盖住。',
      render: () => h(Textarea, {
        modelValue: Array.from({ length: 24 }, (_, i) => `Line ${i + 1} of a long note that runs past the height cap.`).join('\n'),
        counter: { max: 2000, from: 1000 },
        class: 'w-80 [&>textarea]:max-h-32 [&>textarea]:overflow-y-auto',
      }),
    },
    {
      name: 'Count that stays',
      nameZh: '出现后不收起',
      note: 'Type past 30 characters, then delete: the count stays. Over 40 the edge turns Spark.',
      noteZh: '打到 30 个字以上再删回去: 字数不收起。超过 40 个字边框变 Spark。',
      state: { text: 'Type here' },
      render: state => h(Textarea, {
        modelValue: String(state.text),
        'onUpdate:modelValue': (v: unknown) => (state.text = String(v)),
        counter: { max: 40, from: 30 },
        class: 'w-80',
      }),
    },
  ],
  render: state =>
    h(Textarea, {
      size: state.size as never,
      placeholder: String(state.placeholder),
      rows: Number(state.rows),
      disabled: Boolean(state.disabled),
      class: 'w-80',
    }),
}

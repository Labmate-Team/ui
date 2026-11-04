import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { ActivityChip } from '#/components/activity-chip'
import { NODE_STATUSES, StatusChip, StatusCorner, StatusTile, WORK_STATUSES } from '#/components/status-chip'

export const statusChipSpec: ComponentSpec = {
  id: 'status-chip',
  name: 'StatusChip',
  description:
    'A work-status chip: the status plane plus its glyph plus a mono label. Colour and glyph always travel together.',
  descriptionZh:
    '工作状态 chip：状态色面 + 状态字形 + 等宽标签。颜色和字形永远一起出现。',
  controls: [
    { kind: 'enum', key: 'status', label: 'Status', options: WORK_STATUSES, default: 'ongoing' },
    { kind: 'boolean', key: 'chamfer', label: 'Chamfer', default: false },
  ],
  examples: [
    {
      name: 'Every status',
      nameZh: '全部状态',
      render: () => WORK_STATUSES.map(status => h(StatusChip, { status })),
    },
    {
      name: 'Activity',
      nameZh: '活动状态',
      note: 'ActivityChip — what a mate is doing now. Blocked is a hatched strip in an Ink frame; done a hexagon-check in a Fog frame.',
      render: () => (['running', 'planning', 'waiting', 'blocked', 'idle', 'done'] as const).map(status => h(ActivityChip, { status })),
    },
    {
      name: 'Tile and corner',
      nameZh: '方块与角标',
      note: 'For rows too narrow for a chip (menu rows, select triggers): StatusTile is the chip reduced to its square; StatusCorner marks the row\'s top-left corner. They travel together — Select does both from one `status` prop. Both take a milestone\'s locked / ready too.',
      render: () => NODE_STATUSES.map(status =>
        // Demo staging only: a bare 40px Paper square so the corner has a host corner to sit in.
        h('span', { class: 'relative inline-flex size-10 items-center justify-center border border-border bg-background' }, [
          h(StatusCorner, { status }),
          h(StatusTile, { status }),
        ])),
    },
    {
      name: 'Chamfered',
      nameZh: '切角',
      note: 'Opt-in: `chamfer` cuts the top-left and bottom-right corners.',
      render: () => [
        ...WORK_STATUSES.map(status => h(StatusChip, { status, chamfer: true })),
        ...(['running', 'planning', 'idle'] as const).map(status => h(ActivityChip, { status, chamfer: true })),
      ],
    },
  ],
  render: state => h(StatusChip, { status: state.status as never, chamfer: Boolean(state.chamfer) }),
  usage: `Use StatusChip wherever a task, goal or milestone shows its status.

- Halted means stopped from outside (a dependency, a decision, a policy). Paused means its owner stopped it on purpose.
- Pass \`label\` for the localized string; the plate and glyph never change.`,
  usageZh: `任务、目标、里程碑展示状态时都用 StatusChip。

- Halted 是被外部叫停（依赖、决策、政策）；Paused 是负责人主动暂停。
- 用 \`label\` 传入本地化文字；色面和字形不变。`,
}

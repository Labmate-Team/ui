import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { GoalNode, GRAPH_NODE_VARIANTS, MilestoneNode, ProjectGoalNode, StartNode, TaskNode } from '#/components/graph-node'
import { WORK_STATUSES } from '#/components/status-chip'

const MILESTONE_STATUSES = ['locked', 'ready', 'not-started', 'ongoing', 'completed', 'halted'] as const
const PROJECT_STATUSES = ['not-started', 'ongoing', 'completed', 'halted'] as const

export const startNodeSpec: ComponentSpec = {
  id: 'start-node',
  name: 'StartNode',
  description: 'Where the project begins: a right-pointing triangle of Ink planes with one Pulse plane, 72px. Exactly one; no status.',
  descriptionZh: '项目起点:由墨色面组成、带一个 Pulse 面的右指三角形,72px。唯一,没有状态。',
  controls: [
    { kind: 'string', key: 'label', label: 'Label', default: 'Start' },
    { kind: 'string', key: 'meta', label: 'Meta', default: 'KICKOFF · SEP 02' },
    { kind: 'boolean', key: 'showLabel', label: 'Show label', default: true },
    { kind: 'enum', key: 'variant', label: 'Variant', options: GRAPH_NODE_VARIANTS, default: 'default', display: 'segmented' },
    { kind: 'boolean', key: 'level', label: 'Start of a level', default: false },
  ],
  examples: [
    {
      name: 'On a sheet',
      nameZh: '纸上的样子',
      note: 'The sheet variant puts the label on the left at 40px; `level` is the smaller mark at the bottom of an inner sheet.',
      render: () => [h(StartNode, { variant: 'sheet', label: 'Start', meta: 'KICKOFF' }), h(StartNode, { variant: 'sheet', level: true, label: 'Start', meta: 'OPEN · NOV 03' })],
    },
  ],
  render: state => h(StartNode, { label: String(state.label), meta: String(state.meta), showLabel: Boolean(state.showLabel), variant: state.variant as never, level: Boolean(state.level) }),
}

export const taskNodeSpec: ComponentSpec = {
  id: 'task-node',
  name: 'TaskNode',
  description: 'One unit of work: a four-facet diamond in its status planes, 56px. Priority lights it only while ongoing.',
  descriptionZh: '一个工作单元:按状态着色的四面菱形,56px。优先级只在进行中时点亮光晕。',
  controls: [
    { kind: 'enum', key: 'status', label: 'Status', options: WORK_STATUSES, default: 'ongoing' },
    { kind: 'enum', key: 'priority', label: 'Priority', options: ['none', 'p1', 'p2', 'p3'], default: 'p1', display: 'segmented' },
    { kind: 'enum', key: 'variant', label: 'Variant', options: GRAPH_NODE_VARIANTS, default: 'default', display: 'segmented' },
    { kind: 'boolean', key: 'inside', label: 'Has an inside', default: false },
    { kind: 'boolean', key: 'sub', label: 'Sub-task', default: false },
    { kind: 'boolean', key: 'lit', label: 'Traced', default: false },
    { kind: 'string', key: 'label', label: 'Label', default: 'Draft intro section' },
    { kind: 'string', key: 'code', label: 'Code', default: 'LAB-201' },
  ],
  examples: [
    {
      name: 'Every status',
      nameZh: '全部状态',
      render: () => WORK_STATUSES.map(status => h(TaskNode, { status, label: 'Run baseline', code: 'LAB-204' })),
    },
    {
      name: 'Light = priority',
      nameZh: '光 = 优先级',
      note: 'Only ongoing tasks are lit: P1 brightest, P3 a faint inner ring.',
      render: () => (['p1', 'p2', 'p3'] as const).map(priority => h(TaskNode, { status: 'ongoing', priority, label: priority.toUpperCase(), code: 'LAB-210' })),
    },
    {
      name: 'Sub-task',
      nameZh: '子任务',
      note: 'A sub-item is drawn at 60% with the compact label.',
      render: () => [h(TaskNode, { status: 'ongoing', label: 'Main task', code: 'LAB-220' }), h(TaskNode, { status: 'completed', sub: true, label: 'Clean data', code: 'LAB-221' })],
    },
    {
      name: 'On a sheet',
      nameZh: '纸上的样子',
      note: 'Label on the left in a fixed box, two lines at most, 36px; `inside` adds the stacked-layers badge; `meta` replaces the code line.',
      render: () => [
        h(TaskNode, { variant: 'sheet', status: 'ongoing', priority: 'p1', label: 'Run the baseline on every split', meta: 'LAB-204 · ONGOING' }),
        h(TaskNode, { variant: 'sheet', status: 'not-started', inside: true, label: 'A task that holds other tasks and has a long title that wraps and is cut', meta: 'LAB-205 · NOT STARTED' }),
      ],
    },
  ],
  render: state => h(TaskNode, {
    status: state.status as never,
    priority: state.priority === 'none' ? undefined : state.priority as never,
    variant: state.variant as never,
    inside: Boolean(state.inside),
    sub: Boolean(state.sub),
    lit: Boolean(state.lit),
    label: String(state.label),
    code: String(state.code),
  }),
}

export const goalNodeSpec: ComponentSpec = {
  id: 'goal-node',
  name: 'GoalNode',
  description: 'A research question or aim: a five-facet pentagon, 104px. Facets light clockwise from the top as sub-items complete.',
  descriptionZh: '一个研究问题或目标:五面五边形,104px。子项完成时,各面从顶部顺时针点亮。',
  controls: [
    { kind: 'enum', key: 'status', label: 'Status', options: WORK_STATUSES, default: 'ongoing' },
    { kind: 'number', key: 'done', label: 'Done', default: 3, min: 0, max: 50 },
    { kind: 'number', key: 'total', label: 'Total', default: 5, min: 1, max: 50 },
    { kind: 'enum', key: 'variant', label: 'Variant', options: GRAPH_NODE_VARIANTS, default: 'default', display: 'segmented' },
    { kind: 'boolean', key: 'inside', label: 'Has an inside', default: false },
    { kind: 'boolean', key: 'sub', label: 'Sub-goal', default: false },
    { kind: 'string', key: 'label', label: 'Label', default: 'RQ1 · Which factors drive the effect?' },
  ],
  examples: [
    {
      name: 'Shape is progress',
      nameZh: '形状即进度',
      render: () => [0, 1, 2, 3, 4, 5].map(done => h(GoalNode, { status: done === 0 ? 'not-started' : done === 5 ? 'completed' : 'ongoing', done, total: 5, label: `${done} of 5` })),
    },
    {
      name: 'Every status',
      nameZh: '全部状态',
      render: () => WORK_STATUSES.map(status => h(GoalNode, { status, done: 3, total: 5, label: 'RQ2' })),
    },
    {
      name: 'On a sheet',
      nameZh: '纸上的样子',
      render: () => [h(GoalNode, { variant: 'sheet', inside: true, status: 'ongoing', done: 3, total: 7, label: 'RQ1 · Which factors drive the effect?', meta: '3/7 · ONGOING' })],
    },
  ],
  render: state => h(GoalNode, {
    status: state.status as never,
    done: Number(state.done),
    total: Number(state.total),
    variant: state.variant as never,
    inside: Boolean(state.inside),
    sub: Boolean(state.sub),
    label: String(state.label),
  }),
}

export const milestoneNodeSpec: ComponentSpec = {
  id: 'milestone-node',
  name: 'MilestoneNode',
  description: 'A goal set from outside — submit the paper, give the talk. A cut gem in a 24-segment ring that drains toward the deadline.',
  descriptionZh: '外部设定的目标——投稿、报告。24 段倒计时环中的切面宝石,随截止日期逐段流失。',
  controls: [
    { kind: 'enum', key: 'status', label: 'Status', options: MILESTONE_STATUSES, default: 'locked' },
    { kind: 'number', key: 'daysLeft', label: 'Days left', default: 22, min: 0, max: 365 },
    { kind: 'number', key: 'totalDays', label: 'Total days', default: 30, min: 1, max: 365 },
    { kind: 'number', key: 'reqDone', label: 'Req. done', default: 2, min: 0, max: 12 },
    { kind: 'number', key: 'reqTotal', label: 'Req. total', default: 3, min: 0, max: 12 },
    { kind: 'boolean', key: 'ring', label: 'Ring', default: true },
    { kind: 'enum', key: 'variant', label: 'Variant', options: GRAPH_NODE_VARIANTS, default: 'default', display: 'segmented' },

    { kind: 'string', key: 'label', label: 'Label', default: 'Submit paper' },
    { kind: 'string', key: 'due', label: 'Due', default: 'DUE NOV 14' },
  ],
  examples: [
    {
      name: 'Lifecycle',
      nameZh: '生命周期',
      note: 'Locked until its requirements complete, then ready; ≤ 7 days left turns the ring Spark.',
      render: () => [
        h(MilestoneNode, { status: 'locked', label: 'Submit paper', due: 'DUE NOV 14', daysLeft: 22, reqDone: 2, reqTotal: 3 }),
        h(MilestoneNode, { status: 'ready', label: 'Submit paper', due: 'DUE NOV 14', daysLeft: 12, reqDone: 3, reqTotal: 3 }),
        h(MilestoneNode, { status: 'ongoing', label: 'Submit paper', due: 'DUE NOV 14', daysLeft: 5 }),
        h(MilestoneNode, { status: 'completed', label: 'Submit paper', due: 'DUE NOV 14' }),
      ],
    },
    {
      name: 'On a sheet',
      nameZh: '纸上的样子',
      note: 'The gem alone at 72px: no ring, chip or pips; the host writes date, days left and requirements into `meta`.',
      render: () => [
        h(MilestoneNode, { variant: 'sheet', status: 'locked', label: 'Submit paper', meta: 'NOV 14 · 22 DAYS · 2/3 · LOCKED' }),
        h(MilestoneNode, { variant: 'sheet', status: 'ready', label: 'Submit paper', meta: 'NOV 14 · 12 DAYS · READY' }),
        h(MilestoneNode, { variant: 'sheet', status: 'completed', label: 'Submit paper', meta: 'NOV 14 · DELIVERED' }),
      ],
    },
  ],
  render: state => h(MilestoneNode, {
    status: state.status as never,
    daysLeft: Number(state.daysLeft),
    totalDays: Number(state.totalDays),
    reqDone: Number(state.reqDone),
    reqTotal: Number(state.reqTotal),
    ring: Boolean(state.ring),
    variant: state.variant as never,
    label: String(state.label),
    due: String(state.due),
  }),
}

export const projectGoalNodeSpec: ComponentSpec = {
  id: 'project-goal-node',
  name: 'ProjectGoalNode',
  description: 'The one thing the whole project is for: a faceted chalice that fills with liquid in its status colour as goals complete.',
  descriptionZh: '整个项目唯一的目的:切面圣杯,随目标完成注入状态色的液体。',
  controls: [
    { kind: 'enum', key: 'status', label: 'Status', options: PROJECT_STATUSES, default: 'ongoing', display: 'segmented' },
    { kind: 'number', key: 'done', label: 'Done', default: 2, min: 0, max: 50 },
    { kind: 'number', key: 'total', label: 'Total', default: 5, min: 1, max: 50 },
    { kind: 'enum', key: 'variant', label: 'Variant', options: GRAPH_NODE_VARIANTS, default: 'default', display: 'segmented' },
    { kind: 'string', key: 'label', label: 'Label', default: 'Map the drivers of the effect' },
  ],
  examples: [
    {
      name: 'Every status',
      nameZh: '全部状态',
      render: () => PROJECT_STATUSES.map(status => h(ProjectGoalNode, { status, done: 2, total: 5, label: 'Project aim' })),
    },
    {
      name: 'On a sheet',
      nameZh: '纸上的样子',
      render: () => [h(ProjectGoalNode, { variant: 'sheet', status: 'ongoing', done: 2, total: 5, label: 'Map the drivers of the effect', meta: 'PROJECT GOAL · 2/5 GOALS' })],
    },
  ],
  render: state => h(ProjectGoalNode, {
    status: state.status as never,
    done: Number(state.done),
    total: Number(state.total),
    variant: state.variant as never,
    label: String(state.label),
  }),
}

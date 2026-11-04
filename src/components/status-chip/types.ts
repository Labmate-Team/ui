/** Work statuses (LabMate §3.3). Each one is shown by color AND by a glyph. */
export const WORK_STATUSES = ['not-started', 'ongoing', 'paused', 'completed', 'failed', 'halted'] as const
export type WorkStatus = (typeof WORK_STATUSES)[number]

export const WORK_STATUS_LABEL: Record<WorkStatus, string> = {
  'not-started': 'Not started',
  'ongoing': 'Ongoing',
  'paused': 'Paused',
  'completed': 'Completed',
  'failed': 'Failed',
  'halted': 'Halted',
}

/** Any node's status: the work statuses plus a milestone's pre-states (§8.6). */
export const NODE_STATUSES = [...WORK_STATUSES, 'locked', 'ready'] as const
export type NodeStatus = (typeof NODE_STATUSES)[number]

export const NODE_STATUS_LABEL: Record<NodeStatus, string> = { ...WORK_STATUS_LABEL, locked: 'Locked', ready: 'Ready to unlock' }

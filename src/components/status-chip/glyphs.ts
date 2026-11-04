import type { NodeStatus, WorkStatus } from './types'

/** Status glyph paths on a 24 grid (LabMate §3.3), shared by chips and nodes. */
export const STATUS_GLYPH: Record<WorkStatus, { d: string, fill: boolean }> = {
  'not-started': { d: '', fill: false },
  'ongoing': { d: 'M8 5l11 7-11 7z', fill: true },
  'paused': { d: 'M7 5h3.5v14H7z M13.5 5H17v14h-3.5z', fill: true },
  'completed': { d: 'M5 12.5l4.5 4.5L19 7', fill: false },
  'failed': { d: 'M6 6l12 12 M18 6L6 18', fill: false },
  'halted': { d: 'M6 6h12v12H6z', fill: true },
}

/** The three planes + glyph ink of a status, as token references (§2.42). */
export function statusPlanes(status: WorkStatus | 'locked') {
  return {
    l: `var(--status-${status}-light)`,
    b: `var(--status-${status}-base)`,
    d: `var(--status-${status}-deep)`,
    g: `var(--status-${status}-glyph)`,
  }
}

/** A milestone's pre-states (§8.6) draw the padlock, shut while LOCKED and open once READY. */
export const PADLOCK = 'M6 11h12v10H6z M8.5 11V6.5L12 4l3.5 2.5V11'
export const PADLOCK_OPEN = 'M6 11h12v10H6z M8.5 11V6.5L12 4l3.5 2.5V7.5'

/**
 * Glyph, planes and edge of any node status — the six work statuses plus a milestone's locked / ready, which share the
 * grey planes (§8.6). The edge is the deep plane, except not-started, whose planes are the wells: it takes Fog, as the
 * not-started StatusChip does, so the mark still reads on Paper.
 */
export function nodeStatusMark(status: NodeStatus) {
  const pre = status === 'locked' || status === 'ready'
  const planes = statusPlanes(pre ? 'locked' : status)
  const glyph = status === 'locked' ? { d: PADLOCK, fill: false } : status === 'ready' ? { d: PADLOCK_OPEN, fill: false } : STATUS_GLYPH[status]
  return { glyph, planes, edge: status === 'not-started' ? 'var(--fog)' : planes.d }
}

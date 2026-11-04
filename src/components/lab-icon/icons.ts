// The LabMate icon set (§6.4), verbatim from the design doc: straight segments
// on a 24px grid with 2px padding. Rendered with miter joins and square caps.
export const LAB_ICONS = {
  project: 'M9 3h6 M10 3v6l-6 12h16l-6-12V3 M7 15h10',
  overview: 'M3 3h8v8H3z M13 3h8v5h-8z M13 10h8v11h-8z M3 13h8v8H3z',
  kanban: 'M3 4h5v16H3z M10 4h5v10h-5z M17 4h4v7h-4z',
  week: 'M3 5h18v16H3z M3 10h18 M8 3v4 M16 3v4 M7 14h2 M11 14h2 M15 14h2',
  human: 'M10.5 3h3l2 2v3l-2 2h-3l-2-2V5z M4 21l2-6 3-2h6l3 2 2 6z',
  agent: 'M12 3l5 3v5l-5 3-5-3V6z M9.5 8.5h5 M5 21l2-5h10l2 5z',
  task: 'M4 4h16v16H4z M8 12l3 3 5-6',
  done: 'M12 2l9 5v10l-9 5-9-5V7z M8 12l3 3 5-6',
  running: 'M7 4l13 8-13 8z',
  paused: 'M6 4h4v16H6z M14 4h4v16h-4z',
  blocked: 'M8 3h8l5 5v8l-5 5H8l-5-5V8z M7 17L17 7',
  alert: 'M12 3l10 18H2z M12 10v5 M12 17.5v1',
  clock: 'M8 3h8l5 5v8l-5 5H8l-5-5V8z M12 7v5l3 3',
  milestone: 'M5 21V3 M5 4h13l-3 4 3 4H5',
  handoff: 'M4 8h13l-3-3 M20 16H7l3 3',
  depends: 'M3 4h7v6H3z M14 14h7v6h-7z M6.5 10v7h7.5',
  chat: 'M3 4h18v12h-9l-5 4v-4H3z',
  log: 'M5 3h10l4 4v14H5z M15 3v4h4 M8 11h8 M8 15h8',
  experiment: 'M8 3h8 M9 3v14l3 4 3-4V3 M9 12h6',
  memory: 'M12 3l9 4-9 4-9-4z M3 12l9 4 9-4 M3 17l9 4 9-4',
  compute: 'M7 7h10v10H7z M10 3v4 M14 3v4 M10 17v4 M14 17v4 M3 10h4 M3 14h4 M17 10h4 M17 14h4',
  search: 'M10 3l6 3.5v7L10 17l-6-3.5v-7z M15 15l6 6',
  settings: 'M12 2l9 5v10l-9 5-9-5V7z M12 9l3 1.5v3L12 15l-3-1.5v-3z',
  add: 'M12 4v16 M4 12h16',
  edit: 'M3.5 20.5v-4l13-13 4 4-13 13z M13.5 6.5l4 4',
  check: 'M4 12.5l5 5 11-11',
  close: 'M5 5l14 14 M19 5L5 19',
  // Graph controls (labmate panel: zoom strip and focus): minus pairs with add; fit is four corner brackets; focus is a target —
  // an octagon ring (circles become octagons, §2.1) with four ticks, so it never reads as add.
  minus: 'M4 12h16',
  fit: 'M3 8V3h5 M16 3h5v5 M21 16v5h-5 M8 21H3v-5',
  focus: 'M9.5 6h5L18 9.5v5L14.5 18h-5L6 14.5v-5z M12 2v4 M12 18v4 M2 12h4 M18 12h4',
} as const

export type LabIconName = keyof typeof LAB_ICONS
export const LAB_ICON_NAMES = Object.keys(LAB_ICONS) as LabIconName[]

/** Icon sizes and their stroke weights (§6.2): smaller icons draw heavier. */
export type LabIconSize = 16 | 20 | 24 | 32
export const LAB_ICON_STROKE: Record<LabIconSize, number> = { 16: 2, 20: 1.75, 24: 1.5, 32: 1.25 }

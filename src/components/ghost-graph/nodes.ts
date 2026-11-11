// 灰图的布局 (labmate 面板的加载动画, 设计 2026-11-05 §4.2): 五个节点在 800 × 270 的画布上一字排开, 都按整个形状盒子定中心 (与面板布局
// 的 NODE_BOX 同一规则), 轨在 y = 130 上从 Start 中心走到 project goal 中心。面板按 `bottom` 在节点下面放标签骨架。
// 两种朝向的图都在自己的画布正中 (轨在画布的中线上), 每个节点什么时候亮都由它在轨上的位置算出来 (lightDelay), 不各抄一份数字。

export type GhostGraphNodeKind = 'start' | 'task' | 'goal' | 'milestone' | 'project-goal'

/** 横着 (加载动画) 或竖着 (面板按层的 Graph 骨架: 从下往上, 标签在左)。 */
export const GHOST_GRAPH_ORIENTATIONS = ['horizontal', 'vertical'] as const
export type GhostGraphOrientation = typeof GHOST_GRAPH_ORIENTATIONS[number]

/**
 * 光 (style.css 的 ghost-graph-light / ghost-graph-facet, 改这里也要改那里): 一段 56 长的亮段, 每个周期 3.4 s 沿轨推进 56 + 904
 * (≈ 282 单位 / 秒); 节点从开始亮到最亮用 150 ms。
 */
const LIGHT = { bead: 56, period: 960, cycle: 3.4, rise: 0.15 } as const

/**
 * 轨上离起点 distance (viewBox 单位) 的节点什么时候开始亮 (秒): 光心走到它的时刻, 减去亮到顶的一半——它在光心到达的前后亮起来。
 * 向上取到百分之一秒。竖着的原先照抄横着的延迟, 而两种朝向节点的间距不同 (160 与 124), 越靠后的节点亮得越晚、光已经走过去了; 现在都从位置算。
 */
const lightDelay = (distance: number): number =>
  Math.ceil(((distance + LIGHT.bead / 2) / (LIGHT.period / LIGHT.cycle) - LIGHT.rise / 2) * 100) / 100

/** 画布尺寸与轨的高度 (viewBox 单位)。 */
export const GHOST_GRAPH_SIZE = { width: 800, height: 270, rail: 130 } as const

/** 横着时每个节点的中心 x 与画出来的形状的底边 y。 */
const HORIZONTAL: readonly { kind: GhostGraphNodeKind, x: number, bottom: number }[] = [
  { kind: 'start', x: 80, bottom: 166 },
  { kind: 'task', x: 240, bottom: 158 },
  { kind: 'goal', x: 400, bottom: 166 },
  { kind: 'milestone', x: 560, bottom: 165 },
  { kind: 'project-goal', x: 720, bottom: 190.5 },
]

/** 每个节点的中心 x、画出来的形状的底边 y, 与它开始亮的延迟 (秒; 见 lightDelay)。 */
export const GHOST_GRAPH_NODES: readonly { kind: GhostGraphNodeKind, x: number, bottom: number, delay: number }[] =
  HORIZONTAL.map(n => ({ ...n, delay: lightDelay(n.x - HORIZONTAL[0]!.x) }))

/**
 * 竖着的画布: 轨在画布的中线 x = rail 上, 从最下面的 Start 走到最上面的 project goal (行距 124, 同面板纸上的行距)。
 * 轨左边的一半留给面板的标签骨架 (最宽的伸到离中线 194)。
 */
export const GHOST_GRAPH_VERTICAL_SIZE = { width: 400, height: 700, rail: 200 } as const

/** 竖着时每个节点的中心 y、缩放与画出来的形状的宽 (纸上的尺寸: 40 / 36 / 60 / 72 / 92)。 */
const VERTICAL: readonly { kind: GhostGraphNodeKind, y: number, scale: number, width: number }[] = [
  { kind: 'start', y: 620, scale: 0.556, width: 40 },
  { kind: 'task', y: 496, scale: 0.643, width: 36 },
  { kind: 'goal', y: 372, scale: 0.577, width: 60 },
  { kind: 'milestone', y: 248, scale: 0.6, width: 72 },
  { kind: 'project-goal', y: 110, scale: 0.4194, width: 92 },
]

/** 竖着时每个节点的中心 y、缩放、画出来的形状的左边 x (面板在它左边放标签骨架) 与它开始亮的延迟 (秒; 见 lightDelay)。 */
export const GHOST_GRAPH_VERTICAL_NODES: readonly { kind: GhostGraphNodeKind, y: number, scale: number, left: number, delay: number }[] =
  VERTICAL.map(({ kind, y, scale, width }) => ({ kind, y, scale, left: GHOST_GRAPH_VERTICAL_SIZE.rail - width / 2, delay: lightDelay(VERTICAL[0]!.y - y) }))

// 灰图的布局 (labmate 面板的加载动画, 设计 2026-11-05 §4.2): 五个节点在 800 × 270 的画布上一字排开, 都按整个形状盒子定中心 (与面板布局
// 的 NODE_BOX 同一规则), 轨在 y = 130 上从 Start 中心走到 project goal 中心。面板按 `bottom` 在节点下面放标签骨架。

export type GhostGraphNodeKind = 'start' | 'task' | 'goal' | 'milestone' | 'project-goal'

/** 画布尺寸与轨的高度 (viewBox 单位)。 */
export const GHOST_GRAPH_SIZE = { width: 800, height: 270, rail: 130 } as const

/** 每个节点的中心 x、画出来的形状的底边 y, 与光的中心经过它时的延迟 (秒; 光速 ≈ 282 px/s, 过节点 k 的时刻 ≈ (160k + 28) / 282, 减去亮到顶的 150 ms 的一半)。 */
export const GHOST_GRAPH_NODES: readonly { kind: GhostGraphNodeKind, x: number, bottom: number, delay: number }[] = [
  { kind: 'start', x: 80, bottom: 166, delay: 0.03 },
  { kind: 'task', x: 240, bottom: 158, delay: 0.60 },
  { kind: 'goal', x: 400, bottom: 166, delay: 1.16 },
  { kind: 'milestone', x: 560, bottom: 165, delay: 1.73 },
  { kind: 'project-goal', x: 720, bottom: 190.5, delay: 2.30 },
]

// 五种节点每个面填什么 (LabMate §2.4, §8): 节点组件与节点小图形 (NodeGlyph) 共用这一份, 次序同 geometry.ts 里的面。
// 'l' / 'b' / 'd' 是状态的 light / base / deep 三个面 (statusPlanes); 别的是固定的令牌。

/** 一种状态的三个面与字形色 (statusPlanes 的返回)。 */
export interface StatusPlanes { l: string, b: string, d: string, g: string }
export type Tone = 'l' | 'b' | 'd'

/** Task 菱形的四个面。 */
export const TASK_FACET_TONES: readonly Tone[] = ['l', 'b', 'd', 'b']

/** Milestone 宝石的八个面。 */
export const MILESTONE_FACET_TONES: readonly Tone[] = ['l', 'b', 'l', 'b', 'd', 'b', 'l', 'd']

/** Start 三角的四个面 (没有状态)。 */
export const START_FACET_FILLS = ['var(--graphite)', 'var(--ink)', 'var(--pulse)', 'var(--slate)'] as const

/** Project goal 杯身的八个中性面 (液面另算)。 */
export const PROJECT_GOAL_BOWL_FILLS = [
  'var(--paper)', 'var(--facet-paper)', 'var(--facet-shade)', 'var(--well)',
  'var(--well-deep)', 'var(--facet-paper)', 'var(--fog)', 'var(--facet-mid)',
] as const

/** Project goal 底座的七块。 */
export const PROJECT_GOAL_STAND_TONES: readonly Tone[] = ['l', 'd', 'l', 'd', 'l', 'b', 'd']

/**
 * Goal 五个面的填色 (§8.4): 从顶上起顺时针, 亮几个面 = done / total 的五分之几; completed 全亮, not-started 全不亮。
 * 不亮的面是 wells。
 */
export function goalFacetFills(planes: StatusPlanes, status: string, done: number, total: number): string[] {
  let lit = Math.round((done / total) * 5)
  if (status === 'completed') lit = 5
  if (status === 'not-started') lit = 0
  const on = [planes.b, planes.d, planes.d, planes.b, planes.l]
  const off = ['var(--well)', 'var(--well-deep)', 'var(--well-deep)', 'var(--well)', 'var(--paper)']
  return [0, 1, 2, 3, 4].map(i => (i < lit ? on[i]! : off[i]!))
}

// Project goal 的液面 (§8.7), 240 × 270 格: 杯身左右两条边。
const BOWL_LEFT: [number, number][] = [[30, 20], [44, 80], [90, 130]]
const BOWL_RIGHT: [number, number][] = [[210, 20], [196, 80], [150, 130]]

function xAt(edge: [number, number][], y: number) {
  for (let i = 0; i < edge.length - 1; i++) {
    const [x1, y1] = edge[i]!
    const [x2, y2] = edge[i + 1]!
    if (y >= y1 && y <= y2) return x1 + ((x2 - x1) * (y - y1)) / (y2 - y1)
  }
  return edge[edge.length - 1]![0]
}
const pts = (a: [number, number][]) => a.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

/** 液面高 p (0–1, 完成的 goal 的份额) 时液体的多边形、左右两个小面与液面线的两端。 */
export function chaliceLiquid(p: number) {
  const yl = 130 - 106 * p
  const xl = xAt(BOWL_LEFT, yl)
  const xr = xAt(BOWL_RIGHT, yl)
  const body: [number, number][] = [[xl, yl], [xr, yl]]
  BOWL_RIGHT.forEach(([x, y]) => { if (y > yl) body.push([x, y]) })
  BOWL_LEFT.slice().reverse().forEach(([x, y]) => { if (y > yl) body.push([x, y]) })
  return {
    yl: yl.toFixed(1),
    xl: xl.toFixed(1),
    xr: xr.toFixed(1),
    body: pts(body),
    facetL: pts([[xl, yl], [120, 130], [90, 130]]),
    facetR: pts([[xr, yl], [150, 130], [120, 130]]),
  }
}

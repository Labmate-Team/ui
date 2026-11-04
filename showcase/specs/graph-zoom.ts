import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { GraphZoom } from '#/components/graph-zoom'

const STEPS = 1.2

export const graphZoomSpec: ComponentSpec = {
  id: 'graph-zoom',
  name: 'GraphZoom',
  interactive: true,
  description:
    'The graph\'s zoom control: one compact Ink-edged strip — zoom out · the scale (click: back to 100%) · zoom in | fit. The host owns the scale and docks the strip.',
  descriptionZh:
    '图的缩放控件:一条紧凑的墨色细框条——缩小 · 当前比例(点它回到 100%)· 放大 | 适应。比例由宿主持有,条也由宿主摆放。',
  controls: [
    { kind: 'number', key: 'percent', label: 'Percent', default: 71, min: 40, max: 220 },
  ],
  render: state =>
    h(GraphZoom, {
      'percent': Number(state.percent),
      'onZoomIn': () => (state.percent = Math.min(220, Math.round(Number(state.percent) * STEPS))),
      'onZoomOut': () => (state.percent = Math.max(40, Math.round(Number(state.percent) / STEPS))),
      'onReset': () => (state.percent = 100),
      'onFit': () => (state.percent = 71),
    }),
  usage: `Dock it in a corner of the canvas the graph lives on (the labmate panel uses the page's bottom-right corner) and keep panels that share the corner clear of it.

- The strip only emits zoom-in / zoom-out / reset / fit; the host applies them to its zoom behaviour and passes the scale back as \`percent\`.
- Pass \`labels\` with localized strings — they are the cells' accessible names and titles.`,
  usageZh: `把它停在图所在画布的一个角上(labmate 面板放在整页的右下角),共用那个角的面板要让开它。

- 这条只发出 zoom-in / zoom-out / reset / fit;宿主把它们交给自己的缩放,再把比例作为 \`percent\` 传回来。
- 用 \`labels\` 传入本地化文字——它们是各格的无障碍名称与 title。`,
}

import type { ComponentSpec } from '../lib/spec'
import { h } from 'vue'
import { GhostGraph } from '#/components/ghost-graph'

export const ghostGraphSpec: ComponentSpec = {
  id: 'ghost-graph',
  name: 'GhostGraph',
  description:
    'The loading graph: Start → task → goal → milestone → project goal in their not-started planes on one rail, drawn from the real node geometry. Animated, a Pulse light traces the rail and lights each node as it passes; still, it is the Graph view\'s skeleton. Reduced motion shows the still graph.',
  descriptionZh:
    '加载时的灰图:Start → task → goal → milestone → project goal 以「未开始」的面一字排在一条轨上,几何与真节点同一份。动起来时一道 Pulse 光沿轨走过、经过的节点亮一下;不动时就是 Graph 视图的骨架。减少动态时只剩静止的灰图。',
  controls: [
    { kind: 'boolean', key: 'animated', label: 'Animated', default: true },
  ],
  // The panel always shows it on the graph canvas (Mist, R §3.1), where the Paper facets read; the stage repeats that.
  render: state => h('div', { class: 'bg-[var(--mist)] p-6' }, [h(GhostGraph, { animated: Boolean(state.animated) })]),
  usage: `Put it on the Mist canvas the graph itself uses and give the status text yourself (the svg is aria-hidden): the labmate panel centres it with「正在读取项目」under it while a project loads, and uses \`animated: false\` with label skeletons under the nodes (\`GHOST_GRAPH_NODES\` has each node's centre x and bottom y) while the Graph view waits for its data.`,
  usageZh: `放在图自己用的 Mist 画布上,状态文字自己给(svg 是 aria-hidden):labmate 面板在读项目时把它居中、下面一行「正在读取项目」;Graph 视图等数据时用 \`animated: false\`,按 \`GHOST_GRAPH_NODES\`(每个节点的中心 x 与底边 y)在节点下面放标签骨架。`,
}

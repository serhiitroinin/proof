import { useState } from "react"

import { Tree, type TreeNode } from "@/components/ui/tree"

const LAYERS: TreeNode[] = [
  {
    id: "home",
    name: "Home",
    kind: "frame",
    children: [
      {
        id: "nav",
        name: "Nav",
        kind: "frame",
        children: [
          { id: "logo", name: "Logo", kind: "rect" },
          { id: "links", name: "Links", kind: "text" },
        ],
      },
      {
        id: "hero",
        name: "Hero",
        kind: "frame",
        children: [
          { id: "headline", name: "Headline", kind: "text" },
          { id: "subhead", name: "Subhead", kind: "text" },
          { id: "cta", name: "Button", kind: "rect" },
        ],
      },
      { id: "cover", name: "Cover", kind: "image", locked: true },
      { id: "promo", name: "Promo banner", kind: "rect", hidden: true },
    ],
  },
  {
    id: "pricing",
    name: "Pricing",
    kind: "frame",
    children: [
      { id: "tiers", name: "Tiers", kind: "frame" },
      { id: "ptitle", name: "Title", kind: "text" },
    ],
  },
]

function update(nodes: TreeNode[], id: string, fn: (n: TreeNode) => TreeNode): TreeNode[] {
  return nodes.map((n) => (n.id === id ? fn(n) : n.children ? { ...n, children: update(n.children, id, fn) } : n))
}

export default function LayerTree() {
  const [items, setItems] = useState(LAYERS)
  const [selected, setSelected] = useState(["cta"])
  return (
    <Tree
      className="h-80 w-70"
      items={items}
      selected={selected}
      onSelectedChange={setSelected}
      defaultExpanded={["home", "hero"]}
      onRename={(id, name) => setItems((t) => update(t, id, (n) => ({ ...n, name })))}
      onToggleHidden={(id) => setItems((t) => update(t, id, (n) => ({ ...n, hidden: !n.hidden })))}
      onToggleLocked={(id) => setItems((t) => update(t, id, (n) => ({ ...n, locked: !n.locked })))}
    />
  )
}

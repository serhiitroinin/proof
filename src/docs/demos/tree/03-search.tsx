import { useState } from "react"
import { SearchIcon } from "lucide-react"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Tree, type TreeNode } from "@/components/ui/tree"

const FILES: TreeNode[] = [
  {
    id: "src",
    name: "src",
    kind: "folder",
    children: [
      { id: "app", name: "app.tsx", kind: "file" },
      { id: "router", name: "router.tsx", kind: "file" },
      {
        id: "ui",
        name: "ui",
        kind: "folder",
        children: [
          { id: "button", name: "button.tsx", kind: "file" },
          { id: "tree", name: "tree.tsx", kind: "file" },
        ],
      },
    ],
  },
  { id: "readme", name: "README.md", kind: "file" },
]

export default function TreeSearch() {
  const [query, setQuery] = useState("tsx")
  return (
    <div className="flex w-70 flex-col gap-2">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Find file" value={query} onChange={(e) => setQuery(e.target.value)} />
      </InputGroup>
      <Tree items={FILES} defaultExpanded={["src", "ui"]} defaultSelected={["tree"]} query={query} />
    </div>
  )
}

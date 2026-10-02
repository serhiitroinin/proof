import { useState } from "react"
import { FolderIcon } from "lucide-react"

import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/components/ui/item"

const folders = [
  { name: "Downloads", note: "212 files, 9 moves proposed" },
  { name: "Desktop", note: "48 files, clean" },
  { name: "Pictures/Import", note: "1,204 files, 3 duplicates" },
]

export default function ItemSelected() {
  const [selected, setSelected] = useState("Downloads")
  return (
    <ItemGroup variant="outline" className="w-full max-w-md">
      {folders.map((f, i) => (
        <div key={f.name}>
          {i > 0 && <ItemSeparator />}
          <Item
            size="sm"
            role="option"
            aria-selected={selected === f.name}
            render={<a href="#folders" onClick={() => setSelected(f.name)} />}
          >
            <ItemMedia variant="icon">
              <FolderIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{f.name}</ItemTitle>
              <ItemDescription>{f.note}</ItemDescription>
            </ItemContent>
          </Item>
        </div>
      ))}
    </ItemGroup>
  )
}

import { LayoutGridIcon, ListIcon, TableIcon } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupDisabled() {
  return (
    <>
      <ToggleGroup defaultValue={["list"]}>
        <ToggleGroupItem value="list" aria-label="List view">
          <ListIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <LayoutGridIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="table" aria-label="Table view" disabled>
          <TableIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup defaultValue={["7d"]} disabled>
        <ToggleGroupItem value="24h">24h</ToggleGroupItem>
        <ToggleGroupItem value="7d">7d</ToggleGroupItem>
        <ToggleGroupItem value="30d">30d</ToggleGroupItem>
      </ToggleGroup>
    </>
  )
}

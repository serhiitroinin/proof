import { LayoutGridIcon, ListIcon } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupJoined() {
  return (
    <>
      <ToggleGroup defaultValue={["list"]} variant="outline" spacing={0}>
        <ToggleGroupItem value="list" aria-label="List view">
          <ListIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <LayoutGridIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup defaultValue={["7d"]} variant="outline" spacing={0}>
        <ToggleGroupItem value="24h">24h</ToggleGroupItem>
        <ToggleGroupItem value="7d">7d</ToggleGroupItem>
        <ToggleGroupItem value="30d">30d</ToggleGroupItem>
        <ToggleGroupItem value="all">All</ToggleGroupItem>
      </ToggleGroup>
    </>
  )
}

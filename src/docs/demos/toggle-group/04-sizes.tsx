import { BoldIcon, ItalicIcon } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupSizes() {
  return (
    <>
      <ToggleGroup size="sm" variant="outline" defaultValue={["bold"]}>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup variant="outline" defaultValue={["bold"]}>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup size="lg" variant="outline" defaultValue={["bold"]}>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </>
  )
}

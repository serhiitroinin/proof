import { FolderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"

export default function ItemDefault() {
  return (
    <Item variant="outline" className="w-full max-w-md">
      <ItemMedia variant="icon">
        <FolderIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Downloads</ItemTitle>
        <ItemDescription>212 files, 9 moves proposed. Waiting for approval.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">
          Review
        </Button>
      </ItemActions>
    </Item>
  )
}

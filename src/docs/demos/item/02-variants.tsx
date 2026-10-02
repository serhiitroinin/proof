import { BellIcon } from "lucide-react"

import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"

export default function ItemVariants() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Item>
        <ItemMedia variant="icon">
          <BellIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Default</ItemTitle>
          <ItemDescription>No border, sits on the page.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <BellIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Outline</ItemTitle>
          <ItemDescription>A hairline border on a card surface.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="icon">
          <BellIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Muted</ItemTitle>
          <ItemDescription>A filled surface, for secondary lists.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}

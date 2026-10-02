import { ChevronRightIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

const people = [
  { name: "Ines Okafor", email: "ines@haldane.dev", initials: "IO" },
  { name: "Teodor Lind", email: "teodor@haldane.dev", initials: "TL" },
  { name: "Mireille Dubois", email: "mireille@pell.studio", initials: "MD" },
]

export default function ItemGroupDemo() {
  return (
    <ItemGroup variant="outline" className="w-full max-w-md">
      {people.map((p, i) => (
        <div key={p.email}>
          {i > 0 && <ItemSeparator />}
          <Item size="sm" render={<a href="#people" />}>
            <ItemMedia>
              <Avatar size="sm">
                <AvatarFallback>{p.initials}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{p.name}</ItemTitle>
              <ItemDescription>{p.email}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4 text-muted-foreground" />
            </ItemActions>
          </Item>
        </div>
      ))}
    </ItemGroup>
  )
}

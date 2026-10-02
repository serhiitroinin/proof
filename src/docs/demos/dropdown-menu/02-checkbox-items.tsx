import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DropdownMenuCheckboxItems() {
  const [columns, setColumns] = useState({
    status: true,
    owner: true,
    due: false,
    labels: false,
  })
  const toggle = (key: keyof typeof columns) => (checked: boolean) =>
    setColumns((c) => ({ ...c, [key]: checked }))
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Show columns</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={columns.status}
            onCheckedChange={toggle("status")}
          >
            Status
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={columns.owner}
            onCheckedChange={toggle("owner")}
          >
            Owner
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={columns.due}
            onCheckedChange={toggle("due")}
          >
            Due date
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={columns.labels}
          onCheckedChange={toggle("labels")}
          disabled
        >
          Labels
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

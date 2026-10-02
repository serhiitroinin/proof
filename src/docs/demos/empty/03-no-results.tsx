import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

export default function EmptyNoResults() {
  return (
    <Empty className="max-w-md">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchIcon />
        </EmptyMedia>
        <EmptyTitle>No results for “quarterly forcast”</EmptyTitle>
        <EmptyDescription>Check the spelling or search across all workspaces.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="link">Search everywhere</Button>
      </EmptyContent>
    </Empty>
  )
}

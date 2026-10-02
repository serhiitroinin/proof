import { FolderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

export default function EmptyHalftone() {
  return (
    <Empty className="max-w-md">
      <EmptyHeader>
        <EmptyMedia variant="halftone">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No folder watched</EmptyTitle>
        <EmptyDescription>Pick a folder and Butler sorts what lands in it.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Choose folder</Button>
      </EmptyContent>
    </Empty>
  )
}

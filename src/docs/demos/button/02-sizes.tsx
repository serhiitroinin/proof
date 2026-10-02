import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ButtonSizes() {
  return (
    <>
      <Button variant="outline" size="xs">
        Extra small
      </Button>
      <Button variant="outline" size="sm">
        Small
      </Button>
      <Button variant="outline">Default</Button>
      <Button variant="outline" size="lg">
        Large
      </Button>
      <Button variant="outline" size="icon-xs" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon-sm" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon-lg" aria-label="Add">
        <PlusIcon />
      </Button>
    </>
  )
}

import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

export default function ButtonGroupSplit() {
  return (
    <>
      <ButtonGroup>
        <Button>Merge pull request</Button>
        <ButtonGroupSeparator />
        <Button size="icon" aria-label="More merge options">
          <ChevronDownIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Create branch</Button>
        <Button variant="outline" size="icon" aria-label="Branch options">
          <ChevronDownIcon />
        </Button>
      </ButtonGroup>
    </>
  )
}

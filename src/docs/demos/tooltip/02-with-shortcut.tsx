import { BoldIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function TooltipWithShortcut() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Bold" />}>
        <BoldIcon />
      </TooltipTrigger>
      <TooltipContent>
        Bold
        <Kbd>⌘B</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}

import { BoldIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export default function ToggleDefault() {
  return (
    <Toggle aria-label="Bold" defaultPressed>
      <BoldIcon />
    </Toggle>
  )
}

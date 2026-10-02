import { StrikethroughIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export default function ToggleDisabled() {
  return (
    <>
      <Toggle aria-label="Strikethrough" disabled>
        <StrikethroughIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Strikethrough" disabled defaultPressed>
        <StrikethroughIcon />
      </Toggle>
    </>
  )
}

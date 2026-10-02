import { UnderlineIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export default function ToggleSizes() {
  return (
    <>
      <Toggle variant="outline" size="sm" aria-label="Underline">
        <UnderlineIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Underline">
        <UnderlineIcon />
      </Toggle>
      <Toggle variant="outline" size="lg" aria-label="Underline">
        <UnderlineIcon />
      </Toggle>
    </>
  )
}

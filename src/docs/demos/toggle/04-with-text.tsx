import { EyeIcon, StarIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export default function ToggleWithText() {
  return (
    <>
      <Toggle variant="outline">
        <EyeIcon />
        Watch
      </Toggle>
      <Toggle variant="outline" defaultPressed>
        <StarIcon />
        Starred
      </Toggle>
    </>
  )
}

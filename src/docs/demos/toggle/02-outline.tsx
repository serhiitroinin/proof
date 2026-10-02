import { ItalicIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export default function ToggleOutline() {
  return (
    <>
      <Toggle variant="outline" aria-label="Italic">
        <ItalicIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Italic" defaultPressed>
        <ItalicIcon />
      </Toggle>
    </>
  )
}

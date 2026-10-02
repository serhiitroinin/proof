import { Trash2Icon } from "lucide-react"

import { HoldButton } from "@/components/ui/hold-button"

export default function HoldButtonDelete() {
  return (
    <HoldButton doneLabel="Deleted 26 files">
      <Trash2Icon data-icon="inline-start" />
      Hold to delete 26 files
    </HoldButton>
  )
}

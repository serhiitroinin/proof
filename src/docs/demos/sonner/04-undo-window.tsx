import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export default function SonnerUndoWindow() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("26 files moved", {
          description: "Undo stays available for 30 days.",
          action: { label: "Undo", onClick: () => toast("Moved back") },
        })
      }
    >
      Move 26 files
    </Button>
  )
}

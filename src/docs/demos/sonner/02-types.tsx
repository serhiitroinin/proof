import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export default function SonnerTypes() {
  return (
    <>
      <Button variant="outline" onClick={() => toast("Draft saved")}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Invite sent to jonas@northwind.io")}>
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Conversation archived", {
            action: { label: "Undo", onClick: () => toast("Restored") },
          })
        }
      >
        With undo
      </Button>
      <Button variant="outline" onClick={() => toast.error("Export failed", { description: "The file is over 2 GB." })}>
        Error
      </Button>
    </>
  )
}

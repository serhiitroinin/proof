import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export default function SonnerBasic() {
  return (
    <Button variant="outline" onClick={() => toast("Draft saved")}>
      Show toast
    </Button>
  )
}

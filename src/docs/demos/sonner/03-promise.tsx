import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export default function SonnerPromise() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.promise(new Promise((resolve) => setTimeout(resolve, 1800)), {
          loading: "Publishing 3 pages…",
          success: "Published to northwind.io",
          error: "Publish failed",
        })
      }
    >
      Publish
    </Button>
  )
}

import { Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ButtonComposition() {
  return (
    <div className="flex w-full max-w-md items-center justify-between">
      <Button variant="destructive" size="sm">
        <Trash2Icon data-icon="inline-start" />
        Delete project
      </Button>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button size="sm">Save changes</Button>
      </div>
    </div>
  )
}

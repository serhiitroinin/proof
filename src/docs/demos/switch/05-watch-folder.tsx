import { useState } from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SwitchWatchFolder() {
  const [watch, setWatch] = useState(true)
  const [hidden, setHidden] = useState(false)
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Label className="justify-between">
        Watch ~/Downloads
        <Switch checked={watch} onCheckedChange={setWatch} />
      </Label>
      <Label className="justify-between">
        Skip hidden files
        <Switch checked={hidden} onCheckedChange={setHidden} />
      </Label>
      <p className="text-xs text-muted-foreground">
        {watch ? "Sorting new files as they arrive." : "Paused. Nothing will move."}
      </p>
    </div>
  )
}

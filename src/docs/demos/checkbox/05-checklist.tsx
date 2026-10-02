import { useState } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const steps = ["Changelog written", "Version bumped to 2.4.0", "Tag pushed", "Release notes published"]

export default function CheckboxChecklist() {
  const [done, setDone] = useState<string[]>(["Changelog written"])
  return (
    <div className="grid w-full max-w-xs gap-3">
      {steps.map((s) => (
        <Label key={s}>
          <Checkbox
            checked={done.includes(s)}
            onCheckedChange={(c) => setDone((d) => (c ? [...d, s] : d.filter((x) => x !== s)))}
          />
          {s}
        </Label>
      ))}
      <p className="text-xs text-muted-foreground">
        {done.length} of {steps.length} done
      </p>
    </div>
  )
}

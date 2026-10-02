import { useState } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const files = ["README.md", "package.json", "src/index.ts"]

export default function CheckboxSelectAll() {
  const [picked, setPicked] = useState<string[]>(["README.md"])
  const all = picked.length === files.length
  const some = picked.length > 0 && !all
  return (
    <div className="grid w-full max-w-xs gap-3">
      <Label>
        <Checkbox checked={all} indeterminate={some} onCheckedChange={(c) => setPicked(c ? files : [])} />
        Select all
      </Label>
      <div className="grid gap-3 border-l pl-6">
        {files.map((f) => (
          <Label key={f}>
            <Checkbox
              checked={picked.includes(f)}
              onCheckedChange={(c) => setPicked((p) => (c ? [...p, f] : p.filter((x) => x !== f)))}
            />
            {f}
          </Label>
        ))}
      </div>
    </div>
  )
}

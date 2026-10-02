import { useState } from "react"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const options = [
  { value: "standard", label: "Standard", note: "3 to 5 days, free" },
  { value: "express", label: "Express", note: "Next business day, €9" },
  { value: "pickup", label: "Pick up", note: "Ready in 2 hours" },
]

export default function RadioGroupShipping() {
  const [value, setValue] = useState("standard")
  return (
    <RadioGroup value={value} onValueChange={(v) => setValue(String(v))} className="max-w-xs">
      {options.map((o) => (
        <Label key={o.value} className="items-start">
          <RadioGroupItem value={o.value} className="mt-0.5" />
          <span className="grid gap-0.5">
            {o.label}
            <span className="font-normal text-muted-foreground">{o.note}</span>
          </span>
        </Label>
      ))}
    </RadioGroup>
  )
}

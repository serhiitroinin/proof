import { useState } from "react"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function SliderWithValue() {
  const [value, setValue] = useState<number | readonly number[]>(0.7)
  const shown = Array.isArray(value) ? value[0] : (value as number)
  return (
    <div className="grid w-full max-w-xs gap-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="temperature">Temperature</Label>
        <span className="font-mono text-xs text-muted-foreground">{shown.toFixed(1)}</span>
      </div>
      <Slider id="temperature" min={0} max={2} step={0.1} value={value} onValueChange={setValue} aria-label="Temperature" />
    </div>
  )
}

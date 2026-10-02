import { useState } from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const ranges = { day: "Tuesday 30 September", week: "Week 40", month: "September 2026", year: "2026" }

export default function ToggleGroupSegmented() {
  const [range, setRange] = useState<string[]>(["week"])
  return (
    <div className="grid gap-3">
      <ToggleGroup value={range} onValueChange={(v) => v.length && setRange(v as string[])}>
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
        <ToggleGroupItem value="year">Year</ToggleGroupItem>
      </ToggleGroup>
      <p className="text-xs text-muted-foreground">Showing {ranges[range[0] as keyof typeof ranges]}</p>
    </div>
  )
}

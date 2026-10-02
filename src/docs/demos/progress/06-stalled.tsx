import { useEffect, useState } from "react"

import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"

const steps: [number, number][] = [
  [200, 12],
  [600, 28],
  [1000, 41],
  [1200, 46],
  [6200, 70],
  [6800, 88],
  [7400, 100],
]

export default function ProgressStalled() {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const timers = steps.map(([at, v]) => setTimeout(() => setValue(v), at))
    return () => timers.forEach(clearTimeout)
  }, [])
  return (
    <Progress value={value} className="max-w-sm">
      <ProgressLabel>{value >= 100 ? "Synced 1,204 files" : value === 46 ? "Waiting for iCloud" : "Syncing"}</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
}

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"

const steps = [18, 34, 52, 61, 83, 100]

export default function ProgressDone() {
  const [run, setRun] = useState(0)
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
    const timers = steps.map((v, i) => setTimeout(() => setValue(v), 300 + i * 400))
    return () => timers.forEach(clearTimeout)
  }, [run])
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={value}>
        <ProgressLabel>{value >= 100 ? "Plan ready · 9 moves" : "Planning moves"}</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Button variant="outline" size="sm" className="self-start" onClick={() => {
          setValue(0)
          setRun((r) => r + 1)
        }}>
        {run ? "Replay" : "Apply plan"}
      </Button>
    </div>
  )
}

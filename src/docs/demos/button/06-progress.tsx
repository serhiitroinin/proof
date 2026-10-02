import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

export default function ButtonProgress() {
  const [progress, setProgress] = useState<number>()
  useEffect(() => {
    if (progress === undefined) return
    if (progress >= 1) {
      const t = setTimeout(() => setProgress(undefined), 1400)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setProgress(Math.min(1, progress + 0.18 + Math.random() * 0.14)), 400)
    return () => clearTimeout(t)
  }, [progress])
  return (
    <div className="flex items-center gap-4">
      <Button className="w-32" progress={progress} onClick={() => setProgress(0)}>
        Apply plan
      </Button>
      <span className="font-mono text-xs text-muted-foreground">
        {progress === undefined ? "9 moves" : `${Math.round(progress * 100)}%`}
      </span>
    </div>
  )
}

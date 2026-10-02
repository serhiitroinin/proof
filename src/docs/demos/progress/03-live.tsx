import { useEffect, useState } from "react"

import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"

export default function ProgressLive() {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 4)), 400)
    return () => clearInterval(id)
  }, [])
  return (
    <Progress value={value} className="max-w-sm">
      <ProgressLabel>Indexing workspace</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
}

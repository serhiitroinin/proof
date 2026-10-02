import { useState } from "react"

import { Button } from "@/components/ui/button"
import { NumberRoll } from "@/components/ui/number-roll"

export default function NumberRollCount() {
  const [value, setValue] = useState(1204)
  return (
    <div className="flex items-baseline gap-3">
      <NumberRoll value={value} variant="figure" />
      <span className="font-mono text-xs text-faint">files</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setValue((v) => {
            const n = v + Math.round(4 + Math.random() * 40)
            return n > 1490 ? n - 380 : n
          })
        }
      >
        Rescan
      </Button>
    </div>
  )
}

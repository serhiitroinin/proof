import { useState } from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StreamText } from "@/components/ui/stream-text"

export default function StreamTextAnswer() {
  const [k, setK] = useState(0)
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <StreamText key={k}>
        The 03:10 low came after yesterday’s evening run: glucose drifted down overnight, as it did after your last two long runs. A small snack before bed would likely have kept you above 3.9.
      </StreamText>
      <div>
        <Button variant="outline" size="sm" onClick={() => setK((x) => x + 1)}>
          <RotateCcwIcon data-icon="inline-start" />
          Replay
        </Button>
      </div>
    </div>
  )
}

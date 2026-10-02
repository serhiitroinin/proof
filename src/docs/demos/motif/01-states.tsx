import { useState } from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Motif } from "@/components/ui/motif"

export default function MotifStates() {
  const [k, setK] = useState(0)
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Plan ready · 9 moves</span>
        <Motif key={`done-${k}`} state="done" width={240} size={11} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-destructive">Lost access to ~/Downloads</span>
        <Motif key={`error-${k}`} state="error" width={240} size={11} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Syncing · 46%</span>
        <Motif state="running" progress={0.46} width={240} size={10} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Waiting for iCloud</span>
        <Motif state="stalled" progress={0.46} width={240} size={10} />
      </div>
      <div>
        <Button variant="outline" size="sm" onClick={() => setK((x) => x + 1)}>
          <RotateCcwIcon data-icon="inline-start" />
          Replay
        </Button>
      </div>
    </div>
  )
}

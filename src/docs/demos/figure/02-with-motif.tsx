import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Figure, FigureCaption, FigureUnit, FigureValue } from "@/components/ui/figure"
import { Motif } from "@/components/ui/motif"

export default function FigureWithMotif() {
  const [v, setV] = useState(1204)
  return (
    <Figure>
      <FigureValue value={v}>
        <FigureUnit>files tidied</FigureUnit>
      </FigureValue>
      <Motif width={220} size={9} progress={Math.min(1, v / 1500)} state={v >= 1500 ? "done" : "running"} />
      <FigureCaption>of 1,500 this month</FigureCaption>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setV(v + 1)}>
          +1
        </Button>
        <Button size="sm" variant="outline" onClick={() => setV(v + 26)}>
          +26
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setV(1204)}>
          Reset
        </Button>
      </div>
    </Figure>
  )
}

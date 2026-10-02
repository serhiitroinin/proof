import { useState } from "react"

import { NumberField } from "@/components/ui/number-field"

export default function NumberFieldPosition() {
  const [box, setBox] = useState([24, 140, 96, 28])
  const set = (i: number) => (v: number) => setBox((b) => b.map((x, j) => (j === i ? v : x)))
  return (
    <div className="grid w-56 grid-cols-2 gap-1.5">
      <NumberField label="X" value={box[0]} onChange={set(0)} />
      <NumberField label="Y" value={box[1]} onChange={set(1)} />
      <NumberField label="W" value={box[2]} onChange={set(2)} min={0} />
      <NumberField label="H" value={box[3]} onChange={set(3)} min={0} />
    </div>
  )
}

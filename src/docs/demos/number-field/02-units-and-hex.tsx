import { useState } from "react"

import { HexField, NumberField } from "@/components/ui/number-field"

export default function NumberFieldUnitsAndHex() {
  const [angle, setAngle] = useState(45)
  const [opacity, setOpacity] = useState(80)
  const [hex, setHex] = useState("1A1A19")
  return (
    <div className="flex w-56 flex-col gap-1.5">
      <div className="grid grid-cols-2 gap-1.5">
        <NumberField label="∠" unit="°" value={angle} onChange={setAngle} min={0} max={360} />
        <NumberField label="α" unit="%" value={opacity} onChange={setOpacity} min={0} max={100} />
      </div>
      <HexField value={hex} onChange={setHex} alpha={opacity} aria-label="Fill colour" />
      <NumberField label="W" unit="px" value={96} size="lg" disabled />
    </div>
  )
}

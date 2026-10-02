import { Button } from "@/components/ui/button"
import { DotField } from "@/components/ui/dot-field"

export default function DotFieldRipple() {
  return (
    <DotField mode="ripple" className="max-w-md">
      <Button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Apply plan</Button>
    </DotField>
  )
}

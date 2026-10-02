import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function LabelWithCheckbox() {
  return (
    <Label>
      <Checkbox defaultChecked />
      Remember this device
    </Label>
  )
}

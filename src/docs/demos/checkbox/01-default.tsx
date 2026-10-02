import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function CheckboxDefault() {
  return (
    <Label>
      <Checkbox defaultChecked />
      Accept the terms of service
    </Label>
  )
}

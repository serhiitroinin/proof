import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function CheckboxStates() {
  return (
    <div className="grid gap-4">
      <Label>
        <Checkbox />
        Unchecked
      </Label>
      <Label>
        <Checkbox defaultChecked />
        Checked
      </Label>
      <Label>
        <Checkbox indeterminate />
        Indeterminate
      </Label>
      <Label>
        <Checkbox disabled />
        Disabled
      </Label>
      <Label>
        <Checkbox disabled defaultChecked />
        Disabled and checked
      </Label>
      <Label>
        <Checkbox aria-invalid />
        Invalid
      </Label>
    </div>
  )
}

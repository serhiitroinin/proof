import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioGroupStates() {
  return (
    <RadioGroup defaultValue="on" className="w-fit">
      <Label>
        <RadioGroupItem value="on" />
        Checked
      </Label>
      <Label>
        <RadioGroupItem value="off" />
        Unchecked
      </Label>
      <Label>
        <RadioGroupItem value="locked" disabled />
        Disabled
      </Label>
      <Label>
        <RadioGroupItem value="bad" aria-invalid />
        Invalid
      </Label>
    </RadioGroup>
  )
}

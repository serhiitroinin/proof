import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioGroupDefault() {
  return (
    <RadioGroup defaultValue="weekly" className="w-fit">
      <Label>
        <RadioGroupItem value="daily" />
        Daily
      </Label>
      <Label>
        <RadioGroupItem value="weekly" />
        Weekly
      </Label>
      <Label>
        <RadioGroupItem value="never" />
        Never
      </Label>
    </RadioGroup>
  )
}

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioGroupHorizontal() {
  return (
    <RadioGroup defaultValue="eu" className="flex w-fit gap-6">
      <Label>
        <RadioGroupItem value="us" />
        US East
      </Label>
      <Label>
        <RadioGroupItem value="eu" />
        EU West
      </Label>
      <Label>
        <RadioGroupItem value="ap" />
        Asia Pacific
      </Label>
    </RadioGroup>
  )
}

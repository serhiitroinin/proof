import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function FieldChoiceCards() {
  return (
    <RadioGroup defaultValue="pro" className="max-w-sm">
      <FieldLabel htmlFor="plan-free">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Free</FieldTitle>
            <FieldDescription>Up to 3 projects, community support.</FieldDescription>
          </FieldContent>
          <RadioGroupItem value="free" id="plan-free" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="plan-pro">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Pro</FieldTitle>
            <FieldDescription>Unlimited projects, priority support, €12 per seat.</FieldDescription>
          </FieldContent>
          <RadioGroupItem value="pro" id="plan-pro" />
        </Field>
      </FieldLabel>
    </RadioGroup>
  )
}

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"

export default function FieldFieldset() {
  return (
    <FieldSet className="max-w-sm">
      <FieldLegend>Notify me about</FieldLegend>
      <FieldDescription>You can change these any time in Settings.</FieldDescription>
      <FieldGroup data-slot="checkbox-group">
        <Field orientation="horizontal">
          <Checkbox id="n-mentions" defaultChecked />
          <FieldLabel htmlFor="n-mentions">Mentions</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="n-reviews" defaultChecked />
          <FieldLabel htmlFor="n-reviews">Review requests</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="n-deploys" />
          <FieldLabel htmlFor="n-deploys">Failed deploys</FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"

export default function CheckboxWithDescription() {
  return (
    <Field orientation="horizontal" className="max-w-sm">
      <Checkbox id="sync" defaultChecked />
      <FieldContent>
        <FieldLabel htmlFor="sync">Sync across devices</FieldLabel>
        <FieldDescription>Keep drafts and settings in step on every device you sign in to.</FieldDescription>
      </FieldContent>
    </Field>
  )
}

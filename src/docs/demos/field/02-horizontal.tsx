import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export default function FieldHorizontal() {
  return (
    <FieldGroup className="max-w-sm">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="two-factor">Two-factor authentication</FieldLabel>
          <FieldDescription>Ask for a code from your authenticator app at sign-in.</FieldDescription>
        </FieldContent>
        <Switch id="two-factor" defaultChecked />
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="digest">Weekly digest</FieldLabel>
          <FieldDescription>A summary of activity every Monday morning.</FieldDescription>
        </FieldContent>
        <Switch id="digest" />
      </Field>
    </FieldGroup>
  )
}

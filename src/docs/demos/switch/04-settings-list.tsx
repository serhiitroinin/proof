import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export default function SwitchSettingsList() {
  return (
    <FieldGroup className="max-w-sm">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="s-public">Public profile</FieldLabel>
          <FieldDescription>Anyone with the link can see your projects.</FieldDescription>
        </FieldContent>
        <Switch id="s-public" />
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="s-analytics">Usage analytics</FieldLabel>
          <FieldDescription>Share anonymous usage data to help us prioritise.</FieldDescription>
        </FieldContent>
        <Switch id="s-analytics" defaultChecked />
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="s-beta">Beta features</FieldLabel>
          <FieldDescription>Try new features before they ship to everyone.</FieldDescription>
        </FieldContent>
        <Switch id="s-beta" disabled />
      </Field>
    </FieldGroup>
  )
}

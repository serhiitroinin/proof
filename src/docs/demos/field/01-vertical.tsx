import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldVertical() {
  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="name">Full name</FieldLabel>
        <Input id="name" placeholder="Mira Okafor" />
      </Field>
      <Field>
        <FieldLabel htmlFor="email">Work email</FieldLabel>
        <Input id="email" type="email" placeholder="mira@northwind.com" />
        <FieldDescription>We send invoices and security alerts here.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}

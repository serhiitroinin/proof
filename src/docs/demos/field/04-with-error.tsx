import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldWithError() {
  return (
    <Field data-invalid className="max-w-sm">
      <FieldLabel htmlFor="handle">Handle</FieldLabel>
      <Input id="handle" defaultValue="mira okafor" aria-invalid />
      <FieldError>Handles can only contain letters, numbers and hyphens.</FieldError>
    </Field>
  )
}

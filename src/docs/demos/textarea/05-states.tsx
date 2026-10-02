import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export default function TextareaStates() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <Textarea aria-label="Rest" placeholder="Rest" minRows={2} />
      <Textarea aria-label="Read-only" readOnly minRows={2} defaultValue="Created by rule Invoices on 2 October." />
      <Textarea aria-label="Disabled" disabled minRows={2} limit={140} defaultValue="Archived rules cannot be edited." />
      <Field data-invalid>
        <FieldLabel htmlFor="reason">Reason</FieldLabel>
        <Textarea id="reason" aria-invalid minRows={2} defaultValue="Too short." />
        <FieldError>Write at least 20 characters.</FieldError>
      </Field>
    </div>
  )
}

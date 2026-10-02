import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export default function TextareaLimit() {
  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="bio">Bio</FieldLabel>
      <Textarea
        id="bio"
        limit={160}
        minRows={2}
        defaultValue="Design engineer in Amsterdam. I build small, local-first tools for files, glucose and agents."
      />
      <FieldDescription>Shown on your public profile.</FieldDescription>
    </Field>
  )
}

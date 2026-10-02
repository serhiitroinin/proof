import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioGroupWithDescription() {
  return (
    <RadioGroup defaultValue="squash" className="max-w-sm gap-4">
      <Field orientation="horizontal">
        <RadioGroupItem value="merge" id="m-merge" />
        <FieldContent>
          <FieldLabel htmlFor="m-merge">Create a merge commit</FieldLabel>
          <FieldDescription>All commits are added to the base branch.</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="squash" id="m-squash" />
        <FieldContent>
          <FieldLabel htmlFor="m-squash">Squash and merge</FieldLabel>
          <FieldDescription>One commit with the pull request title as its message.</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="rebase" id="m-rebase" />
        <FieldContent>
          <FieldLabel htmlFor="m-rebase">Rebase and merge</FieldLabel>
          <FieldDescription>Commits are replayed on the base branch without a merge commit.</FieldDescription>
        </FieldContent>
      </Field>
    </RadioGroup>
  )
}

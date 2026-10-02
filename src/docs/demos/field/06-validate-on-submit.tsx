import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldValidateOnSubmit() {
  const [path, setPath] = useState("~/Downlaods")
  const [error, setError] = useState<string>()
  return (
    <form
      className="flex w-full max-w-sm items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        setError(path.trim() === "~/Downloads" ? undefined : `No folder at ${path}`)
      }}
    >
      <Field data-invalid={!!error || undefined} className="flex-1">
        <FieldLabel htmlFor="watch-path">Folder to watch</FieldLabel>
        <Input
          id="watch-path"
          value={path}
          aria-invalid={!!error || undefined}
          spellCheck={false}
          onChange={(e) => {
            setPath(e.target.value)
            setError(undefined)
          }}
        />
        {error && <FieldError>{error}</FieldError>}
      </Field>
      <Button type="submit" variant="outline" className="self-start mt-6">
        Watch
      </Button>
    </form>
  )
}

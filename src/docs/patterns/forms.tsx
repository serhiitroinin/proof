import { useState } from "react"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { MotifDot } from "@/components/ui/motif"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

import { Example, PageHeader, PatternId, Related, Section, Uses } from "../kit"

const TEMPLATES = ["Blank canvas", "Marketing site", "Slide deck"]
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "untitled"

function CreateRule() {
  const [name, setName] = useState("")
  const [touched, setTouched] = useState(false)
  const [template, setTemplate] = useState<string | null>(TEMPLATES[0])
  const [desc, setDesc] = useState("")
  const [tags, setTags] = useState(["design"])
  const [tag, setTag] = useState("")
  const [zoom, setZoom] = useState(60)
  const [priv, setPriv] = useState(false)
  const [created, setCreated] = useState<string | null>(null)
  const invalid = touched && !name.trim()
  const slug = slugify(name)

  const reset = () => {
    setName("")
    setTouched(false)
    setTemplate(TEMPLATES[0])
    setDesc("")
    setTags(["design"])
    setTag("")
    setZoom(60)
    setPriv(false)
    setCreated(null)
  }

  return (
    <form
      className="flex w-full max-w-xl flex-col gap-6"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        setTouched(true)
        if (!name.trim()) return
        setCreated(slug)
      }}
    >
      <FieldGroup>
        <Field data-invalid={invalid || undefined}>
          <FieldLabel htmlFor="rule-name">
            Name <span className="font-normal text-faint">Required</span>
          </FieldLabel>
          <Input
            id="rule-name"
            placeholder="Untitled"
            value={name}
            aria-invalid={invalid || undefined}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          {invalid ? <FieldError>Give it a name.</FieldError> : <FieldDescription>Shown in the sidebar and the window title.</FieldDescription>}
        </Field>
        <Field>
          <FieldLabel htmlFor="rule-slug">Slug</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>vellum.app/</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="rule-slug" readOnly value={slug} />
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="rule-template">Template</FieldLabel>
          <Select value={template} onValueChange={setTemplate}>
            <SelectTrigger id="rule-template" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="rule-desc">
            Description <span className="font-normal text-faint">Optional</span>
          </FieldLabel>
          <Textarea
            id="rule-desc"
            placeholder="What is it for?"
            minRows={2}
            limit={140}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="rule-tags">Tags</FieldLabel>
          <InputGroup className="h-auto min-h-8 flex-wrap gap-1 py-1 pl-1">
            {tags.map((t) => (
              <span key={t} className="inline-flex h-5 items-center gap-1 rounded-sm bg-muted pr-0.5 pl-2 text-xs font-medium">
                {t}
                <button
                  type="button"
                  aria-label={`Remove ${t}`}
                  className="grid size-4 place-items-center rounded-xs text-muted-foreground hover:bg-fill-active hover:text-foreground"
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                >
                  <XIcon className="size-3" />
                </button>
              </span>
            ))}
            <InputGroupInput
              id="rule-tags"
              placeholder={tags.length ? "" : "Add a tag"}
              value={tag}
              className="min-w-24 flex-1"
              onChange={(e) => setTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tag.trim()) {
                  e.preventDefault()
                  if (!tags.includes(tag.trim())) setTags([...tags, tag.trim()])
                  setTag("")
                }
                if (e.key === "Backspace" && !tag && tags.length) setTags(tags.slice(0, -1))
              }}
            />
          </InputGroup>
          <FieldDescription>Enter adds, Backspace removes the last.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>
            Canvas zoom <span className="font-mono font-normal text-faint tabular-nums">{zoom}%</span>
          </FieldLabel>
          <Slider min={10} max={200} step={5} value={zoom} onValueChange={(v) => setZoom(Array.isArray(v) ? v[0] : v)} />
        </Field>
        <Field orientation="horizontal">
          <Switch id="rule-private" checked={priv} onCheckedChange={setPriv} />
          <FieldLabel htmlFor="rule-private" className="flex-1">
            Private file
            <FieldDescription>Only you and people you invite.</FieldDescription>
          </FieldLabel>
        </Field>
      </FieldGroup>
      <div className="flex items-center gap-2 border-t pt-4">
        {created && (
          <span className="flex items-center gap-2 text-sm text-muted-foreground animate-enter" key={created}>
            <MotifDot size={8} />
            Created <span className="font-mono text-foreground">{created}</span>
          </span>
        )}
        <div className="ml-auto flex gap-2">
          <Button type="button" variant="ghost" onClick={reset}>
            Reset
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </div>
    </form>
  )
}

const ANATOMY: [string, string][] = [
  ["Label", "Sentence case. Mark only the exception: Required or Optional."],
  ["Control", "Full width of the form column. 32px tall; textareas grow."],
  ["Help", "One sentence under the control. The error replaces it and the border turns destructive."],
  ["Count", "Mono, right-aligned on the help line. Turns warning at the limit."],
]

export default function FormsPage() {
  return (
    <>
      <PageHeader group="Patterns" title="Forms">
        Validate on blur and on submit, keep what was typed, put one action at the bottom right.
      </PageHeader>

      <Section title="Create a rule" note="Blur a field or submit empty to see the error.">
        <div className="flex flex-wrap items-center gap-3">
          <PatternId>form-01</PatternId>
          <Uses
            ids={[
              ["field", "Field"],
              ["input", "Input"],
              ["select", "Select"],
              ["textarea", "Textarea"],
              ["slider", "Slider"],
              ["switch", "Switch"],
              ["button", "Button"],
            ]}
          />
        </div>
        <Example>
          <CreateRule />
        </Example>
      </Section>

      <Section title="Field anatomy" note="Only the label and the control are required.">
        <div className="flex flex-col gap-3 rounded-lg border bg-background p-6 text-sm">
          {ANATOMY.map(([part, text]) => (
            <div key={part} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <span className="w-32 shrink-0 font-medium">{part}</span>
              <span className="text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>
      </Section>

      <Related
        ids={[
          ["field", "Field"],
          ["input", "Input"],
          ["dialog", "Dialog"],
        ]}
      />
    </>
  )
}

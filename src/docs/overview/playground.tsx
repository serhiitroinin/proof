import type { ReactNode } from "react"
import { SearchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item"
import { Kbd } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { Motif } from "@/components/ui/motif"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

import { Chip, PageHeader, Section } from "../kit"

// Literal column layouts so the lint can read every class.
const COLS = {
  2: "grid grid-cols-[80px_repeat(2,minmax(0,1fr))] items-center gap-x-4 gap-y-3",
  3: "grid grid-cols-[80px_repeat(3,minmax(0,1fr))] items-center gap-x-4 gap-y-3",
  4: "grid grid-cols-[80px_repeat(4,minmax(0,1fr))] items-center gap-x-4 gap-y-3",
  5: "grid grid-cols-[80px_repeat(5,minmax(0,1fr))] items-center gap-x-4 gap-y-3",
} as const

function Matrix<S extends string>({ states, rows }: { states: readonly S[]; rows: [label: string, render: (state: S) => ReactNode][] }) {
  const cols = COLS[states.length as keyof typeof COLS]
  return (
    <div className={cols}>
      <span />
      {states.map((s) => (
        <span key={s} className="font-mono text-xs text-faint">
          {s}
        </span>
      ))}
      {rows.map(([label, render]) => (
        <RowCells key={label} label={label} cells={states.map((s) => ({ s, node: render(s) }))} />
      ))}
    </div>
  )
}

function RowCells({ label, cells }: { label: string; cells: { s: string; node: ReactNode }[] }) {
  return (
    <>
      <span className="font-mono text-xs text-faint">{label}</span>
      {cells.map(({ s, node }) => (
        <div key={s} className="flex min-w-0 items-center">
          {node}
        </div>
      ))}
    </>
  )
}

function Bench({ title, note, docs, children }: { title: string; note?: string; docs: [id: string, title: string]; children: ReactNode }) {
  return (
    <Section title={title} note={note}>
      <div className="flex flex-col gap-4 rounded-lg border bg-background p-6">{children}</div>
      <div>
        <Chip id={docs[0]}>{docs[1]} docs →</Chip>
      </div>
    </Section>
  )
}

const BTN = ["Rest", "Disabled", "Loading"] as const
type Btn = (typeof BTN)[number]
const btn = (variant: "default" | "outline" | "ghost" | "destructive", label: string) => (st: Btn) => (
  <Button size="sm" variant={variant} disabled={st === "Disabled"} progress={st === "Loading" ? 0.42 : undefined}>
    {label}
  </Button>
)

const IN = ["Rest", "Filled", "Disabled", "Read-only", "Error"] as const
type In = (typeof IN)[number]
const inProps = (st: In, value: string) => ({
  defaultValue: st === "Rest" ? "" : value,
  disabled: st === "Disabled",
  readOnly: st === "Read-only",
  "aria-invalid": st === "Error" || undefined,
})

const CH = ["Rest", "On", "Disabled", "Disabled on"] as const
type Ch = (typeof CH)[number]
const on = (st: Ch) => st === "On" || st === "Disabled on"
const off = (st: Ch) => st.startsWith("Disabled")

export default function Playground() {
  return (
    <>
      <PageHeader
        group="Overview"
        title="Playground"
        lead="Every control in every state on one page; check it before you export."
      />

      <Bench title="Buttons" note="Hover, pressed and focus are live." docs={["button", "Button"]}>
        <Matrix
          states={BTN}
          rows={[
            ["primary", btn("default", "Approve")],
            ["default", btn("outline", "Reject")],
            ["ghost", btn("ghost", "Cancel")],
            ["danger", btn("destructive", "Delete")],
          ]}
        />
      </Bench>

      <Bench title="Text fields" note="Invalid fields take the destructive border." docs={["input", "Input"]}>
        <Matrix
          states={IN}
          rows={[
            ["text", (st) => <Input {...inProps(st, "Landing page")} placeholder="Untitled" aria-label="Title" />],
            [
              "search",
              (st) => (
                <InputGroup>
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                  <InputGroupInput {...inProps(st, "hero")} placeholder="Search" aria-label="Search" />
                  <InputGroupAddon align="inline-end">
                    <Kbd>/</Kbd>
                  </InputGroupAddon>
                </InputGroup>
              ),
            ],
            ["number", (st) => <Input {...inProps(st, "7.4")} type="number" placeholder="0" aria-label="Value" />],
            ["textarea", (st) => <Textarea {...inProps(st, "Move 212 files to Archive.")} placeholder="Notes" aria-label="Notes" rows={2} />],
          ]}
        />
      </Bench>

      <Bench title="Choices" note="The Signature page sets the on state to ink or accent." docs={["checkbox", "Checkbox"]}>
        <Matrix
          states={CH}
          rows={[
            [
              "check",
              (st) => (
                <Label>
                  <Checkbox checked={on(st)} disabled={off(st)} readOnly />
                  Label
                </Label>
              ),
            ],
            [
              "mixed",
              (st) => (
                <Label>
                  <Checkbox indeterminate={on(st)} disabled={off(st)} readOnly />
                  Label
                </Label>
              ),
            ],
            [
              "radio",
              (st) => (
                <RadioGroup value={on(st) ? "a" : ""} disabled={off(st)} readOnly>
                  <Label>
                    <RadioGroupItem value="a" />
                    Label
                  </Label>
                </RadioGroup>
              ),
            ],
            [
              "switch",
              (st) => (
                <Label>
                  <Switch checked={on(st)} disabled={off(st)} readOnly />
                  Label
                </Label>
              ),
            ],
          ]}
        />
      </Bench>

      <Bench title="Sliders and progress" note="One 4px track for slider, progress and motif." docs={["slider", "Slider"]}>
        <Matrix
          states={["Rest", "Disabled"] as const}
          rows={[
            ["range", (st) => <Slider defaultValue={[40]} disabled={st === "Disabled"} aria-label="Range" className="w-full" />],
            ["progress", (st) => (st === "Rest" ? <Progress value={40} className="w-full" /> : <Progress value={null} className="w-full" />)],
            ["motif", (st) => <Motif width={160} size={8} progress={0.4} state={st === "Rest" ? "running" : "stalled"} />],
          ]}
        />
      </Bench>

      <Bench title="Badges" note="Status as a tint. The spinner marks work in progress." docs={["badge", "Badge"]}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="tool" dot>
            Proposed
          </Badge>
          <Badge>
            <Spinner />
            Working
          </Badge>
          <Badge variant="success">Approved</Badge>
          <Badge variant="warning">▲ Review</Badge>
          <Badge variant="destructive">Rejected</Badge>
          <Badge variant="info">Synced</Badge>
          <Badge variant="outline">v0.4.2</Badge>
          <Badge variant="primary">New</Badge>
          <Badge variant="secondary">Draft</Badge>
        </div>
      </Bench>

      <Bench title="Rows" note="The 2px marker follows the pointer and settles on the selection." docs={["item", "Item"]}>
        <ItemGroup variant="outline" className="max-w-md">
          <Item size="sm">
            <ItemContent>
              <ItemTitle>Inbox</ItemTitle>
              <ItemDescription>Rest</ItemDescription>
            </ItemContent>
            <Kbd>⌘1</Kbd>
          </Item>
          <Item size="sm" aria-selected>
            <ItemContent>
              <ItemTitle>Downloads</ItemTitle>
              <ItemDescription>Selected</ItemDescription>
            </ItemContent>
            <Kbd>↵</Kbd>
          </Item>
          <Item size="sm" aria-disabled>
            <ItemContent>
              <ItemTitle>Desktop</ItemTitle>
              <ItemDescription>Disabled</ItemDescription>
            </ItemContent>
          </Item>
          <Item size="sm">
            <ItemContent>
              <ItemTitle>
                <span className="text-destructive">Delete rule</span>
              </ItemTitle>
              <ItemDescription>Danger</ItemDescription>
            </ItemContent>
            <Kbd>⌫</Kbd>
          </Item>
        </ItemGroup>
      </Bench>
    </>
  )
}

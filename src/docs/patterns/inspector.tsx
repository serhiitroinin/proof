import { useState } from "react"
import { EyeIcon, EyeOffIcon, HashIcon, ImageIcon, PlusIcon, SquareIcon, TypeIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HexField, NumberField } from "@/components/ui/number-field"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Example, PageHeader, PatternId, Related, Section, Uses } from "../kit"
import { Meta } from "./shared"

export type Box = [x: number, y: number, w: number, h: number]
export type InspectedLayer = { name: string; kind: "frame" | "text" | "rect" | "image"; box: Box }

const KIND_ICON = { frame: HashIcon, text: TypeIcon, rect: SquareIcon, image: ImageIcon }

function Label({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex h-6 items-center text-xs font-medium text-muted-foreground">
      {children}
      {action && <span className="ml-auto">{action}</span>}
    </div>
  )
}

type Fill = { hex: string; a: number; on: boolean }

const FILLS: Fill[] = [
  { hex: "FFFFFF", a: 100, on: true },
  { hex: "1A1A19", a: 6, on: true },
]

export function Inspector({ layer, onBox, className }: { layer: InspectedLayer; onBox?: (box: Box) => void; className?: string }) {
  const [layout, setLayout] = useState("column")
  const [gap, setGap] = useState(12)
  const [pad, setPad] = useState(24)
  const [fills, setFills] = useState<Fill[]>(FILLS)
  const Icon = KIND_ICON[layer.kind]
  const setBox = (i: number) => (v: number) => {
    const b = [...layer.box] as Box
    b[i] = v
    onBox?.(b)
  }
  const setFill = (i: number, p: Partial<Fill>) => setFills((fs) => fs.map((f, j) => (j === i ? { ...f, ...p } : f)))

  return (
    <div className={`flex w-full flex-col divide-y text-sm ${className ?? ""}`}>
      <div className="flex h-10 items-center gap-2 px-3">
        <Icon className="size-3.5 text-muted-foreground" />
        <span className="truncate font-medium">{layer.name}</span>
        <Badge variant="outline" className="ml-auto">
          <span className="font-mono">{layer.kind}</span>
        </Badge>
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <Label>Position</Label>
        <div className="grid grid-cols-2 gap-1.5">
          <NumberField label="X" value={layer.box[0]} onChange={setBox(0)} />
          <NumberField label="Y" value={layer.box[1]} onChange={setBox(1)} />
          <NumberField label="W" value={layer.box[2]} onChange={setBox(2)} min={0} />
          <NumberField label="H" value={layer.box[3]} onChange={setBox(3)} min={0} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <Label>Auto layout</Label>
        <ToggleGroup
          value={[layout]}
          onValueChange={(v) => v.length && setLayout(v[0] as string)}
          size="sm"
          aria-label="Direction"
          className="w-full *:flex-1"
        >
          <ToggleGroupItem value="none">None</ToggleGroupItem>
          <ToggleGroupItem value="row">Row</ToggleGroupItem>
          <ToggleGroupItem value="column">Column</ToggleGroupItem>
        </ToggleGroup>
        {layout !== "none" && (
          <div className="grid grid-cols-2 gap-1.5 animate-enter">
            <NumberField label="gap" value={gap} onChange={setGap} min={0} />
            <NumberField label="pad" value={pad} onChange={setPad} min={0} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <Label
          action={
            <Button variant="ghost" size="icon-xs" aria-label="Add fill" onClick={() => setFills([...fills, { hex: "808080", a: 100, on: true }])}>
              <PlusIcon />
            </Button>
          }
        >
          Fill
        </Label>
        {fills.map((f, i) => (
          <div key={i} data-off={!f.on || undefined} className="group/fill flex items-center gap-1 data-off:opacity-50">
            <HexField className="flex-1" aria-label="Hex" value={f.hex} alpha={f.a} onChange={(hex) => setFill(i, { hex })} />
            <span
              data-set={!f.on || undefined}
              className="flex opacity-0 transition-opacity group-hover/fill:opacity-100 has-focus-visible:opacity-100 data-set:opacity-100"
            >
              <Button variant="ghost" size="icon-xs" aria-label={f.on ? "Hide fill" : "Show fill"} aria-pressed={!f.on} onClick={() => setFill(i, { on: !f.on })}>
                {f.on ? <EyeIcon /> : <EyeOffIcon />}
              </Button>
              <Button variant="ghost" size="icon-xs" aria-label="Remove fill" onClick={() => setFills(fills.filter((_, j) => j !== i))}>
                <XIcon />
              </Button>
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <Label
          action={
            <Button variant="ghost" size="icon-xs" aria-label="Add effect">
              <PlusIcon />
            </Button>
          }
        >
          Effects
        </Label>
      </div>
    </div>
  )
}

function InspectorDemo() {
  const [layer, setLayer] = useState<InspectedLayer>({ name: "Button", kind: "rect", box: [24, 140, 96, 28] })
  return (
    <div className="w-65 overflow-hidden rounded-lg border bg-sidebar">
      <Inspector layer={layer} onBox={(box) => setLayer({ ...layer, box })} />
    </div>
  )
}

const ANATOMY: [string, string][] = [
  ["Header", "Kind icon, layer name, kind badge. The panel re-keys on selection, so section state resets."],
  ["Numeric field", "28px tall, two per row. One-letter label, mono tabular digits, unit last. ↑↓ nudges by 1, ⇧ by 10."],
  ["Segmented", "Direction is a three-way control at full width. A direction reveals gap and pad."],
  ["Rows", "A fill is swatch, hex and alpha in one field. Eye and remove show on hover. Off rows dim to 50%."],
  ["Section label", "Small muted type with the add button at the right. Hairlines separate sections."],
]

export default function InspectorPage() {
  return (
    <>
      <PageHeader group="Patterns" title="Inspector">
        The inspector edits the selection: compact numeric fields, collapsing sections, every value typed or scrubbed.
      </PageHeader>

      <Section title="Inspector" note="edit the numbers · ↑↓ nudges · hover a fill for its eye and remove">
        <Meta>
          <PatternId>inspector-01</PatternId>
          <Uses
            ids={[
              ["number-field", "Number field"],
              ["toggle-group", "Segmented"],
              ["badge", "Badge"],
            ]}
          />
        </Meta>
        <Example>
          <InspectorDemo />
        </Example>
      </Section>

      <Section title="Anatomy">
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
          ["navigation", "Sidebars and trees"],
          ["shell", "Editor shell"],
          ["number-field", "Number field"],
        ]}
      />
    </>
  )
}

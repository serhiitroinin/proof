import { useEffect, useState, type CSSProperties } from "react"
import { CheckIcon, CopyIcon, RotateCcwIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  applyTheme,
  baseNeutral,
  baseTokens,
  DEFAULTS,
  isDefault,
  RADII,
  readStoredTheme,
  TOOL_PRESETS,
  toCss,
  type ThemeSettings,
} from "@/lib/theme"

const HEX = /^#[0-9a-f]{6}$/i

export function ThemeEditor() {
  const [settings, setSettings] = useState<ThemeSettings>(readStoredTheme)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    applyTheme(settings)
  }, [settings])

  const base = baseTokens().light
  const neutral = settings.neutral ?? baseNeutral()
  const update = (patch: Partial<ThemeSettings>) => setSettings((s) => ({ ...s, ...patch }))

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toCss(settings))
      setCopied(true)
      toast("CSS copied", { description: ":root and .dark blocks for globals.css" })
      setTimeout(() => setCopied(false), 1600)
    } catch {
      toast.error("Clipboard unavailable")
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4">
      <Field orientation="horizontal">
        <FieldLabel htmlFor="theme-tint">Retint neutrals</FieldLabel>
        <Switch
          id="theme-tint"
          checked={settings.neutral !== null}
          onCheckedChange={(on) => update({ neutral: on ? baseNeutral() : null })}
        />
      </Field>

      <Field data-disabled={settings.neutral === null || undefined}>
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="theme-hue">Neutral hue</FieldLabel>
          <span className="text-xs text-muted-foreground tabular-nums">{neutral.hue}°</span>
        </div>
        <Slider
          id="theme-hue"
          aria-label="Neutral hue"
          disabled={settings.neutral === null}
          min={0}
          max={360}
          step={1}
          value={[neutral.hue]}
          onValueChange={(v) => update({ neutral: { ...neutral, hue: Array.isArray(v) ? v[0] : v } })}
        />
      </Field>

      <Field data-disabled={settings.neutral === null || undefined}>
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="theme-chroma">Neutral chroma</FieldLabel>
          <span className="text-xs text-muted-foreground tabular-nums">{neutral.chroma.toFixed(3)}</span>
        </div>
        <Slider
          id="theme-chroma"
          aria-label="Neutral chroma"
          disabled={settings.neutral === null}
          min={0}
          max={0.03}
          step={0.001}
          value={[neutral.chroma]}
          onValueChange={(v) => update({ neutral: { ...neutral, chroma: Array.isArray(v) ? v[0] : v } })}
        />
        <FieldDescription>Moves background, surfaces, ink and borders together; lightness stays.</FieldDescription>
      </Field>

      <ColourField
        id="theme-tool"
        label="Tool accent"
        description="Focus ring, selection and tool fills."
        value={settings.tool ?? base.tool}
        onChange={(tool) => update({ tool })}
      />

      <ColourField
        id="theme-brand"
        label="Brand"
        description="Brand fills, brand text and chart-1. Labels turn ink when white fails AA."
        value={settings.brand ?? base.brand}
        onChange={(brand) => update({ brand })}
      />

      <Field>
        <FieldLabel>Radius</FieldLabel>
        <ToggleGroup
          variant="outline"
          size="sm"
          spacing={0}
          aria-label="Control radius"
          value={[String(settings.radius ?? 8)]}
          onValueChange={(v) => {
            const r = (v as string[])[0]
            if (r !== undefined) update({ radius: Number(r) === 8 ? null : Number(r) })
          }}
        >
          {RADII.map((r) => (
            <ToggleGroupItem key={r} value={String(r)} aria-label={`${r} px`}>
              {r}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <FieldDescription>Controls use this value; cards take 1.5×, inner parts 0.5×.</FieldDescription>
      </Field>

      <Separator />

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setSettings(DEFAULTS)} disabled={isDefault(settings)}>
          <RotateCcwIcon data-icon="inline-start" />
          Reset
        </Button>
        <Button size="sm" onClick={copy}>
          {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
          {copied ? "Copied" : "Copy CSS"}
        </Button>
      </div>
    </div>
  )
}

function ColourField({
  id,
  label,
  description,
  value,
  onChange,
}: {
  id: string
  label: string
  description: string
  value: string
  onChange: (hex: string) => void
}) {
  // Holds a half-typed hex until it parses, so the picker does not snap mid-edit.
  const [typing, setTyping] = useState<string | null>(null)
  const draft = typing ?? value
  const set = (hex: string) => {
    setTyping(hex)
    if (HEX.test(hex)) onChange(hex.toLowerCase())
  }
  const preset = TOOL_PRESETS.find((p) => p.hex === value.toLowerCase())

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          aria-label={`${label} picker`}
          className="w-10 shrink-0"
          value={HEX.test(draft) ? draft : value}
          onChange={(e) => {
            set(e.target.value)
            setTyping(null)
          }}
        />
        <Input
          id={id}
          spellCheck={false}
          value={draft}
          aria-invalid={!HEX.test(draft) || undefined}
          onChange={(e) => set(e.target.value.trim())}
          onBlur={() => setTyping(null)}
        />
      </div>
      <ToggleGroup
        variant="outline"
        size="sm"
        aria-label={`${label} presets`}
        value={preset ? [preset.hex] : []}
        onValueChange={(v) => {
          const hex = (v as string[])[0]
          if (hex) set(hex)
        }}
        className="flex-wrap"
      >
        {TOOL_PRESETS.map((p) => (
          <ToggleGroupItem key={p.hex} value={p.hex} aria-label={p.name} title={`${p.name}: ${p.note}`}>
            <span aria-hidden className="size-3 rounded-full bg-(--swatch)" style={{ "--swatch": p.hex } as CSSProperties} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {preset && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{preset.name}</span> · {preset.note}
        </p>
      )}
      <FieldDescription>{description}</FieldDescription>
    </Field>
  )
}

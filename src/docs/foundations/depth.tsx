import { Fragment } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { PageHeader, Section } from "../kit"
import { Bullets, Mono, Tile, TokenTable } from "./shared"

// Literal class strings per level and state so the Tailwind lint can read every class.

type Level = 0 | 1 | 2 | 3 | 4
type State = "rest" | "hover" | "pressed" | "selected" | "disabled"

const LEVELS: [Level, string, string][] = [
  [0, "Flat", "Page, quiet regions, rows. Hairline edge."],
  [1, "Raised", "Buttons, keycaps, checked controls. Hairline and 1px shadow."],
  [2, "Floating", "Cards. Short shadow on the card hairline."],
  [3, "Overlay", "Menus, popovers, selects, toasts. Half-pixel ring, longer shadow."],
  [4, "Modal", "Dialogs and sheets. Largest shadow, lightest surface."],
]

const STATES: State[] = ["rest", "hover", "pressed", "selected", "disabled"]

const DP: Record<Level, Record<State, string>> = {
  0: {
    rest: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition border border-border bg-background",
    hover: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition border border-border bg-fill text-foreground",
    pressed: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition border border-border bg-fill-active text-foreground translate-y-px",
    selected: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-tool-subtle text-tool-text ring-2 ring-tool ring-inset",
    disabled: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-fill text-faint",
  },
  1: {
    rest: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition border border-card-border bg-surface-1 shadow-xs",
    hover: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition border border-border-heavy bg-surface-1 text-foreground shadow-xs",
    pressed: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition border border-border-strong bg-surface-1 text-foreground shadow-pressed translate-y-px",
    selected: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-tool-subtle text-tool-text ring-2 ring-tool ring-inset",
    disabled: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-fill text-faint",
  },
  2: {
    rest: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition border border-card-border bg-surface-2 shadow-md",
    hover: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition border border-border-heavy bg-surface-2 text-foreground shadow-lg -translate-y-px",
    pressed: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition border border-border-strong bg-surface-2 text-foreground shadow-xs",
    selected: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-tool-subtle text-tool-text ring-2 ring-tool ring-inset",
    disabled: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-fill text-faint",
  },
  3: {
    rest: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-surface-3 shadow-lg",
    hover: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-fill text-foreground shadow-lg",
    pressed: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-fill-active text-foreground shadow-lg translate-y-px",
    selected: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-tool-subtle text-tool-text ring-2 ring-tool ring-inset shadow-lg",
    disabled: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-fill text-faint",
  },
  4: {
    rest: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-surface-4 shadow-xl",
    hover: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-surface-4 text-foreground shadow-xl",
    pressed: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-surface-4 text-foreground shadow-xl",
    selected: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-tool-subtle text-tool-text ring-2 ring-tool ring-inset shadow-xl",
    disabled: "grid h-16 place-items-center rounded-lg font-mono text-xs text-muted-foreground transition bg-fill text-faint",
  },
}

const LEVEL_TILE: Record<Level, string> = {
  0: "flex h-24 items-center justify-center rounded-lg border border-border bg-background font-mono text-xs text-muted-foreground",
  1: "flex h-24 items-center justify-center rounded-lg border border-card-border bg-surface-1 font-mono text-xs text-muted-foreground shadow-xs",
  2: "flex h-24 items-center justify-center rounded-lg border border-card-border bg-surface-2 font-mono text-xs text-muted-foreground shadow-md",
  3: "flex h-24 items-center justify-center rounded-lg bg-surface-3 font-mono text-xs text-muted-foreground shadow-lg",
  4: "flex h-24 items-center justify-center rounded-lg bg-surface-4 font-mono text-xs text-muted-foreground shadow-xl",
}

const LEVEL_CLASS: Record<Level, string> = {
  0: "border · bg-background",
  1: "shadow-xs · bg-surface-1",
  2: "shadow-md · bg-surface-2",
  3: "shadow-lg · bg-surface-3",
  4: "shadow-xl · bg-surface-4",
}

export default function Page() {
  return (
    <>
      <PageHeader group="Foundations" title="Depth">
        Five levels, each with a shadow and a dark-mode surface step. Surfaces are solid; only the modal backdrop is translucent.
      </PageHeader>

      <Section title="Levels" note="Each level must read without its label.">
        <div className="grid grid-cols-2 gap-6 rounded-lg border bg-background p-8 sm:grid-cols-5">
          {LEVELS.map(([lv, name, use]) => (
            <Tile key={lv} stage={<div className={LEVEL_TILE[lv]}>{`--elev-${lv}`}</div>} name={`${lv} · ${name}`} meta={`${LEVEL_CLASS[lv]}. ${use}`} />
          ))}
        </div>
      </Section>

      <Section
        title="States"
        note="Hover lifts one level. Press drops one level and moves down 1px. Selected is the tool tint with a 2px inset ring. Disabled is a flat fill."
      >
        <div className="grid grid-cols-[7rem_repeat(5,minmax(0,1fr))] items-center gap-x-4 gap-y-3 rounded-lg border bg-background p-8">
          <span />
          {STATES.map((st) => (
            <span key={st} className="pb-1 text-center font-mono text-xs text-faint">
              {st}
            </span>
          ))}
          {LEVELS.map(([lv, name]) => (
            <Fragment key={lv}>
              <span className="flex flex-col justify-center gap-0.5 text-sm">
                <b className="font-semibold">{name}</b>
                <span className="font-mono text-xs text-faint">level {lv}</span>
              </span>
              {STATES.map((st) => (
                <div key={st} data-level={lv} data-state={st} className={DP[lv][st]}>
                  {lv}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </Section>

      <Section
        title="Control depth"
        note="Five tokens for the parts people touch."
      >
        <div className="grid grid-cols-2 gap-6 rounded-lg border bg-background p-8 sm:grid-cols-5">
          <Tile
            stage={
              <div className="flex h-24 items-center justify-center">
                <div className="sheen flex h-8 items-center rounded-md border border-border-strong bg-card px-3 text-sm font-medium shadow-raise">Raise</div>
              </div>
            }
            name="shadow-raise sheen"
            meta="Outline buttons, segmented thumbs. Hover: border-border-heavy."
          />
          <Tile
            stage={
              <div className="flex h-24 items-center justify-center">
                <div className="sheen flex h-8 items-center rounded-md border border-transparent bg-primary px-3 text-sm font-medium text-primary-foreground shadow-raise-control">Control</div>
              </div>
            }
            name="shadow-raise-control sheen"
            meta="Primary buttons, checked boxes and radios, the on switch."
          />
          <Tile
            stage={
              <div className="flex h-24 items-center justify-center">
                <div className="flex h-8 w-full items-center rounded-md border border-border-strong bg-card px-3 text-sm text-faint shadow-well">Well</div>
              </div>
            }
            name="shadow-well"
            meta="Inputs, textareas, select triggers, slider and switch tracks, unchecked boxes."
          />
          <Tile
            stage={
              <div className="flex h-24 items-center justify-center">
                <div className="flex h-8 translate-y-px items-center rounded-md border border-border-strong bg-card px-3 text-sm font-medium shadow-pressed">Pressed</div>
              </div>
            }
            name="shadow-pressed"
            meta="Any pressed control. Sheen off, box down 1px."
          />
          <Tile
            stage={
              <div className="flex h-24 items-center justify-center">
                <div className="relative flex h-1 w-full items-center rounded-full bg-fill-active shadow-well">
                  <div className="h-1 w-1/2 rounded-full bg-primary" />
                  <div className="absolute left-1/2 size-4 -translate-x-1/2 rounded-full border border-border-heavy bg-card shadow-thumb" />
                </div>
              </div>
            }
            name="shadow-thumb"
            meta="Slider and switch thumbs, the active segment."
          />
        </div>
      </Section>

      <Section title="In place" note="A card with a well and raised controls, and an overlay.">
        <div className="flex flex-wrap items-start gap-6 rounded-lg border bg-background p-8">
          <div className="flex w-60 flex-col gap-4 rounded-xl border border-card-border bg-card p-4 shadow-md">
            <span className="text-sm font-semibold">Downloads</span>
            <Input placeholder="~/Downloads" readOnly />
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Preview
              </Button>
              <Button size="sm">Watch</Button>
            </div>
          </div>
          <div className="flex w-44 flex-col rounded-md border border-card-border bg-popover p-1 text-sm text-popover-foreground shadow-lg">
            <span className="flex h-8 items-center rounded-sm px-2">Open</span>
            <span className="flex h-8 items-center rounded-sm bg-primary px-2 text-primary-foreground">Date added</span>
            <span className="flex h-8 items-center rounded-sm bg-fill px-2">Size</span>
            <span className="-mx-1 my-1 h-px bg-border" />
            <span className="flex h-8 items-center rounded-sm px-2 text-destructive">Remove</span>
          </div>
        </div>
      </Section>

      <Section title="Rules">
        <Bullets
          items={[
            <>
              Cards use <Mono>shadow-md</Mono> on <Mono>border-card-border</Mono>. Tiles in a grid use the <Mono>flat</Mono> card variant.
            </>,
            <>
              Overlays use <Mono>bg-popover</Mono>; dialogs and sheets use <Mono>bg-surface-4</Mono>. Do not blur or tint the content under them.
            </>,
            <>
              Raised controls pair <Mono>shadow-raise</Mono> with <Mono>sheen</Mono>. A pressed control removes the sheen with <Mono>bg-none</Mono> and takes <Mono>shadow-pressed</Mono>.
            </>,
            <>
              <Mono>shadow-sm</Mono> and <Mono>shadow-2xl</Mono> are aliases of the nearest level.
            </>,
            <>Depth does not encode importance. A raised card is closer, not more important.</>,
          ]}
        />
      </Section>

      <Section title="Tokens" note="Tailwind's shadow scale maps onto --elev-*, so components keep their upstream class names.">
        <TokenTable
          rows={[
            ["--elev-1 · shadow-xs", "Raised: controls at rest (also shadow-sm)"],
            ["--elev-2 · shadow-md", "Floating: cards"],
            ["--elev-3 · shadow-lg", "Overlay: menus, popovers, selects, toasts"],
            ["--elev-4 · shadow-xl", "Modal: dialogs, sheets (also shadow-2xl)"],
            ["--raise · shadow-raise", "Lit top edge on outline controls"],
            ["--raise-control · shadow-raise-control", "Lit top and dark bottom edge on ink fills"],
            ["--sheen · sheen", "The highlight gradient on raised controls"],
            ["--well · shadow-well", "Sunken fields and tracks"],
            ["--pressed · shadow-pressed", "Pressed controls"],
            ["--thumb · shadow-thumb", "Slider and switch thumbs, segmented thumb"],
            ["--surface-1 … --surface-4", "Level fills; white in light, lighter steps in dark"],
            ["--card-border", "Surface edge on cards, tables and menus"],
          ]}
        />
      </Section>
    </>
  )
}

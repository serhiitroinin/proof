---
version: alpha
name: proof
description: One visual language for a family of small, local-first tools. Native theme, light mode values; dark values are in src/styles/globals.css.
colors:
  primary: "#191b1c"
  on-primary: "#f8fafd"
  secondary: "#edeff2"
  on-secondary: "#191b1c"
  neutral: "#f8fafd"
  surface: "#ffffff"
  on-surface: "#191b1c"
  muted: "#595b5e"
  faint: "#6a6b6e"
  border: "#d8dbde"
  border-strong: "#caccd0"
  border-control: "#8b8e91"
  fill: "#edeff2"
  fill-hover: "#e7e9ec"
  fill-active: "#e1e3e6"
  tool: "#5e6b4e"
  on-tool: "#ffffff"
  tool-subtle: "#edf2e8"
  tool-text: "#5c684e"
  selection: "#e7ede0"
  ring: "#5e6b4e"
  brand: "#2f6feb"
  on-brand: "#ffffff"
  error: "#9c443b"
  success: "#21763c"
  warning: "#865900"
  info: "#2266a4"
  family-butler: "#5e6b4e"
  family-easel: "#e2482b"
  family-sculpt: "#c08200"
  family-reins: "#3d5a80"
  family-glu: "#5f8f72"
  family-strap: "#c8644a"
  family-vellum: "#6a5acd"
typography:
  headline-display:
    fontFamily: system-ui
    fontSize: 3.75rem
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.025em
  headline-md:
    fontFamily: system-ui
    fontSize: 1.25rem
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.025em
  body-lg:
    fontFamily: system-ui
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: system-ui
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.25rem
  label-sm:
    fontFamily: system-ui
    fontSize: 0.6875rem
    fontWeight: 500
    lineHeight: 1rem
  mono-sm:
    fontFamily: ui-monospace
    fontSize: 0.6875rem
    fontWeight: 400
    lineHeight: 1rem
rounded:
  sm: 4px
  md: 8px
  lg: 8px
  xl: 12px
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 32px
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    height: 32px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    height: 32px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
  menu-item:
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    height: 32px
  row-selected:
    backgroundColor: "{colors.tool-subtle}"
    textColor: "{colors.tool-text}"
---

# proof

## Overview

proof is a shadcn registry and its docs. It gives a family of small tools (Mac apps, web dashboards, CLIs, READMEs) one look.

- Calm, precise, mostly monochrome. Ink on a cool grey paper.
- Colour marks what matters: the selection, the action, the reading out of range.
- Each tool has one accent. Everything else stays the same across the family.
- The signature is the **motif**: a 1.5px ink line with a dot in the tool accent at its tip.
- Restraint over decoration.

The source of truth is `src/styles/globals.css` (`:root` for light, `.dark` for dark). The registry item `native` is generated from it.

## Colors

- **Ink first.** Text and primary controls use `primary` (near-black in light mode, near-white in dark mode).
- **Tool accent** (`tool`, `tool-subtle`, `tool-text`, `tool-border`, `ring`, `selection`): focus, selected rows, active navigation, progress, the motif dot. Default is Butler olive.
- **Tool family** (`family-*`): one hue per tool. Use it to mark the tool (logo mark, dot). On the tool's own pages, `ToolScope` sets it as `tool`.
- **Brand** (`brand`): links and brand fills only. Not for controls.
- **Status** (`error`, `success`, `warning`, `info`, each with `-subtle` and `-border`): state only. Never use a status colour as a series or decoration colour.
- **Neutral fills** (`fill`, `fill-hover`, `fill-active`): ghost controls, menu hover, tracks.
- `muted` for secondary text. `faint` for placeholders, shortcuts and disabled labels.

Rules:
- Use one accent per screen. Do not mix tool accents in one view.
- Status is never colour alone. Add a word, and an icon where it fits.
- Body text reaches 4.5:1. Marks and dots reach 3:1. Run `pnpm contrast` after every token change.
- No raw colours in pages. Use tokens.

## Typography

- System sans for UI. System mono for paths, IDs, numbers in tables, shortcuts and eyebrow labels.
- Base size is 13px (`text-sm`). Small labels are 11px (`text-xs`).
- Page titles are display size, bold, tight (`text-5xl`/`text-6xl`, `font-bold`, `tracking-tight`).
- Section titles are `text-xl font-bold tracking-tight`.
- Eyebrows and navigation groups are mono uppercase `text-xs`.
- Use tabular numbers for figures that change or align in columns.
- Use sentence case for labels, buttons and headings.
- Group labels inside a tool are small and quiet: `text-xs font-medium text-muted-foreground`. Mono uppercase is only for docs eyebrows and navigation groups.

## Layout

- **4px grid.** Every padding, margin, gap and size is a multiple of 4px (Tailwind steps 1, 2, 3, 4, 5, 6, 8, 10, 12…). Use half steps (`0.5`, `1.5`, `2.5`) only for optical work inside a component.
- Controls are 32px high (`h-8`). Compact controls are 28px (`h-7`).
- Text measure is at most `max-w-prose`.
- Pages compose components. Layout classes are the only classes a page adds.

## Elevation & Depth

Controls are lit:
- **Raised** at rest: `shadow-raise` + `sheen` (outline button), `shadow-raise-control` + `sheen` (primary button, checked box).
- **Sunken** for fields and tracks: `shadow-well` (input, unchecked box, switch, segmented track).
- **Pressed**: `shadow-pressed` with `active:translate-y-px active:scale-[0.99]`.
- **Thumb** on a track: `shadow-thumb`.

Surfaces use four levels (`surface-1..4`):
- `shadow-md`: cards.
- `shadow-lg`: menus, popovers, selects, toasts (level 3, `popover`).
- `shadow-xl`: dialogs and sheets (level 4).

Rules:
- Surfaces are solid (`bg-card`, `bg-popover`). Only the modal backdrop is translucent.
- Rest, hover, pressed, selected and disabled must each look different. Disabled is flat: `bg-fill`, `text-faint`, no shadow.

## Shapes

- Controls: `rounded-md` (8px). Inner parts: `rounded-sm` (4px). Cards: `rounded-xl` (12px).
- Overlays (menu, popover, select, tooltip, dialog, sheet): `rounded-lg` (8px) at most.
- A nested radius equals the outer radius minus the padding.
- The motif line has round caps. The motif dot is a circle.

## Components

- **Focus** is crisp. Use `focus-visible:ring-2 ring-ring ring-offset-background`, or `outline-2 outline-ring outline-offset-2`. Text fields use `border-ring ring-1 ring-ring`. No soft halo.
- **Icons** sit next to the word they show. Do not use an abstract icon alone.
- **Icons and keycaps** are quiet: `text-muted-foreground`, a hairline border or none. Never louder than the label next to them.
- **Alerts** have a full hairline border and the same radius on every side. Status shows as a glyph and a title colour. No coloured side bar.
- **Menus** use one rhythm: `p-1` container, `h-8 px-2 gap-2` items, `rounded-sm` items, `my-1` separators, labels `px-2 py-1.5 text-xs text-faint`. Hover is `bg-fill`. The active item is filled with `primary`. Shortcuts are faint mono.
- **Selection** in lists and tables: `bg-tool-subtle text-tool-text`, or a 2px inset ring in `tool`. The signature `marker` switch sets fill or dot.
- **Primary action**: one per view. In a queue, only the job that waits for the user gets a primary button.
- **Empty states** give one next step.
- **Badges** for status always carry a word. A dot or icon can join it.
- **Toasts** show status as an icon colour, not a tinted surface.
- **Tool marks** sit next to the wordmark at the same optical height. Do not rotate or shadow a mark, swap its ink and accent, or set the name in another typeface.

### Forms

- Mark the exception. Add Required or Optional only to fields that differ from the rest. No red asterisk on every label.
- Validate on blur, then on submit. Clear the error when the value is correct. Do not validate on every keystroke.
- Do not show an error under a field the user has not reached.
- One primary action, bottom right. Secondary actions are ghost or outline next to it. Never two filled buttons.

### Motif

One shape for every long or confirmed action:
- Progress: the line grows, the dot leads.
- Done: the line draws, the dot pops.
- Error: the line breaks, the dot falls.
- Stall: the dot breathes.
- Toast timers, hold-to-confirm and copy confirmation use the same line and dot.

Do not add a second confirmation glyph. No checkmark toasts, no green badge, no spinner where the motif fits. On error, put the cause next to the broken line. Do not shake, pulse or flood a surface red.

### Motion

- 220ms on `ease-standard`. Exits are 154ms (0.7×).
- Overlays scale in from `--transform-origin` at 0.96. When opened from the keyboard, they appear at once.
- Presses sink 1px. Arrivals land with `ease-pop`.
- Indicators move like an inchworm: leading edge first, trailing edge after.
- Lists stagger 28ms per row.
- Animations: `animate-enter`, `-exit`, `-pop`, `-draw`, `-rise`, `-flash`, `-breathe`, `-fall`, `-shimmer`, `-matrix`.
- Everything respects `prefers-reduced-motion` through the global block in globals.css.

### Signature switches

`data-*` attributes on `<html>` (see `src/hooks/use-signature.ts`). Defaults in bold.
- `marker`: **fill**, dot
- `backdrop`: **plain**, dots
- `frame`: **none**, offset
- `accent`: ink, **balanced**, loud
- `controls`: **ink**, accent
- `headings`: **as-is**, lower, upper

### Writing

Use Simplified Technical English: short sentences, active voice, one idea per sentence, common words.
- Buttons: verb, object, count ("Move 26 files"). Not "Submit".
- Dialog choices say what they do ("Keep editing", "Discard draft"). Not "Yes" and "No".
- Errors name the problem and the fix ("No folder at ~/Downlaods. Did you mean ~/Downloads?"). Not "Invalid path."
- Status states the fact in past tense ("26 files moved"). Not "Success!"
- Say what the tool does next ("Couldn't reach WHOOP. Retrying in 30 s."). Not "Something went wrong."

## Do's and Don'ts

- Do use tokens. Don't use raw colours, inline styles or arbitrary values outside layout.
- Do put appearance in `src/components/ui` as variants and sizes. Don't restyle a component from a page.
- Do use ink for controls. Don't put the brand colour on buttons or badges.
- Do keep one accent per tool and per screen.
- Do show status with a word and an icon. Don't use colour alone.
- Do use the motif for progress and confirmation. Don't add spinners or checkmarks where the motif fits.
- Do keep focus rings crisp. Don't use a translucent halo; it blurs the edge and falls below 3:1.
- Do keep surfaces solid. Don't put translucent panels over content.

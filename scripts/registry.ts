// Generates registry.json from src/components/ui and src/styles/globals.css. Run with `pnpm registry`.
import { readdirSync, readFileSync, writeFileSync } from "node:fs"

const UI = "src/components/ui"
const CSS = "src/styles/globals.css"
const HOMEPAGE = "https://serhiitroinin.github.io/proof"
// Items refer to each other through the @proof namespace, so the registry works from any host.
const NS = "@proof"

const META: Record<string, [title: string, description: string]> = {
  "alert-dialog": ["Alert Dialog", "Confirms a destructive or irreversible action."],
  alert: ["Alert", "Inline note, warning or error with an icon and a title."],
  avatar: ["Avatar", "A person or workspace as an image or initials."],
  badge: ["Badge", "Short status or count with a word."],
  "button-group": ["Button Group", "Related buttons joined into one control."],
  button: ["Button", "Primary, secondary, outline, ghost, link and destructive actions."],
  command: ["Command", "A command palette with search, groups and shortcuts."],
  "copy-button": ["Copy Button", "Copies text and lands the motif dot as confirmation."],
  "dot-field": ["Dot Field", "A reactive dot backdrop: lens, ripple, halftone, line and drop target."],
  "hold-button": ["Hold Button", "Hold to confirm; a line fills under the label."],
  motif: ["Motif", "The line and dot: progress, done, error and stalled."],
  "number-roll": ["Number Roll", "A figure whose changed digits roll like an odometer."],
  card: ["Card", "A surface that groups related content and actions."],
  checkbox: ["Checkbox", "Turns one option on or off."],
  dialog: ["Dialog", "A modal window for a focused task."],
  "dropdown-menu": ["Dropdown Menu", "Actions and options behind a trigger."],
  empty: ["Empty", "First-run and nothing-here states with one next step."],
  field: ["Field", "Label, control, description and error laid out together."],
  figure: ["Figure", "A headline number with unit, caption and status line."],
  "number-field": ["Number field", "Compact inspector fields for a number or a hex colour."],
  "input-group": ["Input Group", "An input with prefixes, suffixes, icons or buttons."],
  input: ["Input", "Single-line text entry."],
  item: ["Item", "A row with media, title, description and actions."],
  kbd: ["Kbd", "A keyboard key or shortcut."],
  label: ["Label", "Names a form control."],
  popover: ["Popover", "Rich content anchored to a trigger."],
  progress: ["Progress", "Progress of a task."],
  "radio-group": ["Radio Group", "Picks one option from a short list."],
  "scroll-area": ["Scroll Area", "A scroll container with quiet overlay scrollbars."],
  select: ["Select", "Picks one value from a list in a popup."],
  separator: ["Separator", "A hairline between groups."],
  sheet: ["Sheet", "A panel that slides in from an edge."],
  sidebar: ["Sidebar", "App navigation that collapses to icons and becomes a sheet on small screens."],
  skeleton: ["Skeleton", "A placeholder while content loads."],
  slider: ["Slider", "Picks a value or a range on a track."],
  sonner: ["Toast", "Transient confirmation, with optional undo."],
  spinner: ["Spinner", "Indeterminate activity."],
  "stream-text": ["Stream Text", "Text that arrives one word at a time."],
  switch: ["Switch", "Turns a setting on or off immediately."],
  table: ["Table", "Rows and columns of data."],
  tabs: ["Tabs", "Switches between views of the same context."],
  terminal: ["Terminal", "CLI output with ANSI tones from the theme tokens."],
  textarea: ["Textarea", "Multi-line text that grows with its content, with a character limit and ⌘↵ to submit."],
  "toggle-group": ["Toggle Group", "A set of toggles, single or multiple choice."],
  toggle: ["Toggle", "A button that stays pressed."],
  "tool-mark": ["Tool Mark", "One mark per tool, with the tool colour as the one solid shape."],
  "tool-scope": ["Tool Scope", "Scopes the tool accent to a subtree."],
  tooltip: ["Tooltip", "Names a control and shows its shortcut on hover."],
  window: ["Window", "A Mac window frame with lights, title, toolbar, sidebar and footer slots."],
  tree: ["Tree", "Nested rows with chevrons, indent guides, hover actions and rename."],
}

const files = readdirSync(UI).filter((f) => f.endsWith(".tsx")).sort()
const names = new Set(files.map((f) => f.replace(/\.tsx$/, "")))

const missing = [...names].filter((n) => !META[n])
if (missing.length) throw new Error(`registry: add META for ${missing.join(", ")}`)

const items: object[] = [
  theme("native", "Native", "Quiet neutrals, ink controls, raised buttons and sunken wells, radius 8."),
]

for (const file of files) {
  const name = file.replace(/\.tsx$/, "")
  const src = readFileSync(`${UI}/${file}`, "utf8")
  const imports = [...src.matchAll(/from "([^"]+)"/g)].map((m) => m[1])
  const dependencies = new Set<string>()
  const registryDependencies = new Set<string>()
  for (const spec of imports) {
    if (spec.startsWith("@/components/ui/")) registryDependencies.add(spec.slice(16))
    else if (spec === "react" || spec.startsWith("@/") || spec.startsWith(".")) continue
    else dependencies.add(spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0])
  }
  for (const dep of registryDependencies)
    if (!names.has(dep)) throw new Error(`registry: ${name} imports unknown component ${dep}`)
  const [title, description] = META[name]
  items.push({
    name,
    type: "registry:ui",
    title,
    description,
    dependencies: [...dependencies].sort(),
    registryDependencies: [`${NS}/native`, ...[...registryDependencies].sort().map((d) => `${NS}/${d}`)],
    files: [{ path: `${UI}/${file}`, type: "registry:ui" }],
  })
}

writeFileSync(
  "registry.json",
  JSON.stringify(
    { $schema: "https://ui.shadcn.com/schema/registry.json", name: "proof", homepage: HOMEPAGE, items },
    null,
    2
  ) + "\n"
)
console.log(`registry.json: ${items.length} items`)

function theme(name: string, title: string, description: string) {
  const css = readFileSync(CSS, "utf8")
  const block = (selector: string) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\"]/g, "\\$&")
    const m = css.match(new RegExp(`(?:^|\\n)${escaped} \\{([\\s\\S]*?)\\n\\}`))
    if (!m) throw new Error(`registry: no ${selector} block in ${CSS}`)
    return Object.fromEntries(
      [...m[1].matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim().replace(/\s+/g, " ")])
    )
  }
  return {
    name,
    type: "registry:theme",
    title,
    description,
    cssVars: {
      theme: block("@theme inline"),
      light: block(":root"),
      dark: block(".dark"),
    },
    css: {
      "@utility sheen": { "background-image": "var(--sheen)" },
      ...motionCss(css),
    },
  }
}

// The @keyframes inside @theme inline and the reduced-motion block, as shadcn css objects.
type Rules = { [selector: string]: string | Rules }
function motionCss(css: string): Rules {
  const parse = (src: string): Rules => {
    const out: Rules = {}
    let i = 0
    while (i < src.length) {
      const open = src.indexOf("{", i)
      const semi = src.indexOf(";", i)
      if (semi !== -1 && (open === -1 || semi < open)) {
        const [k, ...v] = src.slice(i, semi).split(":")
        if (k.trim() && v.length) out[k.trim()] = v.join(":").trim().replace(/\s+/g, " ")
        i = semi + 1
        continue
      }
      if (open === -1) break
      let depth = 1
      let j = open + 1
      for (; depth && j < src.length; j++) depth += src[j] === "{" ? 1 : src[j] === "}" ? -1 : 0
      const selector = src.slice(i, open).trim().replace(/\s+/g, " ")
      out[selector] = parse(src.slice(open + 1, j - 1))
      i = j
    }
    return out
  }
  const all = parse(css.replace(/\/\*[\s\S]*?\*\//g, ""))
  const theme = all["@theme inline"] as Rules
  const keyframes = Object.fromEntries(Object.entries(theme).filter(([k]) => k.startsWith("@keyframes")))
  const reduced = "@media (prefers-reduced-motion: reduce)"
  return { ...keyframes, [reduced]: all[reduced] }
}

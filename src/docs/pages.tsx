import type { ComponentType } from "react"

import { components } from "./registry"
import { ComponentPage } from "./component-page"
import Colour from "./foundations/colour"
import Typography from "./foundations/typography"
import Layout from "./foundations/layout"
import Depth from "./foundations/depth"
import Motion from "./foundations/motion"
import Icons from "./foundations/icons"
import Accessibility from "./foundations/accessibility"
import Writing from "./foundations/writing"
import Tables from "./tables"
import Introduction from "./overview/intro"
import Playground from "./overview/playground"
import Signature from "./brand/signature"
import Forms from "./patterns/forms"
import Navigation from "./patterns/navigation"
import CommandPalette from "./patterns/command"
import InspectorPattern from "./patterns/inspector"
import Queues from "./patterns/queues"
import Loading from "./patterns/loading"
import Shell from "./patterns/shell"

// `blurb` and `keys` feed the ⌘K page search in app.tsx.
export type Page = { id: string; group: Group; title: string; Render: ComponentType; blurb?: string; keys?: string }
export type Group = (typeof GROUPS)[number]
export const GROUPS = ["Overview", "Foundations", "Components", "Patterns", "Examples", "Brand"] as const

const foundation = (id: string, title: string, Render: ComponentType): Page => ({ id, group: "Foundations", title, Render })

export const PAGES: Page[] = [
  { id: "intro", group: "Overview", title: "Introduction", Render: Introduction, blurb: "Principles, foundations, the family", keys: "start principles family" },
  { id: "playground", group: "Overview", title: "Playground", Render: Playground, blurb: "Every control in every state", keys: "states matrix all" },
  foundation("colour", "Colour", Colour),
  foundation("typography", "Typography", Typography),
  foundation("layout", "Layout", Layout),
  foundation("depth", "Depth", Depth),
  foundation("motion", "Motion", Motion),
  foundation("icons", "Icons", Icons),
  foundation("accessibility", "Accessibility", Accessibility),
  foundation("writing", "Writing", Writing),
  ...components
    .map((c) => ({ id: c.name, group: "Components" as const, title: c.title, Render: () => <ComponentPage name={c.name} /> }))
    .sort((a, b) => a.title.localeCompare(b.title)),
  { id: "forms", group: "Patterns", title: "Forms", Render: Forms, blurb: "Create a rule: validate on blur, one action", keys: "form-01 field validation" },
  { id: "navigation", group: "Patterns", title: "Sidebars and trees", Render: Navigation, blurb: "App sidebar, icon rail, docs nav, layer tree", keys: "sidebar-01 sidebar-02 sidebar-03 tree-01 tree-02" },
  { id: "command-palette", group: "Patterns", title: "Command palette", Render: CommandPalette, blurb: "⌘K: recent, actions, shortcuts", keys: "cmdk-01 palette search" },
  { id: "inspector", group: "Patterns", title: "Inspector", Render: InspectorPattern, blurb: "Numeric fields, segmented direction, fill rows", keys: "inspector-01 panel properties" },
  { id: "queues", group: "Patterns", title: "Queues", Render: Queues, blurb: "Agent jobs: running, waiting, done, failed", keys: "queue-01 jobs agent retry" },
  { id: "loading", group: "Patterns", title: "Loading", Render: Loading, blurb: "Skeletons, the running line, first run", keys: "skeleton empty spinner" },
  { id: "shell", group: "Patterns", title: "Editor shell", Render: Shell, blurb: "Tree, canvas and inspector in one window", keys: "shell-01 vellum editor" },
  { id: "tables", group: "Examples", title: "Tables", Render: Tables },
  { id: "signature", group: "Brand", title: "Signature", Render: Signature, blurb: "The codes every tool shares", keys: "marker frame backdrop motif marks" },
]

export const pageById = (id: string) => PAGES.find((p) => p.id === id) ?? PAGES[0]

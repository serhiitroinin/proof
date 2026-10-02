import { useMemo, useState, type ComponentType } from "react"
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  ClockIcon,
  CopyIcon,
  DownloadIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  FileTextIcon,
  FilterIcon,
  FolderIcon,
  FolderOpenIcon,
  InfoIcon,
  LinkIcon,
  LockIcon,
  MailIcon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  SettingsIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UploadIcon,
  UserIcon,
  XIcon,
  type LucideProps,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { PageHeader, Section } from "../kit"
import { Bullets, Mono } from "./shared"

type Entry = [name: string, Icon: ComponentType<LucideProps>]
const SET: Entry[] = [
  ["search", SearchIcon],
  ["plus", PlusIcon],
  ["check", CheckIcon],
  ["x", XIcon],
  ["chevron-down", ChevronDownIcon],
  ["chevron-right", ChevronRightIcon],
  ["arrow-right", ArrowRightIcon],
  ["arrow-up-right", ArrowUpRightIcon],
  ["ellipsis", EllipsisIcon],
  ["folder", FolderIcon],
  ["folder-open", FolderOpenIcon],
  ["file-text", FileTextIcon],
  ["settings", SettingsIcon],
  ["filter", FilterIcon],
  ["pencil", PencilIcon],
  ["trash-2", Trash2Icon],
  ["copy", CopyIcon],
  ["download", DownloadIcon],
  ["upload", UploadIcon],
  ["refresh-cw", RefreshCwIcon],
  ["clock", ClockIcon],
  ["calendar", CalendarIcon],
  ["bell", BellIcon],
  ["info", InfoIcon],
  ["circle-alert", CircleAlertIcon],
  ["triangle-alert", TriangleAlertIcon],
  ["circle-check", CircleCheckIcon],
  ["eye", EyeIcon],
  ["eye-off", EyeOffIcon],
  ["lock", LockIcon],
  ["user", UserIcon],
  ["mail", MailIcon],
  ["link", LinkIcon],
  ["external-link", ExternalLinkIcon],
]

type Size = "3" | "4" | "5" | "6"
type Stroke = 1.5 | 2

export default function Page() {
  const [q, setQ] = useState("")
  const [size, setSize] = useState<Size>("4")
  const [stroke, setStroke] = useState<Stroke>(2)
  const [copied, setCopied] = useState("")
  const names = useMemo(() => SET.filter(([n]) => n.includes(q.trim().toLowerCase())), [q])
  const copy = (n: string) => {
    navigator.clipboard?.writeText(n)
    setCopied(n)
    setTimeout(() => setCopied(""), 1200)
  }
  return (
    <>
      <PageHeader group="Foundations" title="Icons">
        Lucide icons: 16px in controls, stroke 2, muted next to a label.
      </PageHeader>

      <Section title="Set" note="Click an icon to copy its lucide name.">
        <div className="flex flex-wrap items-center gap-3">
          <Input placeholder="Filter icons" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter icons" className="w-60" />
          <div className="flex gap-1">
            {(["3", "4", "5", "6"] as const).map((s) => (
              <Button key={s} variant={s === size ? "secondary" : "ghost"} size="sm" onClick={() => setSize(s)}>
                {`size-${s}`}
              </Button>
            ))}
          </div>
          <div className="flex gap-1">
            {([1.5, 2] as const).map((w) => (
              <Button key={w} variant={w === stroke ? "secondary" : "ghost"} size="sm" onClick={() => setStroke(w)}>
                {`stroke ${w}`}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {names.map(([n, Icon]) => (
            <button
              key={n}
              type="button"
              onClick={() => copy(n)}
              title={n}
              className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-md border bg-card px-1 py-3 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Sized size={size}>
                <Icon strokeWidth={stroke} aria-hidden />
              </Sized>
              <span className="w-full text-center font-mono text-xs leading-tight break-words">{copied === n ? "copied" : n}</span>
            </button>
          ))}
          {!names.length && <span className="col-span-full text-sm text-muted-foreground">Nothing matches “{q}”.</span>}
        </div>
      </Section>

      <Section title="Size and stroke" note="Icon size follows the text beside it.">
        <div className="flex flex-wrap items-end gap-8 rounded-lg border bg-background p-8">
          <Spec name="size-3" meta="12px · badges, keycaps, text-xs">
            <FolderIcon className="size-3 text-muted-foreground" strokeWidth={2} aria-hidden />
          </Spec>
          <Spec name="size-4" meta="16px · buttons, inputs, menu items, rows">
            <FolderIcon className="size-4 text-muted-foreground" strokeWidth={2} aria-hidden />
          </Spec>
          <Spec name="size-5" meta="20px · alerts, empty states">
            <FolderIcon className="size-5 text-muted-foreground" strokeWidth={2} aria-hidden />
          </Spec>
          <Spec name="size-6" meta="24px · page-level empty states">
            <FolderIcon className="size-6 text-muted-foreground" strokeWidth={1.5} aria-hidden />
          </Spec>
          <Spec name="stroke 2" meta="default">
            <SettingsIcon className="size-5 text-foreground" strokeWidth={2} aria-hidden />
          </Spec>
          <Spec name="stroke 1.5" meta="dense lists, large sizes">
            <SettingsIcon className="size-5 text-foreground" strokeWidth={1.5} aria-hidden />
          </Spec>
        </div>
      </Section>

      <Section title="Rules">
        <Bullets
          items={[
            <>
              Use <Mono>text-muted-foreground</Mono> next to a label; <Mono>text-foreground</Mono> only when the icon is the control.
            </>,
            <>
              In a Button, mark the icon with <Mono>data-icon="inline-start"</Mono> or <Mono>inline-end</Mono>. The button tightens its padding on that side.
            </>,
            <>
              Status icons take the status token (<Mono>text-success</Mono>, <Mono>text-warning</Mono>, <Mono>text-destructive</Mono>) and sit beside the status word.
            </>,
            <>
              Icon-only buttons have an <Mono>aria-label</Mono> and a tooltip with the same words. Decorative icons have <Mono>aria-hidden</Mono>.
            </>,
            <>No filled icons, no two-tone, no emoji. One stroke weight per surface.</>,
          ]}
        />
      </Section>
    </>
  )
}

// Literal class per size so the Tailwind lint can read it.
function Sized({ size, children }: { size: Size; children: React.ReactNode }) {
  switch (size) {
    case "3":
      return <span className="flex [&_svg]:size-3">{children}</span>
    case "4":
      return <span className="flex [&_svg]:size-4">{children}</span>
    case "5":
      return <span className="flex [&_svg]:size-5">{children}</span>
    case "6":
      return <span className="flex [&_svg]:size-6">{children}</span>
  }
}

function Spec({ name, meta, children }: { name: string; meta: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="flex h-6 items-center">{children}</span>
      <span className="font-mono text-xs">{name}</span>
      <span className="text-xs text-muted-foreground">{meta}</span>
    </div>
  )
}

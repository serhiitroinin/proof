import { useState } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const people = [
  { email: "ines@haldane.dev", name: "Ines Okafor", role: "Owner" },
  { email: "teodor@haldane.dev", name: "Teodor Lind", role: "Editor" },
  { email: "mireille@pell.studio", name: "Mireille Dubois", role: "Viewer" },
  { email: "ana@marrow.co", name: "Ana Ribeiro", role: "Viewer" },
]

export default function TableSelectedRows() {
  const [selected, setSelected] = useState<string[]>(["teodor@haldane.dev"])
  const all = selected.length === people.length
  const toggle = (email: string, on: boolean) =>
    setSelected((s) => (on ? [...s, email] : s.filter((e) => e !== email)))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              aria-label="Select all"
              checked={all}
              indeterminate={selected.length > 0 && !all}
              onCheckedChange={(on) => setSelected(on ? people.map((p) => p.email) : [])}
            />
          </TableHead>
          <TableHead>Member</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {people.map((p) => {
          const on = selected.includes(p.email)
          return (
            <TableRow key={p.email} data-state={on ? "selected" : undefined}>
              <TableCell>
                <Checkbox aria-label={p.name} checked={on} onCheckedChange={(v) => toggle(p.email, v)} />
              </TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell variant="muted">{p.email}</TableCell>
              <TableCell variant="muted">{p.role}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

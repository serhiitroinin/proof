import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const files = [
  { name: "invoice-0425.pdf", kind: "PDF", size: "182 KB", modified: "09:14" },
  { name: "setup-4.2.dmg", kind: "Disk image", size: "88 MB", modified: "08:40" },
  { name: "export-2026-09.csv", kind: "Data", size: "311 KB", modified: "Mon" },
  { name: "glu-backup.sqlite", kind: "Database", size: "24 MB", modified: "Sun" },
]

export default function TableDefault() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Kind</TableHead>
          <TableHead variant="numeric">Size</TableHead>
          <TableHead variant="numeric">Modified</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((f) => (
          <TableRow key={f.name}>
            <TableCell>{f.name}</TableCell>
            <TableCell variant="muted">{f.kind}</TableCell>
            <TableCell variant="numeric">{f.size}</TableCell>
            <TableCell variant="numeric">{f.modified}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

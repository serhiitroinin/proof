import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const runs = [
  { id: "run_8f21", task: "Tidy Downloads into folders", tokens: "1,840", duration: "6.2 s" },
  { id: "run_8f1e", task: "Rename screenshots by content", tokens: "3,920", duration: "14.8 s" },
  { id: "run_8f1a", task: "Summarise glucose week", tokens: "12,480", duration: "22.1 s" },
  { id: "run_8e97", task: "Archive invoices older than 2 y", tokens: "960", duration: "3.4 s" },
  { id: "run_8e90", task: "Dedupe photo import", tokens: "7,700", duration: "41.0 s" },
]

export default function TableCompact() {
  return (
    <Table density="compact">
      <TableHeader>
        <TableRow>
          <TableHead>Run</TableHead>
          <TableHead>Task</TableHead>
          <TableHead variant="numeric">Tokens</TableHead>
          <TableHead variant="numeric">Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {runs.map((r) => (
          <TableRow key={r.id}>
            <TableCell variant="mono">{r.id}</TableCell>
            <TableCell>{r.task}</TableCell>
            <TableCell variant="numeric">{r.tokens}</TableCell>
            <TableCell variant="numeric">{r.duration}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

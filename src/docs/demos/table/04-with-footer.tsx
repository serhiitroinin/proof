import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  { id: "INV-0425", client: "Haldane Labs", amount: "4,800.00" },
  { id: "INV-0424", client: "Marrow & Co", amount: "1,250.00" },
  { id: "INV-0423", client: "Studio Pell", amount: "9,600.00" },
]

export default function TableWithFooter() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Client</TableHead>
          <TableHead variant="numeric">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((r) => (
          <TableRow key={r.id}>
            <TableCell variant="mono">{r.id}</TableCell>
            <TableCell>{r.client}</TableCell>
            <TableCell variant="numeric">
              {r.amount} <span className="text-muted-foreground">EUR</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell variant="numeric">
            15,650.00 <span className="text-muted-foreground">EUR</span>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

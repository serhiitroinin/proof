import { Textarea } from "@/components/ui/textarea"

const LOG = Array.from({ length: 14 }, (_, i) => `09:${String(12 + i).padStart(2, "0")}  moved invoice-${i + 1}.pdf → ~/Invoices/2025`).join("\n")

export default function TextareaMaxRows() {
  return <Textarea className="max-w-md" aria-label="Run log" minRows={2} maxRows={6} defaultValue={LOG} />
}

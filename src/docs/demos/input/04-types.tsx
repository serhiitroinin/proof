import { Input } from "@/components/ui/input"

export default function InputTypes() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Input type="password" defaultValue="hunter2hunter2" aria-label="Password" />
      <Input type="number" defaultValue={12} min={0} aria-label="Seats" />
      <Input type="date" defaultValue="2026-10-02" aria-label="Date" />
      <Input type="file" aria-label="Attachment" />
    </div>
  )
}

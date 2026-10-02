import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const people = [
  { value: "mira", label: "Mira Okafor" },
  { value: "jonas", label: "Jonas Lindqvist" },
  { value: "priya", label: "Priya Raman" },
  { value: "tomas", label: "Tomás Herrera" },
]

export default function SelectDefault() {
  return (
    <Select items={people} defaultValue="mira">
      <SelectTrigger className="w-48" aria-label="Assignee">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {people.map((p) => (
          <SelectItem key={p.value} value={p.value}>
            {p.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

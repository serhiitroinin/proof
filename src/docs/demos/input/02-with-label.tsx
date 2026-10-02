import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InputWithLabel() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <Label htmlFor="workspace">Workspace name</Label>
      <Input id="workspace" defaultValue="Northwind Traders" />
    </div>
  )
}

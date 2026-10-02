import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SwitchDefault() {
  return (
    <Label>
      <Switch defaultChecked />
      Email notifications
    </Label>
  )
}

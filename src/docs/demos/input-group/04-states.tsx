import { MailIcon } from "lucide-react"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

export default function InputGroupStates() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <InputGroup>
        <InputGroupAddon>
          <MailIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Disabled" disabled />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <MailIcon />
        </InputGroupAddon>
        <InputGroupInput defaultValue="ola@" aria-invalid aria-label="Email" />
      </InputGroup>
    </div>
  )
}

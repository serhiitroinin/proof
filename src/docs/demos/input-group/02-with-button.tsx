import { CopyIcon } from "lucide-react"

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"

export default function InputGroupWithButton() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput readOnly defaultValue="https://proof.dev/r/native.json" aria-label="Registry URL" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label="Copy URL">
          <CopyIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

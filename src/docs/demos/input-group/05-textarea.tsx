import { PaperclipIcon, SendIcon } from "lucide-react"

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"

export default function InputGroupTextareaDemo() {
  return (
    <InputGroup className="max-w-md">
      <InputGroupTextarea placeholder="Reply to Mira…" aria-label="Reply" />
      <InputGroupAddon align="block-end">
        <InputGroupButton size="icon-xs" aria-label="Attach file">
          <PaperclipIcon />
        </InputGroupButton>
        <InputGroupText className="ml-auto">0 / 500</InputGroupText>
        <InputGroupButton variant="default" size="icon-xs" aria-label="Send">
          <SendIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

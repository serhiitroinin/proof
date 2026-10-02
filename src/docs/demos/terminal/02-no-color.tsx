import { useState } from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Terminal, TerminalLine, TerminalPrompt, TerminalRule, TerminalSpinner, TerminalText } from "@/components/ui/terminal"

export default function TerminalNoColor() {
  const [off, setOff] = useState(false)
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <div className="flex items-center gap-2 self-end">
        <Switch size="sm" id="term-no-color" checked={off} onCheckedChange={setOff} />
        <Label htmlFor="term-no-color">NO_COLOR</Label>
      </div>
      <div className="overflow-hidden rounded-lg border bg-popover">
        <Terminal color={off ? "off" : "on"}>
          <TerminalLine>
            <TerminalPrompt>butler apply 7f3a</TerminalPrompt>
          </TerminalLine>
          <TerminalLine>
            <TerminalRule value={0.6} /> <TerminalText tone="muted">5/8 · 60%</TerminalText>
          </TerminalLine>
          <TerminalLine>
            <TerminalSpinner /> <TerminalText tone="muted">working</TerminalText>
          </TerminalLine>
          <TerminalLine>
            <TerminalText tone="inverse"> RECOVERY 64% </TerminalText> <TerminalText tone="warn">● moderate</TerminalText>
          </TerminalLine>
        </Terminal>
      </div>
    </div>
  )
}

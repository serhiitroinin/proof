import { Terminal, TerminalBar, TerminalLine, TerminalPrompt, TerminalRule, TerminalText } from "@/components/ui/terminal"
import { Window, WindowBar, WindowBody, WindowTitle } from "@/components/ui/window"

export default function TerminalOutput() {
  return (
    <Window variant="terminal" className="max-w-xl">
      <WindowBar>
        <WindowTitle center>~ — zsh — 80×12</WindowTitle>
      </WindowBar>
      <WindowBody>
        <Terminal>
          <TerminalLine>
            <TerminalPrompt>glu tir --days 14</TerminalPrompt>
          </TerminalLine>
          <TerminalLine>
            <TerminalText tone="bold">glu</TerminalText> <TerminalText tone="muted">· time in range · last 14 days</TerminalText>
          </TerminalLine>
          <TerminalLine />
          <TerminalLine>
            {"  in range  "}
            <TerminalBar value={0.78} tone="ok" /> <TerminalText tone="bold">78%</TerminalText>
            <TerminalText tone="faint">   target ≥ 70%</TerminalText>
          </TerminalLine>
          <TerminalLine>
            {"  below     "}
            <TerminalBar value={0.02} tone="error" /> <TerminalText tone="bold"> 2%</TerminalText>
            <TerminalText tone="faint">   {"< 3.9 mmol/L"}</TerminalText>
          </TerminalLine>
          <TerminalLine>
            {"  above     "}
            <TerminalBar value={0.2} tone="warn" /> <TerminalText tone="bold">20%</TerminalText>
            <TerminalText tone="faint">   {"> 10.0 mmol/L"}</TerminalText>
          </TerminalLine>
          <TerminalLine />
          <TerminalLine>
            <TerminalText tone="ok">✓</TerminalText> time in range above target
          </TerminalLine>
          <TerminalLine>
            <TerminalRule value={1} state="done" /> <TerminalText tone="muted">moved 8 files · 2.2s</TerminalText>
          </TerminalLine>
          <TerminalLine>
            <TerminalRule state="error" /> <TerminalText tone="error">error</TerminalText>{" "}
            <TerminalText tone="muted">· LibreLinkUp returned 429 (rate limited)</TerminalText>
          </TerminalLine>
        </Terminal>
      </WindowBody>
    </Window>
  )
}

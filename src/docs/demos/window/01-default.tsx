import { Window, WindowBar, WindowBody, WindowTitle } from "@/components/ui/window"

export default function WindowDefault() {
  return (
    <Window className="max-w-md">
      <WindowBar>
        <WindowTitle center>Downloads</WindowTitle>
      </WindowBar>
      <WindowBody className="p-6">
        <p className="text-sm text-muted-foreground">3 downloads finished. 1 is still running.</p>
      </WindowBody>
    </Window>
  )
}

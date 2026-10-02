import { ArrowRightIcon, DownloadIcon, MailIcon, SettingsIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

export default function ButtonWithIcon() {
  return (
    <>
      <Button>
        <MailIcon data-icon="inline-start" />
        Send invite
      </Button>
      <Button variant="outline">
        <DownloadIcon data-icon="inline-start" />
        Export CSV
      </Button>
      <Button variant="ghost">
        Continue
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Settings">
        <SettingsIcon />
      </Button>
      <Button variant="secondary">
        Save
        <Kbd data-icon="inline-end">⌘S</Kbd>
      </Button>
    </>
  )
}

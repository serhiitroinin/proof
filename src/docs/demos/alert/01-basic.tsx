import { InfoIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AlertBasic() {
  return (
    <Alert className="max-w-md">
      <InfoIcon />
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription>Exports pause on Sunday between 02:00 and 03:00 CET. Everything else keeps running.</AlertDescription>
    </Alert>
  )
}

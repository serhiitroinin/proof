import { CircleCheckIcon } from "lucide-react"

import { Alert, AlertTitle } from "@/components/ui/alert"

export default function AlertTitleOnly() {
  return (
    <Alert variant="success" className="max-w-md">
      <CircleCheckIcon />
      <AlertTitle>All 128 tests passed in 42 s.</AlertTitle>
    </Alert>
  )
}

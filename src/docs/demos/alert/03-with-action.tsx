import { TriangleAlertIcon } from "lucide-react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function AlertWithAction() {
  return (
    <Alert variant="warning" className="max-w-md">
      <TriangleAlertIcon />
      <AlertTitle>Unsaved changes</AlertTitle>
      <AlertDescription>Three fields changed since the last save.</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">
          Save
        </Button>
      </AlertAction>
    </Alert>
  )
}

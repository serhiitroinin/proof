import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AlertVariants() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>New version available</AlertTitle>
        <AlertDescription>Reload to pick up 2.14. Your unsaved changes are kept.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleCheckIcon />
        <AlertTitle>Domain verified</AlertTitle>
        <AlertDescription>northwind.io now points at this workspace.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Storage at 92%</AlertTitle>
        <AlertDescription>Uploads stop at 100%. Delete old exports or move to the Team plan.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <OctagonXIcon />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>The card ending 4421 was declined. Update it before 14 October to keep the workspace.</AlertDescription>
      </Alert>
    </div>
  )
}

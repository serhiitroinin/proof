import { Progress, ProgressLabel } from "@/components/ui/progress"

export default function ProgressIndeterminate() {
  return (
    <Progress value={null} className="max-w-sm">
      <ProgressLabel>Waiting for the build server</ProgressLabel>
    </Progress>
  )
}

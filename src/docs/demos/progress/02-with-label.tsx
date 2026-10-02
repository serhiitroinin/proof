import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"

export default function ProgressWithLabel() {
  return (
    <Progress value={38} className="max-w-sm">
      <ProgressLabel>Uploading 12 files</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
}

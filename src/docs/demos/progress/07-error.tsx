import { Progress, ProgressLabel } from "@/components/ui/progress"

export default function ProgressError() {
  return (
    <Progress value={58} error className="max-w-sm">
      <ProgressLabel>Lost access to ~/Downloads</ProgressLabel>
    </Progress>
  )
}

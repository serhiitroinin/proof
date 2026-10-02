import { Progress } from "@/components/ui/progress"

export default function ProgressBar() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress variant="bar" value={62} />
      <Progress variant="tool" value={62} />
    </div>
  )
}
